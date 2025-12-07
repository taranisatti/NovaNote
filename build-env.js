#!/usr/bin/env node

/**
 * Build script to create env-config.json from environment variables
 * Usage: SUPABASE_URL=... SUPABASE_ANON_KEY=... node build-env.js
 */

const fs = require('fs');
const path = require('path');

// Get environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required');
    console.log('\nUsage:');
    console.log('  SUPABASE_URL=https://... SUPABASE_ANON_KEY=... node build-env.js');
    process.exit(1);
}

// Create env-config.json
const envConfig = {
    SUPABASE_URL: SUPABASE_URL,
    SUPABASE_ANON_KEY: SUPABASE_ANON_KEY
};

const outputPath = path.join(__dirname, 'env-config.json');

try {
    fs.writeFileSync(outputPath, JSON.stringify(envConfig, null, 2));
    console.log('✅ Successfully created env-config.json');
    console.log(`   SUPABASE_URL: ${SUPABASE_URL.substring(0, 30)}...`);
    console.log(`   SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY.substring(0, 20)}...`);
} catch (error) {
    console.error('❌ Error creating env-config.json:', error.message);
    process.exit(1);
}


