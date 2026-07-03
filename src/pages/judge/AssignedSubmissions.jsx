import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Card, Spinner, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getJudgeSubmissions, getScores } from '../../api/hackathonApi';
import { getInitials, getStoredUser } from '../../utils/authUser';
import styles from './AssignedSubmissions.module.css';

const pageItems = (data) => data?.content || data || [];
const avg = (items) => items.length ? items.reduce((sum, item) => sum + Number(item.score || 0), 0) / items.length : 0;

const AssignedSubmissions = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [scoresBySubmission, setScoresBySubmission] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError('');
      try {
        const user = getStoredUser();
        if (!user?.id) throw new Error('Cannot find current judge user');
        const assigned = await getJudgeSubmissions(user.id);
        setSubmissions(assigned || []);
        const scorePairs = await Promise.all((assigned || []).filter((s) => s.submissionId).map(async (s) => {
          const data = await getScores({ submissionId: s.submissionId, judgeId: user.id, size: 100 }).catch(() => ({ content: [] }));
          return [s.submissionId, pageItems(data)];
        }));
        setScoresBySubmission(Object.fromEntries(scorePairs));
      } catch (e) { setError(e.message || 'Cannot load assigned submissions'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const rows = useMemo(() => submissions.map((s) => {
    const scores = scoresBySubmission[s.submissionId] || [];
    return { ...s, scores, completed: scores.length > 0, average: avg(scores) };
  }), [submissions, scoresBySubmission]);
  const total = rows.length;
  const completed = rows.filter((s) => s.completed).length;
  const pending = total - completed;

  return (
    <div className="py-2">
      <div className={styles.pageHeader}><h1 className={styles.pageTitle}>Assigned Submissions</h1><div className={styles.pageSubtitle}>{total} total · {completed} completed · {pending} pending</div></div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card className={styles.tableCard}>
        <Table responsive className={styles.judgeTable}>
          <thead><tr><th>TEAM</th><th>PROJECT</th><th>TRACK</th><th>ROUND</th><th>SUBMITTED</th><th>STATUS</th><th>SCORE</th><th></th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="8" className="text-center py-4"><Spinner size="sm" className="me-2" />Loading...</td></tr> : rows.length === 0 ? <tr><td colSpan="8" className="text-center py-4 text-muted">No assigned submissions found</td></tr> : rows.map((submission) => (
              <tr key={submission.submissionId || submission.roundJudgeId}>
                <td><div className={styles.teamCell}><div className={`${styles.teamAvatar} ${styles.avatarBg}`}>{getInitials(submission.teamName)}</div><span className={styles.teamName}>{submission.teamName || submission.teamId}</span></div></td>
                <td>{submission.teamName || 'Submission'}</td>
                <td><span className={styles.categoryBadge} style={{ backgroundColor: 'var(--cf-primary-subtle)', color: 'var(--cf-primary)' }}>Track</span></td>
                <td><span className={styles.categoryBadge}>{submission.roundName || submission.roundId}</span></td>
                <td>{submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : '-'}</td>
                <td><span className={`${styles.statusBadge} ${submission.completed ? styles.statusCompleted : styles.statusPending}`}>{submission.completed ? 'Completed' : 'Pending'}</span></td>
                <td>{submission.completed ? <span className={styles.scoreValue}>{submission.average.toFixed(1)}</span> : <span className={styles.scoreDash}>—</span>}</td>
                <td><span className={submission.completed ? styles.actionView : styles.actionEvaluate} onClick={() => navigate('/judge/score/' + submission.submissionId)}>{submission.completed ? 'Edit/View' : 'Evaluate →'}</span></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default AssignedSubmissions;
