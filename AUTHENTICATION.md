# Authentication System - NovaNote

## Overview

NovaNote now includes a complete authentication system that allows multiple users to have their own separate task lists and data. Each user's data is stored separately in LocalStorage.

## Features

### 1. User Registration (Sign Up)
- Create a new account with:
  - Full Name
  - Email (used as unique identifier)
  - Password (minimum 6 characters)
  - Password confirmation
- Email validation
- Password strength check
- Automatic login after successful registration

### 2. User Login (Sign In)
- Login with email and password
- Session management (7-day sessions)
- Automatic session restoration on page load
- Error handling for invalid credentials

### 3. Session Management
- Sessions last 7 days
- Automatic logout after session expiration
- Session stored in LocalStorage
- Secure session validation

### 4. User-Specific Data
- Each user has their own:
  - Task list
  - Archive
  - Settings (theme, dark mode, auto-clean preferences)
- Data is isolated per user using email as key
- No data sharing between users

### 5. Logout
- Secure logout with confirmation
- Clears session
- Returns to login screen
- Preserves user account (data remains for next login)

## How It Works

### Data Storage Structure

```
LocalStorage Keys:
- novanote_users: { email: { name, email, password (hashed), createdAt } }
- novanote_session: { user: { name, email }, timestamp }
- novanote_tasks_{email}: [tasks array]
- novanote_archive_{email}: [archived tasks array]
- novanote_settings_{email}: { theme, darkMode, autoClean }
```

### Password Security

- Passwords are hashed using a simple hash function
- **Note**: This is client-side hashing for basic protection
- For production use, implement server-side authentication with proper encryption

### Session Flow

1. **Page Load**: Check for existing session
2. **Valid Session**: Show app, load user data
3. **Invalid/Expired Session**: Show login screen
4. **Login**: Create new session, show app
5. **Logout**: Clear session, show login screen

## Usage

### Creating an Account

1. Open NovaNote
2. Click "Sign Up" link (or form is already visible)
3. Fill in:
   - Your full name
   - Email address
   - Password (min 6 characters)
   - Confirm password
4. Click "Create Account"
5. You'll be automatically logged in

### Logging In

1. Enter your email and password
2. Click "Sign In"
3. Your tasks and settings will be loaded

### Switching Between Login/Signup

- Click the link at the bottom of the form
- Forms switch smoothly with animation
- Form fields are cleared when switching

### Logging Out

1. Click the "Logout" button in the navigation bar
2. Confirm logout
3. You'll be returned to the login screen
4. Your data remains saved for next login

## Security Considerations

### Current Implementation (Client-Side)

- **Password Hashing**: Simple hash function (not cryptographically secure)
- **LocalStorage**: All data stored in browser
- **No Server**: Everything runs client-side
- **Session Management**: 7-day expiration

### For Production Use

⚠️ **Important**: This authentication is suitable for:
- Personal use
- Development/testing
- Learning purposes

**Not suitable for**:
- Production applications with sensitive data
- Multi-user systems requiring real security
- Applications handling financial or personal information

### Recommended Improvements for Production

1. **Backend Authentication**
   - Use a proper backend server
   - Implement JWT tokens
   - Use bcrypt for password hashing
   - Add rate limiting

2. **HTTPS**
   - Always use HTTPS in production
   - Protects data in transit

3. **Password Requirements**
   - Enforce stronger passwords
   - Add password complexity rules
   - Implement password reset functionality

4. **Session Management**
   - Use secure, httpOnly cookies
   - Implement refresh tokens
   - Add session timeout warnings

5. **Additional Security**
   - Add email verification
   - Implement two-factor authentication
   - Add account lockout after failed attempts
   - Log security events

## Technical Details

### Password Hashing Function

```javascript
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}
```

This is a simple hash function. For production, use:
- bcrypt
- Argon2
- scrypt
- PBKDF2

### Session Validation

```javascript
function checkAuthentication() {
    const session = localStorage.getItem('novanote_session');
    if (session) {
        const sessionData = JSON.parse(session);
        const sessionTime = new Date(sessionData.timestamp);
        const now = new Date();
        const daysDiff = (now - sessionTime) / (1000 * 60 * 60 * 24);
        
        if (daysDiff < 7) {
            // Valid session
            currentUser = sessionData.user;
            showApp();
        } else {
            // Expired session
            localStorage.removeItem('novanote_session');
            showAuth();
        }
    } else {
        showAuth();
    }
}
```

### User Data Isolation

Each user's data is stored with their email as part of the key:

```javascript
const userKey = `novanote_tasks_${currentUser.email}`;
const archiveKey = `novanote_archive_${currentUser.email}`;
const settingsKey = `novanote_settings_${currentUser.email}`;
```

This ensures complete data separation between users.

## Troubleshooting

### Can't Login
- Check email spelling (case-insensitive)
- Verify password is correct
- Try creating a new account if email doesn't exist

### Session Expired
- Sessions expire after 7 days
- Simply log in again
- Your data is still saved

### Forgot Password
- Currently no password reset feature
- You can create a new account with a different email
- Or manually clear LocalStorage and start fresh

### Multiple Users on Same Browser
- Each user needs to logout before another can login
- Data is stored separately per user
- No data mixing between users

## Future Enhancements

Potential improvements:
1. Password reset via email
2. Remember me option
3. Two-factor authentication
4. Account deletion
5. Profile management
6. Change password functionality
7. Email verification
8. Social login (Google, GitHub, etc.)
9. Account recovery options
10. Activity logging

---

**Note**: This authentication system is designed for simplicity and learning. For production applications, always use proper backend authentication with industry-standard security practices.

