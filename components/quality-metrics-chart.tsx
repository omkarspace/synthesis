'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QualityMetrics } from '@/lib/types';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';

interface QualityMetricsChartProps {
    metrics: QualityMetrics;
}

// Warm orange/amber theme colors
const CHART_COLORS = {
    primary: '#c2410c',     // Orange-700
    secondary: '#0d9488',   // Teal-600
    accent: '#f59e0b',      // Amber-500
};

export function QualityMetricsChart({ metrics }: QualityMetricsChartProps) {
    const data = [
        { metric: 'Novelty', value: metrics.novelty },
        { metric: 'Cohesion', value: metrics.cohesion },
        { metric: 'Redundancy', value: 100 - metrics.redundancy },
        { metric: 'Completeness', value: metrics.completeness },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
                <CardDescription>Research paper quality assessment</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mx-auto aspect-square max-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={data} cx="50%" cy="50%" outerRadius="80%">
                            <PolarGrid stroke="var(--border)" />
                            <PolarAngleAxis
                                dataKey="metric"
                                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--popover)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    boxShadow: 'var(--shadow-lg)'
                                }}
                                labelStyle={{ color: 'var(--foreground)', fontWeight: 600 }}
                                itemStyle={{ color: 'var(--muted-foreground)' }}
                            />
                            <Radar
                                name="Score"
                                dataKey="value"
                                stroke={CHART_COLORS.secondary}
                                fill={CHART_COLORS.secondary}
                                fillOpacity={0.4}
                                strokeWidth={2}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
