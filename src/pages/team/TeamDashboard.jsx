import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Clock, Users, FileText, Award, Calendar, CheckCircle } from 'lucide-react';
import { teamData, eventDetails, notifications } from '../../data/mockData';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import styles from './TeamDashboard.module.css';

const TeamDashboard = () => {
  return (
    <div className={styles.dashboard}>
      <div className="mb-4">
        <h1 className={styles.greeting}>Good morning, Alex</h1>
        <p className="text-muted mb-0">
          SEAL Hackathon 2026 — {eventDetails.date} • <span className="text-primary fw-medium">{eventDetails.daysRemaining} days to go</span>
        </p>
      </div>

      <Row className="g-4 mb-4">
        <Col md={3}>
          <StatCard 
            icon={Clock} iconColor="#3b82f6" iconBg="#dbeafe"
            value={eventDetails.daysRemaining} title="Days to Hackathon" subtitle={`Event starts ${eventDetails.date.split('–')[0]}`}
          />
        </Col>
        <Col md={3}>
          <StatCard 
            icon={Users} iconColor="#a855f7" iconBg="#f3e8ff"
            value={teamData.memberCount} title="Team Size" subtitle={`${teamData.teamName} - Full team`}
          />
        </Col>
        <Col md={3}>
          <StatCard 
            icon={FileText} iconColor="#f59e0b" iconBg="#fef3c7"
            value={teamData.status} title="Submission" subtitle="Deadline June 19, 11:59 PM"
          />
        </Col>
        <Col md={3}>
          <StatCard 
            icon={Award} iconColor="#10b981" iconBg="#d1fae5"
            value={teamData.category} title="Category" subtitle="12 competing teams"
          />
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <h5 className={styles.cardTitle}>Upcoming Deadlines</h5>
              <div className={styles.timeline}>
                <div className={`${styles.timelineItem} ${styles.timelineDanger}`}>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineTitle}>Team Registration Close</div>
                    <div className={styles.timelineTimeDanger}>Today, 11:59 PM</div>
                  </div>
                </div>
                <div className={`${styles.timelineItem} ${styles.timelineDanger}`}>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineTitle}>Final Submission</div>
                    <div className={styles.timelineTimeDanger}>June 19, 11:59 PM</div>
                  </div>
                </div>
                <div className={styles.timelineItem}>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineTitle}>Hackathon Opens</div>
                    <div className={styles.timelineTime}>June 20, 9:00 AM</div>
                  </div>
                </div>
                <div className={styles.timelineItem}>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineTitle}>Demo Day</div>
                    <div className={styles.timelineTime}>June 22, 2:00 PM</div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <h5 className={styles.cardTitle}>Team {teamData.teamName}</h5>
              
              <div className="mb-4">
                <div className="text-muted small mb-1">Project</div>
                <div className="fw-semibold text-dark">{teamData.project}</div>
                <div className="text-muted small">{teamData.description}</div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small">Submission progress</span>
                  <span className="fw-semibold small">{teamData.progress}%</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-primary" 
                    role="progressbar" 
                    style={{ width: `${teamData.progress}%` }} 
                    aria-valuenow={teamData.progress} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>

              <div className="d-flex gap-2 mt-auto">
                <StatusBadge type={teamData.category} />
                <StatusBadge type={`${teamData.memberCount} Members`} />
                <StatusBadge status={teamData.status} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <h5 className={styles.cardTitle}>Notifications</h5>
              <div className={styles.notificationsList}>
                {notifications.map(notif => (
                  <div key={notif.id} className={styles.notificationItem}>
                    <div className={`${styles.notificationIcon} ${styles[`bg-${notif.type}`]}`}>
                      {notif.type === 'info' && <FileText size={14} />}
                      {notif.type === 'event' && <Calendar size={14} />}
                      {notif.type === 'success' && <Users size={14} />}
                    </div>
                    <div>
                      <div className={styles.notificationMessage}>{notif.message}</div>
                      <div className={styles.notificationTime}>{notif.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <h5 className={styles.cardTitle}>Competition Progress</h5>
          <div className={styles.stepperContainer}>
            <div className={styles.stepperLinesContainer}>
              {[
                { completed: true },
                { completed: true },
                { completed: false },
                { completed: false }
              ].map((s, i) => (
                <div key={i} className={`${styles.stepperLine} ${s.completed ? styles.lineCompleted : ''}`}></div>
              ))}
            </div>

            <div className={styles.stepperSteps}>
              {[
                { step: 1, label: 'Registration', completed: true },
                { step: 2, label: 'Team Formation', completed: true },
                { step: 3, label: 'Submission', active: true },
                { step: 4, label: 'Evaluation', completed: false },
                { step: 5, label: 'Awards', completed: false }
              ].map((s) => (
                <div key={s.step} className={styles.stepItem}>
                  <div className={`${styles.stepCircle} ${s.completed ? styles.completed : s.active ? styles.active : ''}`}>
                    {s.completed ? <CheckCircle size={16} /> : s.step}
                  </div>
                  <div className={`${styles.stepLabel} ${s.active || s.completed ? styles.labelActive : ''}`}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TeamDashboard;
