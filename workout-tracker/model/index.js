const sequelize = require("../connection");

const WorkoutPlan = require("./workoutPlan.model");
const WorkoutExercise = require("./workoutExercsie.model");
const Exercise = require("./exercise.model");
const User = require("./user.model");
const ScheduledWorkout = require("./scheduledWorkout.model");

Exercise.hasMany(WorkoutExercise, { foreignKey: "exerciseId" });
WorkoutPlan.hasMany(WorkoutExercise, { foreignKey: "workoutPlanId" });
WorkoutPlan.hasMany(ScheduledWorkout, { foreignKey: "workoutPlanId" });

// Sync models with the database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("All tables created or already exist");
  } catch (err) {
    console.error(`Error syncing models: ${err}`);
  }
};

// Export models and sync function
module.exports = {
  User,
  Exercise,
  WorkoutPlan,
  WorkoutExercise,
  ScheduledWorkout,
  syncDatabase,
};
