import { useState, useEffect } from "react";
import {
  C, ZONES, METHODS, PRODUCTS, UPGRADES, FACTS, EVENTS, DIFFICULTY,
  calcScore, getGrade, getNamedEnding, getComboBonus,
} from "./constants.js";
import {
  playClick, playDeploy, playGood, playBad, playPup, playEvent, playUpgrade, playRoundEnd,
} from "./sounds.js";

// ===== SVG COMPONENTS =====

function ArchDog({ x, y, scale, color, flip, happy, wag }) {
  var s = scale || 1;
  var f = flip ? -1 : 1;
  var c = color || C.deepTeal;
  return (
    <g transform={"translate(" + x + "," + y + ") scale(" + (s * f) + "," + s + ")"}>
      {/* Body — organic rounded shape instead of plain ellipse */}
      <path d="M -12 5 Q -14 13 -10 19 Q -5 23 0 23 Q 5 23 10 19 Q 14 13 12 5 Q 11 -1 5 -3 Q 0 -5 -5 -3 Q -11 -1 -12 5 Z"
        fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round" />
      {/* Back left leg + paw */}
      <path d="M -8 21 L -9 28" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M -9 28 Q -12 30 -10 31 Q -7 31 -6 29" stroke={c} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Back right leg + paw */}
      <path d="M -2 22 L -2 29" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M -2 29 Q -5 31 -3 32 Q 0 32 1 30" stroke={c} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Front left leg + paw */}
      <path d="M 5 21 L 6 28" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M 6 28 Q 3 30 5 31 Q 8 31 9 29" stroke={c} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Front right leg + paw */}
      <path d="M 10 18 L 12 26" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M 12 26 Q 9 28 11 29 Q 14 29 15 27" stroke={c} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Neck */}
      <path d="M 9 2 Q 13 -2 17 -3" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Head */}
      <circle cx="21" cy="-5" r="7.5" fill="none" stroke={c} strokeWidth="1.8" />
      {/* Snout / muzzle bump */}
      <path d="M 22 -1 Q 28 -1 29 1 Q 29 3 26 3 Q 22 3 22 1 Z"
        fill="none" stroke={c} strokeWidth="1.3" strokeLinejoin="round" />
      {/* Nose */}
      <ellipse cx="28" cy="1" rx="1.5" ry="1" fill={c} />
      {/* Eye */}
      <circle cx="20" cy="-7" r="1.8" fill={c} />
      <circle cx="20.5" cy="-7.5" r="0.55" fill="white" />
      {/* Eyebrow */}
      <path d="M 18 -9.5 Q 20.5 -11 23 -9.5" stroke={c} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.45" />
      {/* Floppy ear — filled teardrop shape */}
      <path d="M 15 -10 Q 10 -17 12 -5 Q 14 -11 15 -10 Z"
        fill={c} opacity="0.3" stroke={c} strokeWidth="1.3" strokeLinejoin="round" />
      {/* Mouth */}
      {happy && <path d="M 23 3 Q 25.5 5 28 3" stroke={c} strokeWidth="0.9" fill="none" strokeLinecap="round" />}
      {/* Tongue — rounded shape */}
      {happy && <path d="M 24 4 Q 23 8 25.5 8 Q 28 8 27 4" fill={C.pink} stroke={c} strokeWidth="0.5" />}
      {/* Tail — more dynamic 4-keyframe wag */}
      <path d="M -12 9 Q -20 3 -19 -3 Q -18 -7 -13 -5" stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round">
        {wag && (
          <animate
            attributeName="d"
            values="M -12 9 Q -20 3 -19 -3 Q -18 -7 -13 -5;M -12 9 Q -22 5 -20 -1 Q -19 -5 -14 -3;M -12 9 Q -18 1 -16 -5 Q -15 -9 -10 -7;M -12 9 Q -22 5 -20 -1 Q -19 -5 -14 -3;M -12 9 Q -20 3 -19 -3 Q -18 -7 -13 -5"
            dur="0.75s"
            repeatCount="indefinite"
          />
        )}
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

// Proper fish silhouette: body + forked tail + fins + eye, swims via animateTransform.
// Origin is at the tail root (x=0). Nose is at x = l*0.9 (faces right by default).
// flip=true mirrors around x=0 so the fish faces left (for right→left swimmers).
function CarpFish({ y, length, color, opacity, swimDur, fromX, toX, tailDur, flip }) {
  var l = length || 12;
  var c = color || C.deepTeal;
  var op = opacity !== undefined ? opacity : 0.25;
  var fy = y !== undefined ? y : 0;
  var from = (fromX !== undefined ? fromX : -(l + 5)) + " " + fy;
  var to = (toX !== undefined ? toX : 220) + " " + fy;

  // Body: tapers from wide middle to pointed nose (right) and tail root (left)
  var body = "M " + l*0.9 + " 0"
    + " Q " + l*0.6 + " " + -(l*0.23) + " 0 0"
    + " Q " + l*0.6 + " " + l*0.23 + " " + l*0.9 + " 0 Z";

  // Forked tail — three keyframes for the wag
  function tailPath(topAngle, btmAngle) {
    return "M 0 0"
      + " L " + -(l*topAngle) + " " + -(l*0.28)
      + " Q " + -(l*0.08) + " 0 0 0"
      + " Q " + -(l*0.08) + " 0 " + -(l*btmAngle) + " " + l*0.28 + " Z";
  }
  var tail0 = tailPath(0.20, 0.20);
  var tail1 = tailPath(0.15, 0.25);
  var tail2 = tailPath(0.25, 0.15);

  // Dorsal fin (top)
  var dorsal = "M " + l*0.28 + " " + -(l*0.2)
    + " Q " + l*0.44 + " " + -(l*0.38) + " " + l*0.62 + " " + -(l*0.2);

  // Pectoral fin (side)
  var pectoral = "M " + l*0.44 + " " + l*0.1
    + " Q " + l*0.47 + " " + l*0.27 + " " + l*0.62 + " " + l*0.17 + " Z";

  return (
    <g opacity={op}>
      <animateTransform attributeName="transform" type="translate"
        from={from} to={to} dur={swimDur || "9s"} repeatCount="indefinite" />
      <g transform={flip ? "scale(-1,1)" : undefined}>
        {/* Body */}
        <path d={body} fill={c} />
        {/* Scale glints */}
        <path d={"M " + l*0.35 + " " + -(l*0.07) + " Q " + l*0.43 + " 0 " + l*0.35 + " " + l*0.07}
          stroke="white" strokeWidth={Math.max(0.4, l*0.024)} fill="none" opacity="0.22" />
        <path d={"M " + l*0.52 + " " + -(l*0.1) + " Q " + l*0.6 + " 0 " + l*0.52 + " " + l*0.1}
          stroke="white" strokeWidth={Math.max(0.4, l*0.024)} fill="none" opacity="0.22" />
        {/* Dorsal fin */}
        <path d={dorsal} stroke={c} strokeWidth={Math.max(0.7, l*0.062)} fill="none" strokeLinecap="round" />
        {/* Pectoral fin */}
        <path d={pectoral} fill={c} opacity="0.55" />
        {/* Animated forked tail */}
        <path d={tail0} fill={c}>
          <animate attributeName="d" values={[tail0, tail1, tail0, tail2, tail0].join(";")}
            dur={tailDur || "0.45s"} repeatCount="indefinite" />
        </path>
        {/* Eye with highlight */}
        <circle cx={l*0.77} cy={-(l*0.04)} r={l*0.07} fill="white" />
        <circle cx={l*0.79} cy={-(l*0.04)} r={l*0.04} fill={c} />
        <circle cx={l*0.81} cy={-(l*0.06)} r={l*0.018} fill="white" />
      </g>
    </g>
  );
}

function WaterBg() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, " + C.cream + " 0%, " + C.milk + " 50%, " + C.cream + " 100%)" }} />
      <svg style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "30%" }} viewBox="0 0 400 150" preserveAspectRatio="none">
        <path d="M0 40 Q50 25 100 40 Q150 55 200 35 Q250 20 300 40 Q350 60 400 35 L400 150 L0 150Z" fill={C.lake} opacity="0.12">
          <animate attributeName="d" values="M0 40 Q50 25 100 40 Q150 55 200 35 Q250 20 300 40 Q350 60 400 35 L400 150 L0 150Z;M0 35 Q50 55 100 30 Q150 20 200 45 Q250 55 300 30 Q350 20 400 40 L400 150 L0 150Z;M0 40 Q50 25 100 40 Q150 55 200 35 Q250 20 300 40 Q350 60 400 35 L400 150 L0 150Z" dur="6s" repeatCount="indefinite" />
        </path>
        <path d="M0 70 Q60 55 120 75 Q180 90 240 65 Q300 50 360 70 Q380 80 400 65 L400 150 L0 150Z" fill={C.lake} opacity="0.08">
          <animate attributeName="d" values="M0 70 Q60 55 120 75 Q180 90 240 65 Q300 50 360 70 Q380 80 400 65 L400 150 L0 150Z;M0 65 Q60 85 120 60 Q180 45 240 75 Q300 85 360 60 Q380 55 400 70 L400 150 L0 150Z;M0 70 Q60 55 120 75 Q180 90 240 65 Q300 50 360 70 Q380 80 400 65 L400 150 L0 150Z" dur="8s" repeatCount="indefinite" />
        </path>
      </svg>
      <svg style={{ position: "absolute", top: "55%", left: 0, width: "100%", height: "30%" }} viewBox="0 0 400 200">
        <CarpFish y={60} length={28} color={C.leaf} opacity={0.11} fromX={-35} toX={435} swimDur="14s" tailDur="0.5s" />
        <CarpFish y={120} length={22} color={C.leaf} opacity={0.08} fromX={430} toX={-30} swimDur="18s" tailDur="0.55s" flip={true} />
        <CarpFish y={90} length={16} color={C.deepTeal} opacity={0.06} fromX={-25} toX={425} swimDur="22s" tailDur="0.4s" />
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
      <rect y="0" width="200" height="18" fill={landColor} opacity="0.3" />
      {Array.from({ length: 6 }).map(function (_, i) {
        return <path key={"g" + i} d={"M" + (10 + i * 32) + " 16 Q" + (12 + i * 32) + " 10 " + (14 + i * 32) + " 16"} stroke={C.grass} strokeWidth="1" fill="none" opacity="0.5" />;
      })}
      {Array.from({ length: treeCount }).map(function (_, i) {
        var tx = 25 + i * 45;
        return (
          <g key={"t" + i}>
            <line x1={tx} y1={8} x2={tx} y2={16} stroke={C.deepTeal} strokeWidth="1.2" opacity="0.4" />
            <circle cx={tx} cy={6} r={health > 60 ? 5 : 3} fill={C.leaf} opacity={health > 50 ? 0.6 : 0.3} />
          </g>
        );
      })}
      {health > 40 && <FlowerCluster x={150} y={11} color={C.sky} />}
      {health > 65 && <FlowerCluster x={60} y={12} color={C.pink} />}
      {health > 55 && <Bird x={30} y={3} />}
      {health > 75 && <Bird x={130} y={2} />}
      <rect y="18" width="200" height="27" fill={waterColor} opacity={waterOp} />
      <ellipse cx="50" cy="30" rx="18" ry="1.2" fill="white" opacity="0.15">
        <animate attributeName="rx" values="18;24;18" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="140" cy="35" rx="14" ry="1" fill="white" opacity="0.1">
        <animate attributeName="rx" values="14;20;14" dur="4s" repeatCount="indefinite" />
      </ellipse>
      {Array.from({ length: fishCount }).map(function (_, i) {
        var fy = 24 + (i % 3) * 6;
        var dur = (4 + i * 1.3) + "s";
        return (
          <CarpFish key={"c" + i} y={fy} length={10} color={C.deepTeal} opacity={0.22}
            fromX={-15 - i * 12} toX={210} swimDur={dur} tailDur="0.38s" />
        );
      })}
      {Array.from({ length: nativeCount }).map(function (_, i) {
        var fy = 26 + i * 5;
        return (
          <CarpFish key={"n" + i} y={fy} length={7} color={C.lake} opacity={0.45}
            fromX={215} toX={-12} swimDur={(7 + i * 2) + "s"} tailDur="0.35s" flip={true} />
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
      {Array.from({ length: n }).map(function (_, i) {
        return <ArchDog key={i} x={15 + i * 20} y={5} scale={0.55} color={C.deepTeal} flip={i % 3 === 0} happy={happy} wag={true} />;
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

function Sparkline({ data, color }) {
  if (!data || data.length < 2) return null;
  var w = 52;
  var h = 16;
  var pts = data.map(function (v, i) {
    return (i / (data.length - 1)) * w + "," + (h - (v / 100) * h);
  }).join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polyline points={pts} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ===== MAIN GAME =====

export default function Game() {
  const [phase, setPhase] = useState("title");
  const [difficulty, setDifficulty] = useState("normal");
  const [round, setRound] = useState(1);
  const [money, setMoney] = useState(1000);
  const [zones, setZones] = useState(ZONES.map(function (z) { return Object.assign({}, z); }));
  const [picked, setPicked] = useState(null);
  const [assigned, setAssigned] = useState({});
  const [harvested, setHarvested] = useState(0);
  const [pupsFed, setPupsFed] = useState(0);
  const [log, setLog] = useState([]);
  const [factIdx, setFactIdx] = useState(0);
  const [upgrades, setUpgrades] = useState({ plant: 0, lab: 0, vet: 0, cold: 0, zero: 0 });
  const [copied, setCopied] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [pendingResults, setPendingResults] = useState(null);
  const [executingStep, setExecutingStep] = useState(0);
  const [zoneHistory, setZoneHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [productUnlock, setProductUnlock] = useState(null);
  var maxRounds = 12;

  // ===== ANIMATION EFFECT =====
  useEffect(function () {
    if (phase !== "executing" || !pendingResults) return;
    if (executingStep >= ZONES.length) {
      // All zones animated — apply results and advance
      setZones(pendingResults.newZones);
      setHarvested(function (h) { return h + pendingResults.roundLbs; });
      setPupsFed(function (p) { return p + pendingResults.pups; });
      setMoney(function (m) { return m + pendingResults.income; });
      setLog(pendingResults.newLog);
      setZoneHistory(function (h) {
        return [...h, pendingResults.newZones.map(function (z) { return { carp: z.carp, health: z.health }; })];
      });
      setAssigned({});
      setPicked(null);
      setFactIdx(function (f) { return (f + 1) % FACTS.length; });
      playRoundEnd();
      if (round >= maxRounds) {
        setPhase("gameover");
      } else {
        setPhase("results");
      }
      setPendingResults(null);
      setExecutingStep(0);
      return;
    }
    var entry = pendingResults.newLog[executingStep];
    if (entry) { entry.good ? playGood() : playBad(); }
    var timer = setTimeout(function () {
      setExecutingStep(function (s) { return s + 1; });
    }, 550);
    return function () { clearTimeout(timer); };
  }, [phase, executingStep, pendingResults]);

  // ===== FETCH LEADERBOARD ON GAME OVER =====
  useEffect(function () {
    if (phase !== "gameover") return;
    fetch("/api/scores")
      .then(function (r) { return r.json(); })
      .then(function (data) { setLeaderboard(data || []); })
      .catch(function () {});
  }, [phase]);

  // ===== GAME LOGIC =====

  function startGame() {
    var diff = DIFFICULTY[difficulty];
    setMoney(diff.startMoney);
    var event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    setCurrentEvent(event);
    playEvent();
    setPhase("plan");
  }

  function pickZone(id) {
    playClick();
    setPicked(id === picked ? null : id);
  }

  function assignMethod(mid) {
    if (!picked) return;
    var m = METHODS.find(function (x) { return x.id === mid; });
    var refund = assigned[picked]
      ? METHODS.find(function (x) { return x.id === assigned[picked]; }).cost
      : 0;
    if (money + refund < m.cost) return;
    playDeploy();
    setMoney(function (p) { return p + refund - m.cost; });
    setAssigned(function (p) { var n = Object.assign({}, p); n[picked] = mid; return n; });
  }

  function removeAssignment(zid) {
    var mid = assigned[zid];
    if (!mid) return;
    playClick();
    var m = METHODS.find(function (x) { return x.id === mid; });
    setMoney(function (p) { return p + m.cost; });
    setAssigned(function (p) { var n = Object.assign({}, p); delete n[zid]; return n; });
  }

  function buyUpgrade(upgradeId) {
    var upg = UPGRADES.find(function (u) { return u.id === upgradeId; });
    var currentLevel = upgrades[upgradeId];
    if (currentLevel >= 2) return;
    var tier = upg.tiers[currentLevel];
    if (money < tier.cost) return;
    playUpgrade();
    setMoney(function (p) { return p - tier.cost; });
    setUpgrades(function (prev) {
      var next = Object.assign({}, prev);
      next[upgradeId] = currentLevel + 1;
      return next;
    });
    // Show product unlock modal for zero waste tier 1
    if (upgradeId === "zero" && currentLevel === 0 && upg.product) {
      setProductUnlock(upg.product);
    }
  }

  function runRound() {
    var diff = DIFFICULTY[difficulty];
    var event = currentEvent || {};
    var effMult = (upgrades.lab === 2 ? 1.6 : upgrades.lab === 1 ? 1.3 : 1) *
      (event.removalMult || 1) *
      diff.removalMult;

    var newLog = [];
    var roundLbs = 0;

    var newZones = zones.map(function (z, zIdx) {
      var nz = Object.assign({}, z);
      var mid = assigned[z.id];

      if (mid) {
        var m = METHODS.find(function (x) { return x.id === mid; });
        var comboBonus = getComboBonus(z.id, assigned);
        var comboBonusMult = comboBonus ? (1 + comboBonus.bonus) : 1;
        var rem = Math.min(
          nz.carp,
          Math.round(m.power * effMult * comboBonusMult * (0.8 + Math.random() * 0.4))
        );
        nz.carp = Math.max(0, nz.carp - rem);
        var healthGain = Math.round((Math.max(0, rem / 2 + m.eco)) * (event.healthMult || 1));
        if (event.healthBonus && nz.health > 50) healthGain += event.healthBonus;
        nz.health = Math.min(100, nz.health + healthGain);
        roundLbs += rem * 50;
        var comboNote = comboBonus ? " +" + Math.round(comboBonus.bonus * 100) + "% combo" : "";
        newLog.push({ text: z.name + ": -" + rem + "% carp (" + m.name + comboNote + ")", good: true });
      } else {
        var base = 3 + Math.random() * 5;
        var sp = Math.round(base * diff.spreadMult + (event.spreadBonus || 0) + (event.unmangedSpreadBonus || 0));
        // Minimum carp spread — unmanaged zones never go below 5%
        nz.carp = Math.min(100, Math.max(5, nz.carp + sp));
        nz.health = Math.max(0, nz.health - sp / 2);
        newLog.push({ text: z.name + ": +" + sp + "% carp (unmanaged)", good: false });
      }
      return nz;
    });

    var yieldMult = (upgrades.plant === 2 ? 1.8 : upgrades.plant === 1 ? 1.4 : 1) *
      (upgrades.cold === 2 ? 2.2 : upgrades.cold === 1 ? 1.6 : 1);
    var usable = Math.round(roundLbs * 0.65 * yieldMult);
    var prodCount = upgrades.zero > 0 ? 5 : 3;
    var rareMult = upgrades.zero >= 2 ? 2 : 1;
    var shares = [0.4, 0.25, 0.25, 0.05, 0.05];
    var pups = 0;
    for (var i = 0; i < prodCount; i++) {
      var share = Math.round(usable * shares[i]) * (i >= 3 ? rareMult : 1);
      pups += Math.floor(share / PRODUCTS[i].lbs) * PRODUCTS[i].pups;
    }

    var vetIncome = upgrades.vet === 2 ? 350 : upgrades.vet === 1 ? 150 : 0;
    var income = Math.round((400 + vetIncome + Math.round(usable * 0.8)) * diff.incomeMult);
    income += event.bonusMoney || 0;

    setPendingResults({ newZones, roundLbs, pups, income, newLog });
    setExecutingStep(0);
    setPhase("executing");
  }

  function nextRound() {
    var event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    setCurrentEvent(event);
    playEvent();
    setRound(function (r) { return r + 1; });
    setPhase("plan");
  }

  function resetAll() {
    setPhase("title");
    setRound(1);
    setMoney(DIFFICULTY[difficulty].startMoney);
    setZones(ZONES.map(function (z) { return Object.assign({}, z); }));
    setPicked(null);
    setAssigned({});
    setHarvested(0);
    setPupsFed(0);
    setLog([]);
    setUpgrades({ plant: 0, lab: 0, vet: 0, cold: 0, zero: 0 });
    setCopied(false);
    setCurrentEvent(null);
    setPendingResults(null);
    setExecutingStep(0);
    setZoneHistory([]);
    setScoreSubmitted(false);
    setPlayerName("");
    setProductUnlock(null);
  }

  function submitScore(name, score) {
    fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, score: score }),
    })
      .then(function () {
        setScoreSubmitted(true);
        return fetch("/api/scores");
      })
      .then(function (r) { return r.json(); })
      .then(function (data) { setLeaderboard(data || []); })
      .catch(function () { setScoreSubmitted(true); });
  }

  function shareScore(shareText) {
    // Build a simple canvas score card
    try {
      var canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 320;
      var ctx = canvas.getContext("2d");

      // Background
      ctx.fillStyle = "#FFF2E8";
      ctx.fillRect(0, 0, 600, 320);

      // Teal header bar
      ctx.fillStyle = "#003E49";
      ctx.fillRect(0, 0, 600, 60);

      ctx.fillStyle = "#FFF2E8";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText("Carp Cleanup", 24, 38);
      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#F0B468";
      ctx.fillText("by Archway Pet Food", 24, 54);

      // Grade
      var sc = calcScore(avgHealth, avgCarp, pupsFed, harvested);
      var g = getGrade(sc);
      ctx.font = "bold 72px sans-serif";
      ctx.fillStyle = g.c;
      ctx.fillText(g.l, 480, 160);

      ctx.font = "bold 28px sans-serif";
      ctx.fillStyle = "#F0B468";
      ctx.fillText(sc.toLocaleString() + " pts", 24, 120);

      ctx.font = "bold 18px sans-serif";
      ctx.fillStyle = "#003E49";
      ctx.fillText(g.t, 24, 148);

      var end = getNamedEnding(zones);
      ctx.font = "14px sans-serif";
      ctx.fillStyle = "#003E49";
      ctx.globalAlpha = 0.7;
      ctx.fillText(end.title, 24, 172);
      ctx.globalAlpha = 1;

      // Stats
      var stats = [
        ["Carp Removed", harvested.toLocaleString() + " lbs"],
        ["Pups Fed", pupsFed.toLocaleString()],
        ["Eco Recovery", avgHealth + "%"],
        ["Carp Left", avgCarp + "%"],
      ];
      ctx.font = "13px sans-serif";
      stats.forEach(function (s, i) {
        var col = i < 2 ? 24 : 310;
        var row = i < 2 ? i : i - 2;
        ctx.fillStyle = "#003E49";
        ctx.globalAlpha = 0.45;
        ctx.fillText(s[0].toUpperCase(), col, 216 + row * 34);
        ctx.globalAlpha = 1;
        ctx.font = "bold 17px sans-serif";
        ctx.fillText(s[1], col, 234 + row * 34);
        ctx.font = "13px sans-serif";
      });

      // Footer
      ctx.fillStyle = "#003E49";
      ctx.globalAlpha = 0.25;
      ctx.font = "11px sans-serif";
      ctx.fillText("ARCHWAY PET FOOD  •  HYPOALLERGENIC  •  UNSHAKABLY SUSTAINABLE", 24, 308);
      ctx.globalAlpha = 1;

      var dataUrl = canvas.toDataURL("image/png");

      if (navigator.share && navigator.canShare) {
        canvas.toBlob(function (blob) {
          var file = new File([blob], "carp-cleanup-score.png", { type: "image/png" });
          if (navigator.canShare({ files: [file] })) {
            navigator.share({ files: [file], title: "Carp Cleanup", text: shareText });
          } else {
            downloadImage(dataUrl);
          }
        });
      } else {
        downloadImage(dataUrl);
      }
    } catch (e) {
      // Canvas failed — fall back to clipboard
      copyText(shareText);
    }
  }

  function downloadImage(dataUrl) {
    var a = document.createElement("a");
    a.href = dataUrl;
    a.download = "carp-cleanup-score.png";
    a.click();
  }

  function copyText(text) {
    function onCopied() { setCopied(true); setTimeout(function () { setCopied(false); }, 2000); }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(onCopied);
    } else {
      var ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      onCopied();
    }
  }

  // ===== COMPUTED VALUES =====
  var avgHealth = Math.round(zones.reduce(function (s, z) { return s + z.health; }, 0) / zones.length);
  var avgCarp = Math.round(zones.reduce(function (s, z) { return s + z.carp; }, 0) / zones.length);
  var deployCount = Object.keys(assigned).length;
  var projectedScore = calcScore(avgHealth, avgCarp, pupsFed, harvested);
  var projectedGrade = getGrade(projectedScore);

  // ===== SHARED STYLES =====
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
  var headFont = "'DM Serif Display', Georgia, serif";
  var bodyFont = "'DM Sans', system-ui, sans-serif";

  var css = (
    <style>{`
      @keyframes pupWag { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
      * { box-sizing: border-box; }
    `}</style>
  );

  // ===== PRODUCT UNLOCK MODAL =====
  function ProductUnlockModal({ product, onClose }) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,62,73,0.5)", display: "flex",
        alignItems: "center", justifyContent: "center", padding: 24,
      }} onClick={onClose}>
        <div style={Object.assign({}, cardStyle, {
          padding: 24, maxWidth: 340, width: "100%", textAlign: "center",
          animation: "fadeIn 0.3s ease",
        })} onClick={function (e) { e.stopPropagation(); }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>{product.icons.join(" ")}</div>
          <div style={{
            background: C.grass + "33", border: "1px solid " + C.grass + "55",
            color: C.deepTeal, padding: "3px 12px", borderRadius: 20,
            fontSize: 9, fontWeight: 700, letterSpacing: 2, display: "inline-block", marginBottom: 12,
          }}>PRODUCT UNLOCKED</div>
          <div style={{ fontFamily: headFont, fontSize: 20, color: C.deepTeal, marginBottom: 8 }}>{product.name}</div>
          <p style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.65, color: C.deepTeal, marginBottom: 20 }}>{product.blurb}</p>
          <button onClick={onClose} style={btnPrimary}>Got it!</button>
        </div>
      </div>
    );
  }

  // ===== EVENT BANNER =====
  function EventBanner({ event }) {
    if (!event) return null;
    return (
      <div style={{
        background: event.bad ? C.pink + "55" : C.grass + "44",
        border: "1px solid " + (event.bad ? C.pink : C.grass),
        borderRadius: 10, padding: "8px 12px", marginBottom: 12,
        animation: "slideIn 0.3s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>{event.icon}</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.deepTeal }}>{event.name}</div>
            <div style={{ fontSize: 11, opacity: 0.65, color: C.deepTeal }}>{event.desc}</div>
          </div>
        </div>
      </div>
    );
  }

  // ===== TITLE SCREEN =====
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

          <div style={{ fontFamily: headFont, fontSize: 56, lineHeight: 1, color: C.deepTeal, marginBottom: 4 }}>
            Carp Cleanup
          </div>

          <p style={{ fontSize: 16, color: C.deepTeal, opacity: 0.6, fontStyle: "italic", margin: "8px 0 20px" }}>
            Save Our Waterways. Feed Our Pups.
          </p>

          <svg viewBox="0 0 240 90" style={{ width: "100%", maxWidth: 340, height: "auto", margin: "0 auto 20px", display: "block" }}>
            <rect width="240" height="90" rx="12" fill={C.milk} />
            <rect y="0" width="240" height="40" rx="12" fill={C.leaf} opacity="0.25" />
            {[20, 50, 90, 140, 180, 210].map(function (gx, i) {
              return <path key={i} d={"M" + gx + " 38 Q" + (gx + 3) + " 30 " + (gx + 6) + " 38"} stroke={C.grass} strokeWidth="1.2" fill="none" opacity="0.6" />;
            })}
            <line x1="30" y1="20" x2="30" y2="38" stroke={C.deepTeal} strokeWidth="1.5" opacity="0.3" />
            <circle cx="30" cy="16" r="8" fill={C.leaf} opacity="0.5" />
            <line x1="190" y1="16" x2="190" y2="38" stroke={C.deepTeal} strokeWidth="1.5" opacity="0.3" />
            <circle cx="190" cy="12" r="10" fill={C.leaf} opacity="0.5" />
            <FlowerCluster x={70} y={30} color={C.sky} />
            <FlowerCluster x={155} y={32} color={C.pink} />
            <Bird x={50} y={8} />
            <Bird x={160} y={5} />
            <rect y="40" width="240" height="50" fill={C.lake} opacity="0.2" />
            <ellipse cx="60" cy="58" rx="25" ry="2" fill="white" opacity="0.2">
              <animate attributeName="rx" values="25;35;25" dur="3s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="170" cy="65" rx="20" ry="1.5" fill="white" opacity="0.15">
              <animate attributeName="rx" values="20;28;20" dur="4s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cy="55" rx="8" ry="3" fill={C.deepTeal} opacity="0.15">
              <animate attributeName="cx" from="-10" to="250" dur="8s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cy="70" rx="6" ry="2.5" fill={C.deepTeal} opacity="0.12">
              <animate attributeName="cx" from="250" to="-10" dur="10s" repeatCount="indefinite" />
            </ellipse>
            <ArchDog x={110} y={10} scale={0.9} color={C.deepTeal} happy={true} wag={true} />
          </svg>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 20 }}>
            {["Hypoallergenic", "Sustainable", "Invasive → Nutritious"].map(function (t) {
              return (
                <span key={t} style={{
                  background: C.yellow + "44", border: "1px solid " + C.orange + "66",
                  padding: "4px 12px", borderRadius: 16, fontSize: 11, color: C.deepTeal, fontWeight: 600,
                }}>{t}</span>
              );
            })}
          </div>

          <p style={{ fontSize: 14, opacity: 0.55, lineHeight: 1.7, marginBottom: 24, color: C.deepTeal }}>
            Asian carp are destroying America's rivers. Deploy removal teams across 5 zones,
            restore ecosystems, and turn every catch into hypoallergenic nutrition for pups everywhere.
          </p>

          {/* Difficulty selector */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, opacity: 0.4, marginBottom: 10, fontWeight: 700 }}>SELECT DIFFICULTY</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              {Object.entries(DIFFICULTY).map(function ([key, diff]) {
                var active = difficulty === key;
                return (
                  <button key={key} onClick={function () { playClick(); setDifficulty(key); }} style={{
                    ...btn,
                    background: active ? C.deepTeal : "white",
                    color: active ? C.cream : C.deepTeal,
                    border: active ? "2px solid " + C.deepTeal : "2px solid rgba(0,62,73,0.15)",
                    borderRadius: 12, padding: "10px 16px", textAlign: "center",
                    flex: 1,
                  }}>
                    <div style={{ fontSize: 18 }}>{diff.emoji}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, marginTop: 2 }}>{diff.label}</div>
                    <div style={{ fontSize: 9, opacity: active ? 0.7 : 0.4, marginTop: 1 }}>
                      ${diff.startMoney}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button onClick={startGame} style={btnPrimary}>
            Start Mission
          </button>

          <div style={{ marginTop: 36, fontSize: 10, opacity: 0.25, letterSpacing: 2, color: C.deepTeal }}>
            ARCHWAY PET FOOD • UNSHAKABLY SUSTAINABLE
          </div>
        </div>
      </div>
    );
  }

  // ===== EXECUTING SCREEN (animated round) =====
  if (phase === "executing") {
    var visibleLog = pendingResults ? pendingResults.newLog.slice(0, executingStep) : [];
    return (
      <div style={{
        minHeight: "100vh", fontFamily: bodyFont, color: C.deepTeal,
        padding: 16, position: "relative", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        {css}
        <WaterBg />
        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440 }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, opacity: 0.4, marginBottom: 6 }}>ROUND {round} IN PROGRESS</div>
            <div style={{ fontFamily: headFont, fontSize: 24, color: C.deepTeal }}>Deploying Teams…</div>
            {currentEvent && (
              <div style={{ marginTop: 12 }}>
                <EventBanner event={currentEvent} />
              </div>
            )}
          </div>

          <div style={Object.assign({}, cardStyle, { padding: 14 })}>
            {ZONES.map(function (z, i) {
              var entry = visibleLog[i];
              var isPending = i >= executingStep;
              return (
                <div key={z.id} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 0",
                  borderBottom: i < ZONES.length - 1 ? "1px solid rgba(0,62,73,0.06)" : "none",
                  opacity: isPending ? 0.25 : 1,
                  transition: "opacity 0.3s ease",
                }}>
                  <div style={{ fontSize: 16 }}>
                    {isPending ? "⏳" : entry && entry.good ? "✅" : "⚠️"}
                  </div>
                  <div style={{ fontSize: 13, color: entry && !entry.good ? "#c0392b" : C.deepTeal }}>
                    {isPending ? z.name + "…" : entry ? entry.text : z.name}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
              {ZONES.map(function (_, i) {
                return (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: i < executingStep ? C.deepTeal : "rgba(0,62,73,0.15)",
                    transition: "background 0.3s ease",
                  }} />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== RESULTS SCREEN =====
  if (phase === "results") {
    return (
      <div style={{ minHeight: "100vh", fontFamily: bodyFont, color: C.deepTeal, padding: 16, position: "relative" }}>
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

          {currentEvent && <EventBanner event={currentEvent} />}

          <div style={Object.assign({}, cardStyle, { padding: 14, marginBottom: 14 })}>
            {log.map(function (entry, i) {
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

  // ===== GAME OVER SCREEN =====
  if (phase === "gameover") {
    var sc = calcScore(avgHealth, avgCarp, pupsFed, harvested);
    var g = getGrade(sc);
    var ending = getNamedEnding(zones);
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
          <div style={{ fontSize: 10, letterSpacing: 4, opacity: 0.4, marginBottom: 8 }}>MISSION COMPLETE</div>

          {/* Grade badge */}
          <div style={{
            width: 90, height: 90, borderRadius: "50%", display: "flex", alignItems: "center",
            justifyContent: "center", border: "3px solid " + g.c, fontSize: 44, fontWeight: 900,
            boxShadow: "0 0 24px " + g.c + "55", margin: "0 auto 8px", background: "white",
          }}>{g.l}</div>

          {/* Named ending */}
          <div style={{ fontFamily: headFont, fontSize: 18, color: C.deepTeal }}>{ending.title}</div>
          <div style={{ fontSize: 12, opacity: 0.5, margin: "4px 0 8px" }}>{ending.desc}</div>
          <div style={{ fontFamily: headFont, fontSize: 36, color: C.orange, marginBottom: 16 }}>{sc.toLocaleString()} pts</div>

          <div style={Object.assign({}, cardStyle, { padding: "8px 12px", marginBottom: 14 })}>
            <PupPack count={pupsFed} />
            <div style={{ fontSize: 12, opacity: 0.5, paddingBottom: 6, color: C.deepTeal }}>
              {pupsFed.toLocaleString()} pups eating healthier!
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
            {[
              { icon: "🎣", val: harvested.toLocaleString() + " lbs", lab: "Carp Removed" },
              { icon: "🐕", val: pupsFed.toLocaleString(), lab: "Pups Fed" },
              { icon: "🌿", val: avgHealth + "%", lab: "Eco Recovery" },
              { icon: "📉", val: avgCarp + "%", lab: "Carp Left" },
            ].map(function (s) {
              return (
                <div key={s.lab} style={Object.assign({}, cardStyle, { padding: 12 })}>
                  <div style={{ fontSize: 18 }}>{s.icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{s.val}</div>
                  <div style={{ fontSize: 10, opacity: 0.4 }}>{s.lab}</div>
                </div>
              );
            })}
          </div>

          {/* Submit to leaderboard */}
          {!scoreSubmitted && (
            <div style={Object.assign({}, cardStyle, { padding: 14, marginBottom: 14 })}>
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8, color: C.deepTeal }}>Submit to Leaderboard</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  placeholder="Your name"
                  value={playerName}
                  maxLength={20}
                  onChange={function (e) { setPlayerName(e.target.value); }}
                  style={{
                    flex: 1, border: "1px solid rgba(0,62,73,0.2)", borderRadius: 8,
                    padding: "8px 12px", fontSize: 13, fontFamily: bodyFont, color: C.deepTeal,
                    background: C.milk, outline: "none",
                  }}
                />
                <button
                  onClick={function () { if (playerName.trim()) submitScore(playerName.trim(), sc); }}
                  disabled={!playerName.trim()}
                  style={Object.assign({}, btn, {
                    background: playerName.trim() ? C.deepTeal : "rgba(0,62,73,0.15)",
                    color: playerName.trim() ? C.cream : "rgba(0,62,73,0.3)",
                    padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                  })}
                >Submit</button>
              </div>
            </div>
          )}

          {/* Leaderboard */}
          {leaderboard.length > 0 && (
            <div style={Object.assign({}, cardStyle, { padding: 14, marginBottom: 14, textAlign: "left" })}>
              <div style={{ fontSize: 10, letterSpacing: 2, opacity: 0.4, marginBottom: 8, fontWeight: 700 }}>
                TOP PLAYERS
              </div>
              {leaderboard.slice(0, 5).map(function (entry, i) {
                return (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "5px 0",
                    borderBottom: i < Math.min(leaderboard.length, 5) - 1 ? "1px solid rgba(0,62,73,0.06)" : "none",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, opacity: 0.4, width: 16 }}>{i + 1}</span>
                      <span style={{ fontSize: 13 }}>{entry.name}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.orange }}>{entry.score.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Archway brand card + CTA */}
          <div style={Object.assign({}, cardStyle, {
            padding: 14, marginBottom: 20, background: C.cream, border: "1px solid " + C.orange + "33",
          })}>
            <div style={{ fontFamily: headFont, fontSize: 16, color: C.deepTeal, marginBottom: 4 }}>
              Archway Pet Food
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>
              Hypoallergenic dog food & treats made from invasive Asian carp.
              <strong style={{ color: C.orange }}> Unshakably sustainable.</strong>
            </p>
            <a
              href="https://archwaypetfood.com"
              target="_blank"
              rel="noopener noreferrer"
              style={Object.assign({}, btn, {
                display: "inline-block",
                background: C.orange, color: C.deepTeal,
                padding: "10px 24px", borderRadius: 50, fontSize: 13, fontWeight: 700,
                textDecoration: "none",
              })}
            >
              Shop Archway →
            </a>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={function () { shareScore(shareText); }}
              style={btnPrimary}
            >
              🐾 Share Score
            </button>
            <button onClick={resetAll} style={btnSecondary}>Play Again</button>
          </div>
        </div>
      </div>
    );
  }

  // ===== PLANNING SCREEN =====
  var pickedZone = zones.find(function (z) { return z.id === picked; });
  var activeCombo = picked && assigned[picked] ? getComboBonus(picked, assigned) : null;

  return (
    <div style={{
      minHeight: "100vh", fontFamily: bodyFont, color: C.deepTeal,
      display: "flex", flexDirection: "column", position: "relative",
    }}>
      {css}
      {productUnlock && <ProductUnlockModal product={productUnlock} onClose={function () { setProductUnlock(null); }} />}
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
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12 }}>
          {/* Running projected grade */}
          <div style={{
            background: projectedGrade.c + "33", border: "1px solid " + projectedGrade.c + "66",
            borderRadius: 8, padding: "2px 8px", fontSize: 10, fontWeight: 700, color: C.deepTeal,
          }}>
            {projectedGrade.l} · {projectedScore.toLocaleString()}
          </div>
          <div>
            Rd <strong style={{ color: C.orange }}>{round}</strong>/{maxRounds}
            &nbsp;&nbsp;💰 <strong style={{ color: C.deepTeal }}>${money.toLocaleString()}</strong>
          </div>
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

        {/* Event banner */}
        <EventBanner event={currentEvent} />

        <div style={{ fontSize: 10, letterSpacing: 1.5, opacity: 0.4, marginBottom: 6, fontWeight: 700 }}>SELECT A ZONE</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {zones.map(function (z, zIdx) {
            var isSel = picked === z.id;
            var hasMeth = assigned[z.id];
            var hc = z.health > 60 ? C.leaf : z.health > 30 ? C.orange : C.pink;
            var zHistory = zoneHistory.map(function (snapshot) { return snapshot[zIdx]; });
            var carpHistory = zHistory.map(function (s) { return s.carp; });
            var healthHistory = zHistory.map(function (s) { return s.health; });

            return (
              <button key={z.id} onClick={function () { pickZone(z.id); }} style={{
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
                  {/* Sparklines */}
                  {carpHistory.length > 1 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-end" }}>
                      <Sparkline data={carpHistory} color="#c0392b" />
                      <Sparkline data={healthHistory} color={C.leaf} />
                    </div>
                  )}
                  {hasMeth && <span style={{ fontSize: 16 }}>{METHODS.find(function (m) { return m.id === hasMeth; }).icon}</span>}
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
                <button onClick={function () { removeAssignment(picked); }} style={{
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

            {/* Active combo indicator */}
            {activeCombo && (
              <div style={{
                background: C.grass + "33", border: "1px solid " + C.grass + "66",
                borderRadius: 8, padding: "6px 10px", marginBottom: 10,
                fontSize: 11, color: C.deepTeal, fontWeight: 600,
                animation: "slideIn 0.2s ease",
              }}>
                ⚡ Combo: {activeCombo.label} (+{Math.round(activeCombo.bonus * 100)}%)
              </div>
            )}

            <div style={{ fontSize: 10, letterSpacing: 1.5, opacity: 0.4, marginBottom: 6, fontWeight: 700 }}>DEPLOY METHOD</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {METHODS.map(function (m) {
                var isActive = assigned[picked] === m.id;
                var refund = assigned[picked] ? METHODS.find(function (x) { return x.id === assigned[picked]; }).cost : 0;
                var canAfford = isActive || (money + refund >= m.cost);
                // Check if this method would form a combo with any adjacent zone
                var testAssigned = Object.assign({}, assigned, {});
                testAssigned[picked] = m.id;
                var potentialCombo = getComboBonus(picked, testAssigned);
                return (
                  <button key={m.id} onClick={function () { assignMethod(m.id); }} style={{
                    ...btn, color: C.deepTeal,
                    background: isActive ? C.cream : "white",
                    border: isActive ? "2px solid " + C.deepTeal : "1px solid rgba(0,62,73,0.1)",
                    borderRadius: 12, padding: "10px 8px", textAlign: "left",
                    opacity: canAfford ? 1 : 0.35,
                    boxShadow: isActive ? "0 2px 8px rgba(0,62,73,0.1)" : "none",
                  }}>
                    <div style={{ fontSize: 14 }}>
                      {m.icon} <span style={{ fontSize: 12, fontWeight: 700 }}>{m.name}</span>
                      {potentialCombo && !isActive && (
                        <span style={{ fontSize: 8, background: C.grass + "44", color: C.deepTeal, borderRadius: 4, padding: "1px 4px", marginLeft: 4, fontWeight: 700 }}>
                          COMBO
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: isActive ? C.deepTeal : C.orange, marginTop: 4 }}>
                      {isActive ? "✓ Deployed" : "$" + m.cost}
                    </div>
                    <div style={{ fontSize: 9, opacity: 0.4, marginTop: 2 }}>
                      Power {m.power} · Eco {m.eco > 0 ? "+" : ""}{m.eco}
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
          {UPGRADES.map(function (u) {
            var level = upgrades[u.id];
            var isMaxed = level >= 2;
            var tier = u.tiers[level] || null;
            var canBuy = tier && money >= tier.cost;
            return (
              <button key={u.id} onClick={function () { if (!isMaxed) buyUpgrade(u.id); }} style={{
                ...btn, color: C.deepTeal,
                background: level > 0 ? C.leaf + "22" : "white",
                border: level > 0 ? "1px solid " + C.leaf + "55" : "1px solid rgba(0,62,73,0.1)",
                borderRadius: 12, padding: 10, textAlign: "left",
                opacity: (isMaxed || canBuy || level > 0) ? 1 : 0.35,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontSize: 16 }}>{u.icon}</div>
                  {level > 0 && (
                    <div style={{ display: "flex", gap: 2 }}>
                      {[1, 2].map(function (t) {
                        return (
                          <div key={t} style={{
                            width: 6, height: 6, borderRadius: "50%",
                            background: level >= t ? C.leaf : "rgba(0,62,73,0.1)",
                          }} />
                        );
                      })}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, marginTop: 2 }}>{u.name}</div>
                <div style={{ fontSize: 9, opacity: 0.45 }}>
                  {isMaxed ? "Maxed" : tier ? tier.desc : ""}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: isMaxed ? C.leaf : canBuy ? C.orange : "rgba(0,62,73,0.3)", marginTop: 3 }}>
                  {isMaxed ? "✓ Max" : level > 0 ? "Upgrade $" + tier.cost : "✓ Active $" + (tier ? tier.cost : "?")}
                  {level === 0 && !isMaxed && " (Tier 1)"}
                  {level === 1 && !isMaxed && " (Tier 2)"}
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
          {deployCount > 0
            ? "Execute Round " + round + " (" + deployCount + " zone" + (deployCount > 1 ? "s" : "") + ")"
            : "Deploy to at least 1 zone"}
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
