import { geminiClient } from '../gemini-client';

export interface ReviewFeedback {
    section: string;
    score: number; // 0-100
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
}

export interface ReviewReport {
    overallScore: number;
    summary: string;
    sectionReviews: ReviewFeedback[];
    criticalIssues: string[];
    recommendations: string[];
}

export class ReviewerAgent {
    async process(paperContent: string, outline?: any): Promise<ReviewReport> {
        const prompt = `You are an academic reviewer evaluating this research paper draft:

${paperContent.substring(0, 10000)}

${outline ? `Expected outline structure:\n${JSON.stringify(outline, null, 2)}\n` : ''}

Provide a comprehensive review evaluating:
1. Logical flow and coherence
2. Completeness of each section
3. Quality of arguments and evidence
4. Writing clarity and style
5. Adherence to academic standards

Return as JSON:
{
  "overallScore": 75,
  "summary": "Overall assessment in 2-3 sentences",
  "sectionReviews": [
    {
      "section": "Introduction",
      "score": 80,
      "strengths": ["Clear problem statement", "Well-motivated research"],
      "weaknesses": ["Missing some background context"],
      "suggestions": ["Add more literature context", "Clarify research gap"]
    }
  ],
  "criticalIssues": [
    "Methodology section needs more detail",
    "Results lack statistical significance tests"
  ],
  "recommendations": [
    "Expand the literature review",
    "Add more quantitative results",
    "Improve transition between sections"
  ]
}`;

        try {
            const result = await geminiClient.generateJSON<ReviewReport>(prompt);
            return result;
        } catch (error) {
            console.error('Reviewer Agent Error:', error);
            return {
                overallScore: 70,
                summary: 'Paper shows promise but needs refinement in several areas.',
                sectionReviews: [
                    {
                        section: 'Overall',
                        score: 70,
                        strengths: ['Coherent structure', 'Clear research direction'],
                        weaknesses: ['Some sections need more depth'],
                        suggestions: ['Expand methodology', 'Add more references'],
                    },
                ],
                criticalIssues: ['Review unavailable - using default assessment'],
                recommendations: [
                    'Review each section for completeness',
                    'Ensure all claims are supported by evidence',
                    'Check for logical flow and transitions',
                ],
            };
        }
    }

    /**
     * Quick validation check for paper completeness
     */
    async validateCompleteness(paperContent: string, requiredSections: string[]): Promise<{
        complete: boolean;
        missingSections: string[];
        issues: string[];
    }> {
        const prompt = `Check if this paper contains all required sections: ${requiredSections.join(', ')}

Paper content:
${paperContent.substring(0, 5000)}

Return JSON:
{
  "complete": true/false,
  "missingSections": ["Section Name"],
  "issues": ["Description of any structural issues"]
}`;

        try {
            const result = await geminiClient.generateJSON<{
                complete: boolean;
                missingSections: string[];
                issues: string[];
            }>(prompt);
            return result;
        } catch (error) {
            console.error('Validator Error:', error);
            return {
                complete: false,
                missingSections: [],
                issues: ['Validation check failed'],
            };
        }
    }
}

export const reviewerAgent = new ReviewerAgent();
