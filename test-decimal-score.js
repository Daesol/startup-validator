// Script to test creating a UVP agent analysis with a decimal score
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or service role key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDecimalScore() {
  console.log('Testing creating an agent analysis with a decimal score...');
  
  try {
    // First, let's get an existing validation ID to use
    const { data: validationData, error: validationError } = await supabase
      .from('vc_validation_analyses')
      .select('id')
      .limit(1)
      .single();
    
    if (validationError) {
      throw validationError;
    }
    
    const validationId = validationData.id;
    console.log(`Using validation ID: ${validationId}`);
    
    // Now, let's create a test UVP agent analysis with a decimal score
    const testData = {
      vc_validation_id: validationId,
      agent_type: 'uvp',
      input_context: {
        business_idea: 'Test business idea',
        test: true
      },
      analysis: {
        one_liner: 'Test UVP',
        strengths: ['Test strength'],
        weaknesses: ['Test weakness']
      },
      score: 7.5,  // Decimal score that was previously causing issues
      reasoning: 'Test reasoning with decimal score',
      enhanced_context: {}
    };
    
    console.log('Creating test UVP agent analysis with decimal score 7.5...');
    
    const { data: insertData, error: insertError } = await supabase
      .from('vc_agent_analyses')
      .insert(testData)
      .select();
    
    if (insertError) {
      throw insertError;
    }
    
    console.log('Successfully created agent analysis with decimal score!');
    console.log('New analysis ID:', insertData[0].id);
    console.log('Score:', insertData[0].score);
    
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
    
    console.log('\nThe database is now correctly handling decimal scores for agent analyses!');
    
  } catch (error) {
    console.error('Error testing decimal score:', error);
    process.exit(1);
  }
}

testDecimalScore(); 