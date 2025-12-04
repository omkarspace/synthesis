import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ projectId: string }> }
) {
    const params = await props.params;
    try {
        const project = await prisma.project.findUnique({
            where: { id: params.projectId },
            include: {
                documents: true,
                agentRuns: {
                    orderBy: { createdAt: 'desc' },
                },
                hypotheses: true,
                conceptNodes: true,
                statistics: true,
            } as any,
        });

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error('GET /api/projects/[projectId] error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch project' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ projectId: string }> }
) {
    const params = await props.params;
    try {
        await prisma.project.delete({
            where: { id: params.projectId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/projects/[projectId] error:', error);
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        );
    }
}
