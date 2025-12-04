'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface WordCountData {
    draft: string;
    words: number;
}

interface WordCountTrendProps {
    data: WordCountData[];
}

// Warm orange/amber theme colors
const CHART_COLORS = {
    primary: '#c2410c',     // Orange-700
    secondary: '#0d9488',   // Teal-600
    accent: '#f59e0b',      // Amber-500
};

export function WordCountTrend({ data }: WordCountTrendProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Word Count Trend</CardTitle>
                <CardDescription>Document growth across drafts</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis
                                dataKey="draft"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
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
                            <Line
                                dataKey="words"
                                type="monotone"
                                stroke={CHART_COLORS.accent}
                                strokeWidth={3}
                                dot={{ fill: CHART_COLORS.accent, strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, fill: CHART_COLORS.accent }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
