import React, { useState } from 'react';
import ProductEditor from './components/ProductEditor';
import './index.css';


export default function App() {
  const [products, setProducts] = useState([
    {
      id: 1,
      title: 'Example Product',
      description: 'This is a sample product',
      categories: ['Category1'],
      tags: ['Tag1'],
      images: ['https://via.placeholder.com/150'],
      variants: [
        {
          sku: 'SKU123',
          option1: 'Red',
          option2: 'Small',
          option3: '',
          price: '9.99',
          quantity: '10',
          barcode: '1234567890',
        },
      ],
    },
  ]);

  const [editingProduct, setEditingProduct] = useState(null);

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="App p-4">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      {products.map((product) => (
        <div key={product.id} className="mb-2 flex items-center gap-4">
          <div>{product.title}</div>
          <button
            onClick={() => setEditingProduct(product)}
            className="text-blue-600 underline"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(product.id)}
            className="text-red-600 underline"
          >
            Delete
          </button>
        </div>
      ))}

      {editingProduct && (
        <ProductEditor
          product={editingProduct}
          onSave={(updatedProduct) => {
            setProducts((prev) =>
              prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
            );
            setEditingProduct(null);
          }}
          onCancel={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
}
