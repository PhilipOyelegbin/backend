require("dotenv").config();
const express = require("express");
const { swaggerUi, specs } = require("./swagger");
const sequelize = require("./connection");
const path = require("path");
const { syncDatabase } = require("./model");

const app = express();
app.set("view engine", "ejs");
app.use(express.json()); // Ensure JSON middleware is applied first
app.use("/public", express.static(path.join(__dirname, "public")));

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/category");
const cartRoutes = require("./routes/carts");
const paymentRoutes = require("./routes/payment");

// Use routes
app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api", paymentRoutes);

// Swagger setup
app.use("/", swaggerUi.serve, swaggerUi.setup(specs));

// Endpoint to handle the client-side routing
app.get("/feedback", (req, res) => {
  res.status(201).render("feedback");
});

// Start server
syncDatabase();

const port = process.env.PORT;
app.listen(port, async () => {
  console.log("Server listening on port", port);
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
