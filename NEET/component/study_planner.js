import React, { useState } from "react";
import axios from "axios";

const StudyPlanner = () => {
  const [days, setDays] = useState(7);
  const [plan, setPlan] = useState([]);

  const handleGenerate = async () => {
    const response = await axios.post("http://localhost:8000/generate-plan", {
      name: "John",
      strengths: ["Kinematics", "Mole Concept"],
      weaknesses: ["Laws of Motion", "Genetics"],
      days_available: days,
    });
    setPlan(response.data.plan);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2">Personalized Study Plan</h2>
      <div className="flex gap-4 mb-4">
        <input
          type="number"
          className="border rounded p-2"
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
        />
        <button
          onClick={handleGenerate}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Generate Plan
        </button>
      </div>

      {plan.length > 0 && (
        <div className="space-y-4">
          {plan.map((day) => (
            <div key={day.day} className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">Day {day.day}</h3>
              <ul className="list-disc pl-5">
                {day.tasks.map((task, i) => (
                  <li key={i}>
                    {task.subject}: {task.topic}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyPlanner;
