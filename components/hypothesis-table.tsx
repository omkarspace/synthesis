'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Star, Download, FlaskConical } from 'lucide-react';

interface Hypothesis {
    id: string;
    title: string;
    testability: number;
    novelty: number;
    feasibility: number;
    category: string;
}

interface HypothesisTableProps {
    hypotheses: Hypothesis[];
}

type SortField = 'testability' | 'novelty' | 'feasibility';

export function HypothesisTable({ hypotheses }: HypothesisTableProps) {
    const [sortField, setSortField] = useState<SortField>('novelty');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [filter, setFilter] = useState<string>('all');

    const categories = ['all', ...Array.from(new Set(hypotheses.map(h => h.category)))];

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const getStars = (value: number) => {
        const stars = Math.round((value / 100) * 5);
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/20'
                    }`}
            />
        ));
    };

    const downloadCSV = () => {
        const headers = ['ID', 'Title', 'Category', 'Testability', 'Novelty', 'Feasibility'];
        const rows = hypotheses.map(h => [
            h.id,
            `"${h.title.replace(/"/g, '""')}"`,
            h.category,
            h.testability,
            h.novelty,
            h.feasibility
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'hypotheses_export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredAndSorted = hypotheses
        .filter(h => filter === 'all' || h.category === filter)
        .sort((a, b) => {
            const aVal = a[sortField];
            const bVal = b[sortField];
            return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        });

    return (
        <Card className="shadow-premium animate-fadeIn border-muted/40">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <FlaskConical className="w-5 h-5 text-primary" />
                            Hypothesis Ranking
                        </CardTitle>
                        <CardDescription>AI-generated research hypotheses ranked by potential</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={downloadCSV} className="gap-2">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {categories.map(cat => (
                        <Badge
                            key={cat}
                            variant={filter === cat ? 'default' : 'outline'}
                            className={`cursor-pointer transition-all hover:scale-105 ${filter === cat ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                            onClick={() => setFilter(cat)}
                        >
                            {cat === 'all' ? 'All Categories' : cat}
                        </Badge>
                    ))}
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-3">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 pb-3 border-b font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                        <div className="col-span-5 pl-2">Hypothesis</div>
                        <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('testability')}>
                            Testability
                            <ArrowUpDown className="w-3 h-3" />
                        </div>
                        <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('novelty')}>
                            Novelty
                            <ArrowUpDown className="w-3 h-3" />
                        </div>
                        <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('feasibility')}>
                            Feasibility
                            <ArrowUpDown className="w-3 h-3" />
                        </div>
                        <div className="col-span-1 text-center">Score</div>
                    </div>

                    {/* Table Rows */}
                    <div className="space-y-2">
                        {filteredAndSorted.map((hypothesis, index) => (
                            <div
                                key={hypothesis.id}
                                className="grid grid-cols-12 gap-4 p-3 rounded-lg border border-transparent hover:border-primary/20 hover:bg-muted/30 transition-all duration-200 animate-slideIn group"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="col-span-5">
                                    <p className="font-medium text-sm leading-snug group-hover:text-primary transition-colors">{hypothesis.title}</p>
                                    <Badge variant="secondary" className="mt-1.5 text-[10px] h-5 px-1.5 font-normal bg-secondary/50 text-secondary-foreground/70">
                                        {hypothesis.category}
                                    </Badge>
                                </div>

                                <div className="col-span-2 flex flex-col justify-center">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-muted-foreground">Score</span>
                                        <span className="font-mono">{hypothesis.testability}%</span>
                                    </div>
                                    <Progress value={hypothesis.testability} className="h-1.5 bg-muted" />
                                </div>

                                <div className="col-span-2 flex flex-col justify-center">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-muted-foreground">Score</span>
                                        <span className="font-mono">{hypothesis.novelty}%</span>
                                    </div>
                                    <Progress value={hypothesis.novelty} className="h-1.5 bg-muted" />
                                </div>

                                <div className="col-span-2 flex flex-col justify-center">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-muted-foreground">Score</span>
                                        <span className="font-mono">{hypothesis.feasibility}%</span>
                                    </div>
                                    <Progress value={hypothesis.feasibility} className="h-1.5 bg-muted" />
                                </div>

                                <div className="col-span-1 flex items-center justify-center">
                                    <div className="flex gap-0.5" title={`Average Score: ${Math.round((hypothesis.testability + hypothesis.novelty + hypothesis.feasibility) / 3)}%`}>
                                        {getStars((hypothesis.testability + hypothesis.novelty + hypothesis.feasibility) / 3)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {filteredAndSorted.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                        <FlaskConical className="w-10 h-10 mx-auto mb-3 opacity-20" />
                        <p>No hypotheses found for this category</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

