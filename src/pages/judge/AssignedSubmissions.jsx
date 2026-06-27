import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { judgeAssignedSubmissions } from '../../data/mockData';
import styles from './AssignedSubmissions.module.css';

const AssignedSubmissions = () => {
  const navigate = useNavigate();

  // Calculate totals
  const total = judgeAssignedSubmissions.length;
  const completed = judgeAssignedSubmissions.filter(s => s.status === 'Completed').length;
  const pending = total - completed;

  return (
    <div className="py-2">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Assigned Submissions</h1>
        <div className={styles.pageSubtitle}>
          {total} total · {completed} completed · {pending} pending
        </div>
      </div>

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
            {judgeAssignedSubmissions.map((submission) => (
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
