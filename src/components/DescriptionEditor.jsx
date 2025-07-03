import React from 'react';

export default function DescriptionEditor({ value, onChange }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter product description..."
      rows={5}
      className="border rounded w-full p-2"
    />
  );
}
