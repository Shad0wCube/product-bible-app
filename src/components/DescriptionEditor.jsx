import React from 'react';

export default function DescriptionEditor({ value, onChange }) {
  return (
    <textarea
      placeholder="Product Description"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded p-2 w-full h-24"
    />
  );
}
