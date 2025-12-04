'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import Highlight from '@tiptap/extension-highlight';
import { Button } from '@/components/ui/button';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Palette,
    Type,
    Highlighter,
    Save,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface RichTextEditorProps {
    content: string;
    onSave?: (content: string) => void;
    editable?: boolean;
    className?: string;
}

const FONT_FAMILIES = [
    { name: 'Default', value: 'inherit' },
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Times New Roman', value: '"Times New Roman", serif' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Courier New', value: '"Courier New", monospace' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
    { name: 'Palatino', value: 'Palatino, serif' },
    { name: 'Garamond', value: 'Garamond, serif' },
];

const TEXT_COLORS = [
    '#000000', '#374151', '#6B7280', '#9CA3AF',
    '#EF4444', '#F97316', '#F59E0B', '#EAB308',
    '#84CC16', '#22C55E', '#10B981', '#14B8A6',
    '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
    '#8B5CF6', '#A855F7', '#D946EF', '#EC4899',
];

const HIGHLIGHT_COLORS = [
    'transparent', '#FEF3C7', '#FED7AA', '#FECACA',
    '#DBEAFE', '#E0E7FF', '#EDE9FE', '#FCE7F3',
    '#D1FAE5', '#CCFBF1', '#F3F4F6',
];

export function RichTextEditor({ content, onSave, editable = true, className }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color,
            FontFamily.configure({
                types: ['textStyle'],
            }),
            Highlight.configure({
                multicolor: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
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

    const ToolbarButton = ({ onClick, active, children, title }: any) => (
        <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className={cn(
                'h-8 w-8 p-0',
                active && 'bg-primary/10 text-primary'
            )}
            title={title}
            type="button"
        >
            {children}
        </Button>
    );

    return (
        <div className={cn('border rounded-lg overflow-hidden', className)}>
            {editable && (
                <div className="border-b bg-muted/30 p-2 flex items-center gap-1 flex-wrap">
                    {/* Text Style */}
                    <div className="flex gap-1 border-r pr-2">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            active={editor.isActive('bold')}
                            title="Bold (Ctrl+B)"
                        >
                            <Bold className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            active={editor.isActive('italic')}
                            title="Italic (Ctrl+I)"
                        >
                            <Italic className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            active={editor.isActive('underline')}
                            title="Underline (Ctrl+U)"
                        >
                            <UnderlineIcon className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            active={editor.isActive('strike')}
                            title="Strikethrough"
                        >
                            <Strikethrough className="w-4 h-4" />
                        </ToolbarButton>
                    </div>

                    {/* Headings */}
                    <div className="flex gap-1 border-r pr-2">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            active={editor.isActive('heading', { level: 1 })}
                            title="Heading 1"
                        >
                            <Heading1 className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            active={editor.isActive('heading', { level: 2 })}
                            title="Heading 2"
                        >
                            <Heading2 className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            active={editor.isActive('heading', { level: 3 })}
                            title="Heading 3"
                        >
                            <Heading3 className="w-4 h-4" />
                        </ToolbarButton>
                    </div>

                    {/* Font Family */}
                    <div className="border-r pr-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 gap-1" title="Font Family">
                                    <Type className="w-4 h-4" />
                                    <span className="text-xs hidden sm:inline">Font</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
                                {FONT_FAMILIES.map((font) => (
                                    <DropdownMenuItem
                                        key={font.value}
                                        onClick={() => editor.chain().focus().setFontFamily(font.value).run()}
                                        style={{ fontFamily: font.value }}
                                    >
                                        {font.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Text Color */}
                    <div className="border-r pr-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Text Color">
                                    <Palette className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <div className="grid grid-cols-5 gap-1 p-2">
                                    {TEXT_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => editor.chain().focus().setColor(color).run()}
                                            className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Highlight Color */}
                    <div className="border-r pr-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Highlight">
                                    <Highlighter className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <div className="grid grid-cols-4 gap-1 p-2">
                                    {HIGHLIGHT_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                                            className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                                            style={{ backgroundColor: color }}
                                            title={color === 'transparent' ? 'No highlight' : color}
                                        />
                                    ))}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Alignment */}
                    <div className="flex gap-1 border-r pr-2">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                            active={editor.isActive({ textAlign: 'left' })}
                            title="Align Left"
                        >
                            <AlignLeft className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                            active={editor.isActive({ textAlign: 'center' })}
                            title="Align Center"
                        >
                            <AlignCenter className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                            active={editor.isActive({ textAlign: 'right' })}
                            title="Align Right"
                        >
                            <AlignRight className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                            active={editor.isActive({ textAlign: 'justify' })}
                            title="Justify"
                        >
                            <AlignJustify className="w-4 h-4" />
                        </ToolbarButton>
                    </div>

                    {/* Lists */}
                    <div className="flex gap-1 border-r pr-2">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            active={editor.isActive('bulletList')}
                            title="Bullet List"
                        >
                            <List className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            active={editor.isActive('orderedList')}
                            title="Numbered List"
                        >
                            <ListOrdered className="w-4 h-4" />
                        </ToolbarButton>
                    </div>

                    {/* Other */}
                    <div className="flex gap-1 border-r pr-2">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            active={editor.isActive('blockquote')}
                            title="Quote"
                        >
                            <Quote className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                            active={editor.isActive('codeBlock')}
                            title="Code Block"
                        >
                            <Code className="w-4 h-4" />
                        </ToolbarButton>
                    </div>

                    {/* Undo/Redo */}
                    <div className="flex gap-1">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().undo().run()}
                            title="Undo (Ctrl+Z)"
                        >
                            <Undo className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().redo().run()}
                            title="Redo (Ctrl+Y)"
                        >
                            <Redo className="w-4 h-4" />
                        </ToolbarButton>
                    </div>

                    {/* Save Button */}
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
