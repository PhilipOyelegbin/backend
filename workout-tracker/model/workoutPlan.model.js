const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connection");

class WorkoutPlan extends Model { }

WorkoutPlan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      foreignKey: true,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "workout_plans",
    timestamps: true,
  }
);

module.exports = WorkoutPlan;
