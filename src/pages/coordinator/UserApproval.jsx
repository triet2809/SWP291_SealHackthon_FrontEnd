import React from 'react';
import { Card, Table, Button, Badge } from 'react-bootstrap';
import { Check, X } from 'lucide-react';

const UserApproval = () => {
  const pendingUsers = [
    { id: 1, name: 'David Lee', email: 'd.lee@fpt.edu.vn', type: 'Student', requestedRole: 'Team Member', date: 'June 18, 2026' },
    { id: 2, name: 'Amanda Smith', email: 'a.smith@external.com', type: 'Guest', requestedRole: 'Guest Judge', date: 'June 18, 2026' },
    { id: 3, name: 'Prof. John Doe', email: 'j.doe@fpt.edu.vn', type: 'Faculty', requestedRole: 'Mentor', date: 'June 17, 2026' },
  ];

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>User Approval</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Review and approve pending account requests</div>
        </div>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="table-responsive">
          <Table className="mb-0" hover>
            <thead>
              <tr>
                <th className="border-top-0 border-bottom">Name</th>
                <th className="border-top-0 border-bottom">Email</th>
                <th className="border-top-0 border-bottom">User Type</th>
                <th className="border-top-0 border-bottom">Requested Role</th>
                <th className="border-top-0 border-bottom">Date</th>
                <th className="border-top-0 border-bottom text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user) => (
                <tr key={user.id}>
                  <td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{user.name}</td>
                  <td className="py-3" style={{ color: 'var(--cf-text-secondary)' }}>{user.email}</td>
                  <td className="py-3">
                    <Badge bg="secondary" className="bg-opacity-25 text-secondary border">{user.type}</Badge>
                  </td>
                  <td className="py-3 fw-medium">{user.requestedRole}</td>
                  <td className="py-3">{user.date}</td>
                  <td className="py-3 text-end">
                    <Button variant="outline-success" size="sm" className="me-2 d-inline-flex align-items-center gap-1">
                      <Check size={14} /> Approve
                    </Button>
                    <Button variant="outline-danger" size="sm" className="d-inline-flex align-items-center gap-1">
                      <X size={14} /> Reject
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

export default UserApproval;
