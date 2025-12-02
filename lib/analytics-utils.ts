import { Project } from '@/hooks/use-projects';

export interface QualityMetrics {
    novelty: number;
    cohesion: number;
    redundancy: number;
    completeness: number;
}

export interface ChartData {
    name: string;
    value?: number;
    words?: number;
    citations?: number;
    [key: string]: any;
}

export function calculateProjectMetrics(project: any): QualityMetrics {
    if (!project || !project.hypotheses || project.hypotheses.length === 0) {
        return {
            novelty: 0,
            cohesion: 0,
            redundancy: 0,
            completeness: project?.progress || 0
        };
    }

    let totalNovelty = 0;
    let totalFeasibility = 0;
    let totalTestability = 0;

    project.hypotheses.forEach((h: any) => {
        totalNovelty += h.novelty || 0;
        totalFeasibility += h.feasibility || 0;
        totalTestability += h.testability || 0;
    });

    const count = project.hypotheses.length;

    return {
        novelty: Math.round(totalNovelty / count),
        cohesion: Math.round(totalFeasibility / count), // Mapping feasibility to cohesion
        redundancy: Math.round(100 - (totalTestability / count)), // Inverse mapping
        completeness: project.progress || 0
    };
}

export function calculateWordCountTrend(project: any): ChartData[] {
    if (!project || !project.documents) return [];

    // Group by date (simplified to just show documents as data points for now, or cumulative)
    // A better approach for a single project is to show growth over time based on document uploads
    // or agent generation steps.

    // Let's try to extract word counts from agent runs if available (writer output), 
    // otherwise fallback to document estimates.

    const trend: ChartData[] = [];

    // 1. Initial documents
    project.documents.forEach((doc: any) => {
        const date = new Date(doc.createdAt).toLocaleDateString();
        const words = Math.round(doc.filesize / 1024 * 150); // Estimate
        trend.push({ name: 'Upload', words, date: doc.createdAt });
    });

    // 2. Agent outputs (Reader, Summarizer, Writer)
    if (project.agentRuns) {
        project.agentRuns.forEach((run: any) => {
            if (run.status === 'completed' && run.output) {
                let words = 0;
                try {
                    const output = JSON.parse(run.output);
                    if (run.agentName === 'writer' && output.fullText) {
                        words = output.fullText.split(/\s+/).length;
                    } else if (run.agentName === 'summarizer') {
                        // Summary length
                        words = JSON.stringify(output).split(/\s+/).length;
                    }

                    if (words > 0) {
                        trend.push({
                            name: run.agentName.charAt(0).toUpperCase() + run.agentName.slice(1),
                            words,
                            date: run.completedAt
                        });
                    }
                } catch (e) {
                    // ignore parse errors
                }
            }
        });
    }

    // Sort by date
    return trend.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(({ name, words }) => ({ name, words }));
}

export function extractCitations(project: any): ChartData[] {
    // Extract citations from Reader agent runs
    const citationMap: Record<string, number> = {};

    if (project.agentRuns) {
        project.agentRuns.forEach((run: any) => {
            if (run.agentName === 'reader' && run.status === 'completed' && run.output) {
                try {
                    const output = JSON.parse(run.output);
                    if (output.citations && Array.isArray(output.citations)) {
                        output.citations.forEach((cit: string) => {
                            // Simple extraction of year or source
                            // Assuming citation format like "Author (Year)" or similar
                            const yearMatch = cit.match(/\b(19|20)\d{2}\b/);
                            const key = yearMatch ? yearMatch[0] : 'Unknown';
                            citationMap[key] = (citationMap[key] || 0) + 1;
                        });
                    }
                } catch (e) {
                    // ignore
                }
            }
        });
    }

    return Object.entries(citationMap)
        .map(([name, citations]) => ({ name, citations }))
        .sort((a, b) => a.name.localeCompare(b.name));
}
