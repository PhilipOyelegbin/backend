const { WorkoutPlan } = require("../model");

async function getAllWorkoutPlans() {
  try {
    const workoutPlans = await WorkoutPlan.findAll();
    return workoutPlans;
  } catch (error) {
    throw error;
  }
}

async function getWorkoutPlanById(id) {
  try {
    const workoutPlan = await WorkoutPlan.findByPk(id);
    if (!workoutPlan) {
      throw new Error("Workout plan not found");
    } else {
      return workoutPlan;
    }
  } catch (error) {
    throw error;
  }
}

async function createWorkoutPlan(newPlan) {
  try {
    const workoutPlan = await WorkoutPlan.create(newPlan);
    return workoutPlan;
  } catch (error) {
    throw error
  }
}

async function updateWorkoutPlan(id, data) {
  try {
    const workoutPlan = await WorkoutPlan.findByPk(id);
    if (!workoutPlan) {
      throw new Error("Workout plan not found");
    } else {
      await workoutPlan.update(data);
      return workoutPlan
    }
  } catch (error) {
    throw error
  }
}

async function deleteWorkoutPlan(id) {
  try {
    const workoutPlan = await WorkoutPlan.findByPk(id);
    if (!workoutPlan) {
      throw new Error("Workout plan not found");
    } else {
      await workoutPlan.destroy();
      return true
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  getAllWorkoutPlans,
  getWorkoutPlanById,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
};
