import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, Tag, Star } from 'lucide-react';
import { judgeSubmissions } from '../../data/mockData';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Avatar from '../../components/ui/Avatar';
import styles from './JudgeDashboard.module.css';

const JudgeDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.dashboard}>
      <div className="mb-4">
        <h1 className={styles.greeting}>Good morning, Prof. Kim</h1>
        <p className="text-muted mb-0">
          7 submissions pending evaluation
        </p>
      </div>

      <Row className="g-4 mb-4">
        <Col md={3}>
          <StatCard 
            icon={FileText} iconColor="#ef4444" iconBg="#fee2e2"
            value="7" title="Pending Reviews" subtitle="12 total assigned"
          />
        </Col>
        <Col md={3}>
          <StatCard 
            icon={CheckCircle} iconColor="#10b981" iconBg="#d1fae5"
            value="5" title="Completed" subtitle="41.7% evaluated"
          />
        </Col>
        <Col md={3}>
          <StatCard 
            icon={Tag} iconColor="#3b82f6" iconBg="#dbeafe"
            value="2" title="Categories" subtitle="AI/ML · Data Science"
          />
        </Col>
        <Col md={3}>
          <StatCard 
            icon={Star} iconColor="#f59e0b" iconBg="#fef3c7"
            value="78.4" title="Avg. Score" subtitle="Out of 100 points"
          />
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={8}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className={styles.cardTitle}>Submission Queue</h5>
                <span className={styles.pendingBadge}>7 pending</span>
              </div>
              
              <div className={styles.submissionList}>
                {judgeSubmissions.map(sub => (
                  <div key={sub.id} className={styles.submissionItem}>
                    <Avatar 
                      initials={sub.initials} 
                      bg="var(--cf-bg-main)"
                      color="var(--cf-status-success)" // Example color, ideally derived
                    />
                    <div className={styles.submissionInfo}>
                      <div className={styles.teamName}>{sub.team}</div>
                      <div className={styles.projectName}>{sub.project}</div>
                    </div>
                    <div className={styles.submissionTags}>
                      <StatusBadge type={sub.category} />
                      <StatusBadge type={sub.priority} />
                    </div>
                    <button 
                      className={styles.reviewBtn}
                      onClick={() => navigate(`/judge/score/${sub.id}`)}
                    >
                      Review →
                    </button>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <div className="d-flex flex-column gap-4 h-100">
            <Card>
              <Card.Body>
                <h5 className={styles.cardTitle}>Evaluation Progress</h5>
                
                <div className={styles.progressHeader}>
                  <div className={styles.progressValue}>5<span className={styles.progressTotal}>/12</span></div>
                  <div className={styles.progressSubtitle}>Submissions evaluated</div>
                </div>

                <div className="progress mt-4 mb-4" style={{ height: '6px' }}>
                  <div className="progress-bar bg-success" style={{ width: '41.7%' }}></div>
                </div>

                <div className={styles.progressStats}>
                  <div className={styles.statRow}>
                    <span className={styles.statLabel}>Completed</span>
                    <span className={styles.statValueSuccess}>5</span>
                  </div>
                  <div className={styles.statRow}>
                    <span className={styles.statLabel}>Pending</span>
                    <span className={styles.statValueDanger}>7</span>
                  </div>
                  <div className={styles.statRow}>
                    <span className={styles.statLabel}>In Progress</span>
                    <span className={styles.statValueInfo}>0</span>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card className="flex-grow-1">
              <Card.Body>
                <h5 className={styles.cardTitle}>Scoring Summary</h5>
                
                <div className={styles.scoringList}>
                  <div className={styles.scoringItem}>
                    <span className={styles.scoringLabel}>Highest Score</span>
                    <span className={styles.scoringValueSuccess}>91/100</span>
                  </div>
                  <div className={styles.scoringItem}>
                    <span className={styles.scoringLabel}>Lowest Score</span>
                    <span className={styles.scoringValueDanger}>62/100</span>
                  </div>
                  <div className={styles.scoringItem}>
                    <span className={styles.scoringLabel}>Average</span>
                    <span className={styles.scoringValue}>78.4/100</span>
                  </div>
                  <div className={styles.scoringItem}>
                    <span className={styles.scoringLabel}>Std. Deviation</span>
                    <span className={styles.scoringValue}>±10.2</span>
                  </div>
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
