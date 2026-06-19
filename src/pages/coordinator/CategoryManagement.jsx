import React from 'react';
import { Card, Table, Button, Badge } from 'react-bootstrap';
import { Plus, Edit } from 'lucide-react';

const CategoryManagement = () => {
  const categories = [
    { id: 1, name: 'AI & Machine Learning', description: 'Solutions leveraging AI/ML models', mentors: 12, teams: 18 },
    { id: 2, name: 'Data Science', description: 'Analytics and predictive modeling', mentors: 8, teams: 14 },
    { id: 3, name: 'Web Development', description: 'Full stack web applications', mentors: 15, teams: 22 },
    { id: 4, name: 'Cybersecurity', description: 'Security and privacy solutions', mentors: 5, teams: 6 },
  ];

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Category Management</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Manage project categories and assigned personnel</div>
        </div>
        <Button variant="primary" className="d-flex align-items-center gap-2">
          <Plus size={18} /> Add Category
        </Button>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="table-responsive">
          <Table className="mb-0" hover>
            <thead>
              <tr>
                <th className="border-top-0 border-bottom">Category Name</th>
                <th className="border-top-0 border-bottom">Description</th>
                <th className="border-top-0 border-bottom">Assigned Mentors</th>
                <th className="border-top-0 border-bottom">Registered Teams</th>
                <th className="border-top-0 border-bottom text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{cat.name}</td>
                  <td className="py-3" style={{ color: 'var(--cf-text-secondary)' }}>{cat.description}</td>
                  <td className="py-3">
                    <Badge bg="primary" pill>{cat.mentors}</Badge>
                  </td>
                  <td className="py-3">
                    <Badge bg="info" pill>{cat.teams}</Badge>
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

export default CategoryManagement;
