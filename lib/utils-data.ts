// Helper function to convert API project to display format
export function convertProject(apiProject: any) {
    return {
        id: apiProject.id,
        title: apiProject.name,
        description: apiProject.description || '',
        status: apiProject.status as 'idle' | 'processing' | 'completed' | 'error',
        lastUpdated: new Date(apiProject.updatedAt),
        documentCount: apiProject._count?.documents || 0,
        progress: apiProject.progress,
    };
}

// Helper to get status badge variant
export function getStatusVariant(status: string) {
    switch (status) {
        case 'completed':
            return 'default' as const;
        case 'processing':
            return 'secondary' as const;
        case 'error':
            return 'destructive' as const;
        default:
            return 'outline' as const;
    }
}
