#!/bin/bash
# Script to fix VC validation reports by regenerating them all

# Ensure environment variables are properly set
if [[ -z "$NEXT_PUBLIC_SUPABASE_URL" || -z "$SUPABASE_SERVICE_ROLE_KEY" ]]; then
  echo "Error: Missing required environment variables."
  echo "Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set."
  exit 1
fi

# Show what we're doing
echo "Starting VC validation report regeneration process..."

# Run database migrations if needed
echo "Applying latest database migrations..."
npx supabase migration up

# Run the regenerate script for VC reports
echo "Regenerating all VC validation reports..."
npx ts-node src/scripts/regenerate-all-vc-reports.ts

echo "VC validation report regeneration complete!" 