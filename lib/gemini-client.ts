import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn('WARNING: GEMINI_API_KEY environment variable is not set');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export class GeminiClient {
    private model;

    constructor(modelName: string = 'gemini-2.5-flash') {
        if (!genAI) {
            throw new Error('Gemini API not initialized - missing GEMINI_API_KEY');
        }
        this.model = genAI.getGenerativeModel({ model: modelName });
    }

    async generateText(prompt: string): Promise<string> {
        try {
            const result = await this.model.generateContent(prompt);
            const response = result.response;
            
            // Check if response is blocked
            if (!response || !response.text) {
                console.error('Gemini Response blocked or empty:', response);
                throw new Error('API returned empty response');
            }
            
            const text = response.text();
            if (!text || text.length === 0) {
                throw new Error('API returned empty text');
            }
            return text;
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw new Error(`Failed to generate text: ${error}`);
        }
    }

    async generateJSON<T>(prompt: string): Promise<T> {
        try {
            const result = await this.model.generateContent(
                prompt + '\n\nRespond ONLY with valid JSON, no markdown formatting.'
            );
            const response = result.response;
            
            // Check if response is blocked
            if (!response || !response.text) {
                console.error('Gemini JSON Response blocked or empty:', response);
                throw new Error('API returned empty response');
            }
            
            const text = response.text();
            if (!text || text.length === 0) {
                throw new Error('API returned empty text');
            }

            // Remove markdown code blocks if present
            const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            return JSON.parse(cleanText) as T;
        } catch (error) {
            console.error('Gemini JSON Error:', error);
            throw new Error(`Failed to generate JSON: ${error}`);
        }
    }

    async generateWithRetry(prompt: string, maxRetries: number = 3): Promise<string> {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await this.generateText(prompt);
            } catch (error) {
                console.error(`Retry ${i + 1}/${maxRetries} failed:`, error);
                if (i === maxRetries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
        throw new Error('Max retries exceeded');
    }

    async *generateStream(prompt: string): AsyncGenerator<string> {
        try {
            const result = await this.model.generateContentStream(prompt);

            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                if (chunkText) {
                    yield chunkText;
                }
            }
        } catch (error) {
            console.error('Gemini Streaming Error:', error);
            throw new Error(`Failed to stream content: ${error}`);
        }
    }
}

export const geminiClient = new GeminiClient();
