# Browser Extension Setup Guide

## Redirecting Production Frontend to Local Backend

### Step 1: Install Requestly Extension
- Chrome: https://chrome.google.com/webstore/detail/requestly/mdnleldcmiljblolnjhpnblkcekpdkpa
- Firefox: https://addons.mozilla.org/en-US/firefox/addon/requestly/

### Step 2: Create Redirect Rule

1. Open Requestly extension
2. Click "New Rule" → "Redirect Request"
3. Configure:

**Rule Name**: LAD Campaigns - Local Dev

**Source (Request URL)**:
```
Url Contains: lad-backend-develop-741719885039.us-central1.run.app/api/campaigns
```

**Destination**:
```
http://localhost:3004/api/campaigns
```

4. Save and Enable the rule

### Step 3: Start Local Backend
```bash
cd backend/features/voice-agent
npm run dev
```

Server will start at: `http://localhost:3004`

### Step 4: Test
1. Open: https://lad-frontend-develop-741719885039.us-central1.run.app/login
2. Login and navigate to campaigns
3. All campaigns API calls will now go to your local backend
4. Check terminal for request logs

### Verification
You should see logs in your terminal like:
```
DB Query: SELECT * FROM campaigns...
Params: [...]
```

### Troubleshooting

**CORS Error**: 
- Make sure your `.env` has: `FRONTEND_URL=https://lad-frontend-develop-741719885039.us-central1.run.app`

**Connection Refused**:
- Ensure local dev server is running: `npm run dev` (from `backend/features/voice-agent`)
- Check port: `http://localhost:3004/health`

**Requestly Not Working**:
- Verify rule is enabled (green toggle)
- Check browser console for actual API URL being called
- Try using wildcard: `*api/campaigns*` → `http://localhost:3004/api/campaigns`

## Alternative: ModHeader + Manual Testing

If Requestly doesn't work, use ModHeader to set CORS headers and use browser DevTools to test:

1. Install ModHeader
2. Set Response Headers:
   - `Access-Control-Allow-Origin`: `https://lad-frontend-develop-741719885039.us-central1.run.app`
   - `Access-Control-Allow-Credentials`: `true`
3. Test API calls manually in console

## Production Backend URL Pattern
If you need to know the production backend URL to redirect from, check the frontend network tab:
- Open DevTools → Network
- Perform a campaigns action
- Look for API calls (likely: `https://lad-backend-develop-*.run.app/api/campaigns`)
