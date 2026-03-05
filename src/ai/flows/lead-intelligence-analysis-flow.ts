'use server';
/**
 * @fileOverview An AI agent to analyze incoming lead submissions and suggest next steps.
 *
 * - analyzeLeadSubmission - A function that handles the lead analysis process.
 * - LeadIntelligenceAnalysisInput - The input type for the analyzeLeadSubmission function.
 * - LeadIntelligenceAnalysisOutput - The return type for the analyzeLeadSubmission function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LeadIntelligenceAnalysisInputSchema = z.object({
  biggestProblem: z
    .enum([
      'Paid ads not converting',
      'No email automation system',
      'Inconsistent across locations',
      "Don't know what's working",
      'Something else',
    ])
    .describe("The lead's biggest marketing problem, selected from predefined options."),
  tellUsMore: z
    .string()
    .optional()
    .describe('Additional details provided by the lead about their marketing problems.'),
});
export type LeadIntelligenceAnalysisInput = z.infer<
  typeof LeadIntelligenceAnalysisInputSchema
>;

const LeadIntelligenceAnalysisOutputSchema = z.object({
  category: z
    .string()
    .describe('The categorized type of marketing problem (e.g., Paid Ads, Email Automation, Local Marketing, General Inquiry).'),
  summary: z.string().describe("A concise summary of the lead's identified needs and challenges."),
  suggestedNextSteps: z
    .array(z.string())
    .describe('A list of AI-suggested actionable next steps for the sales team to follow up on this lead.'),
});
export type LeadIntelligenceAnalysisOutput = z.infer<
  typeof LeadIntelligenceAnalysisOutputSchema
>;

export async function analyzeLeadSubmission(
  input: LeadIntelligenceAnalysisInput
): Promise<LeadIntelligenceAnalysisOutput> {
  return leadIntelligenceAnalysisFlow(input);
}

const leadIntelligenceAnalysisPrompt = ai.definePrompt({
  name: 'leadIntelligenceAnalysisPrompt',
  input: { schema: LeadIntelligenceAnalysisInputSchema },
  output: { schema: LeadIntelligenceAnalysisOutputSchema },
  prompt: `You are an expert sales assistant for StartLane AI, an agency specializing in AI-powered marketing systems for local businesses.

Your task is to analyze an incoming lead's submission, categorize their primary marketing problem, summarize their needs, and suggest clear, actionable next steps for the sales team.

Use the following information from the lead:

Biggest marketing problem: {{{biggestProblem}}}
Tell us more: {{{tellUsMore}}}

Carefully analyze the provided information. Categorize the lead's problem into one of the following main areas: 'Paid Ads', 'Email Automation', 'Local Marketing', or 'General Inquiry'. If 'Something else' is selected for the biggest problem, use the 'Tell us more' field to determine the best category or default to 'General Inquiry'.

Then, provide a concise summary of their needs and finally, suggest specific, actionable next steps that the sales team should take to best engage with this lead. The next steps should be a list of distinct actions.

Example Output Format:
{
  "category": "Paid Ads",
  "summary": "The lead is struggling with underperforming paid ad campaigns and needs help optimizing their ad spend and conversion rates.",
  "suggestedNextSteps": [
    "Review current ad platform performance and identify key metrics.",
    "Schedule a follow-up call to discuss their target CPA and desired ROI.",
    "Suggest a mini audit of their current campaigns."
  ]
}`,
});

const leadIntelligenceAnalysisFlow = ai.defineFlow(
  {
    name: 'leadIntelligenceAnalysisFlow',
    inputSchema: LeadIntelligenceAnalysisInputSchema,
    outputSchema: LeadIntelligenceAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await leadIntelligenceAnalysisPrompt(input);
    return output!;
  }
);
