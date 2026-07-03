import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Spinner, Table } from 'react-bootstrap';
import { Download, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMyTeams, getSubmissions } from '../../api/hackathonApi';
import styles from './SubmissionHistory.module.css';

const pageItems = (data) => data?.content || data || [];

const SubmissionHistory = () => {
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { (async () => { setLoading(true); setError(''); try { const teams = await getMyTeams(); const current = teams?.[0] || null; setTeam(current); if (current) setSubmissions(pageItems(await getSubmissions({ teamId: current.id, size: 500 })).filter((s) => !s.teamId || s.teamId === current.id)); } catch (e) { setError(e.message || 'Cannot load submission history'); } finally { setLoading(false); } })(); }, []);
  return <div className="py-2"><div className={styles.pageHeader}><h1 className={styles.pageTitle}>Submission History</h1><div className={styles.pageSubtitle}>All submissions for {team?.name || 'your team'}</div></div>{error && <Alert variant="danger">{error}</Alert>}<Card className={styles.tableCard}><div className="table-responsive"><Table className="mb-0" hover><thead><tr><th className={`border-top-0 ${styles.tableHeader}`}>Version</th><th className={`border-top-0 ${styles.tableHeader}`}>Round</th><th className={`border-top-0 ${styles.tableHeader}`}>Submitted</th><th className={`border-top-0 ${styles.tableHeader}`}>Links</th><th className={`border-top-0 ${styles.tableHeader}`}>Status</th><th className={`border-top-0 ${styles.tableHeader}`}></th></tr></thead><tbody>{loading ? <tr><td colSpan="6" className="text-center py-4"><Spinner size="sm" className="me-2" />Loading...</td></tr> : submissions.length === 0 ? <tr><td colSpan="6" className="text-center py-4 text-muted">No submissions yet</td></tr> : submissions.map((submission, idx) => <tr key={submission.id} className={styles.tableRow}><td className={styles.tableCell}><span className={styles.versionBadge}>v{submissions.length - idx}</span></td><td className={styles.tableCell}><span className={styles.titleText}>{submission.roundName || submission.roundId}</span></td><td className={`${styles.tableCell} ${styles.tableCellSecondary}`}>{submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : '-'}</td><td className={`${styles.tableCell} ${styles.tableCellSecondary}`}>{[submission.repoUrl && 'Repo', submission.demoUrl && 'Demo', submission.slideUrl && 'Slides', submission.reportUrl && 'Report'].filter(Boolean).join(', ') || '-'}</td><td className={styles.tableCell}><span className={styles.statusBadge}>Submitted</span></td><td className={styles.tableCell}><div className="d-flex align-items-center gap-2">{submission.reportUrl && <a className={styles.downloadBtn} href={submission.reportUrl} target="_blank" rel="noreferrer"><Download size={16} /> Download</a>}<Button variant="link" size="sm" className="p-0 text-primary ms-2" onClick={() => navigate(`/team/history/${submission.id}`)}><Eye size={18} /></Button></div></td></tr>)}</tbody></Table></div></Card></div>;
};

export default SubmissionHistory;
