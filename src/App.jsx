import React, { useState, useEffect } from 'react';
import ProductEditor from './components/ProductEditor';

// Simple CSV parser for your product format
function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return null;

  const headers = lines[0].split(',').map(h => h.trim());
  const productsMap = new Map();

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(c => c.trim());
    if (row.length !== headers.length) continue;

    // Build product and variant keys from CSV columns:
    // We'll assume the CSV columns are:
    // Handle,Title,Body (HTML),Vendor,Type,Tags,Published,
    // Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,
    // Variant SKU,Variant Price,Variant Inventory Qty,Variant Barcode,Image Src

    // Find indexes for these headers (lowercase and trimmed)
    const idx = (name) => headers.findIndex(h => h.toLowerCase() === name.toLowerCase());

    const handle = row[idx('Handle')];
    if (!handle) continue;

    // Create or get existing product
    let product = productsMap.get(handle);
    if (!product) {
      product = {
        id: handle,
        title: row[idx('Title')] || '',
        description: row[idx('Body (HTML)')] || '',
        categories: [], // Not from CSV, you can map Vendor/Type if you want
        tags: row[idx('Tags')] ? row[idx('Tags')].split(',').map(t => t.trim()) : [],
        images: row[idx('Image Src')] ? [row[idx('Image Src')]] : [],
        variants: [],
      };
      productsMap.set(handle, product);
    } else {
      // Add image if exists and not duplicate
      const img = row[idx('Image Src')];
      if (img && !product.images.includes(img)) {
        product.images.push(img);
      }
    }

    // Add variant
    const variant = {
      sku: row[idx('Variant SKU')] || '',
      option1: row[idx('Option1 Value')] || '',
      option2: row[idx('Option2 Value')] || '',
      option3: row[idx('Option3 Value')] || '',
      price: row[idx('Variant Price')] || '',
      quantity: row[idx('Variant Inventory Qty')] || '',
      barcode: row[idx('Variant Barcode')] || '',
    };

    product.variants.push(variant);
  }

  return Array.from(productsMap.values());
}

export default function App() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // Filter products by title, SKU, or barcode
  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.title.toLowerCase().includes(term) ||
      product.variants.some((v) =>
        [v.sku, v.barcode].some((code) =>
          code ? code.toLowerCase().includes(term) : false
        )
      )
    );
  });

  const handleSaveProduct = (product) => {
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) => (p.id === product.id ? product : p));
      }
      return [...prev, { ...product, id: Date.now().toString() }];
    });
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // JSON Export
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // CSV Export
  const handleExportCSV = () => {
    const header = [
      'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Type', 'Tags', 'Published',
      'Option1 Name', 'Option1 Value', 'Option2 Name', 'Option2 Value', 'Option3 Name', 'Option3 Value',
      'Variant SKU', 'Variant Price', 'Variant Inventory Qty', 'Variant Barcode', 'Image Src'
    ];

    let csv = header.join(',') + '\n';

    products.forEach(product => {
      product.variants.forEach(variant => {
        csv += [
          product.id || '',
          `"${product.title.replace(/"/g, '""')}"`,
          `"${(product.description || '').replace(/"/g, '""')}"`,
          '', // Vendor (optional)
          '', // Type (optional)
          product.tags ? `"${product.tags.join(',').replace(/"/g, '""')}"` : '',
          'TRUE',
          'Option1', variant.option1 || '',
          'Option2', variant.option2 || '',
          'Option3', variant.option3 || '',
          variant.sku || '',
          variant.price || '',
          variant.quantity || '',
          variant.barcode || '',
          product.images.length > 0 ? product.images[0] : ''
        ].map(value => value.toString().replace(/\n/g, ' ')).join(',') + '\n';
      });
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Unified export with format prompt
  const handleExport = () => {
    const format = window.prompt('Export format? Type "json" or "csv"', 'json');
    if (format === 'json') {
      handleExportJSON();
    } else if (format === 'csv') {
      handleExportCSV();
    } else {
      alert('Invalid export format.');
    }
  };

  // Unified import handler for JSON and CSV
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    const reader = new FileReader();

    reader.onload = (ev) => {
      try {
        if (ext === 'json') {
          const imported = JSON.parse(ev.target.result);
          if (Array.isArray(imported)) {
            setProducts(imported);
          } else {
            alert('Invalid JSON format.');
          }
        } else if (ext === 'csv') {
          const text = ev.target.result;
          const parsedProducts = parseCSV(text);
          if (parsedProducts) setProducts(parsedProducts);
          else alert('Invalid CSV format.');
        } else {
          alert('Unsupported file format.');
        }
      } catch {
        alert('Failed to parse file.');
      }
    };

    reader.readAsText(file);
    // Reset input so same file can be re-imported if needed
    e.target.value = '';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Product Bible</h1>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setEditingProduct({ id: null, title: '', variants: [], images: [], description: '', categories: [], tags: [] })}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>

        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export JSON or CSV
        </button>

        <label className="bg-gray-300 px-4 py-2 rounded cursor-pointer">
          Import JSON or CSV
          <input
            type="file"
            accept=".json,.csv"
            onChange={handleImport}
            className="hidden"
          />
        </label>

        <input
          type="search"
          placeholder="Search by title, SKU, or barcode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded flex-grow"
        />
      </div>

      {filteredProducts.length === 0 && (
        <p>No products found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border rounded p-4 shadow">
            <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
            <div className="flex gap-2 mb-2 overflow-x-auto">
              {product.images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${product.title} ${i + 1}`}
                  className="w-20 h-20 object-cover rounded cursor-pointer"
                  onClick={() => window.open(src, '_blank')}
                />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {product.variants.map((variant, i) => (
                <div key={i} className="border rounded p-2 bg-gray-50">
                  <p><strong>SKU:</strong> {variant.sku || '-'}</p>
                  <p><strong>Options:</strong> {variant.option1 || ''} {variant.option2 ? `/ ${variant.option2}` : ''} {variant.option3 ? `/ ${variant.option3}` : ''}</p>
                  <p><strong>Price:</strong> {variant.price || '-'}</p>
                  <p><strong>Quantity:</strong> {variant.quantity || '-'}</p>
                  <p><strong>Barcode:</strong> {variant.barcode || '-'}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setEditingProduct(product)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
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
          onSave={handleSaveProduct}
          onCancel={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
}
