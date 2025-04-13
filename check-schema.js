const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://dynksioggkqwgivykuvh.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bmtzaW9nZ2txd2dpdnlrdXZoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDMwNTMwMSwiZXhwIjoyMDU5ODgxMzAxfQ.y42c5kVFKIdVEM-3KG3Xhm2XJmkjEBwvHTXAISISPOw'

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkSchema() {
  try {
    // Query for a sample record to check the schema
    const { data, error } = await supabase
      .from('validation_analyses')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Error querying validation_analyses:', error)
      return
    }
    
    if (data && data.length > 0) {
      console.log('Sample record keys:', Object.keys(data[0]))
      console.log('Has report_data column:', Object.keys(data[0]).includes('report_data'))
      
      if (Object.keys(data[0]).includes('report_data')) {
        console.log('report_data value:', data[0].report_data)
      }
    } else {
      console.log('No records found in validation_analyses table')
    }
    
    // Specifically check report_data column
    console.log('\nChecking a few analyses records with report_data:')
    const { data: reportData, error: reportError } = await supabase
      .from('validation_analyses')
      .select('id, report_data')
      .limit(5)
    
    if (reportError) {
      console.error('Error querying report_data:', reportError)
      return
    }
    
    console.log('Report data samples:', reportData)
    
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

checkSchema() 