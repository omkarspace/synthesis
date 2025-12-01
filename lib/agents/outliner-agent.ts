import { geminiClient } from '../gemini-client';

export interface OutlineSection {
    title: string;
    description: string;
    subsections?: string[];
    order: number;
}

export interface ResearchOutline {
    title: string;
    abstract: string;
    sections: OutlineSection[];
}

export class OutlinerAgent {
    async process(summaries: any[]): Promise<ResearchOutline> {
        const summariesText = summaries
            .map((s, i) => `Document ${i + 1}: ${JSON.stringify(s)}`)
            .join('\n\n');

        const prompt = `Based on these research document summaries, create a comprehensive research paper outline:

${summariesText}

Generate a structured outline for an academic research paper. Include:
1. A compelling title
2. An abstract outline (key points to cover)
3. Main sections (Introduction, Literature Review, Methodology, Results, Discussion, Conclusion)
4. Subsections for each main section

Return as JSON:
{
  "title": "Research Paper Title",
  "abstract": "Brief description of what the abstract should cover",
  "sections": [
    {
      "title": "Introduction",
      "description": "What this section should cover",
      "subsections": ["Background", "Research Questions", "Significance"],
      "order": 1
    },
    {
      "title": "Literature Review",
      "description": "Survey of existing research",
      "subsections": ["Historical Context", "Current State", "Gaps in Research"],
      "order": 2
    }
  ]
}

IMPORTANT: Include proper academic structure with Introduction, Literature Review, Methodology, Results, Discussion, and Conclusion sections.`;

        try {
            const result = await geminiClient.generateJSON<ResearchOutline>(prompt);
            return result;
        } catch (error) {
            console.error('Outliner Agent Error:', error);
            // Return default outline
            return {
                title: 'Research Paper',
                abstract: 'This paper explores the key findings from the analyzed documents.',
                sections: [
                    {
                        title: 'Introduction',
                        description: 'Introduction to the research topic',
                        subsections: ['Background', 'Research Questions'],
                        order: 1,
                    },
                    {
                        title: 'Literature Review',
                        description: 'Review of existing research',
                        subsections: ['Key Studies', 'Research Gaps'],
                        order: 2,
                    },
                    {
                        title: 'Methodology',
                        description: 'Research methods and approach',
                        subsections: ['Data Collection', 'Analysis Methods'],
                        order: 3,
                    },
                    {
                        title: 'Results',
                        description: 'Key findings',
                        subsections: ['Primary Findings', 'Secondary Findings'],
                        order: 4,
                    },
                    {
                        title: 'Discussion',
                        description: 'Interpretation of results',
                        subsections: ['Implications', 'Limitations'],
                        order: 5,
                    },
                    {
                        title: 'Conclusion',
                        description: 'Summary and future work',
                        subsections: ['Summary', 'Future Research'],
                        order: 6,
                    },
                ],
            };
        }
    }
}

export const outlinerAgent = new OutlinerAgent();
