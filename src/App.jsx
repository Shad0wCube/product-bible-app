// frontend/src/App.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import ProductEditor from './components/ProductEditor';

// Helper: sanitize for CSV (escape quotes, commas)
function csvEscape(value) {
  if (value == null) return '';
  const str = String(value);
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// Convert your product to Shopify CSV row (simplified)
function productToShopifyRow(product) {
  return {
    Handle: product.title.toLowerCase().replace(/\s+/g, '-'),
    Title: product.title,
    'Body (HTML)': product.description || '',
    Vendor: 'YourVendor', // Customize as needed
    Type: product.categories ? product.categories.join(', ') : '',
    Tags: product.categories ? product.categories.join(', ') : '',
    Published: 'TRUE',
    'Option1 Name': 'Title',
    'Option1 Value': 'Default Title',
    SKU: '', // optional
    'Variant Grams': '', // optional
    'Variant Inventory Tracker': '',
    'Variant Inventory Qty': '',
    'Variant Inventory Policy': 'deny',
    'Variant Fulfillment Service': 'manual',
    'Variant Price': '',
    'Variant Compare At Price': '',
    'Variant Requires Shipping': 'TRUE',
    'Variant Taxable': 'TRUE',
    'Variant Barcode': '',
    'Image Src': '', // base64 images not supported in Shopify CSV
    'Image Position': '1',
    'Metafield: specs': JSON.stringify(product.specifications || {}),
  };
}

// Export all products to CSV string
function exportProductsToShopifyCSV(products) {
  if (!products.length) return '';
  const headers = Object.keys(productToShopifyRow(products[0]));
  const csvRows = [
    headers.join(','),
    ...products.map(product => {
      const row = productToShopifyRow(product);
      return headers.map(h => csvEscape(row[h])).join(',');
    }),
  ];
  return csvRows.join('\n');
}

// Import Shopify CSV and convert to your product format
function importShopifyCSV(csvText) {
  const results = Papa.parse(csvText, { header: true, skipEmptyLines: true });
  const products = results.data.map(row => {
    let specs = {};
    try {
      specs = JSON.parse(row['Metafield: specs'] || '{}');
    } catch {}
    return {
      id: Date.now() + Math.random(), // generate unique id
      title: row.Title || '',
      description: row['Body (HTML)'] || '',
      categories: row.Tags ? row.Tags.split(',').map(s => s.trim()) : [],
      specifications: specs,
      documents: [], // can extend later
      images: [],    // can extend later
      videos: [],    // can extend later
    };
  });
  return products;
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);

  const fetchProducts = async () => {
    const res = await axios.get('/api/products');
    setProducts(res.data);
  };

  const handleSave = async (product) => {
    const formData = new FormData();
    for (const key in product) {
      if (Array.isArray(product[key])) {
        formData.append(key, JSON.stringify(product[key]));
      } else {
        formData.append(key, product[key]);
      }
    }
    if (product.id) {
      await axios.put(`/api/products/${product.id}`, formData);
    } else {
      await axios.post('/api/products', formData);
    }
    fetchProducts();
    setSelected(null);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/products/${id}`);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Product Bible</h1>
        <button
          onClick={() => setSelected({})}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      {/* Import / Export Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => {
            const csv = exportProductsToShopifyCSV(products);
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'shopify-products-export.csv';
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export Shopify CSV
        </button>

        <label className="bg-yellow-500 text-white px-4 py-2 rounded cursor-pointer">
          Import Shopify CSV
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={e => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = event => {
                try {
                  const importedProducts = importShopifyCSV(event.target.result);
                  setProducts(importedProducts);
                  alert('Shopify CSV imported successfully!');
                } catch (error) {
                  alert('Failed to import CSV: ' + error.message);
                }
              };
              reader.readAsText(file);
              e.target.value = '';
            }}
          />
        </label>
      </div>

      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Title</th>
            <th className="border px-2 py-1">Category</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="border px-2 py-1">{p.title}</td>
              <td className="border px-2 py-1">{p.categories?.join(', ')}</td>
              <td className="border px-2 py-1">
                <button className="text-blue-500 mr-2" onClick={() => setSelected(p)}>Edit</button>
                <button className="text-red-500" onClick={() => handleDelete(p.id)}>Delete</button>
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
