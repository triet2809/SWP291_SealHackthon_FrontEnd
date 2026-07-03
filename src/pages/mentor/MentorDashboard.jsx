import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Users, Tag, MessageSquare, Calendar } from 'lucide-react';
import { getTeams, getTrackMentors } from '../../api/hackathonApi';
import { getInitials, getStoredUser } from '../../utils/authUser';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Avatar from '../../components/ui/Avatar';
import styles from './MentorDashboard.module.css';

const pageItems = (data) => data?.content || data || [];

const MentorDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getStoredUser();

  useEffect(() => { (async () => { setLoading(true); setError(''); try { const a = pageItems(await getTrackMentors({ userId: user?.id, size: 500 })); const groups = await Promise.all(a.map(async (x) => pageItems(await getTeams({ trackId: x.trackId, size: 500 }).catch(() => [])).map((t) => ({ ...t, trackName: x.trackName })))); setAssignments(a); setTeams(groups.flat()); } catch (e) { setError(e.message || 'Cannot load mentor dashboard'); } finally { setLoading(false); } })(); }, [user?.id]);

  if (loading) return <div className="py-4 text-center"><Spinner size="sm" className="me-2" />Loading dashboard...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className={styles.dashboard}><div className="mb-4"><h1 className={styles.greeting}>Good morning, {user?.fullName || user?.email || 'Mentor'}</h1><p className="text-muted mb-0">{teams.length} teams currently under your mentorship</p></div><Row className="g-4 mb-4"><Col md={3}><StatCard icon={Users} iconColor="#a855f7" iconBg="#f3e8ff" value={teams.length} title="Assigned Teams" subtitle={teams.slice(0, 3).map((t) => t.name).join(', ') || 'No teams'} /></Col><Col md={3}><StatCard icon={Tag} iconColor="#3b82f6" iconBg="#dbeafe" value={assignments.length} title="Active Categories" subtitle={assignments.map((a) => a.trackName).join(' · ') || 'No tracks'} /></Col><Col md={3}><StatCard icon={MessageSquare} iconColor="#10b981" iconBg="#d1fae5" value="0" title="Feedback Given" subtitle="Feedback endpoint not in BE yet" /></Col><Col md={3}><StatCard icon={Calendar} iconColor="#f59e0b" iconBg="#fef3c7" value="0" title="Sessions This Week" subtitle="Schedule endpoint not in BE yet" /></Col></Row><Row className="g-4"><Col md={8}><Card className="h-100"><Card.Body><div className="d-flex justify-content-between align-items-center mb-4"><h5 className={styles.cardTitle}>Team Progress</h5><span className={styles.teamsCountBadge}>{teams.length} teams</span></div><div className={styles.teamProgressList}>{teams.length === 0 ? <div className="text-muted">No teams assigned yet.</div> : teams.map((team) => { const complete = team.members?.length ? Math.min(100, (team.members.length / 5) * 100) : 20; const color = team.status === 'disqualified' ? 'danger' : complete >= 80 ? 'success' : 'warning'; return <div key={team.id} className={styles.teamProgressItem}><Avatar initials={getInitials(team.name)} bg={color === 'success' ? '#d1fae5' : color === 'warning' ? '#fef3c7' : '#fee2e2'} color={color === 'success' ? '#10b981' : color === 'warning' ? '#f59e0b' : '#ef4444'} /><div className={styles.teamInfo}><div className="d-flex justify-content-between align-items-center mb-1"><div><div className={styles.teamName}>{team.name}</div><div className={styles.projectName}>{team.trackName || team.trackId}</div></div><StatusBadge status={team.status || 'active'} /></div><div className={styles.progressTrack}><div className={`${styles.progressBar} bg-${color}`} style={{ width: `${complete}%` }}></div></div><div className={styles.progressText}>{Math.round(complete)}% roster complete</div></div></div>; })}</div></Card.Body></Card></Col><Col md={4}><div className="d-flex flex-column gap-4 h-100"><Card><Card.Body><h5 className={styles.cardTitle}>Assigned Tracks</h5><div className={styles.sessionList}>{assignments.length === 0 ? <div className="text-muted">No tracks.</div> : assignments.map((a) => <div key={a.id} className={styles.sessionItem}><div className={styles.sessionTeam}>{a.trackName}</div><div className={styles.sessionTime}>{a.assignedAt ? new Date(a.assignedAt).toLocaleString() : '-'}</div><div className={styles.sessionType}>Mentorship</div></div>)}</div></Card.Body></Card><Card className="flex-grow-1"><Card.Body><h5 className={styles.cardTitle}>Recent Feedback</h5><div className="text-muted">No feedback endpoint in backend yet.</div></Card.Body></Card></div></Col></Row></div>
  );
};

export default MentorDashboard;
