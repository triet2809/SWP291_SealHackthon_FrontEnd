import React, { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Form, Modal, Spinner, Table } from 'react-bootstrap';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { changeEventStatus, createEvent, deleteEvent, getEvents, updateEvent } from '../../api/hackathonApi';

const statuses = ['draft', 'published', 'ongoing', 'completed', 'cancelled'];
const pageItems = (data) => data?.content || data || [];
const badge = (status) => ({ draft: 'warning', published: 'info', ongoing: 'success', completed: 'secondary', cancelled: 'danger' }[status] || 'secondary');

const EventManagement = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', status: 'draft' });

  const loadEvents = async () => {
    setLoading(true); setError('');
    try { setEvents(pageItems(await getEvents({ size: 200, sort: 'createdAt,desc' }))); }
    catch (e) { setError(e.message || 'Cannot load events'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadEvents(); }, []);

  const openCreate = () => { setEditingEvent(null); setForm({ title: '', description: '', status: 'draft' }); setShowModal(true); };
  const openEdit = (event) => { setEditingEvent(event); setForm({ title: event.title || '', description: event.description || '', status: event.status || 'draft' }); setShowModal(true); };

  const handleSaveEvent = async () => {
    if (!form.title.trim()) { setError('Event title required'); return; }
    setSaving(true); setError('');
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, { title: form.title.trim(), description: form.description?.trim() || null });
        if (form.status !== editingEvent.status) await changeEventStatus(editingEvent.id, form.status);
      } else {
        const created = await createEvent({ title: form.title.trim(), description: form.description?.trim() || null });
        if (form.status !== 'draft') await changeEventStatus(created.id, form.status);
      }
      setShowModal(false); await loadEvents();
    } catch (e) { setError(e.message || 'Save event failed'); }
    finally { setSaving(false); }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try { await deleteEvent(id); await loadEvents(); }
    catch (e) { setError(e.message || 'Delete event failed'); }
  };

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Event Management</h1><div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Create and configure hackathon events from backend</div></div>
        <Button variant="primary" className="d-flex align-items-center gap-2" onClick={openCreate}><Plus size={18} /> New Event</Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="table-responsive"><Table className="mb-0" hover><thead><tr><th>Event Name</th><th>Description</th><th>Created</th><th>Status</th><th className="text-end">Actions</th></tr></thead><tbody>
          {loading ? <tr><td colSpan="5" className="text-center py-4"><Spinner size="sm" className="me-2" />Loading...</td></tr> : events.length === 0 ? <tr><td colSpan="5" className="text-center py-4 text-muted">No events found</td></tr> : events.map((event) => <tr key={event.id}>
            <td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{event.title}</td>
            <td className="py-3 text-muted" style={{ maxWidth: 420 }}>{event.description || '-'}</td>
            <td className="py-3">{event.createdAt ? new Date(event.createdAt).toLocaleString() : '-'}</td>
            <td className="py-3"><Badge bg={badge(event.status)} text={event.status === 'draft' ? 'dark' : 'light'}>{event.status}</Badge></td>
            <td className="py-3 text-end"><Button variant="link" size="sm" className="p-0 text-primary" onClick={() => navigate(`/coordinator/events/${event.id}`)}><Eye size={16} /></Button><Button variant="link" size="sm" className="p-0 text-primary ms-3" onClick={() => openEdit(event)}><Edit size={16} /></Button><Button variant="link" size="sm" className="p-0 text-danger ms-3" onClick={() => handleDeleteEvent(event.id)}><Trash2 size={16} /></Button></td>
          </tr>)}
        </tbody></Table></div>
      </Card>
      <Modal show={showModal} onHide={() => setShowModal(false)}><Modal.Header closeButton><Modal.Title>{editingEvent ? 'Edit Event' : 'Create Event'}</Modal.Title></Modal.Header><Modal.Body><Form>
        <Form.Group className="mb-3"><Form.Label>Event Title</Form.Label><Form.Control value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Form.Group>
        <Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Form.Group>
        <Form.Group><Form.Label>Status</Form.Label><Form.Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{statuses.map((s) => <option key={s} value={s}>{s}</option>)}</Form.Select></Form.Group>
      </Form></Modal.Body><Modal.Footer><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button><Button variant="primary" disabled={saving} onClick={handleSaveEvent}>{saving ? 'Saving…' : 'Save Event'}</Button></Modal.Footer></Modal>
    </div>
  );
};

export default EventManagement;
