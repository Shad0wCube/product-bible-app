import React, { useState, useEffect } from 'react';
import DescriptionEditor from './DescriptionEditor';

export default function ProductEditor({ product, onSave, onCancel }) {
  const [title, setTitle] = useState(product.title || '');
  const [description, setDescription] = useState(product.description || '');
  const [categories, setCategories] = useState(product.categories || []);
  const [tags, setTags] = useState(product.tags || []);
  const [images, setImages] = useState(product.images || []);
  const [variants, setVariants] = useState(product.variants || []);

  useEffect(() => {
    setTitle(product.title || '');
    setDescription(product.description || '');
    setCategories(product.categories || []);
    setTags(product.tags || []);
    setImages(product.images || []);
    setVariants(product.variants || []);
  }, [product]);

  const handleChange = (setter) => (e) => setter(e.target.value);

  const handleTagChange = (e) => {
    setTags(e.target.value.split(',').map((tag) => tag.trim()));
  };

  const handleCategoryChange = (e) => {
    setCategories(e.target.value.split(',').map((cat) => cat.trim()));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImage = () => setImages([...images, '']);
  const removeImage = (index) => setImages(images.filter((_, i) => i !== index));

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const addVariant = () =>
    setVariants([
      ...variants,
      {
        sku: '',
        option1: '',
        option2: '',
        option3: '',
        price: '',
        quantity: '',
        barcode: '',
      },
    ]);

  const removeVariant = (index) => setVariants(variants.filter((_, i) => i !== index));

  const handleSubmit = () => {
    onSave({ ...product, title, description, categories, tags, images, variants });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
        <div className="mb-4">
          <label className="block font-semibold">Title</label>
          <input
            type="text"
            value={title}
            onChange={handleChange(setTitle)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Description (HTML)</label>
          <textarea
            rows={6}
            value={description}
            onChange={handleChange(setDescription)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Categories (comma separated)</label>
          <input
            type="text"
            value={categories.join(', ')}
            onChange={handleCategoryChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Tags (comma separated)</label>
          <input
            type="text"
            value={tags.join(', ')}
            onChange={handleTagChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Images URLs</label>
          {images.map((img, i) => (
            <div key={i} className="flex gap-2 mb-1">
              <input
                type="text"
                value={img}
                onChange={(e) => handleImageChange(i, e.target.value)}
                className="flex-grow border px-2 py-1 rounded"
              />
              <button
                onClick={() => removeImage(i)}
                className="bg-red-600 text-white px-2 rounded"
              >
                X
              </button>
            </div>
          ))}
          <button
            onClick={addImage}
            className="bg-blue-600 text-white px-4 py-1 rounded mt-2"
          >
            + Add Image
          </button>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Variants</label>
          {variants.map((variant, i) => (
            <div key={i} className="border p-2 mb-2 rounded">
              <div className="mb-1">
                <label className="block font-semibold">SKU</label>
                <input
                  type="text"
                  value={variant.sku}
                  onChange={(e) => handleVariantChange(i, 'sku', e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div className="mb-1">
                <label className="block font-semibold">Option 1</label>
                <input
                  type="text"
                  value={variant.option1}
                  onChange={(e) => handleVariantChange(i, 'option1', e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div className="mb-1">
                <label className="block font-semibold">Option 2</label>
                <input
                  type="text"
                  value={variant.option2}
                  onChange={(e) => handleVariantChange(i, 'option2', e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div className="mb-1">
                <label className="block font-semibold">Option 3</label>
                <input
                  type="text"
                  value={variant.option3}
                  onChange={(e) => handleVariantChange(i, 'option3', e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div className="mb-1">
                <label className="block font-semibold">Price</label>
                <input
                  type="number"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(i, 'price', e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div className="mb-1">
                <label className="block font-semibold">Quantity</label>
                <input
                  type="number"
                  value={variant.quantity}
                  onChange={(e) => handleVariantChange(i, 'quantity', e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div className="mb-1">
                <label className="block font-semibold">Barcode</label>
                <input
                  type="text"
                  value={variant.barcode}
                  onChange={(e) => handleVariantChange(i, 'barcode', e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <button
                onClick={() => removeVariant(i)}
                className="bg-red-600 text-white px-3 py-1 rounded mt-2"
              >
                Remove Variant
              </button>
            </div>
          ))}
          <button
            onClick={addVariant}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Variant
          </button>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}
