# Remotion Studio

Standalone web workspace for authoring a title-card composition and rendering MP4 videos on a cloud Node.js service.

## MVP included
- React + Vite editor with editable title, subtitle and accent color.
- Remotion composition rendered server-side with H.264.
- Express API for render jobs, status polling and MP4 downloads.
- Docker image and Render Blueprint configuration in Frankfurt.

## Local development
Requirements: Node.js 22+, npm, Chromium and FFmpeg.

```bash
npm install
cp .env.example .env
npm run dev
```
Open http://localhost:5173. The API listens on http://localhost:3000.

## Render deployment
The included Blueprint describes one paid Starter web service in Frankfurt. Review the plan and current pricing in Render before approving deployment. No AWS account is needed for this initial rendering approach.

## MVP limitations
- Job state and MP4 files live in process memory and temporary disk. They are lost on restarts or deploys.
- Keep this as a single instance until a durable queue and object storage are added.
- Video rendering is CPU/memory intensive; the Starter service may need scaling for longer or higher-resolution videos.
- The editor currently generates a structured title-card video. AI prompt-to-storyboard/code generation is a separate next phase and is not yet connected.

## API
- GET /api/health
- POST /api/renders — { "title", "subtitle", "accent" }
- GET /api/renders/:id
- GET /api/renders/:id/download

See .env.example for configuration. Never commit secrets.