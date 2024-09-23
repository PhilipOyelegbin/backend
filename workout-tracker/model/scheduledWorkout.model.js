const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connection");

class ScheduledWorkout extends Model { }

ScheduledWorkout.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "scheduled_workout",
        timestamps: true,
    }
);

module.exports = ScheduledWorkout;
