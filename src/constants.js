export var C = {
  deepTeal: "#003E49",
  orange: "#F0B468",
  yellow: "#FAD45A",
  cream: "#FFF2E8",
  milk: "#FFF7F4",
  pink: "#E2B8B8",
  lake: "#91C5EA",
  sky: "#6580BF",
  grass: "#D9E141",
  leaf: "#9ABAAF",
};

export var ZONES = [
  { id: "upper", name: "Upper Illinois", carp: 85, health: 20 },
  { id: "mid", name: "Mid Mississippi", carp: 70, health: 35 },
  { id: "lower", name: "Lower Ohio", carp: 60, health: 40 },
  { id: "wabash", name: "Wabash River", carp: 45, health: 55 },
  { id: "lake", name: "Lake Michigan", carp: 30, health: 65 },
];

export var METHODS = [
  { id: "gill", name: "Gill Nets", icon: "🪤", cost: 200, power: 15, eco: -2 },
  { id: "electro", name: "Electrofishing", icon: "⚡", cost: 350, power: 22, eco: -5 },
  { id: "sound", name: "Sound Barrier", icon: "🔊", cost: 500, power: 10, eco: 3 },
  { id: "bow", name: "Bow Fishing", icon: "🏹", cost: 150, power: 8, eco: 1 },
];

// Adjacent zone method pairings that give a removal bonus
export var COMBOS = [
  { methods: ["sound", "gill"], bonus: 0.25, label: "Sound drives carp into nets" },
  { methods: ["electro", "bow"], bonus: 0.15, label: "Stunned fish are easy targets" },
  { methods: ["sound", "electro"], bonus: 0.20, label: "Total sensory disruption" },
  { methods: ["gill", "bow"], bonus: 0.10, label: "Net and arrow double coverage" },
];

export var PRODUCTS = [
  { name: "Carp Kibble", icon: "🥣", lbs: 30, pups: 8 },
  { name: "Minced Chips", icon: "🐟", lbs: 10, pups: 15 },
  { name: "Carp Biscuits", icon: "🍪", lbs: 8, pups: 20 },
  { name: "Rolled Skins", icon: "🦴", lbs: 5, pups: 25 },
  { name: "Bladder Chews", icon: "🫧", lbs: 2, pups: 40 },
];

// Each upgrade has two purchasable tiers
export var UPGRADES = [
  {
    id: "plant",
    name: "Mfg Partner",
    icon: "🤝",
    tiers: [
      { cost: 1200, desc: "+40% capacity" },
      { cost: 2000, desc: "+80% capacity" },
    ],
  },
  {
    id: "lab",
    name: "Bio Lab",
    icon: "🔬",
    tiers: [
      { cost: 1000, desc: "+30% efficiency" },
      { cost: 1800, desc: "+60% efficiency" },
    ],
  },
  {
    id: "vet",
    name: "Vet Outreach",
    icon: "🩺",
    tiers: [
      { cost: 800, desc: "+$150/round" },
      { cost: 1400, desc: "+$350/round" },
    ],
  },
  {
    id: "cold",
    name: "Cold Chain",
    icon: "🚛",
    tiers: [
      { cost: 1800, desc: "+60% yield" },
      { cost: 3000, desc: "+120% yield" },
    ],
  },
  {
    id: "zero",
    name: "Zero Waste",
    icon: "♻️",
    tiers: [
      { cost: 1500, desc: "Unlocks Skins & Chews" },
      { cost: 2500, desc: "Double rare product yield" },
    ],
    product: {
      name: "Rolled Skins & Bladder Chews",
      icons: ["🦴", "🫧"],
      blurb: "Novel protein treats made from parts that would otherwise be discarded — true zero-waste processing. Perfect for dogs with sensitivities to common proteins.",
    },
  },
];

export var FACTS = [
  "Asian carp eat up to 40% of their body weight daily, starving native species.",
  "A Silver Carp can leap 10 feet out of the water when startled by motors.",
  "Asian carp were introduced in the 1970s to clean algae from aquaculture ponds.",
  "The Great Lakes fishing industry worth $7B is threatened by Asian carp.",
  "Carp protein is naturally hypoallergenic — perfect for sensitive dogs.",
  "Asian carp make up over 60% of fish biomass in parts of the Illinois River.",
  "Carp is rich in omega-3s, supporting healthy skin and coat in dogs.",
  "Rolled carp skins use parts that would otherwise be waste — zero waste.",
  "Air bladders are a novel protein most dogs have never been exposed to.",
  "Hypoallergenic diets help 10%+ of dogs with food allergies find relief.",
];

export var EVENTS = [
  {
    id: "spawn",
    name: "Spawning Season",
    icon: "🐟",
    bad: true,
    desc: "Carp spawn aggressively this round. Removal efficiency -20%.",
    removalMult: 0.8,
  },
  {
    id: "flood",
    name: "River Flooding",
    icon: "🌊",
    bad: true,
    desc: "Flooding spreads carp into unmanaged zones. Spread +8.",
    spreadBonus: 8,
  },
  {
    id: "drought",
    name: "Drought Conditions",
    icon: "☀️",
    bad: true,
    desc: "Low water levels stress native species. Health recovery halved.",
    healthMult: 0.5,
  },
  {
    id: "algae",
    name: "Algae Bloom",
    icon: "🟢",
    bad: true,
    desc: "Nutrient bloom supercharges carp in unmanaged zones. Spread +10.",
    unmangedSpreadBonus: 10,
  },
  {
    id: "volunteer",
    name: "Volunteer Drive",
    icon: "🙋",
    bad: false,
    desc: "Community members join the effort. +$400 this round.",
    bonusMoney: 400,
  },
  {
    id: "media",
    name: "Media Coverage",
    icon: "📺",
    bad: false,
    desc: "National spotlight on the carp crisis. +$700 in donations.",
    bonusMoney: 700,
  },
  {
    id: "native",
    name: "Native Fish Return",
    icon: "🐠",
    bad: false,
    desc: "Native species surge in healthier zones. +10 health this round.",
    healthBonus: 10,
  },
  {
    id: "calm",
    name: "Calm Waters",
    icon: "🌤️",
    bad: false,
    desc: "Ideal river conditions. All methods 15% more effective.",
    removalMult: 1.15,
  },
];

export var DIFFICULTY = {
  easy: { label: "Easy", emoji: "🌱", startMoney: 1500, spreadMult: 0.7, removalMult: 1.2, incomeMult: 1.3 },
  normal: { label: "Normal", emoji: "🌊", startMoney: 1000, spreadMult: 1.0, removalMult: 1.0, incomeMult: 1.0 },
  hard: { label: "Hard", emoji: "🔥", startMoney: 700, spreadMult: 1.4, removalMult: 0.85, incomeMult: 0.8 },
};

export function calcScore(avgHealth, avgCarp, pupsFed, harvested) {
  return Math.round(avgHealth * 10 + (100 - avgCarp) * 5 + pupsFed / 5 + harvested / 100);
}

export function getGrade(score) {
  var grades = [
    { min: 1800, l: "S", t: "River Guardian", c: C.grass },
    { min: 1400, l: "A", t: "Ecosystem Hero", c: C.leaf },
    { min: 1000, l: "B", t: "Carp Commander", c: C.lake },
    { min: 600, l: "C", t: "River Rookie", c: C.sky },
    { min: 0, l: "D", t: "Needs More Nets", c: C.pink },
  ];
  return grades.find(function (x) { return score >= x.min; });
}

export function getNamedEnding(zones) {
  var restored = zones.filter(function (z) { return z.health > 75 && z.carp < 15; }).length;
  var endings = [
    { min: 5, title: "All Rivers Saved", desc: "Every waterway fully restored. The Great Lakes are safe." },
    { min: 4, title: "Watershed Champion", desc: "Four zones thriving. The rivers are healing fast." },
    { min: 3, title: "Ecosystem Architect", desc: "Three zones fully recovered. Remarkable progress." },
    { min: 2, title: "Carp Commander", desc: "Two zones saved. The battle is turning." },
    { min: 1, title: "First Wave", desc: "One zone saved. Every victory matters." },
    { min: 0, title: "The Carp Hold On", desc: "The invasive species persists. Try a different strategy." },
  ];
  return endings.find(function (e) { return restored >= e.min; });
}

export function getComboBonus(zoneId, assigned) {
  var zIdx = ZONES.findIndex(function (z) { return z.id === zoneId; });
  var myMethod = assigned[zoneId];
  if (!myMethod) return null;
  var best = null;
  [-1, 1].forEach(function (delta) {
    var nIdx = zIdx + delta;
    if (nIdx < 0 || nIdx >= ZONES.length) return;
    var neighborMethod = assigned[ZONES[nIdx].id];
    if (!neighborMethod) return;
    COMBOS.forEach(function (combo) {
      var match =
        (combo.methods[0] === myMethod && combo.methods[1] === neighborMethod) ||
        (combo.methods[1] === myMethod && combo.methods[0] === neighborMethod);
      if (match && (!best || combo.bonus > best.bonus)) best = combo;
    });
  });
  return best;
}
