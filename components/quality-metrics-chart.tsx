'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QualityMetrics } from '@/lib/types';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface QualityMetricsChartProps {
    metrics: QualityMetrics;
}

const chartConfig = {
    value: {
        label: "Score",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

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
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
                    <RadarChart data={data}>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <PolarGrid className="fill-[--color-value] opacity-20" />
                        <PolarAngleAxis dataKey="metric" />
                        <Radar
                            dataKey="value"
                            fill="var(--color-value)"
                            fillOpacity={0.5}
                            stroke="var(--color-value)"
                            strokeWidth={2}
                        />
                    </RadarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
