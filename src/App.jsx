import React, { useState } from 'react';
import ProductEditor from './components/ProductEditor';

export default function App() {
  const [products, setProducts] = useState([
    // Example product to start
    {
      id: 1,
      title: 'Example Product',
      description: 'Example description',
      categories: ['Category1'],
      tags: ['tag1', 'tag2'],
      images: [],
      variants: [],
    },
    // Add more products as needed
  ]);

  const [editingProduct, setEditingProduct] = useState(null);

  // Called when clicking "Edit"
  function startEditing(product) {
    setEditingProduct(product);
  }

  // Called from ProductEditor on save
  function handleSave(updatedProduct) {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setEditingProduct(null);
  }

  // Called to cancel editing
  function handleCancelEdit() {
    setEditingProduct(null);
  }

  // Called to delete a product
  function handleDelete(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <h1>Product List</h1>
      {products.length === 0 && <p>No products</p>}
      <ul>
        {products.map((product) => (
          <li key={product.id} style={{ marginBottom: '1rem' }}>
            <strong>{product.title}</strong>
            <div>
              <button onClick={() => startEditing(product)}>Edit</button>
              <button onClick={() => handleDelete(product.id)} style={{ marginLeft: '1rem' }}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Show editor modal if editingProduct is set */}
      {editingProduct && (
        <ProductEditor
          product={editingProduct}
          onSave={handleSave}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
}
