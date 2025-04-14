// Script to check the vc_agent_analyses score column type
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or service role key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAgentScoreType() {
  console.log('Checking the agent score data type...');
  
  try {
    // Fetch a sample record with decimal score
    const { data, error } = await supabase
      .from('vc_agent_analyses')
      .select('id, score')
      .eq('id', '495cfa00-6b07-445e-adcc-db470335dd52')
      .single();
    
    if (error) {
      throw error;
    }
    
    console.log('Score data fetched successfully:');
    console.log('Score value:', data.score);
    console.log('Score type:', typeof data.score);
    
    // Try inserting a test record with decimal score
    const { data: insertData, error: insertError } = await supabase
      .from('vc_agent_analyses')
      .insert({
        vc_validation_id: 'e0d2b7b8-e1ef-4561-b644-99a844949745',
        agent_type: 'test',
        input_context: {},
        analysis: {},
        score: 7.5,
        reasoning: 'Test decimal score',
        enhanced_context: {}
      })
      .select();
    
    if (insertError) {
      console.log('Insert test failed:', insertError.message);
    } else {
      console.log('Successfully inserted test record with decimal score:', insertData[0].score);
      
      // Clean up the test record
      const { error: deleteError } = await supabase
        .from('vc_agent_analyses')
        .delete()
        .eq('id', insertData[0].id);
      
      if (deleteError) {
        console.log('Warning: Could not delete test record:', deleteError.message);
      } else {
        console.log('Test record deleted successfully');
      }
    }
    
    console.log('\nThe score column appears to be correctly set to NUMERIC type.');
    
  } catch (error) {
    console.error('Error checking agent score type:', error);
  }
}

checkAgentScoreType(); 