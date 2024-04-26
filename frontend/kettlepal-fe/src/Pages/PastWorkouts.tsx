import React from "react";
import { useUser } from "../Contexts/UserContext";

export default function PastWorkouts() {
  const user = useUser();

  return <div>Past Workouts</div>;
}
