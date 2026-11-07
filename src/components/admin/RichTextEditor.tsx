'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  Table,
  Quote,
  Minus,
  Link as LinkIcon,
  RemoveFormatting,
  Code,
  Eye,
  CheckSquare,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  compact?: boolean;
}

/**
 * Helper to normalize plain text (from older records) into HTML paragraphs
 * if it doesn't contain HTML tags yet.
 */
export function normalizeToHtml(content: string): string {
  if (!content) return '';
  const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(content);
  if (hasHtmlTags) return content;
  return content
    .split(/\n\n+/)
    .map((para) => `<p>${para.replace(/\n/g, '<br/>')}</p>`)
    .join('');
}

/**
 * Helper to strip HTML tags for short card previews.
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<\/(p|div|h[1-6]|li|tr|blockquote)>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write and format content here...',
  minHeight = '180px',
  compact = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);
  const [sourceMode, setSourceMode] = useState(false);

  // Sync external value changes into the contentEditable div
  useEffect(() => {
    if (sourceMode) return;
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    if (editorRef.current) {
      const normalized = normalizeToHtml(value);
      if (editorRef.current.innerHTML !== normalized) {
        editorRef.current.innerHTML = normalized;
      }
    }
  }, [value, sourceMode]);

  const triggerChange = () => {
    if (!editorRef.current) return;
    isInternalChange.current = true;
    const html = editorRef.current.innerHTML;
    // Treat empty paragraph or <br> as empty string
    if (html === '<br>' || html === '<p><br></p>') {
      onChange('');
    } else {
      onChange(html);
    }
  };

  const execCommand = (command: string, arg: string = '') => {
    if (sourceMode) return;
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    triggerChange();
  };

  const insertHtmlSnippet = (snippet: string) => {
    if (sourceMode) return;
    editorRef.current?.focus();
    document.execCommand('insertHTML', false, snippet);
    triggerChange();
  };

  const handleInsertLink = () => {
    const url = window.prompt('Enter URL (e.g. https://...):', 'https://');
    if (url && url.trim()) {
      execCommand('createLink', url.trim());
    }
  };

  const handleInsertSpecTable = () => {
    const tableHtml = `
      <table>
        <thead>
          <tr>
            <th>Specification</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Dimensions</strong></td>
            <td>Custom / Standard Size</td>
          </tr>
          <tr>
            <td><strong>Primary Material</strong></td>
            <td>Engineered Board &amp; Heavy-Gauge Steel</td>
          </tr>
          <tr>
            <td><strong>Surface Finish</strong></td>
            <td>Scratch-Resistant Matte Laminate / Powder Coat</td>
          </tr>
          <tr>
            <td><strong>Warranty</strong></td>
            <td>DOER Structural Warranty</td>
          </tr>
        </tbody>
      </table>
      <p><br/></p>
    `;
    insertHtmlSnippet(tableHtml);
  };

  const handleInsertFeaturesList = () => {
    const listHtml = `
      <h3>Key Features &amp; Highlights</h3>
      <ul>
        <li><strong>Ergonomic Engineering:</strong> Built for continuous daily performance and comfort.</li>
        <li><strong>Integrated Cable Management:</strong> Concealed routing for power and data connectivity.</li>
        <li><strong>Customizable Dimensions:</strong> Tailored to fit your exact floor plan.</li>
      </ul>
      <p><br/></p>
    `;
    insertHtmlSnippet(listHtml);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:border-[#FF3D00] focus-within:ring-1 focus-within:ring-[#FF3D00]/20 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-2.5 py-2 bg-slate-50 border-b border-slate-200">
        {/* Headings / Paragraph */}
        <button
          type="button"
          onClick={() => execCommand('formatBlock', 'P')}
          disabled={sourceMode}
          className="px-2 py-1 rounded-md text-xs font-bold text-slate-700 hover:bg-slate-200/80 disabled:opacity-40 cursor-pointer"
          title="Normal Paragraph"
        >
          P
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', 'H2')}
          disabled={sourceMode}
          className="p-1.5 rounded-md text-slate-700 hover:bg-slate-200/80 disabled:opacity-40 cursor-pointer"
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', 'H3')}
          disabled={sourceMode}
          className="p-1.5 rounded-md text-slate-700 hover:bg-slate-200/80 disabled:opacity-40 cursor-pointer"
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-slate-300 mx-1" />

        {/* Inline Styles */}
        <button
          type="button"
          onClick={() => execCommand('bold')}
          disabled={sourceMode}
          className="p-1.5 rounded-md text-slate-700 hover:bg-slate-200/80 disabled:opacity-40 cursor-pointer"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          disabled={sourceMode}
          className="p-1.5 rounded-md text-slate-700 hover:bg-slate-200/80 disabled:opacity-40 cursor-pointer"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          disabled={sourceMode}
          className="p-1.5 rounded-md text-slate-700 hover:bg-slate-200/80 disabled:opacity-40 cursor-pointer"
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-slate-300 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          disabled={sourceMode}
          className="p-1.5 rounded-md text-slate-700 hover:bg-slate-200/80 disabled:opacity-40 cursor-pointer"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          disabled={sourceMode}
          className="p-1.5 rounded-md text-slate-700 hover:bg-slate-200/80 disabled:opacity-40 cursor-pointer"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        {!compact && (
          <>
            <span className="w-px h-4 bg-slate-300 mx-1" />

            {/* Alignment */}
            <button
              type="button"
              onClick={() => execCommand('justifyLeft')}
              disabled={sourceMode}
              className="p-1.5 rounded-md text-slate-700 hover:bg-slate-200/80 disabled:opacity-40 cursor-pointer"
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => execCommand('justifyCenter')}
              disabled={sourceMode}
              className="p-1.5 rounded-md text-slate-700 hover:bg-slate-200/80 disabled:opacity-40 cursor-pointer"
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>

            <span className="w-px h-4 bg-slate-300 mx-1" />

            {/* Quote, Divider, Link */}
            <button
              type="button"
              onClick={() => execCommand('formatBlock', 'BLOCKQUOTE')}
              disabled={sourceMode}
              className="p-1.5 rounded-md text-slate-700 hover:bg-slate-200/80 disabled:opacity-40 cursor-pointer"
              title="Highlight Quote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => execCommand('insertHorizontalRule')}
              disabled={sourceMode}
              className="p-1.5 rounded-md text-slate-700 hover:bg-slate-200/80 disabled:opacity-40 cursor-pointer"
              title="Horizontal Divider"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleInsertLink}
              disabled={sourceMode}
              className="p-1.5 rounded-md text-slate-700 hover:bg-slate-200/80 disabled:opacity-40 cursor-pointer"
              title="Insert Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>

            <span className="w-px h-4 bg-slate-300 mx-1" />

            {/* Quick Structured Templates */}
            <button
              type="button"
              onClick={handleInsertSpecTable}
              disabled={sourceMode}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-slate-200 hover:border-[#FF3D00] text-[11px] font-bold text-slate-700 hover:text-[#FF3D00] disabled:opacity-40 cursor-pointer shadow-2xs"
              title="Insert Technical Specification Table"
            >
              <Table className="w-3.5 h-3.5 text-[#FF3D00]" />
              <span>+ Spec Table</span>
            </button>

            <button
              type="button"
              onClick={handleInsertFeaturesList}
              disabled={sourceMode}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-slate-200 hover:border-[#FF3D00] text-[11px] font-bold text-slate-700 hover:text-[#FF3D00] disabled:opacity-40 cursor-pointer shadow-2xs"
              title="Insert Key Features List"
            >
              <CheckSquare className="w-3.5 h-3.5 text-[#FF3D00]" />
              <span>+ Features</span>
            </button>
          </>
        )}

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => execCommand('removeFormat')}
            disabled={sourceMode}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200/80 disabled:opacity-40 cursor-pointer"
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setSourceMode(!sourceMode)}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
              sourceMode
                ? 'bg-[#FF3D00] text-white'
                : 'text-slate-600 hover:bg-slate-200/80'
            }`}
            title="Toggle HTML Source / Visual Editor"
          >
            {sourceMode ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Visual</span>
              </>
            ) : (
              <>
                <Code className="w-3.5 h-3.5" />
                <span>HTML</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Surface */}
      {sourceMode ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ minHeight }}
          placeholder={placeholder}
          className="w-full p-3.5 bg-slate-900 text-slate-100 font-mono text-xs focus:outline-none resize-y"
        />
      ) : (
        <div className="relative">
          {!value && (
            <div className="absolute top-3.5 left-3.5 text-slate-400 text-sm pointer-events-none select-none">
              {placeholder}
            </div>
          )}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={triggerChange}
            onBlur={triggerChange}
            style={{ minHeight }}
            className="w-full p-3.5 text-sm text-slate-900 focus:outline-none overflow-y-auto leading-relaxed
              [&_h2]:text-lg [&_h2]:font-black [&_h2]:text-slate-900 [&_h2]:mt-3 [&_h2]:mb-1.5
              [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-2.5 [&_h3]:mb-1
              [&_p]:mb-2
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ul]:space-y-1
              [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2 [&_ol]:space-y-1
              [&_blockquote]:border-l-4 [&_blockquote]:border-[#FF3D00] [&_blockquote]:bg-slate-50 [&_blockquote]:pl-3 [&_blockquote]:py-1.5 [&_blockquote]:my-2 [&_blockquote]:italic [&_blockquote]:text-slate-700
              [&_hr]:my-3 [&_hr]:border-slate-200
              [&_a]:text-[#FF3D00] [&_a]:underline
              [&_table]:w-full [&_table]:border-collapse [&_table]:my-3 [&_table]:text-xs
              [&_th]:bg-slate-100 [&_th]:text-slate-800 [&_th]:font-bold [&_th]:text-left [&_th]:p-2.5 [&_th]:border [&_th]:border-slate-200
              [&_td]:p-2.5 [&_td]:border [&_td]:border-slate-200 [&_td]:text-slate-700"
          />
        </div>
      )}
    </div>
  );
}

