/**
 * Citation Extractor
 * Extracts citations from research papers in various formats
 */

interface Citation {
    authors: string[];
    title: string;
    year?: string;
    journal?: string;
    doi?: string;
    url?: string;
    rawText: string;
}

/**
 * Extract DOIs from text
 */
export function extractDOIs(text: string): string[] {
    const doiRegex = /10\.\d{4,9}\/[-._;()/:A-Z0-9]+/gi;
    const matches = text.match(doiRegex);
    return matches ? [...new Set(matches)] : [];
}

/**
 * Extract URLs from text
 */
export function extractURLs(text: string): string[] {
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    const matches = text.match(urlRegex);
    return matches ? [...new Set(matches)] : [];
}

/**
 * Extract citations in common formats (APA, MLA, Chicago)
 * This is a simplified version - real implementation would need more sophisticated parsing
 */
export function extractCitations(text: string): Citation[] {
    const citations: Citation[] = [];

    // Split by common reference markers
    const lines = text.split('\n');
    const referenceSection = lines.findIndex(line =>
        /^(references|bibliography|works cited)/i.test(line.trim())
    );

    if (referenceSection === -1) {
        return citations;
    }

    // Process lines after "References" section
    const referenceLines = lines.slice(referenceSection + 1);

    for (const line of referenceLines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.length < 20) continue;

        // Try to extract year
        const yearMatch = trimmed.match(/\((\d{4})\)|\b(\d{4})\b/);
        const year = yearMatch ? (yearMatch[1] || yearMatch[2]) : undefined;

        // Try to extract DOI
        const doiMatch = trimmed.match(/10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i);
        const doi = doiMatch ? doiMatch[0] : undefined;

        // Try to extract URL
        const urlMatch = trimmed.match(/https?:\/\/[^\s]+/i);
        const url = urlMatch ? urlMatch[0] : undefined;

        // Extract authors (simplified - assumes format: "LastName, F. M.")
        const authorMatch = trimmed.match(/^([A-Z][a-z]+,\s*[A-Z]\.(?:\s*[A-Z]\.)?(?:,?\s*&?\s*[A-Z][a-z]+,\s*[A-Z]\.(?:\s*[A-Z]\.)?)*)/);
        const authorsText = authorMatch ? authorMatch[1] : '';
        const authors = authorsText ? authorsText.split(/,?\s*&\s*/).map(a => a.trim()) : [];

        // Extract title (text between authors and year, or in quotes)
        const titleMatch = trimmed.match(/"([^"]+)"|'([^']+)'/) ||
            trimmed.match(/\.\s*([^.]+?)\s*\(\d{4}\)/);
        const title = titleMatch ? (titleMatch[1] || titleMatch[2] || titleMatch[1]) : trimmed.substring(0, 100);

        citations.push({
            authors,
            title: title.trim(),
            year,
            doi,
            url,
            rawText: trimmed
        });
    }

    return citations;
}

/**
 * Extract tables from text
 * Returns table data as arrays
 */
export function extractTables(text: string): Array<{ caption?: string; data: string[][] }> {
    const tables: Array<{ caption?: string; data: string[][] }> = [];

    // Look for markdown-style tables
    const tableRegex = /(\|[^\n]+\|\n)+/g;
    const matches = text.match(tableRegex);

    if (matches) {
        for (const match of matches) {
            const lines = match.trim().split('\n');
            const data: string[][] = [];

            for (const line of lines) {
                // Skip separator lines (e.g., |---|---|)
                if (/^\|[\s-:|]+\|$/.test(line)) continue;

                const cells = line.split('|')
                    .map(cell => cell.trim())
                    .filter(cell => cell.length > 0);

                if (cells.length > 0) {
                    data.push(cells);
                }
            }

            if (data.length > 0) {
                tables.push({ data });
            }
        }
    }

    return tables;
}

/**
 * Extract figures/images references from text
 */
export function extractFigures(text: string): Array<{ caption: string; reference: string }> {
    const figures: Array<{ caption: string; reference: string }> = [];

    // Look for figure captions
    const figureRegex = /Figure\s+(\d+)[:.]\s*([^\n]+)/gi;
    let match;

    while ((match = figureRegex.exec(text)) !== null) {
        figures.push({
            reference: `Figure ${match[1]}`,
            caption: match[2].trim()
        });
    }

    return figures;
}

/**
 * Build bibliography from citations
 */
export function buildBibliography(citations: Citation[], format: 'apa' | 'mla' | 'chicago' = 'apa'): string {
    let bibliography = '# References\n\n';

    citations.forEach((citation, index) => {
        if (format === 'apa') {
            // APA format: Authors. (Year). Title. Journal. DOI
            const authors = citation.authors.join(', ');
            const year = citation.year ? `(${citation.year})` : '';
            bibliography += `${index + 1}. ${authors} ${year}. ${citation.title}.`;
            if (citation.journal) bibliography += ` ${citation.journal}.`;
            if (citation.doi) bibliography += ` https://doi.org/${citation.doi}`;
            bibliography += '\n\n';
        } else {
            // Fallback to raw text
            bibliography += `${index + 1}. ${citation.rawText}\n\n`;
        }
    });

    return bibliography;
}
