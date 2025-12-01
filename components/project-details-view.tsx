'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AgentPipeline } from '@/components/agent-pipeline';
import { QualityMetricsChart } from '@/components/quality-metrics-chart';
import { CitationChart } from '@/components/citation-chart';
import { WordCountTrend } from '@/components/word-count-trend';
import { ConceptNetwork } from '@/components/concept-network';
import { HypothesisTable } from '@/components/hypothesis-table';
import { TopicClusterHeatmap } from '@/components/topic-cluster-heatmap';
import { OutlineEditor } from '@/components/outline-editor';
import { PaperViewer } from '@/components/paper-viewer';
import { StatisticsViewer } from '@/components/statistics-viewer';
import { ChatWithResearch } from '@/components/chat-with-research';
import { ArrowLeft, RefreshCw, Download, FileText, Presentation, FileDown, ChevronDown } from 'lucide-react';
import { generateThemedPPT } from '@/lib/ppt-generator';
import {
    mockQualityMetrics,
    mockCitationData,
    mockWordCountTrend,
} from '@/lib/mock-data';

interface ProjectDetailsViewProps {
    project: any;
    onBack: () => void;
    onRefresh?: () => void;
}

export function ProjectDetailsView({ project, onBack, onRefresh }: ProjectDetailsViewProps) {
    const [activeTab, setActiveTab] = useState('overview');

    if (!project) return null;

    // Get the latest outline and presentation from agentRuns
    const getLatestAgentOutput = (agentName: string) => {
        const run = project.agentRuns?.find(
            (r: any) => r.agentName === agentName && r.status === 'completed' && r.output
        );
        return run ? JSON.parse(run.output) : null;
    };

    const outline = getLatestAgentOutput('outliner');
    const paper = getLatestAgentOutput('writer');
    const presentation = getLatestAgentOutput('presenter');

    const handleDownloadPPT = async () => {
        if (presentation && presentation.slides) {
            generateThemedPPT(presentation.slides, `${project.name}_Presentation`);
        } else {
            // Fetch from API if not in agent runs
            try {
                const response = await fetch(`/api/download/ppt/${project.id}`);
                const data = await response.json();
                if (data.slides) {
                    generateThemedPPT(data.slides, data.title || `${project.name}_Presentation`);
                }
            } catch (error) {
                console.error('Failed to download PPT:', error);
                alert('No presentation available yet. Please wait for the pipeline to complete.');
            }
        }
    };

    const handleExport = async (format: string) => {
        try {
            const response = await fetch(`/api/export/${format}/${project.id}`);
            if (!response.ok) {
                throw new Error('Export failed');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${project.name}.${format === 'latex' ? 'tex' : format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export. Please ensure the paper has been generated.');
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-muted">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-foreground">
                            {project.name}
                        </h1>
                        <p className="text-muted-foreground">
                            {project.description || 'Research Project Analysis'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {paper && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="default" size="sm" className="gap-2">
                                    <FileDown className="w-4 h-4" />
                                    Export Paper
                                    <ChevronDown className="w-3 h-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                                    <FileText className="w-4 h-4 mr-2" />
                                    Export as PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExport('latex')}>
                                    <FileText className="w-4 h-4 mr-2" />
                                    Export as LaTeX
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExport('docx')}>
                                    <FileText className="w-4 h-4 mr-2" />
                                    Export as DOCX
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExport('markdown')}>
                                    <FileText className="w-4 h-4 mr-2" />
                                    Export as Markdown
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    {presentation && (
                        <Button variant="outline" size="sm" onClick={handleDownloadPPT} className="gap-2">
                            <Presentation className="w-4 h-4" />
                            Download PPT
                        </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Pipeline Status */}
            <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-2xl font-serif font-semibold mb-6 flex items-center gap-2">
                    <span className="w-1 h-8 bg-chart-2 rounded-full" />
                    Pipeline Status
                </h2>
                <AgentPipeline
                    status={project.status}
                    progress={project.progress}
                    agentRuns={project.agentRuns}
                />
            </section>

            {/* Tabs for different views */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="outline">Outline</TabsTrigger>
                    <TabsTrigger value="paper">Paper</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="statistics">Statistics</TabsTrigger>
                    <TabsTrigger value="chat">Ask Questions</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <section>
                            <h2 className="text-2xl font-serif font-semibold mb-6 flex items-center gap-2">
                                <span className="w-1 h-8 bg-chart-4 rounded-full" />
                                Quality Metrics
                            </h2>
                            <QualityMetricsChart metrics={mockQualityMetrics} />
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-semibold mb-6 flex items-center gap-2">
                                <span className="w-1 h-8 bg-chart-5 rounded-full" />
                                Citation Analysis
                            </h2>
                            <CitationChart data={mockCitationData} />
                        </section>
                    </div>

                    <section>
                        <h2 className="text-2xl font-serif font-semibold mb-6 flex items-center gap-2">
                            <span className="w-1 h-8 bg-chart-1 rounded-full" />
                            Word Count Trend
                        </h2>
                        <WordCountTrend data={mockWordCountTrend} />
                    </section>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <section>
                            <h2 className="text-2xl font-serif font-semibold mb-6 flex items-center gap-2">
                                <span className="w-1 h-8 bg-chart-3 rounded-full" />
                                Concept Network
                            </h2>
                            <ConceptNetwork nodes={project.conceptNodes || []} />
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-semibold mb-6 flex items-center gap-2">
                                <span className="w-1 h-8 bg-chart-2 rounded-full" />
                                Generated Hypotheses
                            </h2>
                            <HypothesisTable hypotheses={project.hypotheses || []} />
                        </section>
                    </div>
                </TabsContent>

                {/* Outline Tab */}
                <TabsContent value="outline">
                    {outline ? (
                        <OutlineEditor outline={outline} readOnly={true} />
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>Outline will appear here once the outliner agent completes.</p>
                        </div>
                    )}
                </TabsContent>

                {/* Paper Tab */}
                <TabsContent value="paper">
                    {paper ? (
                        <PaperViewer paper={paper} />
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>Research paper will appear here once the writer agent completes.</p>
                        </div>
                    )}
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-8">
                    <TopicClusterHeatmap />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <QualityMetricsChart metrics={mockQualityMetrics} />
                        <CitationChart data={mockCitationData} />
                    </div>
                </TabsContent>

                {/* Statistics Tab */}
                <TabsContent value="statistics">
                    <StatisticsViewer statistics={project.statistics || []} />
                </TabsContent>

                {/* Chat Tab */}
                <TabsContent value="chat">
                    <ChatWithResearch projectId={project.id} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

