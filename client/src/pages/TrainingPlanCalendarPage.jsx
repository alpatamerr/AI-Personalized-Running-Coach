import React, { useEffect, useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { addDays, startOfWeek, format, parse, getDay, differenceInCalendarWeeks } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/TrainingPlanWizard.css";
import StravaStats from "../components/stravaStats";
import { getUserGoals, saveGoal } from "../api/goalsAPI";
import GeneratePlanButton from "../components/GeneratePlanButton";
// Wizard steps
const categories = [
  { key: "race", label: "Race", desc: "Personalized plan for your next big event.", icon: "🏁" },
  { key: "distance", label: "Run a specific distance", desc: "Pick any distance, from 5k to ultramarathon.", icon: "🏔️" }
];
const distances = ["5K", "10K", "Half Marathon", "Full Marathon", "Ultra Marathon"];
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Calendar setup
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// --- Modal component ---
function RunDetailModal({ run, onClose }) {
  if (!run) return null;
  return (
    <div className="run-modal-overlay" onClick={onClose}>
      <div className="run-modal" onClick={e => e.stopPropagation()}>
        <h3>{run.type} Run</h3>
        <ul>
          <li><b>Day:</b> {run.day}</li>
          <li><b>Distance:</b> {run.distance} km</li>
          <li><b>Target Pace:</b> {(run.target_pace/60).toFixed(2)} min/km</li>
          {run.week && <li><b>Week:</b> {run.week}</li>}
        </ul>
        <button onClick={onClose} style={{marginTop: 16}}>Close</button>
      </div>
      <style>
        {`
          .run-modal-overlay {
            position: fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; z-index:1000;
          }
          .run-modal {
            background: #fff; padding: 2em; border-radius: 10px; box-shadow: 0 6px 32px #0002; min-width: 300px;
          }
        `}
      </style>
    </div>
  );
}
const stepname = ({stepname}) => {
  return (
    <div className="wizard-card">
      {stepname ? (
        <h2>{stepname}</h2>
      ) : <h2>Strava Integration</h2>}
      <button
        onClick={() => setShowWizard(false)}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "transparent",
          border: "none",
          fontSize: 24,
          cursor: "pointer",
          color: "#888"
        }}
        aria-label="Close"
      >
        ×
      </button>
      </div>
  )
}
// --- Wizard Component ---
function TrainingPlanWizard({ userId, onComplete, onCancel }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    category: "",
    distance: "",
    targetTime: "",
    days: [],
    weeklyKm: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Helper for cancel button
  const cancelBtn = (
    <button
      type="button"
      style={{ marginLeft: 16, background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '0.5em 1em', cursor: 'pointer' }}
      onClick={onCancel}
    >
      Cancel
    </button>
  );

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
        <div style={{ marginTop: 24 }}>{cancelBtn}</div>
      </div>
    );
  }

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
        <div style={{ marginTop: 24 }}>{cancelBtn}</div>
      </div>
    );
  }

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
        {cancelBtn}
      </div>
    );
  }

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
        {cancelBtn}
      </div>
    );
  }

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
        {cancelBtn}
      </div>
    );
  }

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
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            setError("");
            data.userId = userId;
            console.log("Saving goal data:", data);
            const resp = await saveGoal(data);
            if (!resp.success) {
              setError(resp.error || "Failed to save goal.");
              setSaving(false);
              return;
            }
            setSaving(false);
            onComplete(data);
          }}
        >Generate Plan</button>
        {cancelBtn}
      </div>
    );
  }

  return null;
}

// --- Main Page ---
export default function TrainingPlanCalendarPage() {
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedRun, setSelectedRun] = useState(null);
  const [userGoal, setUserGoal] = useState(null);
  const userId = localStorage.getItem('userId');

  // On mount, check if user has a goal
  useEffect(() => {
    async function fetchGoal() {
      if (!userId) return;
      const resp = await getUserGoals(userId);
      if (resp.success && resp.data && resp.data.length > 0) {
        // Just pick the latest goal (or adjust logic if needed)
        const goal = resp.data[resp.data.length - 1];
        setUserGoal(goal);
        setShowWizard(false);
      } else {
        setUserGoal(null);
        setShowWizard(true);
      }
      console.log("Fetched user goals:", resp.data);
    }
    fetchGoal();
    if (userGoal) fetchPlan();
  }, [userId]);
  const [lastFetchedGoalId, setLastFetchedGoalId] = useState(null);

  // When userGoal changes, auto-generate plan
  useEffect(() => {
    console.log("User goal changed:", userGoal);
    async function fetchPlan() {
      if (!userGoal) return;
      setLoading(true);
      const res = await fetch(`/api/plans/get-plan?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      });
      
      const data = await res.json();
      if (!data.success) {
        console.error("Failed to generate plan:", data.error);
        setLoading(false);
        return;
      }
      console.log("Generated plan:", data.plan);
      setPlan(data.plan.details || []);
      setLoading(false);
    }
    fetchPlan();
  }, [userGoal]);

  // Handle wizard completion
  const handleWizardComplete = async (answers) => {
    setLoading(true);
    setShowWizard(false);
    // Goal is already saved in wizard, now generate plan
    const res = await fetch('/api/plans/generate-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include',
      body: JSON.stringify({ userId, ...answers })
    });
    const data = await res.json();
    setPlan(data.plan.details || []);
    setLoading(false);
    // Set this goal as current for later visits
    setUserGoal({
      distance: answers.distance,
      target_time: answers.targetTime
    });
  };

  // Calculate plan week number based on visible calendar week
  const planStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekStart = startOfWeek(calendarDate, { weekStartsOn: 1 });

  const planWeek = Math.max(
    1,
    differenceInCalendarWeeks(weekStart, planStart, { weekStartsOn: 1 }) + 1
  );

  const handleSelectEvent = event => {
    setSelectedRun(event.run);
  };
  const [week, setWeek] = useState(1);
  const calendar = () => {
    // For each day of the week, show the training method if a run exists, else blank
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex" }}>
          {daysOfWeek.map((day, idx) => {
            const run = plan.find(r => r.week === week && r.day === day);
            const runDate = addDays(weekStart, idx);
            return (
              <div
                key={day}
                style={{
                  flex: 1,
                  border: "1px solid #eee",
                  margin: "2px",
                  borderRadius: 8,
                  padding: "1em",
                  background: run ? "#fff7f3" : "#f9f9f9",
                  minHeight: 120,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start"
                }}
              >
                <strong>{day}</strong>
                {run ? (
                  <details style={{ width: "100%", marginTop: 8 }}>
                    <summary style={{ cursor: "pointer", fontWeight: 500 }}>
                      {run.type} - {run.distance_km ?? run.distance} km @ {run.target_pace} min/km
                    </summary>
                    <div style={{ marginTop: 8, fontSize: 13, color: "#555" }}>
                      <div><b>Date:</b> {format(runDate, 'EEEE, MMM d')}</div>
                      <div><b>Week:</b> {run.week}</div>
                      <div><b>Day:</b> {run.day}</div>
                      <div><b>Type:</b> {run.type}</div>
                      <div><b>Distance:</b> {run.distance_km ?? run.distance} km</div>
                      <div><b>Target Pace:</b> {run.target_pace} min/km</div>
                      {run.note && <div><b>Notes:</b> {run.note}</div>}
                      {run.explanation && <div><b>Explanation:</b> {run.explanation}</div>}
                    </div>
                  </details>
                ) : (
                  <span style={{ color: "#bbb", marginTop: 16 }}>No training scheduled</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return (
    <div style={{ height: "80vh", margin: "2em", position: "relative" }}>
      {showWizard && (
        <div className="wizard-overlay">
          <TrainingPlanWizard userId={userId} onComplete={handleWizardComplete} onCancel={() => setShowWizard(false)} />
        </div>
      )}
      <h2>Your Weekly AI-Powered Training Plan</h2>
      <StravaStats userId={userId} />
      {loading || showWizard ? <div>Loading...</div> :
        <div style={{ height: "100%", width:"100%", margin:'auto' }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
              <button
                onClick={() => setWeek(w => Math.max(1, w - 1))}
                disabled={week <= 1}
                style={{
                  border: "none",
                  borderRadius: 6,
                  padding: "0.5em 1em",
                  fontSize: 16,
                  cursor: week > 1 ? "pointer" : "not-allowed",
                  marginRight: 8,
                  color: "black"
                }}
              >
                &lt; Prev Week
              </button>
              <span style={{ fontWeight: 600, fontSize: 18 }}>Week {week}</span>
              <button
                onClick={() => setWeek(w => w + 1)}
                style={{
                  border: "none",
                  borderRadius: 6,
                  padding: "0.5em 1em",
                  fontSize: 16,
                  cursor: "pointer",
                  marginLeft: 8,
                  color: "black"
                }}
              >
                Next Week &gt;
              </button>
            </div>
            {calendar()}
          </div>
          <div style={{ marginLeft: 24, alignSelf: "flex-start", display: "flex",justifyContent: "space-between" }}>
            <section className="generate-plan-section">
              <button
                className="generate-plan-btn"
                onClick={() => setShowWizard(true)}
                >
                <h2>+</h2>
                Add New Goal
              </button>
            </section>
            <GeneratePlanButton userId={userId} />
            
          </div>
        </div>
      }
      <RunDetailModal run={selectedRun} onClose={() => setSelectedRun(null)} />
    </div>
  );
}