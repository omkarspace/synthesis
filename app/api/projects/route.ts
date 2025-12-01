import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/projects - List all projects
export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                documents: true,
                _count: {
                    select: { documents: true },
                },
            },
        });

        return NextResponse.json(projects);
    } catch (error) {
        console.error('GET /api/projects error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'Project name is required' },
                { status: 400 }
            );
        }

        const project = await prisma.project.create({
            data: {
                name,
                description: description || '',
                status: 'idle',
                progress: 0,
            },
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error('POST /api/projects error:', error);
        return NextResponse.json(
            { error: 'Failed to create project' },
            { status: 500 }
        );
    }
}
