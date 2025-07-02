import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import ProductList from './components/ProductList';
import ProductEditor from './components/ProductEditor';
import ProductPage from './components/ProductPage'; // Make sure you have this component

export default function App() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);

  // Load products from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('products');
    if (stored) setProducts(JSON.parse(stored));
  }, []);

  // Save products to localStorage when they change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // Save or update product handler
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
        <Route
          path="/product/:id"
          element={<ProductPage products={products} />}
        />
      </Routes>
    </Router>
  );
}
