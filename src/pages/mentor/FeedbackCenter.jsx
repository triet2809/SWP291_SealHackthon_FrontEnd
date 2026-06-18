import React, { useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { mentorAssignedTeams, mentorFeedbackHistory } from '../../data/mockData';
import styles from './FeedbackCenter.module.css';

const FeedbackCenter = () => {
  const [activeTeamId, setActiveTeamId] = useState(mentorAssignedTeams[0]?.id || 1);
  const activeTeam = mentorAssignedTeams.find(t => t.id === activeTeamId);
  const feedbackHistory = mentorFeedbackHistory[activeTeamId] || [];

  return (
    <div className="py-2">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Feedback Center</h1>
        <div className={styles.pageSubtitle}>
          Send and manage feedback for your teams
        </div>
      </div>

      <Row>
        {/* Left Sidebar - Team Selection */}
        <Col md={3} className="mb-4 mb-md-0">
          <div className={styles.teamList}>
            {mentorAssignedTeams.map((team) => (
              <div 
                key={team.id}
                className={`${styles.teamBtn} ${activeTeamId === team.id ? styles.activeTeamBtn : ''}`}
                onClick={() => setActiveTeamId(team.id)}
              >
                <div className={styles.teamInitials}>{team.initials}</div>
                <div className={styles.teamNameText}>{team.name}</div>
              </div>
            ))}
          </div>
        </Col>

        {/* Right Main Area - Feedback Thread */}
        <Col md={9}>
          <Card className={styles.feedbackMainCard}>
            <Card.Body className="p-4">
              <div className={styles.cardHeader}>
                Feedback — {activeTeam?.name}
              </div>

              {/* History List */}
              <div className={styles.historyContainer}>
                {feedbackHistory.map((item) => (
                  <div key={item.id} className={styles.historyCard}>
                    <div className={styles.historyMeta}>
                      <span className={styles.historyAuthor}>{item.author}</span>
                      <span className={styles.historyDate}>{item.date}</span>
                    </div>
                    <div className={styles.historyMessage}>
                      {item.message}
                    </div>
                  </div>
                ))}
              </div>

              {/* New Feedback Form */}
              <div className={styles.newFeedbackSection}>
                <div className={styles.newFeedbackLabel}>
                  New Feedback for {activeTeam?.name}
                </div>
                <textarea 
                  className={styles.feedbackTextarea}
                  placeholder={`Write constructive feedback for ${activeTeam?.name}...`}
                />
                <button className={styles.sendBtn}>
                  Send Feedback
                </button>
              </div>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FeedbackCenter;
