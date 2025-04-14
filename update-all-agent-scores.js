// Script to update all existing vc_agent_analyses to ensure proper NUMERIC scores
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or service role key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateAllAgentScores() {
  console.log('Updating all agent scores to ensure proper NUMERIC values...');
  
  try {
    // Fetch all agent analyses
    const { data, error } = await supabase
      .from('vc_agent_analyses')
      .select('id, agent_type, score');
    
    if (error) {
      throw error;
    }
    
    console.log(`Found ${data.length} agent analyses to process`);
    
    // Process each analysis and ensure score is NUMERIC
    const updatePromises = data.map(async (analysis) => {
      // Only update if score exists and is an integer (lacks decimal point)
      if (analysis.score !== null && Number.isInteger(analysis.score)) {
        console.log(`Updating ${analysis.agent_type} analysis (ID: ${analysis.id}) score: ${analysis.score} -> ${analysis.score}.0`);
        
        const { error: updateError } = await supabase
          .from('vc_agent_analyses')
          .update({ score: parseFloat(analysis.score) })
          .eq('id', analysis.id);
        
        if (updateError) {
          console.error(`Error updating analysis ${analysis.id}:`, updateError);
          return false;
        }
        
        return true;
      }
      
      // Score is already a decimal or null, no update needed
      return true;
    });
    
    // Wait for all updates to complete
    const results = await Promise.all(updatePromises);
    const successCount = results.filter(result => result).length;
    
    console.log(`Successfully updated ${successCount} out of ${data.length} agent analyses`);
    console.log('All agent scores have been converted to NUMERIC type');
    
  } catch (error) {
    console.error('Error updating agent scores:', error);
  }
}

updateAllAgentScores(); 