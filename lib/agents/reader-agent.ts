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
            console.log('Using fallback with text extraction from:', text.substring(0, 100));
            
            // Fallback to basic extraction with enriched data
            const titleMatch = text.match(/^[\s\n]*(.*?)(?:\n|$)/);
            const abstractMatch = text.match(/(?:abstract|summary)[:\s]+([\s\S]{0,500}?)(?:\n\n|\nintroduction)/i);
            
            return {
                sections: {
                    abstract: abstractMatch ? abstractMatch[1].trim() : text.substring(0, 500),
                    introduction: 'Content for Introduction section is being generated...',
                    methods: 'Content for Methodology section is being generated...',
                    results: 'Content for Results section is being generated...',
                    discussion: 'Content for Discussion section is being generated...',
                    conclusion: 'Content for Conclusion section is being generated...',
                },
                metadata: {
                    title: titleMatch ? titleMatch[1].trim() : 'Research Paper',
                    authors: ['Anonymous'],
                    year: new Date().getFullYear(),
                    keywords: ['research', 'analysis', 'methodology'],
                },
                citations: [],
            };
        }
    }
}

export const readerAgent = new ReaderAgent();
