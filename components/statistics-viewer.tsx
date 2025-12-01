'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Statistic {
    id: string;
    category: string;
    label: string;
    value: number;
    unit?: string | null;
    context: string;
}

interface StatisticsViewerProps {
    statistics: Statistic[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function StatisticsViewer({ statistics }: StatisticsViewerProps) {
    if (!statistics || statistics.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                    No statistical data extracted yet. Run the pipeline to analyze documents.
                </CardContent>
            </Card>
        );
    }

    // Group by category
    const groupedStats = statistics.reduce((acc, stat) => {
        if (!acc[stat.category]) {
            acc[stat.category] = [];
        }
        acc[stat.category].push(stat);
        return acc;
    }, {} as Record<string, Statistic[]>);

    // Prepare chart data - filter for items that look comparable (e.g. percentages)
    const percentageStats = statistics.filter(s => s.unit === '%' || s.unit?.toLowerCase().includes('percent'));
    const chartData = percentageStats.slice(0, 10).map(s => ({
        name: s.label.length > 15 ? s.label.substring(0, 15) + '...' : s.label,
        fullLabel: s.label,
        value: s.value,
        category: s.category
    }));

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Chart Section - only if we have percentage data */}
            {chartData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Key Metrics Comparison</CardTitle>
                        <CardDescription>Visualizing percentage-based statistics found in the research</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-popover border rounded-lg p-3 shadow-lg">
                                                        <p className="font-semibold">{data.fullLabel}</p>
                                                        <p className="text-sm">Value: {data.value}%</p>
                                                        <p className="text-xs text-muted-foreground">{data.category}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Detailed Table Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Extracted Statistics</CardTitle>
                    <CardDescription>Detailed list of quantitative findings from the documents</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Category</TableHead>
                                <TableHead>Metric</TableHead>
                                <TableHead className="text-right">Value</TableHead>
                                <TableHead>Context</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {statistics.map((stat) => (
                                <TableRow key={stat.id}>
                                    <TableCell>
                                        <Badge variant="outline">{stat.category}</Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{stat.label}</TableCell>
                                    <TableCell className="text-right font-mono">
                                        {stat.value} {stat.unit}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm max-w-md truncate" title={stat.context}>
                                        "{stat.context}"
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
