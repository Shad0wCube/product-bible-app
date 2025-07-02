import React, { useEffect, useState } from 'react';
import ProductEditor from './components/ProductEditor';

export default function App() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);

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
    // Ensure unique ID
    if (!product.id) {
      product.id = crypto.randomUUID();
    }

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

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Bible</h1>
        <button
          onClick={() => setSelected({})}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          + Add Product
        </button>
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
