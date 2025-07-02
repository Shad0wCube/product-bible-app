import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function DescriptionEditor({ value, onChange }) {
  const [mode, setMode] = useState('rich'); // 'rich' or 'code'
  const quillRef = useRef(null);
  const textareaRef = useRef(null);

  // Keyboard shortcuts handler for both editors
  useEffect(() => {
    function handleKeyDown(e) {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

      if (!ctrlKey) return;

      // Undo (Ctrl+Z / Cmd+Z)
      if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        if (mode === 'rich') {
          quillRef.current.getEditor().history.undo();
        } else {
          // For textarea, browser default undo works
          // no need to override
        }
      }

      // Redo (Ctrl+Y / Cmd+Shift+Z)
      if (e.key === 'y' || (e.key === 'Z' && e.shiftKey)) {
        e.preventDefault();
        if (mode === 'rich') {
          quillRef.current.getEditor().history.redo();
        } else {
          // browser default redo
        }
      }
    }

    const editor = mode === 'rich' ? quillRef.current?.getEditor() : textareaRef.current;

    if (editor) {
      editor.root ? editor.root.addEventListener('keydown', handleKeyDown) : editor.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (editor) {
        editor.root ? editor.root.removeEventListener('keydown', handleKeyDown) : editor.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [mode]);

  return (
    <div>
      <div className="mb-2 flex gap-4">
        <button
          type="button"
          onClick={() => setMode('rich')}
          className={`px-3 py-1 rounded ${mode === 'rich' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Rich Text
        </button>
        <button
          type="button"
          onClick={() => setMode('code')}
          className={`px-3 py-1 rounded ${mode === 'code' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          HTML Code
        </button>
      </div>

      {mode === 'rich' ? (
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image'],
              ['clean'],
            ],
            history: {
              delay: 2000,
              maxStack: 100,
              userOnly: true,
            },
          }}
          formats={[
            'header',
            'bold', 'italic', 'underline', 'strike',
            'list', 'bullet',
            'link', 'image',
          ]}
          style={{ height: '300px', marginBottom: '1rem' }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          className="w-full h-64 border border-gray-300 rounded p-2 font-mono text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />
      )}
    </div>
  );
}
