import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import languageTool from "languagetool-api";
import showdown from "showdown";

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadFolder = path.join(__dirname, "uploads");
const notesFolder = path.join(__dirname, "notes");

// Ensure the upload folder exists
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
const databaseFile = "./database.json";

// Load database from JSON file
let database = [];

// Check if the database file exists
if (fs.existsSync(databaseFile)) {
  try {
    const data = fs.readFileSync(databaseFile, "utf-8");
    database = JSON.parse(data);
  } catch (error) {
    console.error("Error reading the database file:", error);
  }
} else {
  console.log("No database file found, creating a new one.");
  // Initialize an empty database and save it to the file
  fs.writeFileSync(databaseFile, JSON.stringify(database, null, 2));
}

// Save database to JSON file
function saveDatabase() {
  try {
    fs.writeFileSync(databaseFile, JSON.stringify(database, null, 2));
  } catch (error) {
    console.error("Error saving the database file:", error);
  }
}

const app = express();
app.set("view engine", "ejs");
app.use("/public", express.static(path.join(__dirname, "public")));

// Upload note API
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send({ message: "No file provided" });
    }

    const markdownContent = fs.readFileSync(file.path, "utf-8");

    const filename = file.originalname;
    const noteId = Date.now().toString();
    const notePath = path.join(notesFolder, `${noteId}.md`);

    // Save note to local folder
    fs.writeFileSync(notePath, markdownContent);

    // Add note to database
    database.push({
      id: noteId,
      filename,
      filepath: file.path,
    });
    saveDatabase();

    return res
      .status(201)
      .json({ message: "File uploaded successfully", noteId });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error uploading file", error });
  }
});

// Get all notes API
app.get("/api/notes", async (req, res) => {
  try {
    const notes = database;
    return res
      .status(200)
      .json({ message: "Notes fetched successfully", notes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching notes", error });
  }
});

// Get a single note API
app.get("/api/notes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const note = database.filter((note) => note.id === id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    return res.status(200).json({ message: "Note fetched successfully", note });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching note", error });
  }
});

// Check grammar of a note by ID and render text
app.get("/api/check-grammar/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const filterNote = database.find((note) => note.id === id);

    if (!filterNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    const filePath = filterNote.filepath;
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Check grammar using LanguageTool API
    var params = {
      language: "en-US", // This is required! You can get list of language codes with languagetool.codes
      text: fileContent, // This is required too!
    };
    languageTool.check(params, (err, result) => {
      if (err) {
        console.log("error", err);
        return res
          .status(500)
          .json({ message: "Error checking grammar", error: err });
      } else {
        const correctedText = result.matches.reduce((text, match) => {
          return text.replace(match.context.text, match.replacements[0].value);
        }, fileContent);

        fs.writeFileSync(filePath, correctedText, "utf-8");
        return res.status(200).send(correctedText);
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error processing file", error });
  }
});

// Render markdown note as HMTL by ID
app.get("/api/render-note/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const filterNote = database.find((note) => note.id === id);

    if (!filterNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    const filePath = filterNote.filepath;
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Convert Markdown to HTML
    const converter = new showdown.Converter();
    const htmlContent = converter.makeHtml(fileContent);

    return res.status(200).send(htmlContent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error processing file", error });
  }
});

// Serve the frontend
app.get("/", (req, res) => {
  res.render("index");
});

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});
