import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { businessIdea } = await request.json();

    if (!businessIdea) {
      return NextResponse.json(
        { error: "Business idea is required" },
        { status: 400 }
      );
    }

    // Basic scoring logic based on text length and keywords
    const words = businessIdea.trim().split(/\s+/).length;
    const hasTargetAudience = /target|audience|customer|user|market|segment/i.test(businessIdea);
    const hasProblem = /problem|challenge|issue|pain point|difficulty/i.test(businessIdea);
    const hasSolution = /solution|solve|address|provide|platform|app|system/i.test(businessIdea);
    
    // Count significant factors
    let qualityFactors = 0;
    if (words > 20) qualityFactors++;
    if (words > 50) qualityFactors++;
    if (hasTargetAudience) qualityFactors += 2;
    if (hasProblem) qualityFactors += 2;
    if (hasSolution) qualityFactors++;
    
    // Calculate score (2-10 range)
    const baseScore = Math.min(10, Math.max(2, 2 + qualityFactors));

    // Use OpenAI to generate reasoning
    const analysisPrompt = `
      Analyze the following business idea as a preliminary check before generating a full validation report.
      Determine if it has a clear target audience, problem statement, and solution approach.
      
      Business Idea:
      "${businessIdea}"
      
      The quantitative score for this idea is ${baseScore}/10.
      
      If the score is below 7, explain what specific elements are missing (target audience, problem statement, 
      solution details, market understanding) and briefly suggest how to improve it before proceeding to a full report.
      
      If the score is 7 or above, briefly explain why the idea shows good potential for a comprehensive validation.
      
      Provide ONLY the assessment without any additional commentary or formatting.
    `;

    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: analysisPrompt }],
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 150,
    });

    const reasoning = chatCompletion.choices[0]?.message?.content?.trim() || "Analysis not available";

    return NextResponse.json({
      score: baseScore,
      reasoning: reasoning
    });
  } catch (error) {
    console.error('Error analyzing business idea:', error);
    return NextResponse.json(
      { error: "Failed to analyze business idea" },
      { status: 500 }
    );
  }
} 