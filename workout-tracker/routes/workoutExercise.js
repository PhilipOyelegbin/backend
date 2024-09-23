const { Router } = require("express");
const { authenticated, authorized } = require("../handler");
const WorkoutExerciseController = require("../controller/workoutExercise.controller");

const router = Router();

router.get("/api/workouts/exercise", authenticated, async (req, res) => {
  /*
    #swagger.tags = ['Workout Exercise']
    #swagger.security = [{"bearerAuth": []}]
  */
  try {
    const workout = await WorkoutExerciseController.getAllWorkouts();
    res
      .status(200)
      .json({ message: "All workout received successfully", workout });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/workouts/exercise", authenticated, async (req, res) => {
  /*
    #swagger.tags = ['Workout Exercise']
    #swagger.security = [{"bearerAuth": []}]
  */
  const { exerciseId, woroutPlanId, sets, reps, weight } = req.body;
  if (exerciseId || woroutPlanId || sets || reps) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  try {
    const workout = await WorkoutExerciseController.createWorkout({
      exerciseId,
      woroutPlanId,
      sets,
      reps,
      weight,
    });
    res.status(201).json({ message: "workout created successfully", workout });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/api/workouts/exercise/:id", authenticated, async (req, res) => {
  /*
    #swagger.tags = ['Workout Exercise']
    #swagger.security = [{"bearerAuth": []}]
  */
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  try {
    const workout = await WorkoutExerciseController.getWorkoutById(id);
    if (workout.length <= 0) {
      res.status(404).json({ error: "Workout not found" });
    } else {
      res.status(200).json({ message: "Workout gotten successfully", workout });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/api/workouts/exercise/:id", authenticated, async (req, res) => {
  /*
    #swagger.tags = ['Workout Exercise']
    #swagger.security = [{"bearerAuth": []}]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'User data.',
      required: false,
      schema: {
        exerciseId: 0,
        workoutPlanId: 0,
        sets: 0,
        reps: 0,
        weight: 0
      }
    }
  */
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  const data = req.body;
  try {
    const workout = await WorkoutExerciseController.updateWorkout(id, data);
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

router.delete("/api/workouts/exercise/:id", authenticated, async (req, res) => {
  /*
    #swagger.tags = ['Workout Exercise']
    #swagger.security = [{"bearerAuth": []}]
  */
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  try {
    const workout = await WorkoutExerciseController.deleteWorkout(id);
    if (workout) {
      res.status(200).json({ message: "Workout deleted successfully" });
    } else {
      res.status(400).json({ error: "Workout not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
