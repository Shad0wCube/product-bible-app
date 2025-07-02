import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill styles

export default function ProductEditor({ product, onSave, onCancel }) {
  const [title, setTitle] = useState(product.title || '');
  const [description, setDescription] = useState(product.description || '');
  const [categories, setCategories] = useState(product.categories || []);
  const [images, setImages] = useState(product.images || []);
  const [tags, setTags] = useState(product.tags || []);
  const [editMode, setEditMode] = useState('live'); // 'live' or 'code'

  useEffect(() => {
    setTitle(product.title || '');
    setDescription(product.description || '');
    setCategories(product.categories || []);
    setImages(product.images || []);
    setTags(product.tags || []);
  }, [product]);

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

        {/* Categories */}
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

        {/* Tags */}
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

        {/* Images */}
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

        {/* Description Editor Tabs */}
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
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link', 'image'],
                  ['clean'],
                ],
              }}
              formats={[
                'header',
                'bold', 'italic', 'underline', 'strike', 'blockquote',
                'list', 'bullet',
                'link', 'image',
              ]}
              style={{ minHeight: '150px' }}
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
