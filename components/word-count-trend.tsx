'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface WordCountData {
    draft: string;
    words: number;
}

interface WordCountTrendProps {
    data: WordCountData[];
}

const chartConfig = {
    words: {
        label: "Words",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig;

export function WordCountTrend({ data }: WordCountTrendProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Word Count Trend</CardTitle>
                <CardDescription>Document growth across drafts</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <LineChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="draft"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey="words"
                            type="natural"
                            stroke="var(--color-words)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
