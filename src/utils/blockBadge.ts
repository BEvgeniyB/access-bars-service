// Block badge API requests to prevent CORS errors in console
export const blockBadgeRequests = () => {
  // Override fetch to block badge requests
  const originalFetch = window.fetch;
  window.fetch = function(url: string | Request | URL, options?: RequestInit) {
    const urlString = typeof url === 'string' ? url : url.toString();
    
    // Block badge-related requests
    if (urlString.includes('api.poehali.dev/api/project/badge')) {
      return Promise.reject(new Error('Badge request blocked to prevent CORS errors'));
    }
    
    return originalFetch.call(this, url, options);
  };

  // Override XMLHttpRequest for older code
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method: string, url: string | URL, ...args: any[]) {
    const urlString = typeof url === 'string' ? url : url.toString();
    
    if (urlString.includes('api.poehali.dev/api/project/badge')) {
      // Silently fail the request
      this.addEventListener('loadstart', () => {
        this.abort();
      });
    }
    
    return originalOpen.call(this, method, url, ...args);
  };
};

// Initialize on DOM ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', blockBadgeRequests);
  } else {
    blockBadgeRequests();
  }
}