import React from "react";
import StudentDashboard from "../components/StudentDashboard";
import StudyPlanner from "../components/StudyPlanner";

export default function Dashboard() {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <StudentDashboard />
      <StudyPlanner />
    </div>
  );
}
