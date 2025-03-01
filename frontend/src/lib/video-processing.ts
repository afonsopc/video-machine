import ThumbImage from "@/components/output/thumb-image";
import { componentToImage } from "./component-to-image";
import { ControlValues, ProcessedValues } from "./type";
import VideoImage from "@/components/output/video-image";
import { processAudio } from "./audio";
import { FFmpeg } from "@ffmpeg/ffmpeg";

const DEFAULT_IMAGE_OPTIONS = {
  quality: 0.9,
};

const VIDEO_IMAGE_OPTIONS = {
  width: 7680,
  height: 4320,
  ...DEFAULT_IMAGE_OPTIONS,
};

const THUMB_IMAGE_OPTIONS = {
  width: 1920,
  height: 1080,
  ...DEFAULT_IMAGE_OPTIONS,
};

const DEFAULT_AUDIO_OPTIONS = {
  reverbWet: 0.25,
  reverbDry: 0.6,
  speed: 0.84,
  volume: 0.4,
};

async function tryManyTimes<T>(
  asyncFn: () => Promise<T>,
  times = 3,
): Promise<T> {
  let error;

  for (let i = 0; i < times; i++) {
    try {
      return await asyncFn();
    } catch (e) {
      error = e;
    }
  }

  throw error;
}

export const processValues = async (
  values: ControlValues,
  progressCallback?: (progress: number) => void,
): Promise<ProcessedValues> => {
  const videoImageProcess = () =>
    componentToImage(VIDEO_IMAGE_OPTIONS, {
      component: VideoImage,
      props: {
        values,
        width: VIDEO_IMAGE_OPTIONS.width,
      },
    });
  const thumbImageProcess = () =>
    componentToImage(THUMB_IMAGE_OPTIONS, {
      component: ThumbImage,
      props: {
        values,
        width: THUMB_IMAGE_OPTIONS.width,
      },
    });
  progressCallback?.(0);
  const videoImage = await tryManyTimes(videoImageProcess);
  progressCallback?.(33);
  const thumbImage = await tryManyTimes(thumbImageProcess);
  progressCallback?.(66);
  const modifiedSong = await processAudio(values.song, DEFAULT_AUDIO_OPTIONS);
  progressCallback?.(100);

  return { videoImage, thumbImage, modifiedSong };
};

export const createVideo = async (
  { videoImage, modifiedSong }: ProcessedValues,
  progressCallback?: (progress: number) => void,
) => {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();
  const videoImageBuff = new Uint8Array(await videoImage.arrayBuffer());
  await ffmpeg.writeFile("video.png", videoImageBuff);
  const modifiedSongBuff = new Uint8Array(await modifiedSong.arrayBuffer());
  await ffmpeg.writeFile("song.wav", modifiedSongBuff);
  ffmpeg.on("progress", ({ progress }) => progressCallback?.(progress * 100));
  await ffmpeg.exec(["-i", "video.png", "-i", "song.wav", "output.mp4"]);
  const fileData = await ffmpeg.readFile("output.mp4");
  const uint8array = new Uint8Array(fileData as unknown as ArrayBuffer);
  const videoBlob = new Blob([uint8array.buffer], { type: "video/mp4" });
  return videoBlob;
};
