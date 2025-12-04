'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Brain,
    Zap,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Wrench,
    MessageSquare,
    Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface AgentActivity {
    id: string;
    agentName: string;
    type: 'thought' | 'action' | 'observation' | 'decision' | 'error';
    content: string;
    timestamp: Date;
    toolUsed?: string;
    reasoning?: string;
}

interface AgentActivityFeedProps {
    projectId?: string;
    maxItems?: number;
}

export function AgentActivityFeed({ projectId, maxItems = 50 }: AgentActivityFeedProps) {
    const [activities, setActivities] = useState<AgentActivity[]>([]);
    const [filter, setFilter] = useState<string>('all');

    // Simulate real-time activity feed
    useEffect(() => {
        // In a real implementation, this would connect to a WebSocket or polling mechanism
        const mockActivities: AgentActivity[] = [
            {
                id: '1',
                agentName: 'Reader Agent',
                type: 'thought',
                content: 'I need to extract the abstract section from this research paper to understand the core contribution.',
                timestamp: new Date(Date.now() - 5000),
                reasoning: 'Starting with abstract provides high-level understanding'
            },
            {
                id: '2',
                agentName: 'Reader Agent',
                type: 'action',
                content: 'Using extract_section tool to get the abstract',
                timestamp: new Date(Date.now() - 4500),
                toolUsed: 'extract_section'
            },
            {
                id: '3',
                agentName: 'Reader Agent',
                type: 'observation',
                content: 'Successfully extracted abstract: "This paper presents a novel approach to..."',
                timestamp: new Date(Date.now() - 4000),
            },
            {
                id: '4',
                agentName: 'Hypothesis Agent',
                type: 'thought',
                content: 'Based on the research gaps identified, I should generate hypotheses that address the limitations mentioned.',
                timestamp: new Date(Date.now() - 3000),
                reasoning: 'Gaps in current literature provide opportunities for novel contributions'
            },
            {
                id: '5',
                agentName: 'Hypothesis Agent',
                type: 'action',
                content: 'Checking novelty of hypothesis: "Combining X with Y could improve Z"',
                timestamp: new Date(Date.now() - 2500),
                toolUsed: 'verify_novelty'
            },
            {
                id: '6',
                agentName: 'Hypothesis Agent',
                type: 'decision',
                content: 'Hypothesis appears novel with 85% confidence. Proceeding to assess feasibility.',
                timestamp: new Date(Date.now() - 2000),
            },
            {
                id: '7',
                agentName: 'Writer Agent',
                type: 'thought',
                content: 'The introduction needs better flow. I should check coherence before proceeding.',
                timestamp: new Date(Date.now() - 1000),
                reasoning: 'Coherent writing improves readability and impact'
            },
            {
                id: '8',
                agentName: 'Writer Agent',
                type: 'action',
                content: 'Running coherence check on introduction section',
                timestamp: new Date(Date.now() - 500),
                toolUsed: 'check_coherence'
            },
        ];

        setActivities(mockActivities);
    }, [projectId]);

    const getActivityIcon = (type: AgentActivity['type']) => {
        switch (type) {
            case 'thought':
                return <Brain className="w-4 h-4 text-chart-3" />;
            case 'action':
                return <Zap className="w-4 h-4 text-chart-2" />;
            case 'observation':
                return <MessageSquare className="w-4 h-4 text-chart-5" />;
            case 'decision':
                return <CheckCircle2 className="w-4 h-4 text-primary" />;
            case 'error':
                return <AlertCircle className="w-4 h-4 text-destructive" />;
        }
    };

    const getActivityColor = (type: AgentActivity['type']) => {
        switch (type) {
            case 'thought':
                return 'bg-chart-3/10 border-chart-3/20';
            case 'action':
                return 'bg-chart-2/10 border-chart-2/20';
            case 'observation':
                return 'bg-chart-5/10 border-chart-5/20';
            case 'decision':
                return 'bg-primary/10 border-primary/20';
            case 'error':
                return 'bg-destructive/10 border-destructive/20';
        }
    };

    const filteredActivities = filter === 'all'
        ? activities
        : activities.filter(a => a.type === filter);

    return (
        <Card className="shadow-premium">
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 text-primary animate-spin" />
                            Agent Activity Feed
                        </CardTitle>
                        <CardDescription>Real-time agent reasoning and actions</CardDescription>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {['all', 'thought', 'action', 'decision'].map((f) => (
                            <Badge
                                key={f}
                                variant={filter === f ? 'default' : 'outline'}
                                className="cursor-pointer"
                                onClick={() => setFilter(f)}
                            >
                                {f}
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                        {filteredActivities.map((activity, index) => (
                            <div
                                key={activity.id}
                                className={cn(
                                    'p-4 rounded-lg border animate-fadeIn',
                                    getActivityColor(activity.type)
                                )}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-sm">
                                                {activity.agentName}
                                            </span>
                                            <Badge variant="outline" className="text-xs">
                                                {activity.type}
                                            </Badge>
                                            {activity.toolUsed && (
                                                <Badge variant="secondary" className="text-xs gap-1">
                                                    <Wrench className="w-3 h-3" />
                                                    {activity.toolUsed}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-foreground/90 mb-2">
                                            {activity.content}
                                        </p>
                                        {activity.reasoning && (
                                            <p className="text-xs text-muted-foreground italic">
                                                💡 {activity.reasoning}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            {activity.timestamp.toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
