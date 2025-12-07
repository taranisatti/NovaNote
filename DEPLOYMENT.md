# Deployment Guide - NovaNote with Environment Variables

This guide shows how to deploy NovaNote with secure environment variable configuration.

## Environment Variables Required

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

## Deployment Methods

### Method 1: Netlify

1. **Push your code to GitHub** (make sure `supabase-config.js` is in `.gitignore`)

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

3. **Set Environment Variables:**
   - Go to Site settings → Environment variables
   - Add:
     - `SUPABASE_URL` = `https://wnjfltwcuunwirqfjxyk.supabase.co`
     - `SUPABASE_ANON_KEY` = `your-anon-key`

4. **Create `netlify.toml` in your project root:**
   ```toml
   [build]
     publish = "."
     command = "echo 'No build needed'"

   [[plugins]]
     package = "@netlify/plugin-inline-functions-env-vars"

   [build.environment]
     NODE_VERSION = "18"
   ```

5. **Create `_redirects` file** (for SPA routing):
   ```
   /*    /index.html   200
   ```

6. **Deploy:** Netlify will automatically deploy on push

### Method 2: Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set Environment Variables:**
   - Go to your project on [vercel.com](https://vercel.com)
   - Settings → Environment Variables
   - Add:
     - `SUPABASE_URL` = `https://wnjfltwcuunwirqfjxyk.supabase.co`
     - `SUPABASE_ANON_KEY` = `your-anon-key`

4. **Create `vercel.json`:**
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

5. **Redeploy** after setting environment variables

### Method 3: GitHub Pages (with GitHub Actions)

1. **Create `.github/workflows/deploy.yml`:**
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Create env-config.json
           run: |
             echo '{"SUPABASE_URL":"${{ secrets.SUPABASE_URL }}","SUPABASE_ANON_KEY":"${{ secrets.SUPABASE_ANON_KEY }}"}' > env-config.json
         
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./
   ```

2. **Set GitHub Secrets:**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add secrets:
     - `SUPABASE_URL` = `https://wnjfltwcuunwirqfjxyk.supabase.co`
     - `SUPABASE_ANON_KEY` = `your-anon-key`

3. **Enable GitHub Pages:**
   - Settings → Pages
   - Source: GitHub Actions

4. **Update `index.html`** to load env-config.js before supabase-config.js:
   ```html
   <script src="env-config.js"></script>
   <script src="supabase-config.js"></script>
   ```

### Method 4: Static Hosting (Manual)

1. **Create `env-config.json`** with your credentials:
   ```json
   {
     "SUPABASE_URL": "https://wnjfltwcuunwirqfjxyk.supabase.co",
     "SUPABASE_ANON_KEY": "your-anon-key-here"
   }
   ```

2. **Update `index.html`** to load env-config.js:
   ```html
   <script src="env-config.js"></script>
   <script src="supabase-config.js"></script>
   ```

3. **Upload all files** to your hosting provider

4. **Important:** Make sure `env-config.json` is accessible but not in version control

### Method 5: Using Build Script

Create a simple build script that injects environment variables:

**`build.js`:**
```javascript
const fs = require('fs');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wnjfltwcuunwirqfjxyk.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your-default-key';

// Create env-config.json
const envConfig = {
  SUPABASE_URL: SUPABASE_URL,
  SUPABASE_ANON_KEY: SUPABASE_ANON_KEY
};

fs.writeFileSync('env-config.json', JSON.stringify(envConfig, null, 2));
console.log('Environment config created!');
```

**Usage:**
```bash
SUPABASE_URL=https://... SUPABASE_ANON_KEY=... node build.js
```

## Local Development

1. **Create `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. **Fill in your values:**
   ```
   SUPABASE_URL=https://wnjfltwcuunwirqfjxyk.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **For local dev, you can also:**
   - Use the default values in `supabase-config.js`
   - Or create `env-config.json` manually

## Security Best Practices

1. ✅ **Never commit** `.env` or `env-config.json` to Git
2. ✅ **Use environment variables** in your hosting platform
3. ✅ **Rotate keys** if accidentally exposed
4. ✅ **Use different keys** for development and production
5. ✅ **Enable RLS** in Supabase for security

## Quick Setup Script

Create `setup-env.sh`:
```bash
#!/bin/bash

echo "Setting up environment variables..."

read -p "Enter Supabase URL: " SUPABASE_URL
read -sp "Enter Supabase Anon Key: " SUPABASE_ANON_KEY
echo

cat > env-config.json << EOF
{
  "SUPABASE_URL": "$SUPABASE_URL",
  "SUPABASE_ANON_KEY": "$SUPABASE_ANON_KEY"
}
EOF

echo "env-config.json created successfully!"
echo "Remember to add it to .gitignore!"
```

## Troubleshooting

### Environment variables not loading
- Check browser console for errors
- Verify `env-config.json` is accessible (check Network tab)
- Ensure `env-config.js` loads before `supabase-config.js`

### CORS errors
- Check Supabase dashboard → Settings → API
- Add your domain to allowed origins

### Authentication not working
- Verify environment variables are set correctly
- Check Supabase project is active
- Verify RLS policies are set up (see SETUP.md)

## Platform-Specific Notes

### Netlify
- Environment variables are available at build time
- Use Netlify's environment variable UI
- Variables are automatically injected

### Vercel
- Set environment variables in dashboard
- Available at build and runtime
- Supports preview deployments with different env vars

### GitHub Pages
- Use GitHub Actions secrets
- Create `env-config.json` during build
- Static files only, no server-side processing

### Cloudflare Pages
- Set environment variables in dashboard
- Available at build time
- Similar to Netlify setup

---

**Remember:** Always keep your Supabase credentials secure and never commit them to version control!

