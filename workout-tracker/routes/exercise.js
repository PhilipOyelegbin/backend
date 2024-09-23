const express = require("express");
const { authenticated, authorized } = require("../handler");
const ExerciseController = require("../controller/exercise.controller");
const router = express.Router();

router.get("/api/exercises", async (req, res) => {
  /*
    #swagger.tags = ['Exercise']
  */
  try {
    const exercise = await ExerciseController.getAllExercises();
    res
      .status(200)
      .json({ message: "All exercise received successfully", exercise });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/api/exercises",
  authenticated,
  authorized("Admin"),
  async (req, res) => {
    /*
      #swagger.tags = ['Exercise']
      #swagger.security = [{"bearerAuth": []}]
    */
    const { name, description, category, muscleGroup } = req.body;
    if (!name || !description || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }
    try {
      const exercise = await ExerciseController.createExercise({
        name,
        description,
        category,
        muscleGroup,
      });
      res
        .status(200)
        .json({ message: "Exercise saved successfully", exercise });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get("/api/exercises/:id", authenticated, async (req, res) => {
  /*
    #swagger.tags = ['Exercise']
    #swagger.security = [{"bearerAuth": []}]
  */
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  try {
    const exercise = await ExerciseController.getExerciseById(id);
    if (exercise.length > 0) {
      res.status(404).json({ error: "Exercise not found" });
    } else {
      res
        .status(200)
        .json({ message: "Exercise gotten successfully", exercise });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/api/exercises/:id", authenticated, async (req, res) => {
  /*
    #swagger.tags = ['Exercise']
    #swagger.security = [{"bearerAuth": []}]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'User data.',
      required: false,
      schema: {
        name: "string",
        description: "string",
        category: "string",
        muscleGroup: "string"
      }
    }
  */
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  const data = req.body;
  try {
    const exercise = await ExerciseController.updateExercise(id, data);
    res;
    if (exercise) {
      res
        .status(201)
        .json({ message: "Exercise updated successfully", exercise });
    } else {
      res.status(404).json({ error: "Exercise not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete(
  "/api/exercises/:id",
  authenticated,
  authorized("Admin"),
  async (req, res) => {
    /*
      #swagger.tags = ['Exercise']
      #swagger.security = [{"bearerAuth": []}]
    */
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
    try {
      const exercise = await ExerciseController.deleteExercise(id);
      if (exercise) {
        res.status(200).json({ message: "Exercise deleted" });
      } else {
        res.status(404).json({ error: "Exercise not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
