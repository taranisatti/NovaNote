// ===== Supabase Configuration =====
// This file reads from environment variables for secure deployment
// For local development, uses fallback values
// For production, loads from env-config.json via env-config.js

// Get values from window._env (set by env-config.js) or use fallback
const SUPABASE_URL = (window._env && window._env.SUPABASE_URL) || 
                     'https://wnjfltwcuunwirqfjxyk.supabase.co';

const SUPABASE_ANON_KEY = (window._env && window._env.SUPABASE_ANON_KEY) || 
                          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduamZsdHdjdXVud2lycWZqeHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwMjUwOTEsImV4cCI6MjA4MDYwMTA5MX0.KErpYcKv5oMyyRTwBmKzmmv5SKkOtDnbdhZS-TKsONs';

// Initialize Supabase client
let supabase;
try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (error) {
    console.error('Supabase initialization error:', error);
    // Fallback: Show error message to user
    document.addEventListener('DOMContentLoaded', function() {
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.innerHTML = 
                '<div class="auth-container">' +
                    '<div class="auth-header">' +
                        '<h1>Configuration Required</h1>' +
                    '</div>' +
                    '<div style="padding: 2rem; text-align: center; color: var(--text-primary);">' +
                        '<p>Please configure Supabase credentials</p>' +
                        '<p style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.9rem;">' +
                            'See DEPLOYMENT.md for instructions' +
                        '</p>' +
                    '</div>' +
                '</div>';
        }
    });
}
