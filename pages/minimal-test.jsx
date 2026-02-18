import React, { createContext, useContext, useState } from 'react';

// Create a simple test context
const TestContext = createContext();

const TestProvider = ({ children }) => {
  const [count, setCount] = useState(0);
  
  return (
    <TestContext.Provider value={{ count, setCount }}>
      {children}
    </TestContext.Provider>
  );
};

const useTest = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};

const TestComponent = () => {
  const { count, setCount } = useTest();
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

const MinimalTest = () => {
  return (
    <TestProvider>
      <div style={{ padding: '20px' }}>
        <h1>Minimal Context Test</h1>
        <p>If this works, the context system is functioning.</p>
        <TestComponent />
      </div>
    </TestProvider>
  );
};

export default MinimalTest;
