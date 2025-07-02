import React, { useState, useEffect, useRef } from 'react';

export default function ProductEditor({ product, onSave, onCancel }) {
  const [title, setTitle] = useState(product.title || '');
  const [description, setDescription] = useState(product.description || '');
  const [categories, setCategories] = useState(product.categories || []);
  const [images, setImages] = useState(product.images || []);
  const [tags, setTags] = useState(product.tags || []);
  const [editMode, setEditMode] = useState('live'); // 'live' or 'code'

  const descriptionRef = useRef(null);

  useEffect(() => {
    setTitle(product.title || '');
    setDescription(product.description || '');
    setCategories(product.categories || []);
    setImages(product.images || []);
    setTags(product.tags || []);
  }, [product]);

  // Cursor fix for Enter key in contentEditable (prevents cursor jump to start)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      // Insert <br> at cursor position
      const sel = window.getSelection();
      if (!sel.rangeCount) return;

      const range = sel.getRangeAt(0);
      const br = document.createElement('br');
      range.deleteContents();
      range.insertNode(br);

      // Move cursor after the <br>
      range.setStartAfter(br);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    // Undo (Ctrl+Z) and Redo (Ctrl+Y)
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
      document.execCommand('undo');
      e.preventDefault();
    } else if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z') || 
               ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y')) {
      document.execCommand('redo');
      e.preventDefault();
    }
  };

  // Sync contentEditable div content with state
  const handleDescriptionInput = (e) => {
    setDescription(e.target.innerHTML);
  };

  const handleSaveClick = () => {
    onSave({
      ...product,
      title,
      description,
      categories,
      images,
      tags,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-10 z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 m-4">
        <h2 className="text-2xl font-bold mb-4">
          {product.id ? 'Edit Product' : 'Add Product'}
        </h2>

        {/* Title */}
        <label className="block mb-4">
          <span className="font-semibold">Title</span>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border rounded px-2 py-1 mt-1"
          />
        </label>

        {/* Categories (comma separated) */}
        <label className="block mb-4">
          <span className="font-semibold">Categories</span>
          <input
            type="text"
            value={categories.join(', ')}
            onChange={e => setCategories(e.target.value.split(',').map(s => s.trim()))}
            className="w-full border rounded px-2 py-1 mt-1"
            placeholder="Comma separated categories"
          />
        </label>

        {/* Tags (comma separated) */}
        <label className="block mb-4">
          <span className="font-semibold">Tags</span>
          <input
            type="text"
            value={tags.join(', ')}
            onChange={e => setTags(e.target.value.split(',').map(s => s.trim()))}
            className="w-full border rounded px-2 py-1 mt-1"
            placeholder="Comma separated tags"
          />
        </label>

        {/* Images (comma separated URLs) */}
        <label className="block mb-4">
          <span className="font-semibold">Images URLs</span>
          <input
            type="text"
            value={images.join(', ')}
            onChange={e => setImages(e.target.value.split(',').map(s => s.trim()))}
            className="w-full border rounded px-2 py-1 mt-1"
            placeholder="Comma separated image URLs"
          />
        </label>

        {/* Description with tabs for Code / Live */}
        <div className="mb-4">
          <div className="flex mb-2 border-b">
            <button
              onClick={() => setEditMode('live')}
              className={`px-4 py-1 font-semibold ${editMode === 'live' ? 'border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Live View
            </button>
            <button
              onClick={() => setEditMode('code')}
              className={`px-4 py-1 font-semibold ${editMode === 'code' ? 'border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              HTML Code
            </button>
          </div>

          {editMode === 'live' ? (
            <div
              ref={descriptionRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleDescriptionInput}
              onKeyDown={handleKeyDown}
              className="border rounded p-3 min-h-[150px] overflow-auto prose max-w-none"
              dangerouslySetInnerHTML={{ __html: description }}
              spellCheck={true}
            />
          ) : (
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full border rounded p-3 min-h-[150px] font-mono text-sm"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
