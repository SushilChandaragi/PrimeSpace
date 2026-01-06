# PrimeSpace Netlify Deployment Guide

## 🚀 Deploy to Netlify

### Prerequisites
1. GitHub/GitLab/Bitbucket account
2. MongoDB Atlas account with connection string
3. Netlify account (free tier works)

### Step 1: Prepare Your Repository
Push this project to your Git repository.

### Step 2: Install Dependencies
```bash
# Install serverless-http for backend
cd server
npm install
```

### Step 3: Deploy on Netlify

#### Option A: Using Netlify UI
1. Go to [Netlify](https://www.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Netlify will auto-detect the `netlify.toml` configuration
5. Click "Deploy site"

#### Option B: Using Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

### Step 4: Configure Environment Variables
In Netlify Dashboard, go to:
**Site settings** → **Environment variables** → **Add a variable**

Add these variables:
```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
```

### Step 5: Trigger Redeploy
After adding environment variables, click **"Trigger deploy"** to rebuild with the new settings.

---

## 📋 Configuration Files Created

1. **`netlify.toml`** - Netlify build configuration
2. **`server/netlify/functions/server.js`** - Serverless function wrapper
3. **`client/.env.production`** - Production API URL

---

## 🔧 Local Development

For local development, create `client/.env.development.local`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## ✅ Post-Deployment

1. Test your API: `https://your-site.netlify.app/.netlify/functions/server/api`
2. Test your frontend: `https://your-site.netlify.app`
3. Check Netlify Functions logs for any errors

---

## 🐛 Troubleshooting

### Functions not working?
- Check **Functions** tab in Netlify dashboard for error logs
- Verify environment variables are set correctly
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0) or Netlify's IPs

### Build fails?
- Check build logs in Netlify dashboard
- Verify all dependencies are in `package.json`
- Make sure Node version is compatible (18+)

### CORS errors?
- Backend CORS is configured to accept all origins
- If issues persist, update CORS in `server/netlify/functions/server.js`

---

## 📚 Additional Resources

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [MongoDB Atlas Network Access](https://docs.atlas.mongodb.com/security/ip-access-list/)
- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
