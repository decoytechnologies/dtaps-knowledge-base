'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Youtube from '@tiptap/extension-youtube';
import FontSize from '@tiptap/extension-font-size';
import TextAlign from '@tiptap/extension-text-align'; // Import new extension
import { useCallback, useEffect } from 'react';
import { Bold, Italic, Strikethrough, Image as ImageIcon, Paintbrush, Palette, Youtube as YoutubeIcon, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

// --- Modern Toolbar Component ---
const EditorToolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        try {
          const response = await fetch('http://localhost:8080/api/upload', {
            method: 'POST',
            body: formData,
          });
          if (!response.ok) throw new Error('Upload failed');
          const { url } = await response.json();
          if (url) editor.chain().focus().setImage({ src: url }).run();
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Error uploading image');
        }
      }
    };
    input.click();
  }, [editor]);

  const addYoutubeVideo = () => {
    const url = prompt('Enter YouTube URL');
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  };

  return (
    <div className="border-b border-gray-200 p-2 bg-white rounded-t-lg flex flex-wrap items-center gap-1 sticky top-0 z-10">
      <select
        onChange={(e) => {
          const value = e.target.value;
          if (value === 'p') {
            editor.chain().focus().setParagraph().run();
          } else {
            editor.chain().focus().toggleHeading({ level: parseInt(value, 10) as 1 | 2 | 3 }).run();
          }
        }}
        className="px-2 py-1.5 text-sm font-medium border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="p">Paragraph</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
      </select>
      
      <select
        onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
        className="px-2 py-1.5 text-sm font-medium border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Normal Size</option>
        <option value="12px">Small</option>
        <option value="18px">Medium</option>
        <option value="24px">Large</option>
      </select>
      
      <div className="w-px h-6 bg-gray-200 mx-2"></div>
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}><Bold className="w-5 h-5" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}><Italic className="w-5 h-5" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}><Strikethrough className="w-5 h-5" /></button>
      
      {/* --- NEW: Alignment Buttons --- */}
      <div className="w-px h-6 bg-gray-200 mx-2"></div>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}><AlignLeft className="w-5 h-5" /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}><AlignCenter className="w-5 h-5" /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}><AlignRight className="w-5 h-5" /></button>
      
      <div className="w-px h-6 bg-gray-200 mx-2"></div>
      <button type="button" onClick={addImage}><ImageIcon className="w-5 h-5" /></button>
      <button type="button" onClick={addYoutubeVideo}><YoutubeIcon className="w-5 h-5" /></button>
      <div className="w-px h-6 bg-gray-200 mx-2"></div>
      <div className="flex items-center gap-1 p-1 rounded-md hover:bg-gray-100">
        <Palette className="w-5 h-5 text-gray-600" />
        <input type="color" onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()} value={editor.getAttributes('textStyle').color || '#000000'} />
      </div>
      <div className="flex items-center gap-1 p-1 rounded-md hover:bg-gray-100">
        <Paintbrush className="w-5 h-5 text-gray-600" />
        <input type="color" onInput={event => editor.chain().focus().toggleHighlight({ color: (event.target as HTMLInputElement).value }).run()} value={editor.getAttributes('highlight')?.color || '#ffffff'} />
      </div>
      <style jsx>{`
        button, select {
          padding: 8px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          background-color: transparent;
          color: #374151;
          transition: background-color 0.2s, color 0.2s, border-color 0.2s;
        }
        button:hover, select:hover {
          background-color: #f3f4f6;
        }
        button.is-active {
          background-color: #e0e7ff;
          color: #4f46e5;
          border-color: #c7d2fe;
        }
        input[type="color"] {
          width: 20px;
          height: 20px;
          border: none;
          padding: 0;
          background: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default function TiptapEditor({ content, onChange }: { content: string, onChange: (richText: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Youtube.configure({
        // --- FIX: width and height are now numbers ---
        width: "100%",
        height: 480,
        modestBranding: true,
        // --- NEW: Class for 80% width and centering ---
        //class: 'w-4/5 mx-auto rounded-lg shadow-md',
      }),
      FontSize,
      // --- NEW: Add and configure the TextAlign extension ---
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none p-6 focus:outline-none',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    // --- FIX: The boolean 'false' is a valid parameter for setContent ---
    // This code is correct and prevents an infinite loop.
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="min-h-[400px]" />
    </div>
  );
}
