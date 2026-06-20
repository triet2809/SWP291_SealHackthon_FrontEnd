import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Users, Tag, MessageSquare, Calendar } from 'lucide-react';
import { mentorTeams } from '../../data/mockData';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Avatar from '../../components/ui/Avatar';
import styles from './MentorDashboard.module.css';

const MentorDashboard = () => {
  return (
    <div className={styles.dashboard}>
      <div className="mb-4">
        <h1 className={styles.greeting}>Good morning, Dr. Patel</h1>
        <p className="text-muted mb-0">
          2 teams need your attention today
        </p>
      </div>

      <Row className="g-4 mb-4">
        <Col md={3}>
          <StatCard 
            icon={Users} iconColor="#a855f7" iconBg="#f3e8ff"
            value="3" title="Assigned Teams" subtitle="Neural Nexus, ByteBuilders, CodeCraft"
          />
        </Col>
        <Col md={3}>
          <StatCard 
            icon={Tag} iconColor="#3b82f6" iconBg="#dbeafe"
            value="2" title="Active Categories" subtitle="AI/ML · Data Science"
          />
        </Col>
        <Col md={3}>
          <StatCard 
            icon={MessageSquare} iconColor="#10b981" iconBg="#d1fae5"
            value="12" title="Feedback Given" subtitle="This week · 4 unresolved"
          />
        </Col>
        <Col md={3}>
          <StatCard 
            icon={Calendar} iconColor="#f59e0b" iconBg="#fef3c7"
            value="5" title="Sessions This Week" subtitle="Next: Tomorrow 10:00 AM"
          />
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={8}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className={styles.cardTitle}>Team Progress</h5>
                <span className={styles.teamsCountBadge}>3 teams</span>
              </div>
              
              <div className={styles.teamProgressList}>
                {mentorTeams.map(team => (
                  <div key={team.id} className={styles.teamProgressItem}>
                    <Avatar 
                      initials={team.name.charAt(0)} 
                      bg={team.color === 'success' ? '#d1fae5' : team.color === 'warning' ? '#fef3c7' : '#fee2e2'} 
                      color={team.color === 'success' ? '#10b981' : team.color === 'warning' ? '#f59e0b' : '#ef4444'} 
                    />
                    <div className={styles.teamInfo}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <div>
                          <div className={styles.teamName}>{team.name}</div>
                          <div className={styles.projectName}>{team.project}</div>
                        </div>
                        <StatusBadge status={team.status} />
                      </div>
                      
                      <div className={styles.progressTrack}>
                        <div 
                          className={`${styles.progressBar} bg-${team.color}`} 
                          style={{ width: `${team.complete}%` }}
                        ></div>
                      </div>
                      <div className={styles.progressText}>{team.complete}% complete</div>
                    </div>
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
                <h5 className={styles.cardTitle}>Upcoming Sessions</h5>
                
                <div className={styles.sessionList}>
                  <div className={styles.sessionItem}>
                    <div className={styles.sessionTeam}>ByteBuilders</div>
                    <div className={styles.sessionTime}>Tomorrow, 10:00 AM</div>
                    <div className={styles.sessionType}>Code Review</div>
                  </div>
                  <div className={styles.sessionItem}>
                    <div className={styles.sessionTeam}>Neural Nexus</div>
                    <div className={styles.sessionTime}>June 18, 2:00 PM</div>
                    <div className={styles.sessionTypeSession2}>Pitch Practice</div>
                  </div>
                  <div className={styles.sessionItem}>
                    <div className={styles.sessionTeam}>CodeCraft</div>
                    <div className={styles.sessionTime}>June 18, 4:00 PM</div>
                    <div className={styles.sessionTypeSession3}>Architecture Review</div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card className="flex-grow-1">
              <Card.Body>
                <h5 className={styles.cardTitle}>Recent Feedback</h5>
                
                <div className={styles.feedbackList}>
                  <div className={styles.feedbackItem}>
                    <div className="d-flex justify-content-between">
                      <div className={styles.feedbackTeam}>Neural Nexus</div>
                      <div className={styles.feedbackTime}>June 15</div>
                    </div>
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

export default MentorDashboard;
