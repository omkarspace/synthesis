'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Quote,
    Undo,
    Redo,
    Save
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    content: string;
    onSave?: (content: string) => void;
    editable?: boolean;
    className?: string;
}

export function RichTextEditor({ content, onSave, editable = true, className }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: content,
        editable: editable,
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px] p-4',
            },
        },
    });

    if (!editor) {
        return null;
    }

    const handleSave = () => {
        if (onSave && editor) {
            const html = editor.getHTML();
            onSave(html);
        }
    };

    return (
        <div className={cn('border rounded-lg overflow-hidden', className)}>
            {editable && (
                <div className="border-b bg-muted/30 p-2 flex items-center gap-1 flex-wrap">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive('bold') ? 'bg-muted' : ''}
                    >
                        <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive('italic') ? 'bg-muted' : ''}
                    >
                        <Italic className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
                    >
                        <Heading1 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
                    >
                        <Heading2 className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={editor.isActive('bulletList') ? 'bg-muted' : ''}
                    >
                        <List className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={editor.isActive('orderedList') ? 'bg-muted' : ''}
                    >
                        <ListOrdered className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={editor.isActive('blockquote') ? 'bg-muted' : ''}
                    >
                        <Quote className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                    >
                        <Undo className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                    >
                        <Redo className="w-4 h-4" />
                    </Button>
                    <div className="flex-1" />
                    {onSave && (
                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleSave}
                            className="gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </Button>
                    )}
                </div>
            )}
            <EditorContent editor={editor} className="bg-background" />
        </div>
    );
}
