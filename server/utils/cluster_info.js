// clusterInfo.js

const clusterInfo = [
  {
    id: 0,
    name: "cluster-0",
    typicalDistances: "42 km (occasional 21 km)",
    paceBand: "4.5 – 6.1 min/km",
    dataView: "210–265 min marathons, cadence 170–185 spm, HR ≈ 140–165 bpm",
    description:
      "Mid-pack to 'good club' marathon performances (~3 h 30 – 4 h 25). Well-trained recreational racers running a full marathon at steady tempo."
  },
  {
    id: 1,
    name: "cluster-1",
    typicalDistances: "10 km (some 5 km & 21 km)",
    paceBand: "5.0 – 7.5 min/km (outliers down to 3:00 on hard reps)",
    dataView:
      "50–85 min 10 ks, 5 k speedwork, half-marathon tempos; cadence often > 175 spm on the faster bouts",
    description:
      "Classic short-to-medium sessions: tempo 10 k runs, interval 5 k workouts, or tune-up races."
  },
  {
    id: 2,
    name: "cluster-2",
    typicalDistances: "50 km (plus a few slow marathons)",
    paceBand: "11 – 12.5 min/km",
    dataView: "580–630 min outings, HR often 120–140 bpm",
    description:
      "Long slow distance ultras: social 50 k trail days, run/walk efforts, or easy back-to-back long runs."
  },
  {
    id: 3,
    name: "cluster-3",
    typicalDistances: "42–50 km",
    paceBand: "7 – 8.5 min/km",
    dataView:
      "330–385 min marathons / ~6 h 50 k, HR 130–155 bpm",
    description:
      "Back-of-the-pack marathoners or comfortable long-run pace on trails. Solid finish but not raced all-out."
  },
  {
    id: 4,
    name: "cluster-4",
    typicalDistances: "42–50 km",
    paceBand: "9 – 12 min/km",
    dataView:
      "455–545 min marathons & ultras, HR 120–150",
    description:
      "Run/walk marathons, hilly trail races, or charity walks. Lots of low-intensity time on feet."
  },
  {
    id: 5,
    name: "cluster-5",
    typicalDistances: "21.1 km",
    paceBand: "4.4 – 9.1 min/km",
    dataView:
      "Wide span: 99 min PBs up to 185 min jogs; cadence 170–185 on the faster ones",
    description:
      "Half-marathons: from ambitious sub-1 h 45 attempts down to very easy longish jogs."
  },
  {
    id: 6,
    name: "cluster-6",
    typicalDistances: "42–50 km",
    paceBand: "5.5 – 7.0 min/km",
    dataView:
      "270–325 min marathons, HR 135–155, cadence ≈ 170–180 spm",
    description:
      "Mid-pack marathon/50 k at a steady, sustainable pace (~4 h 35 – 5 h 20 for 42 km)."
  },
  {
    id: 7,
    name: "cluster-7",
    typicalDistances: "5 km & 10 km (a few 4–5 km reps)",
    paceBand: "3 – 8 min/km (big spread)",
    dataView:
      "15–40 min 5 ks, sub-35 min 10 ks, plus recovery jogs at 7 min/km",
    description:
      "Short-distance speed work and local 5 k/10 k races. Anything under an hour lives here."
  },
  {
    id: 8,
    name: "cluster-8",
    typicalDistances: "42–50 km",
    paceBand: "8 – 10 min/km",
    dataView:
      "390–445 min marathons, HR 130–155",
    description:
      "Mid-slow marathons or trail ultras with modest run/walk strategy—steady but not 'all day'."
  },
  {
    id: 9,
    name: "cluster-9",
    typicalDistances: "50 km (and a few very long marathons)",
    paceBand: "13 – 15 min/km",
    dataView:
      "660–780 min outings (!!), HR often just 110–135 bpm",
    description:
      "Power-hiking ultras, heavy backpack events, or time-on-feet base building. Essentially long hikes with jogging breaks."
  }
];

module.exports = clusterInfo;
