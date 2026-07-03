import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Card, Form, InputGroup, Spinner, Table } from 'react-bootstrap';
import { BarChart2, Search } from 'lucide-react';
import { getJudgeVariance, getRounds } from '../../api/hackathonApi';

const pageItems = (data) => data?.content || data || [];

const ScoringAnalytics = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rounds, setRounds] = useState([]);
  const [selectedRoundId, setSelectedRoundId] = useState('');
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { (async () => {
    setLoading(true); setError('');
    try { const roundList = pageItems(await getRounds({ size: 500 })); setRounds(roundList); setSelectedRoundId((prev) => prev || roundList[0]?.id || ''); }
    catch (e) { setError(e.message || 'Cannot load rounds'); }
    finally { setLoading(false); }
  })(); }, []);

  useEffect(() => { if (!selectedRoundId) return; (async () => {
    setLoading(true); setError('');
    try { setAnalyticsData(await getJudgeVariance(selectedRoundId)); }
    catch (e) { setError(e.message || 'Cannot load scoring analytics'); }
    finally { setLoading(false); }
  })(); }, [selectedRoundId]);

  const filteredData = useMemo(() => analyticsData.filter((item) => `${item.teamName || ''} ${item.criterionName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())), [analyticsData, searchTerm]);
  const highVarianceCount = analyticsData.filter((i) => Number(i.variance || 0) > 10).length;

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4"><div><h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Scoring Analytics</h1><div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Review team performance, average scores, and judge variances</div></div><div className="d-flex gap-2"><Badge bg="warning" text="dark" className="px-3 py-2 d-flex align-items-center gap-2"><BarChart2 size={16} /> {highVarianceCount} High Variance</Badge></div></div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><div className="p-3 border-bottom d-flex flex-wrap gap-3 justify-content-between"><InputGroup style={{ maxWidth: '300px' }}><InputGroup.Text className="bg-transparent border-end-0"><Search size={16} /></InputGroup.Text><Form.Control className="border-start-0" placeholder="Search team or criterion..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></InputGroup><Form.Select style={{ width: '360px' }} value={selectedRoundId} onChange={(e) => setSelectedRoundId(e.target.value)}><option value="">Select round</option>{rounds.map((round) => <option key={round.id} value={round.id}>{round.name}</option>)}</Form.Select></div><div className="table-responsive"><Table className="mb-0 text-center align-middle" hover><thead className="text-start"><tr><th className="text-start py-3">Team Name</th><th className="text-start py-3">Criterion</th><th className="py-3">Judge Count</th><th className="py-3">Scores</th><th className="py-3">Mean</th><th className="py-3">Stddev</th><th className="py-3">Variance</th><th className="text-end py-3">Status</th></tr></thead><tbody className="text-start">{loading ? <tr><td colSpan="8" className="text-center py-4"><Spinner size="sm" className="me-2" />Loading...</td></tr> : filteredData.length === 0 ? <tr><td colSpan="8" className="text-center py-4 text-muted">No score variance data yet</td></tr> : filteredData.map((item) => <tr key={`${item.teamId}-${item.criterionId}`}><td className="fw-bold" style={{ color: 'var(--cf-text-primary)' }}>{item.teamName}</td><td><Badge bg="secondary">{item.criterionName}</Badge></td><td className="text-center">{item.judgeCount}</td><td className="text-center">{(item.scores || []).join(', ')}</td><td className="text-center fw-bold text-primary">{Number(item.meanScore || 0).toFixed(1)}</td><td className="text-center">{Number(item.stddev || 0).toFixed(2)}</td><td className="text-center"><Badge bg={Number(item.variance || 0) > 10 ? 'danger' : 'success'} className="px-2 py-1">{Number(item.variance || 0).toFixed(2)}</Badge></td><td className="text-end"><Badge bg={Number(item.variance || 0) > 10 ? 'warning' : 'success'} text={Number(item.variance || 0) > 10 ? 'dark' : 'light'}>{Number(item.variance || 0) > 10 ? 'High Variance' : 'Reviewed'}</Badge></td></tr>)}</tbody></Table></div></Card>
    </div>
  );
};

export default ScoringAnalytics;
