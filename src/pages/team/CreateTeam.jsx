import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { Save, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createTeam, getEvents, getTracks } from '../../api/hackathonApi';
import { getUsers } from '../../api/userApi';
import { getStoredUser } from '../../utils/authUser';

const pageItems = (data) => data?.content || data || [];

const CreateTeam = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ eventId: '', trackId: '', name: '' });
  useEffect(() => { (async () => { try { const ev = pageItems(await getEvents({ size: 100 })); setEvents(ev); const eventId = ev[0]?.id || ''; const tr = pageItems(await getTracks(eventId ? { eventId, size: 100 } : { size: 100 })); setTracks(tr); const approved = await getUsers({ status: 'approved' }); const me = getStoredUser(); setUsers((approved.value || []).filter((u) => u.id !== me?.id)); setForm((f) => ({ ...f, eventId, trackId: tr[0]?.id || '' })); } catch (e) { setError(e.message || 'Cannot load events/tracks'); } finally { setLoading(false); } })(); }, []);
  const changeEvent = async (e) => { const eventId = e.target.value; setForm((f) => ({ ...f, eventId, trackId: '' })); try { const tr = pageItems(await getTracks({ eventId, size: 100 })); setTracks(tr); setForm((f) => ({ ...f, trackId: tr[0]?.id || '' })); } catch (err) { setError(err.message || 'Cannot load tracks'); } };
  const submit = async (e) => { e.preventDefault(); setSaving(true); setError(''); setSuccess(''); try { const team = await createTeam({ trackId: form.trackId, name: form.name.trim(), memberUserIds: selectedMembers }); setSuccess(`Team ${team.name} created.`); setTimeout(() => navigate('/team/dashboard'), 700); } catch (err) { setError(err.message || 'Create team failed'); } finally { setSaving(false); } };
  if (loading) return <div className="py-4 text-center"><Spinner size="sm" className="me-2" />Loading...</div>;
  return <div className="py-2"><div className="d-flex justify-content-between align-items-center mb-4"><div><h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Create a Team</h1><div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Create backend team. You become leader automatically.</div></div></div>{error && <Alert variant="danger">{error}</Alert>}{success && <Alert variant="success">{success}</Alert>}<Form onSubmit={submit}><Row className="g-4"><Col lg={5}><Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><Card.Body className="p-4"><h5 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: 'var(--cf-text-primary)' }}><Users size={20} className="text-primary" /> Team Information</h5><Form.Group className="mb-3"><Form.Label>Event</Form.Label><Form.Select name="eventId" value={form.eventId} onChange={changeEvent} required>{events.map((event) => <option key={event.id} value={event.id}>{event.name}</option>)}</Form.Select></Form.Group><Form.Group className="mb-3"><Form.Label>Track</Form.Label><Form.Select name="trackId" value={form.trackId} onChange={(e) => setForm((f) => ({ ...f, trackId: e.target.value }))} required>{tracks.map((track) => <option key={track.id} value={track.id}>{track.name}</option>)}</Form.Select></Form.Group><Form.Group className="mb-3"><Form.Label>Team Name *</Form.Label><Form.Control type="text" name="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required placeholder="Enter team name" /></Form.Group><Button variant="primary" type="submit" disabled={saving || !form.trackId || !form.name.trim()} className="d-flex align-items-center gap-2"><Save size={16} /> {saving ? 'Creating…' : 'Create Team'}</Button></Card.Body></Card></Col><Col lg={7}><Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><Card.Body className="p-4"><h5 className="fw-bold mb-3">Members</h5><Alert variant="info">Self-created team needs 3-5 members including you. Chọn ít nhất 2 teammate approved.</Alert><Form.Group><Form.Label>Approved teammates</Form.Label><Form.Select multiple value={selectedMembers} onChange={(e) => setSelectedMembers(Array.from(e.target.selectedOptions).map((o) => o.value))} style={{ minHeight: 240 }}>{users.map((u) => <option key={u.id} value={u.id}>{u.fullName || u.email} — {u.email}</option>)}</Form.Select><div className="text-muted small mt-2">Selected: {selectedMembers.length}. Total team size: {selectedMembers.length + 1}.</div></Form.Group></Card.Body></Card></Col></Row></Form></div>;
};

export default CreateTeam;
