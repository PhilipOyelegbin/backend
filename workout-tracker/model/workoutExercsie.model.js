const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connection");

class WorkoutExercise extends Model { }

WorkoutExercise.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    exerciseId: {
      type: DataTypes.INTEGER,
      foreignKey: true,
      allowNull: false,
      references: {
        model: "exercises",
        key: "id",
      },
    },
    workoutPlanId: {
      type: DataTypes.INTEGER,
      foreignKey: true,
      allowNull: false,
      references: {
        model: "workout_plans",
        key: "id",
      },
    },
    sets: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reps: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "workout_exercise",
    timestamps: true,
  }
);

module.exports = WorkoutExercise;
