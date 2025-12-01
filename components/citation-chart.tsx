'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface CitationData {
    name: string;
    citations: number;
}

interface CitationChartProps {
    data: CitationData[];
}

const chartConfig = {
    citations: {
        label: "Citations",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export function CitationChart({ data }: CitationChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Citation Analysis</CardTitle>
                <CardDescription>Source paper citation frequency</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 10)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="citations" fill="var(--color-citations)" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
