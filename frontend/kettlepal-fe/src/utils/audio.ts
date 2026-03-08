let audioCtx: AudioContext | null = null;
let latencyOffset = 0; // seconds
let calibrated = false;
let initPromise: Promise<void> | null = null;

/**
 * Initializes and unlocks the AudioContext.
 * Must be triggered by a user gesture (click/hover..) at least once (thanks Safari).
 */
export function initAudio(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }

    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }

    // Run calibration once per session. Safari is prone to an audible lag.
    if (!calibrated) {
      calibrateLatency();
    }
  })();

  return initPromise;
}

/**
 * Plays a short beep.
 * Safe to call from timers, intervals, and effects.
 */
export async function beep({
  frequency = 880,
  duration = 100,
  volume = 0.6,
} = {}) {
  // Ensure audio is initialized
  if (!audioCtx) {
    await initAudio();
  }

  if (!audioCtx) return;

  // Safari can unexpectedly suspend your audio
  if (audioCtx.state === "suspended") {
    await audioCtx.resume();
  }

  // Safari requires scheduling slightly in the future
  const startAt = audioCtx.currentTime + Math.max(latencyOffset, 0.005);

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, startAt);
  gainNode.gain.setValueAtTime(volume, startAt);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start(startAt);
  oscillator.stop(startAt + duration / 1000);
}

/**
 * Measures audio startup latency once and compensates automatically.
 * Chrome ≈ 0–15ms → no offset
 * Safari ≈ 40–120ms → compensated
 */
function calibrateLatency() {
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  gain.gain.value = 0; // silent
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const scheduledAt = audioCtx.currentTime + 0.01;
  const startPerf = performance.now();

  osc.start(scheduledAt);
  osc.stop(scheduledAt + 0.01);

  osc.onended = () => {
    const elapsedMs = performance.now() - startPerf;

    // Safari reliably exceeds this
    if (elapsedMs > 30) {
      latencyOffset = 0.05; // ~50ms compensation
    }

    calibrated = true;
  };
}
