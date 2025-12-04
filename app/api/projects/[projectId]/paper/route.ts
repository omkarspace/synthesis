import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ projectId: string }> }
) {
    try {
        const params = await props.params;
        const { projectId } = params;
        const { fullText } = await request.json();

        if (!projectId || !fullText) {
            return NextResponse.json(
                { error: 'Missing projectId or fullText' },
                { status: 400 }
            );
        }

        // Find the writer agent run for this project
        const writerRun = await prisma.agentRun.findFirst({
            where: {
                projectId,
                agentName: 'writer'
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (writerRun) {
            // Update existing writer agent run output
            const currentOutput = writerRun.output ? JSON.parse(writerRun.output) : {};
            await prisma.agentRun.update({
                where: { id: writerRun.id },
                data: {
                    output: JSON.stringify({
                        ...currentOutput,
                        fullText,
                        updatedAt: new Date().toISOString()
                    })
                }
            });
        } else {
            // Create new writer agent run
            await prisma.agentRun.create({
                data: {
                    projectId,
                    agentName: 'writer',
                    status: 'completed',
                    output: JSON.stringify({
                        fullText,
                        title: 'Research Paper',
                        abstract: '',
                        createdAt: new Date().toISOString()
                    }),
                    completedAt: new Date()
                }
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Paper content saved successfully'
        });
    } catch (error) {
        console.error('Error saving paper:', error);
        return NextResponse.json(
            { error: 'Failed to save paper content' },
            { status: 500 }
        );
    }
}
