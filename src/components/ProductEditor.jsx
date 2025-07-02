import React, { useState, useEffect } from 'react';

export default function ProductEditor({ product, onSave, onCancel }) {
  const [title, setTitle] = useState(product.title || '');
  const [description, setDescription] = useState(product.description || '');
  const [categories, setCategories] = useState(
    product.categories ? product.categories.join(', ') : ''
  );
  const [images, setImages] = useState(product.images ? product.images.join('\n') : '');
  const [tags, setTags] = useState(product.tags ? product.tags.join(', ') : '');
  const [sku, setSku] = useState(product.sku || '');
  const [barcode, setBarcode] = useState(product.barcode || '');
  const [descMode, setDescMode] = useState('code'); // 'code' or 'preview'

  useEffect(() => {
    setTitle(product.title || '');
    setDescription(product.description || '');
    setCategories(product.categories ? product.categories.join(', ') : '');
    setImages(product.images ? product.images.join('\n') : '');
    setTags(product.tags ? product.tags.join(', ') : '');
    setSku(product.sku || '');
    setBarcode(product.barcode || '');
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...product,
      title: title.trim(),
      description,
      categories: categories
        ? categories.split(',').map((c) => c.trim()).filter(Boolean)
        : [],
      images: images
        ? images
            .split('\n')
            .map((url) => url.trim())
            .filter(Boolean)
        : [],
      tags: tags
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      sku: sku.trim(),
      barcode: barcode.trim(),
    };
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8 overflow-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-gray-900">
          {product.id ? 'Edit Product' : 'Add Product'}
        </h2>

        {/* Title */}
        <label className="block mb-5">
          <span className="text-gray-700 font-semibold mb-1 block">Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Product Title"
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          />
        </label>

        {/* Description with tabs */}
        <label className="block mb-5">
          <span className="text-gray-700 font-semibold mb-1 block">Description (HTML)</span>
          <div className="mb-2 flex border border-gray-300 rounded-t-md overflow-hidden">
            <button
              type="button"
              onClick={() => setDescMode('code')}
              className={`flex-1 py-2 text-center font-semibold ${
                descMode === 'code'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition`}
            >
              Code
            </button>
            <button
              type="button"
              onClick={() => setDescMode('preview')}
              className={`flex-1 py-2 text-center font-semibold ${
                descMode === 'preview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition`}
            >
              Preview
            </button>
          </div>
          {descMode === 'code' ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Write HTML description here..."
              className="w-full border border-gray-300 rounded-b-md px-4 py-3 text-gray-900 resize-y focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition font-mono"
            />
          ) : (
            <div
              className="w-full border border-gray-300 rounded-b-md p-4 bg-gray-50 min-h-[150px] overflow-auto"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </label>

        {/* Categories */}
        <label className="block mb-5">
          <span className="text-gray-700 font-semibold mb-1 block">Categories (comma-separated)</span>
          <input
            type="text"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            placeholder="Category1, Category2"
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          />
        </label>

        {/* Images */}
        <label className="block mb-5">
          <span className="text-gray-700 font-semibold mb-1 block">Images (one URL per line)</span>
          <textarea
            value={images}
            onChange={(e) => setImages(e.target.value)}
            rows={4}
            placeholder="https://example.com/image1.jpg"
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 resize-y focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          />
        </label>

        {/* Tags */}
        <label className="block mb-5">
          <span className="text-gray-700 font-semibold mb-1 block">Tags (comma-separated)</span>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tag1, tag2"
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          />
        </label>

        {/* SKU & Barcode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          <label>
            <span className="text-gray-700 font-semibold mb-1 block">SKU</span>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="SKU"
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            />
          </label>

          <label>
            <span className="text-gray-700 font-semibold mb-1 block">Barcode</span>
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Barcode"
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            />
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-3 rounded-md transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
