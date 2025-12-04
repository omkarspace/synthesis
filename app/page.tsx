'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { ProjectCard } from '@/components/project-card';
import { AgentPipeline } from '@/components/agent-pipeline';
import { QualityMetricsChart } from '@/components/quality-metrics-chart';
import { CitationChart } from '@/components/citation-chart';
import { WordCountTrend } from '@/components/word-count-trend';
import { ConceptNetwork } from '@/components/concept-network';
import { HypothesisTable } from '@/components/hypothesis-table';
import { DocumentTypeChart } from '@/components/document-type-chart';
import { FileUpload } from '@/components/file-upload';
import { NewProjectDialog } from '@/components/new-project-dialog';
import { ProjectDetailsView } from '@/components/project-details-view';
import { AgentActivityFeed } from '@/components/agent-activity-feed';
import { ProjectInsights } from '@/components/project-insights';
import { AgentPerformanceMetrics } from '@/components/agent-performance-metrics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useProjects } from '@/hooks/use-projects';
import { useAnalytics } from '@/hooks/use-analytics';
import {
  Sparkles,
  FolderOpen,
  BarChart3,
  Settings as SettingsIcon,
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  Archive,
  Bell,
  User,
  Lock,
  Palette,
  Globe,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  FileText
} from 'lucide-react';

type TabType = 'dashboard' | 'projects' | 'analytics' | 'settings';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const { projects, loading, error, refetch } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedProjectData, setSelectedProjectData] = useState<any>(null);
  const [dashboardView, setDashboardView] = useState<'list' | 'details'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Fetch selected project details with polling
  useEffect(() => {
    if (!selectedProjectId) return;

    const fetchDetails = () => {
      fetch(`/api/projects/${selectedProjectId}`)
        .then(res => res.json())
        .then(data => setSelectedProjectData(data))
        .catch(console.error);
    };

    fetchDetails();

    // Poll only if processing
    const interval = setInterval(() => {
      if (selectedProjectData?.status === 'processing') {
        fetchDetails();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedProjectId, selectedProjectData?.status]);

  // Auto-select first project - REMOVED to show list first
  // useEffect(() => {
  //   if (projects.length > 0 && !selectedProjectId) {
  //     setSelectedProjectId(projects[0].id);
  //   }
  // }, [projects, selectedProjectId]);

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    setDashboardView('details');
  };

  const handleBackToDashboard = () => {
    setDashboardView('list');
    setSelectedProjectId(null);
    setSelectedProjectData(null);
  };

  // Dashboard Content
  const DashboardContent = () => (
    <div className="space-y-8">
      {/* Dashboard Views */}
      {dashboardView === 'list' ? (
        <>
          {/* Header with Gradient */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-chart-3/10 p-8 border animate-fadeIn">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-8 h-8 text-primary" />
                  <h1 className="text-4xl font-serif font-bold text-foreground">
                    Dashboard
                  </h1>
                </div>
                <Button variant="outline" size="sm" onClick={refetch} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>
              <p className="text-muted-foreground text-lg">
                Manage your AI-powered research paper generation projects
              </p>
            </div>
          </div>

          {/* Enhanced Dashboard Widgets */}
          {projects.length > 0 && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fadeIn" style={{ animationDelay: '0.15s' }}>
              <AgentActivityFeed maxItems={10} />
              <AgentPerformanceMetrics />
            </div>
          )}

          {/* Projects Grid */}
          <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-serif font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-primary rounded-full" />
              Your Projects
            </h2>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading projects...</span>
              </div>
            )}

            {error && (
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    <div>
                      <p className="font-semibold text-destructive">Error loading projects</p>
                      <p className="text-sm text-muted-foreground">{error}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!loading && !error && projects.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first project to get started with AI research paper generation
                  </p>
                  <Button onClick={() => setIsNewProjectOpen(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                </CardContent>
              </Card>
            )}

            {!loading && !error && projects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => {
                  const displayProject = {
                    id: project.id,
                    title: project.name,
                    description: project.description || '',
                    status: project.status as any,
                    lastUpdated: new Date(project.updatedAt),
                    documentCount: project._count?.documents || 0,
                    progress: project.progress,
                  };

                  return (
                    <div key={project.id} style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                      <ProjectCard
                        project={displayProject}
                        onClick={() => handleProjectClick(project.id)}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      ) : (
        <ProjectDetailsView
          project={selectedProjectData}
          onBack={handleBackToDashboard}
          onRefresh={() => {
            const fetchDetails = () => {
              fetch(`/api/projects/${selectedProjectId}`)
                .then(res => res.json())
                .then(data => setSelectedProjectData(data))
                .catch(console.error);
            };
            fetchDetails();
          }}
        />
      )}
    </div>
  );

  // Projects Content
  const ProjectsContent = () => (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2 flex items-center gap-3">
            <FolderOpen className="w-10 h-10 text-primary" />
            Projects
          </h1>
          <p className="text-muted-foreground">Manage all your research paper projects</p>
        </div>
        <Button className="gap-2">
          <Upload className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="idle">Idle</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="error">Error</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      <div className="grid grid-cols-1 gap-4">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading projects...</span>
          </div>
        )}

        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-6">
              <p className="text-destructive">Error loading projects: {error}</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && projects.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No projects found.</p>
              <Button onClick={() => setIsNewProjectOpen(true)}>
                Create Project
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && !error && projects
          .filter(project => {
            // Search filter
            if (searchQuery && !project.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
              !project.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
              return false;
            }
            // Status filter
            if (filterStatus !== 'all' && project.status !== filterStatus) {
              return false;
            }
            return true;
          })
          .map((project, index) => {
            const displayProject = {
              id: project.id,
              title: project.name,
              description: project.description || '',
              status: project.status as any,
              lastUpdated: new Date(project.updatedAt),
              documentCount: project._count?.documents || 0,
              progress: project.progress,
            };

            return (
              <Card key={project.id} className="hover-lift transition-smooth animate-slideIn cursor-pointer" style={{ animationDelay: `${index * 0.1}s` }} onClick={() => handleProjectClick(project.id)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{displayProject.title}</h3>
                        <Badge variant={displayProject.status === 'completed' ? 'default' : displayProject.status === 'processing' ? 'secondary' : 'outline'}>
                          {displayProject.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{displayProject.description}</p>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono">{displayProject.lastUpdated.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FolderOpen className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono">{displayProject.documentCount} documents</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono">{displayProject.progress}% complete</span>
                        </div>
                      </div>

                      <Progress value={displayProject.progress} className="h-2" />
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          await fetch(`/api/projects/${project.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ archived: true })
                          });
                          refetch();
                        } catch (error) {
                          console.error('Failed to archive:', error);
                        }
                      }}>
                        <Archive className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this project?')) {
                          fetch(`/api/projects/${project.id}`, { method: 'DELETE' })
                            .then(() => refetch());
                        }
                      }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
      </div>
    </div>
  );

  // Analytics Content
  const AnalyticsContent = () => {
    const { data: analytics, loading: analyticsLoading, error: analyticsError } = useAnalytics();

    if (analyticsLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      );
    }

    if (analyticsError || !analytics) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <p className="text-destructive">Failed to load analytics</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2 flex items-center gap-3">
            <BarChart3 className="w-10 h-10 text-primary" />
            Analytics
          </h1>
          <p className="text-muted-foreground">Comprehensive insights across all projects</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="animate-scaleIn">
            <CardHeader className="pb-3">
              <CardDescription>Total Projects</CardDescription>
              <CardTitle className="text-4xl font-mono">{analytics.totalProjects}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FolderOpen className="w-4 h-4 text-primary" />
                <span>Active research</span>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scaleIn" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-3">
              <CardDescription>Total Documents</CardDescription>
              <CardTitle className="text-4xl font-mono">{analytics.totalDocuments}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4 text-chart-2" />
                <span>Processed files</span>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scaleIn" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-3">
              <CardDescription>Avg Quality Score</CardDescription>
              <CardTitle className="text-4xl font-mono">{analytics.avgQuality}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-chart-4" />
                <span>Based on hypotheses</span>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scaleIn" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="pb-3">
              <CardDescription>Research Velocity</CardDescription>
              <CardTitle className="text-4xl font-mono">High</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-secondary" />
                <span>Avg per paper</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CitationChart data={analytics.citationData} />
          <WordCountTrend data={analytics.wordCountTrend} />
          <QualityMetricsChart metrics={analytics.qualityMetrics} />
          <DocumentTypeChart />
          <ConceptNetwork nodes={analytics.conceptNodes} />
        </div>
      </div>
    );
  };

  // Settings Content
  const SettingsContent = () => (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-serif font-bold mb-2 flex items-center gap-3">
          <SettingsIcon className="w-10 h-10 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground">Customize your research assistant</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Full Name</label>
              <input type="text" placeholder="John Doe" className="w-full px-3 py-2 bg-background border rounded-lg" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <input type="email" placeholder="john@example.com" className="w-full px-3 py-2 bg-background border rounded-lg" />
            </div>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize the look and feel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Theme</label>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1">Light</Button>
              <Button variant="outline" className="flex-1">Dark</Button>
              <Button variant="outline" className="flex-1">System</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>Configure notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {['Project completion', 'Agent errors', 'Weekly summary'].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <span className="text-sm">{item}</span>
              <input type="checkbox" className="w-4 h-4" defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* API Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            API Configuration
          </CardTitle>
          <CardDescription>Configure AI model settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">API Provider</label>
            <select className="w-full px-3 py-2 bg-background border rounded-lg">
              <option>Gemini API</option>
              <option>OpenAI</option>
              <option>Anthropic</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">API Key</label>
            <input type="password" placeholder="••••••••••••••••" className="w-full px-3 py-2 bg-background border rounded-lg" />
          </div>
          <Button>Update API Settings</Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security
          </CardTitle>
          <CardDescription>Manage security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Two-Factor Authentication
          </Button>
          <Button variant="destructive" className="w-full justify-start">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        onNewProject={() => setIsNewProjectOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {activeTab === 'dashboard' && <DashboardContent />}
          {activeTab === 'projects' && <ProjectsContent />}
          {activeTab === 'analytics' && <AnalyticsContent />}
          {activeTab === 'settings' && <SettingsContent />}

          <div className="h-8" />
        </div>
      </main>

      {/* New Project Dialog */}
      <NewProjectDialog
        open={isNewProjectOpen}
        onOpenChange={setIsNewProjectOpen}
      />
    </div>
  );
}
