import React, { useState, useRef, useEffect } from 'react';

export default function DescriptionEditor({ value, onChange }) {
  const [mode, setMode] = useState('live'); // 'live' or 'code'
  const liveRef = useRef(null);
  const [html, setHtml] = useState(value || '');

  // Sync prop value changes (e.g. reset)
  useEffect(() => {
    setHtml(value || '');
    if (liveRef.current) liveRef.current.innerHTML = value || '';
  }, [value]);

  // Update parent on html change
  const updateHtml = (newHtml) => {
    setHtml(newHtml);
    if (onChange) onChange(newHtml);
  };

  // When live editing content changes
  const onLiveInput = () => {
    if (liveRef.current) {
      updateHtml(liveRef.current.innerHTML);
    }
  };

  // Toolbar command execution
  const execCmd = (command, value = null) => {
    document.execCommand(command, false, value);
    onLiveInput();
  };

  return (
    <div className="mb-5">
      <label className="block text-gray-700 font-semibold mb-1">Description (HTML)</label>
      <div className="mb-2 flex border border-gray-300 rounded-t-md overflow-hidden">
        <button
          type="button"
          onClick={() => setMode('live')}
          className={`flex-1 py-2 text-center font-semibold ${
            mode === 'live'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } transition`}
        >
          Live View
        </button>
        <button
          type="button"
          onClick={() => setMode('code')}
          className={`flex-1 py-2 text-center font-semibold ${
            mode === 'code'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } transition`}
        >
          Code View
        </button>
      </div>

      {mode === 'live' && (
        <>
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => execCmd('bold')}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              title="Bold"
            >
              <b>B</b>
            </button>
            <button
              type="button"
              onClick={() => execCmd('italic')}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              title="Italic"
            >
              <i>I</i>
            </button>
            <button
              type="button"
              onClick={() => execCmd('underline')}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              title="Underline"
            >
              <u>U</u>
            </button>
            <button
              type="button"
              onClick={() => execCmd('insertUnorderedList')}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              title="Bullet List"
            >
              &#8226; List
            </button>
            <button
              type="button"
              onClick={() => execCmd('insertOrderedList')}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              title="Numbered List"
            >
              1. List
            </button>
            <button
              type="button"
              onClick={() => {
                const url = prompt('Enter URL:');
                if (url) execCmd('createLink', url);
              }}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              title="Insert Link"
            >
              🔗 Link
            </button>
            <button
              type="button"
              onClick={() => execCmd('removeFormat')}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              title="Remove Formatting"
            >
              ✖
            </button>
          </div>

          <div
            ref={liveRef}
            contentEditable
            suppressContentEditableWarning={true}
            className="border border-gray-300 rounded-b-md p-4 min-h-[150px] bg-white overflow-auto focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            onInput={onLiveInput}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </>
      )}

      {mode === 'code' && (
        <textarea
          className="w-full border border-gray-300 rounded-md p-4 font-mono min-h-[150px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          value={html}
          onChange={(e) => updateHtml(e.target.value)}
          spellCheck={false}
        />
      )}
    </div>
  );
}
