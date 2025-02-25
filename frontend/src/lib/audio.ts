import impulseResponse from "/impulse-response.wav?url";

type AudioOptions = {
  reverbDry: number;
  reverbWet: number;
  speed: number;
  volume: number;
};

export const processAudio = async (
  file: File,
  options: AudioOptions,
): Promise<Blob> => {
  const arrayBuffer = await file.arrayBuffer();
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  let newLength = Math.ceil(audioBuffer.length / options.speed);
  if (options.reverbWet !== 0) newLength += 50000;
  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    newLength,
    audioBuffer.sampleRate,
  );
  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.playbackRate.value = options.speed;
  const gainNode = offlineContext.createGain();
  gainNode.gain.value = options.volume;
  source.connect(gainNode);

  const dryGain = offlineContext.createGain();
  dryGain.gain.value = options.reverbDry;
  gainNode.connect(dryGain);

  let finalNode: AudioNode = dryGain;
  if (options.reverbWet > 0) {
    const convolver = offlineContext.createConvolver();
    await applyReverb(convolver, offlineContext);
    const wetGain = offlineContext.createGain();
    wetGain.gain.value = options.reverbWet;
    gainNode.connect(convolver);
    convolver.connect(wetGain);
    finalNode = offlineContext.createGain();
    dryGain.connect(finalNode);
    wetGain.connect(finalNode);
  }

  finalNode.connect(offlineContext.destination);
  source.start();
  const renderedBuffer = await offlineContext.startRendering();
  return audioBufferToBlob(renderedBuffer);
};

const applyReverb = async (
  convolver: ConvolverNode,
  context: BaseAudioContext,
): Promise<void> => {
  const response = await fetch(impulseResponse);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await context.decodeAudioData(arrayBuffer);
  convolver.buffer = audioBuffer;
};

const audioBufferToBlob = (audioBuffer: AudioBuffer): Blob => {
  const length = audioBuffer.length * audioBuffer.numberOfChannels;
  const audioData = new Float32Array(length);
  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let i = 0; i < channelData.length; i++) {
      audioData[i * audioBuffer.numberOfChannels + channel] = channelData[i];
    }
  }
  const wavBlob = encodeWAV(
    audioData,
    audioBuffer.numberOfChannels,
    audioBuffer.sampleRate,
  );
  return wavBlob;
};

const encodeWAV = (
  samples: Float32Array,
  numChannels: number,
  sampleRate: number,
): Blob => {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };
  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([buffer], { type: "audio/wav" });
};
