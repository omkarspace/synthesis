import { NextRequest, NextResponse } from 'next/server';
import { orchestrator } from '@/lib/agents/orchestrator';

export async function POST(request: NextRequest) {
    try {
        const { projectId } = await request.json();

        if (!projectId) {
            return NextResponse.json(
                { error: 'Project ID is required' },
                { status: 400 }
            );
        }

        // Run agent pipeline asynchronously
        orchestrator.runPipeline(projectId).catch(console.error);

        return NextResponse.json({
            success: true,
            message: 'Agent pipeline started',
            projectId,
        });
    } catch (error) {
        console.error('POST /api/agents/run error:', error);
        return NextResponse.json(
            { error: 'Failed to start agent pipeline' },
            { status: 500 }
        );
    }
}
