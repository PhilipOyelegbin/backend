const { Router } = require("express");
const { authenticated, authorized } = require("../handler");
const WorkoutPlanController = require("../controller/workoutPlan.controller");

const router = Router();

router.get("/api/workouts/plan", authenticated, async (req, res) => {
  /*
    #swagger.tags = ['Workout Plan']
    #swagger.security = [{"bearerAuth": []}]
  */
  try {
    const workout = await WorkoutPlanController.getAllWorkoutPlans();
    res
      .status(200)
      .json({ message: "All workout received successfully", workout });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/workouts/plan", authenticated, async (req, res) => {
  /*
    #swagger.tags = ['Workout Plan']
    #swagger.security = [{"bearerAuth": []}]
  */
  const { name, description, userId } = req.body;
  if (!name || !description || !userId) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  try {
    const workout = await WorkoutPlanController.createWorkoutPlan({
      name,
      description,
      userId,
    });
    res.status(201).json({ message: "Workout created successfully", workout });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/api/workouts/plan/:id", authenticated, async (req, res) => {
  /*
    #swagger.tags = ['Workout Plan']
    #swagger.security = [{"bearerAuth": []}]
  */
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  try {
    const workout = await WorkoutPlanController.getWorkoutPlanById(id);
    if (workout.length <= 0) {
      res.status(404).json({ error: "workout not found" });
    } else {
      res.status(200).json({ message: "workout gotten successfully", workout });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/api/workouts/plan/:id", authenticated, async (req, res) => {
  /*
    #swagger.tags = ['Workout Plan']
    #swagger.security = [{"bearerAuth": []}]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'User data.',
      required: false,
      schema: {
        name: "string",
        description: "string",
        userId: 0
      }
    }
  */
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  const data = req.body;
  try {
    const workout = await WorkoutPlanController.updateWorkoutPlan(id, data);
    if (workout) {
      res
        .status(201)
        .json({ message: "Workout updated successfully", workout });
    } else {
      res.status(404).json({ error: "Workout not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/api/workouts/plan/:id", authenticated, async (req, res) => {
  /*
    #swagger.tags = ['Workout Plan']
    #swagger.security = [{"bearerAuth": []}]
  */
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  try {
    const workout = await WorkoutPlanController.deleteWorkoutPlan(id);
    if (workout) {
      res.status(200).json({ message: "Workout deleted successfully" });
    } else {
      res.status(404).json({ error: "Workout not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
