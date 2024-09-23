const { Router } = require("express");
const { authenticated } = require("../handler");
const ScheduledWorkoutController = require("../controller/scheduledWorkout.controller");

const router = Router();

router.get("/api/workouts/schedule", authenticated, async (req, res) => {
  /*
    #swagger.tags = ['Schedule']
    #swagger.security = [{"bearerAuth": []}]
  */
  try {
    const schedule = await ScheduledWorkoutController.getAllScheduledWorkouts();
    res
      .status(200)
      .json({ message: "All schedule received successfully", schedule });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/workouts/schedule", authenticated, async (req, res) => {
  /*
    #swagger.tags = ['Schedule']
    #swagger.security = [{"bearerAuth": []}]
  */
  const { workoutPlanId, date, time } = req.body;
  if (!workoutPlanId || date || time) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    const schedule = await ScheduledWorkoutController.createScheduledWorkout({
      workoutPlanId,
      date,
      time,
    });
    res
      .status(201)
      .json({ message: "Schedule created successfully", schedule });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/api/workouts/schedule/:id", authenticated, async (req, res) => {
  /*
    #swagger.tags = ['Schedule']
    #swagger.security = [{"bearerAuth": []}]
  */
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  try {
    const schedule = await ScheduledWorkoutController.getScheduledWorkoutById(
      id
    );
    if (schedule.length >= 0) {
      res
        .status(200)
        .json({ message: "Schedule retrived successfully", schedule });
    } else {
      res.status(404).json({ error: "Schedule not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/api/workouts/schedule/:id", authenticated, async (req, res) => {
  /*
    #swagger.tags = ['Schedule']
    #swagger.security = [{"bearerAuth": []}]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'User data.',
      required: false,
      schema: {
        workoutPlanId: 0,
        date: "timestamp",
        time: "time"
      }
    }
  */
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  const data = req.body;
  try {
    const schedule = await ScheduledWorkoutController.updateScheduledWorkout(
      id,
      data
    );
    if (schedule) {
      res
        .status(201)
        .json({ message: "Schedule updated successfully", schedule });
    } else {
      res.status(404).json({ error: "Schedule not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/api/workouts/schedule/:id", authenticated, async (req, res) => {
  /*
    #swagger.tags = ['Schedule']
    #swagger.security = [{"bearerAuth": []}]
  */
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  try {
    const schedule = await ScheduledWorkoutController.deleteScheduledWorkout(
      id
    );
    if (schedule) {
      res.status(201).json({ message: "Schedule deleted" });
    } else {
      res.status(404).json({ error: "Schedule not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
