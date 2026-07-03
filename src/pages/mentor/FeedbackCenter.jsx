import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import { createMentorFeedback, getMentorFeedbacks, getMentorTeams } from '../../api/hackathonApi';
import { getInitials, getStoredUser } from '../../utils/authUser';
import styles from './FeedbackCenter.module.css';

const pageItems = (data) => data?.content || data || [];

const FeedbackCenter = () => {
  const [teams, setTeams] = useState([]);
  const [activeTeamId, setActiveTeamId] = useState('');
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const activeTeam = teams.find((t) => t.teamId === activeTeamId);

  useEffect(() => { (async () => { setLoading(true); setError(''); try { const user = getStoredUser(); const rows = await getMentorTeams(user?.id); const unique = Array.from(new Map((rows || []).filter((r) => r.teamId).map((r) => [r.teamId, r])).values()); setTeams(unique); setActiveTeamId(unique[0]?.teamId || ''); } catch (e) { setError(e.message || 'Cannot load teams'); } finally { setLoading(false); } })(); }, []);
  useEffect(() => { (async () => { if (!activeTeamId) { setFeedbackHistory([]); return; } try { setFeedbackHistory(pageItems(await getMentorFeedbacks({ teamId: activeTeamId, size: 100 }))); } catch (e) { setError(e.message || 'Cannot load feedback history'); } })(); }, [activeTeamId]);

  const send = async () => { if (!content.trim() || !activeTeam) return; setSaving(true); setError(''); try { await createMentorFeedback({ trackMentorId: activeTeam.trackMentorId, teamId: activeTeam.teamId, roundId: activeTeam.roundId || null, content: content.trim() }); setContent(''); setFeedbackHistory(pageItems(await getMentorFeedbacks({ teamId: activeTeam.teamId, size: 100 }))); } catch (e) { setError(e.message || 'Cannot send feedback'); } finally { setSaving(false); } };

  return (
    <div className="py-2"><div className={styles.pageHeader}><h1 className={styles.pageTitle}>Feedback Center</h1><div className={styles.pageSubtitle}>Send and manage feedback for your teams</div></div>{error && <Alert variant="danger">{error}</Alert>}{loading ? <div className="text-center py-4"><Spinner size="sm" className="me-2" />Loading...</div> : <Row><Col md={3} className="mb-4 mb-md-0"><div className={styles.teamList}>{teams.length === 0 ? <div className="text-muted p-3">No teams</div> : teams.map((team) => <div key={team.teamId} className={`${styles.teamBtn} ${activeTeamId === team.teamId ? styles.activeTeamBtn : ''}`} onClick={() => setActiveTeamId(team.teamId)}><div className={styles.teamInitials}>{getInitials(team.teamName)}</div><div className={styles.teamNameText}>{team.teamName}</div></div>)}</div></Col><Col md={9}><Card className={styles.feedbackMainCard}><Card.Body className="p-4"><div className={styles.cardHeader}>Feedback — {activeTeam?.teamName || 'Select team'}</div><div className={styles.historyContainer}>{feedbackHistory.length === 0 ? <div className="text-muted">No feedback yet.</div> : feedbackHistory.map((item) => <div key={item.id} className={styles.historyCard}><div className={styles.historyMeta}><span className={styles.historyAuthor}>{item.mentorEmail || 'Mentor'}</span><span className={styles.historyDate}>{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</span></div><div className={styles.historyMessage}>{item.content}</div></div>)}</div><div className={styles.newFeedbackSection}><div className={styles.newFeedbackLabel}>New Feedback for {activeTeam?.teamName || 'team'}</div><textarea className={styles.feedbackTextarea} placeholder={`Write constructive feedback for ${activeTeam?.teamName || 'this team'}...`} value={content} onChange={(e) => setContent(e.target.value)} disabled={!activeTeam} /><Button className={styles.sendBtn} onClick={send} disabled={!activeTeam || !content.trim() || saving}>{saving ? 'Sending…' : 'Send Feedback'}</Button></div></Card.Body></Card></Col></Row>}</div>
  );
};

export default FeedbackCenter;
