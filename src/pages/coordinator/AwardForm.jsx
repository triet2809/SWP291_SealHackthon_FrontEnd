import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { ArrowLeft, DollarSign, Tag, Trophy, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPrize, getEvents, getPrize, getTeams, getTracks, updatePrize } from '../../api/hackathonApi';

const pageItems = (data) => data?.content || data || [];
const emptyAward = { eventId: '', trackId: '', teamId: '', name: '', prizeAmount: '', description: '', awardedAt: '' };

const AwardForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [award, setAward] = useState(emptyAward);
  const [events, setEvents] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { (async () => {
    setLoading(true); setError('');
    try {
      const [eventData, trackData, teamData, prizeData] = await Promise.all([getEvents({ size: 500 }), getTracks({ size: 500 }), getTeams({ size: 500 }), isEditing ? getPrize(id) : Promise.resolve(null)]);
      const eventList = pageItems(eventData); const trackList = pageItems(trackData); const teamList = pageItems(teamData);
      setEvents(eventList); setTracks(trackList); setTeams(teamList);
      if (prizeData) setAward({ eventId: prizeData.eventId || '', trackId: prizeData.trackId || '', teamId: prizeData.teamId || '', name: prizeData.name || '', prizeAmount: prizeData.prizeAmount ?? '', description: prizeData.description || '', awardedAt: prizeData.awardedAt ? prizeData.awardedAt.slice(0, 16) : '' });
      else setAward((prev) => ({ ...prev, eventId: eventList[0]?.id || '' }));
    } catch (e) { setError(e.message || 'Cannot load award form'); }
    finally { setLoading(false); }
  })(); }, [id, isEditing]);

  const filteredTracks = award.eventId ? tracks.filter((t) => t.eventId === award.eventId) : tracks;
  const filteredTeams = award.trackId ? teams.filter((t) => t.trackId === award.trackId) : teams;

  const handleChange = (e) => { const { name, value } = e.target; setAward((prev) => ({ ...prev, [name]: value })); };
  const handleSave = async () => {
    if (!award.eventId || !award.name) { setError('Event and award name required'); return; }
    setSaving(true); setError('');
    try {
      const payload = { eventId: award.eventId, trackId: award.trackId || null, teamId: award.teamId || null, name: award.name, prizeAmount: award.prizeAmount === '' ? null : Number(award.prizeAmount), description: award.description || null, awardedAt: award.awardedAt ? `${award.awardedAt}:00` : null };
      if (isEditing) await updatePrize(id, payload); else await createPrize(payload);
      navigate('/coordinator/awards');
    } catch (e) { setError(e.message || 'Save award failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="py-4 text-center"><Spinner size="sm" className="me-2" />Loading award...</div>;

  return (
    <div className="py-2">
      <div className="d-flex align-items-center gap-3 mb-4"><Button variant="link" className="p-0 text-muted" onClick={() => navigate('/coordinator/awards')}><ArrowLeft size={24} /></Button><div><h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>{isEditing ? 'Edit Award' : 'Create New Award'}</h1><div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>{isEditing ? 'Update prize details and assign winners' : 'Configure a new prize pool'}</div></div></div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="justify-content-center"><Col lg={8}><Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><Card.Body className="p-4 p-md-5"><Form><div className="mb-4"><h5 className="fw-bold mb-3 border-bottom pb-2">Basic Information</h5><Form.Group className="mb-3"><Form.Label className="fw-medium d-flex align-items-center gap-2"><Trophy size={16} className="text-warning"/> Award Name</Form.Label><Form.Control type="text" name="name" placeholder="e.g. Grand Prize Winner" value={award.name} onChange={handleChange} /></Form.Group><Row><Col md={6}><Form.Group className="mb-3"><Form.Label className="fw-medium d-flex align-items-center gap-2"><DollarSign size={16} className="text-success"/> Prize Amount</Form.Label><Form.Control type="number" min="0" step="0.01" name="prizeAmount" placeholder="10000" value={award.prizeAmount} onChange={handleChange} /></Form.Group></Col><Col md={6}><Form.Group className="mb-3"><Form.Label className="fw-medium d-flex align-items-center gap-2"><Tag size={16} className="text-info"/> Event</Form.Label><Form.Select name="eventId" value={award.eventId} onChange={(e) => setAward({ ...award, eventId: e.target.value, trackId: '', teamId: '' })}>{events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}</Form.Select></Form.Group></Col></Row><Form.Group><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={3} name="description" value={award.description} onChange={handleChange} /></Form.Group></div><div className="mb-4"><h5 className="fw-bold mb-3 border-bottom pb-2">Assignment</h5><Row><Col md={6}><Form.Group className="mb-3"><Form.Label>Track</Form.Label><Form.Select name="trackId" value={award.trackId} onChange={(e) => setAward({ ...award, trackId: e.target.value, teamId: '' })}><option value="">Overall event prize</option>{filteredTracks.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</Form.Select></Form.Group></Col><Col md={6}><Form.Group className="mb-3"><Form.Label className="fw-medium d-flex align-items-center gap-2"><Users size={16} className="text-secondary"/> Winner Team</Form.Label><Form.Select name="teamId" value={award.teamId} onChange={handleChange}><option value="">Unassigned</option>{filteredTeams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</Form.Select></Form.Group></Col></Row><Form.Group><Form.Label>Awarded At</Form.Label><Form.Control type="datetime-local" name="awardedAt" value={award.awardedAt} onChange={handleChange} /></Form.Group></div><div className="d-flex justify-content-end gap-3 mt-5 pt-3 border-top"><Button variant="secondary" onClick={() => navigate('/coordinator/awards')}>Cancel</Button><Button variant="primary" disabled={saving} onClick={handleSave}>{saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Award'}</Button></div></Form></Card.Body></Card></Col></Row>
    </div>
  );
};

export default AwardForm;
