import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SlideData } from '@/lib/ppt-generator';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ projectId: string }> }
) {
    const params = await props.params;
    try {
        const { projectId } = params;

        // Fetch the most recent presentation for this project
        const presentation = await prisma.presentation.findFirst({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
        });

        if (!presentation) {
            return NextResponse.json(
                { error: 'No presentation found for this project' },
                { status: 404 }
            );
        }

        const slides: SlideData[] = JSON.parse(presentation.slides);

        // Generate PPT and return as download
        // Note: In a real implementation, you'd generate the file server-side
        // and return it as a blob. For now, return the data to generate client-side.
        return NextResponse.json({
            title: presentation.title,
            slides,
            projectId,
        });
    } catch (error) {
        console.error('PPT download error:', error);
        return NextResponse.json(
            { error: 'Failed to generate presentation' },
            { status: 500 }
        );
    }
}
