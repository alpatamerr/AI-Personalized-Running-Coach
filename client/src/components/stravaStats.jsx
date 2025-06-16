// import React, { useEffect, useState } from "react";

// export default function StravaStats({ userId }) {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch(`/api/plans/dashboard-stats?userId=${userId}`)
//       .then(res => res.json())
//       .then(data => {
//         setStats(data);
//         setLoading(false);
//       });
//   }, [userId]);

//   if (loading) return <div>Loading Strava stats…</div>;
//   if (!stats) return <div>No running data found.</div>;

//   return (
//     <div className="strava-stats">
//       <h3>Recent Running Stats (last 8 weeks)</h3>
//       <ul>
//         <li><b>Total distance:</b> {stats.total_km} km</li>
//         <li><b>Average pace:</b> {stats.avg_pace ? `${stats.avg_pace} min/km` : '—'}</li>
//         <li><b>Average HR:</b> {stats.avg_hr ? `${stats.avg_hr} bpm` : '—'}</li>
//         <li><b>Average cadence:</b> {stats.avg_cadence ? `${stats.avg_cadence} spm` : '—'}</li>
//       </ul>
//       <h4>Weekly Breakdown</h4>
//       <table>
//         <thead>
//           <tr>
//             <th>Week</th><th>KM</th><th>Pace</th><th>HR</th><th>Cadence</th>
//           </tr>
//         </thead>
//         <tbody>
//           {stats.weeks.map(wk => (
//             <tr key={wk.week}>
//               <td>{wk.week}</td>
//               <td>{wk.total_km}</td>
//               <td>{wk.avg_pace ? `${wk.avg_pace} min/km` : '—'}</td>
//               <td>{wk.avg_hr ? `${wk.avg_hr} bpm` : '—'}</td>
//               <td>{wk.avg_cadence ? `${wk.avg_cadence} spm` : '—'}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


// import React, { useEffect, useState } from "react";

// export default function StravaStats({ userId }) {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [fallbackTried, setFallbackTried] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     fetch(`/api/plans/dashboard-stats?userId=${userId}`)
//       .then(async res => {
//         if (res.status === 404 && !fallbackTried) {
//           // fallback: get demo Strava user id
//           const demo = await fetch('/api/plans/strava-user-id');
//           const demoData = await demo.json();
//           setFallbackTried(true);
//           if (demoData && demoData.userId && demoData.userId !== userId) {
//             // Try again with demo user
//             const statsRes = await fetch(`/api/plans/dashboard-stats?userId=${demoData.userId}`);
//             if (statsRes.ok) {
//               setStats(await statsRes.json());
//             } else {
//               setStats(null);
//             }
//           } else {
//             setStats(null);
//           }
//         } else if (res.ok) {
//           setStats(await res.json());
//         } else {
//           setStats(null);
//         }
//         setLoading(false);
//       })
//       .catch(() => {
//         setLoading(false);
//         setStats(null);
//       });
//   // Only reset fallbackTried if userId changes
//   }, [userId]);

//   if (loading) return <div>Loading Strava stats…</div>;
//   if (!stats || !stats.weeks || !Array.isArray(stats.weeks)) return <div>No running data found.</div>;

//   return (
//     <div className="strava-stats">
//       <h3>Recent Running Stats (last 8 weeks)</h3>
//       <ul>
//         <li><b>Total distance:</b> {stats.total_km} km</li>
//         <li><b>Average pace:</b> {stats.avg_pace ? `${stats.avg_pace} min/km` : '—'}</li>
//         <li><b>Average HR:</b> {stats.avg_hr ? `${stats.avg_hr} bpm` : '—'}</li>
//         <li><b>Average cadence:</b> {stats.avg_cadence ? `${stats.avg_cadence} spm` : '—'}</li>
//       </ul>
//       <h4>Weekly Breakdown</h4>
//       <table>
//         <thead>
//           <tr>
//             <th>Week</th><th>KM</th><th>Pace</th><th>HR</th><th>Cadence</th>
//           </tr>
//         </thead>
//         <tbody>
//           {stats.weeks.map(wk => (
//             <tr key={wk.week}>
//               <td>{wk.week}</td>
//               <td>{wk.total_km}</td>
//               <td>{wk.avg_pace ? `${wk.avg_pace} min/km` : '—'}</td>
//               <td>{wk.avg_hr ? `${wk.avg_hr} bpm` : '—'}</td>
//               <td>{wk.avg_cadence ? `${wk.avg_cadence} spm` : '—'}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";

export default function StravaStats({ userId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fallbackTried, setFallbackTried] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/plans/dashboard-stats?userId=${userId}`)
      .then(res => {
        if (res.status === 404 && !fallbackTried) {
          // fallback: get demo Strava user id and try again
          fetch('/api/plans/strava-user-id')
            .then(r => r.json())
            .then(data => {
              setFallbackTried(true);
              return fetch(`/api/plans/dashboard-stats?userId=${data.userId}`)
                .then(res2 => res2.json())
                .then(setStats)
                .finally(() => setLoading(false));
            });
        } else {
          return res.json().then(setStats).finally(() => setLoading(false));
        }
      })
      .catch(() => setLoading(false));
  }, [userId, fallbackTried]);

//   if (loading) return <div>Loading Strava stats…</div>;
//   if (!stats || !stats.weeks) return <div>No running data found.</div>;

}