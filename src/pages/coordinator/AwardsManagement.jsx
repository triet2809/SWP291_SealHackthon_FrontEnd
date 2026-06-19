import React, { useState } from 'react';
import { Card, Table, Button, Badge, Modal, Form, InputGroup } from 'react-bootstrap';
import { Trophy, Plus, Edit, Trash2, Search } from 'lucide-react';

const AwardsManagement = () => {
  const [awards, setAwards] = useState([
    { id: 1, name: 'Grand Prize Winner', prize: '$10,000', category: 'Overall', status: 'Unassigned', winner: null },
    { id: 2, name: 'Best AI/ML Solution', prize: '$5,000', category: 'AI/ML', status: 'Assigned', winner: 'QuantumLeap' },
    { id: 3, name: 'Best Data Analytics', prize: '$5,000', category: 'Data Science', status: 'Assigned', winner: 'DataCraft' },
    { id: 4, name: "People's Choice", prize: '$2,500', category: 'Overall', status: 'Voting Active', winner: null },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAward, setEditingAward] = useState(null);

  const [newAward, setNewAward] = useState({
    name: '',
    prize: '',
    category: 'Overall',
    status: 'Unassigned',
    winner: ''
  });
  const filteredAwards = awards.filter(
    (award) =>
      award.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );
  const handleSaveAward = () => {
    if (!newAward.name || !newAward.prize
    ) {
      alert('Please fill all fields');
      return;
    }
    if (editingAward) {
      setAwards(awards.map((a) => a.id === editingAward.id ? { ...editingAward, ...newAward } : a));
    } else {
      setAwards([...awards, { id: Date.now(), ...newAward }]);
    }
    setEditingAward(null);
    setNewAward({
      name: '',
      prize: '',
      category: 'Overall',
      status: 'Unassigned',
      winner: ''
    });
    setShowModal(false);
  };

  const handleDeleteAward = (id) => {
    if (window.confirm('Delete this award?')
    ) {
      setAwards(awards.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Awards Management</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Configure prize pools and assign winners</div>
        </div>
        <Button variant="primary" className="d-flex align-items-center gap-2" onClick={() => {
          setEditingAward(null); setNewAward({
            name: '',
            prize: '',
            category: 'Overall',
            status: 'Unassigned',
            winner: ''
          });
          setShowModal(true);
        }}>
          <Plus size={18} /> Add Award
        </Button>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="p-3 border-bottom">
          <InputGroup
            style={{ maxWidth: '300px' }}>
            <InputGroup.Text>
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control placeholder="Search awards..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)
            }
            />
          </InputGroup>
        </div>
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
              {filteredAwards.map((award) => (
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
                    <Button variant="link" size="sm" className="p-0 text-primary" onClick={() => {
                      setEditingAward(award);
                      setNewAward({
                        name: award.name,
                        prize: award.prize,
                        category: award.category,
                        status: award.status,
                        winner: award.winner || ''
                      });
                      setShowModal(true);
                    }}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="link" size="sm" className="p-0 text-danger" onClick={() => handleDeleteAward(award.id)}  >
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
          setEditingAward(null);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingAward
              ? 'Edit Award'
              : 'Create Award'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>

            <Form.Group className="mb-3">
              <Form.Label>
                Award Name
              </Form.Label>

              <Form.Control
                value={newAward.name}
                onChange={(e) =>
                  setNewAward({
                    ...newAward,
                    name: e.target.value
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Prize
              </Form.Label>

              <Form.Control
                value={newAward.prize}
                onChange={(e) =>
                  setNewAward({
                    ...newAward,
                    prize: e.target.value
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Category
              </Form.Label>

              <Form.Select
                value={newAward.category}
                onChange={(e) =>
                  setNewAward({
                    ...newAward,
                    category: e.target.value
                  })
                }
              >
                <option>Overall</option>
                <option>AI/ML</option>
                <option>Data Science</option>
                <option>Web Dev</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Status
              </Form.Label>

              <Form.Select
                value={newAward.status}
                onChange={(e) =>
                  setNewAward({
                    ...newAward,
                    status: e.target.value
                  })
                }
              >
                <option>
                  Unassigned
                </option>

                <option>
                  Assigned
                </option>

                <option>
                  Voting Active
                </option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Winner
              </Form.Label>

              <Form.Control
                placeholder="Team Name"
                value={newAward.winner}
                onChange={(e) =>
                  setNewAward({
                    ...newAward,
                    winner: e.target.value
                  })
                }
              />
            </Form.Group>

          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setEditingAward(null);
            }}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleSaveAward}
          >
            {editingAward
              ? 'Update Award'
              : 'Create Award'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AwardsManagement;
