// import React, { useEffect, useState, useMemo } from "react";
// import { Calendar, dateFnsLocalizer } from "react-big-calendar";
// import { addDays, startOfWeek, format, parse, getDay, differenceInCalendarWeeks } from "date-fns";
// import enUS from "date-fns/locale/en-US";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import "../styles/TrainingPlanWizard.css";
// import StravaStats from "../components/stravaStats";

// // Wizard steps
// const categories = [
//   { key: "race", label: "Race", desc: "Personalized plan for your next big event.", icon: "🏁" },
//   { key: "distance", label: "Run a specific distance", desc: "Pick any distance, from 5k to ultramarathon.", icon: "🏔️" }
// ];
// const distances = ["5K", "10K", "Half Marathon", "Full Marathon", "Ultra Marathon"];
// const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// // Calendar setup
// const locales = { "en-US": enUS };
// const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// // --- Wizard Component ---
// function TrainingPlanWizard({ onComplete }) {
//   const [step, setStep] = useState(0);
//   const [data, setData] = useState({
//     category: "",
//     distance: "",
//     targetTime: "",
//     days: [],
//     weeklyKm: "",
//   });

//   if (step === 0) {
//     return (
//       <div className="wizard-card">
//         <h2>Choose Your Adventure</h2>
//         <p>What inspires you most right now?</p>
//         {categories.map(opt => (
//           <div key={opt.key} className="wizard-option" onClick={() => { setData(d => ({ ...d, category: opt.key })); setStep(1); }}>
//             <span style={{ fontSize: 32 }}>{opt.icon}</span>
//             <div>
//               <div style={{ color: "#ff7c4f", fontWeight: 600 }}>{opt.label}</div>
//               <div style={{ color: "#888" }}>{opt.desc}</div>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (step === 1) {
//     return (
//       <div className="wizard-card">
//         <h2>Select Your Distance</h2>
//         <div className="wizard-options-list">
//           {distances.map(d => (
//             <button key={d} onClick={() => { setData(dt => ({ ...dt, distance: d })); setStep(2); }}>
//               {d}
//             </button>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (step === 2) {
//     return (
//       <div className="wizard-card">
//         <h2>Your Target Time</h2>
//         <p>What is your goal time for this distance? (HH:MM:SS or MM:SS)</p>
//         <input
//           type="text"
//           value={data.targetTime}
//           placeholder="e.g. 00:45:00"
//           onChange={e => setData(dt => ({ ...dt, targetTime: e.target.value }))}
//         />
//         <small style={{ color: "#888" }}>Format: HH:MM:SS or MM:SS</small>
//         <br />
//         <button
//           disabled={!/^(\d{2}:)?\d{2}:\d{2}$/.test(data.targetTime)}
//           onClick={() => setStep(3)}
//         >Next</button>
//       </div>
//     );
//   }

//   if (step === 3) {
//     return (
//       <div className="wizard-card">
//         <h2>Which days do you want to run?</h2>
//         <div className="days-select">
//           {daysOfWeek.map(day => (
//             <label key={day} style={{ marginRight: 16 }}>
//               <input
//                 type="checkbox"
//                 checked={data.days.includes(day)}
//                 onChange={e => {
//                   setData(dt => ({
//                     ...dt,
//                     days: e.target.checked
//                       ? [...dt.days, day]
//                       : dt.days.filter(d => d !== day)
//                   }));
//                 }}
//               />
//               {day}
//             </label>
//           ))}
//         </div>
//         <button disabled={data.days.length === 0} onClick={() => setStep(4)}>Next</button>
//       </div>
//     );
//   }

//   if (step === 4) {
//     return (
//       <div className="wizard-card">
//         <h2>Weekly Distance</h2>
//         <p>How many km do you want to run per week?</p>
//         <input
//           type="number"
//           min="1"
//           value={data.weeklyKm}
//           placeholder="e.g. 40"
//           onChange={e => setData(dt => ({ ...dt, weeklyKm: e.target.value }))}
//         />
//         <button
//           disabled={!data.weeklyKm}
//           onClick={() => setStep(5)}
//         >Next</button>
//       </div>
//     );
//   }

//   if (step === 5) {
//     return (
//       <div className="wizard-card">
//         <h2>Ready to Generate Your Plan?</h2>
//         <ul>
//           <li><b>Category:</b> {data.category}</li>
//           <li><b>Distance:</b> {data.distance}</li>
//           <li><b>Target Time:</b> {data.targetTime}</li>
//           <li><b>Days:</b> {data.days.join(", ")}</li>
//           <li><b>Weekly Distance:</b> {data.weeklyKm} km</li>
//         </ul>
//         <button onClick={() => onComplete(data)}>Generate Plan</button>
//       </div>
//     );
//   }

//   return null;
// }

// // --- Main Page ---
// export default function TrainingPlanCalendarPage() {
//   const [plan, setPlan] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showWizard, setShowWizard] = useState(true);
//   const [calendarDate, setCalendarDate] = useState(new Date());
//   const userId = localStorage.getItem('userId');

//   // After wizard complete
//   const handleWizardComplete = async (answers) => {
//     setLoading(true);
//     setShowWizard(false);
//     const res = await fetch('/api/plans/generate-ai', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       },
//       credentials: 'include',
//       body: JSON.stringify({ userId, ...answers })
//     });
//     const data = await res.json();
//     setPlan(data.plan || []);
//     setLoading(false);
//     setCalendarDate(new Date()); // Reset calendar to start
//   };

//   // Calculate plan week number based on visible calendar week
//   const planStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Plan always starts on first visible week
//   const weekStart = startOfWeek(calendarDate, { weekStartsOn: 1 });

//   const planWeek = Math.max(
//     1,
//     differenceInCalendarWeeks(weekStart, planStart, { weekStartsOn: 1 }) + 1
//   );

//   // Only show events for this plan week
//   const events = useMemo(() => {
//     return plan
//       .filter(run => run.week === planWeek)
//       .map(run => {
//         const dayIdx = daysOfWeek.indexOf(run.day);
//         const runDate = addDays(weekStart, dayIdx);
//         return {
//           title: `${run.type} Run (${run.distance}km @ ${(run.target_pace/60).toFixed(2)} min/km)`,
//           start: runDate,
//           end: runDate,
//           allDay: true,
//         };
//       });
//   }, [plan, planWeek, weekStart]);

//   return (
//     <div style={{ height: "80vh", margin: "2em", position: "relative" }}>
//       {showWizard && (
//         <div className="wizard-overlay">
//           <TrainingPlanWizard onComplete={handleWizardComplete} />
//         </div>
//       )}
//       <h2>Your Weekly AI-Powered Training Plan</h2>
//       <StravaStats userId={userId} />
      
//       {loading || showWizard ? <div>Loading...</div> :
//         <Calendar
//           localizer={localizer}
//           events={events}
//           startAccessor="start"
//           endAccessor="end"
//           style={{ height: "70vh" }}
//           views={["week"]}
//           defaultView="week"
//           date={calendarDate}
//           onNavigate={date => setCalendarDate(date)}
//         />
//       }
//     </div>
//   );
// }

// import React, { useEffect, useState, useMemo } from "react";
// import { Calendar, dateFnsLocalizer } from "react-big-calendar";
// import { addDays, startOfWeek, format, parse, getDay, differenceInCalendarWeeks } from "date-fns";
// import enUS from "date-fns/locale/en-US";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import "../styles/TrainingPlanWizard.css";
// import StravaStats from "../components/stravaStats";

// // Wizard steps
// const categories = [
//   { key: "race", label: "Race", desc: "Personalized plan for your next big event.", icon: "🏁" },
//   { key: "distance", label: "Run a specific distance", desc: "Pick any distance, from 5k to ultramarathon.", icon: "🏔️" }
// ];
// const distances = ["5K", "10K", "Half Marathon", "Full Marathon", "Ultra Marathon"];
// const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// // Calendar setup
// const locales = { "en-US": enUS };
// const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// // --- Modal component ---
// function RunDetailModal({ run, onClose }) {
//   if (!run) return null;
//   return (
//     <div className="run-modal-overlay" onClick={onClose}>
//       <div className="run-modal" onClick={e => e.stopPropagation()}>
//         <h3>{run.type} Run</h3>
//         <ul>
//           <li><b>Day:</b> {run.day}</li>
//           <li><b>Distance:</b> {run.distance} km</li>
//           <li><b>Target Pace:</b> {(run.target_pace/60).toFixed(2)} min/km</li>
//           {run.week && <li><b>Week:</b> {run.week}</li>}
//         </ul>
//         <button onClick={onClose} style={{marginTop: 16}}>Close</button>
//       </div>
//       <style>
//         {`
//           .run-modal-overlay {
//             position: fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; z-index:1000;
//           }
//           .run-modal {
//             background: #fff; padding: 2em; border-radius: 10px; box-shadow: 0 6px 32px #0002; min-width: 300px;
//           }
//         `}
//       </style>
//     </div>
//   );
// }

// // --- Wizard Component ---
// function TrainingPlanWizard({ onComplete }) {
//   const [step, setStep] = useState(0);
//   const [data, setData] = useState({
//     category: "",
//     distance: "",
//     targetTime: "",
//     days: [],
//     weeklyKm: "",
//   });

//   if (step === 0) {
//     return (
//       <div className="wizard-card">
//         <h2>Choose Your Adventure</h2>
//         <p>What inspires you most right now?</p>
//         {categories.map(opt => (
//           <div key={opt.key} className="wizard-option" onClick={() => { setData(d => ({ ...d, category: opt.key })); setStep(1); }}>
//             <span style={{ fontSize: 32 }}>{opt.icon}</span>
//             <div>
//               <div style={{ color: "#ff7c4f", fontWeight: 600 }}>{opt.label}</div>
//               <div style={{ color: "#888" }}>{opt.desc}</div>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (step === 1) {
//     return (
//       <div className="wizard-card">
//         <h2>Select Your Distance</h2>
//         <div className="wizard-options-list">
//           {distances.map(d => (
//             <button key={d} onClick={() => { setData(dt => ({ ...dt, distance: d })); setStep(2); }}>
//               {d}
//             </button>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (step === 2) {
//     return (
//       <div className="wizard-card">
//         <h2>Your Target Time</h2>
//         <p>What is your goal time for this distance? (HH:MM:SS or MM:SS)</p>
//         <input
//           type="text"
//           value={data.targetTime}
//           placeholder="e.g. 00:45:00"
//           onChange={e => setData(dt => ({ ...dt, targetTime: e.target.value }))}
//         />
//         <small style={{ color: "#888" }}>Format: HH:MM:SS or MM:SS</small>
//         <br />
//         <button
//           disabled={!/^(\d{2}:)?\d{2}:\d{2}$/.test(data.targetTime)}
//           onClick={() => setStep(3)}
//         >Next</button>
//       </div>
//     );
//   }

//   if (step === 3) {
//     return (
//       <div className="wizard-card">
//         <h2>Which days do you want to run?</h2>
//         <div className="days-select">
//           {daysOfWeek.map(day => (
//             <label key={day} style={{ marginRight: 16 }}>
//               <input
//                 type="checkbox"
//                 checked={data.days.includes(day)}
//                 onChange={e => {
//                   setData(dt => ({
//                     ...dt,
//                     days: e.target.checked
//                       ? [...dt.days, day]
//                       : dt.days.filter(d => d !== day)
//                   }));
//                 }}
//               />
//               {day}
//             </label>
//           ))}
//         </div>
//         <button disabled={data.days.length === 0} onClick={() => setStep(4)}>Next</button>
//       </div>
//     );
//   }

//   if (step === 4) {
//     return (
//       <div className="wizard-card">
//         <h2>Weekly Distance</h2>
//         <p>How many km do you want to run per week?</p>
//         <input
//           type="number"
//           min="1"
//           value={data.weeklyKm}
//           placeholder="e.g. 40"
//           onChange={e => setData(dt => ({ ...dt, weeklyKm: e.target.value }))}
//         />
//         <button
//           disabled={!data.weeklyKm}
//           onClick={() => setStep(5)}
//         >Next</button>
//       </div>
//     );
//   }

//   if (step === 5) {
//     return (
//       <div className="wizard-card">
//         <h2>Ready to Generate Your Plan?</h2>
//         <ul>
//           <li><b>Category:</b> {data.category}</li>
//           <li><b>Distance:</b> {data.distance}</li>
//           <li><b>Target Time:</b> {data.targetTime}</li>
//           <li><b>Days:</b> {data.days.join(", ")}</li>
//           <li><b>Weekly Distance:</b> {data.weeklyKm} km</li>
//         </ul>
//         <button onClick={() => onComplete(data)}>Generate Plan</button>
//       </div>
//     );
//   }

//   return null;
// }

// // --- Main Page ---
// export default function TrainingPlanCalendarPage() {
//   const [plan, setPlan] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showWizard, setShowWizard] = useState(true);
//   const [calendarDate, setCalendarDate] = useState(new Date());
//   const [selectedRun, setSelectedRun] = useState(null);
//   const userId = localStorage.getItem('userId');

//   // After wizard complete
//   const handleWizardComplete = async (answers) => {
//     setLoading(true);
//     setShowWizard(false);
//     const res = await fetch('/api/plans/generate-ai', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       },
//       credentials: 'include',
//       body: JSON.stringify({ userId, ...answers })
//     });
//     const data = await res.json();
//     setPlan(data.plan || []);
//     setLoading(false);
//     setCalendarDate(new Date()); // Reset calendar to start
//   };

//   // Calculate plan week number based on visible calendar week
//   const planStart = startOfWeek(new Date(), { weekStartsOn: 1 });
//   const weekStart = startOfWeek(calendarDate, { weekStartsOn: 1 });

//   const planWeek = Math.max(
//     1,
//     differenceInCalendarWeeks(weekStart, planStart, { weekStartsOn: 1 }) + 1
//   );

//   // Only show events for this plan week, and attach full run info for modal
//   const events = useMemo(() => {
//     return plan
//       .filter(run => run.week === planWeek)
//       .map(run => {
//         const dayIdx = daysOfWeek.indexOf(run.day);
//         const runDate = addDays(weekStart, dayIdx);
//         return {
//           title: `${run.type} Run (${run.distance}km @ ${(run.target_pace/60).toFixed(2)} min/km)`,
//           start: runDate,
//           end: runDate,
//           allDay: true,
//           run // Attach full run object for modal
//         };
//       });
//   }, [plan, planWeek, weekStart]);

//   // When a calendar event is clicked, open details modal
//   const handleSelectEvent = event => {
//     setSelectedRun(event.run);
//   };

//   return (
//     <div style={{ height: "80vh", margin: "2em", position: "relative" }}>
//       {showWizard && (
//         <div className="wizard-overlay">
//           <TrainingPlanWizard onComplete={handleWizardComplete} />
//         </div>
//       )}
//       <h2>Your Weekly AI-Powered Training Plan</h2>
//       <StravaStats userId={userId} />
      
//       {loading || showWizard ? <div>Loading...</div> :
//         <Calendar
//           localizer={localizer}
//           events={events}
//           startAccessor="start"
//           endAccessor="end"
//           style={{ height: "70vh" }}
//           views={["week"]}
//           defaultView="week"
//           date={calendarDate}
//           onNavigate={date => setCalendarDate(date)}
//           onSelectEvent={handleSelectEvent}
//         />
//       }
//       <RunDetailModal run={selectedRun} onClose={() => setSelectedRun(null)} />
//     </div>
//   );
// }

// import React, { useEffect, useState, useMemo } from "react";
// import { Calendar, dateFnsLocalizer } from "react-big-calendar";
// import { addDays, startOfWeek, format, parse, getDay, differenceInCalendarWeeks } from "date-fns";
// import enUS from "date-fns/locale/en-US";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import "../styles/TrainingPlanWizard.css";
// import StravaStats from "../components/stravaStats";
// import { getUserGoals, saveGoal } from "../api/goalsAPI";

// // Wizard steps
// const categories = [
//   { key: "race", label: "Race", desc: "Personalized plan for your next big event.", icon: "🏁" },
//   { key: "distance", label: "Run a specific distance", desc: "Pick any distance, from 5k to ultramarathon.", icon: "🏔️" }
// ];
// const distances = ["5K", "10K", "Half Marathon", "Full Marathon", "Ultra Marathon"];
// const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// // Calendar setup
// const locales = { "en-US": enUS };
// const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// // --- Modal component ---
// function RunDetailModal({ run, onClose }) {
//   if (!run) return null;
//   return (
//     <div className="run-modal-overlay" onClick={onClose}>
//       <div className="run-modal" onClick={e => e.stopPropagation()}>
//         <h3>{run.type} Run</h3>
//         <ul>
//           <li><b>Day:</b> {run.day}</li>
//           <li><b>Distance:</b> {run.distance} km</li>
//           <li><b>Target Pace:</b> {(run.target_pace/60).toFixed(2)} min/km</li>
//           {run.week && <li><b>Week:</b> {run.week}</li>}
//         </ul>
//         <button onClick={onClose} style={{marginTop: 16}}>Close</button>
//       </div>
//       <style>
//         {`
//           .run-modal-overlay {
//             position: fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; z-index:1000;
//           }
//           .run-modal {
//             background: #fff; padding: 2em; border-radius: 10px; box-shadow: 0 6px 32px #0002; min-width: 300px;
//           }
//         `}
//       </style>
//     </div>
//   );
// }

// // --- Wizard Component ---
// function TrainingPlanWizard({ userId, onComplete }) {
//   const [step, setStep] = useState(0);
//   const [data, setData] = useState({
//     category: "",
//     distance: "",
//     targetTime: "",
//     days: [],
//     weeklyKm: "",
//   });
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   if (step === 0) {
//     return (
//       <div className="wizard-card">
//         <h2>Choose Your Adventure</h2>
//         <p>What inspires you most right now?</p>
//         {categories.map(opt => (
//           <div key={opt.key} className="wizard-option" onClick={() => { setData(d => ({ ...d, category: opt.key })); setStep(1); }}>
//             <span style={{ fontSize: 32 }}>{opt.icon}</span>
//             <div>
//               <div style={{ color: "#ff7c4f", fontWeight: 600 }}>{opt.label}</div>
//               <div style={{ color: "#888" }}>{opt.desc}</div>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (step === 1) {
//     return (
//       <div className="wizard-card">
//         <h2>Select Your Distance</h2>
//         <div className="wizard-options-list">
//           {distances.map(d => (
//             <button key={d} onClick={() => { setData(dt => ({ ...dt, distance: d })); setStep(2); }}>
//               {d}
//             </button>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (step === 2) {
//     return (
//       <div className="wizard-card">
//         <h2>Your Target Time</h2>
//         <p>What is your goal time for this distance? (HH:MM:SS or MM:SS)</p>
//         <input
//           type="text"
//           value={data.targetTime}
//           placeholder="e.g. 00:45:00"
//           onChange={e => setData(dt => ({ ...dt, targetTime: e.target.value }))}
//         />
//         <small style={{ color: "#888" }}>Format: HH:MM:SS or MM:SS</small>
//         <br />
//         <button
//           disabled={!/^(\d{2}:)?\d{2}:\d{2}$/.test(data.targetTime)}
//           onClick={() => setStep(3)}
//         >Next</button>
//       </div>
//     );
//   }

//   if (step === 3) {
//     return (
//       <div className="wizard-card">
//         <h2>Which days do you want to run?</h2>
//         <div className="days-select">
//           {daysOfWeek.map(day => (
//             <label key={day} style={{ marginRight: 16 }}>
//               <input
//                 type="checkbox"
//                 checked={data.days.includes(day)}
//                 onChange={e => {
//                   setData(dt => ({
//                     ...dt,
//                     days: e.target.checked
//                       ? [...dt.days, day]
//                       : dt.days.filter(d => d !== day)
//                   }));
//                 }}
//               />
//               {day}
//             </label>
//           ))}
//         </div>
//         <button disabled={data.days.length === 0} onClick={() => setStep(4)}>Next</button>
//       </div>
//     );
//   }

//   if (step === 4) {
//     return (
//       <div className="wizard-card">
//         <h2>Weekly Distance</h2>
//         <p>How many km do you want to run per week?</p>
//         <input
//           type="number"
//           min="1"
//           value={data.weeklyKm}
//           placeholder="e.g. 40"
//           onChange={e => setData(dt => ({ ...dt, weeklyKm: e.target.value }))}
//         />
//         <button
//           disabled={!data.weeklyKm}
//           onClick={() => setStep(5)}
//         >Next</button>
//       </div>
//     );
//   }

//   if (step === 5) {
//     return (
//       <div className="wizard-card">
//         <h2>Ready to Generate Your Plan?</h2>
//         <ul>
//           <li><b>Category:</b> {data.category}</li>
//           <li><b>Distance:</b> {data.distance}</li>
//           <li><b>Target Time:</b> {data.targetTime}</li>
//           <li><b>Days:</b> {data.days.join(", ")}</li>
//           <li><b>Weekly Distance:</b> {data.weeklyKm} km</li>
//         </ul>
//         {error && <div style={{ color: "red" }}>{error}</div>}
//         <button
//           disabled={saving}
//           onClick={async () => {
//             setSaving(true);
//             setError("");
//             // Save the goal for dashboard and for plan loading
//             const resp = await saveGoal(userId, data.distance, data.targetTime);
//             if (!resp.success) {
//               setError(resp.error || "Failed to save goal.");
//               setSaving(false);
//               return;
//             }
//             setSaving(false);
//             onComplete(data); // Parent will generate plan
//           }}
//         >Generate Plan</button>
//       </div>
//     );
//   }

//   return null;
// }

// // --- Main Page ---
// export default function TrainingPlanCalendarPage() {
//   const [plan, setPlan] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showWizard, setShowWizard] = useState(false);
//   const [calendarDate, setCalendarDate] = useState(new Date());
//   const [selectedRun, setSelectedRun] = useState(null);
//   const [userGoal, setUserGoal] = useState(null);
//   const userId = localStorage.getItem('userId');

//   // On mount, check if user has a goal
//   useEffect(() => {
//     async function fetchGoal() {
//       if (!userId) return;
//       const resp = await getUserGoals(userId);
//       if (resp.success && resp.data && resp.data.length > 0) {
//         // Just pick the latest goal (or adjust logic if needed)
//         const goal = resp.data[resp.data.length - 1];
//         setUserGoal(goal);
//         setShowWizard(false);
//       } else {
//         setUserGoal(null);
//         setShowWizard(true);
//       }
//     }
//     fetchGoal();
//   }, [userId]);

//   // When userGoal changes, auto-generate plan
//   useEffect(() => {
//     async function fetchPlan() {
//       if (!userGoal) return;
//       setLoading(true);
//       // Compose plan request, adjust as needed for your API
//       const answers = {
//         distance: userGoal.distance,
//         targetTime: userGoal.target_time,
//         // You may want to persist category/days/weeklyKm in the backend as well!
//         category: "race",
//         days: ["Monday", "Wednesday", "Friday", "Saturday"],
//         weeklyKm: 40
//       };
//       const res = await fetch('/api/plans/generate-ai', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         credentials: 'include',
//         body: JSON.stringify({ userId, ...answers })
//       });
//       const data = await res.json();
//       setPlan(data.plan || []);
//       setLoading(false);
//     }
//     if (userGoal) fetchPlan();
//   }, [userGoal, userId]);

//   // Handle wizard completion
//   const handleWizardComplete = async (answers) => {
//     setLoading(true);
//     setShowWizard(false);
//     // Goal is already saved in wizard, now generate plan
//     const res = await fetch('/api/plans/generate-ai', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       },
//       credentials: 'include',
//       body: JSON.stringify({ userId, ...answers })
//     });
//     const data = await res.json();
//     setPlan(data.plan || []);
//     setLoading(false);
//     // Set this goal as current for later visits
//     setUserGoal({
//       distance: answers.distance,
//       target_time: answers.targetTime
//     });
//   };

//   // Calculate plan week number based on visible calendar week
//   const planStart = startOfWeek(new Date(), { weekStartsOn: 1 });
//   const weekStart = startOfWeek(calendarDate, { weekStartsOn: 1 });

//   const planWeek = Math.max(
//     1,
//     differenceInCalendarWeeks(weekStart, planStart, { weekStartsOn: 1 }) + 1
//   );

//   // Only show events for this plan week, and attach full run info for modal
//   const events = useMemo(() => {
//     return plan
//       .filter(run => run.week === planWeek)
//       .map(run => {
//         const dayIdx = daysOfWeek.indexOf(run.day);
//         const runDate = addDays(weekStart, dayIdx);
//         return {
//           title: `${run.type} Run (${run.distance}km @ ${(run.target_pace/60).toFixed(2)} min/km)`,
//           start: runDate,
//           end: runDate,
//           allDay: true,
//           run // Attach full run object for modal
//         };
//       });
//   }, [plan, planWeek, weekStart]);

//   // When a calendar event is clicked, open details modal
//   const handleSelectEvent = event => {
//     setSelectedRun(event.run);
//   };

//   return (
//     <div style={{ height: "80vh", margin: "2em", position: "relative" }}>
//       {showWizard && (
//         <div className="wizard-overlay">
//           <TrainingPlanWizard userId={userId} onComplete={handleWizardComplete} />
//         </div>
//       )}
//       <h2>Your Weekly AI-Powered Training Plan</h2>
//       <StravaStats userId={userId} />
      
//       {loading || showWizard ? <div>Loading...</div> :
//         <Calendar
//           localizer={localizer}
//           events={events}
//           startAccessor="start"
//           endAccessor="end"
//           style={{ height: "70vh" }}
//           views={["week"]}
//           defaultView="week"
//           date={calendarDate}
//           onNavigate={date => setCalendarDate(date)}
//           onSelectEvent={handleSelectEvent}
//         />
//       }
//       <RunDetailModal run={selectedRun} onClose={() => setSelectedRun(null)} />
//     </div>
//   );
// }

import React, { useEffect, useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { addDays, startOfWeek, format, parse, getDay, differenceInCalendarWeeks } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/TrainingPlanWizard.css";
import StravaStats from "../components/stravaStats";
import { getUserGoals, saveGoal } from "../api/goalsAPI";

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

// --- Wizard Component ---
function TrainingPlanWizard({ userId, onComplete }) {
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
            // Save the goal before generating the plan
            const resp = await saveGoal(userId, data.distance, data.targetTime);
            if (!resp.success) {
              setError(resp.error || "Failed to save goal.");
              setSaving(false);
              return;
            }
            setSaving(false);
            onComplete(data);
          }}
        >Generate Plan</button>
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
        const goal = resp.data[resp.data.length - 1];
        setUserGoal(goal);
        setShowWizard(false);
      } else {
        setUserGoal(null);
        setShowWizard(true);
      }
    }
    fetchGoal();
  }, [userId]);

  // When userGoal changes, auto-generate plan
  useEffect(() => {
    async function fetchPlan() {
      if (!userGoal) return;
      setLoading(true);
      const answers = {
        distance: userGoal.distance,
        targetTime: userGoal.target_time || userGoal.targetTime,
        category: "race",
        days: ["Monday", "Wednesday", "Friday", "Saturday"],
        weeklyKm: 40
      };
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
      setPlan(data.plan || []);
      setLoading(false);
    }
    if (userGoal) fetchPlan();
  }, [userGoal, userId]);

  // Handle wizard completion
  const handleWizardComplete = async (answers) => {
    setLoading(true);
    setShowWizard(false);
    // Plan is only generated after saving goal in wizard
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
    setPlan(data.plan || []);
    setLoading(false);
    setUserGoal({
      distance: answers.distance,
      targetTime: answers.targetTime
    });
  };

  // Calculate plan week number based on visible calendar week
  const planStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekStart = startOfWeek(calendarDate, { weekStartsOn: 1 });

  const planWeek = Math.max(
    1,
    differenceInCalendarWeeks(weekStart, planStart, { weekStartsOn: 1 }) + 1
  );

  // Only show events for this plan week, and attach full run info for modal
  const events = useMemo(() => {
    return plan
      .filter(run => run.week === planWeek)
      .map(run => {
        const dayIdx = daysOfWeek.indexOf(run.day);
        const runDate = addDays(weekStart, dayIdx);
        return {
          title: `${run.type} Run (${run.distance}km @ ${(run.target_pace/60).toFixed(2)} min/km)`,
          start: runDate,
          end: runDate,
          allDay: true,
          run
        };
      });
  }, [plan, planWeek, weekStart]);

  // When a calendar event is clicked, open details modal
  const handleSelectEvent = event => {
    setSelectedRun(event.run);
  };

  return (
    <div style={{ height: "80vh", margin: "2em", position: "relative" }}>
      {showWizard && (
        <div className="wizard-overlay">
          <TrainingPlanWizard userId={userId} onComplete={handleWizardComplete} />
        </div>
      )}
      <h2>Your Weekly AI-Powered Training Plan</h2>
      <StravaStats userId={userId} />
      {loading || showWizard ? <div>Loading...</div> :
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "70vh" }}
          views={["week"]}
          defaultView="week"
          date={calendarDate}
          onNavigate={date => setCalendarDate(date)}
          onSelectEvent={handleSelectEvent}
        />
      }
      <RunDetailModal run={selectedRun} onClose={() => setSelectedRun(null)} />
    </div>
  );
}