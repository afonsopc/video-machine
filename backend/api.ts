import { type Context } from "hono";
import { exec } from "child_process";
import { promisify } from "util";
import { readFile } from "fs/promises";
import { writeFile } from "fs/promises";
import path from "path";
import os from "os";
import type { BlankEnv, BlankInput } from "hono/types";

const execAsync = promisify(exec);
const readFileArrayBuffer = async (path: string): Promise<ArrayBuffer> => {
  const buffer = await readFile(path);
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;
};
const convertFile = async (
  inputFilePath: string,
  outputFilePath: string
): Promise<void> => {
  const command = `ffmpeg -i ${inputFilePath} ${outputFilePath}`;
  await execAsync(command);
  await execAsync(`rm ${inputFilePath}`);
};
const getTempFile = (extension?: string): string => {
  const baseName = Math.random().toString(36).substring(7);
  const fileName = `${baseName}.${extension ?? "tmp"}`;
  return path.join(os.tmpdir(), fileName);
};
const cleanYoutubeUrl = (url: string): string => {
  if (!url.includes("youtube.com") && !url.includes("youtu.be")) return url;
  const listIndex = url.indexOf("?list=");
  if (listIndex !== -1) return url.substring(0, listIndex);
  return url;
};
const cleanUrl = (url: string): string => {
  let cleanUrl = url;
  cleanUrl = cleanYoutubeUrl(cleanUrl);
  return cleanUrl;
};

const getArtwork = async (url: string): Promise<ArrayBuffer> => {
  const command = `yt-dlp -J ${url}`;
  const { stdout } = await execAsync(command);
  const metadata = JSON.parse(stdout);
  let artwork = metadata.thumbnails[metadata.thumbnails.length - 1];
  if (artwork.url.includes("maxresdefault")) {
    const squareArtwork = metadata.thumbnails.find(
      (thumbnail: any) => thumbnail.resolution === "544x544"
    );
    if (squareArtwork) artwork = squareArtwork;
  }
  const artworkUrl = artwork?.url;
  if (!artworkUrl) throw new Error("Artwork not found.");
  const response = await fetch(artworkUrl);
  const tempFile = getTempFile();
  await writeFile(tempFile, new Uint8Array(await response.arrayBuffer()));
  await convertFile(tempFile, `${tempFile}.jpg`);
  const arrayBuffer = await readFileArrayBuffer(`${tempFile}.jpg`);
  await execAsync(`rm ${tempFile}.jpg`);
  return arrayBuffer;
};

const getAudio = async (url: string): Promise<ArrayBuffer> => {
  const tempFile = getTempFile("opus");
  const args = [
    "-f",
    "bestaudio",
    "--extract-audio",
    "--audio-format",
    "opus",
    "-o",
    tempFile,
    "-q",
    "--no-warnings",
    url,
  ];
  const command = `yt-dlp ${args.join(" ")}`;
  await execAsync(command);
  const arrayBuffer = await readFileArrayBuffer(tempFile);
  await execAsync(`rm ${tempFile}`);
  return arrayBuffer;
};

const getMetadata = async (
  url: string
): Promise<{ title: string; artist: string }> => {
  const command = `yt-dlp -J ${url}`;
  const { stdout } = await execAsync(command);
  const metadata = JSON.parse(stdout);
  return { title: metadata.title, artist: metadata.artist };
};

export const handleRootRequest = async (c: Context) => {
  return c.text(
    "Óh minha paixão querida\n" +
      "Meu amor, meu pagem belo\n" +
      "Foge sempre minha vida\n" +
      "Deste maldito castelo",
    200
  );
};

export const handleArtworkRequest = async (
  c: Context<BlankEnv, "/api/artwork/:url", BlankInput>
) => {
  const url = cleanUrl(c.req.param("url"));
  const artwork = await getArtwork(url);
  return c.body(artwork, 200, {
    "Content-Type": "image/jpeg",
    "Content-Disposition": `attachment; filename=artwork.jpg`,
  });
};

export const handleAudioRequest = async (
  c: Context<BlankEnv, "/api/audio/:url", BlankInput>
) => {
  const url = cleanUrl(c.req.param("url"));
  const audio = await getAudio(url);
  return c.body(audio, 200, {
    "Content-Type": "audio/opus",
    "Content-Disposition": `attachment; filename=song.opus`,
  });
};

export const handleMetadataRequest = async (
  c: Context<BlankEnv, "/api/metadata/:url", BlankInput>
) => {
  const url = cleanUrl(c.req.param("url"));
  const metadata = await getMetadata(url);
  return c.json(metadata, 200);
};

export const handleConvertOpusRequest = async (c: Context) => {
  const file = await c.req.blob();
  const tempFile = getTempFile();
  const tempFileOpus = getTempFile("opus");
  await writeFile(tempFile, new Uint8Array(await file.arrayBuffer()));
  await convertFile(tempFile, tempFileOpus);
  const arrayBuffer = await readFileArrayBuffer(tempFileOpus);
  await execAsync(`rm ${tempFileOpus}`);
  return c.body(arrayBuffer, 200, {
    "Content-Type": "audio/opus",
    "Content-Disposition": `attachment; filename=song.opus`,
  });
};
