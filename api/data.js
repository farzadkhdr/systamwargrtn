// Client-side utility for sending data

class RequestSender {
  constructor(apiBaseUrl = '/api') {
    this.apiBaseUrl = apiBaseUrl;
  }

  // Submit a request
  async submitRequest(requestData) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error submitting request:', error);
      return {
        success: false,
        error: 'پەیوەندی بە سێرڤەرەوە شکستی هێنا'
      };
    }
  }

  // Get advertisements
  async getAdvertisements() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/advertisements`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error getting advertisements:', error);
      return {
        success: false,
        data: []
      };
    }
  }

  // Track advertisement click
  async trackAdClick(adId) {
    try {
      await fetch(`${this.apiBaseUrl}/advertisements/${adId}/click`, {
        method: 'POST'
      });
      return { success: true };
    } catch (error) {
      console.error('Error tracking ad click:', error);
      return { success: false };
    }
  }

  // Get location suggestions
  async getLocations(query = '') {
    try {
      const url = query 
        ? `${this.apiBaseUrl}/locations?q=${encodeURIComponent(query)}`
        : `${this.apiBaseUrl}/locations`;
      
      const response = await fetch(url);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error getting locations:', error);
      return {
        success: false,
        data: []
      };
    }
  }

  // Get house sizes
  async getHouseSizes() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/house-sizes`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error getting house sizes:', error);
      return {
        success: false,
        data: []
      };
    }
  }

  // Check API health
  async checkHealth() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/health`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error checking API health:', error);
      return {
        success: false,
        message: 'API ناچالاکە'
      };
    }
  }
}

// Create global instance for browser use
if (typeof window !== 'undefined') {
  window.RequestSender = RequestSender;
  window.requestSender = new RequestSender('/api');
}

// Export for Node.js
module.exports = {
  RequestSender,
  requestSender: new RequestSender()
};
