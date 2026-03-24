import { useState } from "react";

// ===== ARCHWAY BRAND COLORS =====
var C = {
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

var ZONES = [
  { id: "upper", name: "Upper Illinois", carp: 85, health: 20 },
  { id: "mid", name: "Mid Mississippi", carp: 70, health: 35 },
  { id: "lower", name: "Lower Ohio", carp: 60, health: 40 },
  { id: "wabash", name: "Wabash River", carp: 45, health: 55 },
  { id: "lake", name: "Lake Michigan", carp: 30, health: 65 },
];

var METHODS = [
  { id: "gill", name: "Gill Nets", icon: "🪤", cost: 200, power: 15, eco: -2 },
  { id: "electro", name: "Electrofishing", icon: "⚡", cost: 350, power: 22, eco: -5 },
  { id: "sound", name: "Sound Barrier", icon: "🔊", cost: 500, power: 10, eco: 3 },
  { id: "bow", name: "Bow Fishing", icon: "🏹", cost: 150, power: 8, eco: 1 },
];

var PRODUCTS = [
  { name: "Carp Kibble", icon: "🥣", lbs: 30, pups: 8 },
  { name: "Minced Chips", icon: "🐟", lbs: 10, pups: 15 },
  { name: "Carp Biscuits", icon: "🍪", lbs: 8, pups: 20 },
  { name: "Rolled Skins", icon: "🦴", lbs: 5, pups: 25 },
  { name: "Bladder Chews", icon: "🫧", lbs: 2, pups: 40 },
];

var FACTS = [
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

// ===== ARCHWAY-STYLE SVG ILLUSTRATIONS =====

function ArchDog({ x, y, scale, color, flip, happy, wag }) {
  var s = scale || 1;
  var f = flip ? -1 : 1;
  var c = color || C.deepTeal;
  return (
    <g transform={"translate(" + x + "," + y + ") scale(" + (s * f) + "," + s + ")"}>
      {/* Body */}
      <ellipse cx="0" cy="12" rx="12" ry="8" fill="none" stroke={c} strokeWidth="1.8" />
      {/* Back legs */}
      <line x1="-6" y1="18" x2="-8" y2="26" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="-2" y1="18" x2="-3" y2="26" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
      {/* Front legs */}
      <line x1="6" y1="18" x2="7" y2="26" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="10" y1="17" x2="12" y2="26" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
      {/* Head */}
      <circle cx="14" cy="2" r="6" fill="none" stroke={c} strokeWidth="1.8" />
      {/* Ear (floppy) */}
      <path d={"M10 -2 Q7 -6 9 -1"} stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Eye */}
      <circle cx="16" cy="1" r="1.2" fill={c} />
      <circle cx="16.3" cy="0.7" r="0.35" fill="white" />
      {/* Nose */}
      <ellipse cx="19" cy="3" rx="1.5" ry="1" fill={c} />
      {/* Mouth / tongue */}
      {happy && <path d="M17 5 Q18 7 19 5" stroke={c} strokeWidth="0.8" fill="none" />}
      {happy && <ellipse cx="18" cy="7" rx="1" ry="1.5" fill={C.pink} stroke={c} strokeWidth="0.5" />}
      {/* Tail */}
      <path d={"M-12 8 Q-18 2 -16 -2"} stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round">
        {wag && <animate attributeName="d" values="M-12 8 Q-18 2 -16 -2;M-12 8 Q-19 4 -17 0;M-12 8 Q-18 2 -16 -2" dur="0.6s" repeatCount="indefinite" />}
      </path>
    </g>
  );
}

function FlowerCluster({ x, y, color }) {
  var c = color || C.sky;
  return (
    <g transform={"translate(" + x + "," + y + ")"}>
      <line x1="0" y1="0" x2="0" y2="6" stroke={C.leaf} strokeWidth="0.8" />
      <circle cx="0" cy="-1" r="2" fill={c} opacity="0.7" />
      <circle cx="-1.5" cy="0.5" r="1.5" fill={c} opacity="0.5" />
      <circle cx="1.5" cy="0.5" r="1.5" fill={c} opacity="0.5" />
      <line x1="5" y1="2" x2="5" y2="6" stroke={C.leaf} strokeWidth="0.6" />
      <circle cx="5" cy="1" r="1.5" fill={c} opacity="0.6" />
    </g>
  );
}

function Bird({ x, y }) {
  return (
    <g transform={"translate(" + x + "," + y + ")"} opacity="0.5">
      <path d="M0 0 Q2 -3 4 0" stroke={C.sky} fill="none" strokeWidth="0.8" />
      <path d="M5 0.5 Q7 -2 9 0.5" stroke={C.sky} fill="none" strokeWidth="0.8" />
    </g>
  );
}

function WaterBg() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, " + C.cream + " 0%, " + C.milk + " 50%, " + C.cream + " 100%)" }} />
      <svg style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "30%" }} viewBox="0 0 400 150" preserveAspectRatio="none">
        <path d="M0 40 Q50 25 100 40 Q150 55 200 35 Q250 20 300 40 Q350 60 400 35 L400 150 L0 150Z" fill={C.lake} opacity="0.12">
          <animate attributeName="d"
            values="M0 40 Q50 25 100 40 Q150 55 200 35 Q250 20 300 40 Q350 60 400 35 L400 150 L0 150Z;M0 35 Q50 55 100 30 Q150 20 200 45 Q250 55 300 30 Q350 20 400 40 L400 150 L0 150Z;M0 40 Q50 25 100 40 Q150 55 200 35 Q250 20 300 40 Q350 60 400 35 L400 150 L0 150Z"
            dur="6s" repeatCount="indefinite" />
        </path>
        <path d="M0 70 Q60 55 120 75 Q180 90 240 65 Q300 50 360 70 Q380 80 400 65 L400 150 L0 150Z" fill={C.lake} opacity="0.08">
          <animate attributeName="d"
            values="M0 70 Q60 55 120 75 Q180 90 240 65 Q300 50 360 70 Q380 80 400 65 L400 150 L0 150Z;M0 65 Q60 85 120 60 Q180 45 240 75 Q300 85 360 60 Q380 55 400 70 L400 150 L0 150Z;M0 70 Q60 55 120 75 Q180 90 240 65 Q300 50 360 70 Q380 80 400 65 L400 150 L0 150Z"
            dur="8s" repeatCount="indefinite" />
        </path>
      </svg>
      {/* Floating carp silhouettes */}
      <svg style={{ position: "absolute", top: "55%", left: 0, width: "100%", height: "30%" }} viewBox="0 0 400 200">
        <ellipse cy="60" rx="14" ry="5" fill={C.leaf} opacity="0.1">
          <animate attributeName="cx" from="-20" to="420" dur="14s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cy="120" rx="10" ry="4" fill={C.leaf} opacity="0.08">
          <animate attributeName="cx" from="420" to="-20" dur="18s" repeatCount="indefinite" />
        </ellipse>
      </svg>
    </div>
  );
}

function ZoneArt({ health, carp }) {
  var waterColor = health > 60 ? C.lake : health > 35 ? C.leaf : C.pink;
  var waterOp = health > 50 ? 0.35 : 0.2;
  var landColor = health > 50 ? C.leaf : "#b8a88a";
  var treeCount = Math.max(0, Math.floor(health / 25));
  var fishCount = Math.min(4, Math.floor(carp / 20));
  var nativeCount = Math.max(0, Math.floor(health / 35));

  return (
    <svg viewBox="0 0 200 45" style={{ width: "100%", height: 45, borderRadius: "8px 8px 0 0", display: "block" }}>
      <rect width="200" height="45" fill={C.milk} />
      {/* Land */}
      <rect y="0" width="200" height="18" fill={landColor} opacity="0.3" rx="0" />
      {/* Grass tufts */}
      {Array.from({ length: 6 }).map(function(_, i) {
        return <path key={"g" + i} d={"M" + (10 + i * 32) + " 16 Q" + (12 + i * 32) + " 10 " + (14 + i * 32) + " 16"} stroke={C.grass} strokeWidth="1" fill="none" opacity="0.5" />;
      })}
      {/* Trees */}
      {Array.from({ length: treeCount }).map(function(_, i) {
        var tx = 25 + i * 45;
        return (
          <g key={"t" + i}>
            <line x1={tx} y1={8} x2={tx} y2={16} stroke={C.deepTeal} strokeWidth="1.2" opacity="0.4" />
            <circle cx={tx} cy={6} r={health > 60 ? 5 : 3} fill={C.leaf} opacity={health > 50 ? 0.6 : 0.3} />
          </g>
        );
      })}
      {/* Flowers */}
      {health > 40 && <FlowerCluster x={150} y={11} color={C.sky} />}
      {health > 65 && <FlowerCluster x={60} y={12} color={C.pink} />}
      {/* Birds */}
      {health > 55 && <Bird x={30} y={3} />}
      {health > 75 && <Bird x={130} y={2} />}
      {/* Water */}
      <rect y="18" width="200" height="27" fill={waterColor} opacity={waterOp} />
      <ellipse cx="50" cy="30" rx="18" ry="1.2" fill="white" opacity="0.15">
        <animate attributeName="rx" values="18;24;18" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="140" cy="35" rx="14" ry="1" fill="white" opacity="0.1">
        <animate attributeName="rx" values="14;20;14" dur="4s" repeatCount="indefinite" />
      </ellipse>
      {/* Carp (darker, invasive) */}
      {Array.from({ length: fishCount }).map(function(_, i) {
        var fy = 24 + (i % 3) * 6;
        var dur = 4 + i * 1.3;
        return (
          <ellipse key={"c" + i} cy={fy} rx="5" ry="2" fill={C.deepTeal} opacity="0.2">
            <animate attributeName="cx" from={-8 - i * 15} to="208" dur={dur + "s"} repeatCount="indefinite" />
          </ellipse>
        );
      })}
      {/* Native fish (blue) */}
      {Array.from({ length: nativeCount }).map(function(_, i) {
        var fy = 26 + i * 5;
        return (
          <ellipse key={"n" + i} cy={fy} rx="3" ry="1.5" fill={C.lake} opacity="0.4">
            <animate attributeName="cx" from="208" to="-8" dur={7 + i * 2 + "s"} repeatCount="indefinite" />
          </ellipse>
        );
      })}
    </svg>
  );
}

function PupPack({ count }) {
  var n = Math.min(10, Math.max(1, Math.floor(count / 250) + 1));
  var happy = count > 400;
  return (
    <svg viewBox="0 0 220 35" style={{ width: "100%", maxWidth: 300, height: 35, display: "block", margin: "0 auto" }}>
      {Array.from({ length: n }).map(function(_, i) {
        var xPos = 15 + i * 20;
        return <ArchDog key={i} x={xPos} y={5} scale={0.55} color={C.deepTeal} flip={i % 3 === 0} happy={happy} wag={true} />;
      })}
    </svg>
  );
}

function Bar({ value, color }) {
  return (
    <div style={{ height: 4, background: C.cream, borderRadius: 2, marginTop: 4 }}>
      <div style={{ height: "100%", width: value + "%", background: color, borderRadius: 2, transition: "width 0.8s ease" }} />
    </div>
  );
}

// ===== MAIN GAME =====

export default function Game() {
  const [phase, setPhase] = useState("title");
  const [round, setRound] = useState(1);
  const [money, setMoney] = useState(1000);
  const [zones, setZones] = useState(ZONES.map(function(z) { return Object.assign({}, z); }));
  const [picked, setPicked] = useState(null);
  const [assigned, setAssigned] = useState({});
  const [harvested, setHarvested] = useState(0);
  const [pupsFed, setPupsFed] = useState(0);
  const [log, setLog] = useState([]);
  const [factIdx, setFactIdx] = useState(0);
  const [hasPlant, setHasPlant] = useState(false);
  const [hasLab, setHasLab] = useState(false);
  const [hasVet, setHasVet] = useState(false);
  const [hasCold, setHasCold] = useState(false);
  const [hasZero, setHasZero] = useState(false);
  const [copied, setCopied] = useState(false);
  var maxRounds = 12;

  function pickZone(id) { setPicked(id === picked ? null : id); }
  function assignMethod(mid) {
    if (!picked) return;
    var m = METHODS.find(function(x) { return x.id === mid; });
    var refund = assigned[picked] ? METHODS.find(function(x) { return x.id === assigned[picked]; }).cost : 0;
    if (money + refund < m.cost) return;
    setMoney(function(p) { return p + refund - m.cost; });
    setAssigned(function(p) { var n = Object.assign({}, p); n[picked] = mid; return n; });
  }
  function removeAssignment(zid) {
    var mid = assigned[zid]; if (!mid) return;
    var m = METHODS.find(function(x) { return x.id === mid; });
    setMoney(function(p) { return p + m.cost; });
    setAssigned(function(p) { var n = Object.assign({}, p); delete n[zid]; return n; });
  }
  function buyUpgrade(cost, setter) {
    if (money < cost) return;
    setMoney(function(p) { return p - cost; }); setter(true);
  }
  function runRound() {
    var newLog = []; var roundLbs = 0; var effMult = hasLab ? 1.3 : 1;
    var newZones = zones.map(function(z) {
      var mid = assigned[z.id]; var nz = Object.assign({}, z);
      if (mid) {
        var m = METHODS.find(function(x) { return x.id === mid; });
        var rem = Math.min(nz.carp, Math.round(m.power * effMult * (0.8 + Math.random() * 0.4)));
        nz.carp = Math.max(0, nz.carp - rem);
        nz.health = Math.min(100, nz.health + Math.max(0, rem / 2 + m.eco));
        roundLbs += rem * 50;
        newLog.push({ text: z.name + ": -" + rem + "% carp (" + m.name + ")", good: true });
      } else {
        var sp = Math.round(3 + Math.random() * 5);
        nz.carp = Math.min(100, nz.carp + sp); nz.health = Math.max(0, nz.health - sp / 2);
        newLog.push({ text: z.name + ": +" + sp + "% carp (unmanaged)", good: false });
      }
      return nz;
    });
    var yieldMult = (hasPlant ? 1.4 : 1) * (hasCold ? 1.6 : 1);
    var usable = Math.round(roundLbs * 0.65 * yieldMult);
    var pups = 0; var prodCount = hasZero ? 5 : 3;
    var shares = [0.4, 0.25, 0.25, 0.05, 0.05];
    for (var i = 0; i < prodCount; i++) { pups += Math.floor(Math.round(usable * shares[i]) / PRODUCTS[i].lbs) * PRODUCTS[i].pups; }
    var income = 400 + (hasVet ? 150 : 0) + Math.round(usable * 0.8);
    setZones(newZones); setHarvested(function(p) { return p + roundLbs; }); setPupsFed(function(p) { return p + pups; });
    setMoney(function(p) { return p + income; }); setLog(newLog); setAssigned({}); setPicked(null);
    setFactIdx(function(p) { return (p + 1) % FACTS.length; });
    if (round >= maxRounds) { setPhase("gameover"); } else { setPhase("results"); }
  }
  function nextRound() { setRound(function(p) { return p + 1; }); setPhase("plan"); }
  function resetAll() {
    setPhase("title"); setRound(1); setMoney(1000);
    setZones(ZONES.map(function(z) { return Object.assign({}, z); }));
    setPicked(null); setAssigned({}); setHarvested(0); setPupsFed(0); setLog([]);
    setHasPlant(false); setHasLab(false); setHasVet(false); setHasCold(false); setHasZero(false);
  }

  var avgHealth = Math.round(zones.reduce(function(s, z) { return s + z.health; }, 0) / zones.length);
  var avgCarp = Math.round(zones.reduce(function(s, z) { return s + z.carp; }, 0) / zones.length);
  var deployCount = Object.keys(assigned).length;

  var btn = { border: "none", cursor: "pointer", fontFamily: "inherit" };
  var btnPrimary = Object.assign({}, btn, {
    background: C.deepTeal, color: C.cream, padding: "14px 32px",
    borderRadius: 50, fontSize: 16, fontWeight: 700, letterSpacing: 0.5,
  });
  var btnSecondary = Object.assign({}, btn, {
    background: "transparent", color: C.deepTeal, padding: "12px 24px",
    borderRadius: 50, fontSize: 14, fontWeight: 600, border: "2px solid " + C.deepTeal,
  });
  var cardStyle = {
    background: "white", borderRadius: 14, border: "1px solid rgba(0,62,73,0.08)",
    boxShadow: "0 2px 12px rgba(0,62,73,0.06)",
  };

  var css = (
    <style>{"\n      @keyframes pupWag { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }\n      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }\n      * { box-sizing: border-box; }\n    "}</style>
  );

  var headFont = "'DM Serif Display', Georgia, serif";
  var bodyFont = "'DM Sans', system-ui, sans-serif";

  // ===== TITLE =====
  if (phase === "title") {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", fontFamily: bodyFont, color: C.deepTeal, padding: 24,
        textAlign: "center", position: "relative",
      }}>
        {css}
        <WaterBg />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 440 }}>
          <div style={{
            background: C.orange, color: C.deepTeal, padding: "5px 16px", borderRadius: 20,
            fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase",
            display: "inline-block", marginBottom: 20,
          }}>Archway Pet Food Presents</div>

          <div style={{
            fontFamily: headFont, fontSize: 56, lineHeight: 1, color: C.deepTeal, marginBottom: 4,
          }}>Carp Cleanup</div>

          <p style={{ fontSize: 16, color: C.deepTeal, opacity: 0.6, fontStyle: "italic", margin: "8px 0 20px" }}>
            Save Our Waterways. Feed Our Pups.
          </p>

          {/* Hero illustration */}
          <svg viewBox="0 0 240 90" style={{ width: "100%", maxWidth: 340, height: "auto", margin: "0 auto 20px", display: "block" }}>
            {/* Sky */}
            <rect width="240" height="90" rx="12" fill={C.milk} />
            {/* Land */}
            <rect y="0" width="240" height="40" rx="12" fill={C.leaf} opacity="0.25" />
            {/* Grass */}
            {[20, 50, 90, 140, 180, 210].map(function(gx, i) {
              return <path key={i} d={"M" + gx + " 38 Q" + (gx + 3) + " 30 " + (gx + 6) + " 38"} stroke={C.grass} strokeWidth="1.2" fill="none" opacity="0.6" />;
            })}
            {/* Trees */}
            <line x1="30" y1="20" x2="30" y2="38" stroke={C.deepTeal} strokeWidth="1.5" opacity="0.3" />
            <circle cx="30" cy="16" r="8" fill={C.leaf} opacity="0.5" />
            <line x1="190" y1="16" x2="190" y2="38" stroke={C.deepTeal} strokeWidth="1.5" opacity="0.3" />
            <circle cx="190" cy="12" r="10" fill={C.leaf} opacity="0.5" />
            {/* Flowers */}
            <FlowerCluster x={70} y={30} color={C.sky} />
            <FlowerCluster x={155} y={32} color={C.pink} />
            {/* Birds */}
            <Bird x={50} y={8} />
            <Bird x={160} y={5} />
            {/* Water */}
            <rect y="40" width="240" height="50" fill={C.lake} opacity="0.2" rx="0" />
            <ellipse cx="60" cy="58" rx="25" ry="2" fill="white" opacity="0.2">
              <animate attributeName="rx" values="25;35;25" dur="3s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="170" cy="65" rx="20" ry="1.5" fill="white" opacity="0.15">
              <animate attributeName="rx" values="20;28;20" dur="4s" repeatCount="indefinite" />
            </ellipse>
            {/* Carp swimming */}
            <ellipse cy="55" rx="8" ry="3" fill={C.deepTeal} opacity="0.15">
              <animate attributeName="cx" from="-10" to="250" dur="8s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cy="70" rx="6" ry="2.5" fill={C.deepTeal} opacity="0.12">
              <animate attributeName="cx" from="250" to="-10" dur="10s" repeatCount="indefinite" />
            </ellipse>
            {/* Dog on bank */}
            <ArchDog x={110} y={10} scale={0.9} color={C.deepTeal} happy={true} wag={true} />
          </svg>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 20 }}>
            {["Hypoallergenic", "Sustainable", "Invasive → Nutritious"].map(function(t) {
              return <span key={t} style={{
                background: C.yellow + "44", border: "1px solid " + C.orange + "66",
                padding: "4px 12px", borderRadius: 16, fontSize: 11, color: C.deepTeal, fontWeight: 600,
              }}>{t}</span>;
            })}
          </div>

          <p style={{ fontSize: 14, opacity: 0.55, lineHeight: 1.7, marginBottom: 28, color: C.deepTeal }}>
            Howdy! Asian carp are destroying America's rivers. Deploy removal teams across 5 zones,
            restore ecosystems, and turn every catch into hypoallergenic nutrition for pups everywhere.
          </p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 28 }}>
            {PRODUCTS.map(function(p) {
              return (
                <div key={p.name} style={{
                  background: "white", borderRadius: 10, padding: "8px 10px", textAlign: "center",
                  border: "1px solid rgba(0,62,73,0.08)", boxShadow: "0 1px 4px rgba(0,62,73,0.05)",
                }}>
                  <div style={{ fontSize: 18 }}>{p.icon}</div>
                  <div style={{ fontSize: 8, marginTop: 2, color: C.deepTeal, opacity: 0.6, fontWeight: 600 }}>{p.name}</div>
                </div>
              );
            })}
          </div>

          <button onClick={function() { setPhase("plan"); }} style={btnPrimary}>
            Start Mission
          </button>

          <div style={{ marginTop: 36, fontSize: 10, opacity: 0.25, letterSpacing: 2, color: C.deepTeal }}>
            ARCHWAY PET FOOD • UNSHAKABLY SUSTAINABLE
          </div>
        </div>
      </div>
    );
  }

  // ===== GAME OVER =====
  if (phase === "gameover") {
    var sc = Math.round(avgHealth * 10 + (100 - avgCarp) * 5 + pupsFed / 5 + harvested / 100);
    var grades = [
      { min: 1800, l: "S", t: "River Guardian", c: C.grass },
      { min: 1400, l: "A", t: "Ecosystem Hero", c: C.leaf },
      { min: 1000, l: "B", t: "Carp Commander", c: C.lake },
      { min: 600, l: "C", t: "River Rookie", c: C.sky },
      { min: 0, l: "D", t: "Needs More Nets", c: C.pink },
    ];
    var g = grades.find(function(x) { return sc >= x.min; });
    var shareText = "🐟 I scored " + sc + " pts in Carp Cleanup by @ArchwayPetFood!\n🎣 " + harvested.toLocaleString() + " lbs removed\n🐕 " + pupsFed.toLocaleString() + " pups fed healthier\n🌿 " + avgHealth + "% recovery\nPlay now! 🐾";

    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", fontFamily: bodyFont, color: C.deepTeal,
        padding: 24, textAlign: "center", position: "relative",
      }}>
        {css}
        <WaterBg />
        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 400 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, opacity: 0.4, marginBottom: 16 }}>MISSION COMPLETE</div>

          <div style={{
            width: 90, height: 90, borderRadius: "50%", display: "flex", alignItems: "center",
            justifyContent: "center", border: "3px solid " + g.c, fontSize: 44, fontWeight: 900,
            boxShadow: "0 0 24px " + g.c + "33", margin: "0 auto 8px", background: "white",
          }}>{g.l}</div>
          <div style={{ fontFamily: headFont, fontSize: 20, color: C.deepTeal }}>{g.t}</div>
          <div style={{ fontFamily: headFont, fontSize: 36, color: C.orange, margin: "4px 0 16px" }}>{sc.toLocaleString()} pts</div>

          <div style={Object.assign({}, cardStyle, { padding: "8px 12px", marginBottom: 16 })}>
            <PupPack count={pupsFed} />
            <div style={{ fontSize: 12, opacity: 0.5, paddingBottom: 6, color: C.deepTeal }}>{pupsFed.toLocaleString()} pups eating healthier!</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
            {[
              { icon: "🎣", val: harvested.toLocaleString() + " lbs", lab: "Carp Removed" },
              { icon: "🐕", val: pupsFed.toLocaleString(), lab: "Pups Fed" },
              { icon: "🌿", val: avgHealth + "%", lab: "Eco Recovery" },
              { icon: "📉", val: avgCarp + "%", lab: "Carp Left" },
            ].map(function(s) {
              return (
                <div key={s.lab} style={Object.assign({}, cardStyle, { padding: 12 })}>
                  <div style={{ fontSize: 18 }}>{s.icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{s.val}</div>
                  <div style={{ fontSize: 10, opacity: 0.4 }}>{s.lab}</div>
                </div>
              );
            })}
          </div>

          <div style={Object.assign({}, cardStyle, {
            padding: 14, marginBottom: 24, fontSize: 13, lineHeight: 1.6,
            background: C.cream, border: "1px solid " + C.orange + "33",
          })}>
            <div style={{ fontFamily: headFont, fontSize: 16, color: C.deepTeal, marginBottom: 4 }}>Archway Pet Food</div>
            Hypoallergenic dog food & treats from invasive Asian carp.
            <strong style={{ color: C.orange }}> Unshakably sustainable.</strong>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={function() {
              function onCopied() { setCopied(true); setTimeout(function() { setCopied(false); }, 2000); }
              if (navigator.clipboard) {
                navigator.clipboard.writeText(shareText).then(onCopied);
              } else {
                var ta = document.createElement("textarea");
                ta.value = shareText;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
                onCopied();
              }
            }} style={btnPrimary}>
              {copied ? "✓ Copied!" : "🐾 Share Score"}
            </button>
            <button onClick={resetAll} style={btnSecondary}>Play Again</button>
          </div>
        </div>
      </div>
    );
  }

  // ===== RESULTS =====
  if (phase === "results") {
    return (
      <div style={{
        minHeight: "100vh", fontFamily: bodyFont, color: C.deepTeal, padding: 16, position: "relative",
      }}>
        {css}
        <WaterBg />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 16, paddingBottom: 10, borderBottom: "1px solid rgba(0,62,73,0.1)",
          }}>
            <span style={{ fontFamily: headFont, fontSize: 18, color: C.deepTeal }}>Carp Cleanup</span>
            <span style={{ fontSize: 12, opacity: 0.5 }}>Round {round}/{maxRounds}</span>
          </div>

          <h2 style={{ fontFamily: headFont, fontSize: 22, margin: "0 0 12px", color: C.deepTeal }}>
            Round {round} Results
          </h2>

          <div style={Object.assign({}, cardStyle, { padding: 14, marginBottom: 14 })}>
            {log.map(function(entry, i) {
              return (
                <div key={i} style={{
                  fontSize: 13, padding: "5px 0", color: entry.good ? C.deepTeal : "#c0392b",
                  borderBottom: i < log.length - 1 ? "1px solid rgba(0,62,73,0.06)" : "none",
                }}>
                  {entry.good ? "✅" : "⚠️"} {entry.text}
                </div>
              );
            })}
          </div>

          <div style={Object.assign({}, cardStyle, { padding: 10, marginBottom: 14 })}>
            <PupPack count={pupsFed} />
            <div style={{ display: "flex", justifyContent: "space-around", paddingTop: 8, borderTop: "1px solid rgba(0,62,73,0.06)" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, opacity: 0.4, letterSpacing: 1 }}>TOTAL REMOVED</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.sky }}>🎣 {harvested.toLocaleString()} lbs</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, opacity: 0.4, letterSpacing: 1 }}>PUPS FED</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.orange }}>🐕 {pupsFed.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div style={Object.assign({}, cardStyle, {
            padding: 14, marginBottom: 16, background: C.cream, border: "1px solid " + C.orange + "33",
          })}>
            <div style={{ fontSize: 9, letterSpacing: 2, opacity: 0.4, marginBottom: 4 }}>DID YOU KNOW?</div>
            <div style={{ fontSize: 13, fontStyle: "italic", lineHeight: 1.6, color: C.deepTeal }}>{FACTS[factIdx]}</div>
          </div>

          <button onClick={nextRound} style={Object.assign({}, btnPrimary, { width: "100%" })}>
            Next Round →
          </button>
        </div>
      </div>
    );
  }

  // ===== PLANNING =====
  var pickedZone = zones.find(function(z) { return z.id === picked; });

  return (
    <div style={{
      minHeight: "100vh", fontFamily: bodyFont, color: C.deepTeal,
      display: "flex", flexDirection: "column", position: "relative",
    }}>
      {css}
      <WaterBg />

      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 16px", borderBottom: "1px solid rgba(0,62,73,0.08)",
        background: "rgba(255,242,232,0.85)", flexShrink: 0, position: "relative", zIndex: 1,
        backdropFilter: "blur(10px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: headFont, fontSize: 18, color: C.deepTeal }}>Carp Cleanup</span>
          <span style={{
            background: C.orange, color: C.deepTeal, padding: "2px 8px", borderRadius: 10,
            fontSize: 9, fontWeight: 700, letterSpacing: 1,
          }}>ARCHWAY</span>
        </div>
        <div style={{ fontSize: 12 }}>
          Rd <strong style={{ color: C.orange }}>{round}</strong>/{maxRounds}
          &nbsp;&nbsp;💰 <strong style={{ color: C.deepTeal }}>${money.toLocaleString()}</strong>
        </div>
      </div>

      {/* Impact bar */}
      <div style={{
        display: "flex", background: "rgba(255,247,244,0.9)", flexShrink: 0,
        borderBottom: "1px solid rgba(0,62,73,0.06)",
        position: "relative", zIndex: 1, backdropFilter: "blur(10px)",
      }}>
        <div style={{ flex: 1, padding: "8px 12px", textAlign: "center", borderRight: "1px solid rgba(0,62,73,0.06)" }}>
          <div style={{ fontSize: 9, opacity: 0.4, letterSpacing: 1 }}>CARP REMOVED</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.sky }}>🎣 {harvested.toLocaleString()} lbs</div>
        </div>
        <div style={{ flex: 1, padding: "8px 12px", textAlign: "center" }}>
          <div style={{ fontSize: 9, opacity: 0.4, letterSpacing: 1 }}>PUPS FED</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.orange }}>🐕 {pupsFed.toLocaleString()}</div>
          {pupsFed > 0 && <PupPack count={pupsFed} />}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: 16, position: "relative", zIndex: 1 }}>

        <div style={{ fontSize: 10, letterSpacing: 1.5, opacity: 0.4, marginBottom: 6, fontWeight: 700 }}>SELECT A ZONE</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {zones.map(function(z) {
            var isSel = picked === z.id;
            var hasMeth = assigned[z.id];
            var hc = z.health > 60 ? C.leaf : z.health > 30 ? C.orange : C.pink;
            return (
              <button key={z.id} onClick={function() { pickZone(z.id); }} style={{
                ...btn, display: "block", width: "100%", textAlign: "left", color: C.deepTeal,
                background: "white", border: isSel ? "2px solid " + C.deepTeal : "1px solid rgba(0,62,73,0.1)",
                borderRadius: 14, padding: 0, overflow: "hidden",
                boxShadow: isSel ? "0 4px 16px rgba(0,62,73,0.12)" : "0 1px 6px rgba(0,62,73,0.04)",
              }}>
                <ZoneArt health={z.health} carp={z.carp} />
                <div style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: hc, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: isSel ? 700 : 500 }}>{z.name}</div>
                    <div style={{ fontSize: 10, opacity: 0.45 }}>Carp: {z.carp}% · Health: {z.health}%</div>
                  </div>
                  {hasMeth && <span style={{ fontSize: 16 }}>{METHODS.find(function(m) { return m.id === hasMeth; }).icon}</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected zone detail */}
        {pickedZone && (
          <div style={{ marginBottom: 16, animation: "fadeIn 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <h3 style={{ margin: 0, fontFamily: headFont, fontSize: 18 }}>{pickedZone.name}</h3>
              {assigned[picked] && (
                <button onClick={function() { removeAssignment(picked); }} style={{
                  ...btn, background: C.pink + "44", border: "1px solid " + C.pink,
                  color: "#c0392b", padding: "4px 12px", borderRadius: 8, fontSize: 11,
                }}>Remove</button>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <div style={Object.assign({}, cardStyle, { flex: 1, padding: 10 })}>
                <div style={{ fontSize: 9, opacity: 0.5 }}>Carp Density</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#c0392b" }}>{pickedZone.carp}%</div>
                <Bar value={pickedZone.carp} color="#c0392b" />
              </div>
              <div style={Object.assign({}, cardStyle, { flex: 1, padding: 10 })}>
                <div style={{ fontSize: 9, opacity: 0.5 }}>Native Health</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.leaf }}>{pickedZone.health}%</div>
                <Bar value={pickedZone.health} color={C.leaf} />
              </div>
            </div>
            <div style={{ fontSize: 10, letterSpacing: 1.5, opacity: 0.4, marginBottom: 6, fontWeight: 700 }}>DEPLOY METHOD</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {METHODS.map(function(m) {
                var isActive = assigned[picked] === m.id;
                var refund = assigned[picked] ? METHODS.find(function(x) { return x.id === assigned[picked]; }).cost : 0;
                var canAfford = isActive || (money + refund >= m.cost);
                return (
                  <button key={m.id} onClick={function() { assignMethod(m.id); }} style={{
                    ...btn, color: C.deepTeal,
                    background: isActive ? C.cream : "white",
                    border: isActive ? "2px solid " + C.deepTeal : "1px solid rgba(0,62,73,0.1)",
                    borderRadius: 12, padding: "10px 8px", textAlign: "left",
                    opacity: canAfford ? 1 : 0.35,
                    boxShadow: isActive ? "0 2px 8px rgba(0,62,73,0.1)" : "none",
                  }}>
                    <div style={{ fontSize: 14 }}>{m.icon} <span style={{ fontSize: 12, fontWeight: 700 }}>{m.name}</span></div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: isActive ? C.deepTeal : C.orange, marginTop: 4 }}>
                      {isActive ? "✓ Deployed" : "$" + m.cost}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Upgrades */}
        <div style={{ fontSize: 10, letterSpacing: 1.5, opacity: 0.4, marginBottom: 6, fontWeight: 700 }}>ARCHWAY INFRASTRUCTURE</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 16 }}>
          {[
            { name: "Mfg Partner", icon: "🤝", cost: 1200, desc: "+40% capacity", owned: hasPlant, set: setHasPlant },
            { name: "Bio Lab", icon: "🔬", cost: 1000, desc: "+30% efficiency", owned: hasLab, set: setHasLab },
            { name: "Vet Outreach", icon: "🩺", cost: 800, desc: "+$150/round", owned: hasVet, set: setHasVet },
            { name: "Cold Chain", icon: "🚛", cost: 1800, desc: "+60% yield", owned: hasCold, set: setHasCold },
            { name: "Zero Waste", icon: "♻️", cost: 1500, desc: "Skins & bladder", owned: hasZero, set: setHasZero },
          ].map(function(u) {
            return (
              <button key={u.name} onClick={function() { if (!u.owned) buyUpgrade(u.cost, u.set); }} style={{
                ...btn, color: C.deepTeal,
                background: u.owned ? C.leaf + "22" : "white",
                border: u.owned ? "1px solid " + C.leaf + "55" : "1px solid rgba(0,62,73,0.1)",
                borderRadius: 12, padding: 10, textAlign: "left",
                opacity: (u.owned || money >= u.cost) ? 1 : 0.35,
              }}>
                <div style={{ fontSize: 16 }}>{u.icon}</div>
                <div style={{ fontSize: 10, fontWeight: 700, marginTop: 2 }}>{u.name}</div>
                <div style={{ fontSize: 9, opacity: 0.45 }}>{u.desc}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: u.owned ? C.leaf : C.orange, marginTop: 3 }}>
                  {u.owned ? "✓ Active" : "$" + u.cost}
                </div>
              </button>
            );
          })}
        </div>

        {/* Execute */}
        <button onClick={runRound} disabled={deployCount === 0} style={Object.assign({}, btnPrimary, {
          width: "100%", opacity: deployCount > 0 ? 1 : 0.3,
          background: deployCount > 0 ? C.deepTeal : C.leaf,
        })}>
          {deployCount > 0 ? "Execute Round " + round + " (" + deployCount + " zone" + (deployCount > 1 ? "s" : "") + ")" : "Deploy to at least 1 zone"}
        </button>
      </div>

      {/* Footer */}
      <div style={{
        padding: "8px 16px", borderTop: "1px solid rgba(0,62,73,0.06)",
        background: "rgba(255,242,232,0.85)", textAlign: "center",
        fontSize: 9, opacity: 0.3, letterSpacing: 1.5, flexShrink: 0,
        position: "relative", zIndex: 1, color: C.deepTeal,
      }}>
        ARCHWAY PET FOOD • HYPOALLERGENIC • UNSHAKABLY SUSTAINABLE
      </div>
    </div>
  );
}
