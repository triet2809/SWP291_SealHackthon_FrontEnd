import React from 'react';
import { Card, Table, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { Search, Eye, Ban } from 'lucide-react';
import { mentorAssignedTeams } from '../../data/mockData';

const TeamManagement = () => {
  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Team Management</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>View and manage registered teams</div>
        </div>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <InputGroup style={{ maxWidth: '300px' }}>
            <InputGroup.Text className="bg-transparent border-end-0">
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control className="border-start-0" placeholder="Search teams..." />
          </InputGroup>
          <div className="d-flex gap-2">
            <Form.Select style={{ width: '150px' }}>
              <option>All Categories</option>
              <option>AI/ML</option>
              <option>Web Dev</option>
            </Form.Select>
            <Form.Select style={{ width: '150px' }}>
              <option>All Statuses</option>
              <option>On Track</option>
              <option>Needs Attention</option>
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
                <th className="border-top-0 border-bottom">Members</th>
                <th className="border-top-0 border-bottom">Status</th>
                <th className="border-top-0 border-bottom text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mentorAssignedTeams.map((team) => (
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
                  <td className="py-3">{team.category}</td>
                  <td className="py-3">{team.members}</td>
                  <td className="py-3">
                    <Badge bg={
                      team.status === 'On Track' ? 'success' :
                      team.status === 'Needs Attention' ? 'warning' : 'danger'
                    } text={team.status === 'Needs Attention' ? 'dark' : 'light'}>
                      {team.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-end">
                    <Button variant="link" size="sm" className="p-0 text-primary me-3">
                      <Eye size={16} />
                    </Button>
                    <Button variant="link" size="sm" className="p-0 text-danger">
                      <Ban size={16} />
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

export default TeamManagement;
