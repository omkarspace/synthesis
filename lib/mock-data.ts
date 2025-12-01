import { Project, Agent, QualityMetrics } from './types';

export const mockProjects: Project[] = [
    {
        id: '1',
        title: 'Multi-Agent Systems in Healthcare',
        description: 'Research on collaborative AI agents for medical diagnosis',
        status: 'completed',
        lastUpdated: new Date('2025-11-20'),
        documentCount: 5,
        progress: 100,
    },
    {
        id: '2',
        title: 'Quantum Computing Applications',
        description: 'Exploring quantum algorithms for optimization problems',
        status: 'processing',
        lastUpdated: new Date('2025-11-25'),
        documentCount: 3,
        progress: 65,
    },
    {
        id: '3',
        title: 'Natural Language Processing Advances',
        description: 'Novel approaches to contextual understanding',
        status: 'idle',
        lastUpdated: new Date('2025-11-18'),
        documentCount: 7,
        progress: 0,
    },
];

export const mockAgents: Agent[] = [
    { id: '1', name: 'Reader Agent', status: 'completed', executionTime: 2.3 },
    { id: '2', name: 'Summarizer Agent', status: 'completed', executionTime: 4.1 },
    { id: '3', name: 'Graph Agent', status: 'completed', executionTime: 3.7 },
    { id: '4', name: 'Hypothesis Agent', status: 'processing', executionTime: 5.2 },
    { id: '5', name: 'Experiment Agent', status: 'idle' },
    { id: '6', name: 'Paper Writer Agent', status: 'idle' },
];

export const mockQualityMetrics: QualityMetrics = {
    novelty: 78,
    cohesion: 85,
    redundancy: 15,
    completeness: 92,
};

export const mockCitationData = [
    { name: 'Smith et al. 2023', citations: 12 },
    { name: 'Johnson 2024', citations: 8 },
    { name: 'Chen et al. 2022', citations: 15 },
    { name: 'Williams 2023', citations: 6 },
    { name: 'Brown et al. 2024', citations: 10 },
];

export const mockWordCountTrend = [
    { draft: 'Draft 1', words: 2500 },
    { draft: 'Draft 2', words: 3200 },
    { draft: 'Draft 3', words: 4100 },
    { draft: 'Draft 4', words: 4800 },
    { draft: 'Current', words: 5200 },
];

export const mockConceptNodes = [
    { id: '1', label: 'Machine Learning', importance: 95, cluster: 0 },
    { id: '2', label: 'Neural Networks', importance: 88, cluster: 0 },
    { id: '3', label: 'Deep Learning', importance: 92, cluster: 0 },
    { id: '4', label: 'Data Processing', importance: 75, cluster: 1 },
    { id: '5', label: 'Feature Engineering', importance: 70, cluster: 1 },
    { id: '6', label: 'Model Training', importance: 85, cluster: 0 },
    { id: '7', label: 'Optimization', importance: 80, cluster: 2 },
    { id: '8', label: 'Validation', importance: 78, cluster: 2 },
    { id: '9', label: 'Deployment', importance: 65, cluster: 3 },
    { id: '10', label: 'Monitoring', importance: 60, cluster: 3 },
];

export const mockHypotheses = [
    {
        id: '1',
        title: 'Ensemble methods improve accuracy by 15% in medical diagnosis',
        testability: 92,
        novelty: 78,
        feasibility: 88,
        category: 'Healthcare',
    },
    {
        id: '2',
        title: 'Transfer learning reduces training time by 60% for small datasets',
        testability: 95,
        novelty: 65,
        feasibility: 90,
        category: 'Optimization',
    },
    {
        id: '3',
        title: 'Attention mechanisms enhance context understanding in NLP tasks',
        testability: 88,
        novelty: 85,
        feasibility: 82,
        category: 'NLP',
    },
    {
        id: '4',
        title: 'Federated learning maintains privacy while improving model performance',
        testability: 75,
        novelty: 92,
        feasibility: 70,
        category: 'Privacy',
    },
    {
        id: '5',
        title: 'Graph neural networks outperform CNNs for molecular property prediction',
        testability: 85,
        novelty: 88,
        feasibility: 78,
        category: 'Chemistry',
    },
    {
        id: '6',
        title: 'Self-supervised learning achieves 90% of supervised performance',
        testability: 90,
        novelty: 80,
        feasibility: 85,
        category: 'Optimization',
    },
];
