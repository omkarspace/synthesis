'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GripVertical, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

interface OutlineSection {
    title: string;
    description: string;
    subsections?: string[];
    order: number;
}

interface OutlineEditorProps {
    outline: {
        title: string;
        abstract: string;
        sections: OutlineSection[];
    };
    onSave?: (outline: any) => void;
    readOnly?: boolean;
}

export const OutlineEditor: React.FC<OutlineEditorProps> = ({
    outline: initialOutline,
    onSave,
    readOnly = false,
}) => {
    const [outline, setOutline] = useState(initialOutline);
    const [editingSection, setEditingSection] = useState<number | null>(null);
    const [draggedItem, setDraggedItem] = useState<number | null>(null);

    const handleDragStart = (index: number) => {
        setDraggedItem(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedItem === null || draggedItem === index) return;

        const newSections = [...outline.sections];
        const draggedSection = newSections[draggedItem];
        newSections.splice(draggedItem, 1);
        newSections.splice(index, 0, draggedSection);

        // Update order
        newSections.forEach((section, idx) => {
            section.order = idx + 1;
        });

        setOutline({ ...outline, sections: newSections });
        setDraggedItem(index);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    const handleEditSection = (index: number) => {
        setEditingSection(index);
    };

    const handleSaveSection = (index: number, updates: Partial<OutlineSection>) => {
        const newSections = [...outline.sections];
        newSections[index] = { ...newSections[index], ...updates };
        setOutline({ ...outline, sections: newSections });
        setEditingSection(null);
    };

    const handleDeleteSection = (index: number) => {
        const newSections = outline.sections.filter((_, idx) => idx !== index);
        newSections.forEach((section, idx) => {
            section.order = idx + 1;
        });
        setOutline({ ...outline, sections: newSections });
    };

    const handleAddSection = () => {
        const newSection: OutlineSection = {
            title: 'New Section',
            description: 'Section description',
            subsections: [],
            order: outline.sections.length + 1,
        };
        setOutline({ ...outline, sections: [...outline.sections, newSection] });
        setEditingSection(outline.sections.length);
    };

    return (
        <Card className="animate-fadeIn">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Research Paper Outline</CardTitle>
                        <CardDescription>
                            {readOnly ? 'View paper structure' : 'Drag to reorder, click to edit'}
                        </CardDescription>
                    </div>
                    {!readOnly && (
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleAddSection}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Section
                            </Button>
                            {onSave && (
                                <Button size="sm" onClick={() => onSave(outline)}>
                                    <Check className="w-4 h-4 mr-2" />
                                    Save Changes
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Title */}
                <div>
                    <label className="text-sm font-semibold mb-1 block">Title</label>
                    <Input
                        value={outline.title}
                        onChange={(e) => setOutline({ ...outline, title: e.target.value })}
                        readOnly={readOnly}
                        className="text-lg font-semibold"
                    />
                </div>

                {/* Abstract */}
                <div>
                    <label className="text-sm font-semibold mb-1 block">Abstract Outline</label>
                    <textarea
                        value={outline.abstract}
                        onChange={(e) => setOutline({ ...outline, abstract: e.target.value })}
                        readOnly={readOnly}
                        className="w-full px-3 py-2 bg-background border rounded-lg text-sm min-h-[80px]"
                    />
                </div>

                {/* Sections */}
                <div>
                    <label className="text-sm font-semibold mb-2 block">Sections</label>
                    <div className="space-y-2">
                        {outline.sections.map((section, index) => (
                            <div
                                key={index}
                                draggable={!readOnly}
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                                className={`border rounded-lg p-4 bg-card ${!readOnly ? 'cursor-move hover:border-primary' : ''
                                    } ${draggedItem === index ? 'opacity-50' : ''}`}
                            >
                                <div className="flex items-start gap-3">
                                    {!readOnly && <GripVertical className="w-5 h-5 text-muted-foreground mt-1" />}

                                    <div className="flex-1">
                                        {editingSection === index ? (
                                            <div className="space-y-2">
                                                <Input
                                                    value={section.title}
                                                    onChange={(e) =>
                                                        handleSaveSection(index, { title: e.target.value })
                                                    }
                                                    className="font-semibold"
                                                    autoFocus
                                                />
                                                <textarea
                                                    value={section.description}
                                                    onChange={(e) =>
                                                        handleSaveSection(index, { description: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 bg-background border rounded-lg text-sm"
                                                    rows={2}
                                                />
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setEditingSection(null)}
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-semibold">
                                                        {section.order}. {section.title}
                                                    </h4>
                                                    {!readOnly && (
                                                        <div className="flex gap-1">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleEditSection(index)}
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleDeleteSection(index)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {section.description}
                                                </p>
                                                {section.subsections && section.subsections.length > 0 && (
                                                    <ul className="mt-2 ml-4 text-sm text-muted-foreground list-disc">
                                                        {section.subsections.map((sub, subIdx) => (
                                                            <li key={subIdx}>{sub}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
