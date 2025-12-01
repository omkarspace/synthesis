import { useState, useEffect } from 'react';

export interface Project {
    id: string;
    name: string;
    description: string | null;
    status: string;
    progress: number;
    createdAt: string;
    updatedAt: string;
    documents: any[];
    _count: {
        documents: number;
    };
}

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/projects');
            if (!res.ok) throw new Error('Failed to fetch projects');
            const data = await res.json();
            setProjects(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
        // Removed polling - will only fetch on mount or manual refetch
    }, []);

    return { projects, loading, error, refetch: fetchProjects };
}
