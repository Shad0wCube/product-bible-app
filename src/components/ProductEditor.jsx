import React, { useState, useEffect } from 'react';
import DescriptionEditor from './DescriptionEditor';

export default function ProductEditor({ product = {}, onSave, onCancel }) {
  const [title, setTitle] = useState(product.title || '');
  const [description, setDescription] = useState(product.description || '');
  const [categories, setCategories] = useState(product.categories || []);
  const [tags, setTags] = useState(product.tags || []);
  const [images, setImages] = useState(product.images || []);
  const [documents, setDocuments] = useState(product.documents || []);

  // Sync props changes (if product changes while editing)
  useEffect(() => {
    setTitle(product.title || '');
    setDescription(product.description || '');
    setCategories(product.categories || []);
    setTags(product.tags || []);
    setImages(product.images || []);
    setDocuments(product.documents || []);
  }, [product]);

  // Helper: split input by commas into trimmed array
  const parseCSV = (input) =>
    input
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  // For categories and tags input
  const onCategoriesChange = (e) => {
    setCategories(parseCSV(e.target.value));
  };
  const onTagsChange = (e) => {
    setTags(parseCSV(e.target.value));
  };

  // For images and docs input, simple comma-separated URLs
  const onImagesChange = (e) => {
    setImages(parseCSV(e.target.value));
  };
  const onDocumentsChange = (e) => {
    setDocuments(parseCSV(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...product,
      title,
      description,
      categories,
      tags,
      images,
      documents,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-12 z-50 overflow-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-md shadow-lg p-6 max-w-3xl w-full mx-4"
      >
        <h2 className="text-2xl font-bold mb-4">{product.id ? 'Edit Product' : 'Add Product'}</h2>

        <label className="block mb-3">
          <span className="font-semibold text-gray-700">Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-600 focus:border-blue-600"
          />
        </label>

        <DescriptionEditor value={description} onChange={setDescription} />

        <label className="block mb-3">
          <span className="font-semibold text-gray-700">Categories (comma separated)</span>
          <input
            type="text"
            value={categories.join(', ')}
            onChange={onCategoriesChange}
            placeholder="e.g. Hardware, Tools"
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-600 focus:border-blue-600"
          />
        </label>

        <label className="block mb-3">
          <span className="font-semibold text-gray-700">Tags (comma separated)</span>
          <input
            type="text"
            value={tags.join(', ')}
            onChange={onTagsChange}
            placeholder="e.g. durable, steel, anodized"
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-600 focus:border-blue-600"
          />
        </label>

        <label className="block mb-3">
          <span className="font-semibold text-gray-700">Images URLs (comma separated)</span>
          <input
            type="text"
            value={images.join(', ')}
            onChange={onImagesChange}
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-600 focus:border-blue-600"
          />
        </label>

        <label className="block mb-5">
          <span className="font-semibold text-gray-700">Documents URLs (comma separated)</span>
          <input
            type="text"
            value={documents.join(', ')}
            onChange={onDocumentsChange}
            placeholder="https://example.com/manual.pdf"
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-600 focus:border-blue-600"
          />
        </label>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
