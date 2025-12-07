# Quick Start - Environment Variables Setup

## For Local Development

1. **Option 1: Use defaults** (already configured in `supabase-config.js`)
   - Just open `index.html` in your browser
   - Works immediately with the default values

2. **Option 2: Use .env file**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Option 3: Create env-config.json**
   ```bash
   node build-env.js
   # Or manually create env-config.json from env-config.json.example
   ```

## For Deployment

### Netlify/Vercel (Recommended)

1. Push code to GitHub (without `env-config.json`)
2. In your hosting platform:
   - Add environment variables:
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`
3. Deploy - variables are automatically available

### GitHub Pages

1. Set GitHub Secrets:
   - Repository → Settings → Secrets → Actions
   - Add `SUPABASE_URL` and `SUPABASE_ANON_KEY`
2. Push code - GitHub Actions will create `env-config.json` automatically

### Manual Deployment

1. Create `env-config.json`:
   ```bash
   SUPABASE_URL=https://... SUPABASE_ANON_KEY=... node build-env.js
   ```
2. Upload all files to your hosting provider
3. Make sure `env-config.json` is accessible

## Current Configuration

Your Supabase credentials are currently:
- **URL**: `https://wnjfltwcuunwirqfjxyk.supabase.co`
- **Key**: Set in `supabase-config.js` (fallback value)

For production, use environment variables instead!


