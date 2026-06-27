import React, { useState } from 'react';
import { Card, Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { Plus, Edit, Settings, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EventManagement = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [newEvent, setNewEvent] = useState({
    name: '',
    term: '',
    prize: '',
    roundsCount: '',
    tracksCount: '',
    registrationStartDate: '',
    registrationEndDate: '',
    startDate: '',
    endDate: '',
    status: 'Draft'
  });

  const [editingEvent, setEditingEvent] = useState(null);

  const [events, setEvents] = useState([
    { id: 1, name: 'SEAL Hackathon 2026', term: 'Summer 2026', prize: '$5000', roundsCount: '3', tracksCount: '4', registrationStartDate: '2026-05-01', registrationEndDate: '2026-06-15', startDate: '2026-06-20', endDate: '2026-06-22', status: 'Active', participants: 168 },
    { id: 2, name: 'Winter CodeFest 2025', term: 'Fall 2025', prize: '$3000', roundsCount: '2', tracksCount: '3', registrationStartDate: '2025-11-01', registrationEndDate: '2025-12-05', startDate: '2025-12-10', endDate: '2025-12-12', status: 'Completed', participants: 210 },
    { id: 3, name: 'AI Innovation Challenge', term: 'Fall 2026', prize: '$10000', roundsCount: '4', tracksCount: '2', registrationStartDate: '2026-07-01', registrationEndDate: '2026-08-10', startDate: '2026-08-15', endDate: '2026-08-30', status: 'Draft', participants: 0 },
  ]);

  const handleSaveEvent = () => {
    if (!newEvent.name || !newEvent.term || !newEvent.registrationStartDate || !newEvent.registrationEndDate || !newEvent.startDate || !newEvent.endDate) {
      alert('Please fill all required fields');
      return;
    }

    // Constraints Validation
    const regStart = new Date(newEvent.registrationStartDate);
    const regEnd = new Date(newEvent.registrationEndDate);
    const eventStart = new Date(newEvent.startDate);
    const eventEnd = new Date(newEvent.endDate);

    if (regStart >= regEnd) {
      alert('Registration Start Date must be before Registration End Date');
      return;
    }
    if (regEnd > eventStart) {
      alert('Registration End Date must be before or equal to Event Start Date');
      return;
    }
    if (eventStart >= eventEnd) {
      alert('Event Start Date must be before Event End Date');
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
      term: '',
      prize: '',
      roundsCount: '',
      tracksCount: '',
      registrationStartDate: '',
      registrationEndDate: '',
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
            term: '',
            prize: '',
            roundsCount: '',
            tracksCount: '',
            registrationStartDate: '',
            registrationEndDate: '',
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
                    <Button variant="link" size="sm" className="p-0 text-primary" onClick={() => navigate(`/coordinator/events/${event.id}`)}>
                      <Eye size={16} />
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
              <Form.Label>Term / Semester</Form.Label>
              <Form.Select
                value={newEvent.term}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    term: e.target.value
                  })
                }
              >
                <option value="">Select Term</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Fall">Fall</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prize Pool</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. $5000 or 50,000,000 VND"
                value={newEvent.prize}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    prize: e.target.value
                  })
                }
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Number of Rounds</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    placeholder="e.g. 3"
                    value={newEvent.roundsCount}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        roundsCount: e.target.value
                      })
                    }
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Number of Tracks</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    placeholder="e.g. 4"
                    value={newEvent.tracksCount}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        tracksCount: e.target.value
                      })
                    }
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Registration Start</Form.Label>
                  <Form.Control
                    type="date"
                    value={newEvent.registrationStartDate}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        registrationStartDate: e.target.value
                      })
                    }
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Registration End</Form.Label>
                  <Form.Control
                    type="date"
                    value={newEvent.registrationEndDate}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        registrationEndDate: e.target.value
                      })
                    }
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Event Start</Form.Label>
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
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Event End</Form.Label>
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
              </div>
            </div>

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
