import React from 'react';

export default function ProductView({ product }) {
  const { title, description, images, variants } = product;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>

      {/* Images gallery (simple) */}
      <div className="flex gap-4 overflow-x-auto mb-6">
        {images && images.length > 0 ? (
          images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${title} image ${i + 1}`}
              className="w-32 h-32 object-cover rounded border"
            />
          ))
        ) : (
          <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded">
            No Images
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-6 prose max-w-none" dangerouslySetInnerHTML={{ __html: description }} />

      {/* Variants grid */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Variants</h2>
        {variants && variants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {variants.map((variant, i) => (
              <div
                key={i}
                className="border rounded p-4 shadow hover:shadow-md transition"
              >
                <div className="font-semibold mb-1">{variant.sku || 'No SKU'}</div>
                <div className="text-sm text-gray-600 mb-2">
                  {variant.option1 || ''} {variant.option2 ? `| ${variant.option2}` : ''} {variant.option3 ? `| ${variant.option3}` : ''}
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Price:</span>
                  <span>{variant.price ? `£${variant.price}` : 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Quantity:</span>
                  <span>{variant.quantity || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Barcode:</span>
                  <span>{variant.barcode || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No variants available.</p>
        )}
      </div>
    </div>
  );
}
