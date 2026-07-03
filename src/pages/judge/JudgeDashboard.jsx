import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Card, Col, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, FileText, Star, Tag } from 'lucide-react';
import { getJudgeSubmissions, getScores } from '../../api/hackathonApi';
import { getMe } from '../../api/userApi';
import { getInitials } from '../../utils/authUser';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Avatar from '../../components/ui/Avatar';
import styles from './JudgeDashboard.module.css';

const pageItems = (data) => data?.content || data || [];

const JudgeDashboard = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true, error: '', user: null, submissions: [], scores: [] });

  useEffect(() => {
    (async () => {
      try {
        const me = await getMe();
        const user = me.value;
        const submissions = pageItems(await getJudgeSubmissions(user.id));
        const scores = pageItems(await getScores({ judgeId: user.id, size: 500 }).catch(() => []));
        setState({ loading: false, error: '', user, submissions, scores });
      } catch (e) {
        setState((s) => ({ ...s, loading: false, error: e.message || 'Cannot load judge dashboard' }));
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const scoredSubmissionIds = new Set(state.scores.map((s) => s.submissionId));
    const completed = state.submissions.filter((s) => scoredSubmissionIds.has(s.submissionId || s.id)).length;
    const pending = Math.max(0, state.submissions.length - completed);
    const scoreValues = state.scores.map((s) => Number(s.score || 0)).filter(Number.isFinite);
    const avg = scoreValues.length ? scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length : 0;
    const tracks = new Set(state.submissions.map((s) => s.trackName || s.trackId).filter(Boolean));
    return { completed, pending, avg, tracks: tracks.size, scoredSubmissionIds, scoreValues };
  }, [state.scores, state.submissions]);

  if (state.loading) return <div className="py-4 text-center"><Spinner size="sm" className="me-2" />Loading dashboard...</div>;
  if (state.error) return <Alert variant="danger">{state.error}</Alert>;

  return (
    <div className={styles.dashboard}>
      <div className="mb-4">
        <h1 className={styles.greeting}>Good morning, {state.user?.fullName || state.user?.email || 'Judge'}</h1>
        <p className="text-muted mb-0">{stats.pending} submissions pending evaluation</p>
      </div>

      <Row className="g-4 mb-4">
        <Col md={3}><StatCard icon={FileText} iconColor="#ef4444" iconBg="#fee2e2" value={stats.pending} title="Pending Reviews" subtitle={`${state.submissions.length} total assigned`} /></Col>
        <Col md={3}><StatCard icon={CheckCircle} iconColor="#10b981" iconBg="#d1fae5" value={stats.completed} title="Completed" subtitle={`${state.submissions.length ? Math.round((stats.completed / state.submissions.length) * 100) : 0}% evaluated`} /></Col>
        <Col md={3}><StatCard icon={Tag} iconColor="#3b82f6" iconBg="#dbeafe" value={stats.tracks} title="Tracks" subtitle="Assigned scope" /></Col>
        <Col md={3}><StatCard icon={Star} iconColor="#f59e0b" iconBg="#fef3c7" value={stats.avg ? stats.avg.toFixed(1) : '-'} title="Avg. Score" subtitle="Out of 100 points" /></Col>
      </Row>

      <Row className="g-4">
        <Col md={8}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className={styles.cardTitle}>Submission Queue</h5>
                <span className={styles.pendingBadge}>{stats.pending} pending</span>
              </div>
              <div className={styles.submissionList}>
                {state.submissions.length === 0 ? <div className="text-muted">No assigned submissions.</div> : state.submissions.map((sub) => {
                  const id = sub.submissionId || sub.id;
                  const done = stats.scoredSubmissionIds.has(id);
                  return (
                    <div key={id} className={styles.submissionItem}>
                      <Avatar initials={getInitials(sub.teamName || sub.projectName || 'T')} bg="var(--cf-bg-main)" color="var(--cf-status-success)" />
                      <div className={styles.submissionInfo}>
                        <div className={styles.teamName}>{sub.teamName || sub.team || 'Team'}</div>
                        <div className={styles.projectName}>{sub.projectName || sub.roundName || id}</div>
                      </div>
                      <div className={styles.submissionTags}>
                        <StatusBadge type={sub.trackName || 'Track'} />
                        <StatusBadge type={done ? 'Scored' : 'Pending'} />
                      </div>
                      <button className={styles.reviewBtn} onClick={() => navigate(done ? `/judge/evaluation/${id}` : `/judge/score/${id}`)}>{done ? 'View →' : 'Review →'}</button>
                    </div>
                  );
                })}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <div className="d-flex flex-column gap-4 h-100">
            <Card>
              <Card.Body>
                <h5 className={styles.cardTitle}>Evaluation Progress</h5>
                <div className={styles.progressHeader}><div className={styles.progressValue}>{stats.completed}<span className={styles.progressTotal}>/{state.submissions.length}</span></div><div className={styles.progressSubtitle}>Submissions evaluated</div></div>
                <div className="progress mt-4 mb-4" style={{ height: '6px' }}><div className="progress-bar bg-success" style={{ width: `${state.submissions.length ? (stats.completed / state.submissions.length) * 100 : 0}%` }}></div></div>
                <div className={styles.progressStats}>
                  <div className={styles.statRow}><span className={styles.statLabel}>Completed</span><span className={styles.statValueSuccess}>{stats.completed}</span></div>
                  <div className={styles.statRow}><span className={styles.statLabel}>Pending</span><span className={styles.statValueDanger}>{stats.pending}</span></div>
                  <div className={styles.statRow}><span className={styles.statLabel}>Score items</span><span className={styles.statValueInfo}>{state.scores.length}</span></div>
                </div>
              </Card.Body>
            </Card>

            <Card className="flex-grow-1">
              <Card.Body>
                <h5 className={styles.cardTitle}>Scoring Summary</h5>
                <div className={styles.scoringList}>
                  <div className={styles.scoringItem}><span className={styles.scoringLabel}>Highest Score</span><span className={styles.scoringValueSuccess}>{stats.scoreValues.length ? Math.max(...stats.scoreValues).toFixed(1) : '-'}/100</span></div>
                  <div className={styles.scoringItem}><span className={styles.scoringLabel}>Lowest Score</span><span className={styles.scoringValueDanger}>{stats.scoreValues.length ? Math.min(...stats.scoreValues).toFixed(1) : '-'}/100</span></div>
                  <div className={styles.scoringItem}><span className={styles.scoringLabel}>Average</span><span className={styles.scoringValue}>{stats.avg ? stats.avg.toFixed(1) : '-'}/100</span></div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default JudgeDashboard;
