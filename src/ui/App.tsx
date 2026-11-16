import { useState } from "react";
import type { CSSProperties } from "react";
type Job = { id: string; status: string; downloadUrl?: string; error?: string };
const API = import.meta.env.VITE_API_URL ?? "";
export default function App() {
  const [title, setTitle] = useState("A story worth watching");
  const [subtitle, setSubtitle] = useState("Turn an idea into a video.");
  const [accent, setAccent] = useState("#c7a6ff");
  const [job, setJob] = useState<Job | null>(null);
  const [busy, setBusy] = useState(false);
  async function render() {
    setBusy(true); setJob(null);
    try {
      const response = await fetch(`${API}/api/renders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, subtitle, accent }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not start render");
      setJob(data);
      if (data.id) {
        const timer = window.setInterval(async () => {
          try {
            const check = await fetch(`${API}/api/renders/${data.id}`);
            const result = await check.json(); setJob(result);
            if (result.status === "done" || result.status === "error") window.clearInterval(timer);
          } catch { window.clearInterval(timer); }
        }, 2500);
      }
    } catch (error) { setJob({ id: "", status: "error", error: error instanceof Error ? error.message : "Unknown error" }); }
    finally { setBusy(false); }
  }
  return <main className="shell">
    <header className="topbar"><a className="brand" href="#"><span className="brand-mark">R</span> remotion<span>studio</span></a><span className="top-note">CLOUD VIDEO WORKSPACE <i /></span></header>
    <section className="intro"><p className="eyebrow">YOUR IDEAS, IN MOTION</p><h1>Make something<br/><em>worth watching.</em></h1><p className="lead">Shape the story. Preview the composition. Render your video in the cloud.</p></section>
    <section className="workspace">
      <div className="editor"><div className="section-head"><span>01 / CONTENT</span><span className="muted">NEW PROJECT</span></div>
        <label>VIDEO TITLE<input value={title} onChange={e => setTitle(e.target.value)} maxLength={90}/></label>
        <label>SUBTITLE<textarea value={subtitle} onChange={e => setSubtitle(e.target.value)} rows={3} maxLength={180}/></label>
        <label>ACCENT COLOR<div className="color-row"><input type="color" value={accent} onChange={e => setAccent(e.target.value)}/><code>{accent.toUpperCase()}</code></div></label>
        <button className="render-button" onClick={render} disabled={busy || !title.trim()}>{busy ? "Preparing render…" : "Render video"} <span>↗</span></button>
        <p className="fineprint">1080 × 1080 · 30 FPS · MP4 · CLOUD RENDER</p>
        {job && <div className={`status ${job.status}`}><strong>{job.status === "done" ? "Your video is ready" : job.status === "error" ? "Render failed" : "Rendering your video…"}</strong>{job.error && <p>{job.error}</p>}{job.downloadUrl && <a href={`${API}${job.downloadUrl}`}>Download MP4 ↗</a>}</div>}
      </div>
      <div className="preview"><div className="preview-head"><span>LIVE COMPOSITION</span><span>00:05</span></div>
        <div className="canvas" style={{ "--accent": accent } as CSSProperties}><div className="canvas-grid"/><div className="canvas-copy"><span>REMOTION STUDIO / 001</span><h2>{title || "Your title here"}</h2><p>{subtitle || "Your subtitle here"}</p><b/></div><div className="canvas-foot"><span>AN IDEA IN MOTION</span><span>2026</span></div></div>
        <p className="preview-caption">Live design preview. The MP4 is rendered by Remotion on the server.</p>
      </div>
    </section>
    <footer><span>REMOTION STUDIO</span><span>BUILT FOR THE NEXT FRAME.</span></footer>
  </main>;
}