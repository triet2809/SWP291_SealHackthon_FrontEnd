import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getScores, getSubmission } from '../../api/hackathonApi';
import { getMe } from '../../api/userApi';
import styles from './ViewEvaluation.module.css';

const pageItems = (data) => data?.content || data || [];

const ViewEvaluation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, error: '', user: null, submission: null, scores: [] });

  useEffect(() => {
    (async () => {
      try {
        const me = await getMe();
        const user = me.value;
        const [submission, scores] = await Promise.all([
          getSubmission(id),
          getScores({ submissionId: id, judgeId: user.id, size: 500 }).then(pageItems).catch(() => [])
        ]);
        setState({ loading: false, error: '', user, submission, scores });
      } catch (e) {
        setState((s) => ({ ...s, loading: false, error: e.message || 'Cannot load evaluation' }));
      }
    })();
  }, [id]);

  const summary = useMemo(() => {
    const scores = state.scores.map((s) => Number(s.score || 0)).filter(Number.isFinite);
    const finalScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const notes = state.scores.map((s) => s.comment).filter(Boolean).join('\n\n');
    return { finalScore, notes };
  }, [state.scores]);

  if (state.loading) return <div className="py-4 text-center"><Spinner size="sm" className="me-2" />Loading evaluation...</div>;
  if (state.error) return <Alert variant="danger">{state.error}</Alert>;

  return (
    <div className="py-2">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Evaluation Results</h1>
          <div className={styles.pageSubtitle}>Review your submitted evaluation</div>
        </div>
        <span className={styles.backBtn} onClick={() => navigate('/judge/submissions')}>&larr; Back to Submissions</span>
      </div>

      <Card className={styles.viewCard}>
        <div className={styles.teamHeader}>
          <div>
            <h3 className={styles.teamName}>{state.submission?.teamName || state.submission?.teamId || 'Submission'}</h3>
            <div className={styles.projectName}>Submission: {state.submission?.id || id}</div>
          </div>
          <div className={styles.finalScoreBox}>
            <div className={styles.scoreLabel}>Final Average Score</div>
            <div className={styles.scoreValue}>{state.scores.length ? summary.finalScore.toFixed(1) : '-'}<span style={{ fontSize: '1.25rem' }}>/100</span></div>
          </div>
        </div>

        <h5 className="mb-4" style={{ fontWeight: 600 }}>Score Breakdown</h5>
        {state.scores.length === 0 ? <Alert variant="info">Bạn chưa chấm submission này.</Alert> : <div className={styles.breakdownGrid}>{state.scores.map((score) => <div key={score.id} className={styles.breakdownItem}><span className={styles.breakdownLabel}>{score.criterionName || score.criterionId}</span><span className={styles.breakdownScore}>{Number(score.score || 0).toFixed(1)}<span style={{ fontSize: '0.875rem', color: '#6b7280' }}>/100</span></span></div>)}</div>}

        <div className={styles.notesSection}>
          <div className={styles.notesLabel}>Private Notes</div>
          <div className={styles.notesContent}>{summary.notes || 'No notes submitted.'}</div>
        </div>

        <div className={styles.actionRow}>
          <Button className={styles.reevaluateBtn} onClick={() => navigate(`/judge/score/${id}`)}>Re-evaluate Project</Button>
        </div>
      </Card>
    </div>
  );
};

export default ViewEvaluation;
