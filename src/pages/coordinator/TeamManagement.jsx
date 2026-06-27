import React, { useState } from 'react';
import { Card, Table, Button, Badge, Form, InputGroup, Modal } from 'react-bootstrap';
import { Search, Eye, Ban, Plus, Shuffle } from 'lucide-react';
import { mentorAssignedTeams } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

const TeamManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  
  // Add 'track' property to mock data if it doesn't exist
  const [teams, setTeams] = useState(mentorAssignedTeams.map(t => ({...t, track: t.track || 'Unassigned'})));

  // Removed track generation logic
  const handleDisqualifyTeam = (id) => {
    if (window.confirm('Disqualify this team?')) {
      setTeams(
        teams.map((team) =>
          team.id === id
            ? {
              ...team,
              status: 'Disqualified'
            }
            : team
        )
      );
    }
  };

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.project.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'All Categories' ||
      team.category === categoryFilter;

    const matchesStatus =
      statusFilter === 'All Statuses' ||
      team.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Team Management</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>View and manage registered teams</div>
        </div>
        <div className="d-flex gap-2">
          <Button 
            variant="primary" 
            className="d-flex align-items-center gap-2"
            onClick={() => navigate('/coordinator/teams/record')}
          >
            <Plus size={18} /> Add New Team
          </Button>
        </div>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <InputGroup style={{ maxWidth: '300px' }}>
            <InputGroup.Text className="bg-transparent border-end-0">
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control className="border-start-0" placeholder="Search teams..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </InputGroup>
          <div className="d-flex gap-2">
            <Form.Select style={{ width: '150px' }} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option>All Categories</option>
              <option>AI/ML</option>
              <option>Web Dev</option>
            </Form.Select>
            <Form.Select style={{ width: '150px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option>All Statuses</option>
              <option>On Track</option>
              <option>Needs Attention</option>
              <option>At Risk</option>
              <option>Disqualified</option>
            </Form.Select>
          </div>
        </div>
        <div className="table-responsive">
          <Table className="mb-0" hover>
            <thead>
              <tr>
                <th className="border-top-0 border-bottom">Team Name</th>
                <th className="border-top-0 border-bottom">Project</th>
                <th className="border-top-0 border-bottom">Category</th>
                <th className="border-top-0 border-bottom">Track / Group</th>
                <th className="border-top-0 border-bottom">Members</th>
                <th className="border-top-0 border-bottom">Status</th>
                <th className="border-top-0 border-bottom text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((team) => (
                <tr key={team.id}>
                  <td className="fw-medium py-3">
                    <div className="d-flex align-items-center gap-2">
                      <div className="d-flex align-items-center justify-content-center bg-primary text-white rounded-circle" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
                        {team.initials}
                      </div>
                      <span style={{ color: 'var(--cf-text-primary)' }}>{team.name}</span>
                    </div>
                  </td>
                  <td className="py-3">{team.project}</td>
                  <td><Badge bg="secondary">{team.category}</Badge></td>
                  <td><Badge bg="info" text="dark">{team.track}</Badge></td>
                  <td>{team.members}/4</td>
                  <td>
                    <Badge bg={
                      team.status === 'On Track' ? 'success' :
                      team.status === 'Needs Attention' ? 'warning' :
                      team.status === 'Disqualified' ? 'danger' : 'danger'
                    }>
                      {team.status}
                    </Badge>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <Button variant="outline-primary" size="sm" onClick={() => navigate(`/coordinator/teams/${team.id}`)}>
                        <Eye size={14} />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDisqualifyTeam(team.id)}>
                        <Ban size={14} />
                      </Button>
                    </div>
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

export default TeamManagement;
