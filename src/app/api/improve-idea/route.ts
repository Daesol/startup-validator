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

    const improvePrompt = `
      I need help improving a business idea to make it more suitable for a comprehensive validation report.
      The improved version will be used to generate a detailed investor-focused validation analysis.
      
      Please enhance the following business idea by adding:
      
      1. A clear target audience definition
      2. A specific problem statement
      3. A detailed solution approach
      4. A brief note on market opportunity
      5. Any unique value proposition or competitive advantage
      
      Original Business Idea:
      "${businessIdea.trim()}"
      
      Please provide an improved version that integrates these elements while maintaining the core concept.
      Don't add placeholders like [Target Audience] but actually enhance the idea with specific details.
      Format the improved idea in clear paragraphs with line breaks between sections.
      The improved idea should be comprehensive yet concise (under 500 words).
      
      The improvements should help generate a more accurate and valuable validation report.
    `;

    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: improvePrompt }],
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 800,
    });

    const improvedIdea = chatCompletion.choices[0]?.message?.content?.trim() || businessIdea;

    return NextResponse.json({
      improvedIdea: improvedIdea
    });
  } catch (error) {
    console.error('Error improving business idea:', error);
    return NextResponse.json(
      { error: "Failed to improve business idea" },
      { status: 500 }
    );
  }
} 