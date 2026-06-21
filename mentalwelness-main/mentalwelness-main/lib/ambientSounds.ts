export type SoundId = "none" | "rain" | "waves" | "beats";

let audioContext: AudioContext | null = null;
let gainNode: GainNode | null = null;
let activeNodes: AudioNode[] = [];
let activeSound: SoundId = "none";

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

function createNoiseBuffer(ctx: AudioContext, seconds = 2): AudioBuffer {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  return buffer;
}

function playRain(ctx: AudioContext, destination: AudioNode) {
  const buffer = createNoiseBuffer(ctx, 4);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 800;

  source.connect(filter);
  filter.connect(destination);
  source.start();
  activeNodes.push(source, filter);
}

function playWaves(ctx: AudioContext, destination: AudioNode) {
  const buffer = createNoiseBuffer(ctx, 4);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 400;

  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.15;

  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 300;

  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  source.connect(filter);
  filter.connect(destination);
  source.start();
  lfo.start();
  activeNodes.push(source, filter, lfo, lfoGain);
}

function playBinaural(ctx: AudioContext, destination: AudioNode) {
  const left = ctx.createOscillator();
  const right = ctx.createOscillator();
  left.frequency.value = 200;
  right.frequency.value = 210;

  const merger = ctx.createChannelMerger(2);
  const leftGain = ctx.createGain();
  const rightGain = ctx.createGain();
  leftGain.gain.value = 0.08;
  rightGain.gain.value = 0.08;

  left.connect(leftGain);
  right.connect(rightGain);
  leftGain.connect(merger, 0, 0);
  rightGain.connect(merger, 0, 1);
  merger.connect(destination);

  left.start();
  right.start();
  activeNodes.push(left, right, merger, leftGain, rightGain);
}

export function stopAmbientSound() {
  activeNodes.forEach((node) => {
    try {
      if ("stop" in node && typeof node.stop === "function") {
        (node as OscillatorNode).stop();
      }
      node.disconnect();
    } catch {
      // already stopped
    }
  });
  activeNodes = [];
  activeSound = "none";
}

export async function playAmbientSound(soundId: SoundId) {
  stopAmbientSound();
  if (soundId === "none") return;

  const ctx = getContext();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  gainNode = ctx.createGain();
  gainNode.gain.value = 0.35;
  gainNode.connect(ctx.destination);

  switch (soundId) {
    case "rain":
      playRain(ctx, gainNode);
      break;
    case "waves":
      playWaves(ctx, gainNode);
      break;
    case "beats":
      playBinaural(ctx, gainNode);
      break;
  }
  activeSound = soundId;
}

export function getActiveSound(): SoundId {
  return activeSound;
}
