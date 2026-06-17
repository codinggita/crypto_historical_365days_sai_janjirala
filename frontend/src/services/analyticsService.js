import api from './api';

const analyticsService = {
  async getHighestPrice() {
    const response = await api.get('/analytics/price/highest');
    return response.data;
  },

  async getLowestPrice() {
    const response = await api.get('/analytics/price/lowest');
    return response.data;
  },

  async getPriceSummary() {
    const response = await api.get('/analytics/price');
    return response.data;
  },

  async getVolumeSpike() {
    const response = await api.get('/analytics/volume/spike');
    return response.data;
  },

  async getHighVolatility() {
    const response = await api.get('/analytics/volatility/high');
    return response.data;
  },

  async getTopReturns() {
    const response = await api.get('/analytics/returns/top');
    return response.data;
  },

  async getNegativeReturns() {
    const response = await api.get('/analytics/returns/negative');
    return response.data;
  },

  async getCumulativeReturns() {
    const response = await api.get('/analytics/returns/cumulative');
    return response.data;
  }
};

export default analyticsService;
