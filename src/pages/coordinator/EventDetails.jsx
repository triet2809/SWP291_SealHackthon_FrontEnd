import React, { useEffect, useState } from 'react';
import { Card, Table, Badge, Button, Row, Col, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { ArrowLeft, Calendar, Users, Target, Plus, Eye, CheckCircle, Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import TrackGeneratorModal from '../../components/coordinator/TrackGeneratorModal';
import {
  getEvent, getTracks, getRounds, getTeams, createRound, createTrack,
} from '../../api/hackathonApi';

const listOf = (data) => data?.content || data || [];

const EventDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [event, setEvent] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [teams, setTeams] = useState([]);

  const [activeTab, setActiveTab] = useState('Rounds'); // 'Rounds' | 'Teams'

  const [showRoundModal, setShowRoundModal] = useState(false);
  const [savingRound, setSavingRound] = useState(false);
  const [newRound, setNewRound] = useState({ name: '', trackId: '', submissionDeadline: '', sequenceNumber: 1, topNToPromote: 5 });

  const [showGeneratorModal, setShowGeneratorModal] = useState(false);

  const trackName = (trackId) => tracks.find((t) => t.id === trackId)?.name || 'Unassigned';

  const loadAll = async () => {
    try {
      setLoading(true);
      setError('');
      const [ev, tk, tm] = await Promise.all([
        getEvent(id),
        getTracks({ eventId: id, size: 100 }),
        getTeams({ eventId: id, size: 100 }),
      ]);
      setEvent(ev);
      const trackList = listOf(tk);
      setTracks(trackList);
      setTeams(listOf(tm));
      // Rounds are per-track; aggregate across all tracks in this event.
      const roundResults = await Promise.all(
        trackList.map((t) => getRounds({ trackId: t.id, size: 100 }).then(listOf).catch(() => []))
      );
      setRounds(roundResults.flat());
    } catch (err) {
      setError(err.message || 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSaveRound = async () => {
    if (!newRound.name || !newRound.trackId || !newRound.submissionDeadline) {
      alert('Please fill round name, track, and submission deadline');
      return;
    }
    try {
      setSavingRound(true);
      setError('');
      await createRound({
        trackId: newRound.trackId,
        name: newRound.name,
        sequenceNumber: Number(newRound.sequenceNumber) || 1,
        submissionDeadline: new Date(newRound.submissionDeadline).toISOString().slice(0, 19),
        topNToPromote: Number(newRound.topNToPromote) || 1,
      });
      setNewRound({ name: '', trackId: '', submissionDeadline: '', sequenceNumber: 1, topNToPromote: 5 });
      setShowRoundModal(false);
      await loadAll();
    } catch (err) {
      setError(err.message || 'Failed to create round');
    } finally {
      setSavingRound(false);
    }
  };

  // Track generator -> creates BE tracks for this event (one per name).
  // Team distribution has no BE endpoint; teams get a trackId when created (BE gap).
  const handleGenerateTracks = async (category, trackNames) => {
    try {
      setError('');
      await Promise.all(
        trackNames.filter(Boolean).map((name) => createTrack({ eventId: id, name, description: '' }))
      );
      await loadAll();
      alert(`Created ${trackNames.filter(Boolean).length} tracks!`);
    } catch (err) {
      setError(err.message || 'Failed to create tracks');
    }
  };

  if (loading) {
    return (
      <div className="py-5 d-flex justify-content-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const status = (event?.status || 'draft').toLowerCase();

  return (
    <div className="py-2">
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      <div className="d-flex align-items-center gap-3 mb-4">
        <Button variant="link" className="p-0 text-muted" onClick={() => navigate('/coordinator/events')}>
          <ArrowLeft size={24} />
        </Button>
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>{event?.title}</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>{event?.description}</div>
        </div>
        <Badge bg={status === 'active' ? 'success' : status === 'draft' ? 'warning' : 'secondary'} text={status === 'draft' ? 'dark' : 'light'} className="ms-auto px-3 py-2 fs-6">{event?.status || 'draft'}</Badge>
      </div>

      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="h-100" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="d-flex align-items-center gap-3 p-3">
              <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary" style={{ width: '40px', height: '40px' }}>
                <Calendar size={20} />
              </div>
              <div>
                <div className="text-muted small fw-medium">Created</div>
                <div className="fw-bold">{event?.createdAt ? new Date(event.createdAt).toLocaleDateString() : '—'}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="d-flex align-items-center gap-3 p-3">
              <div className="d-flex align-items-center justify-content-center rounded-circle bg-info bg-opacity-10 text-info" style={{ width: '40px', height: '40px' }}>
                <Users size={20} />
              </div>
              <div>
                <div className="text-muted small fw-medium">Participants</div>
                <div className="fw-bold">{teams.length} Teams</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="d-flex align-items-center gap-3 p-3">
              <div className="d-flex align-items-center justify-content-center rounded-circle bg-warning bg-opacity-10 text-warning" style={{ width: '40px', height: '40px' }}>
                <Target size={20} />
              </div>
              <div>
                <div className="text-muted small fw-medium">Rounds / Tracks</div>
                <div className="fw-bold">{rounds.length} / {tracks.length}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <div className="d-flex gap-4 mb-4 border-bottom pb-2">
        <div 
          className={`cursor-pointer fw-medium pb-2 ${activeTab === 'Rounds' ? 'text-primary border-bottom border-primary border-2' : 'text-muted'}`}
          onClick={() => setActiveTab('Rounds')}
          style={{ cursor: 'pointer' }}
        >
          Event Rounds & Tracks
        </div>
        <div 
          className={`cursor-pointer fw-medium pb-2 ${activeTab === 'Teams' ? 'text-primary border-bottom border-primary border-2' : 'text-muted'}`}
          onClick={() => setActiveTab('Teams')}
          style={{ cursor: 'pointer' }}
        >
          Participating Teams
        </div>
      </div>

      {activeTab === 'Rounds' && (
        <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">Rounds</h5>
            <div className="d-flex gap-2">
              <Button variant="outline-primary" size="sm" onClick={() => setShowGeneratorModal(true)}>
                Create Tracks
              </Button>
              <Button variant="primary" size="sm" className="d-flex align-items-center gap-2" onClick={() => setShowRoundModal(true)} disabled={tracks.length === 0}>
                <Plus size={16} /> Add Round
              </Button>
            </div>
          </div>
          <div className="table-responsive">
            <Table className="mb-0 align-middle" hover>
              <thead>
                <tr>
                  <th className="border-top-0 border-bottom text-muted py-3">Round Name</th>
                  <th className="border-top-0 border-bottom text-muted py-3">Track</th>
                  <th className="border-top-0 border-bottom text-muted py-3">Sequence</th>
                  <th className="border-top-0 border-bottom text-muted py-3">Deadline</th>
                  <th className="border-top-0 border-bottom text-muted py-3">Promote Top</th>
                </tr>
              </thead>
              <tbody>
                {rounds.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-4 text-muted">No rounds yet.</td></tr>
                ) : rounds.map((round) => (
                  <tr key={round.id}>
                    <td className="fw-bold py-3" style={{ color: 'var(--cf-text-primary)' }}>{round.name}</td>
                    <td className="py-3"><Badge bg="info" text="dark">{trackName(round.trackId)}</Badge></td>
                    <td className="py-3 text-muted">{round.sequenceNumber}</td>
                    <td className="py-3 text-muted">{round.submissionDeadline ? new Date(round.submissionDeadline).toLocaleString() : '—'}</td>
                    <td className="py-3 text-muted">{round.topNToPromote}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}

      {activeTab === 'Teams' && (
        <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div className="p-3 border-bottom">
            <h5 className="fw-bold mb-0">Registered Teams</h5>
          </div>
          <div className="table-responsive">
            <Table className="mb-0 align-middle" hover>
              <thead>
                <tr>
                  <th className="border-top-0 border-bottom text-muted py-3">Team Name</th>
                  <th className="border-top-0 border-bottom text-muted py-3">Track</th>
                  <th className="border-top-0 border-bottom text-muted py-3 text-center">Size</th>
                  <th className="border-top-0 border-bottom text-muted py-3 text-end">Status</th>
                </tr>
              </thead>
              <tbody>
                {teams.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-4 text-muted">No teams yet.</td></tr>
                ) : teams.map((team) => (
                  <tr key={team.id}>
                    <td className="fw-bold py-3" style={{ color: 'var(--cf-text-primary)' }}>{team.name}</td>
                    <td className="py-3"><Badge bg="secondary">{trackName(team.trackId)}</Badge></td>
                    <td className="py-3 text-center">{team.members?.length || 0}</td>
                    <td className="py-3 text-end">
                      <Badge bg={(team.status || '').toLowerCase() === 'disqualified' ? 'danger' : 'success'}>{team.status || 'active'}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}

      {/* Add Round Modal */}
      <Modal show={showRoundModal} onHide={() => setShowRoundModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Round</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Track</Form.Label>
              <Form.Select value={newRound.trackId} onChange={(e) => setNewRound({ ...newRound, trackId: e.target.value })}>
                <option value="">Select track</option>
                {tracks.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Round Name</Form.Label>
              <Form.Control type="text" value={newRound.name} onChange={(e) => setNewRound({...newRound, name: e.target.value})} />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sequence Number</Form.Label>
                  <Form.Control type="number" min="1" value={newRound.sequenceNumber} onChange={(e) => setNewRound({...newRound, sequenceNumber: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Promote Top N</Form.Label>
                  <Form.Control type="number" min="1" value={newRound.topNToPromote} onChange={(e) => setNewRound({...newRound, topNToPromote: e.target.value})} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Submission Deadline</Form.Label>
              <Form.Control type="datetime-local" value={newRound.submissionDeadline} onChange={(e) => setNewRound({...newRound, submissionDeadline: e.target.value})} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRoundModal(false)} disabled={savingRound}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveRound} disabled={savingRound}>{savingRound ? 'Saving...' : 'Save Round'}</Button>
        </Modal.Footer>
      </Modal>

      {/* Track Generator Modal */}
      <TrackGeneratorModal
        show={showGeneratorModal}
        onHide={() => setShowGeneratorModal(false)}
        teams={teams}
        onGenerate={handleGenerateTracks}
      />
    </div>
  );
};

export default EventDetails;
