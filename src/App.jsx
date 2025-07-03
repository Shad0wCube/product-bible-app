import React, { useState, useMemo } from 'react';
import ProductEditor from './components/ProductEditor';

const initialProducts = [
  {
    id: 1,
    title: 'Example Product 1',
    description: 'This is a test product.',
    categories: ['Category1'],
    tags: ['tag1', 'tag2'],
    images: ['https://via.placeholder.com/150'],
    variants: [
      { sku: 'SKU1', option1: 'Red', option2: 'Small', option3: '', price: '10.00', quantity: '5', barcode: '123456' },
      { sku: 'SKU2', option1: 'Blue', option2: 'Large', option3: '', price: '12.00', quantity: '3', barcode: '654321' },
    ],
  },
  {
    id: 2,
    title: 'Example Product 2',
    description: 'Another product here.',
    categories: ['Category2'],
    tags: ['tag3'],
    images: ['https://via.placeholder.com/150'],
    variants: [
      { sku: 'SKU3', option1: 'Green', option2: 'Medium', option3: '', price: '8.00', quantity: '10', barcode: '789012' },
    ],
  },
];

export default function App() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  // Filter products by title, SKU, or barcode
  const filteredProducts = useMemo(() => {
    const lower = search.toLowerCase();
    return products.filter((p) => {
      const inTitle = p.title.toLowerCase().includes(lower);
      const inSKU = p.variants.some((v) => v.sku.toLowerCase().includes(lower));
      const inBarcode = p.variants.some((v) => v.barcode.toLowerCase().includes(lower));
      return inTitle || inSKU || inBarcode;
    });
  }, [search, products]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleSave = (updatedProduct) => {
    setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
    setEditingProduct(null);
  };

  const handleCancel = () => setEditingProduct(null);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Product List</h1>
      <input
        type="text"
        placeholder="Search by title, SKU, or barcode..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-6"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border rounded p-4 shadow">
            <h2 className="text-xl font-semibold">{product.title}</h2>
            <p className="text-sm text-gray-600 mb-2">{product.description}</p>

            <div className="mb-2">
              <strong>Variants:</strong>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {product.variants.map((v, i) => (
                  <div key={i} className="border p-2 rounded bg-gray-50 text-sm">
                    <div><strong>SKU:</strong> {v.sku}</div>
                    <div><strong>Options:</strong> {v.option1} {v.option2} {v.option3}</div>
                    <div><strong>Price:</strong> £{v.price}</div>
                    <div><strong>Qty:</strong> {v.quantity}</div>
                    <div><strong>Barcode:</strong> {v.barcode}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleEdit(product)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && <p>No products found.</p>}
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
