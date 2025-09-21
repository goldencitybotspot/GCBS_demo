# Env-Driven Chat Bot (Vercel + Edge)

A secure, reusable starter for client bots. Prompt, model, and branding are controlled by **Environment Variables** — no code edits required per client.

## Files
- `index.html` — Minimal chat UI that fetches safe branding from `/api/config`.
- `api/chat.js` — Edge Function that calls OpenAI; injects `SYSTEM_PROMPT` server-side.
- `api/config.js` — Returns **safe** brand/greeting config for the UI (no secrets).
- `vercel.json` — Sets the function runtime to edge.
- `.gitignore` — Housekeeping.

## Deploy (new client in ~2 minutes)
1. **Use this template** to create a fresh GitHub repo.
2. Import the repo into **Vercel → New Project**.
3. Add Environment Variables (Project → Settings → Environment Variables):
   - `OPENAI_API_KEY` = `sk-...`
   - `SYSTEM_PROMPT` = e.g. "You are a warm, concise assistant for ACME Plumbing. Use plain English..."
   - `MODEL` = `gpt-4o-mini` (default) or another compatible model
   - `TEMPERATURE` = `0.3` — optional
   - `MAX_TOKENS` = `512` — optional
   - `TOP_P` = `1` — optional
   - **Brand (safe to expose):**
     - `BRAND_NAME` = `ACME Chat`
     - `BRAND_PRIMARY` = `#0b6ef3`
     - `LOGO_URL` = public image URL (optional)
     - `BOT_GREETING` = short hello shown in the UI (optional)
4. **Deploy** and open `/`.

## Local dev (optional)
```bash
npm i -g vercel
vercel dev
```
Visit http://localhost:3000. Define env vars in your shell before starting.

## Notes
- `/api/config` only returns non-sensitive values.
- Env var changes usually require a redeploy.
- Same-origin calls; CORS not required.
