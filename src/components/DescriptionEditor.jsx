import React, { useState, useRef, useEffect } from 'react';

export default function DescriptionEditor({ value, onChange }) {
  const [html, setHtml] = useState('');
  const [mode, setMode] = useState('live'); // 'live' or 'code'
  const liveRef = useRef(null);
  const codeRef = useRef(null);

  // Initialize content with wrapping <p> to help lists work correctly
  useEffect(() => {
    let safeHtml = value || '';
    if (safeHtml && !safeHtml.trim().startsWith('<p')) {
      safeHtml = `<p>${safeHtml}</p>`;
    }
    setHtml(safeHtml);
    if (liveRef.current) liveRef.current.innerHTML = safeHtml;
  }, [value]);

  // When switching mode or html changes, update the other pane
  useEffect(() => {
    if (mode === 'live') {
      if (liveRef.current && liveRef.current.innerHTML !== html) {
        liveRef.current.innerHTML = html;
      }
    } else {
      if (codeRef.current && codeRef.current.value !== html) {
        codeRef.current.value = html;
      }
    }
  }, [html, mode]);

  // Call onChange with updated HTML
  const updateHtml = (newHtml) => {
    setHtml(newHtml);
    if (onChange) onChange(newHtml);
  };

  // Called on input in live contenteditable div
  const onLiveInput = () => {
    if (!liveRef.current) return;
    const newHtml = liveRef.current.innerHTML;
    updateHtml(newHtml);
  };

  // Called on input in code textarea
  const onCodeInput = () => {
    if (!codeRef.current) return;
    const newHtml = codeRef.current.value;
    updateHtml(newHtml);
  };

  // Execute document commands on live div
  const execCmd = (command, value = null) => {
    if (!liveRef.current) return;
    liveRef.current.focus();
    document.execCommand(command, false, value);
    onLiveInput();
  };

  // Handle keyboard shortcuts in live contenteditable div
  const onKeyDown = (e) => {
    if (!e.ctrlKey) return;

    switch (e.key.toLowerCase()) {
      case 'b': // Ctrl+B bold
        e.preventDefault();
        execCmd('bold');
        break;
      case 'i': // Ctrl+I italic
        e.preventDefault();
        execCmd('italic');
        break;
      case 'u': // Ctrl+U underline
        e.preventDefault();
        execCmd('underline');
        break;
      case 'z': // Ctrl+Z undo
        e.preventDefault();
        execCmd('undo');
        break;
      case 'y': // Ctrl+Y redo
        e.preventDefault();
        execCmd('redo');
        break;
      default:
        break;
    }
  };

  return (
    <div className="border rounded p-4 bg-white">
      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => execCmd('bold')}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          title="Bold (Ctrl+B)"
        >
          <b>B</b>
        </button>
        <button
          type="button"
          onClick={() => execCmd('italic')}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          title="Italic (Ctrl+I)"
        >
          <i>I</i>
        </button>
        <button
          type="button"
          onClick={() => execCmd('underline')}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          title="Underline (Ctrl+U)"
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
          onClick={() => setMode(mode === 'live' ? 'code' : 'live')}
          className="ml-auto px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          title="Toggle Live / Code View"
        >
          {mode === 'live' ? 'Code View' : 'Live View'}
        </button>
      </div>

      {/* Editable Area */}
      {mode === 'live' ? (
        <div
          ref={liveRef}
          className="border rounded p-3 min-h-[200px] focus:outline-none"
          contentEditable
          spellCheck={true}
          onInput={onLiveInput}
          onKeyDown={onKeyDown}
          suppressContentEditableWarning={true}
          aria-label="HTML Editor"
        />
      ) : (
        <textarea
          ref={codeRef}
          className="w-full h-48 border rounded p-3 font-mono text-sm"
          value={html}
          onChange={onCodeInput}
          spellCheck={false}
          aria-label="HTML Source Code"
        />
      )}
    </div>
  );
}
