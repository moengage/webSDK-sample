# Deployment Instructions

## Option 1: Deploy via Vercel Dashboard (Recommended - No CLI needed)

### Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

### Step 2: Deploy on Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up/Login with your GitHub account
3. Click **"New Project"**
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
6. Add Environment Variables:
   - Click **"Environment Variables"**
   - Add:
     - **Name:** `NEXT_PUBLIC_MOENGAGE_DATACENTER`
     - **Value:** `dc_01`
   - Add:
     - **Name:** `NEXT_PUBLIC_MOENGAGE_APP_ID`
     - **Value:** `3RADPYNEBZ2MCOJ43EEW5FWV`
7. Click **"Deploy"**
8. Wait for deployment to complete
9. Note your deployment URL (e.g., `https://your-app.vercel.app`)

### Step 3: Update ChatGPT Manifest

1. After deployment, update `public/.well-known/openai-apps.json`:
   ```json
   {
     "homepage_url": "https://your-app.vercel.app",
     ...
   }
   ```
2. Commit and push the change
3. Vercel will automatically redeploy

### Step 4: Verify Manifest

1. Open: `https://your-app.vercel.app/.well-known/openai-apps.json`
2. Should see the JSON file
3. Verify `homepage_url` matches your Vercel URL

---

## Option 2: Deploy via Vercel CLI (If SSL issue is resolved)

### Step 1: Login to Vercel

```bash
vercel login
```

### Step 2: Deploy

```bash
vercel --prod
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (Select your account)
- Link to existing project? **No**
- Project name? (Press Enter for default)
- Directory? (Press Enter for current directory)

### Step 3: Set Environment Variables

```bash
vercel env add NEXT_PUBLIC_MOENGAGE_DATACENTER
# Enter: dc_01

vercel env add NEXT_PUBLIC_MOENGAGE_APP_ID
# Enter: 3RADPYNEBZ2MCOJ43EEW5FWV
```

### Step 4: Redeploy

```bash
vercel --prod
```

---

## Option 3: Deploy to Other Platforms

### Netlify

1. Go to [https://netlify.com](https://netlify.com)
2. Drag and drop your `.next` folder (after `npm run build`)
3. Or connect GitHub repository
4. Set environment variables in Netlify dashboard
5. Deploy

### Railway

1. Go to [https://railway.app](https://railway.app)
2. Create new project from GitHub
3. Set environment variables
4. Deploy

### Render

1. Go to [https://render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set environment variables
5. Deploy

---

## After Deployment

### 1. Update ChatGPT App Manifest

Edit `public/.well-known/openai-apps.json` and set:
```json
{
  "homepage_url": "https://YOUR-DEPLOYMENT-URL.com"
}
```

### 2. Register with OpenAI

1. Go to [https://platform.openai.com](https://platform.openai.com)
2. Navigate to Apps section
3. Create new app
4. Set manifest URL: `https://YOUR-DEPLOYMENT-URL.com/.well-known/openai-apps.json`

### 3. Test Deployment

1. Open your deployment URL
2. Verify app loads correctly
3. Check MoEngage SDK initializes
4. Test tracking events
5. Verify in MoEngage dashboard

---

## Troubleshooting

### SSL Certificate Error (CLI)

If you get SSL certificate errors with Vercel CLI:
- Use Option 1 (Dashboard deployment) instead
- Or check your network/proxy settings
- Or try: `NODE_TLS_REJECT_UNAUTHORIZED=0 vercel --prod` (not recommended for production)

### Environment Variables Not Working

- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding environment variables
- Check Vercel dashboard → Settings → Environment Variables

### Manifest Not Accessible

- Ensure file is in `public/.well-known/` directory
- Check file permissions
- Verify URL is correct: `https://your-app.vercel.app/.well-known/openai-apps.json`

---

## Quick Reference

**Your MoEngage Credentials:**
- Data Center: `dc_01`
- App ID: `3RADPYNEBZ2MCOJ43EEW5FWV`

**Environment Variables to Set:**
```
NEXT_PUBLIC_MOENGAGE_DATACENTER=dc_01
NEXT_PUBLIC_MOENGAGE_APP_ID=3RADPYNEBZ2MCOJ43EEW5FWV
```

