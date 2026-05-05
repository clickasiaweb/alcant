// Clear browser cache and localStorage
console.log('🧹 Clearing cache...');

if (typeof window !== 'undefined') {
  // Clear localStorage
  localStorage.clear();
  console.log('✅ LocalStorage cleared');
  
  // Clear sessionStorage
  sessionStorage.clear();
  console.log('✅ SessionStorage cleared');
  
  // Reload the page
  console.log('🔄 Reloading page...');
  window.location.reload();
} else {
  console.log('❌ Not in browser environment');
}
