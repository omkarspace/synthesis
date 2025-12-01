import { NextRequest, NextResponse } from 'next/server';
import { searchProject } from '@/lib/vector-store';
import { geminiClient } from '@/lib/gemini-client';

export async function POST(request: NextRequest) {
    try {
        const { projectId, query, conversationHistory } = await request.json();

        if (!projectId || !query) {
            return NextResponse.json(
                { error: 'Missing projectId or query' },
                { status: 400 }
            );
        }

        // Search for relevant context using vector search
        const searchResults = await searchProject(projectId, query, 3);

        // Build context from search results
        const context = searchResults
            .map((result, idx) => `[Source ${idx + 1}]: ${result.content}`)
            .join('\n\n');

        // Build conversation history
        const history = conversationHistory
            ?.slice(-4) // Last 4 messages for context
            .map((msg: { role: string; content: string }) =>
                `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
            )
            .join('\n') || '';

        // Create RAG prompt
        const prompt = `You are a research assistant helping analyze research documents. Use the following context from the research documents to answer the user's question. If the context doesn't contain relevant information, say so.

Context from research documents:
${context}

${history ? `Previous conversation:\n${history}\n` : ''}

User question: ${query}

Please provide a helpful, accurate answer based on the context above. If you reference specific information, mention which source it came from.`;

        // Generate response
        const response = await geminiClient.generateText(prompt);

        return NextResponse.json({
            response,
            sources: searchResults.map(r => ({
                content: r.content,
                similarity: r.similarity
            }))
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Failed to process chat request' },
            { status: 500 }
        );
    }
}
