import React, { useEffect, useState } from 'react';
import { Alert, Card, Col, ProgressBar, Row, Spinner } from 'react-bootstrap';
import { Code, ExternalLink, FileText, Globe } from 'lucide-react';
import { getMentorFeedbacks, getMyTeams, getSubmissions, getTrackMentors } from '../../api/hackathonApi';
import { getInitials } from '../../utils/authUser';
import styles from './MyTeam.module.css';

const pageItems = (data) => data?.content || data || [];

const MyTeam = () => {
  const [team, setTeam] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [mentor, setMentor] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const getResourceIcon = (type) => type === 'github' ? <Code size={16} /> : type === 'globe' ? <Globe size={16} /> : type === 'file' ? <FileText size={16} /> : <ExternalLink size={16} />;

  useEffect(() => { (async () => { setLoading(true); setError(''); try { const teams = await getMyTeams(); const current = teams?.[0] || null; setTeam(current); if (current) { const [subs, mentors, fb] = await Promise.all([getSubmissions({ teamId: current.id, size: 100 }).catch(() => []), getTrackMentors({ trackId: current.trackId, size: 10 }).catch(() => []), getMentorFeedbacks({ teamId: current.id, size: 5 }).catch(() => [])]); setSubmissions(pageItems(subs).filter((s) => !s.teamId || s.teamId === current.id)); setMentor(pageItems(mentors)[0] || null); setFeedbacks(pageItems(fb)); } } catch (e) { setError(e.message || 'Cannot load team'); } finally { setLoading(false); } })(); }, []);

  if (loading) return <div className="py-4 text-center"><Spinner size="sm" className="me-2" />Loading team...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!team) return <Alert variant="info">Bạn chưa thuộc team nào. Hãy tạo team hoặc liên hệ coordinator để được thêm vào team.</Alert>;
  const latest = submissions[0];
  const progress = submissions.length ? 100 : Math.min(100, ((team.members?.length || 0) / 5) * 100);
  const resources = [latest?.repoUrl && { id: 'repo', type: 'github', name: 'Repository', url: latest.repoUrl }, latest?.demoUrl && { id: 'demo', type: 'globe', name: 'Demo', url: latest.demoUrl }].filter(Boolean);

  return <div className="py-2"><div className={styles.pageHeader}><h1 className={styles.pageTitle}>My Team</h1><div className={styles.pageSubtitle}>{team.name} · {team.trackName || team.trackId}</div></div><Row className="g-4"><Col lg={8}><Card className="h-100 border-0 shadow-sm"><Card.Body className="p-4"><h5 className={styles.cardTitle}>Project Overview</h5><div className={styles.projectTitle}>{team.projectName || team.name}</div><div className={styles.projectSubtitle}>{team.status || 'active'} · {team.members?.length || 0} members</div><p className={styles.projectDescription}>{latest?.description || 'No submission description yet.'}</p><div className={styles.techStack}><span className={`${styles.techBadge} ${styles.primary}`}>{team.trackName || 'Track'}</span><span className={styles.techBadge}>{submissions.length} submissions</span><span className={styles.techBadge}>{feedbacks.length} mentor feedback</span></div><div className="mt-4 pt-2"><div className={styles.progressLabel}><span>Submission completeness</span><span className={styles.progressValue}>{Math.round(progress)}%</span></div><ProgressBar now={progress} variant="primary" style={{ height: '6px' }} /></div></Card.Body></Card></Col><Col lg={4}><Card className="h-100 border-0 shadow-sm"><Card.Body className="p-4"><h5 className={styles.cardTitle}>Resources</h5><div className={styles.resourcesList}>{resources.length === 0 ? <div className="text-muted">No links submitted yet.</div> : resources.map((resource) => <a href={resource.url} key={resource.id} className={styles.resourceLink} target="_blank" rel="noreferrer">{getResourceIcon(resource.type)}<span>{resource.name}</span></a>)}</div><div className={styles.divider}></div><h5 className={styles.cardTitle} style={{ marginBottom: '1rem' }}>Assigned Mentor</h5>{mentor ? <div className={styles.mentorCard}><div className={styles.mentorAvatar}>{getInitials(mentor.fullName || mentor.email)}</div><div><div className={styles.mentorName}>{mentor.fullName || mentor.email}</div><div className={styles.mentorRole}>Mentor</div></div></div> : <div className="text-muted">No mentor assigned yet.</div>}</Card.Body></Card></Col></Row></div>;
};

export default MyTeam;
