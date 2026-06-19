import React from 'react';
import { Card, Table, Button, Badge } from 'react-bootstrap';
import { Trophy, Plus, Edit } from 'lucide-react';

const AwardsManagement = () => {
  const awards = [
    { id: 1, name: 'Grand Prize Winner', prize: '$10,000', category: 'Overall', status: 'Unassigned', winner: null },
    { id: 2, name: 'Best AI/ML Solution', prize: '$5,000', category: 'AI/ML', status: 'Assigned', winner: 'QuantumLeap' },
    { id: 3, name: 'Best Data Analytics', prize: '$5,000', category: 'Data Science', status: 'Assigned', winner: 'DataCraft' },
    { id: 4, name: "People's Choice", prize: '$2,500', category: 'Overall', status: 'Voting Active', winner: null },
  ];

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Awards Management</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Configure prize pools and assign winners</div>
        </div>
        <Button variant="primary" className="d-flex align-items-center gap-2">
          <Plus size={18} /> Add Award
        </Button>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="table-responsive">
          <Table className="mb-0" hover>
            <thead>
              <tr>
                <th className="border-top-0 border-bottom">Award Name</th>
                <th className="border-top-0 border-bottom">Prize</th>
                <th className="border-top-0 border-bottom">Category</th>
                <th className="border-top-0 border-bottom">Status</th>
                <th className="border-top-0 border-bottom">Winner</th>
                <th className="border-top-0 border-bottom text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {awards.map((award) => (
                <tr key={award.id}>
                  <td className="fw-medium py-3 d-flex align-items-center gap-2">
                    <Trophy size={16} className="text-warning" />
                    <span style={{ color: 'var(--cf-text-primary)' }}>{award.name}</span>
                  </td>
                  <td className="py-3 text-success fw-medium">{award.prize}</td>
                  <td className="py-3">{award.category}</td>
                  <td className="py-3">
                    <Badge bg={
                      award.status === 'Assigned' ? 'success' :
                      award.status === 'Voting Active' ? 'info' : 'secondary'
                    }>
                      {award.status}
                    </Badge>
                  </td>
                  <td className="py-3 fw-medium" style={{ color: 'var(--cf-text-primary)' }}>{award.winner || '-'}</td>
                  <td className="py-3 text-end">
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

export default AwardsManagement;
