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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded shadow-lg max-w-xl w-full p-6 overflow-auto max-h-[90vh]"
      >
        <h2 className="text-2xl font-bold mb-4">
          {product.id ? 'Edit Product' : 'Add Product'}
        </h2>

        <label className="block mb-2 font-semibold">
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </label>

        <label className="block mb-2 font-semibold">
          Description (HTML allowed)
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </label>

        <label className="block mb-2 font-semibold">
          Categories (comma-separated)
          <input
            type="text"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            placeholder="Category1, Category2"
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </label>

        <label className="block mb-2 font-semibold">
          Images (one URL per line)
          <textarea
            value={images}
            onChange={(e) => setImages(e.target.value)}
            rows={4}
            placeholder="https://example.com/image1.jpg"
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </label>

        <label className="block mb-2 font-semibold">
          Tags (comma-separated)
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tag1, tag2"
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </label>

        <label className="block mb-2 font-semibold">
          SKU
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </label>

        <label className="block mb-4 font-semibold">
          Barcode
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </label>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
