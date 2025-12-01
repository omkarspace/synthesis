import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/prisma';
import { fileProcessor } from '@/lib/file-processor';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const projectId = formData.get('projectId') as string;

        if (!file || !projectId) {
            return NextResponse.json(
                { error: 'File and projectId are required' },
                { status: 400 }
            );
        }

        // Save file to uploads directory
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadsDir = join(process.cwd(), 'uploads');
        const filepath = join(uploadsDir, `${Date.now()}-${file.name}`);

        await writeFile(filepath, buffer);

        // Extract text from file
        const extracted = await fileProcessor.processFile(filepath, file.type);

        // Save document to database
        const document = await prisma.document.create({
            data: {
                projectId,
                filename: file.name,
                filepath,
                filesize: file.size,
                mimetype: file.type,
                extractedText: extracted.text,
                metadata: JSON.stringify(extracted.metadata),
            },
        });

        return NextResponse.json(document, { status: 201 });
    } catch (error) {
        console.error('POST /api/upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}
