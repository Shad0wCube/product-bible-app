import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function DescriptionEditor({ value, onChange }) {
  const [mode, setMode] = useState('rich'); // 'rich' or 'code'

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
          className="w-full h-64 border border-gray-300 rounded p-2 font-mono text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />
      )}
    </div>
  );
}
