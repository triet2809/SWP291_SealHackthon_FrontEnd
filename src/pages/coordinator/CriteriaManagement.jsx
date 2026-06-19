import React from 'react';
import { Card, Table, Button, Badge } from 'react-bootstrap';
import { Plus, Edit } from 'lucide-react';

const CriteriaManagement = () => {
  const criteria = [
    { id: 1, name: 'Innovation & Originality', weight: 30, category: 'General', status: 'Active' },
    { id: 2, name: 'Technical Complexity', weight: 25, category: 'General', status: 'Active' },
    { id: 3, name: 'UI/UX Design', weight: 15, category: 'General', status: 'Active' },
    { id: 4, name: 'Business Viability', weight: 20, category: 'General', status: 'Active' },
    { id: 5, name: 'AI Model Accuracy', weight: 10, category: 'AI/ML Specific', status: 'Active' },
  ];

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Criteria Management</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Manage scoring rubrics and weighting</div>
        </div>
        <Button variant="primary" className="d-flex align-items-center gap-2">
          <Plus size={18} /> Add Criteria
        </Button>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="table-responsive">
          <Table className="mb-0" hover>
            <thead>
              <tr>
                <th className="border-top-0 border-bottom">Criteria Name</th>
                <th className="border-top-0 border-bottom">Weight (%)</th>
                <th className="border-top-0 border-bottom">Applicable Category</th>
                <th className="border-top-0 border-bottom">Status</th>
                <th className="border-top-0 border-bottom text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {criteria.map((item) => (
                <tr key={item.id}>
                  <td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{item.name}</td>
                  <td className="py-3">
                    <Badge bg="secondary" className="bg-opacity-25 text-secondary border">{item.weight}%</Badge>
                  </td>
                  <td className="py-3">{item.category}</td>
                  <td className="py-3">
                    <Badge bg="success">{item.status}</Badge>
                  </td>
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

export default CriteriaManagement;
