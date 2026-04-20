// Script to clear cart data and localStorage
if (typeof window !== 'undefined') {
  // Clear localStorage
  localStorage.removeItem('localCart');
  
  // Clear any other cart-related data
  Object.keys(localStorage).forEach(key => {
    if (key.toLowerCase().includes('cart')) {
      localStorage.removeItem(key);
    }
  });
  
  console.log('Cart data cleared from localStorage');
  
  // Reload the page to get fresh data
  setTimeout(() => {
    window.location.reload();
  }, 100);
} else {
  console.log('Run this script in the browser console');
}
