import React from 'react';
import { Card, Table, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { Search, Mail, Edit } from 'lucide-react';

const JudgeManagement = () => {
  const judges = [
    { id: 1, name: 'Prof. James Kim', email: 'j.kim@meridian.edu', role: 'Lead Judge', category: 'AI/ML', status: 'Confirmed' },
    { id: 2, name: 'Dr. Emily Chen', email: 'e.chen@fpt.edu.vn', role: 'Panel Judge', category: 'Data Science', status: 'Confirmed' },
    { id: 3, name: 'Michael Ross', email: 'm.ross@techcorp.com', role: 'Guest Judge', category: 'Web Dev', status: 'Pending Invite' },
  ];

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Judge Management</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Manage judges and evaluation panels</div>
        </div>
        <Button variant="primary">Invite Judge</Button>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <InputGroup style={{ maxWidth: '300px' }}>
            <InputGroup.Text className="bg-transparent border-end-0">
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control className="border-start-0" placeholder="Search judges..." />
          </InputGroup>
        </div>
        <div className="table-responsive">
          <Table className="mb-0" hover>
            <thead>
              <tr>
                <th className="border-top-0 border-bottom">Name</th>
                <th className="border-top-0 border-bottom">Email</th>
                <th className="border-top-0 border-bottom">Role</th>
                <th className="border-top-0 border-bottom">Category Focus</th>
                <th className="border-top-0 border-bottom">Status</th>
                <th className="border-top-0 border-bottom text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {judges.map((judge) => (
                <tr key={judge.id}>
                  <td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{judge.name}</td>
                  <td className="py-3" style={{ color: 'var(--cf-text-secondary)' }}>{judge.email}</td>
                  <td className="py-3">{judge.role}</td>
                  <td className="py-3">{judge.category}</td>
                  <td className="py-3">
                    <Badge bg={judge.status === 'Confirmed' ? 'success' : 'warning'} text={judge.status === 'Pending Invite' ? 'dark' : 'light'}>
                      {judge.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-end">
                    <Button variant="link" size="sm" className="p-0 text-secondary me-3">
                      <Mail size={16} />
                    </Button>
                    <Button variant="link" size="sm" className="p-0 text-primary">
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
