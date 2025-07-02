import React, { useState, useEffect } from 'react';
import ProductEditor from './components/ProductEditor';

const LOCAL_STORAGE_KEY = 'productBibleData';

export default function App() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setProducts(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const handleSave = (product) => {
    if (product.id) {
      setProducts(products.map(p => (p.id === product.id ? product : p)));
    } else {
      product.id = Date.now();
      setProducts([...products, product]);
    }
    setSelected(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-bible-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          setProducts(imported);
          alert('Import successful');
        } else {
          alert('Invalid format');
        }
      } catch {
        alert('Error parsing JSON');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Bible</h1>
        <div className="flex gap-3">
          <button onClick={() => setSelected({})} className="bg-blue-600 text-white px-4 py-2 rounded">+ Add Product</button>
          <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded">Export JSON</button>
          <label className="bg-yellow-500 text-white px-4 py-2 rounded cursor-pointer">
            Import JSON
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              title="Import JSON backup"
            />
          </label>
        </div>
      </header>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-2 py-1 text-left">Title</th>
            <th className="border border-gray-300 px-2 py-1 text-left">Categories</th>
            <th className="border border-gray-300 px-2 py-1 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr><td colSpan={3} className="text-center p-4">No products yet</td></tr>
          )}
          {products.map(p => (
            <tr key={p.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-2 py-1">{p.title}</td>
              <td className="border border-gray-300 px-2 py-1">{(p.categories || []).join(', ')}</td>
              <td className="border border-gray-300 px-2 py-1">
                <button
                  onClick={() => setSelected(p)}
                  className="text-blue-600 mr-2 hover:underline"
                >Edit</button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-600 hover:underline"
                >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <ProductEditor
          product={selected}
          onSave={handleSave}
          onCancel={() => setSelected(null)}
        />
      )}
    </div>
  );
}
