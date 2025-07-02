import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function ProductEditor({ product = {}, onSave, onCancel }) {
  const [title, setTitle] = useState(product.title || '');
  const [description, setDescription] = useState(product.description || '');
  const [categories, setCategories] = useState(product.categories || []);
  const [tags, setTags] = useState(product.tags || []);
  const [images, setImages] = useState(product.images || []);
  
  // Variant option names, editable, default British English
  const [optionNames, setOptionNames] = useState(
    product.optionNames || ['Colour', 'Size', 'Material']
  );
  // Variants array
  const [variants, setVariants] = useState(product.variants || []);

  // Handle adding/removing categories, tags, images, variants, and option names
  // For simplicity, just comma separated input for categories and tags:
  const onCategoriesChange = (e) => setCategories(e.target.value.split(',').map(s => s.trim()).filter(Boolean));
  const onTagsChange = (e) => setTags(e.target.value.split(',').map(s => s.trim()).filter(Boolean));
  const onImagesChange = (e) => setImages(e.target.value.split(',').map(s => s.trim()).filter(Boolean));

  // Variant option names editing handlers:
  const setOptionName = (index, value) => {
    const newOptionNames = [...optionNames];
    newOptionNames[index] = value;
    setOptionNames(newOptionNames);
  };

  // Variant editing handlers
  const updateVariant = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  // Add a blank variant
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: crypto.randomUUID(),
        options: ['', '', ''], // Three option slots
        sku: '',
        price: '',
        barcode: '',
        inventory_quantity: '',
      },
    ]);
  };

  // Remove variant by index
  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // Save handler
  const handleSubmit = () => {
    // Build product object to save
    const toSave = {
      ...product,
      title,
      description,
      categories,
      tags,
      images,
      optionNames,
      variants,
    };
    onSave(toSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50 overflow-auto">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-full overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-4">{product.id ? 'Edit Product' : 'Add Product'}</h2>

        <label className="block mb-2 font-semibold">
          Title
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="border p-2 w-full rounded mt-1"
          />
        </label>

        <label className="block mb-4 font-semibold">
          Description (HTML)
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            className="mb-4"
          />
        </label>

        <label className="block mb-2 font-semibold">
          Categories (comma separated)
          <input
            type="text"
            value={categories.join(', ')}
            onChange={onCategoriesChange}
            className="border p-2 w-full rounded mt-1"
          />
        </label>

        <label className="block mb-2 font-semibold">
          Tags (comma separated)
          <input
            type="text"
            value={tags.join(', ')}
            onChange={onTagsChange}
            className="border p-2 w-full rounded mt-1"
          />
        </label>

        <label className="block mb-4 font-semibold">
          Images URLs (comma separated)
          <input
            type="text"
            value={images.join(', ')}
            onChange={onImagesChange}
            className="border p-2 w-full rounded mt-1"
          />
        </label>

        {/* Variant option names */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Variant Option Names (British English)</h3>
          <div className="flex gap-4">
            {optionNames.map((name, i) => (
              <input
                key={i}
                type="text"
                value={name}
                placeholder={`Option ${i + 1}`}
                onChange={e => setOptionName(i, e.target.value)}
                className="border p-2 rounded flex-1"
              />
            ))}
          </div>
        </div>

        {/* Variants editor */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Variants</h3>
          {variants.length === 0 && (
            <p className="mb-2 text-gray-600">No variants yet. Add one below.</p>
          )}

          {variants.map((variant, index) => (
            <div
              key={variant.id}
              className="border rounded p-4 mb-4 bg-gray-50 flex flex-col md:flex-row md:items-center md:gap-4"
            >
              <div className="flex flex-col gap-2 flex-1">
                {optionNames.map((optName, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`${optName} value`}
                    value={variant.options?.[i] || ''}
                    onChange={e => {
                      const newOptions = [...(variant.options || [])];
                      newOptions[i] = e.target.value;
                      updateVariant(index, 'options', newOptions);
                    }}
                    className="border p-2 rounded w-full"
                  />
                ))}
              </div>
              <input
                type="text"
                placeholder="SKU"
                value={variant.sku}
                onChange={e => updateVariant(index, 'sku', e.target.value)}
                className="border p-2 rounded w-24 mt-2 md:mt-0"
              />
              <input
                type="number"
                placeholder="Price"
                value={variant.price}
                onChange={e => updateVariant(index, 'price', e.target.value)}
                className="border p-2 rounded w-24 mt-2 md:mt-0"
                step="0.01"
                min="0"
              />
              <input
                type="text"
                placeholder="Barcode"
                value={variant.barcode}
                onChange={e => updateVariant(index, 'barcode', e.target.value)}
                className="border p-2 rounded w-32 mt-2 md:mt-0"
              />
              <input
                type="number"
                placeholder="Inventory"
                value={variant.inventory_quantity}
                onChange={e => updateVariant(index, 'inventory_quantity', e.target.value)}
                className="border p-2 rounded w-24 mt-2 md:mt-0"
                min="0"
              />
              <button
                onClick={() => removeVariant(index)}
                className="text-red-600 hover:text-red-800 ml-auto md:ml-0 mt-2 md:mt-0 font-semibold"
                title="Remove variant"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            onClick={addVariant}
            className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
          >
            + Add Variant
          </button>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="border px-4 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}
