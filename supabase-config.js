// ===== Supabase Configuration =====
// Replace these with your Supabase project credentials
// Get them from: https://app.supabase.com -> Your Project -> Settings -> API

const SUPABASE_URL = 'https://wnjfltwcuunwirqfjxyk.supabase.co'; // e.g., 'https://xxxxx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduamZsdHdjdXVud2lycWZqeHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwMjUwOTEsImV4cCI6MjA4MDYwMTA5MX0.KErpYcKv5oMyyRTwBmKzmmv5SKkOtDnbdhZS-TKsONs'; // Your anon/public key

// Initialize Supabase client
let supabase;
try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (error) {
    console.error('Supabase initialization error:', error);
    // Fallback: Show error message to user
    document.addEventListener('DOMContentLoaded', () => {
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.innerHTML = `
                <div class="auth-container">
                    <div class="auth-header">
                        <h1>Configuration Required</h1>
                    </div>
                    <div style="padding: 2rem; text-align: center; color: var(--text-primary);">
                        <p>Please configure Supabase credentials in <code>supabase-config.js</code></p>
                        <p style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.9rem;">
                            See SETUP.md for instructions
                        </p>
                    </div>
                </div>
            `;
        }
    });
}

