import React, { useState, useMemo, useRef } from 'react';
import ProductEditor from './components/ProductEditor';
import Papa from 'papaparse';

export default function App() {
  const [products, setProducts] = useState([
    {
      id: 1,
      handle: 'example-product',
      title: 'Example Product',
      description: 'This is an example product description.',
      tags: ['sample', 'demo'],
      productType: 'Example Category',
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
  const fileInputRef = useRef(null);

  // Filter products by title, SKU, barcode
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const lowerSearch = searchTerm.toLowerCase();
    return products.filter(product => {
      if (product.title.toLowerCase().includes(lowerSearch)) return true;
      if (product.variants.some(v =>
        (v.sku && v.sku.toLowerCase().includes(lowerSearch)) ||
        (v.barcode && v.barcode.toLowerCase().includes(lowerSearch))
      )) return true;
      return false;
    });
  }, [products, searchTerm]);

  // Delete product handler
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
      if (editingProduct && editingProduct.id === id) setEditingProduct(null);
    }
  };

  // Edit product modal open
  const handleEdit = (product) => setEditingProduct(product);

  // Save edited product
  const handleSave = (updatedProduct) => {
    setProducts(prev =>
      prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
    setEditingProduct(null);
  };

  const handleCancel = () => setEditingProduct(null);

  // Convert internal products data to Shopify CSV format rows
  const productsToCSVRows = () => {
    const rows = [];
    products.forEach(product => {
      const handle = product.handle || product.title.toLowerCase().replace(/\s+/g, '-');
      product.variants.forEach((variant, idx) => {
        rows.push({
          Handle: handle,
          Title: idx === 0 ? product.title : '',
          'Body (HTML)': idx === 0 ? product.description : '',
          Vendor: '', // add if you want
          Type: idx === 0 ? product.productType || '' : '',
          Tags: idx === 0 ? product.tags.join(', ') : '',
          Published: 'TRUE',
          'Option1 Name': 'Color',
          'Option1 Value': variant.option1 || '',
          'Option2 Name': 'Option2',
          'Option2 Value': variant.option2 || '',
          'Option3 Name': 'Option3',
          'Option3 Value': variant.option3 || '',
          SKU: variant.sku || '',
          'Variant Price': variant.price || '',
          'Variant Inventory Qty': variant.quantity || '',
          'Variant Barcode': variant.barcode || '',
          'Image Src': idx === 0 && product.images.length > 0 ? product.images[0] : '',
        });
      });
    });
    return rows;
  };

  // Export current products to Shopify CSV file
  const handleExportCSV = () => {
    const rows = productsToCSVRows();
    const csv = Papa.unparse(rows, { quotes: true, delimiter: ',' });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products-shopify-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Parse Shopify CSV rows into internal products format
  const csvToProducts = (csvString) => {
    const parsed = Papa.parse(csvString, { header: true, skipEmptyLines: true });
    const data = parsed.data;

    const productsMap = new Map();

    data.forEach(row => {
      const handle = row.Handle.trim();
      if (!productsMap.has(handle)) {
        productsMap.set(handle, {
          id: Date.now() + Math.random(),
          handle,
          title: row.Title || handle,
          description: row['Body (HTML)'] || '',
          productType: row.Type || '',
          tags: row.Tags ? row.Tags.split(',').map(t => t.trim()) : [],
          images: [],
          variants: [],
        });
      }
      const product = productsMap.get(handle);

      // Add variant info
      product.variants.push({
        sku: row.SKU || '',
        option1: row['Option1 Value'] || '',
        option2: row['Option2 Value'] || '',
        option3: row['Option3 Value'] || '',
        price: row['Variant Price'] || '',
        quantity: row['Variant Inventory Qty'] || '',
        barcode: row['Variant Barcode'] || '',
      });

      // Add images (only first image per product row)
      if (row['Image Src']) {
        if (!product.images.includes(row['Image Src'])) {
          product.images.push(row['Image Src']);
        }
      }
    });

    return Array.from(productsMap.values());
  };

  // Handle CSV file upload and import
  const handleImportCSVFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvString = event.target.result;
        const importedProducts = csvToProducts(csvString);
        setProducts(importedProducts);
        alert('CSV imported successfully!');
      } catch (error) {
        alert('Error importing CSV: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Product List</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by title, SKU, or barcode..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border rounded px-2 py-1 mb-4 w-full"
      />

      {/* CSV Import */}
      <div className="mb-4">
        <label className="font-semibold block mb-1">Import Shopify CSV</label>
        <input
          type="file"
          accept=".csv,text/csv"
          ref={fileInputRef}
          onChange={handleImportCSVFile}
          className="border rounded p-1 w-full"
        />
      </div>

      {/* CSV Export */}
      <button
        onClick={handleExportCSV}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Export Shopify CSV
      </button>

      {filteredProducts.length === 0 && <p>No products found.</p>}

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border rounded p-4 shadow">
            <h2 className="font-semibold text-xl mb-2">{product.title}</h2>

            {/* Images */}
            <div className="flex gap-2 mb-2 overflow-x-auto">
              {product.images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${product.title} image ${i + 1}`}
                  className="w-20 h-20 object-cover rounded cursor-pointer"
                  onClick={() => window.open(src, '_blank')}
                />
              ))}
            </div>

            <p className="mb-2">{product.description}</p>

            {/* Variant table */}
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

      {/* Edit modal */}
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
