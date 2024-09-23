const { WorkoutExercise } = require("../model");

async function getAllWorkouts() {
  try {
    const workouts = await WorkoutExercise.findAll();
    return workouts;
  } catch (error) {
    throw error;
  }
}

async function getWorkoutById(id) {
  try {
    const workout = await WorkoutExercise.findByPk(id);
    if (!workout) {
      throw new Error("Workout not found");
    } else {
      return workout;
    }
  } catch (error) {
    throw error;
  }
}

async function createWorkout(newWorkout) {
  try {
    const workout = await WorkoutExercise.create(newWorkout);
    return workout;
  } catch (error) {
    throw error;
  }
}

async function updateWorkout(id, data) {
  try {
    const workout = await WorkoutExercise.findByPk(id);
    if (!workout) {
      throw new Error("Workout not found");
    } else {
      await workout.update(data);
      return workout;
    }
  } catch (error) {
    throw error;
  }
}

async function deleteWorkout(id) {
  try {
    const workout = await WorkoutExercise.findByPk(id);
    if (!workout) {
      throw new Error("Workout not found");
    } else {
      await workout.destroy();
      return true;
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
};
