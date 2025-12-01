import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Simple in-memory vector store using embeddings
 * For production, consider using Pinecone, Weaviate, or ChromaDB
 */

interface VectorDocument {
    id: string;
    content: string;
    embedding: number[];
    metadata: {
        projectId: string;
        documentId?: string;
        type: 'document' | 'section' | 'paragraph';
        title?: string;
    };
}

class SimpleVectorStore {
    private documents: VectorDocument[] = [];
    private embeddingModel;

    constructor() {
        this.embeddingModel = genAI.getGenerativeModel({ model: 'embedding-001' });
    }

    /**
     * Generate embedding for text using Gemini
     */
    async generateEmbedding(text: string): Promise<number[]> {
        try {
            const result = await this.embeddingModel.embedContent(text);
            return result.embedding.values;
        } catch (error) {
            console.error('Embedding generation error:', error);
            throw error;
        }
    }

    /**
     * Add document to vector store
     */
    async addDocument(doc: Omit<VectorDocument, 'embedding'>): Promise<void> {
        const embedding = await this.generateEmbedding(doc.content);
        this.documents.push({
            ...doc,
            embedding
        });
    }

    /**
     * Add multiple documents in batch
     */
    async addDocuments(docs: Omit<VectorDocument, 'embedding'>[]): Promise<void> {
        for (const doc of docs) {
            await this.addDocument(doc);
        }
    }

    /**
     * Cosine similarity between two vectors
     */
    private cosineSimilarity(a: number[], b: number[]): number {
        const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
        const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
        const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
        return dotProduct / (magnitudeA * magnitudeB);
    }

    /**
     * Search for similar documents
     */
    async search(
        query: string,
        options: {
            projectId?: string;
            topK?: number;
            minSimilarity?: number;
        } = {}
    ): Promise<Array<VectorDocument & { similarity: number }>> {
        const { projectId, topK = 5, minSimilarity = 0.5 } = options;

        // Generate query embedding
        const queryEmbedding = await this.generateEmbedding(query);

        // Filter by project if specified
        let candidates = this.documents;
        if (projectId) {
            candidates = candidates.filter(doc => doc.metadata.projectId === projectId);
        }

        // Calculate similarities
        const results = candidates.map(doc => ({
            ...doc,
            similarity: this.cosineSimilarity(queryEmbedding, doc.embedding)
        }));

        // Filter by minimum similarity and sort
        return results
            .filter(r => r.similarity >= minSimilarity)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, topK);
    }

    /**
     * Delete documents by project ID
     */
    deleteByProject(projectId: string): void {
        this.documents = this.documents.filter(
            doc => doc.metadata.projectId !== projectId
        );
    }

    /**
     * Get document count
     */
    getDocumentCount(projectId?: string): number {
        if (projectId) {
            return this.documents.filter(doc => doc.metadata.projectId === projectId).length;
        }
        return this.documents.length;
    }

    /**
     * Chunk text into smaller pieces for better retrieval
     */
    chunkText(text: string, chunkSize: number = 500, overlap: number = 50): string[] {
        const chunks: string[] = [];
        const words = text.split(/\s+/);

        for (let i = 0; i < words.length; i += chunkSize - overlap) {
            const chunk = words.slice(i, i + chunkSize).join(' ');
            if (chunk.trim()) {
                chunks.push(chunk);
            }
        }

        return chunks;
    }
}

// Singleton instance
export const vectorStore = new SimpleVectorStore();

/**
 * Index a project's documents into the vector store
 */
export async function indexProject(
    projectId: string,
    documents: Array<{ id: string; content: string; title?: string }>
): Promise<void> {
    // Clear existing documents for this project
    vectorStore.deleteByProject(projectId);

    // Add documents with chunking
    for (const doc of documents) {
        const chunks = vectorStore.chunkText(doc.content);

        for (let i = 0; i < chunks.length; i++) {
            await vectorStore.addDocument({
                id: `${doc.id}-chunk-${i}`,
                content: chunks[i],
                metadata: {
                    projectId,
                    documentId: doc.id,
                    type: 'paragraph',
                    title: doc.title
                }
            });
        }
    }
}

/**
 * Search across project documents
 */
export async function searchProject(
    projectId: string,
    query: string,
    topK: number = 5
): Promise<Array<{ content: string; similarity: number; source?: string }>> {
    const results = await vectorStore.search(query, { projectId, topK });

    return results.map(r => ({
        content: r.content,
        similarity: r.similarity,
        source: r.metadata.title
    }));
}
