// Utility module for receiving data from other systems
const axios = require('axios');

class DataReceiver {
  constructor(baseURL) {
    this.baseURL = baseURL || 'https://systamwargrtn.vercel.app/api';
    this.axios = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  // Send request to admin system
  async sendRequest(requestData) {
    try {
      const response = await this.axios.post('/requests', requestData);
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      console.error('Error sending request to admin system:', error.message);
      return {
        success: false,
        error: error.message,
        status: error.response?.status || 500
      };
    }
  }

  // Get advertisements from admin system
  async getAdvertisements(activeOnly = false) {
    try {
      const url = activeOnly ? '/advertisements?activeOnly=true' : '/advertisements';
      const response = await this.axios.get(url);
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      console.error('Error getting advertisements:', error.message);
      return {
        success: false,
        error: error.message,
        status: error.response?.status || 500
      };
    }
  }

  // Track advertisement view
  async trackAdView(adId) {
    try {
      await this.axios.post(`/advertisements/${adId}/view`);
      return { success: true };
    } catch (error) {
      console.error('Error tracking ad view:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Track advertisement click
  async trackAdClick(adId) {
    try {
      await this.axios.post(`/advertisements/${adId}/click`);
      return { success: true };
    } catch (error) {
      console.error('Error tracking ad click:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const response = await this.axios.get('/dashboard/stats');
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error.message);
      return {
        success: false,
        error: error.message,
        status: error.response?.status || 500
      };
    }
  }

  // Check system health
  async checkHealth() {
    try {
      const response = await this.axios.get('/health');
      return {
        success: true,
        data: response.data,
        status: response.status,
        online: true
      };
    } catch (error) {
      console.error('Admin system is offline:', error.message);
      return {
        success: false,
        error: error.message,
        online: false
      };
    }
  }

  // Sync data from external system
  async syncExternalData(dataType, data) {
    try {
      let endpoint = '';
      let method = 'POST';
      
      switch(dataType) {
        case 'requests':
          endpoint = '/requests/batch';
          method = 'POST';
          break;
        case 'houses':
          endpoint = '/houses/batch';
          method = 'POST';
          break;
        case 'lands':
          endpoint = '/lands/batch';
          method = 'POST';
          break;
        case 'advertisements':
          endpoint = '/advertisements/batch';
          method = 'POST';
          break;
        default:
          throw new Error('جۆری داتای نادروست');
      }
      
      const response = await this.axios({
        method,
        url: endpoint,
        data
      });
      
      return {
        success: true,
        data: response.data,
        status: response.status,
        synced: data.length
      };
    } catch (error) {
      console.error(`Error syncing ${dataType}:`, error.message);
      return {
        success: false,
        error: error.message,
        status: error.response?.status || 500
      };
    }
  }
}

// Create instance for export
const dataReceiver = new DataReceiver();

// Export for use in other modules
module.exports = {
  DataReceiver,
  dataReceiver
};

// For direct testing
if (require.main === module) {
  (async () => {
    console.log('🧪 Testing DataReceiver...');
    
    const receiver = new DataReceiver();
    
    // Test health check
    const health = await receiver.checkHealth();
    console.log('Health Check:', health.online ? '✅ Online' : '❌ Offline');
    
    if (health.online) {
      // Test getting ads
      const ads = await receiver.getAdvertisements(true);
      console.log('Active Ads:', ads.success ? `✅ ${ads.data.count} ads` : '❌ Failed');
      
      // Test getting stats
      const stats = await receiver.getDashboardStats();
      console.log('Dashboard Stats:', stats.success ? '✅ Received' : '❌ Failed');
    }
  })();
}