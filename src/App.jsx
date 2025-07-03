import React, { useState, useEffect } from 'react';
import ProductEditor from './components/ProductEditor';

// Shopify CSV headers array (same as before)
const SHOPIFY_CSV_HEADERS = [
  "Handle","Title","Body (HTML)","Vendor","Product Category","Type","Tags","Published",
  "Option1 Name","Option1 Value","Option1 Linked To",
  "Option2 Name","Option2 Value","Option2 Linked To",
  "Option3 Name","Option3 Value","Option3 Linked To",
  "Variant SKU","Variant Grams","Variant Inventory Tracker","Variant Inventory Qty",
  "Variant Inventory Policy","Variant Fulfillment Service","Variant Price","Variant Compare At Price",
  "Variant Requires Shipping","Variant Taxable","Variant Barcode","Image Src","Image Position","Image Alt Text",
  "Gift Card","SEO Title","SEO Description","Google Shopping / Google Product Category",
  "Google Shopping / Gender","Google Shopping / Age Group","Google Shopping / MPN","Google Shopping / Condition",
  "Google Shopping / Custom Product","Google Shopping / Custom Label 0","Google Shopping / Custom Label 1",
  "Google Shopping / Custom Label 2","Google Shopping / Custom Label 3","Google Shopping / Custom Label 4",
  "Diameter (product.metafields.custom.diameter)","Download Text 1 (product.metafields.custom.download_text_1)",
  "Download Text 2 (product.metafields.custom.download_text_2)","Download Text 3 (product.metafields.custom.download_text_3)",
  "Download Text 4 (product.metafields.custom.download_text_4)","Download Text 5 (product.metafields.custom.download_text_5)",
  "Sale/Clearance (product.metafields.custom.sale_clearance)","thickness (product.metafields.custom.thickness)",
  "Google: Custom Product (product.metafields.mm-google-shopping.custom_product)","Volume Pricing (product.metafields.pricing.volume)",
  "Depth (product.metafields.product.depth)","Environment (product.metafields.product.enviroment)",
  "Extendable (product.metafields.product.extendable)","Fitting Included (product.metafields.product.fittings_included)",
  "Height (product.metafields.product.height)","Height Adjustment (product.metafields.product.height_adjustment)",
  "Install Difficulty (product.metafields.product.install_difficulty)","Load Rating (product.metafields.product.load_rating)",
  "Material (product.metafields.product.material)","Style (product.metafields.product.style)","Width (product.metafields.product.width)",
  "Product rating count (product.metafields.reviews.rating_count)","Color (product.metafields.shopify.color-pattern)",
  "Furniture/Fixture material (product.metafields.shopify.furniture-fixture-material)","Material (product.metafields.shopify.material)",
  "Mounting type (product.metafields.shopify.mounting-type)","Shape (product.metafields.shopify.shape)",
  "Suitable location (product.metafields.shopify.suitable-location)","Complementary products (product.metafields.shopify--discovery--product_recommendation.complementary_products)",
  "Related products (product.metafields.shopify--discovery--product_recommendation.related_products)",
  "Related products settings (product.metafields.shopify--discovery--product_recommendation.related_products_display)",
  "Search product boosts (product.metafields.shopify--discovery--product_search_boost.queries)","Box Qty (product.metafields.trade.box_qty)",
  "Min_Qty (product.metafields.trade.min_qty)","Variant Image","Variant Weight Unit","Variant Tax Code",
  "Cost per item","Included / United Kingdom","Price / United Kingdom","Compare At Price / United Kingdom","Status"
];

// CSV parser (RFC 4180 compliant)
// Returns array of objects keyed by headers
function parseCSV(text) {
  const rows = [];
  let pos = 0;
  const len = text.length;
  let row = [];
  let field = '';
  let inQuotes = false;

  const pushField = () => {
    row.push(field);
    field = '';
  };

  while (pos < len) {
    const char = text[pos];

    if (inQuotes) {
      if (char === '"') {
        if (text[pos + 1] === '"') {
          // Escaped quote ""
          field += '"';
          pos += 2;
          continue;
        } else {
          inQuotes = false;
          pos++;
          continue;
        }
      }
      field += char;
      pos++;
    } else {
      if (char === '"') {
        inQuotes = true;
        pos++;
      } else if (char === ',' || char === '\t') {
        pushField();
        pos++;
      } else if (char === '\r') {
        // ignore \r, handle \r\n as \n
        pos++;
      } else if (char === '\n') {
        pushField();
        rows.push(row);
        row = [];
        pos++;
      } else {
        field += char;
        pos++;
      }
    }
  }
  // last field
  if (field !== '' || inQuotes) {
    pushField();
  }
  if (row.length > 0) {
    rows.push(row);
  }

  // headers line (assume first row)
  const headers = rows[0];
  const dataRows = rows.slice(1);

  // Convert rows to array of objects
  return dataRows.map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] || '';
    });
    return obj;
  });
}

// CSV escaping for export (wrap in quotes if contains comma, quote, or newline)
function escapeCSVField(field) {
  if (field == null) return '';
  const fieldStr = String(field);
  if (fieldStr.includes('"')) {
    // Escape quotes by doubling them
    const escaped = fieldStr.replace(/"/g, '""');
    return `"${escaped}"`;
  }
  if (fieldStr.search(/("|,|\n)/g) >= 0) {
    return `"${fieldStr}"`;
  }
  return fieldStr;
}

// Convert products array into CSV string (Shopify format) with proper escaping
function productsToCSV(products) {
  let csv = SHOPIFY_CSV_HEADERS.join(',') + '\n';

  products.forEach(product => {
    product.variants.forEach(variant => {
      const row = SHOPIFY_CSV_HEADERS.map(header => {
        switch(header) {
          case 'Handle': return escapeCSVField(product.id || '');
          case 'Title': return escapeCSVField(product.title || '');
          case 'Body (HTML)': return escapeCSVField(product.description || '');
          case 'Tags': return escapeCSVField(product.tags ? product.tags.join(',') : '');
          case 'Published': return 'TRUE';
          case 'Option1 Name': return 'Option1';
          case 'Option1 Value': return escapeCSVField(variant.option1 || '');
          case 'Option2 Name': return 'Option2';
          case 'Option2 Value': return escapeCSVField(variant.option2 || '');
          case 'Option3 Name': return 'Option3';
          case 'Option3 Value': return escapeCSVField(variant.option3 || '');
          case 'Variant SKU': return escapeCSVField(variant.sku || '');
          case 'Variant Price': return escapeCSVField(variant.price || '');
          case 'Variant Inventory Qty': return escapeCSVField(variant.quantity || '');
          case 'Variant Barcode': return escapeCSVField(variant.barcode || '');
          case 'Image Src': return escapeCSVField(product.images.length > 0 ? product.images[0] : '');
          // Fill other columns blank or extend here with raw fields if you want
          default: return '';
        }
      });
      csv += row.join(',') + '\n';
    });
  });

  return csv;
}

// Convert Shopify CSV row object into product + variant structure
function rowToProduct(row) {
  const productId = row.Handle || 'no-id';
  return {
    id: productId,
    title: row.Title || '',
    description: row["Body (HTML)"] || '',
    tags: row.Tags ? row.Tags.split(',').map(t => t.trim()) : [],
    images: row["Image Src"] ? [row["Image Src"]] : [],
    variants: [{
      sku: row["Variant SKU"] || '',
      option1: row["Option1 Value"] || '',
      option2: row["Option2 Value"] || '',
      option3: row["Option3 Value"] || '',
      price: row["Variant Price"] || '',
      quantity: row["Variant Inventory Qty"] || '',
      barcode: row["Variant Barcode"] || '',
    }],
    rawFields: row
  };
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

  const filteredProducts = products.filter(product => {
    const term = searchTerm.toLowerCase();
    return (
      product.title.toLowerCase().includes(term) ||
      product.variants.some(v =>
        [v.sku, v.barcode].some(code => code ? code.toLowerCase().includes(term) : false)
      )
    );
  });

  const handleSaveProduct = (product) => {
    setProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.map(p => p.id === product.id ? product : p);
      }
      return [...prev, { ...product, id: product.id || Date.now().toString() }];
    });
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

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

  const handleImportJSON = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (Array.isArray(imported)) {
          setProducts(imported);
        } else {
          alert('Invalid JSON file format.');
        }
      } catch {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleImportCSV = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const rows = parseCSV(ev.target.result);
        const map = new Map();

        rows.forEach(row => {
          const handle = row.Handle || 'no-id';
          if (!map.has(handle)) {
            map.set(handle, rowToProduct(row));
          } else {
            const existing = map.get(handle);
            existing.variants.push({
              sku: row["Variant SKU"] || '',
              option1: row["Option1 Value"] || '',
              option2: row["Option2 Value"] || '',
              option3: row["Option3 Value"] || '',
              price: row["Variant Price"] || '',
              quantity: row["Variant Inventory Qty"] || '',
              barcode: row["Variant Barcode"] || '',
            });
          }
        });

        setProducts(Array.from(map.values()));
      } catch (err) {
        console.error(err);
        alert('Failed to parse CSV file.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportCSV = () => {
    const csvStr = productsToCSV(products);
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products-export.csv';
    a.click();
    URL.revokeObjectURL(url);
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
          onClick={handleExportJSON}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export JSON
        </button>

        <label className="bg-green-700 px-4 py-2 rounded text-white cursor-pointer">
          Import JSON
          <input
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            className="hidden"
          />
        </label>

        <button
          onClick={handleExportCSV}
          className="bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Export CSV
        </button>

        <label className="bg-yellow-700 px-4 py-2 rounded text-white cursor-pointer">
          Import CSV
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleImportCSV}
            className="hidden"
          />
        </label>

        <input
          type="search"
          placeholder="Search by title, SKU, or barcode..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded flex-grow min-w-[200px]"
        />
      </div>

      {filteredProducts.length === 0 && (
        <p>No products found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProducts.map(product => (
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
