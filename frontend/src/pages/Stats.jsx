import React, { useEffect, useState } from 'react';
import statsService from '../services/statsService';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { Database, Coins, BarChart3, TrendingUp, Calendar, Loader2 } from 'lucide-react';

export default function Stats() {
  const [summary, setSummary] = useState(null);
  const [coinCount, setCoinCount] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyTimeline, setYearlyTimeline] = useState([]);
  const [highestCap, setHighestCap] = useState(null);
  const [highestVol, setHighestVol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError('');
      try {
        const [sumRes, countRes, monthRes, yearRes, maxCapRes, maxVolRes] = await Promise.all([
          statsService.getMarketSummary(),
          statsService.getCoinCount(),
          statsService.getMonthlyAnalysis(),
          statsService.getYearlyAnalysis(),
          statsService.getHighestMarketCap(),
          statsService.getHighestVolume()
        ]);

        if (sumRes.success) setSummary(sumRes);
        if (countRes.success) setCoinCount(countRes.count);
        
        // Parse monthly analysis data
        if (monthRes.success && monthRes.data) {
          const formattedMonths = Object.keys(monthRes.data).map((monthName) => {
            const item = monthRes.data[monthName];
            return {
              month: monthName,
              avgPrice: item.records ? item.totalPrice / item.records : 0,
              avgVolume: item.records ? item.totalVolume / item.records : 0
            };
          });
          setMonthlyData(formattedMonths);
        }

        // Parse yearly timeline (group by date to get average daily prices)
        if (yearRes.success && Array.isArray(yearRes.data)) {
          const dateGroups = {};
          yearRes.data.forEach(item => {
            if (!dateGroups[item.date]) dateGroups[item.date] = { count: 0, sum: 0 };
            dateGroups[item.date].count += 1;
            dateGroups[item.date].sum += item.price;
          });
          const timeline = Object.keys(dateGroups).map(dateStr => ({
            date: dateStr,
            formattedDate: new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            avgPrice: dateGroups[dateStr].sum / dateGroups[dateStr].count
          })).sort((a, b) => new Date(a.date) - new Date(b.date));
          
          setYearlyTimeline(timeline);
        }

        if (maxCapRes.success) setHighestCap(maxCapRes.data);
        if (maxVolRes.success) setHighestVol(maxVolRes.data);
      } catch (err) {
        console.error('Failed to load global statistics:', err);
        setError('Failed to fetch global market statistics.');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const formatCurrency = (val) => {
    if (val === null || val === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const formatLargeNum = (num) => {
    if (num === null || num === undefined) return 'N/A';
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '12px' }}>
        <Loader2 className="pulsing-glow" size={40} color="var(--primary)" />
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Calculating global indices...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
      
      {/* Title */}
      <div>
        <h1 className="page-title">Global Statistics</h1>
        <p className="page-subtitle">Historical aggregations and database insights.</p>
      </div>

      {error && (
        <div className="glass-panel" style={{ padding: '16px', borderColor: 'rgba(244, 63, 94, 0.3)', background: 'var(--danger-glow)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(95, 82, 255, 0.1)', border: '1px solid rgba(95, 82, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-hover)' }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="form-label" style={{ fontSize: '10px' }}>Global Market Cap</span>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)', marginTop: '4px' }}>
              {formatLargeNum(summary?.totalMarketCap)}
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--info)' }}>
            <BarChart3 size={20} />
          </div>
          <div>
            <span className="form-label" style={{ fontSize: '10px' }}>Total volume</span>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)', marginTop: '4px' }}>
              {formatLargeNum(summary?.totalVolume)}
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
            <Coins size={20} />
          </div>
          <div>
            <span className="form-label" style={{ fontSize: '10px' }}>Unique Assets</span>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)', marginTop: '4px' }}>
              {coinCount}
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)' }}>
            <Database size={20} />
          </div>
          <div>
            <span className="form-label" style={{ fontSize: '10px' }}>Database Logs</span>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)', marginTop: '4px' }}>
              {summary?.records}
            </div>
          </div>
        </div>

      </div>

      {/* Grid containing Monthly Analysis and Yearly average timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Monthly analysis Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="var(--primary-hover)" />
            <span>Monthly Asset Pricing Index</span>
          </h3>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="var(--text-muted)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `$${val.toLocaleString()}`} 
                />
                <Tooltip 
                  contentStyle={{ background: 'rgba(15, 17, 26, 0.95)', border: '1px solid var(--border-hover)', borderRadius: 'var(--radius-sm)' }}
                  formatter={(value) => [formatCurrency(value), 'Avg Price']}
                />
                <Bar dataKey="avgPrice" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Yearly Timeline */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--primary-hover)" />
            <span>Yearly Avg Price Trend</span>
          </h3>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="formattedDate" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="var(--text-muted)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `$${val.toLocaleString()}`} 
                />
                <Tooltip 
                  contentStyle={{ background: 'rgba(15, 17, 26, 0.95)', border: '1px solid var(--border-hover)', borderRadius: 'var(--radius-sm)' }}
                  formatter={(value) => [formatCurrency(value), 'Index Price']}
                />
                <Line type="monotone" dataKey="avgPrice" stroke="var(--info)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Historical Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        {highestCap && (
          <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--warning)' }}>
            <span className="form-label" style={{ fontSize: '10px' }}>Peak Valuation Record</span>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
              {highestCap.coin_name} ({highestCap.symbol})
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
              Market Cap hit <strong>{formatLargeNum(highestCap.market_cap)}</strong> on {highestCap.date}.
            </p>
          </div>
        )}

        {highestVol && (
          <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--info)' }}>
            <span className="form-label" style={{ fontSize: '10px' }}>Peak Liquidity Record</span>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
              {highestVol.coin_name} ({highestVol.symbol})
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
              Trading Volume hit <strong>{formatLargeNum(highestVol.volume)}</strong> on {highestVol.date}.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
