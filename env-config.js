// ===== Environment Variables Loader =====
// This script loads environment variables from env-config.json
// Used for static hosting platforms that don't support build-time env vars

(function() {
    // Try to load from env-config.json
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/env-config.json', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    var config = JSON.parse(xhr.responseText);
                    // Set environment variables on window object
                    window._env = {
                        SUPABASE_URL: config.SUPABASE_URL,
                        SUPABASE_ANON_KEY: config.SUPABASE_ANON_KEY
                    };
                    console.log('Environment variables loaded from env-config.json');
                } catch (e) {
                    console.log('Error parsing env-config.json, using defaults');
                }
            } else {
                // File not found, use defaults from supabase-config.js
                console.log('env-config.json not found, using default configuration');
            }
        }
    };
    xhr.send();
})();
