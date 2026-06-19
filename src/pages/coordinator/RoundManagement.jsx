import React, { useState } from 'react';
import { Card, Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { Plus, Edit, MoreVertical, Trash2 } from 'lucide-react';

const RoundManagement = () => {
  const [rounds, setRounds] = useState([
    { id: 1, name: 'Registration', startDate: 'May 01, 2026', endDate: 'June 16, 2026', status: 'Completed', advancement: 'All Registered' },
    { id: 2, name: 'Preliminary Submission', startDate: 'June 17, 2026', endDate: 'June 19, 2026', status: 'Active', advancement: 'Top 50%' },
    { id: 3, name: 'Final Judging', startDate: 'June 20, 2026', endDate: 'June 22, 2026', status: 'Upcoming', advancement: 'Winners Only' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingRound, setEditingRound] = useState(null);
  const [newRound, setNewRound] = useState({
    name: '',
    startDate: '',
    endDate: '',
    advancement: 'All Registered',
    status: 'Upcoming'
  });

  const handleSaveRound = () => {
    if (!newRound.name || !newRound.startDate || !newRound.endDate) {
      alert('Please fill all fields');
      return;
    }

    if (editingRound) {
      setRounds(rounds.map((r) => r.id === editingRound.id ? { ...editingRound, ...newRound } : r));
    } else {
      setRounds([...rounds, { id: Date.now(), ...newRound }]);
    }
    setEditingRound(null);
    setNewRound({
      name: '',
      startDate: '',
      endDate: '',
      advancement: 'All Registered',
      status: 'Upcoming'
    });
    setShowModal(false);
  };

  const handleDeleteRound = (id) => {
    if (window.confirm('Delete this round?')) {
      setRounds(rounds.filter((round) => round.id !== id));
    }
  };

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Round Management</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Configure event rounds and advancement rules</div>
        </div>
        <Button variant="primary" className="d-flex align-items-center gap-2"
          onClick={() => {
            setEditingRound(null);
            setNewRound({
              name: '',
              startDate: '',
              endDate: '',
              advancement: 'All Registered',
              status: 'Upcoming'
            });
            setShowModal(true);
          }}>
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
                    <Button variant="link" size="sm" className="p-0 text-muted me-3"
                      onClick={() => {
                        setEditingRound(round);
                        setNewRound(round);
                        setShowModal(true);
                      }}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="link" size="sm" className="p-0 text-danger me-3" onClick={() => handleDeleteRound(round.id)}>
                      <Trash2 size={16} />
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
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingRound(null);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingRound ? 'Edit Round' : 'Create Round'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>

            <Form.Group className="mb-3">
              <Form.Label>Round Name</Form.Label>
              <Form.Control
                type="text"
                value={newRound.name}
                onChange={(e) =>
                  setNewRound({
                    ...newRound,
                    name: e.target.value
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={newRound.startDate}
                onChange={(e) =>
                  setNewRound({
                    ...newRound,
                    startDate: e.target.value
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={newRound.endDate}
                onChange={(e) =>
                  setNewRound({
                    ...newRound,
                    endDate: e.target.value
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Advancement Rule</Form.Label>
              <Form.Select
                value={newRound.advancement}
                onChange={(e) =>
                  setNewRound({
                    ...newRound,
                    advancement: e.target.value
                  })
                }
              >
                <option>All Registered</option>
                <option>Top 50%</option>
                <option>Top 25%</option>
                <option>Top 10 Teams</option>
                <option>Winners Only</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newRound.status}
                onChange={(e) =>
                  setNewRound({
                    ...newRound,
                    status: e.target.value
                  })
                }
              >
                <option>Upcoming</option>
                <option>Active</option>
                <option>Completed</option>
              </Form.Select>
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowModal(false); setEditingRound(null); }}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveRound}
          >
            {editingRound ? 'Update Round' : 'Create Round'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RoundManagement;
