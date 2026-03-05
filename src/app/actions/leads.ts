'use server';

import { analyzeLeadSubmission, LeadIntelligenceAnalysisInput } from '@/ai/flows/lead-intelligence-analysis-flow';

export async function submitLead(formData: FormData) {
  try {
    const input: LeadIntelligenceAnalysisInput = {
      biggestProblem: formData.get('problem') as any,
      tellUsMore: (formData.get('more') as string) || '',
    };

    // Analyze lead with AI
    const analysis = await analyzeLeadSubmission(input);
    
    // In a real app, you would save this to Firestore here.
    // Since we don't have direct firebase-admin setup in this scaffolded environment,
    // we'll simulate the persistence.
    
    console.log('Lead Analysis:', analysis);
    
    return { 
      success: true, 
      message: '✓ Received. Sourav will be in touch within 24 hours.',
      analysis 
    };
  } catch (error) {
    console.error('Lead submission failed:', error);
    return { success: false, message: 'Failed to submit. Please try again later.' };
  }
}
