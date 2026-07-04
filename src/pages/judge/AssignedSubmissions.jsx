import React, { useEffect, useMemo, useState } from 'react';
import { Card, Table, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getJudgeSubmissions, getScores, markAllNotificationsRead } from '../../api/hackathonApi';
import { getStoredUser, getInitials } from '../../utils/authUser';
import styles from './AssignedSubmissions.module.css';

const asArray = (data) => data?.content || data || [];

const AssignedSubmissions = () => {
  const navigate = useNavigate();
  const user = getStoredUser();
  const judgeId = user?.id;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    markAllNotificationsRead('submissions').catch(() => {});
    if (!judgeId) {
      setError('No logged-in judge found.');
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      try {
        const subs = asArray(await getJudgeSubmissions(judgeId));
        const roundIds = Array.from(new Set(subs.map((s) => s.roundId).filter(Boolean)));
        const scoreLists = await Promise.all(
          roundIds.map((rid) => getScores({ roundId: rid, size: 200 }).catch(() => null))
        );
        const myScores = scoreLists
          .flatMap((r) => asArray(r))
          .filter((sc) => sc.judgeId === judgeId);

        // average this judge's scores per submission
        const bySubmission = {};
        myScores.forEach((sc) => {
          (bySubmission[sc.submissionId] ||= []).push(Number(sc.score));
        });

        const mapped = subs.map((s) => {
          const vals = bySubmission[s.submissionId] || [];
          const scored = vals.length > 0;
          const avg = scored ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
          return {
            id: s.submissionId,
            initials: getInitials(s.teamName),
            teamName: s.teamName,
            project: s.roundName,
            track: s.roundName,
            round: s.roundName,
            submitted: s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : '—',
            status: scored ? 'Completed' : 'Pending',
            score: scored ? `${avg.toFixed(0)}/100` : null,
          };
        });
        if (active) setRows(mapped);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load submissions');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [judgeId]);

  const totals = useMemo(() => {
    const total = rows.length;
    const completed = rows.filter((s) => s.status === 'Completed').length;
    return { total, completed, pending: total - completed };
  }, [rows]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Assigned Submissions</h1>
        <div className={styles.pageSubtitle}>
          {totals.total} total · {totals.completed} completed · {totals.pending} pending
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className={styles.tableCard}>
        <Table responsive className={styles.judgeTable}>
          <thead>
            <tr>
              <th>TEAM</th>
              <th>PROJECT</th>
              <th>TRACK</th>
              <th>ROUND</th>
              <th>SUBMITTED</th>
              <th>STATUS</th>
              <th>SCORE</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-muted py-4">
                  No assigned submissions.
                </td>
              </tr>
            )}
            {rows.map((submission) => (
              <tr key={submission.id}>
                <td>
                  <div className={styles.teamCell}>
                    <div className={`${styles.teamAvatar} ${styles.avatarBg}`}>
                      {submission.initials}
                    </div>
                    <span className={styles.teamName}>{submission.teamName}</span>
                  </div>
                </td>
                <td>{submission.project}</td>
                <td>
                  <span className={styles.categoryBadge} style={{ backgroundColor: 'var(--cf-primary-subtle)', color: 'var(--cf-primary)' }}>{submission.track}</span>
                </td>
                <td>
                  <span className={styles.categoryBadge}>{submission.round}</span>
                </td>
                <td>{submission.submitted}</td>
                <td>
                  <span className={`${styles.statusBadge} ${submission.status === 'Completed' ? styles.statusCompleted : styles.statusPending}`}>
                    {submission.status}
                  </span>
                </td>
                <td>
                  {submission.score ? (
                    <span className={styles.scoreValue}>{submission.score}</span>
                  ) : (
                    <span className={styles.scoreDash}>—</span>
                  )}
                </td>
                <td>
                  {submission.status === 'Pending' ? (
                    <span
                      className={styles.actionEvaluate}
                      onClick={() => navigate('/judge/score/' + submission.id)}
                    >
                      Evaluate &rarr;
                    </span>
                  ) : (
                    <span
                      className={styles.actionView}
                      onClick={() => navigate('/judge/view-evaluation/' + submission.id)}
                    >
                      View
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default AssignedSubmissions;
