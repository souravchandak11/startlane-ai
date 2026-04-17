'use server';

import { analyzeLeadSubmission, LeadIntelligenceAnalysisInput } from '@/ai/flows/lead-intelligence-analysis-flow';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function submitLead(formData: FormData) {
  try {
    const biggestProblem = formData.get('problem') as LeadIntelligenceAnalysisInput['biggestProblem'];
    const tellUsMore = (formData.get('more') as string) || '';

    const input: LeadIntelligenceAnalysisInput = {
      biggestProblem,
      tellUsMore,
    };

    // Run AI analysis in parallel with preparing lead data
    const [analysis] = await Promise.all([
      analyzeLeadSubmission(input),
    ]);

    // Build the full lead document
    const leadData = {
      // Contact info
      name: formData.get('name') as string,
      business: formData.get('business') as string,
      email: formData.get('email') as string,
      phone: (formData.get('phone') as string) || null,

      // Problem details
      biggestProblem,
      tellUsMore,

      // AI analysis results
      aiAnalysis: {
        category: analysis.category,
        summary: analysis.summary,
        suggestedNextSteps: analysis.suggestedNextSteps,
      },

      // Metadata
      status: 'new',
      source: 'website-contact-form',
      submittedAt: serverTimestamp(),
    };

    // Save to Firestore /leads collection
    const docRef = await addDoc(collection(db, 'leads'), leadData);
    console.log('Lead saved to Firestore with ID:', docRef.id);

    return {
      success: true,
      message: '✓ Received. Sourav will be in touch within 24 hours.',
      leadId: docRef.id,
    };
  } catch (error) {
    console.error('Lead submission failed:', error);
    return {
      success: false,
      message: 'Failed to submit. Please try again later.',
    };
  }
}
