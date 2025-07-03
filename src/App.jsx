import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import ProductEditor from './components/ProductEditor';

// Utility: CSV to array of objects
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

// Utility: array of objects to CSV string
function arrayToCSV(arr, delimiter = ',') {
  if (!arr.length) return '';
  const headers = Object.keys(arr[0]);
  const csvRows = [
    headers.join(delimiter),
    ...arr.map(obj => headers.map(h => `"${(obj[h] ?? '').replace(/"/g, '""')}"`).join(delimiter)),
  ];
  return csvRows.join('\n');
}

// Convert your products structure to Shopify CSV format rows
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

// Convert CSV string to products array
function parseCSVtoProducts(csvStr) {
  const arr = csvToArray(csvStr);
  const productsMap = new Map();

  arr.forEach(row => {
    const handle = row.Handle;
    if (!handle) return;

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

    // Add image if not duplicate
    if (row['Image Src'] && !product.images.includes(row['Image Src'])) {
      product.images.push(row['Image Src']);
    }

    // Add variant if SKU present
    if (row['Variant SKU']) {
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

  // Import preview and modal toggle
  const [importPreview, setImportPreview] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

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

  // Combined import handler for JSON, CSV, XLSX with preview
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const fileExt = file.name.split('.').pop().toLowerCase();

    reader.onload = (event) => {
      let parsed = [];

      try {
        if (fileExt === 'json') {
          const json = JSON.parse(event.target.result);
          if (Array.isArray(json)) parsed = json;
          else alert('Invalid JSON format: must be an array of products.');
        } else if (fileExt === 'csv') {
          parsed = parseCSVtoProducts(event.target.result);
        } else if (fileExt === 'xlsx') {
          const workbook = XLSX.read(event.target.result, { type: 'binary' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const csv = XLSX.utils.sheet_to_csv(sheet);
          parsed = parseCSVtoProducts(csv);
        } else {
          alert('Unsupported file type.');
          return;
        }
      } catch (err) {
        alert('Failed to parse file: ' + err.message);
        return;
      }

      if (parsed.length) {
        setImportPreview(parsed);
        setShowPreview(true);
      } else {
        alert('No valid products found in import.');
      }
    };

    if (fileExt === 'xlsx') {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  };

  // Confirm import: replace current products with preview
  const confirmImport = () => {
    setProducts(importPreview);
    setImportPreview([]);
    setShowPreview(false);
  };

  // Export handler for JSON, CSV, XLSX
  const handleExport = () => {
    if (exportFormat === 'json') {
      const dataStr = JSON.stringify(products, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products-export.json';
      a.click();
      URL.revokeObjectURL(url);
    } else if (exportFormat === 'csv') {
      const csvRows = productsToShopifyCSV(products);
      const csvStr = arrayToCSV(csvRows);
      const blob = new Blob([csvStr], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products-export.csv';
      a.click();
      URL.revokeObjectURL(url);
    } else if (exportFormat === 'xlsx') {
      const csvRows = productsToShopifyCSV(products);
      const ws = XLSX.utils.json_to_sheet(csvRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Products');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products-export.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Product Bible</h1>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() =>
            setEditingProduct({ id: null, title: '', variants: [], images: [], description: '', categories: [], tags: [] })
          }
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>

        <div>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="border rounded px-2 py-1 mr-2"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="xlsx">XLSX</option>
          </select>
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Export
          </button>
        </div>

        <label className="bg-gray-300 px-4 py-2 rounded cursor-pointer">
          Import File
          <input
            type="file"
            accept=".json,.csv,.xlsx"
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

      {filteredProducts.length === 0 && <p>No products found.</p>}

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
                  <p><strong>Barcode:</strong> {variant
