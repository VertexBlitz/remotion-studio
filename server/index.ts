import express from "express";
import cors from "cors";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";
const app = express();
const port = Number(process.env.PORT ?? 3000);
type Job = { status: "rendering" | "done" | "error"; file?: string; error?: string };
const jobs = new Map<string, Job>();
let serveUrlPromise: ReturnType<typeof bundle> | undefined;
app.use(cors({ origin: process.env.WEB_ORIGIN?.split(",") ?? true }));
app.use(express.json({ limit: "1mb" }));
app.get("/api/health", (_req, res) => res.json({ ok: true, service: "remotion-studio" }));
app.use(express.static(path.resolve("dist")));
app.post("/api/renders", (req, res) => {
  const { title, subtitle, accent } = req.body ?? {};
  if (typeof title !== "string" || !title.trim() || title.length > 90 || typeof subtitle !== "string" || subtitle.length > 180 || typeof accent !== "string" || !/^#[0-9a-fA-F]{6}$/.test(accent)) return res.status(400).json({ error: "Provide a title, subtitle and valid hex accent color." });
  const id = randomUUID();
  jobs.set(id, { status: "rendering" });
  res.status(202).json({ id, status: "queued" });
  void renderJob(id, { title: title.trim(), subtitle, accent });
});
async function renderJob(id: string, inputProps: { title: string; subtitle: string; accent: string }) {
  const output = path.join(os.tmpdir(), id + ".mp4");
  try {
    serveUrlPromise ??= bundle({ entryPoint: path.resolve("remotion/index.ts") });
    const serveUrl = await serveUrlPromise;
    const composition = await selectComposition({ serveUrl, id: "TitleCard", inputProps });
    await renderMedia({ composition, serveUrl, codec: "h264", outputLocation: output, inputProps, concurrency: Math.max(1, Number(process.env.RENDER_CONCURRENCY ?? 1)), chromiumOptions: { gl: "angle" }, ...(process.env.PUPPETEER_EXECUTABLE_PATH ? { browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH } : {}) });
    jobs.set(id, { status: "done", file: output });
  } catch (error) {
    jobs.set(id, { status: "error", error: error instanceof Error ? error.message : "Render failed" });
    await fs.rm(output, { force: true }).catch(() => undefined);
    console.error("Render failed", error);
  }
}
app.get("/api/renders/:id", (req, res) => {
  const job = jobs.get(req.params.id);
  if (!job) return res.status(404).json({ error: "Render job not found." });
  res.json({ id: req.params.id, status: job.status, ...(job.error ? { error: job.error } : {}), ...(job.status === "done" ? { downloadUrl: "/api/renders/" + req.params.id + "/download" } : {}) });
});
app.get("/api/renders/:id/download", (req, res) => {
  const job = jobs.get(req.params.id);
  if (!job || job.status !== "done" || !job.file) return res.status(404).json({ error: "Video is not ready or has expired." });
  res.download(job.file, "remotion-studio-" + req.params.id + ".mp4");
});
app.listen(port, () => console.log("Remotion Studio API listening on " + port));