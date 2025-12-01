'use client';

import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathRendererProps {
    content: string;
    className?: string;
}

/**
 * Renders text with LaTeX mathematical formulas
 * Supports inline math: $formula$ and block math: $$formula$$
 */
export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '' }) => {
    const renderContent = () => {
        const parts: React.ReactNode[] = [];
        let currentIndex = 0;
        let key = 0;

        // Regular expressions for block and inline math
        const blockMathRegex = /\$\$(.*?)\$\$/gs;
        const inlineMathRegex = /\$(.*?)\$/g;

        // First, find all block math sections
        const blockMatches: Array<{ start: number; end: number; formula: string }> = [];
        let match;

        while ((match = blockMathRegex.exec(content)) !== null) {
            blockMatches.push({
                start: match.index,
                end: match.index + match[0].length,
                formula: match[1],
            });
        }

        // Process content
        let lastEnd = 0;
        const segments: Array<{ type: 'text' | 'block' | 'inline'; content: string; start: number; end: number }> = [];

        // Add block math segments
        blockMatches.forEach((blockMatch) => {
            if (blockMatch.start > lastEnd) {
                segments.push({
                    type: 'text',
                    content: content.substring(lastEnd, blockMatch.start),
                    start: lastEnd,
                    end: blockMatch.start,
                });
            }
            segments.push({
                type: 'block',
                content: blockMatch.formula,
                start: blockMatch.start,
                end: blockMatch.end,
            });
            lastEnd = blockMatch.end;
        });

        // Add remaining text
        if (lastEnd < content.length) {
            segments.push({
                type: 'text',
                content: content.substring(lastEnd),
                start: lastEnd,
                end: content.length,
            });
        }

        // Process text segments for inline math
        const processedSegments: Array<{ type: 'text' | 'block' | 'inline'; content: string }> = [];
        segments.forEach((segment) => {
            if (segment.type === 'text') {
                let textContent = segment.content;
                let lastIdx = 0;
                let inlineMatch;
                const inlineRegex = /\$(.*?)\$/g;

                while ((inlineMatch = inlineRegex.exec(textContent)) !== null) {
                    if (inlineMatch.index > lastIdx) {
                        processedSegments.push({
                            type: 'text',
                            content: textContent.substring(lastIdx, inlineMatch.index),
                        });
                    }
                    processedSegments.push({
                        type: 'inline',
                        content: inlineMatch[1],
                    });
                    lastIdx = inlineMatch.index + inlineMatch[0].length;
                }

                if (lastIdx < textContent.length) {
                    processedSegments.push({
                        type: 'text',
                        content: textContent.substring(lastIdx),
                    });
                }
            } else {
                processedSegments.push(segment);
            }
        });

        // Render segments
        return processedSegments.map((segment, idx) => {
            if (segment.type === 'block') {
                return (
                    <div key={idx} className="my-4">
                        <BlockMath math={segment.content} />
                    </div>
                );
            } else if (segment.type === 'inline') {
                return <InlineMath key={idx} math={segment.content} />;
            } else {
                return <span key={idx}>{segment.content}</span>;
            }
        });
    };

    return <div className={className}>{renderContent()}</div>;
};

/**
 * Simple wrapper for rendering a single formula
 */
export const Formula: React.FC<{ formula: string; block?: boolean }> = ({ formula, block = false }) => {
    if (block) {
        return (
            <div className="my-4">
                <BlockMath math={formula} />
            </div>
        );
    }
    return <InlineMath math={formula} />;
};
