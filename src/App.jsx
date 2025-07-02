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

function ProductList({ products, setProducts, setSelected }) {
  const fileInputRef = useRef();

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const importedProducts = {};
        results.data.forEach(row => {
          if (!row.Handle) return; // skip rows without handle

          if (!importedProducts[row.Handle]) {
            importedProducts[row.Handle] = {
              id: crypto.randomUUID(),
              handle: row.Handle,
              title: row.Title || '',
              description: row['Body (HTML)'] || '',
              categories: row.Type ? [row.Type] : [],
              images: row['Image Src'] ? [row['Image Src']] : [],
              tags: row.Tags ? row.Tags.split(',').map(t => t.trim()) : [],
              variants: [],
            };
          }

          // Add variant for this row
          const variant = {
            id: crypto.randomUUID(),
            sku: row['Variant SKU'] || '',
            price: row['Variant Price'] || '',
            barcode: row['Variant Barcode'] || '',
            inventory_quantity: row['Variant Inventory Qty'] || '',
            option1_name: row['Option1 Name'] || '',
            option1_value: row['Option1 Value'] || '',
            option2_name: row['Option2 Name'] || '',
            option2_value: row['Option2 Value'] || '',
            option3_name: row['Option3 Name'] || '',
            option3_value: row['Option3 Value'] || '',
          };

          importedProducts[row.Handle].variants.push(variant);

          // Add images if unique
          if (row['Image Src'] && !importedProducts[row.Handle].images.includes(row['Image Src'])) {
            importedProducts[row.Handle].images.push(row['Image Src']);
          }
        });

        setProducts(Object.values(importedProducts));
        fileInputRef.current.value = null;
      },
    });
  };

  const handleExport = () => {
    // Flatten products with variants to Shopify CSV format
    const rows = [];
    products.forEach((product) => {
      if (product.variants.length === 0) {
        // No variants: export a single row
        rows.push({
          Handle: product.handle || product.id,
          Title: product.title,
          'Body (HTML)': product.description,
          Type: product.categories?.[0] || '',
          Tags: product.tags?.join(', ') || '',
          'Image Src': product.images?.[0] || '',
          'Variant SKU': '',
          'Variant Price': '',
          'Variant Barcode': '',
          'Variant Inventory Qty': '',
          'Option1 Name': '',
          'Option1 Value': '',
          'Option2 Name': '',
          'Option2 Value': '',
          'Option3 Name': '',
          'Option3 Value': '',
        });
      } else {
        product.variants.forEach((variant, i) => {
          rows.push({
            Handle: product.handle || product.id,
            Title: i === 0 ? product.title : '', // only on first variant
            'Body (HTML)': i === 0 ? product.description : '',
            Type: i === 0 ? product.categories?.[0] || '' : '',
            Tags: i === 0 ? product.tags?.join(', ') || '' : '',
            'Image Src': i === 0 ? product.images?.[0] || '' : '',
            'Variant SKU': variant.sku,
            'Variant Price': variant.price,
            'Variant Barcode': variant.barcode,
            'Variant Inventory Qty': variant.inventory_quantity,
            'Option1 Name': variant.option1_name,
            'Option1 Value': variant.option1_value,
            'Option2 Name': variant.option2_name,
            'Option2 Value': variant.option2_value,
            'Option3 Name': variant.option3_name,
            'Option3 Value': variant.option3_value,
          });
        });
      }
    });

    const csv = Papa.unparse(rows);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'product-bible-shopify-export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id) => {
    const confirm1 = window.confirm('Are you sure you want to delete this product?');
    if (!confirm1) return;
    const confirm2 = window.confirm('This will permanently remove it. Confirm again?');
    if (!confirm2) return;

    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold">Product Bible</h1>
        <div className="flex gap-2">
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

      {/* Product Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
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
                <h2 className="text-lg font-semibold mb-1 hover:underline text-blue-700">{p.title}</h2>
              </Link>
              <p className="text-sm text-gray-600 mb-2">{p.categories?.join(', ')}</p>
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
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 underline"
        >
          Back to products
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <button
        onClick={() => navigate('/')}
        className="mb-4 text-blue-600 underline"
      >
        &larr; Back to Products
      </button>
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

      {product.images && product.images.length > 0 && (
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {product.images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={product.title}
              className="rounded border"
            />
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

      {product.tags && product.tags.length > 0 && (
        <div className="mb-2">
          <strong>Tags:</strong> {product.tags.join(', ')}
        </div>
      )}

      {product.variants && product.variants.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Variants</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-1">SKU</th>
                <th className="border border-gray-300 p-1">Price</th>
                <th className="border border-gray-300 p-1">Barcode</th>
                <th className="border border-gray-300 p-1">Inventory Qty</th>
                <th className="border border-gray-300 p-1">Option 1</th>
                <th className="border border-gray-300 p-1">Option 2</th>
                <th className="border border-gray-300 p-1">Option 3</th>
              </tr>
            </thead>
            <tbody>
              {product.variants.map((v) => (
                <tr key={v.id}>
                  <td className="border border-gray-300 p-1">{v.sku}</td>
                  <td className="border border-gray-300 p-1">{v.price}</td>
                  <td className="border border-gray-300 p-1">{v.barcode}</td>
                  <td className="border border-gray-300 p-1">{v.inventory_quantity}</td>
                  <td className="border border-gray-300 p-1">
                    {v.option1_name}: {v.option1_value}
                  </td>
                  <td className="border border-gray-300 p-1">
                    {v.option2_name}: {v.option2_value}
                  </td>
                  <td className="border border-gray-300 p-1">
                    {v.option3_name}: {v.option3_value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
