#!/bin/bash

# Script to run the necessary database migrations and populate report_data for existing records
# Run this script to fix issues with the startup validator

echo "Starting Startup Validator database fixes..."

# Run the Supabase migrations
echo "Applying database migrations..."
npx supabase db push --db-url $SUPABASE_DATABASE_URL

# Populate report_data for all records, including those that already have it
echo "Generating comprehensive report_data for all analyses..."
npx ts-node src/scripts/regenerate-all-reports.ts

echo "All fixes applied successfully!"
echo "The startup validator should now work correctly with the new report format."
echo "Note: You may need to restart your application for changes to take effect." 