import React, { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Form, Modal, Spinner, Table } from 'react-bootstrap';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { createRound, deleteRound, getRounds, getTracks, updateRound } from '../../api/hackathonApi';

const toLocalInput = (value) => value ? String(value).slice(0, 16) : '';
const toApiDate = (value) => value ? new Date(value).toISOString().slice(0, 19) : null;

const RoundManagement = () => {
  const [rounds, setRounds] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRound, setEditingRound] = useState(null);
  const [form, setForm] = useState({ trackId: '', name: '', sequenceNumber: 1, submissionDeadline: '', topNToPromote: 1 });

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [roundData, trackData] = await Promise.all([
        getRounds({ size: 100, sort: 'sequenceNumber,asc' }),
        getTracks({ size: 100, sort: 'createdAt,desc' }),
      ]);
      const trackList = trackData.content || trackData || [];
      setRounds(roundData.content || roundData || []);
      setTracks(trackList);
      if (!form.trackId && trackList[0]) setForm((prev) => ({ ...prev, trackId: trackList[0].id }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => {
    setEditingRound(null);
    setForm({ trackId: tracks[0]?.id || '', name: '', sequenceNumber: rounds.length + 1, submissionDeadline: '', topNToPromote: 1 });
    setShowModal(true);
  };

  const openEdit = (round) => {
    setEditingRound(round);
    setForm({
      trackId: round.trackId || '',
      name: round.name || '',
      sequenceNumber: round.sequenceNumber || 1,
      submissionDeadline: toLocalInput(round.submissionDeadline),
      topNToPromote: round.topNToPromote || 1,
    });
    setShowModal(true);
  };

  const handleSaveRound = async () => {
    if (!form.trackId || !form.name.trim() || !form.submissionDeadline) {
      setError('Track, round name and submission deadline required');
      return;
    }
    const payload = {
      name: form.name.trim(),
      sequenceNumber: Number(form.sequenceNumber),
      submissionDeadline: toApiDate(form.submissionDeadline),
      topNToPromote: Number(form.topNToPromote),
    };
    try {
      if (editingRound) {
        await updateRound(editingRound.id, payload);
      } else {
        await createRound({ ...payload, trackId: form.trackId });
      }
      setShowModal(false);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteRound = async (id) => {
    if (!window.confirm('Delete this round?')) return;
    try {
      await deleteRound(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const trackName = (id) => tracks.find((t) => t.id === id)?.name || id;

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Round Management</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Configure track rounds and promotion rules</div>
        </div>
        <Button variant="primary" className="d-flex align-items-center gap-2" onClick={openCreate} disabled={tracks.length === 0}>
          <Plus size={18} /> Add Round
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {tracks.length === 0 && !loading && <Alert variant="warning">Create a category/track before creating rounds.</Alert>}

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {loading ? <div className="p-4 text-center"><Spinner animation="border" /></div> : (
          <div className="table-responsive">
            <Table className="mb-0" hover>
              <thead>
                <tr>
                  <th className="border-top-0 border-bottom">Round Name</th>
                  <th className="border-top-0 border-bottom">Track</th>
                  <th className="border-top-0 border-bottom">Sequence</th>
                  <th className="border-top-0 border-bottom">Submission Deadline</th>
                  <th className="border-top-0 border-bottom">Top N Promote</th>
                  <th className="border-top-0 border-bottom text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rounds.map((round) => (
                  <tr key={round.id}>
                    <td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{round.name}</td>
                    <td className="py-3"><Badge bg="secondary">{trackName(round.trackId)}</Badge></td>
                    <td className="py-3">{round.sequenceNumber}</td>
                    <td className="py-3">{round.submissionDeadline ? new Date(round.submissionDeadline).toLocaleString() : '-'}</td>
                    <td className="py-3">{round.topNToPromote}</td>
                    <td className="py-3 text-end">
                      <Button variant="link" size="sm" className="p-0 text-primary" onClick={() => openEdit(round)}><Edit size={16} /></Button>
                      <Button variant="link" size="sm" className="p-0 text-danger ms-3" onClick={() => handleDeleteRound(round.id)}><Trash2 size={16} /></Button>
                    </td>
                  </tr>
                ))}
                {rounds.length === 0 && <tr><td colSpan="6" className="text-center py-4 text-muted">No rounds</td></tr>}
              </tbody>
            </Table>
          </div>
        )}
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>{editingRound ? 'Edit Round' : 'Create Round'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Track</Form.Label>
              <Form.Select value={form.trackId} disabled={Boolean(editingRound)} onChange={(e) => setForm({ ...form, trackId: e.target.value })}>
                <option value="">Select track</option>
                {tracks.map((track) => <option key={track.id} value={track.id}>{track.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Round Name</Form.Label>
              <Form.Control type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sequence Number</Form.Label>
              <Form.Control type="number" min="1" value={form.sequenceNumber} onChange={(e) => setForm({ ...form, sequenceNumber: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Submission Deadline</Form.Label>
              <Form.Control type="datetime-local" value={form.submissionDeadline} onChange={(e) => setForm({ ...form, submissionDeadline: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Top N To Promote</Form.Label>
              <Form.Control type="number" min="1" value={form.topNToPromote} onChange={(e) => setForm({ ...form, topNToPromote: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveRound}>{editingRound ? 'Update Round' : 'Create Round'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RoundManagement;
