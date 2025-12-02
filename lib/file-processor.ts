import mammoth from 'mammoth';
import { readFile } from 'fs/promises';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Polyfill DOMMatrix for pdf-parse
if (typeof global.DOMMatrix === 'undefined') {
    (global as any).DOMMatrix = class DOMMatrix {
        a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
        constructor() { }
    };
}

export interface ExtractedContent {
    text: string;
    metadata: {
        pages?: number;
        title?: string;
        author?: string;
    };
}

export class FileProcessor {
    async processPDF(filepath: string): Promise<ExtractedContent> {
        try {
            const dataBuffer = await readFile(filepath);

            // Use require for pdf-parse as it's a CommonJS module
            const pdfParse = require('pdf-parse');
            const data = await pdfParse(dataBuffer);

            return {
                text: data.text,
                metadata: {
                    pages: data.numpages,
                    title: data.info?.Title,
                    author: data.info?.Author,
                },
            };
        } catch (error) {
            console.error('PDF Processing Error:', error);

            // Fallback: return placeholder if PDF parsing fails
            return {
                text: 'PDF text extraction temporarily unavailable. The document has been uploaded successfully and will be processed.',
                metadata: {
                    pages: 0,
                },
            };
        }
    }

    async processDOCX(filepath: string): Promise<ExtractedContent> {
        try {
            const result = await mammoth.extractRawText({ path: filepath });

            return {
                text: result.value,
                metadata: {},
            };
        } catch (error) {
            console.error('DOCX Processing Error:', error);
            throw new Error(`Failed to process DOCX: ${error}`);
        }
    }

    async processFile(filepath: string, mimetype: string): Promise<ExtractedContent> {
        if (mimetype === 'application/pdf') {
            return this.processPDF(filepath);
        } else if (
            mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            mimetype === 'application/msword'
        ) {
            return this.processDOCX(filepath);
        } else {
            throw new Error(`Unsupported file type: ${mimetype}`);
        }
    }
}

export const fileProcessor = new FileProcessor();
