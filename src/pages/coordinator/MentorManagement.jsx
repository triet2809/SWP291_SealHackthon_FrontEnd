import React from 'react';
import { Card, Table, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { Search, Mail, Edit } from 'lucide-react';

const MentorManagement = () => {
  const mentors = [
    { id: 1, name: 'Dr. Priya Patel', email: 'p.patel@fpt.edu.vn', category: 'AI/ML', teamsAssigned: 3, status: 'Active' },
    { id: 2, name: 'Marcus Wright', email: 'm.wright@industry.com', category: 'Web Dev', teamsAssigned: 4, status: 'Active' },
    { id: 3, name: 'Sarah Lee', email: 's.lee@startup.io', category: 'Data Science', teamsAssigned: 2, status: 'Inactive' },
  ];

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Mentor Management</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Assign mentors to categories and teams</div>
        </div>
        <Button variant="primary">Invite Mentor</Button>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <InputGroup style={{ maxWidth: '300px' }}>
            <InputGroup.Text className="bg-transparent border-end-0">
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control className="border-start-0" placeholder="Search mentors..." />
          </InputGroup>
        </div>
        <div className="table-responsive">
          <Table className="mb-0" hover>
            <thead>
              <tr>
                <th className="border-top-0 border-bottom">Name</th>
                <th className="border-top-0 border-bottom">Email</th>
                <th className="border-top-0 border-bottom">Category</th>
                <th className="border-top-0 border-bottom">Teams Assigned</th>
                <th className="border-top-0 border-bottom">Status</th>
                <th className="border-top-0 border-bottom text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mentors.map((mentor) => (
                <tr key={mentor.id}>
                  <td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{mentor.name}</td>
                  <td className="py-3" style={{ color: 'var(--cf-text-secondary)' }}>{mentor.email}</td>
                  <td className="py-3">{mentor.category}</td>
                  <td className="py-3">
                    <Badge bg="info" pill>{mentor.teamsAssigned}</Badge>
                  </td>
                  <td className="py-3">
                    <Badge bg={mentor.status === 'Active' ? 'success' : 'secondary'}>{mentor.status}</Badge>
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

export default MentorManagement;
