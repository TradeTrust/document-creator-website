# Analytics setup (GTM + GA4) — TradeTrust Creator

Site: `https://creator.tradetrust.io`  
App env var: `REACT_APP_GTM_CONTAINER_ID`  
**Production GTM container:** `GTM-598QV2Q7` (TradeTrust account → creator.tradetrust.io)  
**GA4 property:** TradeTrust Creator  
**GA4 Measurement ID:** `G-N82X0CRVMK` (stream: Creator production)  
**GTM live version:** Version 2 — Google Tag + GA4 custom events (published)

Google sign-in often fails inside Cursor’s embedded browser (“JavaScript turned off”).  
**Complete steps 1–5 in Chrome or Safari on your machine**, then paste the GTM ID into `.env` / Netlify.

## 1. Sign in with the correct Google account

1. Open [tagmanager.google.com](https://tagmanager.google.com) in Chrome.
2. Sign out of any existing account if needed.
3. Sign in with the **new** Google account for Creator analytics.

## 2. Create GTM account + container

1. **Create Account**
   - Account name: `TradeTrust Creator`
   - Country: as appropriate
2. Container
   - Container name: `creator.tradetrust.io`
   - Target platform: **Web**
3. Accept terms → copy the container ID: **`GTM-XXXXXXX`**

## 3. Create GA4 property

1. Open [analytics.google.com](https://analytics.google.com)
2. Admin → Create → Property
   - Property name: `TradeTrust Creator`
   - Time zone / currency: as appropriate
3. Data stream → Web
   - Website URL: `https://creator.tradetrust.io`
   - Stream name: `Creator production`
4. Copy the Measurement ID: **`G-XXXXXXXX`**

Optional (privacy, matching previous gtag options):
- Admin → Data collection → Google signals → Off
- Admin → Data settings → Data collection → Ad personalization → Off (if available)

## 4. Wire GA4 inside GTM

In the GTM workspace for `creator.tradetrust.io`:

### Variables
Create a **Data Layer Variable** for each custom parameter you want in GA4 reports, e.g.:
- `environment`
- `file_name`
- `source`
- `form_name`
- `success_count`
- `failure_count`
- `document_count`
- `error_message`

### Tags

1. **GA4 Configuration**
   - Tag type: Google Analytics: GA4 Configuration
   - Measurement ID: `G-XXXXXXXX`
   - Trigger: All Pages

2. **GA4 Event** (one tag, dynamic event name — recommended)
   - Tag type: Google Analytics: GA4 Event
   - Configuration Tag: the tag above
   - Event Name: `{{Event}}` (Built-In Variable — enable **Event** under Variables → Built-Ins)
   - Event Parameters: map the data layer variables above
   - Trigger: Custom Event → Event name regex:
     ```
     ^(CONFIG_FILE_DROPPED|REVOKE_DOCUMENT_DROPPED|FORM_STARTED|DOCUMENT_ISSUED|DOCUMENT_ISSUE_FAILED|DOCUMENT_REVOKED|DOCUMENT_REVOKE_FAILED)$
     ```

### Publish
Submit → Publish version (e.g. “Creator initial GA4 + custom events”).

## 5. GA4 dashboard / reports

1. Admin → Events → mark as **key events** (optional):
   - `DOCUMENT_ISSUED`, `DOCUMENT_REVOKED`, `CONFIG_FILE_DROPPED`, `FORM_STARTED`
2. Explore → Blank exploration:
   - Dimensions: Event name, Page path
   - Metrics: Event count, Active users
   - Or use Reports → Engagement → Events

## 6. Wire into the app

Local `.env`:

```bash
REACT_APP_GTM_CONTAINER_ID=GTM-598QV2Q7
REACT_APP_PLATFORM=local
```

Production (Netlify env):

```bash
REACT_APP_GTM_CONTAINER_ID=GTM-598QV2Q7
REACT_APP_PLATFORM=production
```

Redeploy after setting Netlify vars so the build embeds the ID.

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
