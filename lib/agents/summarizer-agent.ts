import { geminiClient } from '../gemini-client';
import { ReaderOutput } from './reader-agent';

export interface Summary {
    overall: string;
    keyFindings: string[];
    contributions: string[];
    limitations: string[];
}

export class SummarizerAgent {
    async process(readerOutput: ReaderOutput): Promise<Summary> {
        const sectionsText = Object.entries(readerOutput.sections)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n\n');

        const prompt = `Summarize this research paper.

${sectionsText}

Provide a comprehensive summary as JSON:
{
  "overall": "2-3 sentence summary",
  "keyFindings": ["finding 1", "finding 2", "finding 3"],
  "contributions": ["contribution 1", "contribution 2"],
  "limitations": ["limitation 1", "limitation 2"]
}`;

        try {
            const result = await geminiClient.generateJSON<Summary>(prompt);
            return result;
        } catch (error) {
            console.error('Summarizer Agent Error:', error);
            return {
                overall: 'Summary generation failed',
                keyFindings: [],
                contributions: [],
                limitations: [],
            };
        }
    }
}

export const summarizerAgent = new SummarizerAgent();
