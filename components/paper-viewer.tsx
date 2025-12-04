'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MathRenderer } from './math-renderer';
import { RichTextEditor } from './rich-text-editor';
import { Button } from './ui/button';
import { Download, FileText, Edit, Eye } from 'lucide-react';

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
    onSave?: (content: string) => Promise<void>;
    editable?: boolean;
}

export const PaperViewer: React.FC<PaperViewerProps> = ({ paper, onDownload, onSave, editable = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Use fullText if available, otherwise compile from sections
    const content = paper.fullText || compileFromSections(paper);

    const handleSave = async (newContent: string) => {
        if (!onSave) return;

        setIsSaving(true);
        try {
            await onSave(newContent);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="animate-fadeIn">
            <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-primary" />
                        <CardTitle className="text-2xl">{paper.title}</CardTitle>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {editable && (
                            <Button
                                variant={isEditing ? "default" : "outline"}
                                onClick={() => setIsEditing(!isEditing)}
                                className="gap-2"
                            >
                                {isEditing ? (
                                    <>
                                        <Eye className="w-4 h-4" />
                                        Preview
                                    </>
                                ) : (
                                    <>
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </>
                                )}
                            </Button>
                        )}
                        {onDownload && (
                            <Button variant="outline" onClick={onDownload} className="gap-2">
                                <Download className="w-4 h-4" />
                                Download PDF
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {!isEditing && editable && (
                    <div className="mb-4 p-4 bg-primary/5 border border-primary/20 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                            <p className="font-semibold text-sm">Want to edit this paper?</p>
                            <p className="text-xs text-muted-foreground">Use the rich text editor with formatting controls</p>
                        </div>
                        <Button
                            variant="default"
                            onClick={() => setIsEditing(true)}
                            className="gap-2 w-full sm:w-auto"
                        >
                            <Edit className="w-4 h-4" />
                            Start Editing
                        </Button>
                    </div>
                )}
                {isEditing ? (
                    <RichTextEditor
                        content={content}
                        onSave={handleSave}
                        editable={true}
                    />
                ) : (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                        <MathRenderer content={content} className="space-y-6" />
                    </div>
                )}
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
