import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import path from "path";
import os from "os";
import {
  handleArtworkRequest,
  handleAudioRequest,
  handleConvertOpusRequest,
  handleMetadataRequest,
  handleRootRequest,
} from "./api";
import { serveStatic } from "hono/bun";
import _staticFiles from "./static.json";
import { promisify } from "util";
import { exec } from "child_process";
import { writeFile } from "fs/promises";

export const execAsync = promisify(exec);

export const getTempFile = (extension?: string): string => {
  const baseName = Math.random().toString(36).substring(7);
  const fileName = `${baseName}.${extension ?? "tmp"}`;
  return path.join(os.tmpdir(), fileName);
};

const writeStaticFilesToTemp = async () => {
  const staticFiles = _staticFiles as Record<string, string>;
  const tempFolder = getTempFile();
  await execAsync(`mkdir ${tempFolder}`);
  const promises = Object.entries(staticFiles).map(
    async ([fileName, base64Content]) => {
      const filePath = path.join(tempFolder, fileName);
      const content = Buffer.from(base64Content, "base64");
      await execAsync(`mkdir -p ${path.dirname(filePath)}`);
      await writeFile(filePath, content);
    }
  );
  await Promise.all(promises);
  return tempFolder;
};

const staticFolder = await writeStaticFilesToTemp();

const app = new Hono();
app.use("/*", cors());
app.use(logger());
app.use("/*", serveStatic({ root: staticFolder }));

const api = app.basePath("/api");
api.get("/", handleRootRequest);
api.get("/artwork/:url", handleArtworkRequest);
api.get("/audio/:url", handleAudioRequest);
api.get("/metadata/:url", handleMetadataRequest);
api.post("/convert-opus", handleConvertOpusRequest);

console.log("Static files being served from", staticFolder);
console.log("Listening...");

export default {
  fetch: app.fetch,
  maxRequestBodySize: 1024 ** 3,
};
