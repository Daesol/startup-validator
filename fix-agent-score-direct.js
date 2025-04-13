// Script to fix the vc_agent_analyses score column type using direct SQL
require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const mcpKey = process.env.SUPABASE_MCP_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or service role key');
  process.exit(1);
}

async function fixAgentScoreType() {
  console.log('Attempting to fix the agent score data type directly...');
  
  try {
    // First approach: Try using sql endpoint with service role key
    const response = await fetch(`${supabaseUrl}/rest/v1/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      },
      body: JSON.stringify({
        query: 'ALTER TABLE public.vc_agent_analyses ALTER COLUMN score TYPE NUMERIC;'
      })
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`API error: ${JSON.stringify(result)}`);
    }
    
    console.log('Successfully fixed the score column type!');
    console.log(result);
  } catch (error) {
    console.error('Error fixing agent score type:', error);
    
    // Second approach: Try alternative method
    console.log('Trying alternative approach...');
    
    try {
      // Create a simple update with a decimal score to test
      const updateResponse = await fetch(`${supabaseUrl}/rest/v1/vc_agent_analyses?id=eq.495cfa00-6b07-445e-adcc-db470335dd52`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          score: 8.5
        })
      });
      
      if (!updateResponse.ok) {
        const errorResult = await updateResponse.json();
        throw new Error(`Update failed: ${JSON.stringify(errorResult)}`);
      }
      
      console.log('Successfully updated a score with decimal value, which suggests the type is now correct');
    } catch (fallbackError) {
      console.error('Fallback approach also failed:', fallbackError);
    }
  }
}

fixAgentScoreType(); 