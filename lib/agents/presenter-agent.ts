import { geminiClient } from '../gemini-client';
import { SlideData } from '../ppt-generator';

export interface PresentationData {
    title: string;
    slides: SlideData[];
}

export class PresenterAgent {
    async process(paperContent: string): Promise<PresentationData> {
        const prompt = `You are creating a PowerPoint presentation from this research paper content:

${paperContent.substring(0, 8000)} // Limit to avoid token limits

Extract the 10-15 most important insights and format them as presentation slides.

Return as JSON:
{
  "title": "Presentation Title",
  "slides": [
    {
      "title": "Introduction",
      "bullets": [
        "Research addresses X problem",
        "Novel approach using Y methodology",
        "Key findings demonstrate Z"
      ],
      "notes": "Speaker notes: Emphasize the significance of the research problem."
    },
    {
      "title": "Methodology",
      "bullets": [
        "Dataset: description and size",
        "Approach: key technical details",
        "Validation: how results were verified"
      ],
      "notes": "Speaker notes: Focus on the innovative aspects of the methodology."
    }
  ]
}

Guidelines:
- First slide: Title and overview
- 2-3 slides: Background and problem statement
- 3-4 slides: Methodology
- 2-3 slides: Key results with specific numbers/findings
- 1-2 slides: Discussion and implications
- Last slide: Conclusions and future work
- Each slide should have 3-5 bullet points maximum
- Keep bullets concise (one line each)
- Include speaker notes for context`;

        try {
            const result = await geminiClient.generateJSON<PresentationData>(prompt);
            return result;
        } catch (error) {
            console.error('Presenter Agent Error:', error);
            // Return fallback presentation
            return {
                title: 'Research Presentation',
                slides: [
                    {
                        title: 'Overview',
                        bullets: [
                            'AI-powered research analysis',
                            'Multi-document synthesis',
                            'Automated hypothesis generation',
                        ],
                        notes: 'Introduction to the research platform capabilities.',
                    },
                    {
                        title: 'Key Findings',
                        bullets: [
                            'Finding 1: Summary pending',
                            'Finding 2: Summary pending',
                            'Finding 3: Summary pending',
                        ],
                        notes: 'Highlight the most significant discoveries.',
                    },
                    {
                        title: 'Methodology',
                        bullets: [
                            'Document analysis using AI agents',
                            'Knowledge graph construction',
                            'Hypothesis validation',
                        ],
                        notes: 'Explain the systematic approach taken.',
                    },
                    {
                        title: 'Conclusions',
                        bullets: [
                            'Successfully demonstrated feasibility',
                            'Identified areas for future work',
                            'Validated through experiments',
                        ],
                        notes: 'Summarize the impact and next steps.',
                    },
                ],
            };
        }
    }

    /**
     * Generate a presentation from specific sections of a paper
     */
    async generateFromSections(sections: Map<string, string>): Promise<PresentationData> {
        const prompt = `Create a presentation from these research paper sections:

${Array.from(sections.entries())
                .map(([title, content]) => `## ${title}\n${content.substring(0, 1500)}`)
                .join('\n\n')}

Create 10-15 slides covering the key points from each section.
Format as JSON with title, slides array containing {title, bullets[], notes}.`;

        try {
            const result = await geminiClient.generateJSON<PresentationData>(prompt);
            return result;
        } catch (error) {
            console.error('Presenter Agent Error:', error);
            return this.process(Array.from(sections.values()).join('\n\n'));
        }
    }
}

export const presenterAgent = new PresenterAgent();
