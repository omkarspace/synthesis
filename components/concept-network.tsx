'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ConceptNode {
    id: string;
    label: string;
    importance: number;
    cluster: number;
}

interface ConceptNetworkProps {
    nodes: ConceptNode[];
}

// Warm orange/amber theme colors
const CLUSTER_COLORS = [
    '#c2410c',   // Orange-700 (primary)
    '#0d9488',   // Teal-600 (secondary)
    '#f59e0b',   // Amber-500 (accent)
    '#8b5cf6',   // Violet-500
    '#6b7280',   // Gray-500
];

export function ConceptNetwork({ nodes }: ConceptNetworkProps) {
    const clusters = Array.from(new Set(nodes.map(n => n.cluster)));

    const getNodeSize = (importance: number) => {
        if (importance > 80) return 'w-16 h-16 text-sm';
        if (importance > 60) return 'w-14 h-14 text-xs';
        if (importance > 40) return 'w-12 h-12 text-xs';
        return 'w-10 h-10 text-xs';
    };

    return (
        <Card className="shadow-premium animate-fadeIn">
            <CardHeader>
                <CardTitle>Concept Network</CardTitle>
                <CardDescription>Research concept relationships and clusters</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Legend */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {clusters.map((cluster, idx) => (
                        <Badge key={cluster} variant="outline" className="gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: CLUSTER_COLORS[idx % CLUSTER_COLORS.length] }}
                            />
                            Cluster {cluster}
                        </Badge>
                    ))}
                </div>

                {/* Network Visualization */}
                <div className="relative h-96 bg-muted/20 rounded-lg border overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="relative w-full h-full">
                            {nodes.map((node, index) => {
                                // Circular layout
                                const angle = (index / nodes.length) * 2 * Math.PI;
                                const radius = 35; // percentage
                                const x = 50 + radius * Math.cos(angle);
                                const y = 50 + radius * Math.sin(angle);

                                return (
                                    <div
                                        key={node.id}
                                        className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-scaleIn"
                                        style={{
                                            left: `${x}%`,
                                            top: `${y}%`,
                                            animationDelay: `${index * 0.05}s`,
                                        }}
                                    >
                                        <div
                                            className={`
                                                ${getNodeSize(node.importance)}
                                                rounded-full flex items-center justify-center
                                                font-semibold text-white shadow-lg
                                                hover:scale-110 transition-transform cursor-pointer
                                                hover:shadow-xl
                                            `}
                                            style={{
                                                backgroundColor: CLUSTER_COLORS[node.cluster % CLUSTER_COLORS.length]
                                            }}
                                            title={`${node.label} (Importance: ${node.importance})`}
                                        >
                                            <span className="text-center px-1 truncate">
                                                {node.label.split(' ')[0]}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Connection lines (simplified) */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                                {nodes.map((node, i) => {
                                    const nextNode = nodes[(i + 1) % nodes.length];
                                    const angle1 = (i / nodes.length) * 2 * Math.PI;
                                    const angle2 = ((i + 1) / nodes.length) * 2 * Math.PI;
                                    const radius = 35;

                                    const x1 = 50 + radius * Math.cos(angle1);
                                    const y1 = 50 + radius * Math.sin(angle1);
                                    const x2 = 50 + radius * Math.cos(angle2);
                                    const y2 = 50 + radius * Math.sin(angle2);

                                    return (
                                        <line
                                            key={`line-${i}`}
                                            x1={`${x1}%`}
                                            y1={`${y1}%`}
                                            x2={`${x2}%`}
                                            y2={`${y2}%`}
                                            stroke="currentColor"
                                            strokeWidth="1"
                                            className="text-border"
                                        />
                                    );
                                })}
                            </svg>
                        </div>
                    </div>

                    {/* Center label */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-background/80 backdrop-blur-sm rounded-full w-24 h-24 flex items-center justify-center border-2 border-primary/20">
                            <span className="text-xs font-semibold text-center text-muted-foreground">
                                Research<br />Concepts
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <p className="text-2xl font-bold font-mono" style={{ color: CLUSTER_COLORS[0] }}>
                            {nodes.length}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Concepts</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <p className="text-2xl font-bold font-mono" style={{ color: CLUSTER_COLORS[1] }}>
                            {clusters.length}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Clusters</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <p className="text-2xl font-bold font-mono" style={{ color: CLUSTER_COLORS[2] }}>
                            {(() => {
                                if (!nodes || nodes.length === 0) return 0;
                                const total = nodes.reduce((sum, n) => sum + (n?.importance || 0), 0);
                                const avg = total / nodes.length;
                                return Number.isFinite(avg) ? Math.round(avg) : 0;
                            })()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Avg Importance</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
