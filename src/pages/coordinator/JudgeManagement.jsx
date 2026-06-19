import React, { useState } from 'react';
import { Card, Table, Button, Badge, Form, InputGroup, Modal } from 'react-bootstrap';
import { Search, Mail, Edit } from 'lucide-react';

const JudgeManagement = () => {
  const [judges, setJudges] = useState([
    { id: 1, name: 'Prof. James Kim', email: 'j.kim@meridian.edu', role: 'Lead Judge', category: 'AI/ML', status: 'Confirmed' },
    { id: 2, name: 'Dr. Emily Chen', email: 'e.chen@fpt.edu.vn', role: 'Panel Judge', category: 'Data Science', status: 'Confirmed' },
    { id: 3, name: 'Michael Ross', email: 'm.ross@techcorp.com', role: 'Guest Judge', category: 'Web Dev', status: 'Pending Invite' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingJudge, setEditingJudge] = useState(null);

  const [newJudge, setNewJudge] = useState({
    name: '',
    email: '',
    role: '',
    category: '',
    status: 'Confirmed'
  });

  const filteredJudges = judges.filter(
    (judge) =>
      judge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      judge.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSaveJudge = () => {
    if (!newJudge.name || !newJudge.email || !newJudge.role || !newJudge.category) {
      alert('Please fill all fields');
      return;
    }
    if (editingJudge) {
      setJudges(judges.map((j) => j.id === editingJudge.id ? { ...editingJudge, ...newJudge } : j));
    } else {
      setJudges([...judges, { id: Date.now(), ...newJudge }]);
    }
    setEditingJudge(null);
    setNewJudge({
      name: '',
      email: '',
      role: '',
      category: '',
      status: 'Confirmed'
    });
    setShowModal(false);
  };
  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Judge Management</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Manage judges and evaluation panels</div>
        </div>
        <Button variant="primary" onClick={() => {
          setEditingJudge(null);
          setNewJudge({
            name: '',
            email: '',
            role: '',
            category: '',
            status: 'Confirmed'
          });
          setShowModal(true);
        }}>Invite Judge</Button>
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
                <th className="border-top-0 border-bottom">Category Focus</th>
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
                  <td className="py-3">{judge.category}</td>
                  <td className="py-3">
                    <Badge bg={judge.status === 'Confirmed' ? 'success' : 'warning'} text={judge.status === 'Pending Invite' ? 'dark' : 'light'}>
                      {judge.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-end">
                    <Button variant="link" size="sm" className="p-0 text-secondary me-3" onClick={() => window.open(`mailto:${judge.email}`)}>
                      <Mail size={16} />
                    </Button>
                    <Button variant="link" size="sm" className="p-0 text-primary" onClick={() => {
                      setEditingJudge(judge);
                      setNewJudge({
                        name: judge.name,
                        email: judge.email,
                        role: judge.role,
                        category: judge.category,
                        status: judge.status
                      });
                      setShowModal(true);
                    }}>
                      <Edit size={16} />
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
          setEditingJudge(null);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingJudge ? 'Edit Judge' : 'Invite Judge'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>

            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={newJudge.name}
                onChange={(e) =>
                  setNewJudge({
                    ...newJudge,
                    name: e.target.value
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newJudge.email}
                onChange={(e) =>
                  setNewJudge({
                    ...newJudge,
                    email: e.target.value
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={newJudge.role}
                onChange={(e) =>
                  setNewJudge({
                    ...newJudge,
                    role: e.target.value
                  })
                }
              >
                <option value="">Select Role</option>
                <option>Lead Judge</option>
                <option>Panel Judge</option>
                <option>Guest Judge</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={newJudge.category}
                onChange={(e) =>
                  setNewJudge({
                    ...newJudge,
                    category: e.target.value
                  })
                }
              >
                <option value="">Select Category</option>
                <option>AI/ML</option>
                <option>Web Dev</option>
                <option>Data Science</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newJudge.status}
                onChange={(e) =>
                  setNewJudge({
                    ...newJudge,
                    status: e.target.value
                  })
                }
              >
                <option>Confirmed</option>
                <option>Pending Invite</option>
              </Form.Select>
            </Form.Group>

          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setEditingJudge(null);
            }}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleSaveJudge}
          >
            {editingJudge ? 'Update Judge' : 'Invite Judge'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default JudgeManagement;
