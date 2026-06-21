const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

async function applyMigration() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing env vars');
      process.exit(1);
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const sql = fs.readFileSync('./supabase/migration_bonus_questions.sql', 'utf-8');
    
    // Test connection
    const { data, error } = await supabase.from('matches').select('id', { count: 'exact' });
    if (error) {
      console.error('Connection failed:', error);
      process.exit(1);
    }

    console.log('✓ Connected to Supabase');
    console.log('⚠️  REST API cannot execute SQL - use Supabase Dashboard SQL Editor');
    
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

applyMigration();
