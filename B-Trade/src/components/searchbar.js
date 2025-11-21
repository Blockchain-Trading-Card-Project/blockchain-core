import React from "react";

export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search cards..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
}
