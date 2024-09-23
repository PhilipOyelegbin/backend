const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connection");

class Exercise extends Model { }

Exercise.init(
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
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    muscleGroup: {
      type: DataTypes.STRING,
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: "exercises",
    timestamps: true,
  }
);

module.exports = Exercise;
