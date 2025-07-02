import React, { useState, useEffect } from 'react';

export default function ProductEditor({ product, onSave, onCancel }) {
  const [title, setTitle] = useState(product.title || '');
  const [categories, setCategories] = useState((product.categories || []).join(', '));
  const [images, setImages] = useState(product.images || []);
  const [tags, setTags] = useState((product.tags || []).join(', '));
  const [description, setDescription] = useState(product.description || '');
  const [tab, setTab] = useState('live'); // 'live' or 'code'

  // Update local states if product prop changes (e.g., editing a different product)
  useEffect(() => {
    setTitle(product.title || '');
    setCategories((product.categories || []).join(', '));
    setImages(product.images || []);
    setTags((product.tags || []).join(', '));
    setDescription(product.description || '');
    setTab('live');
  }, [product]);

  // Handle image URLs input as a single textarea (one URL per line)
  const handleImagesChange = (e) => {
    const urls = e.target.value
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length);
    setImages(urls);
  };

  // Helper to convert comma-separated string to trimmed array
  const parseCSV = (str) => {
    return str
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length);
  };

  // Prepare product data for saving
  const handleSaveClick = () => {
    const updated = {
      ...product,
      title: title.trim(),
      categories: parseCSV(categories),
      images,
      tags: parseCSV(tags),
      description,
    };
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start overflow-auto z-50 p-6">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6">
        <h2 className="text-2xl font-bold mb-4">{product.id ? 'Edit Product' : 'Add New Product'}</h2>

        {/* Title */}
        <label className="block mb-3">
          <span className="font-semibold">Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded"
          />
        </label>

        {/* Categories (Collections) */}
        <label className="block mb-3">
          <span className="font-semibold">Categories (comma separated)</span>
          <input
            type="text"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded"
            placeholder="e.g. Hardware, Bathroom, Kitchen"
          />
        </label>

        {/* Tags */}
        <label className="block mb-3">
          <span className="font-semibold">Tags (comma separated)</span>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded"
            placeholder="e.g. brass, metal, decorative"
          />
        </label>

        {/* Images */}
        <label className="block mb-3">
          <span className="font-semibold">Image URLs (one per line)</span>
          <textarea
            rows={4}
            value={images.join('\n')}
            onChange={handleImagesChange}
            className="w-full mt-1 px-3 py-2 border rounded font-mono"
            placeholder="https://example.com/image1.jpg"
          />
        </label>

        {/* Description editor with tabs */}
        <div className="mb-3">
          <div className="flex border-b border-gray-300 mb-1">
            <button
              className={`px-4 py-2 -mb-px font-semibold border-b-2 ${
                tab === 'live' ? 'border-blue-600 text-blue-600' : 'border-transparent'
              }`}
              onClick={() => setTab('live')}
            >
              Live Preview
            </button>
            <button
              className={`px-4 py-2 -mb-px font-semibold border-b-2 ${
                tab === 'code' ? 'border-blue-600 text-blue-600' : 'border-transparent'
              }`}
              onClick={() => setTab('code')}
            >
              HTML Code
            </button>
          </div>

          {tab === 'code' ? (
            <textarea
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded font-mono"
            />
          ) : (
            <div
              className="border rounded p-3 min-h-[150px] overflow-auto"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => setDescription(e.currentTarget.innerHTML)}
              dangerouslySetInnerHTML={{ __html: description }}
              style={{ whiteSpace: 'pre-wrap' }}
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!title.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
