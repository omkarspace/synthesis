import { useState, useEffect } from 'react';

export interface AnalyticsData {
    totalProjects: number;
    totalDocuments: number;
    avgQuality: number;
    qualityMetrics: {
        novelty: number;
        cohesion: number;
        redundancy: number;
        completeness: number;
    };
    conceptNodes: Array<{
        id: string;
        label: string;
        importance: number;
        cluster: number;
    }>;
    wordCountTrend: Array<{
        draft: string;
        words: number;
    }>;
    citationData: Array<{
        name: string;
        citations: number;
    }>;
}

export function useAnalytics() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/analytics');
            if (!response.ok) throw new Error('Failed to fetch analytics');
            const result = await response.json();
            setData(result);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    return { data, loading, error, refetch: fetchAnalytics };
}
