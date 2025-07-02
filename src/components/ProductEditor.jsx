import React, { useState } from 'react';
import DescriptionEditor from './DescriptionEditor';

export default function ProductEditor({ product, onSave, onCancel }) {
  const [title, setTitle] = useState(product.title || '');
  const [description, setDescription] = useState(product.description || '');
  const [categories, setCategories] = useState(product.categories || []);
  const [tags, setTags] = useState(product.tags || []);
  const [images, setImages] = useState(product.images || []);
  const [variants, setVariants] = useState(product.variants || []);

  const [newVariant, setNewVariant] = useState({
    sku: '',
    option1: '',
    option2: '',
    option3: '',
    price: '',
    barcode: '',
    inventory_quantity: 0,
  });

  const handleAddVariant = () => {
    if (!newVariant.sku) return alert('Variant SKU is required');
    setVariants([...variants, newVariant]);
    setNewVariant({
      sku: '',
      option1: '',
      option2: '',
      option3: '',
      price: '',
      barcode: '',
      inventory_quantity: 0,
    });
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleRemoveVariant = (index) => {
    if (!window.confirm('Are you sure you want to delete this variant?')) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSaveClick = () => {
    onSave({
      ...product,
      title,
      description,
      categories,
      tags,
      images,
      variants,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start p-6 overflow-auto z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{product.id ? 'Edit Product' : 'Add Product'}</h2>

        <label className="block mb-2 font-semibold">
          Title
          <input
            type="text"
            className="w-full border rounded p-2 mt-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className="block mb-4 font-semibold">
          Description
          <DescriptionEditor value={description} onChange={setDescription} />
        </label>

        <label className="block mb-2 font-semibold">
          Categories (comma separated)
          <input
            type="text"
            className="w-full border rounded p-2 mt-1"
            value={categories.join(', ')}
            onChange={(e) => setCategories(e.target.value.split(',').map(c => c.trim()))}
          />
        </label>

        <label className="block mb-4 font-semibold">
          Tags (comma separated)
          <input
            type="text"
            className="w-full border rounded p-2 mt-1"
            value={tags.join(', ')}
            onChange={(e) => setTags(e.target.value.split(',').map(t => t.trim()))}
          />
        </label>

        <label className="block mb-4 font-semibold">
          Images (URLs, comma separated)
          <input
            type="text"
            className="w-full border rounded p-2 mt-1"
            value={images.join(', ')}
            onChange={(e) => setImages(e.target.value.split(',').map(i => i.trim()))}
          />
        </label>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Variants</h3>
          {variants.length === 0 && <p className="text-gray-500">No variants added.</p>}
          {variants.map((v, i) => (
            <div key={i} className="border p-3 rounded mb-2 flex flex-wrap gap-2 items-center">
              <input
                type="text"
                placeholder="SKU"
                value={v.sku}
                onChange={(e) => handleVariantChange(i, 'sku', e.target.value)}
                className="border rounded p-1 w-24"
              />
              <input
                type="text"
                placeholder="Option 1"
                value={v.option1}
                onChange={(e) => handleVariantChange(i, 'option1', e.target.value)}
                className="border rounded p-1 w-24"
              />
              <input
                type="text"
                placeholder="Option 2"
                value={v.option2}
                onChange={(e) => handleVariantChange(i, 'option2', e.target                value={v.option2}
                onChange={(e) => handleVariantChange(i, 'option2', e.target.value)}
                className="border rounded p-1 w-24"
              />
              <input
                type="text"
                placeholder="Option 3"
                value={v.option3}
                onChange={(e) => handleVariantChange(i, 'option3', e.target.value)}
                className="border rounded p-1 w-24"
              />
              <input
                type="text"
                placeholder="Price (£)"
                value={v.price}
                onChange={(e) => handleVariantChange(i, 'price', e.target.value)}
                className="border rounded p-1 w-20"
              />
              <input
                type="text"
                placeholder="Barcode"
                value={v.barcode}
                onChange={(e) => handleVariantChange(i, 'barcode', e.target.value)}
                className="border rounded p-1 w-28"
              />
              <input
                type="number"
                placeholder="Inventory"
                value={v.inventory_quantity}
                onChange={(e) => handleVariantChange(i, 'inventory_quantity', Number(e.target.value))}
                className="border rounded p-1 w-20"
                min={0}
              />
              <button
                onClick={() => handleRemoveVariant(i)}
                className="text-red-600 hover:underline ml-2"
                type="button"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="border p-3 rounded flex flex-wrap gap-2 items-center mt-4">
            <input
              type="text"
              placeholder="SKU"
              value={newVariant.sku}
              onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
              className="border rounded p-1 w-24"
            />
            <input
              type="text"
              placeholder="Option 1"
              value={newVariant.option1}
              onChange={(e) => setNewVariant({ ...newVariant, option1: e.target.value })}
              className="border rounded p-1 w-24"
            />
            <input
              type="text"
              placeholder="Option 2"
              value={newVariant.option2}
              onChange={(e) => setNewVariant({ ...newVariant, option2: e.target.value })}
              className="border rounded p-1 w-24"
            />
            <input
              type="text"
              placeholder="Option 3"
              value={newVariant.option3}
              onChange={(e) => setNewVariant({ ...newVariant, option3: e.target.value })}
              className="border rounded p-1 w-24"
            />
            <input
              type="text"
              placeholder="Price (£)"
              value={newVariant.price}
              onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
              className="border rounded p-1 w-20"
            />
            <input
              type="text"
              placeholder="Barcode"
              value={newVariant.barcode}
              onChange={(e) => setNewVariant({ ...newVariant, barcode: e.target.value })}
              className="border rounded p-1 w-28"
            />
            <input
              type="number"
              placeholder="Inventory"
              value={newVariant.inventory_quantity}
              onChange={(e) =>
                setNewVariant({ ...newVariant, inventory_quantity: Number(e.target.value) })
              }
              className="border rounded p-1 w-20"
              min={0}
            />
            <button
              onClick={handleAddVariant}
              className="bg-green-600 text-white px-3 py-1 rounded"
              type="button"
            >
              Add Variant
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            type="button"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

