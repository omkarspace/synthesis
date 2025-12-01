import { geminiClient } from '../gemini-client';
import { ConceptGraph } from './graph-agent';

export interface Hypothesis {
    id: string;
    title: string;
    description: string;
    testability: number;
    novelty: number;
    feasibility: number;
    category: string;
}

export class HypothesisAgent {
    async process(graph: ConceptGraph): Promise<Hypothesis[]> {
        const conceptsText = graph.nodes.map(n => n.label).join(', ');

        const prompt = `Based on these research concepts: ${conceptsText}

Generate 5-6 novel research hypotheses that could advance the field.

Return as JSON array:
[
  {
    "id": "1",
    "title": "Hypothesis title",
    "description": "Detailed description of the hypothesis",
    "testability": 85,
    "novelty": 90,
    "feasibility": 75,
    "category": "Machine Learning"
  }
]

Each hypothesis should have scores (0-100) for testability, novelty, and feasibility.`;

        try {
            const result = await geminiClient.generateJSON<Hypothesis[]>(prompt);
            return result;
        } catch (error) {
            console.error('Hypothesis Agent Error:', error);
            return [{
                id: '1',
                title: 'Generated Hypothesis',
                description: 'Hypothesis generation failed',
                testability: 50,
                novelty: 50,
                feasibility: 50,
                category: 'General',
            }];
        }
    }
}

export const hypothesisAgent = new HypothesisAgent();
