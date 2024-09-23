const { Exercise } = require("../model");

async function getAllExercises() {
  try {
    const exercises = await Exercise.findAll();
    return exercises;
  } catch (error) {
    throw error;
  }
}

async function getExerciseById(id) {
  try {
    const exercise = await Exercise.findByPk(id);
    if (!exercise) {
      throw new Error("Exercise not found");
    } else {
      return exercise;
    }
  } catch (error) {
    throw error;
  }
}

async function createExercise(newExercise) {
  try {
    const exercise = await Exercise.create(newExercise);
    return exercise;
  } catch (error) {
    throw error;
  }
}

async function updateExercise(id, data) {
  try {
    const exercise = await Exercise.findByPk(id);
    if (!exercise) {
      throw new Error("Exercise not found");
    } else {
      await exercise.update(data);
      return exercise;
    }
  } catch (error) {
    throw error;
  }
}

async function deleteExercise(id) {
  try {
    const exercise = await Exercise.findByPk(id);
    if (!exercise) {
      throw new Error("Exercise not found");
    } else {
      await exercise.destroy();
      return true;
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
};
