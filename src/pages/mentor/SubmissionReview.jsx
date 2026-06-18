import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { mentorSubmissions } from '../../data/mockData';
import styles from './SubmissionReview.module.css';

const SubmissionReview = () => {
  const navigate = useNavigate();

  const getStatusClass = (status) => {
    return status === 'Pending Review' ? styles.statusPending : styles.statusReviewed;
  };

  return (
    <div className="py-2">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Submission Review</h1>
        <div className={styles.pageSubtitle}>
          Review team submissions as a mentor
        </div>
      </div>

      <div className={styles.submissionList}>
        {mentorSubmissions.map((submission) => (
          <Card key={submission.id} className={styles.submissionCard}>
            <Card.Body className="p-4">
              
              <div className={styles.cardHeader}>
                <div className={styles.projectInfo}>
                  <div className={styles.teamAndProject}>
                    {submission.teamName} — {submission.projectName}
                  </div>
                  <div className={styles.submissionDetails}>
                    Submitted {submission.submittedDate} · {submission.version}
                  </div>
                </div>
                
                <div className={`${styles.statusBadge} ${getStatusClass(submission.status)}`}>
                  {submission.status}
                </div>
              </div>

              <div className={styles.actionRow}>
                <Button variant="outline-secondary" className={styles.viewBtn}>
                  View Files
                </Button>
                <Button className={styles.feedbackBtn} onClick={() => navigate('/mentor/feedback')}>
                  Give Feedback
                </Button>
              </div>

            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubmissionReview;
