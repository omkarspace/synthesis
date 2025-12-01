import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface StreamChunk {
    text: string;
    isComplete: boolean;
}

export class StreamingGeminiClient {
    private model;

    constructor(modelName: string = 'gemini-1.5-flash') {
        this.model = genAI.getGenerativeModel({ model: modelName });
    }

    async *generateStream(prompt: string): AsyncGenerator<StreamChunk> {
        try {
            const result = await this.model.generateContentStream(prompt);

            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                yield {
                    text: chunkText,
                    isComplete: false
                };
            }

            yield {
                text: '',
                isComplete: true
            };
        } catch (error) {
            console.error('Streaming Error:', error);
            throw new Error(`Failed to stream content: ${error}`);
        }
    }

    async generateStreamToString(prompt: string): Promise<string> {
        let fullText = '';
        for await (const chunk of this.generateStream(prompt)) {
            if (!chunk.isComplete) {
                fullText += chunk.text;
            }
        }
        return fullText;
    }
}

export const streamingGeminiClient = new StreamingGeminiClient();
