// Script to fix the vc_agent_analyses score column type
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or service role key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixAgentScoreType() {
  console.log('Attempting to fix the agent score data type...');
  
  try {
    // Using Supabase's RPC functionality to execute raw SQL
    const { error } = await supabase.rpc('execute_sql', {
      query: 'ALTER TABLE public.vc_agent_analyses ALTER COLUMN score TYPE NUMERIC;'
    });
    
    if (error) {
      throw error;
    }
    
    console.log('Successfully altered score column type to NUMERIC');
  } catch (error) {
    console.error('Error fixing agent score type:', error);
    
    // Fallback approach - try to update the column for future inserts
    try {
      console.log('Trying alternative approach...');
      
      // Check if we have an execute_sql function, if not create it
      const { data: funcExists, error: funcCheckError } = await supabase
        .from('pg_proc')
        .select('proname')
        .eq('proname', 'execute_sql')
        .maybeSingle();
        
      if (funcCheckError) {
        console.log('Could not check if execute_sql function exists, trying direct approach');
        
        // Try to create the function directly
        const { error: createFuncError } = await supabase.rpc('execute_sql', {
          query: `
          CREATE OR REPLACE FUNCTION public.execute_sql(query text)
          RETURNS void AS $$
          BEGIN
            EXECUTE query;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
          `
        });
        
        if (createFuncError) {
          console.log('Could not create execute_sql function, will try to update schema type only');
        }
      }
      
      // Execute the ALTER TABLE statement
      const { error: alterError } = await supabase.rpc('execute_sql', {
        query: 'ALTER TABLE public.vc_agent_analyses ALTER COLUMN score TYPE NUMERIC;'
      });
      
      if (alterError) {
        throw alterError;
      }
      
      console.log('Successfully altered score column type to NUMERIC using alternative approach');
    } catch (fallbackError) {
      console.error('Fallback approach also failed:', fallbackError);
      process.exit(1);
    }
  }
}

fixAgentScoreType(); 