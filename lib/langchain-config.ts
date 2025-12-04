import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn('WARNING: GEMINI_API_KEY environment variable is not set');
}

/**
 * Initialize LangChain with Gemini model
 */
export function createLangChainModel(temperature: number = 0.7) {
    if (!apiKey) {
        throw new Error('Gemini API key not configured');
    }

    return new ChatGoogleGenerativeAI({
        model: 'gemini-2.0-flash-exp',
        temperature,
        apiKey,
        maxOutputTokens: 8192,
    });
}

/**
 * Simple LLM call for non-agentic tasks
 */
export async function simpleLLMCall(prompt: string, temperature: number = 0.7): Promise<string> {
    const model = createLangChainModel(temperature);
    const response = await model.invoke(prompt);
    return response.content as string;
}

/**
 * Streaming LLM call
 */
export async function* streamLLMCall(prompt: string): AsyncGenerator<string> {
    const model = createLangChainModel();
    const stream = await model.stream(prompt);

    for await (const chunk of stream) {
        yield chunk.content as string;
    }
}

/**
 * Memory store for conversation context (simple in-memory implementation)
 */
export class SimpleMemory {
    private history: { role: string; content: string }[] = [];

    addMessage(role: 'human' | 'ai', content: string) {
        this.history.push({ role, content });
    }

    getHistory() {
        return this.history;
    }

    getFormattedHistory(): string {
        return this.history
            .map(msg => `${msg.role === 'human' ? 'Human' : 'AI'}: ${msg.content}`)
            .join('\n');
    }

    clear() {
        this.history = [];
    }
}

/**
 * Create memory for agent conversations
 */
export function createAgentMemory() {
    return new SimpleMemory();
}

/**
 * Simple agent executor that uses tool-calling pattern
 */
export async function executeAgentTask(
    task: string,
    tools: any[],
    memory?: SimpleMemory
): Promise<{ output: string; steps: any[] }> {
    const model = createLangChainModel();
    const steps: any[] = [];

    // Build context from memory
    const context = memory ? memory.getFormattedHistory() : '';

    // Create a simple prompt with tool descriptions
    const toolDescriptions = tools.map(t => `- ${t.name}: ${t.description}`).join('\n');

    const prompt = `You are a research assistant with access to the following tools:
${toolDescriptions}

${context ? `Previous conversation:\n${context}\n\n` : ''}
Task: ${task}

Think step by step about how to complete this task, then provide your response.`;

    try {
        const response = await model.invoke(prompt);
        const output = response.content as string;

        steps.push({
            thought: 'Analyzed the task and formulated response',
            action: 'generate_response',
            observation: output,
        });

        // Add to memory if provided
        if (memory) {
            memory.addMessage('human', task);
            memory.addMessage('ai', output);
        }

        return { output, steps };
    } catch (error) {
        console.error('Agent execution error:', error);
        throw error;
    }
}
