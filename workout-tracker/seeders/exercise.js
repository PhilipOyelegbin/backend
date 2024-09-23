const { Exercise, WorkoutPlan, WorkoutExercise, ScheduledWorkout } = require("../model");


class ExerciseSeeder {
    async seedExercises() {
        const exercises = [
            { name: "Bench Press", description: "A classic upper body exercise", category: "strength", muscleGroup: "chest" },
            { name: "Squats", description: "A compound exercise for legs", category: "strength", muscleGroup: "legs" },
            { name: "Jumping Jacks", description: "A cardio exercise for warm-up", category: "cardio", muscleGroup: null },
            { name: "Deadlifts", description: "A compound exercise for overall strength", category: "strength", muscleGroup: "back" },
            { name: "Bicep Curls", description: "An isolation exercise for biceps", category: "strength", muscleGroup: "biceps" },
            { name: "Tricep Dips", description: "An isolation exercise for triceps", category: "strength", muscleGroup: "triceps" },
            { name: "Push-ups", description: "A bodyweight exercise for chest and triceps", category: "strength", muscleGroup: "chest" },
            { name: "Lunges", description: "A compound exercise for legs", category: "strength", muscleGroup: "legs" },
            { name: "Planks", description: "A core exercise for stability and strength", category: "strength", muscleGroup: "core" },
            { name: "Rowing Machine", description: "A cardio exercise for cardiovascular fitness", category: "cardio", muscleGroup: null },
            { name: "Shoulder Press", description: "A compound exercise for shoulders", category: "strength", muscleGroup: "shoulders" },
            { name: "Leg Press", description: "A compound exercise for legs", category: "strength", muscleGroup: "legs" },
            { name: "Chest Flys", description: "An isolation exercise for chest", category: "strength", muscleGroup: "chest" },
            { name: "Russian Twists", description: "A core exercise for obliques", category: "strength", muscleGroup: "core" },
            { name: "Burpees", description: "A full-body exercise for strength and cardio", category: "strength", muscleGroup: "full-body" },
            { name: "Mountain Climbers", description: "A cardio exercise for cardiovascular fitness", category: "cardio", muscleGroup: null },
            { name: "Lat Pulldowns", description: "An isolation exercise for back", category: "strength", muscleGroup: "back" },
            { name: "Calf Raises", description: "An isolation exercise for calves", category: "strength", muscleGroup: "calves" },
            { name: "Kettlebell Swings", description: "A full-body exercise for strength and cardio", category: "strength", muscleGroup: "full-body" },
            { name: "Box Jumps", description: "A plyometric exercise for legs and power", category: "strength", muscleGroup: "legs" }
        ];

        for (const exercise of exercises) {
            await Exercise.create(exercise);
        }

        // // Create a sample workout plan
        // const workoutPlan = await WorkoutPlan.create({ name: "Sample Workout Plan", description: "A sample workout plan" });

        // // Create sample workout exercises
        // const workoutExercises = [
        //     { exerciseId: 1, workoutPlanId: 1, sets: 3, reps: 10, weight: 50 },
        //     { exerciseId: 2, workoutPlanId: 1, sets: 3, reps: 12, weight: 60 },
        //     { exerciseId: 3, workoutPlanId: 1, sets: 3, reps: 15, weight: null }
        // ];

        // for (const workoutExercise of workoutExercises) {
        //     await WorkoutExercise.create(workoutExercise);
        // }

        // // Create a sample scheduled workout
        // const scheduledWorkout = await ScheduledWorkout.create({ workoutPlanId: 1, date: new Date('2023-03-01'), time: '09:00:00' });
    }

    async run() {
        await this.seedExercises();
    }
}

module.exports = ExerciseSeeder;