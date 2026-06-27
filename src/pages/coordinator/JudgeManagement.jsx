import React, { useState } from 'react';
import { Card, Table, Button, Badge, Form, InputGroup, Modal } from 'react-bootstrap';
import { Search, Mail, Edit, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JudgeManagement = () => {
  const navigate = useNavigate();
  const [judges, setJudges] = useState([
    { id: 1, name: 'Prof. James Kim', email: 'j.kim@meridian.edu', role: 'Lead Judge', assignedTracks: ['AI Track A', 'Web Track B'], assignedRounds: ['Preliminary', 'Finals'], status: 'Confirmed' },
    { id: 2, name: 'Dr. Emily Chen', email: 'e.chen@fpt.edu.vn', role: 'Panel Judge', assignedTracks: ['Data Track B'], assignedRounds: ['Finals'], status: 'Confirmed' },
    { id: 3, name: 'Michael Ross', email: 'm.ross@techcorp.com', role: 'Guest Judge', assignedTracks: ['Web Track A'], assignedRounds: ['Preliminary'], status: 'Pending Invite' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJudges = judges.filter(
    (judge) =>
      judge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      judge.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Judge Management</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Manage judges and evaluation panels</div>
        </div>
        <Button variant="primary" onClick={() => navigate('/coordinator/judges/new')}>Invite Judge</Button>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <InputGroup style={{ maxWidth: '300px' }}>
            <InputGroup.Text className="bg-transparent border-end-0">
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control className="border-start-0" placeholder="Search judges..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </InputGroup>
        </div>
        <div className="table-responsive">
          <Table className="mb-0" hover>
            <thead>
              <tr>
                <th className="border-top-0 border-bottom">Name</th>
                <th className="border-top-0 border-bottom">Email</th>
                <th className="border-top-0 border-bottom">Role</th>
                <th className="border-top-0 border-bottom">Assigned Tracks</th>
                <th className="border-top-0 border-bottom">Assigned Rounds</th>
                <th className="border-top-0 border-bottom">Status</th>
                <th className="border-top-0 border-bottom text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJudges.map((judge) => (
                <tr key={judge.id}>
                  <td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{judge.name}</td>
                  <td className="py-3" style={{ color: 'var(--cf-text-secondary)' }}>{judge.email}</td>
                  <td className="py-3">{judge.role}</td>
                  <td className="py-3">
                    <div className="d-flex flex-wrap gap-1">
                      {judge.assignedTracks && judge.assignedTracks.map((track, idx) => (
                        <Badge key={idx} bg="secondary">{track}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="d-flex flex-wrap gap-1">
                      {judge.assignedRounds && judge.assignedRounds.map((round, idx) => (
                        <Badge key={idx} bg="info" text="dark">{round}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-3">
                    <Badge bg={judge.status === 'Confirmed' ? 'success' : 'warning'} text={judge.status === 'Pending Invite' ? 'dark' : 'light'}>
                      {judge.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-end">
                    <Button variant="link" size="sm" className="p-0 text-secondary me-3" onClick={() => window.open(`mailto:${judge.email}`)}>
                      <Mail size={16} />
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 text-success me-3"
                      onClick={() => navigate(`/coordinator/judges/${judge.id}/assign`)}
                    >
                      <UserPlus size={16} />
                    </Button>
                    <Button variant="link" size="sm" className="p-0 text-primary" onClick={() => navigate(`/coordinator/judges/${judge.id}/edit`)}>
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

export default JudgeManagement;
