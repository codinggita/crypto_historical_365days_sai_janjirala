import api from './api';

const coinService = {
  async getAllCoins(params = {}) {
    const response = await api.get('/coins', { params });
    return response.data;
  },

  async searchCoins(q) {
    const response = await api.get('/search/coins', { params: { q } });
    return response.data;
  },

  async sortByPreset(preset, params = {}) {
    const response = await api.get(`/coins/sort/${preset}`, { params });
    return response.data;
  },

  async filterPreset(type, params = {}) {
    const response = await api.get(`/coins/filter/${type}`, { params });
    return response.data;
  },

  async getCoinById(id) {
    const response = await api.get(`/coins/${id}`);
    return response.data;
  },

  async getLatest() {
    const response = await api.get('/coins/latest');
    return response.data;
  },

  async getTopMarketCap() {
    const response = await api.get('/coins/top-market-cap');
    return response.data;
  },

  async getTopVolume() {
    const response = await api.get('/coins/top-volume');
    return response.data;
  },

  async getTopGainers() {
    const response = await api.get('/coins/top-gainers');
    return response.data;
  },

  async getTopLosers() {
    const response = await api.get('/coins/top-losers');
    return response.data;
  },

  async getTrending() {
    const response = await api.get('/coins/trending');
    return response.data;
  },

  async getMarketStatus() {
    const response = await api.get('/coins/market-status');
    return response.data;
  },

  async getHistory(coinId, month) {
    const path = month ? `/coins/history/${coinId}/${month}` : `/coins/history/${coinId}`;
    const response = await api.get(path);
    return response.data;
  },

  async compareCoins(coin1, coin2, coin3) {
    const path = coin3 
      ? `/coins/compare/${coin1}/${coin2}/${coin3}` 
      : `/coins/compare/${coin1}/${coin2}`;
    const response = await api.get(path);
    return response.data;
  },

  async getHeatmap() {
    const response = await api.get('/coins/heatmap');
    return response.data;
  },

  async getPredictions() {
    const response = await api.get('/coins/predictions');
    return response.data;
  },

  async getRecommendations() {
    const response = await api.get('/coins/recommendations');
    return response.data;
  },

  async simulatePortfolio(allocation) {
    const response = await api.get('/coins/portfolio/simulate', { params: { allocation: JSON.stringify(allocation) } });
    return response.data;
  },

  async getVolatility(coinId) {
    const response = await api.get(`/coins/volatility/${coinId}`);
    return response.data;
  },

  async getReturns(coinId) {
    const response = await api.get(`/coins/returns/${coinId}`);
    return response.data;
  },

  async getMarketCapDetails(coinId) {
    const response = await api.get(`/coins/market-cap/${coinId}`);
    return response.data;
  },

  async getVolumeDetails(coinId) {
    const response = await api.get(`/coins/volume/${coinId}`);
    return response.data;
  },

  async createCoin(coinData) {
    const response = await api.post('/coins', coinData);
    return response.data;
  },

  async updateCoin(id, coinData) {
    const response = await api.patch(`/coins/${id}`, coinData);
    return response.data;
  },

  async deleteCoin(id) {
    const response = await api.delete(`/coins/${id}`);
    return response.data;
  },

  async bulkCreate(records) {
    const response = await api.post('/coins/bulk-create', { records });
    return response.data;
  },

  async bulkUpdate(records) {
    const response = await api.patch('/coins/bulk-update', { records });
    return response.data;
  },

  async bulkDelete(ids) {
    const response = await api.delete('/coins/bulk-delete', { data: { ids } });
    return response.data;
  },

  async getHighVolatilityAlerts() {
    const response = await api.get('/coins/alerts/high-volatility');
    return response.data;
  },

  async getMarketDropAlerts() {
    const response = await api.get('/coins/alerts/market-drop');
    return response.data;
  },

  async getTopMonthlyPerformers() {
    const response = await api.get('/coins/performance/top-monthly');
    return response.data;
  },

  async getTopYearlyPerformers() {
    const response = await api.get('/coins/performance/top-yearly');
    return response.data;
  },

  async submitReport(reportData) {
    const response = await api.post('/coins/report', reportData);
    return response.data;
  },

  async clearCache() {
    const response = await api.get('/coins/cache/clear');
    return response.data;
  },

  async getSystemHealth() {
    const response = await api.get('/coins/system/health');
    return response.data;
  },

  async getSystemVersion() {
    const response = await api.get('/coins/system/version');
    return response.data;
  },

  async getSystemConfig() {
    const response = await api.get('/coins/system/config');
    return response.data;
  },

  async exportJson() {
    const response = await api.get('/coins/export/json');
    return response.data;
  },

  async exportCsv() {
    const response = await api.get('/coins/export/csv', { responseType: 'blob' });
    return response.data;
  }
};

export default coinService;
