# Deployment Guide for NewLeaf

## Option 1: Vercel (Recommended - Easiest)

### Prerequisites
- GitHub account
- Vercel account (free)

### Steps:

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to https://vercel.com
   - Sign up/Login with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - Add Environment Variables:
     - `NEXT_PUBLIC_FIREBASE_API_KEY`
     - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
     - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
     - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
     - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
     - `NEXT_PUBLIC_FIREBASE_APP_ID`
     - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (if using Cloudinary)
     - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (if using Cloudinary)
   - Click "Deploy"
   - Your app will be live at `https://your-project-name.vercel.app`

3. **Automatic Deployments:**
   - Every push to main branch automatically deploys
   - Preview deployments for pull requests

---

## Option 2: Firebase Hosting

### Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project created

### Steps:

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project:**
   ```bash
   firebase init hosting
   ```
   - Select "Use an existing project" or create new
   - Public directory: `.next` (for static export) OR use Next.js with Firebase Functions
   - Configure as single-page app: No
   - Set up automatic builds: Yes (if using GitHub)

4. **Build your Next.js app:**
   ```bash
   npm run build
   ```

5. **For Static Export (Simpler):**
   - Update `next.config.mjs`:
   ```javascript
   const nextConfig = {
     output: 'export',
     reactCompiler: true,
   };
   ```
   - Then build: `npm run build`
   - Deploy: `firebase deploy --only hosting`

6. **For Full Next.js (with SSR):**
   - Use Firebase Functions + Hosting
   - More complex setup required
   - See: https://firebase.google.com/docs/hosting/nextjs

---

## Option 3: Netlify

### Steps:

1. **Push to GitHub** (same as Vercel)

2. **Deploy on Netlify:**
   - Go to https://netlify.com
   - Sign up/Login with GitHub
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Add environment variables (same as Vercel)
   - Click "Deploy site"

---

## Option 4: Railway

### Steps:

1. **Push to GitHub**

2. **Deploy on Railway:**
   - Go to https://railway.app
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Add environment variables
   - Railway auto-detects Next.js and deploys

---

## Important Notes:

### Environment Variables
Make sure to add ALL environment variables in your deployment platform:
- Firebase config variables (all `NEXT_PUBLIC_FIREBASE_*`)
- Cloudinary variables (if using)
- Any other API keys

### Firebase Security Rules
Make sure your Firestore security rules are properly configured for production:
- Test your rules in Firebase Console
- Ensure rules allow proper read/write access

### Build Configuration
- Vercel automatically detects Next.js and configures build
- Other platforms may need manual configuration

### Custom Domain
All platforms allow adding custom domains:
- Vercel: Project Settings → Domains
- Firebase: Hosting → Add custom domain
- Netlify: Site Settings → Domain Management

---

## Recommended: Vercel
- ✅ Zero configuration needed
- ✅ Automatic deployments
- ✅ Free SSL certificate
- ✅ Global CDN
- ✅ Preview deployments for PRs
- ✅ Built by Next.js creators

