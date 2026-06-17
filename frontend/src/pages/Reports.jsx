import React, { useState, useEffect } from 'react';
import coinService from '../services/coinService';
import { AlertOctagon, MessageSquare, Send, FileText, CheckCircle, Search, Filter, Loader2, RefreshCw, Trash2, Calendar } from 'lucide-react';

export default function Reports() {
  // Form states
  const [selectedCoin, setSelectedCoin] = useState('');
  const [reportType, setReportType] = useState('scam');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');

  // UI state
  const [coinsList, setCoinsList] = useState([]);
  const [loadingCoins, setLoadingCoins] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Report database states
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadReports = () => {
    const local = localStorage.getItem('cryptosphere_reports');
    if (!local) {
      const defaultReports = [
        {
          report_id: 'REP-742918',
          coin_id: 'bitcoin',
          classification: 'inaccurate_price',
          reporter_email: 'sec_officer@kraken.com',
          evidence_url: 'https://etherscan.io',
          description: 'Price feed anomaly showing $1.2M peak for 3 minutes due to liquidity oracle mismatch.',
          date: 'Jun 15, 2026',
          status: 'resolved'
        },
        {
          report_id: 'REP-910481',
          coin_id: 'ethereum',
          classification: 'security_exploit',
          reporter_email: 'audit@openzeppelin.com',
          evidence_url: 'https://github.com/ethereum',
          description: 'Gas cost overflow vulnerability detected in client validation layers on localized nodes.',
          date: 'Jun 12, 2026',
          status: 'under_investigation'
        },
        {
          report_id: 'REP-389104',
          coin_id: 'tether',
          classification: 'scam',
          reporter_email: 'research@messen.com',
          evidence_url: '',
          description: 'Suspicious duplicate smart contract mimicking Tether address circulating on mainnet.',
          date: 'Jun 10, 2026',
          status: 'pending'
        }
      ];
      localStorage.setItem('cryptosphere_reports', JSON.stringify(defaultReports));
      setReports(defaultReports);
    } else {
      setReports(JSON.parse(local));
    }
  };

  useEffect(() => {
    async function fetchCoins() {
      try {
        const res = await coinService.getLatest();
        if (res.success && Array.isArray(res.data)) {
          setCoinsList(res.data);
        }
      } catch (err) {
        console.error('Failed to load coins directory for report selection:', err);
      } finally {
        setLoadingCoins(false);
      }
    }
    fetchCoins();
    loadReports();

    const handleUpdate = () => {
      loadReports();
    };
    window.addEventListener('reportsUpdated', handleUpdate);
    return () => {
      window.removeEventListener('reportsUpdated', handleUpdate);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const payload = {
        coin_id: selectedCoin,
        classification: reportType,
        reporter_email: reporterEmail,
        evidence_url: evidenceUrl,
        description: description,
      };

      const res = await coinService.submitReport(payload);
      
      if (res.success) {
        setSuccessMsg(res.message || 'Thank you! The intelligence report has been recorded and submitted for audit review.');
        
        // Save to local storage for local persistence in Commit 3
        const localReports = JSON.parse(localStorage.getItem('cryptosphere_reports') || '[]');
        const newReportRecord = {
          report_id: `REP-${Math.floor(100000 + Math.random() * 900000)}`,
          coin_id: selectedCoin,
          classification: reportType,
          reporter_email: reporterEmail,
          evidence_url: evidenceUrl,
          description: description,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          status: 'pending'
        };
        localStorage.setItem('cryptosphere_reports', JSON.stringify([newReportRecord, ...localReports]));

        // Trigger an update event or state so list refreshes
        window.dispatchEvent(new Event('reportsUpdated'));

        // Reset inputs
        setSelectedCoin('');
        setReportType('scam');
        setDescription('');
        setEvidenceUrl('');
        setReporterEmail('');
      } else {
        setErrorMsg(res.message || 'Submission rejected by the server verification node.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Error occurred while sending the verification report payload.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReports = reports.filter(r => {
    const coinMatch = r.coin_id && r.coin_id.toLowerCase().includes(searchQuery.toLowerCase());
    const idMatch = r.report_id && r.report_id.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = r.reporter_email && r.reporter_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = searchQuery === '' || coinMatch || idMatch || emailMatch;
    
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDeleteReport = (reportId) => {
    if (!window.confirm(`Are you sure you want to dismiss report ${reportId}?`)) return;
    const updated = reports.filter(r => r.report_id !== reportId);
    localStorage.setItem('cryptosphere_reports', JSON.stringify(updated));
    setReports(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
      {/* Page Header */}
      <div>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertOctagon size={28} color="var(--danger)" />
          <span>Coin Reports & Scam Center</span>
        </h1>
        <p className="page-subtitle">Submit security alerts, flag suspected rug pulls, or report coin parameter inaccuracies directly to verification systems.</p>
      </div>

      {errorMsg && (
        <div className="glass-panel" style={{ padding: '16px', borderColor: 'rgba(244, 63, 94, 0.3)', background: 'var(--danger-glow)', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertOctagon size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="glass-panel" style={{ padding: '16px', borderColor: 'rgba(16, 185, 129, 0.3)', background: 'var(--success-glow)', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Side: Report Submission Form */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="var(--primary-hover)" />
            <span>Submit Intelligence Report</span>
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Coin Selector */}
            <div>
              <label className="form-label" style={{ fontSize: '11px', display: 'block', marginBottom: '6px' }}>Target Asset</label>
              {loadingCoins ? (
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Loading catalog...</div>
              ) : (
                <select
                  className="form-input"
                  value={selectedCoin}
                  onChange={(e) => setSelectedCoin(e.target.value)}
                  required
                  style={{ width: '100%', background: 'var(--bg-dark)' }}
                >
                  <option value="">-- Choose target coin --</option>
                  {coinsList.map((c) => (
                    <option key={c.coin_id} value={c.coin_id}>
                      {c.coin_name} ({c.symbol.toUpperCase()})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Incident Classification */}
            <div>
              <label className="form-label" style={{ fontSize: '11px', display: 'block', marginBottom: '6px' }}>Classification</label>
              <select
                className="form-input"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-dark)' }}
              >
                <option value="scam">Project Scam / Rugpull Suspicion</option>
                <option value="inaccurate_price">Pricing / Market Data Inaccuracy</option>
                <option value="missing_history">Missing Historical Metrics</option>
                <option value="security_exploit">Smart Contract Security Risk</option>
                <option value="other">Other Incident Type</option>
              </select>
            </div>

            {/* Reporter Email */}
            <div>
              <label className="form-label" style={{ fontSize: '11px', display: 'block', marginBottom: '6px' }}>Reporter Email Address (for verification)</label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. analyst@domain.com"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                required
              />
            </div>

            {/* Evidence Link */}
            <div>
              <label className="form-label" style={{ fontSize: '11px', display: 'block', marginBottom: '6px' }}>On-Chain Evidence URL (Optional)</label>
              <input
                type="url"
                className="form-input"
                placeholder="e.g. explorer hash or report link"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
              />
            </div>

            {/* Detailed Description */}
            <div>
              <label className="form-label" style={{ fontSize: '11px', display: 'block', marginBottom: '6px' }}>Incident Description</label>
              <textarea
                className="form-input"
                rows="4"
                placeholder="Describe the scam indicators, incorrect pricing metrics, or smart contract bugs observed..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={submitting}>
              {submitting ? <Loader2 className="spinning" size={16} /> : <Send size={16} />}
              <span>{submitting ? 'Submitting Report...' : 'Submit Incident Report'}</span>
            </button>
          </form>
        </div>

        {/* Right Side: Informative Card & Reports Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Verification standards card */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} color="var(--primary-hover)" />
              <span>Verification Standards</span>
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              CryptoSphere maintains a high-quality historical database. To prevent catalog manipulation, reports are cross-referenced with on-chain oracle APIs. 
            </p>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ color: 'var(--danger)' }}>⚠️</span>
                <span>Submitting spam reports will lead to reporter IP/account rate limits.</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ color: 'var(--success)' }}>🛡️</span>
                <span>Verified security vulnerabilities are eligible for our Bug Bounty program.</span>
              </div>
            </div>
          </div>

          {/* Reports Database Log */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="var(--primary-hover)" />
                <span>Submitted Reports Database</span>
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Browse active reports submitted by intelligence networks.
              </p>
            </div>

            {/* Filter Bar */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '32px', width: '100%', fontSize: '12px' }}
                  placeholder="Search target, report ID, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="form-input"
                style={{ width: '120px', fontSize: '12px', background: 'var(--bg-dark)' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Statuses</option>
                <option value="pending">Pending</option>
                <option value="under_investigation">Investigation</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            {/* Reports List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }} className="custom-scroll">
              {filteredReports.length === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                  No reports matching the filters found.
                </div>
              ) : (
                filteredReports.map((report) => {
                  // Badges configurations
                  const getStatusStyle = (status) => {
                    switch (status) {
                      case 'resolved':
                        return { background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.2)' };
                      case 'under_investigation':
                        return { background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', border: '1px solid rgba(245, 158, 11, 0.2)' };
                      default:
                        return { background: 'rgba(244, 63, 94, 0.1)', color: 'var(--danger)', border: '1px solid rgba(244, 63, 94, 0.2)' };
                    }
                  };

                  const getClassificationLabel = (c) => {
                    switch (c) {
                      case 'scam': return 'Project Scam';
                      case 'inaccurate_price': return 'Pricing Error';
                      case 'missing_history': return 'Missing History';
                      case 'security_exploit': return 'Security Exploit';
                      default: return 'Other Report';
                    }
                  };

                  return (
                    <div
                      key={report.report_id}
                      className="glass-panel"
                      style={{
                        padding: '16px',
                        background: 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}
                    >
                      {/* Card Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{report.report_id}</span>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff', textTransform: 'capitalize' }}>
                            {report.coin_id}
                          </span>
                        </div>
                        <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', ...getStatusStyle(report.status) }}>
                          {report.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>

                      {/* Classification & Date */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--primary-hover)', fontWeight: 600 }}>{getClassificationLabel(report.classification)}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={11} />
                          <span>{report.date}</span>
                        </span>
                      </div>

                      {/* Description */}
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
                        {report.description}
                      </p>

                      {/* Footer Info / Actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                          By: {report.reporter_email}
                        </span>
                        
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {report.evidence_url && (
                            <a
                              href={report.evidence_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ fontSize: '10px', color: 'var(--info)', textDecoration: 'none' }}
                            >
                              Evidence
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteReport(report.report_id)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                            title="Dismiss Report"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
