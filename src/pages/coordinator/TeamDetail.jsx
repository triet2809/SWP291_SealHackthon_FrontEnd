import React, { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Row, Spinner, Table } from 'react-bootstrap';
import { Activity, ArrowLeft, FolderOpen, Target, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubmissions, getTeam, getTrack } from '../../api/hackathonApi';

const pageItems = (data) => data?.content || data || [];

const TeamDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [track, setTrack] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { (async () => { setLoading(true); setError(''); try { const teamData = await getTeam(id); setTeam(teamData); if (teamData.trackId) setTrack(await getTrack(teamData.trackId).catch(() => null)); setSubmissions(pageItems(await getSubmissions({ teamId: id, size: 500 }).catch(() => []))); } catch (e) { setError(e.message || 'Cannot load team'); } finally { setLoading(false); } })(); }, [id]);

  if (loading) return <div className="py-4 text-center"><Spinner size="sm" className="me-2" />Loading team...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!team) return <Alert variant="warning">Team not found</Alert>;

  const status = team.status || 'active';
  return (
    <div className="py-2"><div className="d-flex align-items-center gap-3 mb-4"><Button variant="link" className="p-0 text-muted" onClick={() => navigate('/coordinator/teams')}><ArrowLeft size={24} /></Button><div><h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>{team.name}</h1><div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Team ID: {team.id}</div></div><Badge bg={status === 'disqualified' ? 'danger' : 'success'} className="ms-auto px-3 py-2 fs-6">{status}</Badge></div>
      <Row className="g-4 mb-4"><Col md={8}><Card className="h-100" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><Card.Body className="p-4"><h5 className="fw-bold mb-4 border-bottom pb-3">Project Information</h5><div className="mb-4"><div className="text-muted small fw-medium mb-1 d-flex align-items-center gap-2"><Target size={16} /> Project Title</div><div className="fw-medium fs-5" style={{ color: 'var(--cf-text-primary)' }}>{team.projectName || team.name}</div></div><div className="mb-0"><div className="text-muted small fw-medium mb-1 d-flex align-items-center gap-2"><FolderOpen size={16} /> Track</div><div><Badge bg="secondary" className="px-2 py-1">{team.trackName || track?.name || team.trackId}</Badge></div></div></Card.Body></Card></Col><Col md={4}><Card className="h-100" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><Card.Body className="p-4"><h5 className="fw-bold mb-4 border-bottom pb-3">Team Information</h5><div className="mb-4"><div className="text-muted small fw-medium mb-1 d-flex align-items-center gap-2"><Users size={16} /> Team Size</div><div className="fw-bold fs-4">{team.members?.length || team.memberCount || 0} <span className="fs-6 text-muted fw-normal">Members</span></div></div><div className="mb-0"><div className="text-muted small fw-medium mb-1 d-flex align-items-center gap-2"><Activity size={16} /> Current Status</div><div className="fw-medium text-dark">{status}</div></div></Card.Body></Card></Col></Row>
      <Row className="g-4"><Col lg={6}><Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)' }}><Card.Body><h5 className="fw-bold mb-3">Members</h5><Table hover responsive><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>{(team.members || []).length === 0 ? <tr><td colSpan="3" className="text-muted text-center">No members</td></tr> : team.members.map((m) => <tr key={m.userId || m.id}><td>{m.fullName || m.name || m.userName || m.userId}</td><td>{m.email || '-'}</td><td><Badge bg={m.role === 'leader' ? 'primary' : 'secondary'}>{m.role || 'member'}</Badge></td></tr>)}</tbody></Table></Card.Body></Card></Col><Col lg={6}><Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)' }}><Card.Body><h5 className="fw-bold mb-3">Submissions</h5><Table hover responsive><thead><tr><th>Round</th><th>Repo</th><th>Submitted</th></tr></thead><tbody>{submissions.length === 0 ? <tr><td colSpan="3" className="text-muted text-center">No submissions</td></tr> : submissions.map((s) => <tr key={s.id}><td>{s.roundName || s.roundId}</td><td>{s.repoUrl ? <a href={s.repoUrl} target="_blank" rel="noreferrer">Repo</a> : '-'}</td><td>{s.submittedAt ? new Date(s.submittedAt).toLocaleString() : '-'}</td></tr>)}</tbody></Table></Card.Body></Card></Col></Row>
    </div>
  );
};

export default TeamDetail;
