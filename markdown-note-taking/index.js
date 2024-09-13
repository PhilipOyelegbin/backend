import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import showdown from "showdown";
import dotenv from "dotenv";

dotenv.config();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadFolder = path.join(__dirname, "uploads");

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

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

// Upload note API
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send({ message: "No file provided" });
    }

    const filename = file.originalname;
    const noteId = Date.now().toString();

    // Add note to database
    database.push({
      id: noteId,
      filename,
      filepath: file.path,
    });
    saveDatabase();

    return res.status(201).render("feedback", {
      message: "File uploaded successfully",
      noteId,
    });
  } catch (error) {
    return res.status(500).render("error", {
      message: "Error uploading file",
      error,
    });
    // return res.status(500).json({ message: "Error uploading file", error });
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
    return res.status(500).render("error", {
      message: "Error fetching notes",
      error,
    });
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
    return res.status(500).render("error", {
      message: "Error fetching note",
      error,
    });
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
    const params = new URLSearchParams();
    params.append("language", "en-US");
    params.append("text", fileContent);

    const response = await fetch("https://api.languagetool.org/v2/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    const correctedText = data.matches.reduce((text, match) => {
      return text.replace(match.context.text, match.replacements[0].value);
    }, fileContent);

    fs.writeFileSync(filePath, correctedText, "utf-8");
    return res.status(200).send(correctedText);
  } catch (error) {
    return res.status(500).render("error", {
      message: "Error processing file",
      error,
    });
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
    return res.status(500).render("error", {
      message: "Error processing file",
      error,
    });
  }
});

// Delete a markdown note by ID
app.delete("/api/notes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const noteIndex = database.findIndex((note) => note.id === id);

    if (noteIndex !== -1) {
      const note = database[noteIndex];
      const filePath = note.filepath;

      // Delete the file from the upload folder
      fs.unlink(filePath, (err) => {
        if (err) {
          return next(err); // Pass the error to the error handling middleware
        }

        // Remove the note from the database
        database.splice(noteIndex, 1);
        fs.writeFileSync(databaseFile, JSON.stringify(database, null, 2));

        res.status(200).send({ message: "Note deleted successfully" });
      });
    } else {
      res.status(404).send({ message: "Note not found" });
    }
  } catch (error) {
    return res.status(500).render("error", {
      message: "Unable to delete file",
      error,
    });
  }
});

// Serve the frontend
app.get("/", (req, res) => {
  res.render("index");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
