# GitHub Setup Instructions

## Authentication Issue

You're currently logged in as `ksr-2013` but trying to push to `taranisatti/NovaNote`. Here are solutions:

## Solution 1: Use Personal Access Token (Recommended)

1. **Create a Personal Access Token:**
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a name (e.g., "NovaNote")
   - Select scopes: `repo` (full control of private repositories)
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again!)

2. **Update remote URL with token:**
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/taranisatti/NovaNote.git
   ```
   Replace `YOUR_TOKEN` with your actual token.

3. **Push again:**
   ```bash
   git push -u origin main
   ```

## Solution 2: Use SSH (More Secure)

1. **Generate SSH key** (if you don't have one):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **Add SSH key to GitHub:**
   - Copy your public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to GitHub → Settings → SSH and GPG keys → New SSH key
   - Paste your key and save

3. **Update remote to use SSH:**
   ```bash
   git remote set-url origin git@github.com:taranisatti/NovaNote.git
   ```

4. **Push:**
   ```bash
   git push -u origin main
   ```

## Solution 3: Update Git Credentials

1. **Update your Git config:**
   ```bash
   git config --global user.name "taranisatti"
   git config --global user.email "your_email@example.com"
   ```

2. **Clear cached credentials:**
   ```bash
   git credential-manager-core erase
   ```
   Or on Windows:
   ```bash
   cmdkey /list
   cmdkey /delete:git:https://github.com
   ```

3. **Push again** (will prompt for credentials):
   ```bash
   git push -u origin main
   ```

## Solution 4: Use GitHub CLI

1. **Install GitHub CLI** (if not installed)

2. **Authenticate:**
   ```bash
   gh auth login
   ```

3. **Push:**
   ```bash
   git push -u origin main
   ```

## Quick Fix (Windows Credential Manager)

1. Open **Credential Manager** (Windows Key + Search "Credential Manager")
2. Go to **Windows Credentials**
3. Find `git:https://github.com`
4. Click **Edit** or **Remove**
5. Update with correct credentials
6. Try pushing again

---

**Note:** Your Supabase credentials are in `supabase-config.js`. Consider:
- Using environment variables instead
- Adding `supabase-config.js` to `.gitignore`
- Creating a `supabase-config.example.js` template file

