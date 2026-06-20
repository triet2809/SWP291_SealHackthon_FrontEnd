import React, { useState } from 'react';
import { Card, Table, Button, Badge, Modal, Form, InputGroup } from 'react-bootstrap';
import { Trophy, AlertTriangle, Eye, Search } from 'lucide-react';

const RankingManagement = () => {
  const [rankings, setRankings] = useState([
    { rank: 1, team: 'DataCraft', category: 'Data Science', score: 91, status: 'Advanced' },
    { rank: 2, team: 'QuantumLeap', category: 'AI/ML', score: 84, status: 'Advanced' },
    { rank: 3, team: 'Neural Nexus', category: 'AI/ML', score: 82, status: 'Pending Review' },
    { rank: 4, team: 'AlgoArts', category: 'AI/ML', score: 76, status: 'Eliminated' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const filteredRankings = rankings.filter((team) => {
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
                    <Button variant="link" size="sm" className="p-0 text-primary me-3" onClick={() => { setSelectedTeam(team); setShowModal(true); }}>
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
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Team Ranking Details
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedTeam && (
            <>
              <p>
                <strong>Rank:</strong>
                {' '}#{selectedTeam.rank}
              </p>

              <p>
                <strong>Team:</strong>
                {' '}{selectedTeam.team}
              </p>

              <p>
                <strong>Category:</strong>
                {' '}{selectedTeam.category}
              </p>

              <p>
                <strong>Score:</strong>
                {' '}{selectedTeam.score}
              </p>

              <p>
                <strong>Status:</strong>
                {' '}{selectedTeam.status}
              </p>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RankingManagement;
