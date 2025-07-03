import React, { useState } from 'react';
import DescriptionEditor from './DescriptionEditor';

export default function ProductEditor({ product, onSave, onCancel }) {
  const [title, setTitle] = useState(product.title || '');
  const [description, setDescription] = useState(product.description || '');
  const [categories, setCategories] = useState(product.categories || []);
  const [tags, setTags] = useState(product.tags || []);
  const [images, setImages] = useState(product.images || []);
  const [variants, setVariants] = useState(product.variants || []);

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
      <div className="bg-white p-6 rounded shadow max-w-4xl w-full overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Product Title"
            value={title}
            onChange={handleChange(setTitle)}
            className="border px-2 py-1 rounded w-full"
          />

          <DescriptionEditor value={description} onChange={setDescription} />

          <input
            type="text"
            placeholder="Categories (comma separated)"
            value={categories.join(', ')}
            onChange={handleCategoryChange}
            className="border px-2 py-1 rounded w-full"
          />

          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags.join(', ')}
            onChange={handleTagChange}
            className="border px-2 py-1 rounded w-full"
          />

          <div>
            <label className="font-semibold">Images:</label>
            {images.map((img, i) => (
              <div key={i} className="flex gap-2 mt-1">
                <input
                  type="text"
                  placeholder="Image URL"
                  value={img}
                  onChange={(e) => handleImageChange(i, e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                />
                <button
                  onClick={() => removeImage(i)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addImage}
              className="mt-2 text-blue-600 hover:underline"
            >
              + Add Image
            </button>
          </div>

          <div>
            <label className="font-semibold">Variants:</label>
            {variants.map((v, i) => (
              <div key={i} className="border p-2 rounded mt-2 space-y-1">
                <input
                  type="text"
                  placeholder="SKU"
                  value={v.sku}
                  onChange={(e) => handleVariantChange(i, 'sku', e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Option 1"
                    value={v.option1}
                    onChange={(e) => handleVariantChange(i, 'option1', e.target.value)}
                    className="border rounded p-1 w-1/3"
                  />
                  <input
                    type="text"
                    placeholder="Option 2"
                    value={v.option2}
                    onChange={(e) => handleVariantChange(i, 'option2', e.target.value)}
                    className="border rounded p-1 w-1/3"
                  />
                  <input
                    type="text"
                    placeholder="Option 3"
                    value={v.option3}
                    onChange={(e) => handleVariantChange(i, 'option3', e.target.value)}
                    className="border rounded p-1 w-1/3"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Price"
                    value={v.price}
                    onChange={(e) => handleVariantChange(i, 'price', e.target.value)}
                    className="border rounded p-1 w-1/3"
                  />
                  <input
                    type="text"
                    placeholder="Quantity"
                    value={v.quantity}
                    onChange={(e) => handleVariantChange(i, 'quantity', e.target.value)}
                    className="border rounded p-1 w-1/3"
                  />
                  <input
                    type="text"
                    placeholder="Barcode"
                    value={v.barcode}
                    onChange={(e) => handleVariantChange(i, 'barcode', e.target.value)}
                    className="border rounded p-1 w-1/3"
                  />
                </div>
                <button
                  onClick={() => removeVariant(i)}
                  className="text-red-600 hover:underline"
                >
                  Remove Variant
                </button>
              </div>
            ))}
            <button
              onClick={addVariant}
              className="mt-2 text-blue-600 hover:underline"
            >
              + Add Variant
            </button>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-300">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
