import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { ArrowLeft, Plus, Save, Trash2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createTeam, getTracks } from '../../api/hackathonApi';
import { getUsers } from '../../api/userApi';

const pageItems = (data) => data?.content || data || [];

const RecordTeam = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [users, setUsers] = useState([]);
  const [teamData, setTeamData] = useState({ name: '', trackId: '', leaderUserId: '' });
  const [memberIds, setMemberIds] = useState(['']);

  useEffect(() => { (async () => { setLoading(true); setError(''); try { const [trackData, userRes] = await Promise.all([getTracks({ size: 500 }), getUsers({ status: 'approved' })]); const trackList = pageItems(trackData); setTracks(trackList); setUsers(userRes.value || []); setTeamData((p) => ({ ...p, trackId: trackList[0]?.id || '' })); } catch (e) { setError(e.message || 'Cannot load form data'); } finally { setLoading(false); } })(); }, []);

  const availableMembers = useMemo(() => users.filter((u) => u.id !== teamData.leaderUserId), [users, teamData.leaderUserId]);
  const handleTeamChange = (e) => setTeamData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const setMemberAt = (idx, value) => setMemberIds((prev) => prev.map((id, i) => i === idx ? value : id));
  const addMember = () => memberIds.length < 4 && setMemberIds([...memberIds, '']);
  const removeMember = (idx) => memberIds.length > 1 && setMemberIds(memberIds.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => { e.preventDefault(); setError(''); if (!teamData.name || !teamData.trackId || !teamData.leaderUserId) { setError('Track, team name, and leader required'); return; } setSaving(true); try { const uniqueMembers = Array.from(new Set(memberIds.filter(Boolean).filter((id) => id !== teamData.leaderUserId))); await createTeam({ trackId: teamData.trackId, name: teamData.name, leaderUserId: teamData.leaderUserId, memberUserIds: uniqueMembers }); setSuccess(true); setTimeout(() => navigate('/coordinator/teams'), 900); } catch (err) { setError(err.message || 'Create team failed'); } finally { setSaving(false); } };

  if (loading) return <div className="py-4 text-center"><Spinner size="sm" className="me-2" />Loading form...</div>;

  return (
    <div className="py-2"><div className="d-flex align-items-center mb-4 gap-3"><Button variant="light" className="d-flex align-items-center justify-content-center rounded-circle p-0" style={{ width: '40px', height: '40px', border: '1px solid var(--cf-border-color)' }} onClick={() => navigate('/coordinator/teams')}><ArrowLeft size={20} style={{ color: 'var(--cf-text-secondary)' }} /></Button><div><h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Add New Team</h1><div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Create team directly in backend</div></div></div>{success && <Alert variant="success" className="d-flex align-items-center gap-2"><Save size={18} />Team successfully recorded! Redirecting...</Alert>}{error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}><Row className="g-4"><Col lg={4}><Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><Card.Body className="p-4"><h5 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: 'var(--cf-text-primary)' }}><Users size={20} className="text-primary" /> Team Information</h5><Form.Group className="mb-3"><Form.Label>Track *</Form.Label><Form.Select name="trackId" value={teamData.trackId} onChange={handleTeamChange} required>{tracks.map((track) => <option key={track.id} value={track.id}>{track.name}</option>)}</Form.Select></Form.Group><Form.Group className="mb-3"><Form.Label>Team Name *</Form.Label><Form.Control type="text" name="name" value={teamData.name} onChange={handleTeamChange} required placeholder="Enter team name" /></Form.Group><Form.Group className="mb-3"><Form.Label>Leader *</Form.Label><Form.Select name="leaderUserId" value={teamData.leaderUserId} onChange={handleTeamChange} required><option value="">Select leader</option>{users.map((u) => <option key={u.id} value={u.id}>{u.fullName || u.email} ({u.email})</option>)}</Form.Select></Form.Group></Card.Body></Card></Col><Col lg={8}><Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><Card.Body className="p-4"><div className="d-flex justify-content-between align-items-center mb-4"><h5 className="fw-bold mb-0" style={{ color: 'var(--cf-text-primary)' }}>Team Members ({memberIds.filter(Boolean).length}/4)</h5>{memberIds.length < 4 && <Button variant="outline-primary" size="sm" className="d-flex align-items-center gap-1" onClick={addMember} type="button"><Plus size={16} /> Add Member</Button>}</div><div className="d-flex flex-column gap-3">{memberIds.map((memberId, index) => <div key={index} className="p-3 rounded" style={{ border: '1px solid var(--cf-border-color)', backgroundColor: 'var(--cf-bg-main)' }}><div className="d-flex justify-content-between align-items-center mb-3"><span className="fw-bold" style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Member {index + 1} {index === 0 && <Badge bg="secondary" className="ms-2">Optional</Badge>}</span>{memberIds.length > 1 && <Button variant="link" className="text-danger p-0" onClick={() => removeMember(index)} type="button"><Trash2 size={16} /></Button>}</div><Form.Select value={memberId} onChange={(e) => setMemberAt(index, e.target.value)}><option value="">Select member</option>{availableMembers.map((u) => <option key={u.id} value={u.id}>{u.fullName || u.email} ({u.email})</option>)}</Form.Select></div>)}</div><div className="d-flex justify-content-end mt-4 pt-3" style={{ borderTop: '1px solid var(--cf-border-color)' }}><Button variant="primary" type="submit" className="px-4 py-2 d-flex align-items-center gap-2" disabled={success || saving}><Save size={18} /> {saving ? 'Saving…' : 'Add Team'}</Button></div></Card.Body></Card></Col></Row></Form>
    </div>
  );
};

export default RecordTeam;
