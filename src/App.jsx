import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductEditor from './components/ProductEditor';
import ProductPage from './components/ProductPage';

export default function AppWrapper() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('products');
    if (stored) setProducts(JSON.parse(stored));
  }, []);

  // Save to localStorage on products change
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

  // Use handleDelete here and pass down
  const handleDelete = (id) => {
    const confirm1 = window.confirm('Are you sure you want to delete this product?');
    if (!confirm1) return;
    const confirm2 = window.confirm('This will permanently remove it. Confirm again?');
    if (!confirm2) return;

    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <ProductList
                products={products}
                setProducts={setProducts}
                setSelected={setSelected}
                handleDelete={handleDelete}  {/* Pass it here */}
              />
              {selected && (
                <ProductEditor
                  product={selected}
                  onSave={handleSave}
                  onCancel={() => setSelected(null)}
                />
              )}
            </>
          }
        />
        <Route path="/product/:id" element={<ProductPage products={products} />} />
      </Routes>
    </Router>
  );
}
