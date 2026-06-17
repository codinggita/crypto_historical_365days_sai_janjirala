import api from './api';

const statsService = {
  async getMarketSummary() {
    const response = await api.get('/stats/market-summary');
    return response.data;
  },

  async getYearlyAnalysis() {
    const response = await api.get('/stats/yearly-analysis');
    return response.data;
  },

  async getMonthlyAnalysis() {
    const response = await api.get('/stats/monthly-analysis');
    return response.data;
  },

  async getCoinCount() {
    const response = await api.get('/stats/coin-count');
    return response.data;
  },

  async getAveragePrice() {
    const response = await api.get('/stats/average-price');
    return response.data;
  },

  async getAverageVolume() {
    const response = await api.get('/stats/average-volume');
    return response.data;
  },

  async getHighestMarketCap() {
    const response = await api.get('/stats/highest-market-cap');
    return response.data;
  },

  async getHighestVolume() {
    const response = await api.get('/stats/highest-volume');
    return response.data;
  }
};

export default statsService;
