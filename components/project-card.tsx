'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/lib/types';
import { FileText, Calendar, TrendingUp, Clock, Tag, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectCardProps {
    project: Project;
    onClick?: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
    const getStatusVariant = (status: Project['status']) => {
        switch (status) {
            case 'completed':
                return 'default';
            case 'processing':
                return 'secondary';
            case 'error':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const getStatusText = (status: Project['status']) => {
        switch (status) {
            case 'completed':
                return 'Completed';
            case 'processing':
                return 'Processing';
            case 'error':
                return 'Error';
            default:
                return 'Idle';
        }
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 75) return 'text-primary';
        if (progress >= 50) return 'text-chart-3';
        return 'text-muted-foreground';
    };

    // Mock tags based on project name (in a real app, these would come from the backend)
    const tags = ['AI', 'Research', 'Analysis'];
    if (project.title.toLowerCase().includes('quantum')) tags.push('Quantum');
    if (project.title.toLowerCase().includes('bio')) tags.push('Biology');
    if (project.title.toLowerCase().includes('climate')) tags.push('Climate');

    return (
        <Card
            className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-premium-lg hover:-translate-y-1 border-muted/40 bg-card/50 backdrop-blur-sm"
            onClick={onClick}
        >
            {/* Top colored bar to simulate folder tab */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50 opacity-50 group-hover:opacity-100 transition-opacity" />

            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                        <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                            {project.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2">
                            {tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-[10px] h-5 px-1.5 font-normal bg-secondary/50 text-secondary-foreground/80">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-6 h-10">
                    {project.description || 'No description provided.'}
                </p>

                <div className="space-y-4">
                    {/* Progress Section */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-1.5">
                                {project.status === 'processing' ? (
                                    <Clock className="w-3 h-3 animate-pulse text-primary" />
                                ) : (
                                    <TrendingUp className="w-3 h-3" />
                                )}
                                {getStatusText(project.status)}
                            </span>
                            <span className={`font-mono font-medium ${getProgressColor(project.progress)}`}>
                                {project.progress}%
                            </span>
                        </div>
                        <Progress value={project.progress} className="h-1.5 bg-muted/50" />
                    </div>

                    {/* Footer Metadata */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5" />
                                <span>{project.documentCount}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{project.lastUpdated.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                            </div>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300">
                            <span className="text-xs font-medium text-primary flex items-center gap-1">
                                View Details →
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

