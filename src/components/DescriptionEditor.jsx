import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function DescriptionEditor({ value, onChange }) {
  const [mode, setMode] = useState('live'); // 'live' or 'code'
  const [code, setCode] = useState(value || '');

  // Sync external value changes to code state
  useEffect(() => {
    setCode(value || '');
  }, [value]);

  // When switching from code to live, update live view
  useEffect(() => {
    if (mode === 'live') {
      onChange(code);
    }
  }, [mode]); // Only trigger on mode change

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image',
  ];

  return (
    <div className="mb-4">
      <div className="flex gap-4 mb-2">
        <button
          onClick={() => setMode('live')}
          className={`px-3 py-1 rounded ${mode === 'live' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          type="button"
        >
          Live View
        </button>
        <button
          onClick={() => setMode('code')}
          className={`px-3 py-1 rounded ${mode === 'code' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          type="button"
        >
          HTML Code
        </button>
      </div>

      {mode === 'live' ? (
        <ReactQuill
          theme="snow"
          value={code}
          onChange={(content) => {
            setCode(content);
            onChange(content);
          }}
          modules={modules}
          formats={formats}
          style={{ minHeight: '200px' }}
        />
      ) : (
        <textarea
          className="border rounded p-2 w-full min-h-[200px] font-mono"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      )}
    </div>
  );
}
