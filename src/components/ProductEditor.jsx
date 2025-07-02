import React, { useState, useEffect } from 'react';

export default function ProductEditor({ product, onSave, onCancel }) {
  const [title, setTitle] = useState(product.title || '');
  const [description, setDescription] = useState(product.description || '');
  const [categories, setCategories] = useState((product.categories || []).join(', '));
  const [specifications, setSpecifications] = useState(product.specifications || {});
  const [video, setVideo] = useState(product.video || '');

  // Files stored as Base64 strings
  const [imageBase64, setImageBase64] = useState(product.image || '');
  const [docBase64, setDocBase64] = useState(product.document || '');
  const [docName, setDocName] = useState('');

  // Manage specs as key-value pairs UI
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');

  useEffect(() => {
    setDocName('');
  }, [docBase64]);

  const addSpec = () => {
    if (newSpecKey && newSpecVal) {
      setSpecifications(prev => ({ ...prev, [newSpecKey]: newSpecVal }));
      setNewSpecKey('');
      setNewSpecVal('');
    }
  };

  const removeSpec = (key) => {
    const copy = { ...specifications };
    delete copy[key];
    setSpecifications(copy);
  };

  const encodeFileToBase64 = (file, setter, nameSetter) => {
    const reader = new FileReader();
    reader.onload = () => {
      setter(reader.result);
      if (nameSetter) nameSetter(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    onSave({
      ...product,
      title,
      description,
      categories: categories.split(',').map(s => s.trim()).filter(Boolean),
      specifications,
      video,
      image: imageBase64,
      document: docBase64,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto p-6 shadow-lg relative">
        <h2 className="text-2xl font-semibold mb-4">{product.id ? 'Edit Product' : 'Add Product'}</h2>

        <label className="block mb-2 font-medium">Title *</label>
        <input
          type="text"
          className="border p-2 w-full mb-4"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <label className="block mb-2 font-medium">Categories (comma separated)</label>
        <input
          type="text"
          className="border p-2 w-full mb-4"
          value={categories}
          onChange={e => setCategories(e.target.value)}
        />

        <label className="block mb-2 font-medium">Description</label>
        <textarea
          className="border p-2 w-full mb-4"
          rows={4}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <label className="block mb-2 font-medium">Specifications</label>
        {Object.entries(specifications).length === 0 && (
          <p className="mb-2 text-gray-500 italic">No specs added yet</p>
        )}
        {Object.entries(specifications).map(([key, val]) => (
          <div key={key} className="flex gap-2 mb-1 items-center">
            <div className="font-semibold w-1/3">{key}</div>
            <div className="flex-1 border px-2 py-1">{val}</div>
            <button
              onClick={() => removeSpec(key)}
              className="text-red-600 font-bold px-2"
              title="Remove spec"
            >
              ×
            </button>
          </div>
        ))}

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Spec key"
            className="border p-2 flex-1"
            value={newSpecKey}
            onChange={e => setNewSpecKey(e.target.value)}
          />
          <input
            type="text"
            placeholder="Spec value"
            className="border p-2 flex-1"
            value={newSpecVal}
            onChange={e => setNewSpecVal(e.target.value)}
          />
          <button
            onClick={addSpec}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Spec
          </button>
        </div>

        {/* Image upload & preview */}
        <label className="block mb-2 font-medium">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => {
            if (e.target.files[0]) encodeFileToBase64(e.target.files[0], setImageBase64);
          }}
          className="mb-2"
        />
        {imageBase64 && (
          <img
            src={imageBase64}
            alt="Uploaded"
            className="max-h-48 mb-6 border rounded"
          />
        )}

        {/* Document upload & preview */}
        <label className="block mb-2 font-medium">Document (PDF)</label>
        <input
          type="file"
          accept=".pdf"
          onChange={e => {
            if (e.target.files[0]) encodeFileToBase64(e.target.files[0], setDocBase64, setDocName);
          }}
          className="mb-2"
        />
        {docBase64 && (
          <a
            href={docBase64}
            target="_blank"
            rel="noopener noreferrer"
            className="block mb-6 text-blue-600 underline"
            download={docName || 'document.pdf'}
          >
            View / Download Document
          </a>
        )}

        {/* Video URL */}
        <label className="block mb-2 font-medium">Video URL (YouTube, Vimeo etc.)</label>
        <input
          type="url"
          placeholder="https://youtu.be/..."
          className="border p-2 w-full mb-6"
          value={video}
          onChange={e => setVideo(e.target.value)}
        />
        {video && (
          <div className="mb-6">
            <iframe
              title="Video Preview"
              width="320"
              height="180"
              src={video.includes('youtube') || video.includes('youtu.be') ? convertYoutubeEmbed(video) : video}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-400 text-white px-6 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function convertYoutubeEmbed(url) {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  const id = match && match[7].length === 11 ? match[7] : null;
  if (!id) return url;
  return `https://www.youtube.com/embed/${id}`;
}
