import React, { useState, useMemo } from 'react';
import ProductEditor from './components/ProductEditor';

export default function App() {
  const [products, setProducts] = useState([
    {
      id: 1,
      title: 'Example Product',
      description: 'This is an example product description.',
      categories: ['Example', 'Test'],
      tags: ['sample', 'demo'],
      images: [
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150/0000FF/808080',
      ],
      variants: [
        { sku: 'EX-001', option1: 'Red', option2: '', option3: '', price: '10.00', quantity: '100', barcode: '123456789' },
        { sku: 'EX-002', option1: 'Blue', option2: '', option3: '', price: '12.00', quantity: '50', barcode: '987654321' },
      ],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  // Search products by title, sku, barcode
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    return products.filter((product) => {
      const search = searchTerm.toLowerCase();
      if (product.title.toLowerCase().includes(search)) return true;
      if (product.variants.some(v => 
          v.sku.toLowerCase().includes(search) || 
          (v.barcode && v.barcode.toLowerCase().includes(search))
        )) return true;
      return false;
    });
  }, [products, searchTerm]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id));
      if (editingProduct && editingProduct.id === id) setEditingProduct(null);
    }
  };

  const handleEdit = (product) => setEditingProduct(product);

  const handleSave = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setEditingProduct(null);
  };

  const handleCancel = () => setEditingProduct(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Product List</h1>
      <input
        type="text"
        placeholder="Search by title, SKU, or barcode..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border rounded px-2 py-1 mb-4 w-full"
      />

      {filteredProducts.length === 0 && <p>No products found.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border rounded p-4 shadow">
            <h2 className="font-semibold text-xl mb-2">{product.title}</h2>

            {/* Image gallery */}
            <div className="flex gap-2 mb-2 overflow-x-auto">
              {product.images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={product.title + ' image ' + (i + 1)}
                  className="w-20 h-20 object-cover rounded cursor-pointer"
                  onClick={() => window.open(src, '_blank')}
                />
              ))}
            </div>

            <p className="mb-2">{product.description}</p>

            {/* Variant grid */}
            <table className="w-full text-sm border-collapse mb-2">
              <thead>
                <tr>
                  <th className="border px-2 py-1">SKU</th>
                  <th className="border px-2 py-1">Option 1</th>
                  <th className="border px-2 py-1">Option 2</th>
                  <th className="border px-2 py-1">Option 3</th>
                  <th className="border px-2 py-1">Price</th>
                  <th className="border px-2 py-1">Qty</th>
                  <th className="border px-2 py-1">Barcode</th>
                </tr>
              </thead>
              <tbody>
                {product.variants.map((v, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-1">{v.sku}</td>
                    <td className="border px-2 py-1">{v.option1}</td>
                    <td className="border px-2 py-1">{v.option2}</td>
                    <td className="border px-2 py-1">{v.option3}</td>
                    <td className="border px-2 py-1">{v.price}</td>
                    <td className="border px-2 py-1">{v.quantity}</td>
                    <td className="border px-2 py-1">{v.barcode}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex gap-4">
              <button
                onClick={() => handleEdit(product)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingProduct && (
        <ProductEditor
          product={editingProduct}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
