import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Form, InputGroup, Spinner, Table } from 'react-bootstrap';
import { AlertTriangle, Eye, RefreshCw, Search, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRoundRankings, getRounds, recalculateRoundRankings } from '../../api/hackathonApi';

const pageItems = (data) => data?.content || data || [];
const statusLabel = (status) => ({ promoted: 'Advanced', eliminated: 'Eliminated', pending: 'Pending Review' }[status] || status || 'Pending Review');
const statusVariant = (status) => status === 'promoted' ? 'success' : status === 'eliminated' ? 'danger' : 'warning';

const RankingManagement = () => {
  const navigate = useNavigate();
  const [rounds, setRounds] = useState([]);
  const [selectedRoundId, setSelectedRoundId] = useState('');
  const [rankings, setRankings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadRounds = async () => {
    const data = await getRounds({ size: 500 });
    const list = pageItems(data);
    setRounds(list);
    setSelectedRoundId((prev) => prev || list[0]?.id || '');
  };
  const loadRankings = async (roundId = selectedRoundId) => {
    if (!roundId) { setRankings([]); return; }
    const data = await getRoundRankings({ roundId, size: 500 });
    setRankings(pageItems(data));
  };

  useEffect(() => { (async () => { setLoading(true); setError(''); try { await loadRounds(); } catch (e) { setError(e.message || 'Cannot load rounds'); } finally { setLoading(false); } })(); }, []);
  useEffect(() => { if (selectedRoundId) { setLoading(true); loadRankings(selectedRoundId).catch((e) => setError(e.message || 'Cannot load rankings')).finally(() => setLoading(false)); } }, [selectedRoundId]);

  const filteredRankings = useMemo(() => rankings.filter((team) => {
    const matchesSearch = (team.teamName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const label = statusLabel(team.status);
    const matchesStatus = statusFilter === 'All' || label === statusFilter;
    return matchesSearch && matchesStatus;
  }), [rankings, searchTerm, statusFilter]);

  const handleRecalculate = async (applyPromotion = false) => {
    if (!selectedRoundId) { setError('Select round first'); return; }
    setSaving(true); setError('');
    try { const data = await recalculateRoundRankings(selectedRoundId, { applyPromotion }); setRankings(data || []); }
    catch (e) { setError(e.message || 'Recalculate rankings failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4"><div><h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Ranking Management</h1><div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Review backend leaderboards and manage team advancement</div></div><div className="d-flex gap-2"><Button variant="outline-primary" className="d-flex align-items-center gap-2" disabled={saving || !selectedRoundId} onClick={() => handleRecalculate(false)}><RefreshCw size={18} /> Recalculate</Button><Button variant="success" className="d-flex align-items-center gap-2" disabled={saving || !selectedRoundId} onClick={() => handleRecalculate(true)}><Trophy size={18} /> Apply Promotion</Button></div></div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="p-3 border-bottom d-flex flex-wrap gap-3 justify-content-between"><InputGroup style={{ maxWidth: '300px' }}><InputGroup.Text><Search size={16} /></InputGroup.Text><Form.Control placeholder="Search team..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></InputGroup><div className="d-flex gap-2"><Form.Select style={{ width: '320px' }} value={selectedRoundId} onChange={(e) => setSelectedRoundId(e.target.value)}><option value="">Select round</option>{rounds.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</Form.Select><Form.Select style={{ width: '200px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="All">All Statuses</option><option value="Advanced">Advanced</option><option value="Pending Review">Pending Review</option><option value="Eliminated">Eliminated</option></Form.Select></div></div>
        <div className="table-responsive"><Table className="mb-0" hover><thead><tr><th>Rank</th><th>Team Name</th><th>Round</th><th>Final Score</th><th>Advancement Status</th><th>Tie Breaker</th><th className="text-end">Actions</th></tr></thead><tbody>{loading ? <tr><td colSpan="7" className="text-center py-4"><Spinner size="sm" className="me-2" />Loading...</td></tr> : filteredRankings.length === 0 ? <tr><td colSpan="7" className="text-center py-4 text-muted">No rankings yet. Click Recalculate after scoring.</td></tr> : filteredRankings.map((team) => <tr key={team.id}><td className="fw-bold py-3" style={{ color: team.rank <= 3 ? 'var(--cf-status-warning)' : 'var(--cf-text-secondary)' }}>#{team.rank}</td><td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{team.teamName}</td><td className="py-3">{rounds.find((r) => r.id === team.roundId)?.name || team.roundId}</td><td className="py-3 fw-bold" style={{ color: 'var(--cf-text-primary)' }}>{Number(team.totalScore || 0).toFixed(2)}</td><td className="py-3"><Badge bg={statusVariant(team.status)} text={team.status === 'pending' ? 'dark' : 'light'}>{statusLabel(team.status)}</Badge></td><td className="py-3 small text-muted">{team.tieBreakerReason || '-'}</td><td className="py-3 text-end"><Button variant="link" size="sm" className="p-0 text-primary me-3" onClick={() => navigate(`/coordinator/ranking/${team.id}`, { state: { ranking: team, roundName: rounds.find((r) => r.id === team.roundId)?.name } })}><Eye size={16} /></Button><AlertTriangle size={16} className="text-muted" title="Manual flag endpoint not available" /></td></tr>)}</tbody></Table></div>
      </Card>
    </div>
  );
};

export default RankingManagement;
