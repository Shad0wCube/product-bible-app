import React, { useState, useEffect } from 'react';

export default function ProductEditor({ product, onSave, onCancel }) {
  const [title, setTitle] = useState(product.title || '');
  const [description, setDescription] = useState(product.description || '');
  const [tags, setTags] = useState(product.tags ? product.tags.join(', ') : '');
  const [images, setImages] = useState(product.images || []);
  const [variants, setVariants] = useState(product.variants || []);

  useEffect(() => {
    setTitle(product.title || '');
    setDescription(product.description || '');
    setTags(product.tags ? product.tags.join(', ') : '');
    setImages(product.images || []);
    setVariants(product.variants || []);
  }, [product]);

  const handleAddVariant = () => {
    setVariants([...variants, { sku: '', option1: '', option2: '', option3: '', price: '', quantity: '', barcode: '' }]);
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleRemoveVariant = (index) => {
    const updated = [...variants];
    updated.splice(index, 1);
    setVariants(updated);
  };

  const handleAddImage = () => {
    const url = prompt('Enter image URL:');
    if (url) setImages([...images, url]);
  };

  const handleRemoveImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleSave = () => {
    onSave({
      ...product,
      title,
      description,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      images,
      variants
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start p-6 overflow-auto z-50">
      <div className="bg-white rounded shadow-lg max-w-4xl w-full p-6 relative">
        <h2 className="text-2xl font-bold mb-4">{product.id ? 'Edit Product' : 'Add Product'}</h2>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Description (HTML)</label>
          <textarea
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Images</label>
          <div className="flex gap-2 flex-wrap">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} alt={`Product Image ${i + 1}`} className="w-24 h-24 object-cover rounded" />
                <button
                  onClick={() => handleRemoveImage(i)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-2"
                  title="Remove image"
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              onClick={handleAddImage}
              className="w-24 h-24 border-dashed border-2 border-gray-400 rounded flex items-center justify-center text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              + Add Image
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Variants</label>
          {variants.map((variant, i) => (
            <div key={i} className="border p-3 mb-2 rounded grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="SKU"
                value={variant.sku || ''}
                onChange={e => handleVariantChange(i, 'sku', e.target.value)}
                className="border rounded px-2 py-1"
              />
              <input
                type="text"
                placeholder="Option1"
                value={variant.option1 || ''}
                onChange={e => handleVariantChange(i, 'option1', e.target.value)}
                className="border rounded px-2 py-1"
              />
              <input
                type="text"
                placeholder="Option2"
                value={variant.option2 || ''}
                onChange={e => handleVariantChange(i, 'option2', e.target.value)}
                className="border rounded px-2 py-1"
              />
              <input
                type="text"
                placeholder="Option3"
                value={variant.option3 || ''}
                onChange={e => handleVariantChange(i, 'option3', e.target.value)}
                className="border rounded px-2 py-1"
              />
              <input
                type="text"
                placeholder="Price"
                value={variant.price || ''}
                onChange={e => handleVariantChange(i, 'price', e.target.value)}
                className="border rounded px-2 py-1"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={variant.quantity || ''}
                onChange={e => handleVariantChange(i, 'quantity', e.target.value)}
                className="border rounded px-2 py-1"
                min="0"
              />
              <input
                type="text"
                placeholder="Barcode"
                value={variant.barcode || ''}
                onChange={e => handleVariantChange(i, 'barcode', e.target.value)}
                className="border rounded px-2 py-1 col-span-2"
              />
              <button
                onClick={() => handleRemoveVariant(i)}
                className="bg-red-600 text-white px-3 py-1 rounded self-center col-span-2"
              >
                Remove Variant
              </button>
            </div>
          ))}
          <button
            onClick={handleAddVariant}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
          >
            + Add Variant
          </button>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border border-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}
