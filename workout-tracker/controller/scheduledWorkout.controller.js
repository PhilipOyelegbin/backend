const { ScheduledWorkout } = require("../model");

async function getAllScheduledWorkouts() {
  try {
    const scheduledWorkouts = await ScheduledWorkout.findAll();
    return scheduledWorkouts;
  } catch (error) {
    throw error;
  }
}

async function getScheduledWorkoutById(id) {
  try {
    const scheduledWorkout = await ScheduledWorkout.findByPk(id);
    if (!scheduledWorkout) {
      throw new Error("Scheduled workout not found");
    } else {
      return scheduledWorkout;
    }
  } catch (error) {
    throw error;
  }
}

async function createScheduledWorkout(newSchedule) {
  try {
    const scheduledWorkout = await ScheduledWorkout.create(newSchedule);
    return scheduledWorkout;
  } catch (error) {
    throw error;
  }
}

async function updateScheduledWorkout(id, data) {
  try {
    const scheduledWorkout = await ScheduledWorkout.findByPk(id);
    if (!scheduledWorkout) {
      throw new Error("Scheduled workout not found");
    } else {
      await scheduledWorkout.update(data);
      return scheduledWorkout;
    }
  } catch (error) {
    throw error;
  }
}

async function deleteScheduledWorkout(id) {
  try {
    const scheduledWorkout = await ScheduledWorkout.findByPk(id);
    if (!scheduledWorkout) {
      throw new Error("Scheduled workout not found");
    } else {
      await scheduledWorkout.destroy();
      return true;
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllScheduledWorkouts,
  getScheduledWorkoutById,
  createScheduledWorkout,
  updateScheduledWorkout,
  deleteScheduledWorkout,
};
