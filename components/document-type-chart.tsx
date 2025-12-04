'use client';

import * as React from 'react';
import { Label, Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

// Warm orange/amber theme colors
const CHART_COLORS = [
    '#c2410c',   // Orange-700 (primary)
    '#0d9488',   // Teal-600 (secondary)
    '#f59e0b',   // Amber-500 (accent)
    '#6b7280',   // Gray-500
    '#8b5cf6',   // Violet-500
];

const chartData = [
    { type: 'PDFs', count: 275 },
    { type: 'DOCX', count: 200 },
    { type: 'Web', count: 287 },
    { type: 'Papers', count: 173 },
    { type: 'Other', count: 190 },
];

export function DocumentTypeChart() {
    const totalDocuments = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.count, 0);
    }, []);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Document Types</CardTitle>
                <CardDescription>Distribution of source materials</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <div className="mx-auto aspect-square max-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
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
                            <Pie
                                data={chartData}
                                dataKey="count"
                                nameKey="type"
                                innerRadius={60}
                                outerRadius={90}
                                strokeWidth={2}
                                stroke="var(--background)"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                                    />
                                ))}
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-foreground text-3xl font-bold"
                                                    >
                                                        {totalDocuments.toLocaleString()}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24}
                                                        className="fill-muted-foreground text-sm"
                                                    >
                                                        Documents
                                                    </tspan>
                                                </text>
                                            );
                                        }
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 mt-4 pb-4">
                    {chartData.map((entry, index) => (
                        <div key={entry.type} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-sm"
                                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                            />
                            <span className="text-sm text-muted-foreground">{entry.type}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
