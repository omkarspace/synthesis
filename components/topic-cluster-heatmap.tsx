'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

interface TopicData {
    name: string;
    size: number;
    category: string;
    fill?: string;
}

interface TopicClusterHeatmapProps {
    topics?: TopicData[];
}

// Using CSS custom properties for chart colors
const COLORS = {
    'Machine Learning': 'var(--chart-1)',
    'Healthcare': 'var(--chart-5)',
    'Ethics': 'var(--chart-3)',
    'Data Science': 'var(--chart-4)',
    'AI Research': 'var(--destructive)',
    'Natural Language Processing': 'var(--chart-2)',
    'Computer Vision': 'var(--primary)',
    'Other': 'var(--muted-foreground)',
};

const defaultTopics: TopicData[] = [
    { name: 'Deep Learning Models', size: 25, category: 'Machine Learning' },
    { name: 'Neural Networks', size: 20, category: 'Machine Learning' },
    { name: 'Medical Imaging', size: 18, category: 'Healthcare' },
    { name: 'Clinical Trials', size: 15, category: 'Healthcare' },
    { name: 'AI Ethics', size: 12, category: 'Ethics' },
    { name: 'Bias Detection', size: 10, category: 'Ethics' },
    { name: 'Data Mining', size: 16, category: 'Data Science' },
    { name: 'Statistical Analysis', size: 14, category: 'Data Science' },
    { name: 'Transformers', size: 22, category: 'Natural Language Processing' },
    { name: 'Text Classification', size: 18, category: 'Natural Language Processing' },
];

export const TopicClusterHeatmap: React.FC<TopicClusterHeatmapProps> = ({ topics = defaultTopics }) => {
    // Add color based on category
    const enrichedTopics = topics.map(topic => ({
        ...topic,
        fill: COLORS[topic.category as keyof typeof COLORS] || COLORS.Other,
    }));

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-popover border rounded-lg p-3 shadow-lg">
                    <p className="font-semibold text-sm">{data.name}</p>
                    <p className="text-xs text-muted-foreground">Category: {data.category}</p>
                    <p className="text-xs text-muted-foreground">Papers: {data.size}</p>
                </div>
            );
        }
        return null;
    };

    // Group by category for legend
    const categories = Array.from(new Set(topics.map(t => t.category)));

    return (
        <Card className="animate-fadeIn">
            <CardHeader>
                <CardTitle>Topic Distribution</CardTitle>
                <CardDescription>Research topics clustered by category</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <Treemap
                            data={enrichedTopics}
                            dataKey="size"
                            aspectRatio={4 / 3}
                            stroke="var(--background)"
                        >
                            <Tooltip content={<CustomTooltip />} />
                        </Treemap>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="mt-4 flex flex-wrap gap-3">
                    {categories.map(category => (
                        <div key={category} className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: COLORS[category as keyof typeof COLORS] || COLORS.Other }}
                            />
                            <span className="text-sm text-muted-foreground">{category}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
