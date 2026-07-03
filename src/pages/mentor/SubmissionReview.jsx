import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { getMentorTeams, getSubmissions } from '../../api/hackathonApi';
import { getStoredUser } from '../../utils/authUser';
import styles from './SubmissionReview.module.css';

const pageItems = (data) => data?.content || data || [];

const SubmissionReview = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const getStatusClass = (status) => status === 'pending' ? styles.statusPending : styles.statusReviewed;

  useEffect(() => { (async () => { setLoading(true); setError(''); try { const user = getStoredUser(); const rows = await getMentorTeams(user?.id); const teams = Array.from(new Map((rows || []).filter((r) => r.teamId).map((r) => [r.teamId, r])).values()); const groups = await Promise.all(teams.map(async (t) => pageItems(await getSubmissions({ teamId: t.teamId, size: 100 }).catch(() => [])).filter((s) => !s.teamId || s.teamId === t.teamId).map((s) => ({ ...s, teamName: s.teamName || t.teamName, trackName: t.trackName })))); setSubmissions(groups.flat()); } catch (e) { setError(e.message || 'Cannot load submissions'); } finally { setLoading(false); } })(); }, []);

  return (
    <div className="py-2"><div className={styles.pageHeader}><h1 className={styles.pageTitle}>Submission Review</h1><div className={styles.pageSubtitle}>Review and provide feedback on team submissions</div></div><div className="d-flex justify-content-end mb-3"><Button variant="outline-danger" size="sm" className="d-flex align-items-center gap-2" onClick={() => navigate('/mentor/incidents/create')}><AlertTriangle size={16} /> Report Incident</Button></div>{error && <Alert variant="danger">{error}</Alert>}<div className={styles.submissionList}>{loading ? <div className="text-center py-4"><Spinner size="sm" className="me-2" />Loading...</div> : submissions.length === 0 ? <Alert variant="info">No submissions found for assigned teams.</Alert> : submissions.map((submission) => <Card key={submission.id} className={styles.submissionCard}><Card.Body className="p-4"><div className={styles.cardHeader}><div className={styles.projectInfo}><div className={styles.teamAndProject}>{submission.teamName || submission.teamId} — {submission.projectName || submission.trackName || 'Submission'}</div><div className={styles.submissionDetails}>Submitted {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : '-'} · {submission.roundName || submission.roundId}</div></div><div className={`${styles.statusBadge} ${getStatusClass(submission.status || 'reviewed')}`}>{submission.status || 'submitted'}</div></div><div className={styles.actionRow}>{submission.repoUrl && <Button variant="outline-secondary" className={styles.viewBtn} href={submission.repoUrl} target="_blank" rel="noreferrer"><ExternalLink size={16} className="me-1" /> View Files</Button>}<Button className={styles.feedbackBtn} onClick={() => navigate('/mentor/feedback')}>Give Feedback</Button></div></Card.Body></Card>)}</div></div>
  );
};

export default SubmissionReview;
