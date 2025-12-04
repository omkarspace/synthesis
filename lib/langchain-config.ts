import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { AgentExecutor, createReActAgent } from 'langchain/agents';
import { pull } from 'langchain/hub';
import { BufferMemory } from 'langchain/memory';

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
        modelName: 'gemini-2.0-flash-exp',
        temperature,
        apiKey,
        maxOutputTokens: 8192,
    });
}

/**
 * Create a ReAct agent with tools and memory
 */
export async function createReActAgentExecutor(
    tools: any[],
    systemPrompt: string,
    memory?: BufferMemory
) {
    const model = createLangChainModel();

    // Pull the ReAct prompt from LangChain Hub
    const prompt = await pull('hwchase17/react');

    // Create the agent
    const agent = await createReActAgent({
        llm: model,
        tools,
        prompt,
    });

    // Create executor
    return new AgentExecutor({
        agent,
        tools,
        memory,
        verbose: true,
        maxIterations: 10,
        returnIntermediateSteps: true,
    });
}

/**
 * Create memory for agent conversations
 */
export function createAgentMemory() {
    return new BufferMemory({
        returnMessages: true,
        memoryKey: 'chat_history',
        inputKey: 'input',
        outputKey: 'output',
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
