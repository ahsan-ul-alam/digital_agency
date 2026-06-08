import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { Callout } from './extensions/Callout';
import { uploadEditorImage } from './editorUpload';
import {
    RiAlignCenter,
    RiAlignLeft,
    RiAlignRight,
    RiBold,
    RiCodeSSlashLine,
    RiDoubleQuotesL,
    RiFullscreenLine,
    RiFullscreenExitLine,
    RiH1,
    RiH2,
    RiH3,
    RiImageAddLine,
    RiItalic,
    RiLinkM,
    RiListCheck,
    RiListOrdered,
    RiListUnordered,
    RiMarkPenLine,
    RiStrikethrough,
    RiTableLine,
    RiUnderline,
    RiYoutubeLine,
} from 'react-icons/ri';

const lowlight = createLowlight(common);

const slashItems = [
    { label: 'Heading 2', command: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: 'Bullet List', command: (editor) => editor.chain().focus().toggleBulletList().run() },
    { label: 'Numbered List', command: (editor) => editor.chain().focus().toggleOrderedList().run() },
    { label: 'Checklist', command: (editor) => editor.chain().focus().toggleTaskList().run() },
    { label: 'Quote', command: (editor) => editor.chain().focus().toggleBlockquote().run() },
    { label: 'Code Block', command: (editor) => editor.chain().focus().toggleCodeBlock().run() },
    { label: 'Info Callout', command: (editor) => editor.chain().focus().setCallout('info').run() },
    { label: 'Warning Callout', command: (editor) => editor.chain().focus().setCallout('warning').run() },
    { label: 'Table', command: (editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
    { label: 'Image', command: (editor, uploadRef) => uploadRef.current?.click() },
];

function ToolbarButton({ active, onClick, title, children }) {
    return (
        <button type="button" className={`rte-toolbar-btn ${active ? 'is-active' : ''}`} onClick={onClick} title={title}>
            {children}
        </button>
    );
}

export default function RichTextEditor({
    value = '',
    onChange,
    placeholder = 'Start writing...',
    compact = false,
    minHeight = '12rem',
    onAutoSave,
    storageKey,
}) {
    const fileRef = useRef(null);
    const editorRef = useRef(null);
    const [fullscreen, setFullscreen] = useState(false);
    const [slashOpen, setSlashOpen] = useState(false);
    const [slashQuery, setSlashQuery] = useState('');
    const [uploading, setUploading] = useState(false);

    const insertImage = useCallback(async (file, editor) => {
        if (!file || !editor) return;
        setUploading(true);
        try {
            const result = await uploadEditorImage(file);
            editor.chain().focus().setImage({ src: result.url, alt: file.name, title: result.media?.name || file.name }).run();
        } catch {
            window.alert('Image upload failed. Check Cloudinary settings or try again.');
        } finally {
            setUploading(false);
        }
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ codeBlock: false }),
            Underline,
            Highlight,
            Subscript,
            Superscript,
            Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
            Image.configure({ inline: false, allowBase64: false }),
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            Placeholder.configure({ placeholder }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Youtube.configure({ width: 640, height: 360 }),
            TaskList,
            TaskItem.configure({ nested: true }),
            CodeBlockLowlight.configure({ lowlight }),
            Callout,
        ],
        content: value || '',
        editorProps: {
            attributes: {
                class: 'rte-editor-body',
                style: `min-height:${minHeight}`,
            },
            handleDrop(_view, event) {
                const file = event.dataTransfer?.files?.[0];
                if (file?.type?.startsWith('image/')) {
                    event.preventDefault();
                    insertImage(file, editorRef.current);
                    return true;
                }
                return false;
            },
            handlePaste(_view, event) {
                const file = event.clipboardData?.files?.[0];
                if (file?.type?.startsWith('image/')) {
                    event.preventDefault();
                    insertImage(file, editorRef.current);
                    return true;
                }
                return false;
            },
        },
        onUpdate({ editor: current }) {
            const html = current.getHTML();
            onChange?.(html);
            if (storageKey) {
                localStorage.setItem(`rte-draft:${storageKey}`, html);
            }
        },
    });

    useEffect(() => {
        if (!editor) return;
        const current = editor.getHTML();
        const next = value || '';
        if (next !== current && next !== '<p></p>') {
            editor.commands.setContent(next, false);
        }
    }, [value, editor]);

    useEffect(() => {
        if (!editor || !storageKey || value) return;
        const draft = localStorage.getItem(`rte-draft:${storageKey}`);
        if (draft && draft !== '<p></p>') {
            editor.commands.setContent(draft, false);
            onChange?.(draft);
        }
    }, [editor, storageKey, value, onChange]);

    useEffect(() => {
        if (!onAutoSave || !editor) return undefined;
        const timer = setInterval(() => {
            onAutoSave(editor.getHTML());
        }, 3000);
        return () => clearInterval(timer);
    }, [editor, onAutoSave]);

    useEffect(() => {
        if (!editor) return undefined;
        const onKeyDown = () => {
            const text = editor.state.doc.textBetween(
                Math.max(0, editor.state.selection.from - 20),
                editor.state.selection.from,
                '\n'
            );
            const match = text.match(/(?:^|\s)\/([a-zA-Z]*)$/);
            if (match) {
                setSlashOpen(true);
                setSlashQuery(match[1].toLowerCase());
            } else {
                setSlashOpen(false);
                setSlashQuery('');
            }
        };
        editor.on('transaction', onKeyDown);
        return () => editor.off('transaction', onKeyDown);
    }, [editor]);

    editorRef.current = editor;

    if (!editor) return null;

    function setLink() {
        const previous = editor.getAttributes('link').href;
        const url = window.prompt('Enter URL', previous || 'https://');
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run();
    }

    function insertYoutube() {
        const url = window.prompt('YouTube URL');
        if (!url) return;
        editor.commands.setYoutubeVideo({ src: url });
    }

    function insertMap() {
        const url = window.prompt('Google Maps embed URL');
        if (!url) return;
        editor.commands.insertContent(`<iframe src="${url}" width="100%" height="360" style="border:0;border-radius:1rem" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`);
    }

    const filteredSlash = slashItems.filter((item) => item.label.toLowerCase().includes(slashQuery));

    return (
        <div className={`rte-shell ${fullscreen ? 'is-fullscreen' : ''} ${compact ? 'is-compact' : ''}`}>
            <div className="rte-toolbar">
                <div className="rte-toolbar-group">
                    <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold"><RiBold /></ToolbarButton>
                    <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic"><RiItalic /></ToolbarButton>
                    <ToolbarButton active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline"><RiUnderline /></ToolbarButton>
                    <ToolbarButton active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough"><RiStrikethrough /></ToolbarButton>
                    <ToolbarButton active={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()} title="Highlight"><RiMarkPenLine /></ToolbarButton>
                </div>
                {!compact && (
                    <>
                        <div className="rte-toolbar-group">
                            <ToolbarButton active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="H1"><RiH1 /></ToolbarButton>
                            <ToolbarButton active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="H2"><RiH2 /></ToolbarButton>
                            <ToolbarButton active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="H3"><RiH3 /></ToolbarButton>
                        </div>
                        <div className="rte-toolbar-group">
                            <ToolbarButton active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list"><RiListUnordered /></ToolbarButton>
                            <ToolbarButton active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list"><RiListOrdered /></ToolbarButton>
                            <ToolbarButton active={editor.isActive('taskList')} onClick={() => editor.chain().focus().toggleTaskList().run()} title="Checklist"><RiListCheck /></ToolbarButton>
                        </div>
                        <div className="rte-toolbar-group">
                            <ToolbarButton active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote"><RiDoubleQuotesL /></ToolbarButton>
                            <ToolbarButton active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code block"><RiCodeSSlashLine /></ToolbarButton>
                            <ToolbarButton onClick={() => editor.chain().focus().setCallout('info').run()} title="Info callout">Info</ToolbarButton>
                            <ToolbarButton onClick={() => editor.chain().focus().setCallout('warning').run()} title="Warning callout">Warn</ToolbarButton>
                        </div>
                        <div className="rte-toolbar-group">
                            <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Link"><RiLinkM /></ToolbarButton>
                            <ToolbarButton onClick={() => fileRef.current?.click()} title="Upload image"><RiImageAddLine /></ToolbarButton>
                            <ToolbarButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert table"><RiTableLine /></ToolbarButton>
                            <ToolbarButton onClick={insertYoutube} title="YouTube"><RiYoutubeLine /></ToolbarButton>
                            <ToolbarButton onClick={insertMap} title="Google Maps">Map</ToolbarButton>
                        </div>
                        <div className="rte-toolbar-group">
                            <ToolbarButton active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Align left"><RiAlignLeft /></ToolbarButton>
                            <ToolbarButton active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Align center"><RiAlignCenter /></ToolbarButton>
                            <ToolbarButton active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} title="Align right"><RiAlignRight /></ToolbarButton>
                        </div>
                    </>
                )}
                <div className="rte-toolbar-group rte-toolbar-end">
                    {uploading && <span className="rte-uploading">Uploading...</span>}
                    <ToolbarButton onClick={() => setFullscreen((current) => !current)} title="Fullscreen">
                        {fullscreen ? <RiFullscreenExitLine /> : <RiFullscreenLine />}
                    </ToolbarButton>
                </div>
            </div>

            {slashOpen && filteredSlash.length > 0 && (
                <div className="rte-slash-menu">
                    {filteredSlash.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            className="rte-slash-item"
                            onClick={() => {
                                editor.chain().focus().deleteRange({
                                    from: editor.state.selection.from - slashQuery.length - 1,
                                    to: editor.state.selection.from,
                                }).run();
                                item.command(editor, fileRef);
                                setSlashOpen(false);
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}

            <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="rte-bubble">
                <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold"><RiBold /></ToolbarButton>
                <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic"><RiItalic /></ToolbarButton>
                <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Link"><RiLinkM /></ToolbarButton>
            </BubbleMenu>

            <EditorContent editor={editor} />
            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    insertImage(e.target.files?.[0], editor);
                    e.target.value = '';
                }}
            />
            <p className="rte-hint">Type <kbd>/</kbd> for blocks · Drag & drop images · Auto-saves draft locally</p>
        </div>
    );
}
