import React, { useState } from 'react';
import { Card, Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { Plus, Edit, Trash2 } from 'lucide-react';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'AI & Machine Learning', description: 'Solutions leveraging AI/ML models', mentors: 12, teams: 18 },
    { id: 2, name: 'Data Science', description: 'Analytics and predictive modeling', mentors: 8, teams: 14 },
    { id: 3, name: 'Web Development', description: 'Full stack web applications', mentors: 15, teams: 22 },
    { id: 4, name: 'Cybersecurity', description: 'Security and privacy solutions', mentors: 5, teams: 6 },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [editingCategory, setEditingCategory] = useState(null);

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    status: 'Active'
  });

  const handleSaveCategory = () => {
    if (!newCategory.name || !newCategory.description) {
      alert('Please fill all fields');
      return;
    }

    if (editingCategory) {
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id
            ? { ...editingCategory, ...newCategory }
            : c
        )
      );
    } else {
      setCategories([
        ...categories,
        {
          id: Date.now(),
          ...newCategory,
          mentors: 0,
          teams: 0
        }
      ]);
    }

    setEditingCategory(null);

    setNewCategory({
      name: '',
      description: '',
      status: 'Active'
    });

    setShowModal(false);
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Delete this category?')) {
      setCategories(
        categories.filter((c) => c.id !== id)
      );
    }
  };

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Category Management</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Manage project categories and assigned personnel</div>
        </div>
        <Button variant="primary" className="d-flex align-items-center gap-2" onClick={() => {
          setEditingCategory(null);
          setNewCategory({
            name: '',
            description: '',
            status: 'Active'
          });
          setShowModal(true);
        }}>
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
                    <Button variant="link" size="sm" className="p-0 text-primary" onClick={() => {
                      setEditingCategory(cat);
                      setNewCategory(cat);
                      setShowModal(true);
                    }}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="link" size="sm" className="p-0 text-danger ms-3" onClick={() => handleDeleteCategory(cat.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingCategory(null);
        }}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCategory ? 'Edit Category' : 'Create Category'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>

            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    name: e.target.value
                  })
                }/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value
                  })
                }/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newCategory.status}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    status: e.target.value
                  })
                }>
                <option>Active</option>
                <option>Inactive</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setEditingCategory(null);
            }}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveCategory}>
            {editingCategory ? 'Update Category' : 'Create Category'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
