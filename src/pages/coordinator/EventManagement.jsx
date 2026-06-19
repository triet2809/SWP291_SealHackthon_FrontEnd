import React, { useState } from 'react';
import { Card, Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { Plus, Edit, Settings, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EventManagement = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [newEvent, setNewEvent] = useState({
    name: '',
    startDate: '',
    endDate: '',
    status: 'Draft'
  });

  const [editingEvent, setEditingEvent] = useState(null);

  const [events, setEvents] = useState([
    { id: 1, name: 'SEAL Hackathon 2026', startDate: 'June 20, 2026', endDate: 'June 22, 2026', status: 'Active', participants: 168 },
    { id: 2, name: 'Winter CodeFest 2025', startDate: 'Dec 10, 2025', endDate: 'Dec 12, 2025', status: 'Completed', participants: 210 },
    { id: 3, name: 'AI Innovation Challenge', startDate: 'Aug 15, 2026', endDate: 'Aug 30, 2026', status: 'Draft', participants: 0 },
  ]);

  const handleSaveEvent = () => {
    if (!newEvent.name || !newEvent.startDate || !newEvent.endDate) {
      alert('Please fill all fields');
      return;
    }

    if (editingEvent) {
      setEvents(
        events.map((e) => e.id === editingEvent.id ? { ...editingEvent, ...newEvent } : e)
      );
    } else {
      const event = { id: Date.now(), ...newEvent, participants: 0 };
      setEvents([...events, event]);
    }
    setEditingEvent(null);
    setNewEvent({
      name: '',
      startDate: '',
      endDate: '',
      status: 'Draft'
    });
    setShowModal(false);
  };

  const handleDeleteEvent = (id) => {
    if (window.confirm('Delete this event?')) {
      setEvents(events.filter(event => event.id !== id));
    }
  };

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Event Management</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Create and configure hackathon events</div>
        </div>
        <Button variant="primary" className="d-flex align-items-center gap-2" onClick={() => {
          setEditingEvent(null);
          setNewEvent({
            name: '',
            startDate: '',
            endDate: '',
            status: 'Draft'
          });
          setShowModal(true);
        }}>
          <Plus size={18} /> New Event
        </Button>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="table-responsive">
          <Table className="mb-0" hover>
            <thead>
              <tr>
                <th className="border-top-0 border-bottom">Event Name</th>
                <th className="border-top-0 border-bottom">Start Date</th>
                <th className="border-top-0 border-bottom">End Date</th>
                <th className="border-top-0 border-bottom">Participants</th>
                <th className="border-top-0 border-bottom">Status</th>
                <th className="border-top-0 border-bottom text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{event.name}</td>
                  <td className="py-3">{event.startDate}</td>
                  <td className="py-3">{event.endDate}</td>
                  <td className="py-3">{event.participants}</td>
                  <td className="py-3">
                    <Badge bg={
                      event.status === 'Active' ? 'success' :
                        event.status === 'Draft' ? 'warning' : 'secondary'
                    } text={event.status === 'Draft' ? 'dark' : 'light'}>
                      {event.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-end">
                    {/* <Button variant="link" size="sm" className="p-0 text-muted me-3">
                      <Settings size={16} />
                    </Button> */}
                    <Button variant="link" size="sm" className="p-0 text-primary" onClick={() => {
                      setEditingEvent(event);
                      setNewEvent(event);
                      setShowModal(true);
                    }}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="link" size="sm" className="p-0 text-danger ms-3" onClick={() => handleDeleteEvent(event.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
      <Modal show={showModal} onHide={() => { setShowModal(false); setEditingEvent(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>{editingEvent ? 'Edit Event' : 'Create Event'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                value={newEvent.name}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    name: e.target.value
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={newEvent.startDate}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    startDate: e.target.value
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={newEvent.endDate}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    endDate: e.target.value
                  })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newEvent.status}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    status: e.target.value
                  })
                }
              >
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => { setShowModal(false); setEditingEvent(null); }}
          >
            Cancel
          </Button>

          <Button variant="primary" onClick={handleSaveEvent}>
            {editingEvent ? 'Update Event' : 'Create Event'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EventManagement;
