import { geminiClient } from '../gemini-client';
import { Hypothesis } from './hypothesis-agent';

export interface Experiment {
    hypothesis: string;
    methodology: string;
    resources: string[];
    timeline: string;
    expectedOutcomes: string[];
}

export class ExperimentAgent {
    async process(hypotheses: Hypothesis[]): Promise<Experiment[]> {
        const topHypotheses = hypotheses.slice(0, 3);
        const hypothesesText = topHypotheses.map((h, i) =>
            `${i + 1}. ${h.title}: ${h.description}`
        ).join('\n');

        const prompt = `Design experiments for these hypotheses:

${hypothesesText}

Return as JSON array:
[
  {
    "hypothesis": "Hypothesis title",
    "methodology": "Experimental design and approach",
    "resources": ["Resource 1", "Resource 2"],
    "timeline": "6 months",
    "expectedOutcomes": ["Outcome 1", "Outcome 2"]
  }
]`;

        try {
            const result = await geminiClient.generateJSON<Experiment[]>(prompt);
            return result;
        } catch (error) {
            console.error('Experiment Agent Error:', error);
            return topHypotheses.map(h => ({
                hypothesis: h.title,
                methodology: 'Experimental design pending',
                resources: [],
                timeline: 'TBD',
                expectedOutcomes: [],
            }));
        }
    }
}

export const experimentAgent = new ExperimentAgent();
