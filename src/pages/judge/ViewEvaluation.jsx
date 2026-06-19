import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ViewEvaluation.module.css';
import { judgeAssignedSubmissions } from '../../data/mockData';

const ViewEvaluation = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Find the submission based on id
  const submission = judgeAssignedSubmissions.find(s => s.id === parseInt(id)) || judgeAssignedSubmissions[3]; // Fallback to QuantumLeap
  
  const scoreValue = submission.score ? parseInt(submission.score.split('/')[0]) : 84;

  const evalData = {
    teamName: submission.teamName,
    project: submission.project,
    scores: {
      innovation: scoreValue + 4,
      execution: scoreValue - 2,
      uiux: scoreValue - 8,
      practicality: scoreValue + 6
    },
    finalScore: scoreValue,
    notes: "Strong foundation. The project architecture is well thought out, but the user experience could use some polish to make the application more accessible. Good potential for real-world application."
  };

  return (
    <div className="py-2">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Evaluation Results</h1>
          <div className={styles.pageSubtitle}>
            Review your previously submitted evaluation
          </div>
        </div>
        <span className={styles.backBtn} onClick={() => navigate('/judge/submissions')}>
          &larr; Back to Submissions
        </span>
      </div>

      <Card className={styles.viewCard}>
        <div className={styles.teamHeader}>
          <div>
            <h3 className={styles.teamName}>{evalData.teamName}</h3>
            <div className={styles.projectName}>Project: {evalData.project}</div>
          </div>
          <div className={styles.finalScoreBox}>
            <div className={styles.scoreLabel}>Final Average Score</div>
            <div className={styles.scoreValue}>{evalData.finalScore}<span style={{fontSize: '1.25rem'}}>/100</span></div>
          </div>
        </div>

        <h5 className="mb-4" style={{fontWeight: 600}}>Score Breakdown</h5>
        
        <div className={styles.breakdownGrid}>
          <div className={styles.breakdownItem}>
            <span className={styles.breakdownLabel}>Innovation & Creativity</span>
            <span className={styles.breakdownScore}>{evalData.scores.innovation}<span style={{fontSize: '0.875rem', color: '#6b7280'}}>/100</span></span>
          </div>
          <div className={styles.breakdownItem}>
            <span className={styles.breakdownLabel}>Technical Execution</span>
            <span className={styles.breakdownScore}>{evalData.scores.execution}<span style={{fontSize: '0.875rem', color: '#6b7280'}}>/100</span></span>
          </div>
          <div className={styles.breakdownItem}>
            <span className={styles.breakdownLabel}>UI/UX Design</span>
            <span className={styles.breakdownScore}>{evalData.scores.uiux}<span style={{fontSize: '0.875rem', color: '#6b7280'}}>/100</span></span>
          </div>
          <div className={styles.breakdownItem}>
            <span className={styles.breakdownLabel}>Practicality & Impact</span>
            <span className={styles.breakdownScore}>{evalData.scores.practicality}<span style={{fontSize: '0.875rem', color: '#6b7280'}}>/100</span></span>
          </div>
        </div>

        <div className={styles.notesSection}>
          <div className={styles.notesLabel}>Private Notes</div>
          <div className={styles.notesContent}>
            {evalData.notes}
          </div>
        </div>

        <div className={styles.actionRow}>
          <Button 
            className={styles.reevaluateBtn}
            onClick={() => navigate(`/judge/score/${id}`)}
          >
            Re-evaluate Project
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ViewEvaluation;
