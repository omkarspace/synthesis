'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    sources?: Array<{ content: string; similarity: number }>;
}

interface ChatWithResearchProps {
    projectId: string;
}

export function ChatWithResearch({ projectId }: ChatWithResearchProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId,
                    query: input,
                    conversationHistory: messages
                })
            });

            if (!response.ok) throw new Error('Chat request failed');

            const data = await response.json();
            const assistantMessage: Message = {
                role: 'assistant',
                content: data.response,
                sources: data.sources
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    Ask Questions About Your Research
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {messages.length === 0 && (
                        <div className="text-center text-muted-foreground py-12">
                            <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium mb-2">Start a conversation</p>
                            <p className="text-sm">Ask questions about your research documents</p>
                        </div>
                    )}

                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={cn(
                                'flex gap-3',
                                message.role === 'user' ? 'justify-end' : 'justify-start'
                            )}
                        >
                            {message.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-primary" />
                                </div>
                            )}

                            <div
                                className={cn(
                                    'rounded-lg px-4 py-2 max-w-[80%]',
                                    message.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                )}
                            >
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                                {message.sources && message.sources.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-border/50">
                                        <p className="text-xs font-medium mb-2 opacity-70">Sources:</p>
                                        {message.sources.map((source, idx) => (
                                            <div key={idx} className="text-xs opacity-60 mb-1">
                                                • {source.content.substring(0, 100)}...
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {message.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-primary" />
                            </div>
                            <div className="bg-muted rounded-lg px-4 py-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about your research..."
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
