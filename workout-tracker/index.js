require("dotenv").config();
const express = require("express");
const sequelize = require("./connection");
const { syncDatabase, Exercise } = require("./model");
const ExerciseSeeder = require("./seeders/exercise");
const swaggerAutogen = require("swagger-autogen")();
const swaggerUi = require("swagger-ui-express");
const swaggerdocs = require("./swagger-output.json");

const app = express();
app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const exerciseRoutes = require("./routes/exercise");
const workoutPlanRoutes = require("./routes/workoutPlan");
const workoutExerciseRoutes = require("./routes/workoutExercise");
const scheduledWorkout = require("./routes/scheduledWorkout");

// Use routes
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", exerciseRoutes);
app.use("/", workoutExerciseRoutes);
app.use("/", workoutPlanRoutes);
app.use("/", scheduledWorkout);

// Swagger setup
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerdocs));

// Start server
syncDatabase();

// populate the databse with exercise data
Exercise.count()
  .then((count) => {
    if (count === 0) {
      const seeder = new ExerciseSeeder();
      seeder
        .run()
        .then(() => {
          console.log("Exercises seeded successfully!");
        })
        .catch((err) => {
          console.error("Error seeding exercises:", err);
        });
    } else {
      console.log("Exercises already seeded, skipping...");
    }
  })
  .catch((err) => {
    console.error("Error checking exercise count:", err);
  });

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
