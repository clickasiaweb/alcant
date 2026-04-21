const testOrderData = {
  products: [{
    productId: "test",
    name: "Test Product",
    price: 1000,
    quantity: 1,
    image: "https://alcant12.vercel.app/images/products/default.jpg",
    variant: {
      color: "Black",
      size: "M"
    }
  }],
  shippingAddress: {
    firstName: "Test",
    lastName: "User",
    address: "123 Test St",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    country: "India",
    phone: "1234567890",
    email: "test@example.com"
  },
  paymentMethod: "Credit Card",
  paymentDetails: {
    paidAt: "2026-04-20T12:30:00.000Z",
    transactionId: "TXN123"
  },
  discount: 0,
  notes: "Test order"
};

console.log('Testing order creation...');
console.log('Order data:', JSON.stringify(testOrderData, null, 2));

fetch('https://alcant-backend.vercel.app/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testOrderData)
})
.then(response => {
  console.log('Response status:', response.status);
  console.log('Response headers:', response.headers);
  return response.json();
})
.then(data => {
  console.log('Response data:', data);
})
.catch(error => {
  console.error('Error:', error);
});
