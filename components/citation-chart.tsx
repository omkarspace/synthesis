'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface CitationData {
    name: string;
    citations: number;
}

interface CitationChartProps {
    data: CitationData[];
}

// Warm orange/amber theme colors
const CHART_COLORS = {
    primary: '#c2410c',     // Orange-700
    secondary: '#0d9488',   // Teal-600
    accent: '#f59e0b',      // Amber-500
};

export function CitationChart({ data }: CitationChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Citation Analysis</CardTitle>
                <CardDescription>Source paper citation frequency</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                                tickFormatter={(value) => value.slice(0, 10)}
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
                            <Bar
                                dataKey="citations"
                                fill={CHART_COLORS.primary}
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
