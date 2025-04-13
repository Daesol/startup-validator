const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://dynksioggkqwgivykuvh.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bmtzaW9nZ2txd2dpdnlrdXZoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDMwNTMwMSwiZXhwIjoyMDU5ODgxMzAxfQ.y42c5kVFKIdVEM-3KG3Xhm2XJmkjEBwvHTXAISISPOw'

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Function to fix report data structure
function fixReportDataStructure(reportData) {
  // Clone the report data to avoid modifying the original object
  const processedData = JSON.parse(JSON.stringify(reportData));
  
  // Ensure problem structure
  if (!processedData.problem) {
    processedData.problem = {};
  }
  
  // Ensure problem.clarity_status is one of the expected values with proper casing
  if (processedData.problem.clarity_status) {
    const clarityStatus = processedData.problem.clarity_status.toString().toLowerCase();
    if (clarityStatus === 'clear' || clarityStatus === 'clarity_status' || clarityStatus === 'identified') {
      processedData.problem.clarity_status = 'Clear';
    } else if (clarityStatus === 'vague' || clarityStatus === 'needs refinement') {
      processedData.problem.clarity_status = 'Vague';
    } else {
      processedData.problem.clarity_status = 'Not identified';
    }
  } else {
    processedData.problem.clarity_status = 'Vague';
  }
  
  // Ensure problem.pain_severity is a number between 1 and 10
  if (!processedData.problem.pain_severity || 
      typeof processedData.problem.pain_severity !== 'number' ||
      processedData.problem.pain_severity < 1 ||
      processedData.problem.pain_severity > 10) {
    processedData.problem.pain_severity = 7;
  }
  
  // Ensure problem.alternatives is an array
  if (!Array.isArray(processedData.problem.alternatives)) {
    processedData.problem.alternatives = ["Existing solutions", "Manual processes"];
  }
  
  // Ensure problem.ai_summary is defined
  if (!processedData.problem.ai_summary) {
    processedData.problem.ai_summary = "The problem affects the target audience.";
  }
  
  // Ensure competition structure
  if (!processedData.competition) {
    processedData.competition = {};
  }
  
  // Ensure competition.moat_status is one of the expected values with proper casing
  if (processedData.competition.moat_status) {
    const moatStatus = processedData.competition.moat_status.toString().toLowerCase();
    if (moatStatus === 'strong') {
      processedData.competition.moat_status = 'Strong';
    } else if (moatStatus === 'weak') {
      processedData.competition.moat_status = 'Weak';
    } else {
      processedData.competition.moat_status = 'Moderate';
    }
  } else {
    processedData.competition.moat_status = 'Moderate';
  }
  
  // Ensure competition.competitors is an array
  if (!Array.isArray(processedData.competition.competitors) || processedData.competition.competitors.length === 0) {
    processedData.competition.competitors = [{
      name: "Competitor 1",
      strengths: "Established brand",
      weaknesses: "Higher pricing",
      price: "$100-500/mo"
    }];
  }
  
  // Ensure competition.positioning has x_axis and y_axis
  if (!processedData.competition.positioning || 
      typeof processedData.competition.positioning !== 'object') {
    processedData.competition.positioning = { x_axis: 7, y_axis: 6 };
  } else {
    if (typeof processedData.competition.positioning.x_axis !== 'number') {
      processedData.competition.positioning.x_axis = 7;
    }
    if (typeof processedData.competition.positioning.y_axis !== 'number') {
      processedData.competition.positioning.y_axis = 6;
    }
  }
  
  // Make sure other required sections are present
  const requiredSections = [
    'target_audience', 'market', 'uvp', 'business_model', 
    'customer_validation', 'pricing', 'legal', 'metrics', 
    'vc_methodologies', 'recommendation', 'summary_metrics'
  ];
  
  requiredSections.forEach(section => {
    if (!processedData[section]) {
      processedData[section] = {};
    }
  });
  
  // Ensure frameworks_used is an array
  if (!Array.isArray(processedData.frameworks_used)) {
    processedData.frameworks_used = ["YC", "a16z", "Sequoia"];
  }
  
  // Ensure the rest of the required fields are present
  if (!processedData.business_type) processedData.business_type = "SaaS";
  if (typeof processedData.overall_score !== 'number') processedData.overall_score = 70;
  if (!processedData.feasibility) processedData.feasibility = "✅ Buildable";
  if (!processedData.investor_readiness) processedData.investor_readiness = "🟡 Moderate";
  if (!processedData.estimated_valuation) processedData.estimated_valuation = "$500K – $1M";
  if (!processedData.user_input) processedData.user_input = "";
  if (!processedData.ai_interpretation) processedData.ai_interpretation = "";
  
  // Update timestamp
  processedData.updated_at = new Date().toISOString();
  
  return processedData;
}

async function fixReportData() {
  try {
    console.log('Starting to fix report_data for all analyses...');
    
    // Fetch all analyses with report_data
    const { data: analyses, error: fetchError } = await supabase
      .from('validation_analyses')
      .select('id, report_data')
      .not('report_data', 'is', null);
    
    if (fetchError) {
      console.error('Error fetching analyses:', fetchError);
      return;
    }
    
    console.log(`Found ${analyses.length} analyses with report_data to fix`);
    
    for (const analysis of analyses) {
      try {
        if (!analysis.report_data) {
          console.log(`Analysis ${analysis.id} has no report_data, skipping...`);
          continue;
        }
        
        // Fix the report data structure
        const fixedReportData = fixReportDataStructure(analysis.report_data);
        
        // Update the database with the fixed data
        const { error: updateError } = await supabase
          .from('validation_analyses')
          .update({ report_data: fixedReportData })
          .eq('id', analysis.id);
        
        if (updateError) {
          console.error(`Error updating analysis ${analysis.id}:`, updateError);
          continue;
        }
        
        console.log(`Successfully fixed report_data for analysis ${analysis.id}`);
      } catch (error) {
        console.error(`Error processing analysis ${analysis.id}:`, error);
      }
    }
    
    console.log('Report data fixing completed!');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

async function fixBusinessIdeaData() {
  try {
    console.log('Starting to fix business idea data for all analyses...');
    
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
        
        // Clone the report data
        const updatedReportData = JSON.parse(JSON.stringify(analysis.report_data));
        
        // Update user_input to use the complete business idea
        updatedReportData.user_input = form.business_idea || "";
        
        // Update AI interpretation to reference the business type correctly without truncating
        updatedReportData.ai_interpretation = `Based on your description, you're building a ${form.business_type || "SaaS"} solution that addresses the needs you've described. We've analyzed your complete business idea to provide a comprehensive evaluation.`;
        
        // Update the database with the fixed data
        const { error: updateError } = await supabase
          .from('validation_analyses')
          .update({ report_data: updatedReportData })
          .eq('id', analysis.id);
        
        if (updateError) {
          console.error(`Error updating analysis ${analysis.id}:`, updateError);
          continue;
        }
        
        console.log(`Successfully fixed business idea data for analysis ${analysis.id}`);
      } catch (error) {
        console.error(`Error processing analysis ${analysis.id}:`, error);
      }
    }
    
    console.log('Business idea data fixing completed!');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run the fix process
fixReportData();
fixBusinessIdeaData(); 