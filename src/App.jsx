import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import ProductEditor from './components/ProductEditor';

function csvToArray(str, delimiter = ',') {
  const headers = str.slice(0, str.indexOf('\n')).split(delimiter);
  const rows = str.slice(str.indexOf('\n') + 1).split('\n').filter(Boolean);
  return rows.map(row => {
    const values = row.split(delimiter);
    return headers.reduce((obj, header, i) => {
      obj[header.trim()] = values[i]?.trim() || '';
      return obj;
    }, {});
  });
}

function arrayToCSV(arr, delimiter = ',') {
  if (!arr.length) return '';
  const headers = Object.keys(arr[0]);
  const csvRows = [
    headers.join(delimiter),
    ...arr.map(obj => headers.map(h => `"${(obj[h] ?? '').replace(/"/g, '""')}"`).join(delimiter)),
  ];
  return csvRows.join('\n');
}

function productsToShopifyCSV(products) {
  const rows = [];

  products.forEach(product => {
    product.variants.forEach((variant, i) => {
      rows.push({
        Handle: product.title.toLowerCase().replace(/\s+/g, '-'),
        Title: product.title,
        'Body (HTML)': product.description || '',
        Vendor: '',
        'Product Category': '',
        Type: '',
        Tags: (product.tags || []).join(', '),
        Published: 'TRUE',
        'Option1 Name': 'Option1',
        'Option1 Value': variant.option1 || '',
        'Option1 Linked To': '',
        'Option2 Name': 'Option2',
        'Option2 Value': variant.option2 || '',
        'Option2 Linked To': '',
        'Option3 Name': 'Option3',
        'Option3 Value': variant.option3 || '',
        'Option3 Linked To': '',
        'Variant SKU': variant.sku || '',
        'Variant Grams': '',
        'Variant Inventory Tracker': '',
        'Variant Inventory Qty': variant.quantity || '',
        'Variant Inventory Policy': '',
        'Variant Fulfillment Service': '',
        'Variant Price': variant.price || '',
        'Variant Compare At Price': '',
        'Variant Requires Shipping': 'TRUE',
        'Variant Taxable': 'TRUE',
        'Variant Barcode': variant.barcode || '',
        'Image Src': product.images[i] || '',
        'Image Position': i + 1,
        'Image Alt Text': product.title,
        'Gift Card': 'FALSE',
        'SEO Title': '',
        'SEO Description': '',
        'Google Shopping / Google Product Category': '',
        'Google Shopping / Gender': '',
        'Google Shopping / Age Group': '',
        'Google Shopping / MPN': '',
        'Google Shopping / Condition': '',
        'Google Shopping / Custom Product': '',
        'Google Shopping / Custom Label 0': '',
        'Google Shopping / Custom Label 1': '',
        'Google Shopping / Custom Label 2': '',
        'Google Shopping / Custom Label 3': '',
        'Google Shopping / Custom Label 4': '',
        'Diameter (product.metafields.custom.diameter)': '',
        'Download Text 1 (product.metafields.custom.download_text_1)': '',
        'Download Text 2 (product.metafields.custom.download_text_2)': '',
        'Download Text 3 (product.metafields.custom.download_text_3)': '',
        'Download Text 4 (product.metafields.custom.download_text_4)': '',
        'Download Text 5 (product.metafields.custom.download_text_5)': '',
        'Sale/Clearance (product.metafields.custom.sale_clearance)': '',
        'thickness (product.metafields.custom.thickness)': '',
        'Google: Custom Product (product.metafields.mm-google-shopping.custom_product)': '',
        'Volume Pricing (product.metafields.pricing.volume)': '',
        'Depth (product.metafields.product.depth)': '',
        'Environment (product.metafields.product.enviroment)': '',
        'Extendable (product.metafields.product.extendable)': '',
        'Fitting Included (product.metafields.product.fittings_included)': '',
        'Height (product.metafields.product.height)': '',
        'Height Adjustment (product.metafields.product.height_adjustment)': '',
        'Install Difficulty (product.metafields.product.install_difficulty)': '',
        'Load Rating (product.metafields.product.load_rating)': '',
        'Material (product.metafields.product.material)': '',
        'Style (product.metafields.product.style)': '',
        'Width (product.metafields.product.width)': '',
        'Product rating count (product.metafields.reviews.rating_count)': '',
        'Color (product.metafields.shopify.color-pattern)': '',
        'Furniture/Fixture material (product.metafields.shopify.furniture-fixture-material)': '',
        'Material (product.metafields.shopify.material)': '',
        'Mounting type (product.metafields.shopify.mounting-type)': '',
        'Shape (product.metafields.shopify.shape)': '',
        'Suitable location (product.metafields.shopify.suitable-location)': '',
        'Complementary products (product.metafields.shopify--discovery--product_recommendation.complementary_products)': '',
        'Related products (product.metafields.shopify--discovery--product_recommendation.related_products)': '',
        'Related products settings (product.metafields.shopify--discovery--product_recommendation.related_products_display)': '',
        'Search product boosts (product.metafields.shopify--discovery--product_search_boost.queries)': '',
        'Box Qty (product.metafields.trade.box_qty)': '',
        'Min_Qty (product.metafields.trade.min_qty)': '',
        'Variant Image': '',
        'Variant Weight Unit': '',
        'Variant Tax Code': '',
        'Cost per item': '',
        'Included / United Kingdom': '',
        'Price / United Kingdom': '',
        'Compare At Price / United Kingdom': '',
        Status: '',
      });
    });
  });

  return rows;
}

function parseCSVtoProducts(csvStr) {
  const arr = csvToArray(csvStr);
  // Convert back to your products structure grouped by handle/title
  const productsMap = new Map();

  arr.forEach(row => {
    const handle = row.Handle;
    if (!productsMap.has(handle)) {
      productsMap.set(handle, {
        id: Date.now().toString() + Math.random(),
        title: row.Title,
        description: row['Body (HTML)'] || '',
        tags: row.Tags ? row.Tags.split(',').map(t => t.trim()) : [],
        images: [],
        variants: [],
      });
    }
    const product = productsMap.get(handle);

    // Add image if not already present
    if (row['Image Src'] && !product.images.includes(row['Image Src'])) {
      product.images.push(row['Image Src']);
    }

    // Add variant
    if(row['Variant SKU']) {  // Skip variants with no SKU to reduce blanks
      product.variants.push({
        sku: row['Variant SKU'],
        option1: row['Option1 Value'],
        option2: row['Option2 Value'],
        option3: row['Option3 Value'],
        price: row['Variant Price'],
        quantity: row['Variant Inventory Qty'],
        barcode: row['Variant Barcode'],
      });
    }
  });

  return Array.from(productsMap.values());
}

export default function App() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [exportFormat, setExportFormat] = useState('json');
  const [importPreview, setImportPreview] = useState(null);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

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

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete ALL products?')) {
      setProducts([]);
    }
  };

  const handleExport = () => {
    if (exportFormat === 'json') {
      const jsonStr = JSON.stringify(products, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products.json';
      a.click();
      URL.revokeObjectURL(url);
    } else if (exportFormat === 'csv') {
      const csvRows = productsToShopifyCSV(products);
      const csvStr = arrayToCSV(csvRows);
      const blob = new Blob([csvStr], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const parseImportedData = (dataStr, fileType) => {
    if (fileType === 'json') {
      try {
        const json = JSON.parse(dataStr);
        if (Array.isArray(json)) {
          return json;
        } else {
          alert('Invalid JSON format: expected an array of products.');
          return null;
        }
      } catch (e) {
        alert('Error parsing JSON: ' + e.message);
        return null;
      }
    } else if (fileType === 'csv') {
      return parseCSVtoProducts(dataStr);
    } else if (fileType === 'xlsx') {
      try {
        const workbook = XLSX.read(dataStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const csvStr = XLSX.utils.sheet_to_csv(sheet);
        return parseCSVtoProducts(csvStr);
      } catch (e) {
        alert('Error parsing XLSX: ' + e.message);
        return null;
      }
    }
    return null;
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const ext = file.name.split('.').pop().toLowerCase();

      let productsImported = null;
      if (ext === 'json') {
        productsImported = parseImportedData(data, 'json');
      } else if (ext === 'csv') {
        productsImported = parseImportedData(data, 'csv');
      } else if (ext === 'xlsx' || ext === 'xls') {
        // XLSX needs binary string
        const readerBinary = new FileReader();
        readerBinary.onload = (ev) => {
          const binaryData = ev.target.result;
          const imported = parseImportedData(binaryData, 'xlsx');
          if (imported) setImportPreview(imported);
        };
        readerBinary.readAsBinaryString(file);
        return;
      } else {
        alert('Unsupported file type.');
        return;
      }

      if (productsImported) setImportPreview(productsImported);
    };

    if (file.name.toLowerCase().endsWith('.json') || file.name.toLowerCase().endsWith('.csv')) {
      reader.readAsText(file);
    }
  };

  const confirmImport = () => {
    if (importPreview) {
      setProducts(importPreview);
      setImportPreview(null);
    }
  };

  const cancelImport = () => {
    setImportPreview(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Product Bible</h1>

      <div className="flex gap-4 mb-4 flex-wrap">
        <button
          onClick={() => setEditingProduct({ id: null, title: '', variants: [], images: [], description: '', categories: [], tags: [] })}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>

        <button
          onClick={handleDeleteAll}
          className="bg-red-700 text-white px-4 py-2 rounded"
        >
          Delete All
        </button>

        <div>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="border rounded px-2 py-1 mr-2"
          >
            <option value="json">Export JSON</option>
            <option value="csv">Export CSV</option>
          </select>
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Export
          </button>
        </div>

        <label className="bg-gray-300 px-4 py-2 rounded cursor-pointer">
          Import
          <input
            type="file"
            accept=".json,.csv,.xlsx,.xls"
            onChange={handleImport}
            className="hidden"
          />
        </label>

        <input
          type="search"
          placeholder="Search by title, SKU, or barcode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded flex-grow min-w-[250px]"
        />
      </div>

      {/* Import Preview Modal */}
      {importPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow max-w-4xl w-full max-h-[80vh] overflow-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">Confirm Import</h2>
            <p className="mb-4">Are you sure you want to replace all products with the imported data? This will overwrite your current products.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-auto mb-6">
              {importPreview.map((product) => (
                <div key={product.id} className="border rounded p-4 shadow">
                  <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                  <div className="flex gap-2 mb-2 overflow-x-auto">
                    {product.images.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`${product.title} ${i + 1}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {product.variants.map((variant, i) => (
                      <div key={i} className="border rounded p-2 bg-gray-100">
                        <p><strong>SKU:</strong> {variant.sku || '-'}</p>
                        <p><strong>Options:</strong> {variant.option1 || ''} {variant.option2 ? `/ ${variant.option2}` : ''} {variant.option3 ? `/ ${variant.option3}` : ''}</p>
                        <p><strong>Price:</strong> {variant.price || '-'}</p>
                        <p><strong>Quantity:</strong> {variant.quantity || '-'}</p>
                        <p><strong>Barcode:</strong> {variant.barcode || '-'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={cancelImport}
                className="px-4 py-2 rounded border border-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmImport}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Confirm Import
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredProducts.length === 0 && !importPreview && (
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
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
            </div>
            <p className="mb-2">{product.description}</p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {product.variants.map((variant, i) => (
                <div key={i} className="border rounded p-2 bg-gray-100">
                  <p><strong>SKU:</strong> {variant.sku || '-'}</p>
                  <p><strong>Options:</strong> {variant.option1 || ''} {variant.option2 ? `/ ${variant.option2}` : ''} {variant.option3 ? `/ ${variant.option3}` : ''}</p>
                  <p><strong>Price:</strong> {variant.price || '-'}</p>
                  <p><strong>Quantity:</strong> {variant.quantity || '-'}</p>
                  <p><strong>Barcode:</strong> {variant.barcode || '-'}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
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
