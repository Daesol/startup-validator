const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://dynksioggkqwgivykuvh.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bmtzaW9nZ2txd2dpdnlrdXZoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDMwNTMwMSwiZXhwIjoyMDU5ODgxMzAxfQ.y42c5kVFKIdVEM-3KG3Xhm2XJmkjEBwvHTXAISISPOw'

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Provide a report ID to analyze
const reportId = process.argv[2];

if (!reportId) {
  console.log("Please provide a report ID as a command line argument");
  console.log("Example: node debug-report-data.js 3d39fc6c-5f8d-4569-a0b0-a4f9d8f3f12d");
  process.exit(1);
}

async function debugReportData() {
  try {
    console.log(`Analyzing report data for ID: ${reportId}`);
    
    // Fetch the analysis with report_data
    const { data: analysis, error: analysisError } = await supabase
      .from("validation_analyses")
      .select("id, validation_form_id, report_data")
      .eq("id", reportId)
      .single();
    
    if (analysisError) {
      console.error("Error fetching analysis:", analysisError);
      return;
    }
    
    if (!analysis) {
      console.log("No analysis found with ID:", reportId);
      return;
    }
    
    // Fetch the validation form to compare
    const { data: form, error: formError } = await supabase
      .from("validation_forms")
      .select("id, business_idea")
      .eq("id", analysis.validation_form_id)
      .single();
    
    if (formError) {
      console.error("Error fetching form:", formError);
    }
    
    // Extract user input from report data
    const userInput = analysis.report_data?.user_input || "";
    
    // Calculate the expected number of lines
    const expectedLines = userInput.split('\n').length;
    
    // Debug info about the user input
    console.log("Report Data Analysis:");
    console.log("-----------------------");
    console.log("User Input:");
    console.log(`Length: ${userInput.length} characters`);
    console.log(`Contains line breaks: ${userInput.includes('\n')}`);
    console.log(`Expected number of lines: ${expectedLines}`);
    console.log(`First 100 chars: "${userInput.substring(0, 100)}"`);
    
    // If the original form data is available, compare them
    if (form) {
      const originalInput = form.business_idea || "";
      console.log("\nOriginal Form Data:");
      console.log("-----------------------");
      console.log(`Length: ${originalInput.length} characters`);
      console.log(`Contains line breaks: ${originalInput.includes('\n')}`);
      console.log(`Expected number of lines: ${originalInput.split('\n').length}`);
      console.log(`First 100 chars: "${originalInput.substring(0, 100)}"`);
      
      console.log("\nComparison:");
      console.log("-----------------------");
      console.log(`Lengths match: ${originalInput.length === userInput.length}`);
      console.log(`Character-by-character equality: ${originalInput === userInput}`);
      
      if (originalInput !== userInput) {
        // Find the position of the first difference
        for (let i = 0; i < Math.min(originalInput.length, userInput.length); i++) {
          if (originalInput[i] !== userInput[i]) {
            console.log(`First difference at position ${i}:`);
            console.log(`Original: "${originalInput.substring(i, i+20)}..." (char code: ${originalInput.charCodeAt(i)})`);
            console.log(`Report  : "${userInput.substring(i, i+20)}..." (char code: ${userInput.charCodeAt(i)})`);
            break;
          }
        }
      }
    }
    
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

debugReportData(); 