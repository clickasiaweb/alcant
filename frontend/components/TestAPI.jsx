import React, { useState, useEffect } from "react";
import apiClient from "../lib/api";

const TestAPI = () => {
  const [result, setResult] = useState("Loading...");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const testConnection = async () => {
      try {
        console.log("Testing API connection...");
        
        // Test 1: Health check
        const healthResponse = await apiClient.get('/health');
        console.log("Health check:", healthResponse.data);
        
        // Test 2: Products endpoint
        const productsResponse = await apiClient.get('/products/new');
        console.log("Products:", productsResponse.data);
        
        setResult(`✅ API Working! Health: ${healthResponse.data.status}, Products: ${productsResponse.data.products?.length || 0} found`);
      } catch (error) {
        console.error("API Test failed:", error);
        setResult(`❌ API Error: ${error.message}`);
      }
    };

    testConnection();
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <strong>API Test:</strong> Loading...
      </div>
    );
  }

  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
      <strong>API Test:</strong> {result}
    </div>
  );
};

export default TestAPI;
