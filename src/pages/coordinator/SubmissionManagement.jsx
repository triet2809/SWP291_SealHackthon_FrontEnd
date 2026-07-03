import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Form, InputGroup, Modal, Spinner, Table } from 'react-bootstrap';
import { Download, Eye, Plus, Search, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { deleteSubmission, getRounds, getSubmissions, getTeams, upsertSubmission } from '../../api/hackathonApi';

const pageItems = (data) => data?.content || data || [];

const SubmissionManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roundFilter, setRoundFilter] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ roundId: '', teamId: '', repoUrl: '', demoUrl: '', slideUrl: '', reportUrl: '', apiMetadata: '' });

  const loadData = async () => {
    setLoading(true); setError('');
    try {
      const [subData, roundData, teamData] = await Promise.all([
        getSubmissions({ size: 500, ...(roundFilter ? { roundId: roundFilter } : {}) }),
        getRounds({ size: 500 }),
        getTeams({ size: 500 }),
      ]);
      const roundList = pageItems(roundData);
      const teamList = pageItems(teamData);
      setSubmissions(pageItems(subData)); setRounds(roundList); setTeams(teamList);
      setForm((prev) => ({ ...prev, roundId: prev.roundId || roundList[0]?.id || '', teamId: prev.teamId || teamList[0]?.id || '' }));
    } catch (e) { setError(e.message || 'Cannot load submissions'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [roundFilter]);

  const roundMap = useMemo(() => Object.fromEntries(rounds.map((r) => [r.id, r])), [rounds]);
  const teamMap = useMemo(() => Object.fromEntries(teams.map((t) => [t.id, t])), [teams]);

  const filteredSubmissions = submissions.filter((sub) => {
    const round = roundMap[sub.roundId];
    const team = teamMap[sub.teamId];
    const text = `${sub.teamName || ''} ${team?.name || ''} ${round?.name || ''} ${sub.repoUrl || ''} ${sub.demoUrl || ''}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  const handleCreate = async () => {
    if (!form.roundId || !form.teamId) { setError('Round and team required'); return; }
    setSaving(true); setError('');
    try {
      await upsertSubmission({
        roundId: form.roundId,
        teamId: form.teamId,
        repoUrl: form.repoUrl || null,
        demoUrl: form.demoUrl || null,
        slideUrl: form.slideUrl || null,
        reportUrl: form.reportUrl || null,
        apiMetadata: form.apiMetadata || null,
      });
      setShowModal(false); setForm({ ...form, repoUrl: '', demoUrl: '', slideUrl: '', reportUrl: '', apiMetadata: '' }); await loadData();
    } catch (e) { setError(e.message || 'Save submission failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this submission?')) return;
    try { await deleteSubmission(id); await loadData(); }
    catch (e) { setError(e.message || 'Delete submission failed'); }
  };

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Submission Management</h1><div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Review all team submissions from backend</div></div>
        <div className="d-flex gap-2"><Button variant="outline-primary" className="d-flex align-items-center gap-2" onClick={() => alert('Export not implemented by backend yet')}><Download size={18} /> Export All</Button><Button variant="primary" className="d-flex align-items-center gap-2" onClick={() => setShowModal(true)}><Plus size={18} /> Add Submission</Button></div>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <InputGroup style={{ maxWidth: '300px' }}><InputGroup.Text className="bg-transparent border-end-0"><Search size={16} /></InputGroup.Text><Form.Control className="border-start-0" placeholder="Search teams, rounds, links..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></InputGroup>
          <Form.Select style={{ width: '260px' }} value={roundFilter} onChange={(e) => setRoundFilter(e.target.value)}><option value="">All Rounds</option>{rounds.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</Form.Select>
        </div>
        <div className="table-responsive"><Table className="mb-0" hover><thead><tr><th>Team Name</th><th>Round</th><th>Repo</th><th>Demo</th><th>Submitted Date</th><th>Review Status</th><th className="text-end">Actions</th></tr></thead><tbody>
          {loading ? <tr><td colSpan="7" className="text-center py-4"><Spinner size="sm" className="me-2" />Loading...</td></tr> : filteredSubmissions.length === 0 ? <tr><td colSpan="7" className="text-center py-4 text-muted">No submissions found</td></tr> : filteredSubmissions.map((sub) => <tr key={sub.id}>
            <td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{sub.teamName || teamMap[sub.teamId]?.name || sub.teamId}</td>
            <td className="py-3"><Badge bg="info">{roundMap[sub.roundId]?.name || sub.roundId}</Badge></td>
            <td className="py-3">{sub.repoUrl ? <a href={sub.repoUrl} target="_blank" rel="noreferrer">Repo</a> : '-'}</td>
            <td className="py-3">{sub.demoUrl ? <a href={sub.demoUrl} target="_blank" rel="noreferrer">Demo</a> : '-'}</td>
            <td className="py-3">{sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : '-'}</td>
            <td className="py-3"><Badge bg="warning" text="dark">Pending scoring</Badge></td>
            <td className="text-end"><Button variant="link" size="sm" className="p-0 text-primary" onClick={() => navigate(`/coordinator/submissions/${sub.id}`)}><Eye size={18} /></Button><Button variant="link" size="sm" className="p-0 text-danger ms-3" onClick={() => handleDelete(sub.id)}><Trash2 size={16} /></Button></td>
          </tr>)}
        </tbody></Table></div>
      </Card>
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg"><Modal.Header closeButton><Modal.Title>Create / Update Submission</Modal.Title></Modal.Header><Modal.Body><div className="row g-3"><div className="col-md-6"><Form.Label>Round</Form.Label><Form.Select value={form.roundId} onChange={(e) => setForm({ ...form, roundId: e.target.value })}>{rounds.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</Form.Select></div><div className="col-md-6"><Form.Label>Team</Form.Label><Form.Select value={form.teamId} onChange={(e) => setForm({ ...form, teamId: e.target.value })}>{teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</Form.Select></div><div className="col-md-6"><Form.Label>Repo URL</Form.Label><Form.Control value={form.repoUrl} onChange={(e) => setForm({ ...form, repoUrl: e.target.value })} /></div><div className="col-md-6"><Form.Label>Demo URL</Form.Label><Form.Control value={form.demoUrl} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} /></div><div className="col-md-6"><Form.Label>Slide URL</Form.Label><Form.Control value={form.slideUrl} onChange={(e) => setForm({ ...form, slideUrl: e.target.value })} /></div><div className="col-md-6"><Form.Label>Report URL</Form.Label><Form.Control value={form.reportUrl} onChange={(e) => setForm({ ...form, reportUrl: e.target.value })} /></div><div className="col-12"><Form.Label>Metadata / Notes</Form.Label><Form.Control as="textarea" rows={3} value={form.apiMetadata} onChange={(e) => setForm({ ...form, apiMetadata: e.target.value })} /></div></div></Modal.Body><Modal.Footer><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button><Button disabled={saving} onClick={handleCreate}>{saving ? 'Saving…' : 'Save Submission'}</Button></Modal.Footer></Modal>
    </div>
  );
};

export default SubmissionManagement;
