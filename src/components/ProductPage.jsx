import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ProductPage({ products }) {
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
        <div dangerouslySetInnerHTML={{ __html: product.description }} />
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
          <h2 className="text-xl font-semibold">Variants</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">SKU</th>
                <th className="border border-gray-300 p-2 text-left">Option 1</th>
                <th className="border border-gray-300 p-2 text-left">Option 2</th>
                <th className="border border-gray-300 p-2 text-left">Option 3</th>
                <th className="border border-gray-300 p-2 text-left">Price</th>
                <th className="border border-gray-300 p-2 text-left">Barcode</th>
                <th className="border border-gray-300 p-2 text-left">Inventory</th>
              </tr>
            </thead>
            <tbody>
              {product.variants.map((v, i) => (
                <tr key={i}>
                  <td className="border border-gray-300 p-2">{v.sku}</td>
                  <td className="border border-gray-300 p-2">{v.option1}</td>
                  <td className="border border-gray-300 p-2">{v.option2}</td>
                  <td className="border border-gray-300 p-2">{v.option3}</td>
                  <td className="border border-gray-300 p-2">{v.price}</td>
                  <td className="border border-gray-300 p-2">{v.barcode}</td>
                  <td className="border border-gray-300 p-2">{v.inventory_quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
