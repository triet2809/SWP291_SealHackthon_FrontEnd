import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Form, InputGroup, Modal, Spinner, Table } from 'react-bootstrap';
import { Mail, Plus, Search, Trash2 } from 'lucide-react';
import { addUserRole, getUsers } from '../../api/userApi';
import { assignRoundJudge, deleteRoundJudge, getRoundJudges, getRounds } from '../../api/hackathonApi';

const pageItems = (data) => data?.content || data || [];

const JudgeManagement = () => {
  const [users, setUsers] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showAssign, setShowAssign] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRoundId, setSelectedRoundId] = useState('');

  const loadData = async () => {
    setLoading(true); setError('');
    try {
      const [userResult, roundData, assignmentData] = await Promise.all([
        getUsers(), getRounds({ size: 200 }), getRoundJudges({ size: 500 })
      ]);
      if (!userResult.ok) { setError(userResult.data?.message || 'Cannot load users'); return; }
      setUsers(userResult.value);
      setRounds(pageItems(roundData));
      setAssignments(pageItems(assignmentData));
    } catch (e) { setError(e.message || 'Cannot reach the server'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const judges = useMemo(() => users.filter((u) => u.roles?.includes('judge')), [users]);
  const assignableUsers = useMemo(() => users.filter((u) => u.status === 'approved' && !u.roles?.includes('judge')), [users]);
  const rows = useMemo(() => judges.filter((j) =>
    j.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ), [judges, searchTerm]);
  const assignmentsByUser = useMemo(() => assignments.reduce((acc, item) => {
    acc[item.userId] = [...(acc[item.userId] || []), item]; return acc;
  }, {}), [assignments]);

  const handleAssign = async () => {
    setSaving(true); setError('');
    try {
      const user = users.find((item) => item.id === selectedUserId);
      if (!user) return;
      if (!user.roles?.includes('judge')) {
        const roleResult = await addUserRole(user, 'judge');
        if (!roleResult.ok) { setError(roleResult.data?.message || 'Assign judge role failed'); return; }
      }
      if (selectedRoundId) await assignRoundJudge({ userId: selectedUserId, roundId: selectedRoundId });
      setShowAssign(false); setSelectedUserId(''); setSelectedRoundId('');
      await loadData();
    } catch (e) { setError(e.message || 'Assign judge failed'); }
    finally { setSaving(false); }
  };

  const handleRemoveRound = async (id) => {
    if (!window.confirm('Remove this judge from round?')) return;
    try { await deleteRoundJudge(id); await loadData(); }
    catch (e) { setError(e.message || 'Remove assignment failed'); }
  };

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Judge Management</h1><div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Assign judge role and round workload</div></div>
        <Button variant="primary" className="d-flex align-items-center gap-2" onClick={() => setShowAssign(true)}><Plus size={18} /> Assign Judge</Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="p-3 border-bottom"><InputGroup style={{ maxWidth: '300px' }}><InputGroup.Text className="bg-transparent border-end-0"><Search size={16} /></InputGroup.Text><Form.Control className="border-start-0" placeholder="Search judges..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></InputGroup></div>
        <div className="table-responsive"><Table className="mb-0" hover><thead><tr><th>Name</th><th>Email</th><th>Student Type</th><th>Status</th><th>Rounds</th><th className="text-end">Actions</th></tr></thead><tbody>
          {loading ? <tr><td colSpan="6" className="text-center py-4"><Spinner size="sm" className="me-2" />Loading...</td></tr> : rows.length === 0 ? <tr><td colSpan="6" className="text-center py-4 text-muted">No judges found</td></tr> : rows.map((judge) => (
            <tr key={judge.id}><td className="fw-medium py-3">{judge.fullName}</td><td className="py-3 text-muted">{judge.email}</td><td className="py-3">{judge.studentType}<div className="small text-muted">{judge.universityName || judge.campusName || '-'}</div></td><td className="py-3"><Badge bg={judge.status === 'approved' ? 'success' : judge.status === 'pending' ? 'warning' : 'secondary'}>{judge.status}</Badge></td><td className="py-3">{(assignmentsByUser[judge.id] || []).length === 0 ? <span className="text-muted">No round</span> : assignmentsByUser[judge.id].map((a) => <Badge key={a.id} bg="info" className="me-1 mb-1">{a.roundName} <Button variant="link" className="p-0 ms-1 text-white" onClick={() => handleRemoveRound(a.id)}><Trash2 size={12} /></Button></Badge>)}</td><td className="py-3 text-end"><Button variant="link" size="sm" className="p-0 text-secondary" onClick={() => window.open(`mailto:${judge.email}`)}><Mail size={16} /></Button></td></tr>
          ))}
        </tbody></Table></div>
      </Card>
      <Modal show={showAssign} onHide={() => setShowAssign(false)}>
        <Modal.Header closeButton><Modal.Title>Assign Judge / Round</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3"><Form.Label>User</Form.Label><Form.Select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}><option value="">Select user</option>{[...judges, ...assignableUsers].map((u) => <option key={u.id} value={u.id}>{u.fullName} — {u.email}</option>)}</Form.Select></Form.Group>
          <Form.Group><Form.Label>Round</Form.Label><Form.Select value={selectedRoundId} onChange={(e) => setSelectedRoundId(e.target.value)}><option value="">No round yet, role only</option>{rounds.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</Form.Select></Form.Group>
        </Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={() => setShowAssign(false)}>Cancel</Button><Button variant="primary" disabled={!selectedUserId || saving} onClick={handleAssign}>{saving ? 'Saving…' : 'Assign'}</Button></Modal.Footer>
      </Modal>
    </div>
  );
};
export default JudgeManagement;
