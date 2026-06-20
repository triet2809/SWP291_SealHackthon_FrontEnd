import React, { useState } from 'react';
import { Card, Table, Button, Badge, Modal, Form, InputGroup } from 'react-bootstrap';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const CriteriaManagement = () => {
  const [criteria, setCriteria] = useState([
    { id: 1, name: 'Innovation & Originality', weight: 30, category: 'General', status: 'Active' },
    { id: 2, name: 'Technical Complexity', weight: 25, category: 'General', status: 'Active' },
    { id: 3, name: 'UI/UX Design', weight: 15, category: 'General', status: 'Active' },
    { id: 4, name: 'Business Viability', weight: 20, category: 'General', status: 'Active' },
    { id: 5, name: 'AI Model Accuracy', weight: 10, category: 'AI/ML Specific', status: 'Active' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState(null);
  const [newCriteria, setNewCriteria] = useState({
    name: '',
    weight: '',
    category: 'General',
    status: 'Active'
  });
  const filteredCriteria = criteria.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSaveCriteria = () => {
    if (!newCriteria.name || !newCriteria.weight) {
      alert('Please fill all fields');
      return;
    }
    if (editingCriteria) {
      setCriteria(criteria.map((c) => c.id === editingCriteria.id ? { ...editingCriteria, ...newCriteria } : c));
    } else {
      setCriteria([...criteria, { id: Date.now(), ...newCriteria }]);
    }
    setEditingCriteria(null);
    setNewCriteria({
      name: '',
      weight: '',
      category: 'General',
      status: 'Active'
    });
    setShowModal(false);
  };
  const handleDeleteCriteria = (id) => {
    if (window.confirm('Delete this criteria?')) {
      setCriteria(
        criteria.filter((c) => c.id !== id)
      );
    }
  };
  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Criteria Management</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Manage scoring rubrics and weighting</div>
        </div>
        <Button variant="primary" className="d-flex align-items-center gap-2" onClick={() => {
          setEditingCriteria(null);
          setNewCriteria({
            name: '',
            weight: '',
            category: 'General',
            status: 'Active'
          });
          setShowModal(true);
        }}>
          <Plus size={18} /> Add Criteria
        </Button>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="p-3 border-bottom">
          <InputGroup style={{ maxWidth: '300px' }}>
            <InputGroup.Text>
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search criteria..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />
          </InputGroup>
        </div>
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
              {filteredCriteria.map((item) => (
                <tr key={item.id}>
                  <td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{item.name}</td>
                  <td className="py-3">
                    <Badge bg="secondary" className="bg-opacity-25 text-secondary border">{item.weight}%</Badge>
                  </td>
                  <td className="py-3">{item.category}</td>
                  <td className="py-3">
                    <Badge bg={item.status === 'Active' ? 'success' : 'secondary'}>{item.status}</Badge>
                  </td>
                  <td className="py-3 text-end">
                    <Button variant="link" size="sm" className="p-0 text-primary me-3" onClick={() => {
                      setEditingCriteria(item);
                      setNewCriteria({
                        name: item.name,
                        weight: item.weight,
                        category: item.category,
                        status: item.status
                      });
                      setShowModal(true);
                    }}   >
                      <Edit size={16} />
                    </Button>
                    <Button variant="link" size="sm" className="p-0 text-danger" onClick={() => handleDeleteCriteria(item.id)}  >
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
          setEditingCriteria(null);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCriteria
              ? 'Edit Criteria'
              : 'Create Criteria'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>

            <Form.Group className="mb-3">
              <Form.Label>Criteria Name</Form.Label>
              <Form.Control
                value={newCriteria.name}
                onChange={(e) =>
                  setNewCriteria({
                    ...newCriteria,
                    name: e.target.value
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Weight (%)</Form.Label>
              <Form.Control
                type="number"
                value={newCriteria.weight}
                onChange={(e) =>
                  setNewCriteria({
                    ...newCriteria,
                    weight: e.target.value
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={newCriteria.category}
                onChange={(e) =>
                  setNewCriteria({
                    ...newCriteria,
                    category: e.target.value
                  })
                }
              >
                <option>General</option>
                <option>AI/ML Specific</option>
                <option>Web Dev Specific</option>
                <option>Data Science Specific</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newCriteria.status}
                onChange={(e) =>
                  setNewCriteria({
                    ...newCriteria,
                    status: e.target.value
                  })
                }
              >
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
              setEditingCriteria(null);
            }}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleSaveCriteria}
          >
            {editingCriteria
              ? 'Update Criteria'
              : 'Create Criteria'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CriteriaManagement;
