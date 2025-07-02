// frontend/src/components/ProductEditor.jsx
import React, { useState, useEffect } from 'react';

export default function ProductEditor({ product, onSave, onCancel }) {
  const [title, setTitle] = useState(product.title || '');
  const [description, setDescription] = useState(product.description || '');
  const [categories, setCategories] = useState(product.categories ? product.categories.join(', ') : '');
  const [specifications, setSpecifications] = useState(product.specifications || {});
  const [images, setImages] = useState(product.images || []);

  useEffect(() => {
    setTitle(product.title || '');
    setDescription(product.description || '');
    setCategories(product.categories ? product.categories.join(', ') : '');
    setSpecifications(product.specifications || {});
    setImages(product.images || []);
  }, [product]);

  // For simple specs editing as key-value pairs
  const updateSpec = (key, value) => {
    setSpecifications(prev => ({ ...prev, [key]: value }));
  };

  const removeSpec = (key) => {
    setSpecifications(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  // Images URL handlers
  const addImage = () => {
    setImages(prev => [...prev, '']);
  };

  const updateImage = (index, url) => {
    setImages(prev => {
      const copy = [...prev];
      copy[index] = url;
      return copy;
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const catArray = categories.split(',').map(c => c.trim()).filter(c => c.length);
    onSave({
      ...product,
      title,
      description,
      categories: catArray,
      specifications,
      images,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-10 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded p-6 max-w-3xl w-full overflow-auto max-h-[90vh] shadow-lg"
      >
        <h2 className="text-2xl mb-4">{product.id ? 'Edit Product' : 'Add Product'}</h2>

        <label className="block mb-2 font-semibold">Title</label>
        <input
          type="text"
          className="border p-2 w-full mb-4"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <label className="block mb-2 font-semibold">Description</label>
        <textarea
          className="border p-2 w-full mb-4"
          rows={4}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <label className="block mb-2 font-semibold">Categories (comma separated)</label>
        <input
          type="text"
          className="border p-2 w-full mb-4"
          value={categories}
          onChange={e => setCategories(e.target.value)}
        />

        <fieldset className="mb-4">
          <legend className="font-semibold mb-2">Specifications</legend>
          {Object.entries(specifications).map(([key, val], idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Key"
                className="border p-1 flex-1"
                value={key}
                disabled
              />
              <input
                type="text"
                placeholder="Value"
                className="border p-1 flex-1"
                value={val}
                onChange={e => updateSpec(key, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeSpec(key)}
                className="text-red-600 font-bold"
              >
                &times;
              </button>
            </div>
          ))}
          <AddSpecInput onAdd={(k, v) => updateSpec(k, v)} />
        </fieldset>

        <fieldset className="mb-4">
          <legend className="font-semibold mb-2">Image URLs</legend>
          {images.map((url, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                className="border p-1 flex-1"
                value={url}
                onChange={e => updateImage(i, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="text-red-600 font-bold"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addImage}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            + Add Image URL
          </button>
        </fieldset>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

function AddSpecInput({ onAdd }) {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  const add = () => {
    if (key.trim() && value.trim()) {
      onAdd(key.trim(), value.trim());
      setKey('');
      setValue('');
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="New spec key"
        className="border p-1 flex-1"
        value={key}
        onChange={e => setKey(e.target.value)}
      />
      <input
        type="text"
        placeholder="New spec value"
        className="border p-1 flex-1"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button
        type="button"
        onClick={add}
        className="bg-green-600 text-white px-3 rounded"
      >
        +
      </button>
    </div>
  );
}
