# Manual Deployment Guide (Alternative Method)

Since Vercel CLI has SSL issues, here's how to deploy manually:

## Option 1: Deploy via Vercel Dashboard (Easiest)

### Step 1: Prepare Your Code

1. **Make sure all files are ready**:
   ```bash
   cd /Users/aman.verma/Desktop/Projects/OPEN_AI_SDK/chatgpt-app-sample
   npm run build
   ```

2. **Create a Git repository** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Hotel booking app"
   ```

3. **Push to GitHub**:
   - Create a new repository on GitHub
   - Push your code:
     ```bash
     git remote add origin https://github.com/YOUR-USERNAME/hotel-booking-app.git
     git push -u origin main
     ```

### Step 2: Deploy via Vercel Dashboard

1. **Go to Vercel**: https://vercel.com/new

2. **Import your repository**:
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: **./** (leave as is)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add:
     - **Name**: `NEXT_PUBLIC_MOENGAGE_DATACENTER`
     - **Value**: `dc_01`
     - Click "Add"
   - Add:
     - **Name**: `NEXT_PUBLIC_MOENGAGE_APP_ID`
     - **Value**: `3RADPYNEBZ2MCOJ43EEW5FWV`
     - Click "Add"

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete (2-3 minutes)
   - **Copy your deployment URL** (e.g., `https://hotel-booking-app-xyz.vercel.app`)

---

## Option 2: Deploy via Vercel CLI (Fix SSL Issue)

If you want to fix the SSL issue:

### For macOS:
```bash
# Install certificates
brew install ca-certificates

# Or set Node to not reject unauthorized certificates (not recommended for production)
export NODE_TLS_REJECT_UNAUTHORIZED=0
vercel
```

### Or use npm script:
Add to `package.json`:
```json
"scripts": {
  "deploy": "NODE_TLS_REJECT_UNAUTHORIZED=0 vercel --prod"
}
```

Then run:
```bash
npm run deploy
```

---

## After Deployment

### Step 1: Update Configuration Files

1. **Update `public/ai-plugin.json`**:
   Replace `https://your-app.vercel.app` with your actual Vercel URL

2. **Update `public/.well-known/openapi.yaml`**:
   Replace `https://your-app.vercel.app` with your actual Vercel URL

3. **Commit and push changes**:
   ```bash
   git add .
   git commit -m "Update deployment URLs"
   git push
   ```

4. **Vercel will auto-redeploy** (or manually redeploy from dashboard)

---

## Step 2: Create ChatGPT GPT

1. **Go to OpenAI Platform**: https://platform.openai.com/
2. **Click "GPTs"** → **"Create"**
3. **Configure**:
   - Name: `Hotel Booking Assistant`
   - Instructions: `You are a hotel booking assistant. Help users search and book hotels.`
4. **Add Widget**:
   - Widget URL: `https://YOUR-VERCEL-URL.vercel.app`
5. **Save**

---

## Step 3: Test

1. Go to: https://chat.openai.com
2. Click your name → "My GPTs" → "Hotel Booking Assistant"
3. Try: `"I want to book a hotel in Paris for next week"`

---

## Quick Commands

```bash
# Build locally
npm run build

# Test locally
npm run dev

# Check if ready for deployment
npm run build && echo "✅ Ready to deploy!"
```

---

**Recommended**: Use Option 1 (Vercel Dashboard) - it's the easiest and most reliable method!

