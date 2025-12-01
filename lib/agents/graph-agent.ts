import { geminiClient } from '../gemini-client';
import { Summary } from './summarizer-agent';

export interface ConceptGraph {
    nodes: Array<{
        id: string;
        label: string;
        importance: number;
        cluster: number;
    }>;
    edges: Array<{
        source: string;
        target: string;
        relationship: string;
    }>;
}

export class GraphAgent {
    async process(summaries: Summary[]): Promise<ConceptGraph> {
        const summariesText = summaries.map((s, i) =>
            `Paper ${i + 1}:\n${s.overall}\nKey Findings: ${s.keyFindings.join(', ')}`
        ).join('\n\n');

        const prompt = `Extract concepts and relationships from these research summaries to build a knowledge graph.

${summariesText}

Return as JSON:
{
  "nodes": [
    {"id": "1", "label": "Machine Learning", "importance": 95, "cluster": 0},
    {"id": "2", "label": "Neural Networks", "importance": 88, "cluster": 0}
  ],
  "edges": [
    {"source": "1", "target": "2", "relationship": "uses"}
  ]
}

Create 8-12 nodes representing key concepts, with importance scores (0-100) and cluster assignments (0-3).`;

        try {
            const result = await geminiClient.generateJSON<ConceptGraph>(prompt);
            return result;
        } catch (error) {
            console.error('Graph Agent Error:', error);
            return {
                nodes: [
                    { id: '1', label: 'Research Concept', importance: 80, cluster: 0 },
                ],
                edges: [],
            };
        }
    }
}

export const graphAgent = new GraphAgent();
