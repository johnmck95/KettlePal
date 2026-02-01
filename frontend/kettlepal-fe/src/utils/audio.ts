/** Plays an Audible "beep" on chromium browsers. Safari does not yet work. */
export default function beep({
  frequency = 880,
  duration = 100,
  volume = 0.6,
} = {}) {
  const ctx = new window.AudioContext();

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

  gainNode.gain.value = volume;

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + duration / 1000);
}
