export interface Project {
    id: string;
    title: string;
    description: string;
    status: 'idle' | 'processing' | 'completed' | 'error';
    lastUpdated: Date;
    documentCount: number;
    progress: number;
}

export interface Agent {
    id: string;
    name: string;
    status: 'idle' | 'pending' | 'running' | 'processing' | 'completed' | 'error';
    executionTime?: number;
    output?: string;
}

export interface QualityMetrics {
    novelty: number;
    cohesion: number;
    redundancy: number;
    completeness: number;
}

export interface ConceptNode {
    id: string;
    label: string;
    importance: number;
    cluster: number;
}

export interface ConceptEdge {
    source: string;
    target: string;
    weight: number;
}
