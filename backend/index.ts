import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import {
  handleArtworkRequest,
  handleAudioRequest,
  handleConvertOpusRequest,
  handleMetadataRequest,
  handleRootRequest,
} from "./api";
import { serveStatic } from "hono/bun";

const app = new Hono();
app.use("/*", cors());
app.use(logger());
app.use("/*", serveStatic({ root: "./static" }));

const api = app.basePath("/api");
api.get("/", handleRootRequest);
api.get("/artwork/:url", handleArtworkRequest);
api.get("/audio/:url", handleAudioRequest);
api.get("/metadata/:url", handleMetadataRequest);
api.post("/convert-opus", handleConvertOpusRequest);

export default {
  fetch: app.fetch,
  maxRequestBodySize: 1024 ** 3,
};
