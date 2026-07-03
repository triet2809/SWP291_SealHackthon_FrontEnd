import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Modal, Row, Spinner, Table } from 'react-bootstrap';
import { ArrowLeft, Calendar, Plus, Target, Trash2, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { createRound, createTrack, deleteRound, deleteTrack, getEvent, getRounds, getTeams, getTracks } from '../../api/hackathonApi';

const pageItems = (data) => data?.content || data || [];

const EventDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [teams, setTeams] = useState([]);
  const [activeTab, setActiveTab] = useState('Rounds');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showRoundModal, setShowRoundModal] = useState(false);
  const [trackForm, setTrackForm] = useState({ name: '', description: '' });
  const [roundForm, setRoundForm] = useState({ trackId: '', name: '', sequenceNumber: '', submissionDeadline: '', topNToPromote: 5 });

  const loadData = async () => {
    setLoading(true); setError('');
    try {
      const [eventData, trackData] = await Promise.all([getEvent(id), getTracks({ eventId: id, size: 200 })]);
      const trackList = pageItems(trackData);
      setEvent(eventData); setTracks(trackList);
      const roundLists = await Promise.all(trackList.map((track) => getRounds({ trackId: track.id, size: 200 }).then(pageItems).catch(() => [])));
      const allRounds = roundLists.flat().sort((a, b) => (a.sequenceNumber || 0) - (b.sequenceNumber || 0));
      setRounds(allRounds);
      const teamLists = await Promise.all(trackList.map((track) => getTeams({ trackId: track.id, size: 500 }).then(pageItems).catch(() => [])));
      setTeams(teamLists.flat());
      if (!roundForm.trackId && trackList[0]?.id) setRoundForm((prev) => ({ ...prev, trackId: trackList[0].id }));
    } catch (e) { setError(e.message || 'Cannot load event'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [id]);

  const trackMap = useMemo(() => Object.fromEntries(tracks.map((t) => [t.id, t])), [tracks]);
  const teamsByTrack = useMemo(() => teams.reduce((acc, team) => { acc[team.trackId] = (acc[team.trackId] || 0) + 1; return acc; }, {}), [teams]);

  const handleCreateTrack = async () => {
    if (!trackForm.name.trim()) { setError('Track name required'); return; }
    try { await createTrack({ eventId: id, name: trackForm.name.trim(), description: trackForm.description?.trim() || null }); setTrackForm({ name: '', description: '' }); setShowTrackModal(false); await loadData(); }
    catch (e) { setError(e.message || 'Create track failed'); }
  };

  const handleCreateRound = async () => {
    if (!roundForm.trackId || !roundForm.name.trim() || !roundForm.submissionDeadline || !roundForm.topNToPromote) { setError('Round fields required'); return; }
    try {
      await createRound({
        trackId: roundForm.trackId,
        name: roundForm.name.trim(),
        sequenceNumber: roundForm.sequenceNumber ? Number(roundForm.sequenceNumber) : null,
        submissionDeadline: `${roundForm.submissionDeadline}:00`,
        topNToPromote: Number(roundForm.topNToPromote),
      });
      setRoundForm((prev) => ({ ...prev, name: '', sequenceNumber: '', submissionDeadline: '', topNToPromote: 5 }));
      setShowRoundModal(false); await loadData();
    } catch (e) { setError(e.message || 'Create round failed'); }
  };

  const removeTrack = async (trackId) => { if (!window.confirm('Delete this track? Event must be draft.')) return; try { await deleteTrack(trackId); await loadData(); } catch (e) { setError(e.message || 'Delete track failed'); } };
  const removeRound = async (roundId) => { if (!window.confirm('Delete this round? Event must be draft.')) return; try { await deleteRound(roundId); await loadData(); } catch (e) { setError(e.message || 'Delete round failed'); } };

  if (loading) return <div className="py-4 text-center"><Spinner size="sm" className="me-2" />Loading event...</div>;

  return (
    <div className="py-2">
      <div className="d-flex align-items-center gap-3 mb-4"><Button variant="link" className="p-0 text-muted" onClick={() => navigate('/coordinator/events')}><ArrowLeft size={24} /></Button><div><h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>{event?.title || 'Event'}</h1><div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>{event?.description || 'No description'}</div></div><Badge bg="success" className="ms-auto px-3 py-2 fs-6">{event?.status}</Badge></div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="g-4 mb-4"><Col md={3}><Card className="h-100" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><Card.Body className="d-flex align-items-center gap-3 p-3"><Calendar size={24} className="text-primary" /><div><div className="text-muted small fw-medium">Created</div><div className="fw-bold">{event?.createdAt ? new Date(event.createdAt).toLocaleDateString() : '-'}</div></div></Card.Body></Card></Col><Col md={3}><Card className="h-100" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><Card.Body className="d-flex align-items-center gap-3 p-3"><Target size={24} className="text-warning" /><div><div className="text-muted small fw-medium">Tracks</div><div className="fw-bold">{tracks.length}</div></div></Card.Body></Card></Col><Col md={3}><Card className="h-100" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><Card.Body className="d-flex align-items-center gap-3 p-3"><Calendar size={24} className="text-info" /><div><div className="text-muted small fw-medium">Rounds</div><div className="fw-bold">{rounds.length}</div></div></Card.Body></Card></Col><Col md={3}><Card className="h-100" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><Card.Body className="d-flex align-items-center gap-3 p-3"><Users size={24} className="text-success" /><div><div className="text-muted small fw-medium">Teams</div><div className="fw-bold">{teams.length}</div></div></Card.Body></Card></Col></Row>
      <div className="d-flex gap-4 mb-4 border-bottom pb-2"><div className={`fw-medium pb-2 ${activeTab === 'Rounds' ? 'text-primary border-bottom border-primary border-2' : 'text-muted'}`} onClick={() => setActiveTab('Rounds')} style={{ cursor: 'pointer' }}>Event Rounds & Tracks</div><div className={`fw-medium pb-2 ${activeTab === 'Teams' ? 'text-primary border-bottom border-primary border-2' : 'text-muted'}`} onClick={() => setActiveTab('Teams')} style={{ cursor: 'pointer' }}>Participating Teams</div></div>
      {activeTab === 'Rounds' && <><Card className="mb-4" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)' }}><div className="p-3 border-bottom d-flex justify-content-between align-items-center"><h5 className="fw-bold mb-0">Tracks</h5><Button size="sm" onClick={() => setShowTrackModal(true)}><Plus size={16} /> Add Track</Button></div><Table className="mb-0" hover><thead><tr><th>Name</th><th>Description</th><th>Teams</th><th className="text-end">Actions</th></tr></thead><tbody>{tracks.length ? tracks.map((t) => <tr key={t.id}><td className="fw-bold">{t.name}</td><td>{t.description || '-'}</td><td>{teamsByTrack[t.id] || 0}</td><td className="text-end"><Button variant="link" size="sm" className="p-0 text-danger" onClick={() => removeTrack(t.id)}><Trash2 size={16} /></Button></td></tr>) : <tr><td colSpan="4" className="text-center text-muted py-3">No tracks</td></tr>}</tbody></Table></Card><Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)' }}><div className="p-3 border-bottom d-flex justify-content-between align-items-center"><h5 className="fw-bold mb-0">Rounds</h5><Button size="sm" disabled={!tracks.length} onClick={() => setShowRoundModal(true)}><Plus size={16} /> Add Round</Button></div><Table className="mb-0" hover><thead><tr><th>Round</th><th>Track</th><th>Seq</th><th>Deadline</th><th>Top N</th><th className="text-end">Actions</th></tr></thead><tbody>{rounds.length ? rounds.map((r) => <tr key={r.id}><td className="fw-bold">{r.name}</td><td>{trackMap[r.trackId]?.name || r.trackId}</td><td>{r.sequenceNumber}</td><td>{r.submissionDeadline ? new Date(r.submissionDeadline).toLocaleString() : '-'}</td><td>{r.topNToPromote}</td><td className="text-end"><Button variant="link" size="sm" className="p-0 text-danger" onClick={() => removeRound(r.id)}><Trash2 size={16} /></Button></td></tr>) : <tr><td colSpan="6" className="text-center text-muted py-3">No rounds</td></tr>}</tbody></Table></Card></>}
      {activeTab === 'Teams' && <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)' }}><div className="p-3 border-bottom"><h5 className="fw-bold mb-0">Registered Teams</h5></div><Table className="mb-0" hover><thead><tr><th>Team</th><th>Track</th><th>Members</th><th>Status</th></tr></thead><tbody>{teams.length ? teams.map((team) => <tr key={team.id}><td className="fw-bold">{team.name}</td><td>{trackMap[team.trackId]?.name || team.trackId}</td><td>{team.members?.length || 0}/5</td><td><Badge bg={team.status === 'active' ? 'success' : 'danger'}>{team.status}</Badge></td></tr>) : <tr><td colSpan="4" className="text-center text-muted py-3">No teams</td></tr>}</tbody></Table></Card>}
      <Modal show={showTrackModal} onHide={() => setShowTrackModal(false)}><Modal.Header closeButton><Modal.Title>Create Track</Modal.Title></Modal.Header><Modal.Body><Form.Group className="mb-3"><Form.Label>Name</Form.Label><Form.Control value={trackForm.name} onChange={(e) => setTrackForm({ ...trackForm, name: e.target.value })} /></Form.Group><Form.Group><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={3} value={trackForm.description} onChange={(e) => setTrackForm({ ...trackForm, description: e.target.value })} /></Form.Group></Modal.Body><Modal.Footer><Button variant="secondary" onClick={() => setShowTrackModal(false)}>Cancel</Button><Button onClick={handleCreateTrack}>Create</Button></Modal.Footer></Modal>
      <Modal show={showRoundModal} onHide={() => setShowRoundModal(false)}><Modal.Header closeButton><Modal.Title>Create Round</Modal.Title></Modal.Header><Modal.Body><Form.Group className="mb-3"><Form.Label>Track</Form.Label><Form.Select value={roundForm.trackId} onChange={(e) => setRoundForm({ ...roundForm, trackId: e.target.value })}>{tracks.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</Form.Select></Form.Group><Form.Group className="mb-3"><Form.Label>Name</Form.Label><Form.Control value={roundForm.name} onChange={(e) => setRoundForm({ ...roundForm, name: e.target.value })} /></Form.Group><Row><Col><Form.Group className="mb-3"><Form.Label>Sequence</Form.Label><Form.Control type="number" min="1" value={roundForm.sequenceNumber} onChange={(e) => setRoundForm({ ...roundForm, sequenceNumber: e.target.value })} placeholder="auto" /></Form.Group></Col><Col><Form.Group className="mb-3"><Form.Label>Top N</Form.Label><Form.Control type="number" min="1" value={roundForm.topNToPromote} onChange={(e) => setRoundForm({ ...roundForm, topNToPromote: e.target.value })} /></Form.Group></Col></Row><Form.Group><Form.Label>Submission Deadline</Form.Label><Form.Control type="datetime-local" value={roundForm.submissionDeadline} onChange={(e) => setRoundForm({ ...roundForm, submissionDeadline: e.target.value })} /></Form.Group></Modal.Body><Modal.Footer><Button variant="secondary" onClick={() => setShowRoundModal(false)}>Cancel</Button><Button onClick={handleCreateRound}>Create</Button></Modal.Footer></Modal>
    </div>
  );
};

export default EventDetails;
