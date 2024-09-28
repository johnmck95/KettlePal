import { UserWithWorkoutsQuery } from "../../generated/frontend-types";
import { totalWorkoutWorkCapacity } from "./workouts";

describe("totalWorkoutWorkCapacity", () => {
  let workoutWithExercises: NonNullable<
    NonNullable<UserWithWorkoutsQuery["user"]>["workouts"]
  >[0];

  beforeEach(() => {
    workoutWithExercises = {
      uid: "123",
      comment: "Workout comment",
      elapsedSeconds: 123,
      date: "2024-08-29",
      exercises: [],
    };
  });

  it("correctly calculates work capacity with an empty exercise list", () => {
    const result = totalWorkoutWorkCapacity(workoutWithExercises);
    expect(result).toBe("0 kg");
  });

  it("correctly calculates work capacity with one exercise in kg", () => {
    workoutWithExercises?.exercises?.push({
      uid: "123",
      title: "Test Exercise",
      weight: 24,
      weightUnit: "kg",
      sets: 3,
      reps: 5,
      repsDisplay: "std",
      comment: "Exercise comment",
      elapsedSeconds: 123,
      createdAt: "2024-08-29",
    });
    const result = totalWorkoutWorkCapacity(workoutWithExercises);
    expect(result).toBe("360 kg");
  });

  it("correctly calculates work capacity with one exercise in lb", () => {
    workoutWithExercises?.exercises?.push({
      uid: "123",
      title: "Test Exercise",
      weight: 50,
      weightUnit: "lb",
      sets: 3,
      reps: 5,
      repsDisplay: "std",
      comment: "Exercise comment",
      elapsedSeconds: 123,
      createdAt: "2024-08-29",
    });
    const result = totalWorkoutWorkCapacity(workoutWithExercises);
    expect(result).toBe("750 lb");
  });

  it("correctly calculates work capacity with multiple exercises in kg", () => {
    workoutWithExercises?.exercises?.push({
      uid: "123",
      title: "Test Exercise",
      weight: 24,
      weightUnit: "kg",
      sets: 3,
      reps: 5,
      repsDisplay: "std",
      comment: "Exercise comment",
      elapsedSeconds: 123,
      createdAt: "2024-08-29",
    });
    workoutWithExercises?.exercises?.push({
      uid: "123",
      title: "Test Exercise",
      weight: 32,
      weightUnit: "kg",
      sets: 10,
      reps: 12,
      repsDisplay: "std",
      comment: "Exercise comment",
      elapsedSeconds: 123,
      createdAt: "2024-08-29",
    });
    const result = totalWorkoutWorkCapacity(workoutWithExercises);
    expect(result).toBe("4,200 kg");
  });

  it("correctly calculates work capacity with multiple exercises in lb", () => {
    workoutWithExercises?.exercises?.push({
      uid: "123",
      title: "Test Exercise",
      weight: 30,
      weightUnit: "lb",
      sets: 2,
      reps: 12,
      repsDisplay: "std",
      comment: "Exercise comment",
      elapsedSeconds: 123,
      createdAt: "2024-08-29",
    });
    workoutWithExercises?.exercises?.push({
      uid: "123",
      title: "Test Exercise",
      weight: 55,
      weightUnit: "lb",
      sets: 10,
      reps: 10,
      repsDisplay: "std",
      comment: "Exercise comment",
      elapsedSeconds: 123,
      createdAt: "2024-08-29",
    });
    const result = totalWorkoutWorkCapacity(workoutWithExercises);
    expect(result).toBe("6,220 lb");
  });

  it("correctly calculates work capacity with one exercise in kg and one in lb", () => {
    workoutWithExercises?.exercises?.push({
      uid: "123",
      title: "Test Exercise",
      weight: 30,
      weightUnit: "lb",
      sets: 6,
      reps: 12,
      repsDisplay: "std",
      comment: "Exercise comment",
      elapsedSeconds: 123,
      createdAt: "2024-08-29",
    });
    workoutWithExercises?.exercises?.push({
      uid: "123",
      title: "Test Exercise",
      weight: 28,
      weightUnit: "kg",
      sets: 10,
      reps: 10,
      repsDisplay: "std",
      comment: "Exercise comment",
      elapsedSeconds: 123,
      createdAt: "2024-08-29",
    });
    const result = totalWorkoutWorkCapacity(workoutWithExercises);
    expect(result).toBe("3,780 kg");
  });

  it("correctly calculates work capacity when there are more exercises in lb than kg", () => {
    workoutWithExercises?.exercises?.push({
      uid: "123",
      title: "Test Exercise",
      weight: 30,
      weightUnit: "lb",
      sets: 6,
      reps: 12,
      repsDisplay: "std",
      comment: "Exercise comment",
      elapsedSeconds: 123,
      createdAt: "2024-08-29",
    });
    workoutWithExercises?.exercises?.push({
      uid: "123",
      title: "Test Exercise",
      weight: 80,
      weightUnit: "lb",
      sets: 5,
      reps: 5,
      repsDisplay: "std",
      comment: "Exercise comment",
      elapsedSeconds: 123,
      createdAt: "2024-08-29",
    });
    workoutWithExercises?.exercises?.push({
      uid: "123",
      title: "Test Exercise",
      weight: 28,
      weightUnit: "kg",
      sets: 10,
      reps: 10,
      repsDisplay: "std",
      comment: "Exercise comment",
      elapsedSeconds: 123,
      createdAt: "2024-08-29",
    });
    const result = totalWorkoutWorkCapacity(workoutWithExercises);
    expect(result).toBe("10,333 lb");
  });

  it("correctly calculates work capacity when there are more exercises in kg than lb", () => {
    workoutWithExercises?.exercises?.push({
      uid: "123",
      title: "Test Exercise",
      weight: 30,
      weightUnit: "lb",
      sets: 6,
      reps: 12,
      repsDisplay: "std",
      comment: "Exercise comment",
      elapsedSeconds: 123,
      createdAt: "2024-08-29",
    });
    workoutWithExercises?.exercises?.push({
      uid: "123",
      title: "Test Exercise",
      weight: 32,
      weightUnit: "kg",
      sets: 5,
      reps: 5,
      repsDisplay: "std",
      comment: "Exercise comment",
      elapsedSeconds: 123,
      createdAt: "2024-08-29",
    });
    workoutWithExercises?.exercises?.push({
      uid: "123",
      title: "Test Exercise",
      weight: 28,
      weightUnit: "kg",
      sets: 10,
      reps: 10,
      repsDisplay: "std",
      comment: "Exercise comment",
      elapsedSeconds: 123,
      createdAt: "2024-08-29",
    });
    const result = totalWorkoutWorkCapacity(workoutWithExercises);
    expect(result).toBe("4,580 kg");
  });
});
