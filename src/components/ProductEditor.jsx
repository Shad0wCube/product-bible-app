import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

export default function ProductEditor({ product, onSave, onCancel }) {
  const [title, setTitle] = useState(product.title || '');
  const [handle, setHandle] = useState(product.handle || '');
  const [description, setDescription] = useState(product.description || '');
  const [categories, setCategories] = useState(product.categories || []);
  const [tags, setTags] = useState(product.tags || []);
  const [images, setImages] = useState(product.images || []);
  const [variants, setVariants] = useState(product.variants || []);

  const addImage = () => setImages([...images, '']);
  const updateImage = (idx, val) => {
    const copy = [...images];
    copy[idx] = val;
    setImages(copy);
  };
  const removeImage = (idx) => setImages(images.filter((_, i) => i !== idx));

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: crypto.randomUUID(),
        sku: '',
        price: '',
        barcode: '',
        inventory_quantity: '',
        option1_name: '',
        option1_value: '',
        option2_name: '',
        option2_value: '',
        option3_name: '',
        option3_value: '',
      },
    ]);
  };
  const updateVariant = (idx, field, val) => {
    const copy = [...variants];
    copy[idx][field] = val;
    setVariants(copy);
  };
  const removeVariant = (idx) => setVariants(variants.filter((_, i) => i !== idx));

  const handleSaveClick = () => {
    const finalHandle = handle.trim() || slugify(title);
    onSave({
      ...product,
      title,
      handle: finalHandle,
      description,
      categories,
      tags,
      images: images.filter((img) => img.trim()),
      variants,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 overflow-auto z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

        {/* Title */}
        <label className="block mb-2 font-semibold">Title</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Handle */}
        <label className="block mb-2 font-semibold">Handle (unique ID)</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 mb-4"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="Leave empty to auto-generate from title"
        />

        {/* Description */}
        <label className="block mb-2 font-semibold">Description (HTML)</label>
        <ReactQuill
          theme="snow"
          value={description}
          onChange={setDescription}
          className="mb-4"
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image'],
              ['clean'],
            ],
          }}
        />

        {/* Categories / Collections */}
        <label className="block mb-2 font-semibold">Categories / Collections</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 mb-4"
          value={categories.join(', ')}
          onChange={(e) => setCategories(e.target.value.split(',').map((s) => s.trim()))}
          placeholder="Comma separated"
        />

        {/* Tags */}
        <label className="block mb-2 font-semibold">Tags</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 mb-4"
          value={tags.join(', ')}
          onChange={(e) => setTags(e.target.value.split(',').map((s) => s.trim()))}
          placeholder="Comma separated"
        />

        {/* Images */}
        <label className="block mb-2 font-semibold">Images URLs</label>
        {images.map((img, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              className="flex-grow border rounded px-3 py-2"
              value={img}
              onChange={(e) => updateImage(i, e.target.value)}
            />
            <button
              className="bg-red-600 text-white px-3 rounded"
              onClick={() => removeImage(i)}
            >
              X
            </button>
          </div>
        ))}
        <button
          onClick={addImage}
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded shadow"
        >
          + Add Image
        </button>

        {/* Variants */}
        <label className="block mb-2 font-semibold">Variants</label>
        {variants.map((v, i) => (
          <div key={v.id} className="border p-3 mb-3 rounded bg-gray-50">
            <div className="flex flex-wrap gap-4 mb-2">
              <input
                placeholder="SKU"
                value={v.sku}
                onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                className="border rounded px-2 py-1 w-24"
              />
              <input
                placeholder="Price"
                value={v.price}
                onChange={(e) => updateVariant(i, 'price', e.target.value)}
                className="border rounded px-2 py-1 w-24"
              />
              <input
                placeholder="Barcode"
                value={v.barcode}
                onChange={(e) => updateVariant(i, 'barcode', e.target.value)}
                className="border rounded px-2 py-1 w-32"
              />
              <input
                placeholder="Inventory Qty"
                type="number"
                value={v.inventory_quantity}
                onChange={(e) => updateVariant(i, 'inventory_quantity', e.target.value)}
                className="border rounded px-2 py-1 w-32"
              />
            </div>
            <div className="flex flex-wrap gap-4 mb-2">
              <input
                placeholder="Option 1 Name (e.g. Colour)"
                value={v.option1_name}
                onChange={(e) => updateVariant(i, 'option1_name', e.target.value)}
                className="border rounded px-2 py-1 w-32"
              />
              <input
                placeholder="Option 1 Value (e.g. Red)"
                value={v.option1_value}
                onChange={(e) => updateVariant(i, 'option1_value', e.target.value)}
                className="border rounded px-2 py-1 w-32"
              />
              <input
                placeholder="Option 2 Name"
                value={v.option2_name}
                onChange={(e) => updateVariant(i, 'option2_name', e.target.value)}
                className="border rounded px-2 py-1 w-32"
              />
              <input
                placeholder="Option 2 Value"
                value={v.option2_value}
                onChange={(e) => updateVariant(i, 'option2_value', e.target.value)}
                className="border rounded px-2 py-1 w-32"
              />
              <input
                placeholder="Option 3 Name"
                value={v.option3_name}
                onChange={(e) => updateVariant(i, 'option3_name', e.target.value)}
                className="border rounded px-2 py-1 w-32"
              />
              <input
                placeholder="Option 3 Value"
                value={v.option3_value}
                onChange={(e) => updateVariant(i, 'option3_value', e.target.value)}
                className="border rounded px-2 py-1 w-32"
              />
            </div>
            <button
              onClick={() => removeVariant(i)}
              className="bg-red-600 text-white px-3 rounded"
              disabled={variants.length === 1}
              title={variants.length === 1 ? 'At least one variant required' : 'Remove Variant'}
            >
              Remove Variant
            </button>
          </div>
        ))}
        <button
          onClick={addVariant}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          + Add Variant
        </button>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
