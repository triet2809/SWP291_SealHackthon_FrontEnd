import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Button, Badge, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { Trophy, Eye, Search, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRounds, getRoundRankings, recalculateRoundRankings } from '../../api/hackathonApi';

const statusVariant = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'advanced' || s === 'promoted') return 'success';
  if (s === 'eliminated' || s === 'rejected') return 'danger';
  return 'warning';
};

const RankingManagement = () => {
  const navigate = useNavigate();
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState('');
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recalculating, setRecalculating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    (async () => {
      try {
        const data = await getRounds({ size: 100 });
        const list = data.content || data || [];
        setRounds(list);
        if (list.length) setSelectedRound(list[0].id);
        else setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    })();
  }, []);

  const loadRankings = useCallback(async (roundId) => {
    if (!roundId) return;
    setLoading(true);
    setError('');
    try {
      const data = await getRoundRankings({ roundId });
      setRankings(data.content || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedRound) loadRankings(selectedRound);
  }, [selectedRound, loadRankings]);

  const filteredRankings = rankings
    .slice()
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
    .filter((team) => {
      const matchesSearch = (team.teamName || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' ? true : (team.status || '').toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });

  const handleRecalculate = async () => {
    if (!selectedRound) return;
    setRecalculating(true);
    setError('');
    try {
      await recalculateRoundRankings(selectedRound);
      await loadRankings(selectedRound);
    } catch (err) {
      setError(err.message);
    } finally {
      setRecalculating(false);
    }
  };

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Ranking Management</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Review leaderboards and manage team advancement</div>
        </div>
        <Button variant="success" className="d-flex align-items-center gap-2" onClick={handleRecalculate} disabled={recalculating || !selectedRound}>
          {recalculating ? <Spinner size="sm" animation="border" /> : <RefreshCw size={18} />} Recalculate Rankings
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="p-3 border-bottom d-flex justify-content-between gap-2 flex-wrap">
          <InputGroup style={{ maxWidth: '300px' }}>
            <InputGroup.Text>
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control placeholder="Search team..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </InputGroup>
          <div className="d-flex gap-2">
            <Form.Select style={{ width: '220px' }} value={selectedRound} onChange={(e) => setSelectedRound(e.target.value)}>
              {rounds.length === 0 && <option value="">No rounds available</option>}
              {rounds.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </Form.Select>
            <Form.Select
              style={{ width: '180px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="promoted">Promoted</option>
              <option value="pending">Pending</option>
              <option value="eliminated">Eliminated</option>
            </Form.Select>
          </div>
        </div>

        <div className="table-responsive">
          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" /></div>
          ) : (
            <Table className="mb-0" hover>
              <thead>
                <tr>
                  <th className="border-top-0 border-bottom">Rank</th>
                  <th className="border-top-0 border-bottom">Team Name</th>
                  <th className="border-top-0 border-bottom">Final Score</th>
                  <th className="border-top-0 border-bottom">Advancement Status</th>
                  <th className="border-top-0 border-bottom text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRankings.length === 0 && (
                  <tr><td colSpan={5} className="text-center text-muted py-4">No rankings. Recalculate to generate.</td></tr>
                )}
                {filteredRankings.map((team) => (
                  <tr key={team.id || team.teamId}>
                    <td className="fw-bold py-3" style={{ color: team.rank <= 3 ? 'var(--cf-status-warning)' : 'var(--cf-text-secondary)' }}>
                      #{team.rank}
                    </td>
                    <td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{team.teamName}</td>
                    <td className="py-3 fw-bold" style={{ color: 'var(--cf-text-primary)' }}>{Number(team.totalScore ?? 0).toFixed(1)}</td>
                    <td className="py-3">
                      <Badge bg={statusVariant(team.status)} text={statusVariant(team.status) === 'warning' ? 'dark' : 'light'}>
                        {team.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-end">
                      <Button variant="link" size="sm" className="p-0 text-primary" onClick={() => navigate(`/coordinator/ranking/${team.teamId}?roundId=${selectedRound}`)}>
                        <Eye size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RankingManagement;
