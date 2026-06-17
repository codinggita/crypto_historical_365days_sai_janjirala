import React, { useState } from 'react';
import { BookOpen, HelpCircle, TrendingUp, LineChart, Percent, Cpu, Search, ChevronDown, ChevronUp } from 'lucide-react';

const faqItems = [
  {
    category: 'financial',
    title: 'What is 7-Day Volatility index?',
    icon: Percent,
    answer: 'Volatility is a statistical measure of the dispersion of returns for a given security. The 7-Day Volatility index measures the standard deviation of daily percentage price variations over the trailing 7 days, indicating relative pricing risks.'
  },
  {
    category: 'financial',
    title: 'How are Cumulative Returns calculated?',
    icon: Percent,
    answer: 'Cumulative return measures the aggregate gain or loss of an asset price over a designated period. In our dashboards, it shows the percentage pricing shift starting from historical baseline coordinates.'
  },
  {
    category: 'technical',
    title: 'What do MA7 and MA30 represent?',
    icon: LineChart,
    answer: 'Moving Averages (MAs) smooth price data to identify trend directions. MA7 calculates the arithmetic mean price of the previous 7 days (short-term momentum), while MA30 calculates the previous 30 days (mid-term support/resistance levels).'
  },
  {
    category: 'technical',
    title: 'How is daily market momentum analyzed?',
    icon: TrendingUp,
    answer: 'Daily momentum is assessed using price direction shifts combined with trading volumes. High gains backed by surge volumes suggest strong buying momentum, whereas low volumes signal unstable momentum.'
  },
  {
    category: 'system',
    title: 'What is a Monte Carlo Price Prediction?',
    icon: Cpu,
    answer: 'Monte Carlo simulations are mathematical algorithms used to model probability distributions of asset prices. By generating thousands of random price paths configured with drift (historical trends) and variance (volatility), it projects standard pricing outcomes.'
  },
  {
    category: 'system',
    title: 'How does the Portfolio Simulator solve weight allocations?',
    icon: Cpu,
    answer: 'The Portfolio Simulator uses linear asset weighting math. By assigning relative percentage weights to selected coins, it aggregates historical price change lines to calculate total portfolio growth metrics and simulated growths.'
  }
];

export default function Education() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all'); // 'all', 'financial', 'technical', 'system'
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Filter list by category first
  const filteredItems = faqItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
      {/* Page Header */}
      <div>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookOpen className="pulsing-glow" size={28} color="var(--primary)" />
          <span>Interactive FAQ & Crypto Education</span>
        </h1>
        <p className="page-subtitle">Learn about market metrics, technical moving averages, portfolio simulation algebra, and Monte Carlo predictive walks.</p>
      </div>

      {/* Categories & Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        {/* Category selectors */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          {[
            { id: 'all', label: 'All Knowledge' },
            { id: 'financial', label: 'Financial Metrics' },
            { id: 'technical', label: 'Technical Indicators' },
            { id: 'system', label: 'System Algorithms' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setOpenIndex(null);
              }}
              type="button"
              style={{
                background: activeCategory === cat.id ? 'var(--primary)' : 'none',
                border: 'none',
                color: activeCategory === cat.id ? '#fff' : 'var(--text-secondary)',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '32px', paddingRight: searchQuery ? '32px' : '10px', width: '100%', fontSize: '12px' }}
            placeholder="Search definitions..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setOpenIndex(null);
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setOpenIndex(null);
              }}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '11px',
                padding: '2px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Collapsible FAQ Panels List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredItems.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-secondary)' }} className="glass-panel">
            No matching educational definitions found. Try search query adjustment.
          </div>
        ) : (
          filteredItems.map((item, index) => {
            const isOpen = openIndex === index;
            const Icon = item.icon;
            
            return (
              <div 
                key={index} 
                className="glass-panel" 
                style={{ 
                  padding: '16px 20px', 
                  borderColor: isOpen ? 'var(--primary)' : 'var(--border-color)', 
                  background: isOpen ? 'rgba(95, 82, 255, 0.02)' : 'none',
                  transition: 'all 0.25s ease-in-out'
                }}
              >
                {/* Accordion trigger header */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: 0,
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', color: 'var(--primary-hover)' }}>
                      <Icon size={16} />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: isOpen ? '#fff' : 'var(--text-secondary)' }}>
                      {item.title}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {/* Collapsible answer content */}
                {isOpen && (
                  <div 
                    style={{ 
                      marginTop: '14px', 
                      fontSize: '13px', 
                      color: 'var(--text-secondary)', 
                      lineHeight: '1.6', 
                      paddingLeft: '44px',
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '12px',
                      animation: 'fadeIn 0.25s ease-in-out'
                    }}
                  >
                    <p style={{ margin: 0 }}>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
