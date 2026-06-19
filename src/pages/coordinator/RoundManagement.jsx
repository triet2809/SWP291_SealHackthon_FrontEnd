import React from 'react';
import { Card, Table, Button, Badge } from 'react-bootstrap';
import { Plus, Edit, MoreVertical } from 'lucide-react';

const RoundManagement = () => {
  const rounds = [
    { id: 1, name: 'Registration', startDate: 'May 01, 2026', endDate: 'June 16, 2026', status: 'Completed', advancement: 'All Registered' },
    { id: 2, name: 'Preliminary Submission', startDate: 'June 17, 2026', endDate: 'June 19, 2026', status: 'Active', advancement: 'Top 50%' },
    { id: 3, name: 'Final Judging', startDate: 'June 20, 2026', endDate: 'June 22, 2026', status: 'Upcoming', advancement: 'Winners Only' },
  ];

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Round Management</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Configure event rounds and advancement rules</div>
        </div>
        <Button variant="primary" className="d-flex align-items-center gap-2">
          <Plus size={18} /> Add Round
        </Button>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="table-responsive">
          <Table className="mb-0" hover>
            <thead>
              <tr>
                <th className="border-top-0 border-bottom">Round Name</th>
                <th className="border-top-0 border-bottom">Start Date</th>
                <th className="border-top-0 border-bottom">End Date</th>
                <th className="border-top-0 border-bottom">Advancement Rule</th>
                <th className="border-top-0 border-bottom">Status</th>
                <th className="border-top-0 border-bottom text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rounds.map((round) => (
                <tr key={round.id}>
                  <td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{round.name}</td>
                  <td className="py-3">{round.startDate}</td>
                  <td className="py-3">{round.endDate}</td>
                  <td className="py-3">{round.advancement}</td>
                  <td className="py-3">
                    <Badge bg={
                      round.status === 'Active' ? 'success' :
                      round.status === 'Upcoming' ? 'info' : 'secondary'
                    }>
                      {round.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-end">
                    <Button variant="link" size="sm" className="p-0 text-muted me-3">
                      <Edit size={16} />
                    </Button>
                    <Button variant="link" size="sm" className="p-0 text-muted">
                      <MoreVertical size={16} />
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

export default RoundManagement;
