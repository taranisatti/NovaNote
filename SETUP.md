# Supabase Setup Guide for NovaNote

This guide will help you set up Supabase authentication and database for NovaNote.

## Prerequisites

1. A Supabase account (free tier available at [supabase.com](https://supabase.com))
2. Basic knowledge of SQL (for creating tables)

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: NovaNote (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project to be created (2-3 minutes)

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** (gear icon)
2. Click **API** in the left sidebar
3. You'll see:
   - **Project URL**: Copy this (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key**: Copy this (starts with `eyJ...`)

## Step 3: Configure NovaNote

1. Open `supabase-config.js` in your project
2. Replace the placeholders:

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

3. Save the file

## Step 4: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the following SQL:

```sql
-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Personal',
    priority VARCHAR(10) NOT NULL DEFAULT 'low',
    completed BOOLEAN NOT NULL DEFAULT false,
    archived BOOLEAN NOT NULL DEFAULT false,
    reminder_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    theme VARCHAR(20) NOT NULL DEFAULT 'space',
    dark_mode BOOLEAN NOT NULL DEFAULT true,
    auto_clean VARCHAR(20) NOT NULL DEFAULT 'never',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_archived ON tasks(archived);
CREATE INDEX IF NOT EXISTS idx_tasks_user_archived ON tasks(user_id, archived);

-- Enable Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks table
CREATE POLICY "Users can view their own tasks"
    ON tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
    ON tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
    ON tasks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
    ON tasks FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for user_settings table
CREATE POLICY "Users can view their own settings"
    ON user_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
    ON user_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
    ON user_settings FOR UPDATE
    USING (auth.uid() = user_id);
```

4. Click **Run** (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

## Step 5: Enable Email Authentication

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Make sure **Email** is enabled
3. Configure email settings (optional):
   - **Enable email confirmations**: Recommended for production
   - **Enable email change confirmations**: Recommended
4. For development, you can disable email confirmations to test faster

## Step 6: Test Your Setup

1. Open `index.html` in your browser
2. Try to sign up with a new account
3. If email confirmation is disabled, you should be logged in immediately
4. If email confirmation is enabled, check your email and click the confirmation link
5. Try adding a task - it should save to Supabase!

## Troubleshooting

### "Supabase not configured" Error

- Check that `supabase-config.js` has correct URL and key
- Make sure the Supabase CDN is loaded in `index.html`

### "Failed to fetch" Error

- Check your Supabase URL is correct
- Check your internet connection
- Verify CORS settings in Supabase (should work by default)

### "Row Level Security" Error

- Make sure you ran all the SQL policies
- Check that RLS is enabled on both tables
- Verify policies are created correctly

### Tasks Not Saving

- Check browser console for errors
- Verify user is authenticated (check Supabase dashboard → Authentication → Users)
- Check that tables exist (Supabase dashboard → Table Editor)

### Email Not Sending

- For development, disable email confirmations
- Check Supabase logs (Settings → Logs)
- For production, configure SMTP settings in Supabase

## Database Schema Reference

### tasks table

| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key, auto-increment |
| user_id | UUID | Foreign key to auth.users |
| text | TEXT | Task description |
| category | VARCHAR(50) | Task category |
| priority | VARCHAR(10) | high/medium/low |
| completed | BOOLEAN | Completion status |
| archived | BOOLEAN | Archive status |
| reminder_time | TIMESTAMPTZ | Reminder datetime |
| created_at | TIMESTAMPTZ | Creation timestamp |
| completed_at | TIMESTAMPTZ | Completion timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

### user_settings table

| Column | Type | Description |
|--------|------|-------------|
| user_id | UUID | Primary key, foreign key to auth.users |
| theme | VARCHAR(20) | Selected theme name |
| dark_mode | BOOLEAN | Dark mode preference |
| auto_clean | VARCHAR(20) | Auto-clean mode setting |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

## Security Notes

1. **Row Level Security (RLS)**: Enabled on all tables
2. **Policies**: Users can only access their own data
3. **Anon Key**: Safe to use in frontend (it's public)
4. **Service Role Key**: Never expose this in frontend code!

## Real-time Features

NovaNote uses Supabase real-time subscriptions to automatically update the UI when tasks change. This works automatically once RLS policies are set up correctly.

## Next Steps

- Customize email templates in Supabase
- Set up SMTP for production email sending
- Add more database indexes if needed
- Consider adding database backups
- Monitor usage in Supabase dashboard

## Support

- Supabase Docs: [https://supabase.com/docs](https://supabase.com/docs)
- Supabase Discord: [https://discord.supabase.com](https://discord.supabase.com)
- NovaNote Issues: Check project repository

---

**Important**: Keep your Supabase credentials secure. Never commit them to public repositories. Consider using environment variables for production deployments.

