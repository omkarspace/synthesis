import { NextRequest, NextResponse } from 'next/server';
import { searchProject } from '@/lib/vector-store';
import { geminiClient } from '@/lib/gemini-client';
import { prisma } from '@/lib/prisma';

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

        // Build context from search results. If none found, fall back to recent agent run outputs.
        let context = searchResults
            .map((result, idx) => `[Source ${idx + 1}]: ${result.content}`)
            .join('\n\n');

        if (!context || context.trim().length === 0) {
            try {
                const agentRuns = await prisma.agentRun.findMany({
                    where: { projectId, status: 'completed' },
                    orderBy: { createdAt: 'desc' },
                    take: 6,
                });

                const runsContext = agentRuns
                    .map((run, idx) => `[Agent ${run.agentName} ${idx + 1}]: ${run.output || ''}`)
                    .join('\n\n');

                if (runsContext.trim()) {
                    context = `Agent outputs (fallback):\n${runsContext}`;
                }
            } catch (err) {
                console.error('Failed to fetch agent runs for chat fallback:', err);
            }
        }

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

        // Debug: log the prompt sent to Gemini to help trace empty-context issues
        console.log('Chat prompt:', prompt);

        // Check if we have meaningful context
        const hasContext = context && !context.includes('PDF text extraction temporarily unavailable');

        // Generate response
        let response: string;
        if (!hasContext) {
            response = "I apologize, but I don't have access to the document content yet. The PDF text extraction is still processing. This could be due to:\n\n1. The document is still being processed\n2. PDF extraction encountered an issue\n3. No documents have been uploaded to this project yet\n\nPlease try:\n- Uploading the document again\n- Waiting a few moments for processing to complete\n- Checking if the document uploaded successfully\n\nOnce the document is processed, I'll be able to answer your questions about its content.";
        } else {
            response = await geminiClient.generateText(prompt);
        }

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
