const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://dynksioggkqwgivykuvh.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bmtzaW9nZ2txd2dpdnlrdXZoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDMwNTMwMSwiZXhwIjoyMDU5ODgxMzAxfQ.y42c5kVFKIdVEM-3KG3Xhm2XJmkjEBwvHTXAISISPOw'

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixBusinessIdeas() {
  try {
    console.log('Starting to fix business ideas in all reports...');
    
    // First, get all validation forms to retrieve the complete business ideas
    const { data: forms, error: formsError } = await supabase
      .from('validation_forms')
      .select('id, business_idea, business_type')
    
    if (formsError) {
      console.error('Error fetching forms:', formsError);
      return;
    }
    
    // Create a map for quick lookup
    const formMap = new Map(forms.map(form => [form.id, form]));
    
    // Now fetch all analyses with report_data
    const { data: analyses, error: fetchError } = await supabase
      .from('validation_analyses')
      .select('id, validation_form_id, report_data')
      .not('report_data', 'is', null);
    
    if (fetchError) {
      console.error('Error fetching analyses:', fetchError);
      return;
    }
    
    console.log(`Found ${analyses.length} analyses with report_data to fix`);
    
    // Gather all the unprocessed user inputs for debugging
    const userInputs = [];
    
    for (const analysis of analyses) {
      try {
        if (!analysis.report_data) {
          console.log(`Analysis ${analysis.id} has no report_data, skipping...`);
          continue;
        }
        
        // Get the corresponding form data
        const form = formMap.get(analysis.validation_form_id);
        if (!form) {
          console.log(`Form not found for analysis ${analysis.id}, skipping...`);
          continue;
        }
        
        // Save the user input for debugging
        userInputs.push({
          id: analysis.id,
          length: form.business_idea?.length || 0,
          preview: form.business_idea?.substring(0, 50) || ''
        });
        
        // Clone the report data
        const updatedReportData = JSON.parse(JSON.stringify(analysis.report_data));
        
        // IMPORTANT: Ensure business_idea is properly set as the exact user input
        updatedReportData.user_input = form.business_idea || "";
        
        // Update the database with the fixed data
        const { error: updateError } = await supabase
          .from('validation_analyses')
          .update({ report_data: updatedReportData })
          .eq('id', analysis.id);
        
        if (updateError) {
          console.error(`Error updating analysis ${analysis.id}:`, updateError);
          continue;
        }
        
        console.log(`Successfully updated business idea for analysis ${analysis.id}`);
      } catch (error) {
        console.error(`Error processing analysis ${analysis.id}:`, error);
      }
    }
    
    // Log some debugging info about the business ideas
    console.log('Business idea stats:');
    userInputs.forEach(ui => {
      console.log(`ID: ${ui.id}, Length: ${ui.length}, Preview: ${ui.preview}`);
    });
    
    console.log('Business idea fixing completed!');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run the fix
fixBusinessIdeas(); 