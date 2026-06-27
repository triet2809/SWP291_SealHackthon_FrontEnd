import React, { useState } from 'react';
import { Card, Table, Button, Badge, Modal, Form, InputGroup } from 'react-bootstrap';
import { Trophy, AlertTriangle, Eye, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RankingManagement = () => {
  const navigate = useNavigate();
  const [rankings, setRankings] = useState([
    { id: 'team1', team: 'DataCraft', category: 'Data Science', scores: { innovation: 95, technical: 90, design: 88, presentation: 91 }, status: 'Advanced' },
    { id: 'team2', team: 'QuantumLeap', category: 'AI/ML', scores: { innovation: 89, technical: 88, design: 80, presentation: 79 }, status: 'Advanced' },
    { id: 'team3', team: 'Neural Nexus', category: 'AI/ML', scores: { innovation: 84, technical: 92, design: 81, presentation: 79 }, status: 'Pending Review' },
    { id: 'team4', team: 'AlgoArts', category: 'AI/ML', scores: { innovation: 78, technical: 75, design: 80, presentation: 71 }, status: 'Eliminated' },
  ]);

  // Calculate totals, sort with tie-breaker, and assign ranks
  const sortedRankings = rankings
    .map(t => {
      const totalScore = Object.values(t.scores).reduce((sum, val) => sum + val, 0);
      return { ...t, totalScore };
    })
    .sort((a, b) => {
      if (b.totalScore === a.totalScore) {
        return b.scores.innovation - a.scores.innovation; // Tie-breaker: Innovation
      }
      return b.totalScore - a.totalScore;
    })
    .map((t, index) => ({ ...t, rank: index + 1 }));

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredRankings = sortedRankings.filter((team) => {
    const matchesSearch =
      team.team.toLowerCase().includes(
        searchTerm.toLowerCase()
      );

    const matchesStatus =
      statusFilter === 'All'
        ? true
        : team.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  const handlePublish = () => {
    alert('Rankings Published Successfully');
  };
  const handleFlagTeam = (rank) => {
    setRankings(
      rankings.map((team) =>
        team.rank === rank
          ? {
            ...team,
            status: 'Pending Review'
          }
          : team
      )
    );
  };
  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Ranking Management</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Review leaderboards and manage team advancement</div>
        </div>
        <Button variant="success" className="d-flex align-items-center gap-2" onClick={handlePublish}>
          <Trophy size={18} /> Publish Rankings
        </Button>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="p-3 border-bottom d-flex justify-content-between">
          <InputGroup style={{ maxWidth: '300px' }}>
            <InputGroup.Text>
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control placeholder="Search team..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </InputGroup>
          <Form.Select
            style={{ width: '200px' }}
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }>
            <option value="All">
              All Statuses
            </option>
            <option value="Advanced">
              Advanced
            </option>
            <option value="Pending Review">
              Pending Review
            </option>
            <option value="Eliminated">
              Eliminated
            </option>
          </Form.Select>
        </div>

        <div className="table-responsive">
          <Table className="mb-0" hover>
            <thead>
              <tr>
                <th className="border-top-0 border-bottom">Rank</th>
                <th className="border-top-0 border-bottom">Team Name</th>
                <th className="border-top-0 border-bottom">Category</th>
                <th className="border-top-0 border-bottom">Final Score</th>
                <th className="border-top-0 border-bottom">Advancement Status</th>
                <th className="border-top-0 border-bottom text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRankings.map((team) => (
                <tr key={team.rank}>
                  <td className="fw-bold py-3" style={{ color: team.rank <= 3 ? 'var(--cf-status-warning)' : 'var(--cf-text-secondary)' }}>
                    #{team.rank}
                  </td>
                  <td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{team.team}</td>
                  <td className="py-3">{team.category}</td>
                  <td className="py-3 fw-bold" style={{ color: 'var(--cf-text-primary)' }}>{(team.totalScore / 4).toFixed(1)}</td>
                  <td className="py-3">
                    <Badge bg={
                      team.status === 'Advanced' ? 'success' :
                        team.status === 'Eliminated' ? 'danger' : 'warning'
                    } text={team.status === 'Pending Review' ? 'dark' : 'light'}>
                      {team.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-end">
                    <Button variant="link" size="sm" className="p-0 text-primary me-3" onClick={() => navigate(`/coordinator/ranking/${team.id}`)}>
                      <Eye size={16} />
                    </Button>
                    <Button variant="link" size="sm" className="p-0 text-danger" onClick={() => handleFlagTeam(team.rank)}>
                      <AlertTriangle size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default RankingManagement;
