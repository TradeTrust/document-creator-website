# Analytics setup (GTM + GA4)

Site: `https://creator.tradetrust.io`  
App env var: `REACT_APP_GTM_CONTAINER_ID`

Keep container IDs, measurement IDs, and Google account/property names **out of this repo**. Store them in private env (local `.env`, Netlify) and your GTM/GA4 consoles only.

Complete steps 1–5 in a normal browser (Chrome/Safari), then set the GTM ID in `.env` / Netlify.

## 1. Sign in with the correct Google account

1. Open [tagmanager.google.com](https://tagmanager.google.com) in Chrome.
2. Sign out of any existing account if needed.
3. Sign in with the Google account used for Creator analytics.

## 2. GTM container

**Production:** use your existing published web container for this site. Configure tags and triggers there so they match the `REACT_APP_GTM_CONTAINER_ID` used in Step 6. Do not commit the real container ID.

### First-time setup only (new account / new site)

1. **Create Account** — choose an internal account name; do not publish it in docs.
2. Container
   - Container name: match the site hostname (e.g. the creator host)
   - Target platform: **Web**
3. Accept terms → copy the container ID (`GTM-…`) into private env only (Step 6)

## 3. Create GA4 property

1. Open [analytics.google.com](https://analytics.google.com)
2. Admin → Create → Property (internal naming; do not commit it)
3. Data stream → Web
   - Website URL: `https://creator.tradetrust.io`
   - Stream name: internal only
4. Copy the Measurement ID (`G-…`) into GTM tag config only — not into the repo

Optional (privacy):
- Admin → Data collection → Google signals → Off
- Admin → Data settings → Data collection → Ad personalization → Off (if available)

## 4. Wire GA4 inside GTM

In the GTM workspace for this site’s container:

### Variables
Create a **Data Layer Variable** for each custom parameter you want in GA4 reports (only fields you intend to analyze):
- `environment` (text)
- `source` (text) — `drop` | `file_picker` | `demo`
- `form_name` (text)
- `success_count` (numeric)
- `failure_count` (numeric)
- `document_count` (numeric)
- `error_category` (text) — fixed values such as `issue_failed` / `revoke_failed` (never raw error strings)

Do **not** send user-provided file names.

### GA4 custom definitions
In GA4 Admin → **Custom definitions**, register only the parameters the team will use in reports:
- **Custom dimensions** (text): `environment`, `source`, `form_name`, `error_category`
- **Custom metrics** (numeric): `success_count`, `failure_count`, `document_count`

Skip any parameter you do not plan to analyze.

### Tags

1. **Google Tag / GA4 Configuration**
   - Measurement ID: your stream’s `G-…` (from GA4; keep private)
   - Trigger: All Pages
   - Config params: `allow_google_signals` = false, `allow_ad_personalization_signals` = false

2. **GA4 Event** tags (one per event group so unused params are not carried over — or start from `docs/gtm-container-import.template.json` after substituting placeholders):
   - Drop events (`CONFIG_FILE_DROPPED` / `REVOKE_DOCUMENT_DROPPED`): `environment`, `source`
   - Form started (`FORM_STARTED`): `environment`, `form_name`
   - Success (`DOCUMENT_ISSUED` / `DOCUMENT_REVOKED`): `environment`, `success_count`, `failure_count`, `document_count`
   - Failed (`DOCUMENT_ISSUE_FAILED` / `DOCUMENT_REVOKE_FAILED`): same counts + `error_category`
   - Event Name: `{{Event}}` (Built-In Variable — enable **Event** under Variables → Built-Ins)

The app clears unused analytics params on each `dataLayer` push so stale values do not leak between events.

### Publish
Submit → Publish version with an internal note. Do not paste IDs into public docs or PRs.

## 5. GA4 dashboard / reports

1. Admin → Events → mark as **key events** (optional):
   - `DOCUMENT_ISSUED`, `DOCUMENT_REVOKED`, `CONFIG_FILE_DROPPED`, `FORM_STARTED`
2. Explore → Blank exploration:
   - Dimensions: Event name, Page path
   - Metrics: Event count, Active users
   - Or use Reports → Engagement → Events

## 6. Wire into the app

Local `.env` (gitignored):

```bash
REACT_APP_GTM_CONTAINER_ID=GTM-XXXXXXX
REACT_APP_PLATFORM=local
```

Production (Netlify / host env — not committed):

```bash
REACT_APP_GTM_CONTAINER_ID=GTM-XXXXXXX
REACT_APP_PLATFORM=production
```

Replace `GTM-XXXXXXX` with your real container ID in private config only. Redeploy after setting host env vars so the build embeds the ID.

## 7. Verify

1. GTM → Preview → connect to `http://localhost:3000` (with env set) or `https://creator.tradetrust.io`
2. Drop a config / start a form → confirm custom events in the GTM debugger
3. GA4 → Reports → Realtime → confirm `page_view` and custom events

## Events pushed by the app

| Event | When |
|-------|------|
| `CONFIG_FILE_DROPPED` | Config file drop or Load Demo Config |
| `REVOKE_DOCUMENT_DROPPED` | Revoke document drop |
| `FORM_STARTED` | User selects a form type |
| `DOCUMENT_ISSUED` | Issue queue finished with ≥1 success |
| `DOCUMENT_ISSUE_FAILED` | Issue queue all failed / error |
| `DOCUMENT_REVOKED` | Revoke queue finished with ≥1 success |
| `DOCUMENT_REVOKE_FAILED` | Revoke queue all failed / error |
