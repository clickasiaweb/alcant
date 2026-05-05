// Cache clearing script for production
(function() {
  console.log('🧹 Clearing all caches...');
  
  // Clear localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
    console.log('✅ LocalStorage cleared');
  }
  
  // Clear sessionStorage  
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.clear();
    console.log('✅ SessionStorage cleared');
  }
  
  // Clear service worker cache if available
  if ('caches' in window) {
    caches.keys().then(function(cacheNames) {
      cacheNames.forEach(function(cacheName) {
        caches.delete(cacheName);
      });
      console.log('✅ Service worker caches cleared');
    });
  }
  
  // Clear application cache
  if (window.applicationCache) {
    window.applicationCache.update();
    console.log('✅ Application cache cleared');
  }
  
  console.log('🔄 Refreshing page in 2 seconds...');
  setTimeout(() => {
    window.location.reload(true);
  }, 2000);
})();
