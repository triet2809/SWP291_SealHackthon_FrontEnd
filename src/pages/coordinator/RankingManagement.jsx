import React from 'react';
import { Card, Table, Button, Badge } from 'react-bootstrap';
import { Trophy, AlertTriangle, Eye } from 'lucide-react';

const RankingManagement = () => {
  const rankings = [
    { rank: 1, team: 'DataCraft', category: 'Data Science', score: 91, status: 'Advanced' },
    { rank: 2, team: 'QuantumLeap', category: 'AI/ML', score: 84, status: 'Advanced' },
    { rank: 3, team: 'Neural Nexus', category: 'AI/ML', score: 82, status: 'Pending Review' },
    { rank: 4, team: 'AlgoArts', category: 'AI/ML', score: 76, status: 'Eliminated' },
  ];

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Ranking Management</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Review leaderboards and manage team advancement</div>
        </div>
        <Button variant="success" className="d-flex align-items-center gap-2">
          <Trophy size={18} /> Publish Rankings
        </Button>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
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
              {rankings.map((team) => (
                <tr key={team.rank}>
                  <td className="fw-bold py-3" style={{ color: team.rank <= 3 ? 'var(--cf-status-warning)' : 'var(--cf-text-secondary)' }}>
                    #{team.rank}
                  </td>
                  <td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{team.team}</td>
                  <td className="py-3">{team.category}</td>
                  <td className="py-3 fw-bold" style={{ color: 'var(--cf-text-primary)' }}>{team.score}</td>
                  <td className="py-3">
                    <Badge bg={
                      team.status === 'Advanced' ? 'success' :
                      team.status === 'Eliminated' ? 'danger' : 'warning'
                    } text={team.status === 'Pending Review' ? 'dark' : 'light'}>
                      {team.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-end">
                    <Button variant="link" size="sm" className="p-0 text-primary me-3">
                      <Eye size={16} />
                    </Button>
                    <Button variant="link" size="sm" className="p-0 text-danger">
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
