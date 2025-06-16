import React, { useState } from "react";
import { getUserGoals, saveGoal } from '../api/goalsAPI.jsx';

// Step 0: Category
const categories = [
  { key: "race", label: "Race", desc: "Personalized plan for your next big event.", icon: "🏁" },
  { key: "distance", label: "Run a specific distance", desc: "Pick any distance, from 5k to ultramarathon.", icon: "🏔️" }
];
const distances = ["5K", "10K", "Half Marathon", "Full Marathon", "Ultra Marathon"];
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function TrainingPlanWizard({ onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    category: "",
    distance: "",
    targetTime: "",
    days: [],
    weeklyKm: "",
  });

  // Step 0: Category selection
  if (step === 0) {
    return (
      <div className="wizard-card">
        <h2>Choose Your Adventure</h2>
        <p>What inspires you most right now?</p>
        {categories.map(opt => (
          <div key={opt.key} className="wizard-option" onClick={() => { setData(d => ({ ...d, category: opt.key })); setStep(1); }}>
            <span style={{ fontSize: 32 }}>{opt.icon}</span>
            <div>
              <div style={{ color: "#ff7c4f", fontWeight: 600 }}>{opt.label}</div>
              <div style={{ color: "#888" }}>{opt.desc}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Step 1: Distance
  if (step === 1) {
    return (
      <div className="wizard-card">
        <h2>Select Your Distance</h2>
        <div className="wizard-options-list">
          {distances.map(d => (
            <button key={d} onClick={() => { setData(dt => ({ ...dt, distance: d })); setStep(2); }}>
              {d}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Step 2: Target Time (reuse your GoalSurvey logic)
  if (step === 2) {
    return (
      <div className="wizard-card">
        <h2>Your Target Time</h2>
        <p>What is your goal time for this distance? (HH:MM:SS or MM:SS)</p>
        <input
          type="text"
          value={data.targetTime}
          placeholder="e.g. 00:45:00"
          onChange={e => setData(dt => ({ ...dt, targetTime: e.target.value }))}
        />
        <small style={{ color: "#888" }}>Format: HH:MM:SS or MM:SS</small>
        <br />
        <button
          disabled={!/^(\d{2}:)?\d{2}:\d{2}$/.test(data.targetTime)}
          onClick={() => setStep(3)}
        >Next</button>
      </div>
    );
  }

  // Step 3: Preferred Days
  if (step === 3) {
    return (
      <div className="wizard-card">
        <h2>Which days do you want to run?</h2>
        <div className="days-select">
          {daysOfWeek.map(day => (
            <label key={day} style={{ marginRight: 16 }}>
              <input
                type="checkbox"
                checked={data.days.includes(day)}
                onChange={e => {
                  setData(dt => ({
                    ...dt,
                    days: e.target.checked
                      ? [...dt.days, day]
                      : dt.days.filter(d => d !== day)
                  }));
                }}
              />
              {day}
            </label>
          ))}
        </div>
        <button disabled={data.days.length === 0} onClick={() => setStep(4)}>Next</button>
      </div>
    );
  }

  // Step 4: Weekly Mileage
  if (step === 4) {
    return (
      <div className="wizard-card">
        <h2>Weekly Distance</h2>
        <p>How many km do you want to run per week?</p>
        <input
          type="number"
          min="1"
          value={data.weeklyKm}
          placeholder="e.g. 40"
          onChange={e => setData(dt => ({ ...dt, weeklyKm: e.target.value }))}
        />
        <button
          disabled={!data.weeklyKm}
          onClick={() => setStep(5)}
        >Next</button>
      </div>
    );
  }

  // Step 5: Confirmation and Submit
  if (step === 5) {
    return (
      <div className="wizard-card">
        <h2>Ready to Generate Your Plan?</h2>
        <ul>
          <li><b>Category:</b> {data.category}</li>
          <li><b>Distance:</b> {data.distance}</li>
          <li><b>Target Time:</b> {data.targetTime}</li>
          <li><b>Days:</b> {data.days.join(", ")}</li>
          <li><b>Weekly Distance:</b> {data.weeklyKm} km</li>
        </ul>
        <button onClick={() => onComplete(data)}>Generate Plan</button>
      </div>
    );
  }

  return null;
}