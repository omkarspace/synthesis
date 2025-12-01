import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { exportToPDF, exportToLaTeX, exportToDOCX, exportToMarkdown } from '@/lib/export-utils';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ format: string; projectId: string }> }
) {
    const params = await props.params;
    const { format, projectId } = params;

    try {
        // Fetch project and paper data
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                agentRuns: {
                    where: {
                        agentName: 'writer',
                        status: 'completed'
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        });

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        if (!project.agentRuns || project.agentRuns.length === 0) {
            return NextResponse.json(
                { error: 'No paper generated yet' },
                { status: 404 }
            );
        }

        const paperData = JSON.parse(project.agentRuns[0].output || '{}');
        const paper = {
            title: paperData.title || project.name,
            abstract: paperData.abstract,
            introduction: paperData.introduction,
            literatureReview: paperData.literatureReview,
            methodology: paperData.methodology,
            results: paperData.results,
            discussion: paperData.discussion,
            conclusion: paperData.conclusion,
            references: paperData.references,
            fullText: paperData.fullText
        };

        const filename = `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`;

        switch (format.toLowerCase()) {
            case 'pdf': {
                const pdfBlob = await exportToPDF(paper, filename);
                const buffer = Buffer.from(await pdfBlob.arrayBuffer());

                return new NextResponse(buffer, {
                    headers: {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': `attachment; filename="${filename}.pdf"`
                    }
                });
            }

            case 'latex': {
                const latexContent = exportToLaTeX(paper);

                return new NextResponse(latexContent, {
                    headers: {
                        'Content-Type': 'application/x-latex',
                        'Content-Disposition': `attachment; filename="${filename}.tex"`
                    }
                });
            }

            case 'docx': {
                const docxBlob = await exportToDOCX(paper);
                const buffer = Buffer.from(await docxBlob.arrayBuffer());

                return new NextResponse(buffer, {
                    headers: {
                        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'Content-Disposition': `attachment; filename="${filename}.docx"`
                    }
                });
            }

            case 'markdown':
            case 'md': {
                const markdownContent = exportToMarkdown(paper);

                return new NextResponse(markdownContent, {
                    headers: {
                        'Content-Type': 'text/markdown',
                        'Content-Disposition': `attachment; filename="${filename}.md"`
                    }
                });
            }

            default:
                return NextResponse.json(
                    { error: 'Unsupported format. Use: pdf, latex, docx, or markdown' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json(
            { error: 'Failed to export paper' },
            { status: 500 }
        );
    }
}
