import React from "react";
import ReactDOM from "react-dom/client";

// Simple test component
function TestApp() {
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1>🎉 Admin Panel Test Page</h1>
      <p>This is a test to see if React is working.</p>
      <div style={{
        background: 'white',
        color: 'black',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>✅ React is Working!</h2>
        <p>If you can see this page, then:</p>
        <ul>
          <li>✅ React is rendering correctly</li>
          <li>✅ Webpack is working</li>
          <li>✅ The server is serving content</li>
        </ul>
        <button 
          onClick={() => alert('Button clicked!')}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test JavaScript
        </button>
      </div>
    </div>
  );
}

export default TestApp;
