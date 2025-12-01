/**
 * Project Templates
 * Pre-defined templates for different types of research projects
 */

export interface ProjectTemplate {
    id: string;
    name: string;
    description: string;
    icon: string;
    defaultTags: string[];
    outlineStructure: {
        title: string;
        abstract: string;
        sections: Array<{
            title: string;
            description: string;
            order: number;
        }>;
    };
}

export const projectTemplates: ProjectTemplate[] = [
    {
        id: 'literature-review',
        name: 'Literature Review',
        description: 'Comprehensive review of existing research on a topic',
        icon: '📚',
        defaultTags: ['Literature Review', 'Survey'],
        outlineStructure: {
            title: 'Literature Review',
            abstract: 'A comprehensive review of existing literature on the research topic.',
            sections: [
                {
                    title: 'Introduction',
                    description: 'Background and scope of the review',
                    order: 1
                },
                {
                    title: 'Methodology',
                    description: 'Search strategy and selection criteria',
                    order: 2
                },
                {
                    title: 'Thematic Analysis',
                    description: 'Key themes and findings from the literature',
                    order: 3
                },
                {
                    title: 'Discussion',
                    description: 'Synthesis and critical analysis',
                    order: 4
                },
                {
                    title: 'Conclusion',
                    description: 'Summary and future research directions',
                    order: 5
                }
            ]
        }
    },
    {
        id: 'research-thesis',
        name: 'Research Thesis',
        description: 'Full thesis with original research and experiments',
        icon: '🎓',
        defaultTags: ['Thesis', 'Original Research'],
        outlineStructure: {
            title: 'Research Thesis',
            abstract: 'Original research thesis with experimental validation.',
            sections: [
                {
                    title: 'Introduction',
                    description: 'Research problem and objectives',
                    order: 1
                },
                {
                    title: 'Literature Review',
                    description: 'Review of related work',
                    order: 2
                },
                {
                    title: 'Methodology',
                    description: 'Research methods and experimental design',
                    order: 3
                },
                {
                    title: 'Results',
                    description: 'Experimental results and findings',
                    order: 4
                },
                {
                    title: 'Discussion',
                    description: 'Interpretation and implications',
                    order: 5
                },
                {
                    title: 'Conclusion',
                    description: 'Summary and future work',
                    order: 6
                }
            ]
        }
    },
    {
        id: 'survey-paper',
        name: 'Survey Paper',
        description: 'Systematic survey of a research area',
        icon: '📊',
        defaultTags: ['Survey', 'Analysis'],
        outlineStructure: {
            title: 'Survey Paper',
            abstract: 'A systematic survey of current research in the field.',
            sections: [
                {
                    title: 'Introduction',
                    description: 'Motivation and scope',
                    order: 1
                },
                {
                    title: 'Background',
                    description: 'Fundamental concepts and terminology',
                    order: 2
                },
                {
                    title: 'Classification and Taxonomy',
                    description: 'Categorization of approaches',
                    order: 3
                },
                {
                    title: 'Comparative Analysis',
                    description: 'Comparison of different methods',
                    order: 4
                },
                {
                    title: 'Open Challenges',
                    description: 'Current limitations and future directions',
                    order: 5
                },
                {
                    title: 'Conclusion',
                    description: 'Summary and recommendations',
                    order: 6
                }
            ]
        }
    },
    {
        id: 'case-study',
        name: 'Case Study',
        description: 'In-depth analysis of a specific case',
        icon: '🔍',
        defaultTags: ['Case Study', 'Analysis'],
        outlineStructure: {
            title: 'Case Study',
            abstract: 'Detailed case study analysis.',
            sections: [
                {
                    title: 'Introduction',
                    description: 'Case background and context',
                    order: 1
                },
                {
                    title: 'Case Description',
                    description: 'Detailed description of the case',
                    order: 2
                },
                {
                    title: 'Analysis',
                    description: 'In-depth analysis and findings',
                    order: 3
                },
                {
                    title: 'Discussion',
                    description: 'Implications and lessons learned',
                    order: 4
                },
                {
                    title: 'Conclusion',
                    description: 'Summary and recommendations',
                    order: 5
                }
            ]
        }
    },
    {
        id: 'technical-report',
        name: 'Technical Report',
        description: 'Detailed technical documentation',
        icon: '⚙️',
        defaultTags: ['Technical', 'Report'],
        outlineStructure: {
            title: 'Technical Report',
            abstract: 'Comprehensive technical documentation and analysis.',
            sections: [
                {
                    title: 'Executive Summary',
                    description: 'High-level overview',
                    order: 1
                },
                {
                    title: 'System Overview',
                    description: 'Architecture and components',
                    order: 2
                },
                {
                    title: 'Implementation Details',
                    description: 'Technical specifications',
                    order: 3
                },
                {
                    title: 'Evaluation',
                    description: 'Performance and testing results',
                    order: 4
                },
                {
                    title: 'Conclusion',
                    description: 'Summary and future enhancements',
                    order: 5
                }
            ]
        }
    }
];

/**
 * Get template by ID
 */
export function getTemplateById(id: string): ProjectTemplate | undefined {
    return projectTemplates.find(t => t.id === id);
}

/**
 * Create project from template
 */
export function createProjectFromTemplate(
    templateId: string,
    projectName: string,
    customDescription?: string
): {
    name: string;
    description: string;
    tags: string;
    outline: ProjectTemplate['outlineStructure'];
} | null {
    const template = getTemplateById(templateId);
    if (!template) return null;

    return {
        name: projectName,
        description: customDescription || template.description,
        tags: template.defaultTags.join(','),
        outline: template.outlineStructure
    };
}
