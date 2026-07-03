import React, { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Form, Modal, Spinner, Table } from 'react-bootstrap';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { createTrack, deleteTrack, getEvents, getTracks, updateTrack } from '../../api/hackathonApi';

const CategoryManagement = () => {
  const [tracks, setTracks] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTrack, setEditingTrack] = useState(null);
  const [form, setForm] = useState({ eventId: '', name: '', description: '' });

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [trackData, eventData] = await Promise.all([
        getTracks({ size: 100, sort: 'createdAt,desc' }),
        getEvents({ size: 100, sort: 'createdAt,desc' }),
      ]);
      const eventList = eventData.content || eventData || [];
      setTracks(trackData.content || trackData || []);
      setEvents(eventList);
      if (!form.eventId && eventList[0]) setForm((prev) => ({ ...prev, eventId: eventList[0].id }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => {
    setEditingTrack(null);
    setForm({ eventId: events[0]?.id || '', name: '', description: '' });
    setShowModal(true);
  };

  const openEdit = (track) => {
    setEditingTrack(track);
    setForm({ eventId: track.eventId || '', name: track.name || '', description: track.description || '' });
    setShowModal(true);
  };

  const handleSaveTrack = async () => {
    if (!form.eventId || !form.name.trim()) {
      setError('Event and category name required');
      return;
    }
    try {
      if (editingTrack) {
        await updateTrack(editingTrack.id, { name: form.name.trim(), description: form.description?.trim() || null });
      } else {
        await createTrack({ eventId: form.eventId, name: form.name.trim(), description: form.description?.trim() || null });
      }
      setShowModal(false);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTrack = async (id) => {
    if (!window.confirm('Delete this category/track?')) return;
    try {
      await deleteTrack(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const eventName = (id) => events.find((e) => e.id === id)?.title || id;

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Category Management</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>FE Category maps to BE Track</div>
        </div>
        <Button variant="primary" className="d-flex align-items-center gap-2" onClick={openCreate} disabled={events.length === 0}>
          <Plus size={18} /> Add Category
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {events.length === 0 && !loading && <Alert variant="warning">Create an event before creating categories/tracks.</Alert>}

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {loading ? <div className="p-4 text-center"><Spinner animation="border" /></div> : (
          <div className="table-responsive">
            <Table className="mb-0" hover>
              <thead>
                <tr>
                  <th className="border-top-0 border-bottom">Category / Track Name</th>
                  <th className="border-top-0 border-bottom">Event</th>
                  <th className="border-top-0 border-bottom">Description</th>
                  <th className="border-top-0 border-bottom">Created</th>
                  <th className="border-top-0 border-bottom text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tracks.map((track) => (
                  <tr key={track.id}>
                    <td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{track.name}</td>
                    <td className="py-3"><Badge bg="secondary">{eventName(track.eventId)}</Badge></td>
                    <td className="py-3" style={{ color: 'var(--cf-text-secondary)' }}>{track.description || '-'}</td>
                    <td className="py-3">{track.createdAt ? new Date(track.createdAt).toLocaleString() : '-'}</td>
                    <td className="py-3 text-end">
                      <Button variant="link" size="sm" className="p-0 text-primary" onClick={() => openEdit(track)}><Edit size={16} /></Button>
                      <Button variant="link" size="sm" className="p-0 text-danger ms-3" onClick={() => handleDeleteTrack(track.id)}><Trash2 size={16} /></Button>
                    </td>
                  </tr>
                ))}
                {tracks.length === 0 && <tr><td colSpan="5" className="text-center py-4 text-muted">No categories/tracks</td></tr>}
              </tbody>
            </Table>
          </div>
        )}
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>{editingTrack ? 'Edit Category' : 'Create Category'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Event</Form.Label>
              <Form.Select value={form.eventId} disabled={Boolean(editingTrack)} onChange={(e) => setForm({ ...form, eventId: e.target.value })}>
                <option value="">Select event</option>
                {events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveTrack}>{editingTrack ? 'Update Category' : 'Create Category'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
