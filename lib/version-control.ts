/**
 * Version Control for Research Papers
 * Track changes, create versions, and manage paper history
 */

export interface PaperVersion {
    id: string;
    projectId: string;
    version: number;
    content: string;
    title: string;
    createdAt: Date;
    createdBy?: string;
    changeDescription?: string;
    diff?: string;
}

/**
 * Simple diff generator
 * For production, consider using a library like 'diff' or 'diff-match-patch'
 */
export function generateDiff(oldText: string, newText: string): string {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    const diff: string[] = [];

    const maxLength = Math.max(oldLines.length, newLines.length);

    for (let i = 0; i < maxLength; i++) {
        const oldLine = oldLines[i] || '';
        const newLine = newLines[i] || '';

        if (oldLine !== newLine) {
            if (oldLine && !newLine) {
                diff.push(`- ${oldLine}`);
            } else if (!oldLine && newLine) {
                diff.push(`+ ${newLine}`);
            } else {
                diff.push(`- ${oldLine}`);
                diff.push(`+ ${newLine}`);
            }
        } else if (oldLine) {
            diff.push(`  ${oldLine}`);
        }
    }

    return diff.join('\n');
}

/**
 * Calculate similarity between two texts (simple word-based)
 */
export function calculateSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));

    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
}

/**
 * Extract change summary from diff
 */
export function summarizeChanges(diff: string): {
    additions: number;
    deletions: number;
    modifications: number;
} {
    const lines = diff.split('\n');
    let additions = 0;
    let deletions = 0;

    for (const line of lines) {
        if (line.startsWith('+ ')) additions++;
        if (line.startsWith('- ')) deletions++;
    }

    return {
        additions,
        deletions,
        modifications: Math.min(additions, deletions)
    };
}

/**
 * Version control manager (in-memory for now)
 * For production, store versions in database
 */
class VersionControlManager {
    private versions: Map<string, PaperVersion[]> = new Map();

    /**
     * Create a new version
     */
    createVersion(
        projectId: string,
        content: string,
        title: string,
        changeDescription?: string
    ): PaperVersion {
        const versions = this.versions.get(projectId) || [];
        const latestVersion = versions[versions.length - 1];

        const newVersion: PaperVersion = {
            id: `${projectId}-v${versions.length + 1}`,
            projectId,
            version: versions.length + 1,
            content,
            title,
            createdAt: new Date(),
            changeDescription,
            diff: latestVersion ? generateDiff(latestVersion.content, content) : undefined
        };

        versions.push(newVersion);
        this.versions.set(projectId, versions);

        return newVersion;
    }

    /**
     * Get all versions for a project
     */
    getVersions(projectId: string): PaperVersion[] {
        return this.versions.get(projectId) || [];
    }

    /**
     * Get specific version
     */
    getVersion(projectId: string, version: number): PaperVersion | undefined {
        const versions = this.versions.get(projectId) || [];
        return versions.find(v => v.version === version);
    }

    /**
     * Get latest version
     */
    getLatestVersion(projectId: string): PaperVersion | undefined {
        const versions = this.versions.get(projectId) || [];
        return versions[versions.length - 1];
    }

    /**
     * Compare two versions
     */
    compareVersions(
        projectId: string,
        version1: number,
        version2: number
    ): { diff: string; similarity: number } | null {
        const v1 = this.getVersion(projectId, version1);
        const v2 = this.getVersion(projectId, version2);

        if (!v1 || !v2) return null;

        return {
            diff: generateDiff(v1.content, v2.content),
            similarity: calculateSimilarity(v1.content, v2.content)
        };
    }

    /**
     * Rollback to a specific version
     */
    rollback(projectId: string, targetVersion: number): PaperVersion | null {
        const version = this.getVersion(projectId, targetVersion);
        if (!version) return null;

        // Create a new version with the content from the target version
        return this.createVersion(
            projectId,
            version.content,
            version.title,
            `Rolled back to version ${targetVersion}`
        );
    }

    /**
     * Delete all versions for a project
     */
    deleteProject(projectId: string): void {
        this.versions.delete(projectId);
    }
}

// Singleton instance
export const versionControl = new VersionControlManager();
