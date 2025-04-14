#!/usr/bin/env ts-node
/**
 * Script to regenerate report_data for ALL records in the vc_validation_analyses table
 * This will use the new schema format and ensure consistency
 * 
 * Run with: npx ts-node src/scripts/regenerate-all-vc-reports.ts
 */

const { createClient } = require('@supabase/supabase-js');
// Import Database type
import type { Database } from '@/lib/supabase/database.types';

// Import types properly
import type { 
  ValidationFormRecord,
  VCReport,
  VCAgentAnalysisRecord,
  VCValidationWithAnalyses,
  VCValidationAnalysisRecord,
  VCValidationFormRecord
} from '@/lib/supabase/types';

// Create a type alias for CommonJS usage
type VCAgentType = string;

// Type definitions for use in the script
interface AgentAnalysis {
  score?: number;
  reasoning?: string;
  analysis?: {
    insights?: string[];
    strengths?: string[];
    weaknesses?: string[];
    recommendations?: string[];
    [key: string]: any;
  };
  [key: string]: any;
}

interface CategoryTotal {
  sum: number;
  count: number;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or service role key')
  process.exit(1)
}

// Create Supabase client with service role key (more permissions)
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function regenerateAllVCReports() {
  console.log('Starting regeneration of report_data for ALL VC validation analyses...')
  
  // Fetch all VC analysis records
  const { data: analyses, error: analysesError } = await supabase
    .from('vc_validation_analyses')
    .select('*')
  
  if (analysesError) {
    console.error('Error fetching VC analyses:', analysesError)
    process.exit(1)
  }
  
  console.log(`Found ${analyses.length} VC analyses to process`)
  
  // Process each VC analysis
  for (const analysis of analyses) {
    try {
      // Fetch the corresponding VC validation form
      const { data: form, error: formError } = await supabase
        .from('vc_validation_forms')
        .select('*')
        .eq('id', analysis.vc_validation_form_id)
        .single()
      
      if (formError) {
        console.error(`Error fetching VC form ${analysis.vc_validation_form_id}:`, formError)
        continue
      }
      
      // Create the VC validation with analysis object
      const vcValidation: { 
        form: any;
        validation: VCValidationAnalysisRecord;
        agent_analyses: any[];
      } = {
        form: form,
        validation: analysis,
        agent_analyses: []
      }
      
      // Generate comprehensive VC report data
      const reportData = generateVCReportData(vcValidation)
      
      // Update the VC analysis record with the new report_data
      const { error: updateError } = await supabase
        .from('vc_validation_analyses')
        .update({ report_data: reportData })
        .eq('id', analysis.id)
      
      if (updateError) {
        console.error(`Error updating VC analysis ${analysis.id}:`, updateError)
        continue
      }
      
      console.log(`Successfully updated VC analysis ${analysis.id}`)
    } catch (error) {
      console.error(`Error processing VC analysis ${analysis.id}:`, error)
    }
  }
  
  console.log('All VC report data regenerated successfully!')
}

// Main function to regenerate report data for all records
async function regenerateAllReports() {
  // Get all records from the validation_analyses table
  const { data: validations, error } = await supabase
    .from('vc_validation_analyses')
    .select(`
      *,
      form:form_id (*)
    `);

  if (error) {
    console.error('Error fetching validations:', error);
    return;
  }

  console.log(`Found ${validations.length} validation analyses to process`);

  // Process each validation analysis
  for (const validation of validations) {
    try {
      // Fetch the corresponding VC validation form
      const { data: form, error: formError } = await supabase
        .from('vc_validation_forms')
        .select('*')
        .eq('id', validation.form_id)
        .single()
      
      if (formError) {
        console.error(`Error fetching VC form ${validation.form_id}:`, formError)
        continue
      }
      
      // Create the VC validation with analysis object
      const vcValidation: { 
        form: VCValidationFormRecord;
        validation: VCValidationAnalysisRecord;
        agent_analyses: any[];
      } = {
        form: form,
        validation: validation,
        agent_analyses: []
      }
      
      // Generate comprehensive VC report data
      const reportData = generateVCReportData(vcValidation)
      
      // Update the VC analysis record with the new report_data
      const { error: updateError } = await supabase
        .from('vc_validation_analyses')
        .update({ report_data: reportData })
        .eq('id', validation.id)
      
      if (updateError) {
        console.error(`Error updating VC analysis ${validation.id}:`, updateError)
        continue
      }
      
      console.log(`Successfully updated VC analysis ${validation.id}`)
    } catch (error) {
      console.error(`Error processing VC analysis ${validation.id}:`, error)
    }
  }
  
  console.log('All VC report data regenerated successfully!')
}

// Function to generate comprehensive VC report data
function generateVCReportData(validation: { 
  form: VCValidationFormRecord; 
  validation: VCValidationAnalysisRecord;
}): Partial<VCReport> {
  const { validation: analysis, form } = validation
  
  // Extract agent analyses
  const agentAnalyses = getAgentAnalyses(analysis);
  
  // Calculate overall score based on weighted agent scores
  const { overallScore, weightedScores, categoryScores } = calculateScores(agentAnalyses);
  
  // Extract insights from agent analyses
  const insights = extractInsights(agentAnalyses);
  
  // Extract strengths and weaknesses
  const strengths = extractStrengths(agentAnalyses);
  const weaknesses = extractWeaknesses(agentAnalyses);
  
  // Generate suggested actions
  const suggestedActions = generateSuggestedActions(agentAnalyses);
  
  // Generate a recommendation
  const recommendation = generateRecommendation(overallScore, strengths, weaknesses);
  
  // Generate a comprehensive VC report
  return {
    overall_score: overallScore,
    business_type: form.business_type || "Startup",
    weighted_scores: weightedScores,
    category_scores: categoryScores,
    insights: insights,
    strengths: strengths,
    weaknesses: weaknesses,
    suggested_actions: suggestedActions,
    recommendation: recommendation,
    generation_method: "regenerate-all-vc-reports script",
    generated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

// Helper function to get all agent analyses from a VC validation analysis
function getAgentAnalyses(analysis: VCValidationAnalysisRecord): Record<string, AgentAnalysis> {
  const agentTypes = [
    'problem', 'market', 'competitive', 'uvp', 'business_model', 
    'validation', 'legal', 'metrics', 'vc_lead', 'market_fit',
    'competition', 'team', 'financials', 'traction', 'investor_readiness'
  ];
  
  const agentAnalyses: Record<string, AgentAnalysis> = {};
  
  for (const agentType of agentTypes) {
    const key = `${agentType}_analysis` as keyof VCValidationAnalysisRecord;
    const analysisValue = analysis[key];
    if (analysisValue) {
      agentAnalyses[agentType] = analysisValue as unknown as AgentAnalysis;
    }
  }
  
  return agentAnalyses;
}

// Helper function to calculate the overall score, weighted scores, and category scores
function calculateScores(agentAnalyses: Record<string, AgentAnalysis>) {
  const weightedScores: Record<string, number> = {};
  const categoryScores: Record<string, number> = {};
  
  // Define agent weights
  const agentWeights: Record<string, number> = {
    problem: 1.2,
    market: 1.5,
    market_fit: 1.3,
    competition: 1.2,
    competitive: 1.2,
    uvp: 1.3,
    business_model: 1.4,
    validation: 1.1,
    team: 1.4,
    financials: 1.3,
    traction: 1.2,
    investor_readiness: 1.5,
    legal: 0.8,
    metrics: 1.0,
    vc_lead: 1.5
  };
  
  // Define categories for agents
  const agentCategories: Record<string, string> = {
    problem: 'problem_solution',
    market: 'market',
    market_fit: 'market',
    competition: 'competition',
    competitive: 'competition',
    uvp: 'value_proposition',
    business_model: 'business',
    validation: 'validation',
    team: 'team',
    financials: 'financials',
    traction: 'traction',
    investor_readiness: 'investment',
    legal: 'legal',
    metrics: 'metrics',
    vc_lead: 'investment'
  };
  
  let totalScore = 0;
  let totalWeight = 0;
  
  // Calculate category totals for averaging
  const categoryTotals: Record<string, CategoryTotal> = {};
  
  // Process each agent analysis
  for (const [agentType, analysis] of Object.entries(agentAnalyses)) {
    if (analysis && typeof analysis.score === 'number') {
      const weight = agentWeights[agentType] || 1;
      const category = agentCategories[agentType] || 'other';
      
      // Add to weighted scores
      weightedScores[agentType] = analysis.score;
      
      // Add to overall weighted average
      totalScore += analysis.score * weight;
      totalWeight += weight;
      
      // Add to category average
      if (!categoryTotals[category]) {
        categoryTotals[category] = { sum: 0, count: 0 };
      }
      categoryTotals[category].sum += analysis.score;
      categoryTotals[category].count += 1;
    }
  }
  
  // Calculate category averages
  for (const [category, { sum, count }] of Object.entries(categoryTotals)) {
    if (count > 0) {
      categoryScores[category] = Math.round(sum / count);
    }
  }
  
  // Calculate overall score
  const overallScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 50;
  
  return { overallScore, weightedScores, categoryScores };
}

// Helper function to extract insights from agent analyses
function extractInsights(agentAnalyses: Record<string, AgentAnalysis>): Record<string, string[]> {
  const insights: Record<string, string[]> = {};
  
  for (const [agentType, analysis] of Object.entries(agentAnalyses)) {
    if (analysis && analysis.analysis && analysis.analysis.insights && Array.isArray(analysis.analysis.insights)) {
      insights[agentType] = analysis.analysis.insights;
    } else if (analysis && analysis.analysis && typeof analysis.analysis === 'object') {
      // Try to extract insights from analysis text
      insights[agentType] = [analysis.reasoning || ''];
    }
  }
  
  return insights;
}

// Helper function to extract strengths from agent analyses
function extractStrengths(agentAnalyses: Record<string, AgentAnalysis>): string[] {
  const allStrengths: string[] = [];
  
  for (const analysis of Object.values(agentAnalyses)) {
    if (analysis && analysis.analysis && analysis.analysis.strengths && Array.isArray(analysis.analysis.strengths)) {
      allStrengths.push(...analysis.analysis.strengths);
    }
  }
  
  // If no strengths found, check vc_lead analysis for summary
  const vcLead = agentAnalyses.vc_lead;
  if (allStrengths.length === 0 && vcLead && vcLead.analysis) {
    // Extract potential strengths from analysis text
    allStrengths.push("The business shows potential based on VC analysis");
  }
  
  // Return unique strengths, limited to top 5
  return [...new Set(allStrengths)].slice(0, 5);
}

// Helper function to extract weaknesses from agent analyses
function extractWeaknesses(agentAnalyses: Record<string, AgentAnalysis>): string[] {
  const allWeaknesses: string[] = [];
  
  for (const analysis of Object.values(agentAnalyses)) {
    if (analysis && analysis.analysis && analysis.analysis.weaknesses && Array.isArray(analysis.analysis.weaknesses)) {
      allWeaknesses.push(...analysis.analysis.weaknesses);
    }
  }
  
  // If no weaknesses found, check vc_lead analysis for areas of improvement
  const vcLead = agentAnalyses.vc_lead;
  if (allWeaknesses.length === 0 && vcLead && vcLead.analysis) {
    // Extract potential areas for improvement from analysis text
    allWeaknesses.push("Consider further validating key assumptions");
  }
  
  // Return unique weaknesses, limited to top 5
  return [...new Set(allWeaknesses)].slice(0, 5);
}

// Helper function to generate suggested actions
function generateSuggestedActions(agentAnalyses: Record<string, AgentAnalysis>): string[] {
  const allActions: string[] = [];
  
  // First try to collect actions from agent analyses
  for (const analysis of Object.values(agentAnalyses)) {
    if (analysis && analysis.analysis && analysis.analysis.recommendations && Array.isArray(analysis.analysis.recommendations)) {
      allActions.push(...analysis.analysis.recommendations);
    }
  }
  
  // If no actions found, generate some based on the VC lead analysis
  const vcLead = agentAnalyses.vc_lead;
  if (allActions.length === 0 && vcLead) {
    allActions.push(
      "Develop a clear go-to-market strategy",
      "Create a detailed financial model",
      "Validate key assumptions with potential customers",
      "Build a minimum viable product (MVP)",
      "Prepare a compelling investor pitch deck"
    );
  }
  
  // Return unique actions, limited to top 7
  return [...new Set(allActions)].slice(0, 7);
}

// Helper function to generate a recommendation
function generateRecommendation(overallScore: number, strengths: string[], weaknesses: string[]): string {
  let recommendationText = "";
  
  if (overallScore >= 80) {
    recommendationText = "This venture shows strong potential for VC investment. ";
  } else if (overallScore >= 60) {
    recommendationText = "This venture shows moderate potential for VC investment with some improvements. ";
  } else {
    recommendationText = "This venture requires significant improvements before seeking VC investment. ";
  }
  
  if (strengths.length > 0) {
    recommendationText += `Key strengths include ${strengths[0].toLowerCase()}`;
    if (strengths.length > 1) {
      recommendationText += ` and ${strengths[1].toLowerCase()}`;
    }
    recommendationText += ". ";
  }
  
  if (weaknesses.length > 0) {
    recommendationText += `Areas to address include ${weaknesses[0].toLowerCase()}`;
    if (weaknesses.length > 1) {
      recommendationText += ` and ${weaknesses[1].toLowerCase()}`;
    }
    recommendationText += ".";
  }
  
  return recommendationText;
}

// Run the regeneration process
regenerateAllReports().catch(console.error) 