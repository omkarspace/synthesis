'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MathRenderer } from './math-renderer';
import { Button } from './ui/button';
import { Download, FileText } from 'lucide-react';

interface PaperViewerProps {
    paper: {
        title: string;
        abstract: string;
        fullText?: string;
        introduction?: string;
        literatureReview?: string;
        methodology?: string;
        results?: string;
        discussion?: string;
        conclusion?: string;
        references?: string[];
    };
    onDownload?: () => void;
}

export const PaperViewer: React.FC<PaperViewerProps> = ({ paper, onDownload }) => {
    // Use fullText if available, otherwise compile from sections
    const content = paper.fullText || compileFromSections(paper);

    return (
        <Card className="animate-fadeIn">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-primary" />
                        <CardTitle className="text-2xl">{paper.title}</CardTitle>
                    </div>
                    {onDownload && (
                        <Button variant="outline" onClick={onDownload}>
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <MathRenderer content={content} className="space-y-6" />
            </CardContent>
        </Card>
    );
};

function compileFromSections(paper: any): string {
    let text = `# ${paper.title}\n\n`;

    if (paper.abstract) {
        text += `## Abstract\n\n${paper.abstract}\n\n`;
    }

    if (paper.introduction) {
        text += `## Introduction\n\n${paper.introduction}\n\n`;
    }

    if (paper.literatureReview) {
        text += `## Literature Review\n\n${paper.literatureReview}\n\n`;
    }

    if (paper.methodology) {
        text += `## Methodology\n\n${paper.methodology}\n\n`;
    }

    if (paper.results) {
        text += `## Results\n\n${paper.results}\n\n`;
    }

    if (paper.discussion) {
        text += `## Discussion\n\n${paper.discussion}\n\n`;
    }

    if (paper.conclusion) {
        text += `## Conclusion\n\n${paper.conclusion}\n\n`;
    }

    if (paper.references && paper.references.length > 0) {
        text += `## References\n\n`;
        paper.references.forEach((ref: string, idx: number) => {
            text += `${idx + 1}. ${ref}\n`;
        });
    }

    return text;
}
