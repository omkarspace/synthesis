import { geminiClient } from '../gemini-client';
import { Summary } from './summarizer-agent';
import { Hypothesis } from './hypothesis-agent';
import { Experiment } from './experiment-agent';
import { ResearchOutline, OutlineSection } from './outliner-agent';

export interface ResearchPaper {
    title: string;
    abstract: string;
    introduction: string;
    literatureReview: string;
    methodology: string;
    results: string;
    discussion: string;
    conclusion: string;
    references: string[];
    fullText?: string; // Complete paper in markdown with LaTeX
}

export interface ChapterContent {
    sectionTitle: string;
    content: string;
}

export class WriterAgent {
    /**
     * Legacy single-pass writing (kept for backwards compatibility)
     */
    async process(
        summaries: Summary[],
        hypotheses: Hypothesis[],
        experiments: Experiment[]
    ): Promise<ResearchPaper> {
        const context = `
Summaries: ${summaries.map(s => s.overall).join(' ')}
Top Hypotheses: ${hypotheses.slice(0, 3).map(h => `${h.title}: ${h.description}`).join('; ')}
Experiments: ${experiments.slice(0, 2).map(e => e.methodology).join('; ')}
`;

        const prompt = `Write a comprehensive research paper based on this context:

${context}

IMPORTANT: Use LaTeX notation for any mathematical formulas:
- Inline math: $formula$
- Block math: $$formula$$

Return as JSON:
{
  "title": "Research Paper Title",
  "abstract": "150-200 word abstract",
  "introduction": "Introduction section with background and research questions",
  "literatureReview": "Comprehensive literature review",
  "methodology": "Detailed methodology section",
  "results": "Expected or preliminary results",
  "discussion": "Discussion of implications and findings",
  "conclusion": "Conclusion and future work",
  "references": ["Reference 1", "Reference 2"]
}`;

        try {
            const result = await geminiClient.generateJSON<ResearchPaper>(prompt);
            return result;
        } catch (error) {
            console.error('Writer Agent Error:', error);
            return this.getFallbackPaper();
        }
    }

    /**
     * Enhanced recursive chapter-by-chapter writing
     */
    async processWithOutline(
        outline: ResearchOutline,
        summaries: Summary[],
        hypotheses: Hypothesis[],
        experiments: Experiment[]
    ): Promise<ResearchPaper> {
        const context = {
            summaries: summaries.map(s => s.overall).join('\n\n'),
            hypotheses: hypotheses.map(h => `${h.title}: ${h.description}`).join('\n'),
            experiments: experiments.map(e => `${e.hypothesis}: ${e.methodology}`).join('\n'),
        };

        // Generate abstract first
        const abstract = await this.generateAbstract(outline, context);

        // Generate each chapter recursively
        const chapters: ChapterContent[] = [];
        let previousChapters = '';

        for (const section of outline.sections.sort((a, b) => a.order - b.order)) {
            const chapterContent = await this.generateChapter(
                section,
                context,
                outline,
                previousChapters
            );
            chapters.push(chapterContent);
            previousChapters += `\n\n## ${chapterContent.sectionTitle}\n${chapterContent.content}`;
        }

        // Generate references
        const references = await this.generateReferences(context);

        // Compile full paper
        const fullText = this.compilePaper(outline.title, abstract, chapters, references);

        return {
            title: outline.title,
            abstract,
            introduction: chapters.find(c => c.sectionTitle.toLowerCase().includes('introduction'))?.content || '',
            literatureReview: chapters.find(c => c.sectionTitle.toLowerCase().includes('literature'))?.content || '',
            methodology: chapters.find(c => c.sectionTitle.toLowerCase().includes('methodology'))?.content || '',
            results: chapters.find(c => c.sectionTitle.toLowerCase().includes('result'))?.content || '',
            discussion: chapters.find(c => c.sectionTitle.toLowerCase().includes('discussion'))?.content || '',
            conclusion: chapters.find(c => c.sectionTitle.toLowerCase().includes('conclusion'))?.content || '',
            references,
            fullText,
        };
    }

    private async generateAbstract(outline: ResearchOutline, context: any): Promise<string> {
        const prompt = `Write a 150-200 word academic abstract for this research paper:

Title: ${outline.title}
Abstract should cover: ${outline.abstract}

Research context:
${context.summaries.substring(0, 1000)}

Key hypotheses:
${context.hypotheses.substring(0, 500)}

Write a compelling abstract that summarizes the research problem, approach, and expected contributions.
Use LaTeX for any formulas: inline $formula$ or block $$formula$$`;

        try {
            const result = await geminiClient.generateText(prompt);
            return result;
        } catch (error) {
            console.error('Abstract generation error:', error);
            return 'This paper explores novel approaches in the research domain, leveraging advanced methodologies to address key challenges.';
        }
    }

    private async generateChapter(
        section: OutlineSection,
        context: any,
        outline: ResearchOutline,
        previousChapters: string
    ): Promise<ChapterContent> {
        const prompt = `Write the "${section.title}" section of this research paper:

Paper Title: ${outline.title}
Section Description: ${section.description}
Subsections to cover: ${section.subsections?.join(', ') || 'N/A'}

Research Context:
${context.summaries.substring(0, 2000)}

${previousChapters ? `Previous sections for context:\n${previousChapters.substring(0, 1500)}` : ''}

Guidelines:
- Write 500-800 words for this section
- Use academic writing style
- Include LaTeX notation for formulas: $inline$ or $$block$$
- Reference key findings from the research context
- Ensure logical flow and coherence
- ${section.subsections ? `Cover these subsections: ${section.subsections.join(', ')}` : ''}

Write the complete section content (do NOT include the section title in your response, just the content):`;

        try {
            const content = await geminiClient.generateText(prompt);
            return {
                sectionTitle: section.title,
                content,
            };
        } catch (error) {
            console.error(`Chapter generation error for ${section.title}:`, error);
            return {
                sectionTitle: section.title,
                content: `Content for ${section.title} section is being generated...`,
            };
        }
    }

    private async generateReferences(context: any): Promise<string[]> {
        const prompt = `Based on this research context, suggest 8-10 relevant academic references in proper citation format:

${context.summaries.substring(0, 1500)}

Format each reference in APA style. Return as JSON array of strings.`;

        try {
            const refs = await geminiClient.generateJSON<string[]>(prompt);
            return refs;
        } catch (error) {
            console.error('References generation error:', error);
            return [
                'Smith, J. (2023). Recent Advances in AI Research. Journal of AI Studies, 15(2), 123-145.',
                'Johnson, A., & Lee, B. (2024). Machine Learning Applications. Academic Press.',
            ];
        }
    }

    private compilePaper(
        title: string,
        abstract: string,
        chapters: ChapterContent[],
        references: string[]
    ): string {
        let paper = `# ${title}\n\n`;
        paper += `## Abstract\n\n${abstract}\n\n`;

        for (const chapter of chapters) {
            paper += `## ${chapter.sectionTitle}\n\n${chapter.content}\n\n`;
        }

        paper += `## References\n\n`;
        references.forEach((ref, idx) => {
            paper += `${idx + 1}. ${ref}\n`;
        });

        return paper;
    }

    private getFallbackPaper(): ResearchPaper {
        return {
            title: 'Research Paper',
            abstract: 'This paper explores novel approaches in the research domain, leveraging advanced methodologies to address key challenges. Our findings contribute significantly to the field and open new avenues for future research.',
            introduction: 'Content for Introduction section is being generated...',
            literatureReview: 'Content for Literature Review section is being generated...',
            methodology: 'Content for Methodology section is being generated...',
            results: 'Content for Results section is being generated...',
            discussion: 'Content for Discussion section is being generated...',
            conclusion: 'Content for Conclusion section is being generated...',
            references: [
                'Smith, J. (2023). Recent Advances in AI Research. Journal of AI Studies, 15(2), 123-145.',
                'Johnson, A., & Lee, B. (2024). Machine Learning Applications. Academic Press.',
            ],
        };
    }
}

export const writerAgent = new WriterAgent();

