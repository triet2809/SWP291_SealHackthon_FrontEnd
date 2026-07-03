import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Form, InputGroup, Modal, Spinner, Table } from 'react-bootstrap';
import { Ban, Eye, Plus, RefreshCcw, Search, Trash2, UserPlus } from 'lucide-react';
import { getUsers } from '../../api/userApi';
import { addTeamMember, createTeam, disqualifyTeam, getTeams, getTracks, reactivateTeam, removeTeamMember } from '../../api/hackathonApi';

const pageItems = (data) => data?.content || data || [];
const initials = (name = '') => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'T';
const badgeVariant = (status) => status === 'active' ? 'success' : 'danger';

const TeamManagement = () => {
  const [tracks, setTracks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTrackId, setSelectedTrackId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [form, setForm] = useState({ name: '', leaderUserId: '', memberUserIds: [] });
  const [memberForm, setMemberForm] = useState({ userId: '', role: 'member' });

  const loadTracksAndUsers = async () => {
    const [trackData, userResult] = await Promise.all([getTracks({ size: 300 }), getUsers({ status: 'approved' })]);
    const trackList = pageItems(trackData);
    setTracks(trackList);
    if (!selectedTrackId && trackList[0]?.id) setSelectedTrackId(trackList[0].id);
    if (!userResult.ok) throw new Error(userResult.data?.message || 'Cannot load users');
    setUsers(userResult.value);
    return trackList;
  };

  const loadTeams = async (trackId = selectedTrackId) => {
    if (!trackId) { setTeams([]); return; }
    const teamData = await getTeams({ trackId, size: 500 });
    setTeams(pageItems(teamData));
  };

  const loadData = async () => {
    setLoading(true); setError('');
    try {
      const trackList = await loadTracksAndUsers();
      await loadTeams(selectedTrackId || trackList[0]?.id || '');
    } catch (e) { setError(e.message || 'Cannot load teams'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => { if (selectedTrackId) loadTeams(selectedTrackId).catch((e) => setError(e.message || 'Cannot load teams')); }, [selectedTrackId]);

  const currentTrack = tracks.find((track) => track.id === selectedTrackId);
  const filteredTeams = useMemo(() => teams.filter((team) => {
    const text = `${team.name} ${team.members?.map((m) => `${m.fullName} ${m.email}`).join(' ')}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase()) && (statusFilter === 'all' || team.status === statusFilter);
  }), [teams, searchTerm, statusFilter]);

  const availableUsers = useMemo(() => users.filter((user) => !selectedTeam?.members?.some((m) => m.userId === user.id)), [users, selectedTeam]);

  const openCreate = () => {
    setForm({ name: '', leaderUserId: '', memberUserIds: [] });
    setShowCreate(true);
  };

  const handleCreate = async () => {
    setSaving(true); setError('');
    try {
      await createTeam({ trackId: selectedTrackId, name: form.name, leaderUserId: form.leaderUserId || null, memberUserIds: form.memberUserIds });
      setShowCreate(false);
      await loadTeams();
    } catch (e) { setError(e.message || 'Create team failed'); }
    finally { setSaving(false); }
  };

  const refreshSelectedTeam = async () => {
    await loadTeams();
    if (selectedTeam) {
      const updated = pageItems(await getTeams({ trackId: selectedTrackId, size: 500 })).find((team) => team.id === selectedTeam.id);
      if (updated) setSelectedTeam(updated);
    }
  };

  const handleAddMember = async () => {
    if (!selectedTeam || !memberForm.userId) return;
    setSaving(true); setError('');
    try {
      const updated = await addTeamMember(selectedTeam.id, memberForm);
      setSelectedTeam(updated); setMemberForm({ userId: '', role: 'member' }); await loadTeams();
    } catch (e) { setError(e.message || 'Add member failed'); }
    finally { setSaving(false); }
  };

  const handleRemoveMember = async (userId) => {
    if (!selectedTeam || !window.confirm('Remove this member from team?')) return;
    try { await removeTeamMember(selectedTeam.id, userId); await refreshSelectedTeam(); }
    catch (e) { setError(e.message || 'Remove member failed'); }
  };

  const handleDisqualify = async (team) => {
    const reason = window.prompt('Disqualification reason?');
    if (!reason) return;
    try { await disqualifyTeam(team.id, reason); await loadTeams(); }
    catch (e) { setError(e.message || 'Disqualify failed'); }
  };

  const handleReactivate = async (team) => {
    try { await reactivateTeam(team.id); await loadTeams(); }
    catch (e) { setError(e.message || 'Reactivate failed'); }
  };

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Team Management</h1><div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Backend teams by track. Members must be approved users. Max 5 members.</div></div>
        <Button disabled={!selectedTrackId} variant="primary" className="d-flex align-items-center gap-2" onClick={openCreate}><Plus size={18} /> Create Team</Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="p-3 border-bottom d-flex flex-wrap gap-2 align-items-center justify-content-between">
          <InputGroup style={{ maxWidth: '300px' }}><InputGroup.Text className="bg-transparent border-end-0"><Search size={16} /></InputGroup.Text><Form.Control className="border-start-0" placeholder="Search teams or members..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></InputGroup>
          <div className="d-flex gap-2">
            <Form.Select style={{ minWidth: '220px' }} value={selectedTrackId} onChange={(e) => setSelectedTrackId(e.target.value)}><option value="">Select track</option>{tracks.map((track) => <option key={track.id} value={track.id}>{track.name}</option>)}</Form.Select>
            <Form.Select style={{ width: '160px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="all">All Statuses</option><option value="active">Active</option><option value="disqualified">Disqualified</option></Form.Select>
          </div>
        </div>
        <div className="table-responsive"><Table className="mb-0" hover><thead><tr><th>Team Name</th><th>Track</th><th>Members</th><th>Leader</th><th>Status</th><th className="text-end">Actions</th></tr></thead><tbody>
          {loading ? <tr><td colSpan="6" className="text-center py-4"><Spinner size="sm" className="me-2" />Loading...</td></tr> : filteredTeams.length === 0 ? <tr><td colSpan="6" className="text-center py-4 text-muted">No teams found</td></tr> : filteredTeams.map((team) => {
            const leader = team.members?.find((m) => m.role === 'leader');
            return <tr key={team.id}><td className="fw-medium py-3"><div className="d-flex align-items-center gap-2"><div className="d-flex align-items-center justify-content-center bg-primary text-white rounded-circle" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>{initials(team.name)}</div><span>{team.name}</span></div></td><td className="py-3">{currentTrack?.name || team.trackId}</td><td className="py-3">{team.members?.length || 0}/5</td><td className="py-3">{leader?.fullName || '-'}</td><td className="py-3"><Badge bg={badgeVariant(team.status)}>{team.status}</Badge>{team.disqualifiedReason && <div className="small text-muted">{team.disqualifiedReason}</div>}</td><td className="py-3 text-end"><Button variant="link" size="sm" className="p-0 text-primary me-3" onClick={() => { setSelectedTeam(team); setShowDetail(true); }}><Eye size={16} /></Button>{team.status === 'active' ? <Button variant="link" size="sm" className="p-0 text-danger" onClick={() => handleDisqualify(team)}><Ban size={16} /></Button> : <Button variant="link" size="sm" className="p-0 text-success" onClick={() => handleReactivate(team)}><RefreshCcw size={16} /></Button>}</td></tr>;
          })}
        </tbody></Table></div>
      </Card>

      <Modal show={showCreate} onHide={() => setShowCreate(false)}>
        <Modal.Header closeButton><Modal.Title>Create Team</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3"><Form.Label>Track</Form.Label><Form.Control value={currentTrack?.name || ''} disabled /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Team name</Form.Label><Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Team name" /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Leader</Form.Label><Form.Select value={form.leaderUserId} onChange={(e) => setForm({ ...form, leaderUserId: e.target.value })}><option value="">No leader yet</option>{users.map((u) => <option key={u.id} value={u.id}>{u.fullName} — {u.email}</option>)}</Form.Select></Form.Group>
          <Form.Group><Form.Label>Members</Form.Label><Form.Select multiple value={form.memberUserIds} onChange={(e) => setForm({ ...form, memberUserIds: Array.from(e.target.selectedOptions).map((o) => o.value) })}>{users.filter((u) => u.id !== form.leaderUserId).map((u) => <option key={u.id} value={u.id}>{u.fullName} — {u.email}</option>)}</Form.Select><div className="small text-muted mt-1">Hold Cmd/Ctrl to select multiple. Coordinator can create roster gradually.</div></Form.Group>
        </Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button><Button variant="primary" disabled={!form.name.trim() || !selectedTrackId || saving} onClick={handleCreate}>{saving ? 'Saving…' : 'Create'}</Button></Modal.Footer>
      </Modal>

      <Modal show={showDetail} onHide={() => setShowDetail(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Team Details</Modal.Title></Modal.Header>
        <Modal.Body>{selectedTeam && <>
          <p><strong>Name:</strong> {selectedTeam.name}</p><p><strong>Status:</strong> {selectedTeam.status}</p>{selectedTeam.disqualifiedReason && <p><strong>Reason:</strong> {selectedTeam.disqualifiedReason}</p>}
          <div className="d-flex gap-2 align-items-end mb-3"><Form.Group className="flex-grow-1"><Form.Label>Add member</Form.Label><Form.Select value={memberForm.userId} onChange={(e) => setMemberForm({ ...memberForm, userId: e.target.value })}><option value="">Select approved user</option>{availableUsers.map((u) => <option key={u.id} value={u.id}>{u.fullName} — {u.email}</option>)}</Form.Select></Form.Group><Form.Group><Form.Label>Role</Form.Label><Form.Select value={memberForm.role} onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}><option value="member">member</option><option value="leader">leader</option></Form.Select></Form.Group><Button disabled={!memberForm.userId || saving} onClick={handleAddMember}><UserPlus size={16} /></Button></div>
          <Table size="sm"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th className="text-end">Actions</th></tr></thead><tbody>{selectedTeam.members?.length ? selectedTeam.members.map((m) => <tr key={m.userId}><td>{m.fullName}</td><td>{m.email}</td><td><Badge bg={m.role === 'leader' ? 'primary' : 'secondary'}>{m.role}</Badge></td><td className="text-end"><Button variant="link" size="sm" className="p-0 text-danger" onClick={() => handleRemoveMember(m.userId)}><Trash2 size={14} /></Button></td></tr>) : <tr><td colSpan="4" className="text-muted text-center">No members</td></tr>}</tbody></Table>
        </>}</Modal.Body>
      </Modal>
    </div>
  );
};

export default TeamManagement;
