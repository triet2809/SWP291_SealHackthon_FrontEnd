import React, { useState } from 'react';
import { Card, Table, Button, Badge, Form, InputGroup, Modal } from 'react-bootstrap';
import { Search, Mail, Edit, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MentorManagement = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([
    { id: 1, name: 'Dr. Priya Patel', email: 'p.patel@fpt.edu.vn', category: 'AI/ML', assignedTeams: ['Neural Nexus', 'CodeCraft', 'ByteBuilders'], status: 'Active' },
    { id: 2, name: 'Marcus Wright', email: 'm.wright@industry.com', category: 'Web Dev', assignedTeams: ['CloudNative', 'DataCraft'], status: 'Active' },
    { id: 3, name: 'Sarah Lee', email: 's.lee@startup.io', category: 'Data Science', assignedTeams: ['PredictIt', 'Visionary'], status: 'Inactive' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMentors = mentors.filter((mentor) =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Mentor Management</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Assign mentors to categories and teams</div>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/coordinator/mentors/new')}
        >
          Invite Mentor
        </Button>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <InputGroup style={{ maxWidth: '300px' }}>
            <InputGroup.Text className="bg-transparent border-end-0">
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control
              className="border-start-0"
              placeholder="Search mentors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>
        <div className="table-responsive">
          <Table className="mb-0" hover>
            <thead>
              <tr>
                <th className="border-top-0 border-bottom">Name</th>
                <th className="border-top-0 border-bottom">Email</th>
                <th className="border-top-0 border-bottom">Category</th>
                <th className="border-top-0 border-bottom">Assigned Teams</th>
                <th className="border-top-0 border-bottom">Status</th>
                <th className="border-top-0 border-bottom text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMentors.map((mentor) => (
                <tr key={mentor.id}>
                  <td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{mentor.name}</td>
                  <td className="py-3" style={{ color: 'var(--cf-text-secondary)' }}>{mentor.email}</td>
                  <td className="py-3">{mentor.category}</td>
                  <td className="py-3">
                    <div className="d-flex flex-wrap gap-1">
                      {mentor.assignedTeams && mentor.assignedTeams.map((team, idx) => (
                        <Badge key={idx} bg="info" text="dark">{team}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-3">
                    <Badge bg={mentor.status === 'Active' ? 'success' : 'secondary'}>{mentor.status}</Badge>
                  </td>
                  <td className="py-3 text-end">
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 text-secondary me-3"
                      onClick={() => window.open(`mailto:${mentor.email}`)}
                    >
                      <Mail size={16} />
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 text-success me-3"
                      onClick={() => navigate(`/coordinator/mentors/${mentor.id}/assign`)}
                    >
                      <UserPlus size={16} />
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 text-primary"
                      onClick={() => navigate(`/coordinator/mentors/${mentor.id}/edit`)}
                    >
                      <Edit size={16} />
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

export default MentorManagement;