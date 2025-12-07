# Supabase Email Setup - Step by Step

## ⚠️ Current Issue
Emails are not being sent after signup. Here's how to fix it:

## 🚀 Quick Fix (5 minutes)

### Step 1: Disable Email Confirmation
1. Open: https://app.supabase.com
2. Select your project: **wnjfltwcuunwirqfjxyk**
3. Click **Authentication** (left sidebar)
4. Click **Providers**
5. Click **Email** provider
6. Find **"Confirm email"** toggle
7. **Turn it OFF** ⬅️
8. Click **Save**

### Step 2: Test
1. Go to your app
2. Try signing up again
3. You should be logged in immediately! ✅

---

## 📧 For Production (Proper Email Setup)

### Option 1: Gmail SMTP (Free, Easy)

1. **Enable 2-Step Verification on Google:**
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Create App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Supabase"
   - Copy the 16-character password

3. **Configure in Supabase:**
   - Go to: Authentication → Settings → SMTP Settings
   - Fill in:
     ```
     SMTP Host: smtp.gmail.com
     SMTP Port: 587
     SMTP User: your-email@gmail.com
     SMTP Password: [paste the 16-char app password]
     Sender Email: your-email@gmail.com
     Sender Name: NovaNote
     ```
   - Click **Save**

4. **Enable Email Confirmation:**
   - Go back to Authentication → Providers → Email
   - Turn **"Confirm email"** ON
   - Save

### Option 2: SendGrid (Recommended for Production)

1. **Sign up:** https://sendgrid.com (free tier: 100 emails/day)

2. **Create API Key:**
   - Dashboard → Settings → API Keys
   - Create API Key
   - Copy the key

3. **Verify Sender:**
   - Settings → Sender Authentication
   - Verify your email

4. **Configure in Supabase:**
   ```
   SMTP Host: smtp.sendgrid.net
   SMTP Port: 587
   SMTP User: apikey
   SMTP Password: [your SendGrid API key]
   Sender Email: your-verified-email@domain.com
   Sender Name: NovaNote
   ```

### Option 3: Resend (Modern, Easy)

1. **Sign up:** https://resend.com (free tier available)

2. **Get API Key:**
   - Dashboard → API Keys
   - Create new key

3. **Configure in Supabase:**
   ```
   SMTP Host: smtp.resend.com
   SMTP Port: 587
   SMTP User: resend
   SMTP Password: [your Resend API key]
   Sender Email: your-verified-email@domain.com
   ```

---

## 🔍 Check Email Logs

To see if emails are being sent:

1. Supabase Dashboard → **Logs** → **Auth Logs**
2. Look for email sending attempts
3. Check for errors

---

## ✅ Testing Checklist

After setup:
- [ ] Sign up with new email
- [ ] Check email inbox (and spam folder)
- [ ] Click confirmation link
- [ ] Should be able to login

---

## 🎯 Recommended Setup

**For Development:**
- ✅ Disable email confirmation
- ✅ Fast testing, no email needed

**For Production:**
- ✅ Enable email confirmation
- ✅ Set up SMTP (SendGrid or Resend)
- ✅ Test email delivery
- ✅ Monitor email logs

---

## 💡 Pro Tips

1. **Gmail limits:** 500 emails/day (free account)
2. **SendGrid:** 100 emails/day (free tier)
3. **Resend:** 3,000 emails/month (free tier)
4. **Always test** before going live!
5. **Check spam folder** if emails don't arrive

---

**Need help?** Check Supabase docs: https://supabase.com/docs/guides/auth/auth-smtp


