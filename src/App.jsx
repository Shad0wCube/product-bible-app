import React, { useEffect, useState, useRef } from 'react';
import Papa from 'papaparse';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from 'react-router-dom';
import ProductEditor from './components/ProductEditor';

function ProductList({ products, setProducts, setSelected, handleDelete }) {
  const fileInputRef = useRef();
  const [filterCollection, setFilterCollection] = useState('');

  // Unique collections for filter dropdown
  const allCollections = Array.from(
    new Set(products.flatMap((p) => p.collections || []))
  ).sort();

  // Filter products by selected collection
  const filteredProducts = filterCollection
    ? products.filter((p) => (p.collections || []).includes(filterCollection))
    : products;

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const rows = results.data;
        const imported = [];

        rows.forEach((row) => {
          if (!row['Title']) return;

          const existing = imported.find((p) => p.title === row['Title']);

          if (existing) {
            if (row['Image Src']) {
              existing.images.push(row['Image Src']);
            }
          } else {
            imported.push({
              id: crypto.randomUUID(),
              title: row['Title'],
              description: row['Body (HTML)'] || '',
              categories: row['Type'] ? [row['Type']] : [],
              collections: row['Collection']
                ? row['Collection'].split(',').map((c) => c.trim())
                : [],
              images: row['Image Src'] ? [row['Image Src']] : [],
              tags: row['Tags'] ? row['Tags'].split(',').map((t) => t.trim()) : [],
              sku: row['Variant SKU'] || '',
              barcode: row['Variant Barcode'] || '',
            });
          }
        });

        setProducts(imported);
        fileInputRef.current.value = null;
        setFilterCollection('');
      },
    });
  };

  const handleExport = () => {
    const csv = Papa.unparse(
      products.map((p) => ({
        ID: p.id,
        Title: p.title,
        Description: p.description,
        Categories: p.categories?.join(', '),
        Collections: p.collections?.join(', '),
        Images: p.images?.join(', '),
        Tags: p.tags?.join(', '),
        SKU: p.sku,
        Barcode: p.barcode,
      }))
    );

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'product-bible-export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold">Product Bible</h1>
        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-green-600 text-white px-4 py-2 rounded shadow"
          >
            Import CSV
          </button>
          <button
            onClick={handleExport}
            className="bg-yellow-500 text-white px-4 py-2 rounded shadow"
          >
            Export CSV
          </button>
          <button
            onClick={() => setSelected({})}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow"
          >
            + Add Product
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>

      {/* Filter by Collection */}
      <div className="mb-6">
        <label className="mr-2 font-semibold">Filter by Collection:</label>
        <select
          className="border rounded px-2 py-1"
          value={filterCollection}
          onChange={(e) => setFilterCollection(e.target.value)}
        >
          <option value="">-- All Collections --</option>
          {allCollections.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="border rounded-lg shadow hover:shadow-lg transition overflow-hidden bg-white"
          >
            <Link to={`/product/${p.id}`}>
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {p.images && p.images[0] ? (
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-sm">No Image</div>
                )}
              </div>
            </Link>
            <div className="p-4">
              <Link to={`/product/${p.id}`} className="block">
                <h2 className="text-lg font-semibold mb-1 hover:underline text-blue-700">
                  {p.title}
                </h2>
              </Link>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Collections: </strong>
                {p.collections?.join(', ') || '—'}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>SKU:</strong> {p.sku || '—'}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Barcode:</strong> {p.barcode || '—'}
              </p>
              <div className="flex justify-between text-sm">
                <button
                  onClick={() => setSelected(p)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductPage({ products }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <button onClick={() => navigate('/')} className="text-blue-600 underline">
          Back to products
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <button onClick={() => navigate('/')} className="mb-4 text-blue-600 underline">
        &larr; Back to Products
      </button>
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

      {product.images && product.images.length > 0 && (
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {product.images.map((src, i) => (
            <img key={i} src={src} alt={product.title} className="rounded border" />
          ))}
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Description</h2>
        <p
          className="whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>

      {product.categories && product.categories.length > 0 && (
        <div className="mb-2">
          <strong>Categories:</strong> {product.categories.join(', ')}
        </div>
      )}

      {product.collections && product.collections.length > 0 && (
        <div className="mb-2">
          <strong>Collections:</strong> {product.collections.join(', ')}
        </div>
      )}

      {product.tags && product.tags.length > 0 && (
        <div className="mb-2">
          <strong>Tags:</strong> {product.tags.join(', ')}
        </div>
      )}

      {(product.sku || product.barcode) && (
        <div className="mb-2">
          {product.sku && (
            <div>
              <strong>SKU:</strong> {product.sku}
            </div>
          )}
          {product.barcode && (
            <div>
              <strong>Barcode:</strong> {product.barcode}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AppWrapper() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('products');
    if (stored) setProducts(JSON.parse(stored));
  }, []);

  // Save to localStorage
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
                handleDelete={handleDelete}
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
