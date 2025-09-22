// Block badge API requests to prevent CORS errors in console
export const blockBadgeRequests = () => {
  // Override fetch to block badge requests
  const originalFetch = window.fetch;
  window.fetch = function(url: string | Request | URL, options?: RequestInit) {
    const urlString = typeof url === 'string' ? url : url.toString();
    
    // Block badge-related requests
    if (urlString.includes('api.poehali.dev') || urlString.includes('poehali.dev/api')) {
      console.log('🚫 Заблокирован запрос к poehali.dev API:', urlString);
      return Promise.resolve(new Response('blocked', { status: 200 }));
    }
    
    return originalFetch.call(this, url, options);
  };

  // Override XMLHttpRequest for older code
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method: string, url: string | URL, ...args: any[]) {
    const urlString = typeof url === 'string' ? url : url.toString();
    
    if (urlString.includes('api.poehali.dev') || urlString.includes('poehali.dev/api')) {
      console.log('🚫 Заблокирован XMLHttpRequest к poehali.dev API:', urlString);
      // Prevent the request from happening
      setTimeout(() => {
        this.dispatchEvent(new Event('load'));
      }, 0);
      return;
    }
    
    return originalOpen.call(this, method, url, ...args);
  };

  // Also override send to prevent actual requests
  const originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(body?: any) {
    if (this.responseURL?.includes('poehali.dev') || 
        (this as any)._url?.includes('poehali.dev')) {
      console.log('🚫 Остановлена отправка запроса к poehali.dev');
      return;
    }
    return originalSend.call(this, body);
  };
};

// Initialize immediately and on DOM ready
if (typeof window !== 'undefined') {
  // Запускаем сразу
  blockBadgeRequests();
  
  // И еще раз при готовности DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', blockBadgeRequests);
  }
  
  // И при полной загрузке страницы
  window.addEventListener('load', blockBadgeRequests);
}