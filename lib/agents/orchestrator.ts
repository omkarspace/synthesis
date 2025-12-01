import { prisma } from '../prisma';
import { readerAgent } from './reader-agent';
import { summarizerAgent } from './summarizer-agent';
import { graphAgent } from './graph-agent';
import { hypothesisAgent } from './hypothesis-agent';
import { experimentAgent } from './experiment-agent';
import { writerAgent } from './writer-agent';
import { outlinerAgent } from './outliner-agent';
import { presenterAgent } from './presenter-agent';
import { reviewerAgent } from './reviewer-agent';
import { statisticsAgent } from './statistics-agent';

export class AgentOrchestrator {
    async runPipeline(projectId: string) {
        try {
            // Update project status
            await prisma.project.update({
                where: { id: projectId },
                data: { status: 'processing', progress: 0 },
            });

            // Get all documents for this project
            const documents = await prisma.document.findMany({
                where: { projectId },
            });

            if (documents.length === 0) {
                throw new Error('No documents found for project');
            }

            // Step 1: Reader Agent
            await this.updateProgress(projectId, 10, 'reader', 'running');
            const readerOutputs = [];
            for (const doc of documents) {
                if (doc.extractedText) {
                    const output = await readerAgent.process(doc.extractedText);
                    readerOutputs.push(output);
                }
            }
            await this.saveAgentRun(projectId, 'reader', 'completed', readerOutputs);
            await this.updateProgress(projectId, 20);

            // Step 2: Summarizer Agent
            await this.updateProgress(projectId, 30, 'summarizer', 'running');
            const summaries = [];
            for (const output of readerOutputs) {
                const summary = await summarizerAgent.process(output);
                summaries.push(summary);
            }
            await this.saveAgentRun(projectId, 'summarizer', 'completed', summaries);
            await this.updateProgress(projectId, 40);

            // Step 3: Graph Agent
            await this.updateProgress(projectId, 50, 'graph', 'running');
            const graph = await graphAgent.process(summaries);
            await this.saveAgentRun(projectId, 'graph', 'completed', graph);

            // Save concept nodes to database
            for (const node of graph.nodes) {
                await prisma.conceptNode.create({
                    data: {
                        projectId,
                        label: node.label,
                        importance: node.importance,
                        cluster: node.cluster,
                    },
                });
            }
            await this.updateProgress(projectId, 60);

            // Step 4: Hypothesis Agent
            await this.updateProgress(projectId, 70, 'hypothesis', 'running');
            const hypotheses = await hypothesisAgent.process(graph);
            await this.saveAgentRun(projectId, 'hypothesis', 'completed', hypotheses);

            // Save hypotheses to database
            for (const hyp of hypotheses) {
                await prisma.hypothesis.create({
                    data: {
                        projectId,
                        title: hyp.title,
                        description: hyp.description,
                        testability: hyp.testability,
                        novelty: hyp.novelty,
                        feasibility: hyp.feasibility,
                        category: hyp.category,
                    },
                });
            }
            await this.updateProgress(projectId, 80);

            // Step 4.5: Outliner Agent
            await this.updateProgress(projectId, 82, 'outliner', 'running');
            const outline = await outlinerAgent.process(summaries);
            await this.saveAgentRun(projectId, 'outliner', 'completed', outline);

            // Save outline to database
            await prisma.outline.create({
                data: {
                    projectId,
                    title: outline.title,
                    abstract: outline.abstract,
                    sections: JSON.stringify(outline.sections),
                },
            });
            await this.updateProgress(projectId, 85);

            // Step 4.8: Statistics Agent (NEW)
            await this.updateProgress(projectId, 86, 'statistics', 'running');
            // Combine summaries to give context for statistics extraction
            // Ideally we would use the full text, but summaries might be enough for high-level stats
            // Or we can use the readerOutputs which contain more text. 
            // Let's use readerOutputs sections joined together for better context.
            const fullTextForStats = readerOutputs.map(r =>
                Object.values(r.sections).join('\n')
            ).join('\n\n');

            const statistics = await statisticsAgent.process(fullTextForStats);
            await this.saveAgentRun(projectId, 'statistics', 'completed', statistics);

            // Save statistics to database
            if (statistics && Array.isArray(statistics)) {
                for (const stat of statistics) {
                    await prisma.statistic.create({
                        data: {
                            projectId,
                            category: stat.category,
                            label: stat.label,
                            value: Number(stat.value),
                            unit: stat.unit,
                            context: stat.context
                        }
                    });
                }
            }
            await this.updateProgress(projectId, 87);

            // Step 5: Experiment Agent
            await this.updateProgress(projectId, 88, 'experiment', 'running');
            const experiments = await experimentAgent.process(hypotheses);
            await this.saveAgentRun(projectId, 'experiment', 'completed', experiments);
            await this.updateProgress(projectId, 90);

            // Step 6: Writer Agent (Enhanced with outline)
            await this.updateProgress(projectId, 92, 'writer', 'running');
            const paper = await writerAgent.processWithOutline(
                outline,
                summaries,
                hypotheses,
                experiments
            );
            await this.saveAgentRun(projectId, 'writer', 'completed', paper);
            await this.updateProgress(projectId, 95);

            // Step 7: Reviewer Agent
            await this.updateProgress(projectId, 96, 'reviewer', 'running');
            const review = await reviewerAgent.process(paper.fullText || '', outline);
            await this.saveAgentRun(projectId, 'reviewer', 'completed', review);
            await this.updateProgress(projectId, 97);

            // Step 8: Presenter Agent
            await this.updateProgress(projectId, 98, 'presenter', 'running');
            const presentation = await presenterAgent.process(paper.fullText || '');
            await this.saveAgentRun(projectId, 'presenter', 'completed', presentation);

            // Save presentation to database
            await prisma.presentation.create({
                data: {
                    projectId,
                    title: presentation.title,
                    slides: JSON.stringify(presentation.slides),
                },
            });
            await this.updateProgress(projectId, 100);

            // Mark project as completed
            await prisma.project.update({
                where: { id: projectId },
                data: { status: 'completed', progress: 100 },
            });

            return { success: true, paper };
        } catch (error) {
            console.error('Pipeline Error:', error);
            await prisma.project.update({
                where: { id: projectId },
                data: { status: 'error' },
            });
            throw error;
        }
    }

    private async updateProgress(projectId: string, progress: number, agentName?: string, status?: string) {
        await prisma.project.update({
            where: { id: projectId },
            data: { progress },
        });

        if (agentName && status) {
            await prisma.agentRun.create({
                data: {
                    projectId,
                    agentName,
                    status,
                    startedAt: new Date(),
                },
            });
        }
    }

    private async saveAgentRun(projectId: string, agentName: string, status: string, output: any) {
        const run = await prisma.agentRun.findFirst({
            where: { projectId, agentName, status: 'running' },
            orderBy: { createdAt: 'desc' },
        });

        if (run) {
            await prisma.agentRun.update({
                where: { id: run.id },
                data: {
                    status,
                    output: JSON.stringify(output),
                    completedAt: new Date(),
                },
            });
        }
    }
}

export const orchestrator = new AgentOrchestrator();
