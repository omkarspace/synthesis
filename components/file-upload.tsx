'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadedFile {
    name: string;
    size: number;
    type: string;
}

export function FileUpload() {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<UploadedFile[]>([]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files).map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
        }));

        setFiles(prev => [...prev, ...droppedFiles]);
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files).map(file => ({
                name: file.name,
                size: file.size,
                type: file.type,
            }));

            setFiles(prev => [...prev, ...selectedFiles]);
        }
    }, []);

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <Card className="shadow-premium animate-fadeIn">
            <CardHeader>
                <CardTitle>Upload Research Papers</CardTitle>
                <CardDescription>Drag and drop PDF or Word documents to begin analysis</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Drop Zone */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                        "relative border-2 border-dashed rounded-lg p-12 transition-all duration-300",
                        isDragging
                            ? "border-primary bg-primary/5 scale-[1.02]"
                            : "border-border hover:border-primary/50 hover:bg-accent/30"
                    )}
                >
                    <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileInput}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="flex flex-col items-center justify-center text-center">
                        <div className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors",
                            isDragging ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}>
                            <Upload className="w-8 h-8" />
                        </div>

                        <h3 className="text-lg font-semibold mb-2">
                            {isDragging ? 'Drop files here' : 'Upload research papers'}
                        </h3>

                        <p className="text-sm text-muted-foreground mb-4">
                            Drag and drop files or click to browse
                        </p>

                        <Button variant="outline" size="sm" className="pointer-events-none">
                            Choose Files
                        </Button>

                        <p className="text-xs text-muted-foreground mt-4">
                            Supports PDF, DOC, DOCX (Max 10MB per file)
                        </p>
                    </div>
                </div>

                {/* Uploaded Files List */}
                {files.length > 0 && (
                    <div className="mt-6 space-y-2">
                        <h4 className="text-sm font-semibold mb-3">Uploaded Files ({files.length})</h4>
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/30 transition-smooth animate-slideIn"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <FileText className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{file.name}</p>
                                        <p className="text-xs text-muted-foreground font-mono">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="p-1 hover:bg-destructive/10 rounded transition-colors"
                                    >
                                        <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <Button className="w-full mt-4" size="lg">
                            Start Analysis
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
