var ctx = null;

function getCtx() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      return null;
    }
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq, type, duration, vol, delay) {
  var c = getCtx();
  if (!c) return;
  try {
    var start = c.currentTime + (delay || 0);
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(vol || 0.12, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.start(start);
    osc.stop(start + duration + 0.01);
  } catch (e) {}
}

export function playClick() {
  tone(520, "square", 0.04, 0.08);
}

export function playDeploy() {
  tone(200, "sine", 0.25, 0.1);
  tone(160, "sine", 0.2, 0.07, 0.12);
}

export function playGood() {
  tone(440, "sine", 0.12, 0.1);
  tone(554, "sine", 0.12, 0.1, 0.1);
  tone(659, "sine", 0.18, 0.1, 0.2);
}

export function playBad() {
  tone(280, "sawtooth", 0.14, 0.09);
  tone(220, "sawtooth", 0.18, 0.09, 0.15);
}

export function playPup() {
  tone(900, "square", 0.06, 0.1);
  tone(650, "square", 0.09, 0.08, 0.07);
}

export function playEvent() {
  tone(370, "triangle", 0.25, 0.12);
  tone(294, "triangle", 0.3, 0.1, 0.2);
}

export function playUpgrade() {
  tone(440, "sine", 0.1, 0.1);
  tone(660, "sine", 0.1, 0.1, 0.08);
  tone(880, "sine", 0.15, 0.1, 0.16);
}

export function playRoundEnd() {
  tone(330, "sine", 0.15, 0.1);
  tone(415, "sine", 0.15, 0.1, 0.12);
  tone(494, "sine", 0.15, 0.1, 0.24);
  tone(659, "sine", 0.25, 0.12, 0.36);
}
