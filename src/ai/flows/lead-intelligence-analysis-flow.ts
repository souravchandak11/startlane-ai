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
      'Need help with digital strategy',
      'Social media isn\'t growing',
      'Inconsistent across locations',
      "Don't know what's working",
      'Something else',
    ])
    .describe("The lead's biggest marketing challenge, selected from predefined options."),
  tellUsMore: z
    .string()
    .optional()
    .describe('Additional details provided by the lead about their marketing challenges.'),
});
export type LeadIntelligenceAnalysisInput = z.infer<
  typeof LeadIntelligenceAnalysisInputSchema
>;

const LeadIntelligenceAnalysisOutputSchema = z.object({
  category: z
    .string()
    .describe('The categorized type of marketing challenge (e.g., Digital Strategy, Content & Social Media, Local Presence, General Inquiry).'),
  summary: z.string().describe("A concise summary of the lead's identified needs and challenges."),
  suggestedNextSteps: z
    .array(z.string())
    .describe('A list of AI-suggested actionable next steps for the consulting team to follow up on this inquiry.'),
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
  prompt: `You are an expert consulting assistant for StartLane AI, an agency specializing in digital marketing consulting, content strategy, and AI-powered workflow solutions for local businesses.

Your task is to analyze an incoming inquiry, categorize their primary challenge, summarize their needs, and suggest clear, actionable next steps for the consulting team.

Use the following information from the inquiry:

Biggest marketing challenge: {{{biggestProblem}}}
Tell us more: {{{tellUsMore}}}

Carefully analyze the provided information. Categorize the inquiry into one of the following main areas: 'Digital Strategy', 'Content & Social Media', 'Local Presence', or 'General Inquiry'. If 'Something else' is selected for the biggest problem, use the 'Tell us more' field to determine the best category or default to 'General Inquiry'.

Then, provide a concise summary of their needs and finally, suggest specific, actionable next steps that the consulting team should take to best engage with this inquiry. The next steps should be a list of distinct actions.

Example Output Format:
{
  "category": "Digital Strategy",
  "summary": "The inquiry is from a business that lacks a cohesive digital strategy and needs help mapping out a clear roadmap for online growth.",
  "suggestedNextSteps": [
    "Review their current digital presence and identify key gaps.",
    "Schedule a follow-up call to discuss their goals and timeline.",
    "Propose a complimentary strategy consultation to outline opportunities."
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
