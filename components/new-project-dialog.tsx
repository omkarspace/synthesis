'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle2, Loader2, X, FileType } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated?: () => void;
}

const AGENT_STEPS = [
  { id: 'reader', label: 'Reader Agent', description: 'Parsing documents' },
  { id: 'summarizer', label: 'Summarizer Agent', description: 'Extracting key insights' },
  { id: 'graph', label: 'Graph Agent', description: 'Building concept network' },
  { id: 'hypothesis', label: 'Hypothesis Agent', description: 'Generating hypotheses' },
  { id: 'experiment', label: 'Experiment Agent', description: 'Designing experiments' },
  { id: 'writer', label: 'Paper Writer Agent', description: 'Drafting content' },
];

export function NewProjectDialog({ open, onOpenChange, onProjectCreated }: NewProjectDialogProps) {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setProjectName('');
      setDescription('');
      setFiles([]);
      setIsCreating(false);
      setCurrentStep(-1);
      setDragActive(false);
    }
  }, [open]);

  // Simulate agent initialization progress
  useEffect(() => {
    if (isCreating) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < AGENT_STEPS.length - 1) return prev + 1;
          return prev;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isCreating]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file =>
      file.type === 'application/pdf' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.name.endsWith('.pdf') ||
      file.name.endsWith('.docx')
    );

    if (validFiles.length !== newFiles.length) {
      addToast('Some files were skipped. Only PDF and DOCX files are allowed.', 'warning');
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!projectName.trim() || files.length === 0) return;

    setIsCreating(true);
    setCurrentStep(0);

    try {
      // Create project
      const projectRes = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName, description }),
      });

      if (!projectRes.ok) throw new Error('Failed to create project');

      const project = await projectRes.json();

      // Upload files
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('projectId', project.id);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) throw new Error(`Failed to upload ${file.name}`);
      }

      // Start agent pipeline
      await fetch('/api/agents/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id }),
      });

      // Wait a bit to show the animation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Success!
      addToast(`Project "${projectName}" created successfully!`, 'success');
      onOpenChange(false);
      onProjectCreated?.();
    } catch (error) {
      console.error('Error creating project:', error);
      addToast('Failed to create project. Please try again.', 'error');
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Create New Project</DialogTitle>
          <DialogDescription>
            Upload research papers and let our multi-agent system analyze them.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {isCreating ? (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center space-y-2">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-muted" />
                  <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold">{Math.round(((currentStep + 1) / AGENT_STEPS.length) * 100)}%</span>
                  </div>
                </div>
                <h3 className="font-semibold text-lg">Initializing Research Pipeline</h3>
                <p className="text-muted-foreground text-sm">Please wait while we set up your agents...</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {AGENT_STEPS.map((step, index) => (
                  <div
                    key={step.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-all duration-500",
                      index <= currentStep
                        ? "bg-primary/5 border-primary/20"
                        : "bg-muted/30 border-transparent opacity-50"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs border",
                      index < currentStep
                        ? "bg-primary text-primary-foreground border-primary"
                        : index === currentStep
                          ? "border-primary text-primary animate-pulse"
                          : "border-muted-foreground text-muted-foreground"
                    )}>
                      {index < currentStep ? <CheckCircle2 className="w-3.5 h-3.5" /> : index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{step.label}</div>
                      <div className="text-xs text-muted-foreground">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fadeIn">
              {/* Project Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Project Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., Quantum Computing Advances 2024"
                  className="w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  autoFocus
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of your research topic..."
                  rows={2}
                  className="w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all"
                />
              </div>

              {/* Drag & Drop File Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Research Papers <span className="text-destructive">*</span>
                </label>
                <div
                  className={cn(
                    "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ease-in-out",
                    dragActive
                      ? "border-primary bg-primary/5 scale-[1.01]"
                      : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/20"
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="flex flex-col items-center gap-2 pointer-events-none">
                    <div className="p-3 bg-background rounded-full shadow-sm border">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF or DOCX (max 10MB each)
                      </p>
                    </div>
                  </div>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 mt-3 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-card border rounded-lg group animate-slideIn">
                        <div className="p-2 bg-primary/10 rounded">
                          <FileType className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          {!isCreating && (
            <>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!projectName.trim() || files.length === 0}
                className="gap-2"
              >
                Create Project
                <CheckCircle2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
