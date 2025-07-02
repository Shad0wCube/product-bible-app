import React, { useEffect, useState, useRef } from 'react';
import Papa from 'papaparse';
import ProductEditor from './components/ProductEditor';

export default function App() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const fileInputRef = useRef();

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('products');
    if (stored) setProducts(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const handleSave = (product) => {
    if (!product.id) product.id = crypto.randomUUID();
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) => (p.id === product.id ? product : p));
      } else {
        return [...prev, product];
      }
    });
    setSelected(null);
  };

  const handleDelete = (id) => {
    const confirm1 = window.confirm('Are you sure you want to delete this product?');
    if (!confirm1) return;
    const confirm2 = window.confirm('This will permanently remove it. Confirm again?');
    if (!confirm2) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const rows = results.data;
        const imported = [];

        rows.forEach((row) => {
          if (!row['Title']) return;

          const existing = imported.find(p => p.title === row['Title']);

          if (existing) {
            if (row['Image Src']) {
              existing.images.push(row['Image Src']);
            }
          } else {
            imported.push({
              id: crypto.randomUUID(),
              title: row['Title'],
              description: row['Body (HTML)'] || '',
              categories: row['Type'] ? [row['Type']] : [],
              images: row['Image Src'] ? [row['Image Src']] : [],
              tags: row['Tags'] ? row['Tags'].split(',').map(t => t.trim()) : [],
            });
          }
        });

        setProducts(imported);
        fileInputRef.current.value = null;
      },
    });
  };

  const handleExport = () => {
    const csv = Papa.unparse(
      products.map((p) => ({
        ID: p.id,
        Title: p.title,
        Description: p.description,
        Categories: p.categories?.join(', '),
        Images: p.images?.join(', '),
        Tags: p.tags?.join(', '),
      }))
    );

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'product-bible-export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold">Product Bible</h1>
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-green-600 text-white px-4 py-2 rounded shadow"
          >
            Import CSV
          </button>
          <button
            onClick={handleExport}
            className="bg-yellow-500 text-white px-4 py-2 rounded shadow"
          >
            Export CSV
          </button>
          <button
            onClick={() => setSelected({})}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow"
          >
            + Add Product
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="border rounded-lg shadow hover:shadow-lg transition overflow-hidden bg-white"
          >
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              {p.images && p.images[0] ? (
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-sm">No Image</div>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-1">{p.title}</h2>
              <p className="text-sm text-gray-600 mb-2">
                {p.categories?.join(', ')}
              </p>
              <div className="flex justify-between text-sm">
                <button
                  onClick={() => setSelected(p)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
