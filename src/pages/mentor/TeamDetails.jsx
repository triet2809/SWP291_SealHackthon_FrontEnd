import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { mentorTeamDetails } from '../../data/mockData';
import styles from './TeamDetails.module.css';

const TeamDetails = () => {
  
  const getStatusColorClass = (progress) => {
    if (progress >= 80) return { text: styles.statusGreen, bg: styles.bgGreen };
    if (progress >= 60) return { text: styles.statusOrange, bg: styles.bgOrange };
    return { text: styles.statusRed, bg: styles.bgRed };
  };

  return (
    <div className="py-2">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Team Details</h1>
        <div className={styles.pageSubtitle}>
          Detailed overview of your assigned teams
        </div>
      </div>

      {mentorTeamDetails.map((team) => {
        const statusColors = getStatusColorClass(team.project.progress);

        return (
          <div key={team.id} className={styles.teamSection}>
            <div className={styles.sectionHeader}>
              {team.teamInfo.name} <span className={styles.sectionCategory}>· {team.teamInfo.category}</span>
            </div>

            <Row>
              <Col md={7} className="mb-4 mb-md-0">
                <Card className={styles.detailCard}>
                  <Card.Body className="p-4">
                    <h3 className={styles.cardTitle}>Project Details</h3>
                    
                    <div className={styles.projectTitleLabel}>Title</div>
                    <div className={styles.projectTitle}>{team.project.title}</div>
                    <div className={styles.projectSubtitle}>{team.project.subtitle}</div>
                    
                    <div className={styles.projectDescriptionLabel}>Description</div>
                    <div className={styles.projectDescription}>{team.project.description}</div>
                    
                    <div className={styles.tagList}>
                      {team.project.tags.map((tag, idx) => (
                        <span key={idx} className={styles.techTag}>{tag}</span>
                      ))}
                    </div>

                    <div className={styles.progressContainer}>
                      <div className={styles.progressHeader}>
                        <span className={styles.progressLabel}>Overall Progress</span>
                        <span className={`${styles.progressStatus} ${statusColors.text}`}>
                          {team.project.progress}% - {team.project.status}
                        </span>
                      </div>
                      <div className={styles.progressBarContainer}>
                        <div 
                          className={`${styles.progressBarFill} ${statusColors.bg}`}
                          style={{ width: `${team.project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={5}>
                <Card className={styles.detailCard}>
                  <Card.Body className="p-4">
                    <h3 className={styles.cardTitle}>Team Roster</h3>
                    
                    <div className={styles.rosterList}>
                      {team.roster.map((member) => (
                        <div key={member.id} className={styles.rosterItem}>
                          <div className={styles.memberAvatar}>{member.initials}</div>
                          <div className={styles.memberInfo}>
                            <span className={styles.memberName}>{member.name}</span>
                            <span className={styles.memberRole}>{member.role}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        );
      })}
    </div>
  );
};

export default TeamDetails;
