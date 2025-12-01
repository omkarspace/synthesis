import { geminiClient } from '../gemini-client';

export interface ReaderOutput {
    sections: {
        abstract?: string;
        introduction?: string;
        methods?: string;
        results?: string;
        discussion?: string;
        conclusion?: string;
    };
    metadata: {
        title?: string;
        authors?: string[];
        year?: number;
        keywords?: string[];
    };
    citations: string[];
}

export class ReaderAgent {
    async process(text: string): Promise<ReaderOutput> {
        const prompt = `Analyze this research paper and extract structured information.

Paper text:
${text.substring(0, 15000)} 

Extract and return as JSON:
{
  "sections": {
    "abstract": "...",
    "introduction": "...",
    "methods": "...",
    "results": "...",
    "discussion": "...",
    "conclusion": "..."
  },
  "metadata": {
    "title": "...",
    "authors": ["..."],
    "year": 2024,
    "keywords": ["..."]
  },
  "citations": ["..."]
}`;

        try {
            const result = await geminiClient.generateJSON<ReaderOutput>(prompt);
            return result;
        } catch (error) {
            console.error('Reader Agent Error:', error);
            // Fallback to basic extraction
            return {
                sections: {
                    abstract: text.substring(0, 500),
                },
                metadata: {
                    title: 'Extracted Document',
                    authors: [],
                    keywords: [],
                },
                citations: [],
            };
        }
    }
}

export const readerAgent = new ReaderAgent();
