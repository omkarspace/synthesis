'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    Activity,
    CheckCircle2,
    XCircle,
    Clock,
    Zap,
    TrendingUp,
    Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentMetrics {
    agentName: string;
    totalRuns: number;
    successRate: number;
    avgReasoningSteps: number;
    avgExecutionTime: number;
    toolsUsed: number;
    errorRate: number;
    trend: 'up' | 'down' | 'stable';
}

export function AgentPerformanceMetrics() {
    // In a real implementation, these would be calculated from actual agent run data
    const metrics: AgentMetrics[] = [
        {
            agentName: 'Reader Agent',
            totalRuns: 45,
            successRate: 95.6,
            avgReasoningSteps: 4.2,
            avgExecutionTime: 2.3,
            toolsUsed: 3,
            errorRate: 4.4,
            trend: 'up'
        },
        {
            agentName: 'Hypothesis Agent',
            totalRuns: 32,
            successRate: 87.5,
            avgReasoningSteps: 6.8,
            avgExecutionTime: 5.1,
            toolsUsed: 5,
            errorRate: 12.5,
            trend: 'stable'
        },
        {
            agentName: 'Writer Agent',
            totalRuns: 28,
            successRate: 92.9,
            avgReasoningSteps: 8.3,
            avgExecutionTime: 7.8,
            toolsUsed: 4,
            errorRate: 7.1,
            trend: 'up'
        },
        {
            agentName: 'Reviewer Agent',
            totalRuns: 18,
            successRate: 100,
            avgReasoningSteps: 5.5,
            avgExecutionTime: 3.2,
            toolsUsed: 3,
            errorRate: 0,
            trend: 'up'
        },
    ];

    const getTrendIcon = (trend: AgentMetrics['trend']) => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="w-4 h-4 text-chart-5" />;
            case 'down':
                return <TrendingUp className="w-4 h-4 text-destructive rotate-180" />;
            case 'stable':
                return <Activity className="w-4 h-4 text-muted-foreground" />;
        }
    };

    return (
        <Card className="shadow-premium">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Agent Performance Metrics
                </CardTitle>
                <CardDescription>
                    Track agent efficiency and success rates
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {metrics.map((metric, index) => (
                        <div
                            key={metric.agentName}
                            className="p-4 rounded-lg border bg-card animate-fadeIn"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-semibold">{metric.agentName}</h4>
                                    {getTrendIcon(metric.trend)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {metric.totalRuns} runs
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <CheckCircle2 className="w-4 h-4 text-chart-5" />
                                        <span className="text-sm text-muted-foreground">Success Rate</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold font-mono">
                                            {metric.successRate}%
                                        </span>
                                    </div>
                                    <Progress value={metric.successRate} className="h-2 mt-2" />
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <XCircle className="w-4 h-4 text-destructive" />
                                        <span className="text-sm text-muted-foreground">Error Rate</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold font-mono">
                                            {metric.errorRate}%
                                        </span>
                                    </div>
                                    <Progress
                                        value={metric.errorRate}
                                        className="h-2 mt-2"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                                <div>
                                    <div className="flex items-center gap-1 mb-1">
                                        <Activity className="w-3 h-3 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Avg Steps</span>
                                    </div>
                                    <span className="text-lg font-semibold font-mono">
                                        {metric.avgReasoningSteps}
                                    </span>
                                </div>

                                <div>
                                    <div className="flex items-center gap-1 mb-1">
                                        <Clock className="w-3 h-3 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Avg Time</span>
                                    </div>
                                    <span className="text-lg font-semibold font-mono">
                                        {metric.avgExecutionTime}s
                                    </span>
                                </div>

                                <div>
                                    <div className="flex items-center gap-1 mb-1">
                                        <Zap className="w-3 h-3 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Tools Used</span>
                                    </div>
                                    <span className="text-lg font-semibold font-mono">
                                        {metric.toolsUsed}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
