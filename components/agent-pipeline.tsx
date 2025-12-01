'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Agent } from '@/lib/types';
import { Clock, CheckCircle2, Loader2, XCircle, Circle, ChevronDown, ChevronUp, Terminal, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentPipelineProps {
    status?: string;
    progress?: number;
    agentRuns?: any[];
    agents?: Agent[]; // Fallback for mock data
}

const DEFAULT_AGENTS: Agent[] = [
    { id: 'reader', name: 'Reader Agent', status: 'pending' },
    { id: 'summarizer', name: 'Summarizer Agent', status: 'pending' },
    { id: 'graph', name: 'Graph Agent', status: 'pending' },
    { id: 'hypothesis', name: 'Hypothesis Agent', status: 'pending' },
    { id: 'experiment', name: 'Experiment Agent', status: 'pending' },
    { id: 'writer', name: 'Paper Writer Agent', status: 'pending' },
];

export function AgentPipeline({ status, progress, agentRuns, agents: propAgents }: AgentPipelineProps) {
    const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

    // Merge backend data with default agents
    const displayAgents: Agent[] = agentRuns ? DEFAULT_AGENTS.map(defaultAgent => {
        const run = agentRuns.find(r => r.agentName === defaultAgent.id);
        if (run) {
            return {
                ...defaultAgent,
                status: run.status as Agent['status'],
                output: run.output ? JSON.parse(run.output) : null,
                executionTime: run.executionTime,
                error: run.error
            };
        }
        return defaultAgent;
    }) : (propAgents || DEFAULT_AGENTS);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 className="w-5 h-5 text-primary" />;
            case 'running':
            case 'processing':
                return <Loader2 className="w-5 h-5 text-chart-3 animate-spin" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-destructive" />;
            default:
                return <Circle className="w-5 h-5 text-muted-foreground/30" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20">Completed</Badge>;
            case 'running':
            case 'processing':
                return (
                    <Badge variant="secondary" className="bg-chart-3/20 text-chart-3 hover:bg-chart-3/30 border-chart-3/20 animate-pulse gap-1">
                        <Activity className="w-3 h-3 animate-bounce" /> Processing
                    </Badge>
                );
            case 'error':
                return <Badge variant="destructive">Error</Badge>;
            default:
                return <Badge variant="outline" className="text-muted-foreground">Pending</Badge>;
        }
    };

    const toggleExpand = (agentId: string) => {
        setExpandedAgent(expandedAgent === agentId ? null : agentId);
    };

    return (
        <Card className="shadow-premium animate-fadeIn overflow-hidden border-muted/40">
            <CardHeader className="bg-muted/20 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Terminal className="w-5 h-5 text-primary" />
                            Agent Pipeline
                        </CardTitle>
                        <CardDescription>Real-time multi-agent workflow execution</CardDescription>
                    </div>
                    {/* Overall Progress */}
                    <div className="flex items-center gap-2">
                        <div className="text-right mr-2">
                            <p className="text-xs font-medium text-muted-foreground">Total Progress</p>
                            <p className="text-lg font-bold font-mono text-primary">
                                {Math.round(progress || (displayAgents.filter((a: any) => a.status === 'completed').length / displayAgents.length) * 100)}%
                            </p>
                        </div>
                        <div className="h-10 w-1 bg-muted rounded-full overflow-hidden">
                            <div
                                className="w-full bg-primary transition-all duration-500 ease-out"
                                style={{ height: `${progress || (displayAgents.filter((a: any) => a.status === 'completed').length / displayAgents.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                    {displayAgents.map((agent, index) => {
                        const isExpanded = expandedAgent === agent.id;
                        const hasOutput = agent.output || agent.status === 'completed';
                        const isRunning = agent.status === 'running' || agent.status === 'processing';

                        return (
                            <div key={agent.id} className={cn(
                                "transition-all duration-300",
                                isRunning ? "bg-primary/5" : "hover:bg-muted/20"
                            )}>
                                <div
                                    className="p-4 flex items-center gap-4 cursor-pointer"
                                    onClick={() => hasOutput && toggleExpand(agent.id)}
                                >
                                    {/* Status Icon with Connector Line */}
                                    <div className="relative flex flex-col items-center">
                                        {index > 0 && (
                                            <div className={cn(
                                                "absolute -top-8 w-0.5 h-8 -z-10",
                                                displayAgents[index - 1].status === 'completed' ? "bg-primary/50" : "bg-muted"
                                            )} />
                                        )}
                                        <div className={cn(
                                            "relative z-10 rounded-full p-1 bg-background border-2 transition-colors duration-300",
                                            agent.status === 'completed' ? "border-primary" :
                                                isRunning ? "border-chart-3 shadow-[0_0_10px_rgba(0,0,0,0.1)] shadow-chart-3/30" : "border-muted"
                                        )}>
                                            {getStatusIcon(agent.status)}
                                        </div>
                                    </div>

                                    {/* Agent Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className={cn(
                                                "font-medium truncate",
                                                agent.status === 'completed' ? "text-foreground" : "text-muted-foreground"
                                            )}>
                                                {agent.name}
                                            </h4>
                                            {getStatusBadge(agent.status)}
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            {agent.executionTime && (
                                                <span className="flex items-center gap-1 font-mono">
                                                    <Clock className="w-3 h-3" />
                                                    {agent.executionTime}s
                                                </span>
                                            )}
                                            {hasOutput && (
                                                <span className="text-primary/80 group-hover:text-primary transition-colors">
                                                    {isExpanded ? 'Click to collapse logs' : 'Click to view logs'}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {hasOutput && (
                                        <div className="text-muted-foreground">
                                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </div>
                                    )}
                                </div>

                                {/* Expanded Logs */}
                                <div className={cn(
                                    "grid transition-all duration-300 ease-in-out bg-black/5 dark:bg-black/20",
                                    isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                )}>
                                    <div className="overflow-hidden">
                                        <div className="p-4 pt-0">
                                            <div className="mt-2 rounded-md border bg-card p-4 font-mono text-xs shadow-inner max-h-[300px] overflow-y-auto custom-scrollbar">
                                                <div className="flex items-center gap-2 mb-2 text-muted-foreground border-b pb-2">
                                                    <Terminal className="w-3 h-3" />
                                                    <span>Agent Output Log</span>
                                                </div>
                                                <pre className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
                                                    {typeof agent.output === 'string'
                                                        ? agent.output
                                                        : JSON.stringify(agent.output, null, 2)}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

