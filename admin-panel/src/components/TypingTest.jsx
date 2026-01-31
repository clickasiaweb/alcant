import React, { useState } from 'react';

// Simple test component to isolate typing issue
export default function TypingTest() {
  const [value, setValue] = useState('');
  const [slug, setSlug] = useState('');

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    // Simple slug generation without any complex logic
    setSlug(newValue.toLowerCase().replace(/\s+/g, '-'));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Typing Test Component</h2>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Type here to test"
        style={{ 
          padding: '10px', 
          fontSize: '16px', 
          border: '1px solid #ccc',
          borderRadius: '4px',
          width: '300px'
        }}
      />
      <p>Value: {value}</p>
      <p>Slug: {slug}</p>
    </div>
  );
}
