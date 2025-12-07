# Fix Email Authentication Issue

## Problem
After signing up, Supabase says to check your email, but no email arrives.

## Solution 1: Disable Email Confirmation (Quick Fix for Testing)

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to **Authentication** → **Providers** → **Email**
4. Find **"Enable email confirmations"**
5. **Turn it OFF** (toggle switch)
6. Save changes

Now users can sign up and login immediately without email confirmation!

## Solution 2: Configure SMTP (For Production)

If you want email confirmations to work, you need to set up SMTP:

1. Go to **Authentication** → **Settings** → **SMTP Settings**
2. Configure your SMTP provider:

### Option A: Use Gmail SMTP
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: your-email@gmail.com
SMTP Password: [Generate App Password from Google]
Sender Email: your-email@gmail.com
Sender Name: NovaNote
```

**To get Gmail App Password:**
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate password for "Mail"
5. Use that password in Supabase

### Option B: Use SendGrid (Recommended for Production)
1. Sign up at sendgrid.com
2. Create API Key
3. In Supabase:
   ```
   SMTP Host: smtp.sendgrid.net
   SMTP Port: 587
   SMTP User: apikey
   SMTP Password: [Your SendGrid API Key]
   Sender Email: your-verified-email@domain.com
   ```

### Option C: Use Resend (Easy Setup)
1. Sign up at resend.com
2. Get API key
3. Configure in Supabase

## Solution 3: Check Supabase Email Logs

1. Go to **Logs** → **Auth Logs**
2. Check if emails are being sent
3. Look for errors

## Solution 4: Use Magic Link Instead

1. Go to **Authentication** → **Providers** → **Email**
2. Enable **"Enable magic link"**
3. Users can sign in with just email (no password needed)

## Quick Test After Fix

1. **Disable email confirmation** (Solution 1 - fastest)
2. Try signing up again
3. You should be logged in immediately!

## For Production

- Keep email confirmation **ON** for security
- Set up proper SMTP (SendGrid/Resend recommended)
- Test email delivery before going live
- Monitor email logs in Supabase

---

**Recommended for Development:** Disable email confirmation
**Recommended for Production:** Enable email confirmation + Configure SMTP


