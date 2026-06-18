import React from 'react';
import { Row, Col, Card, ProgressBar } from 'react-bootstrap';
import { Code, Globe, FileText, ExternalLink } from 'lucide-react';
import { teamData } from '../../data/mockData';
import styles from './MyTeam.module.css';

const MyTeam = () => {
  const getResourceIcon = (type) => {
    switch (type) {
      case 'github': return <Code size={16} />;
      case 'globe': return <Globe size={16} />;
      case 'file': return <FileText size={16} />;
      default: return <ExternalLink size={16} />;
    }
  };

  return (
    <div className="py-2">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Team</h1>
        <div className={styles.pageSubtitle}>
          {teamData.teamName} · {teamData.category}
        </div>
      </div>

      <Row className="g-4">
        {/* Left Column: Project Overview */}
        <Col lg={8}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <h5 className={styles.cardTitle}>Project Overview</h5>
              
              <div className={styles.projectTitle}>{teamData.project}</div>
              <div className={styles.projectSubtitle}>{teamData.description}</div>
              
              <p className={styles.projectDescription}>
                {teamData.fullDescription}
              </p>
              
              <div className={styles.techStack}>
                {teamData.techStack.map((tech, index) => (
                  <span 
                    key={index} 
                    className={`${styles.techBadge} ${index === 0 ? styles.primary : ''}`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="mt-4 pt-2">
                <div className={styles.progressLabel}>
                  <span>Submission completeness</span>
                  <span className={styles.progressValue}>{teamData.progress}%</span>
                </div>
                <ProgressBar 
                  now={teamData.progress} 
                  variant="primary" 
                  style={{ height: '6px' }} 
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column: Resources & Mentor */}
        <Col lg={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <h5 className={styles.cardTitle}>Resources</h5>
              
              <div className={styles.resourcesList}>
                {teamData.resources.map((resource) => (
                  <a href={resource.url} key={resource.id} className={styles.resourceLink}>
                    {getResourceIcon(resource.type)}
                    <span>{resource.name}</span>
                  </a>
                ))}
              </div>
              
              <div className={styles.divider}></div>
              
              <h5 className={styles.cardTitle} style={{ marginBottom: '1rem' }}>Assigned Mentor</h5>
              
              <div className={styles.mentorCard}>
                <div className={styles.mentorAvatar}>
                  {teamData.mentor.initials}
                </div>
                <div>
                  <div className={styles.mentorName}>{teamData.mentor.name}</div>
                  <div className={styles.mentorRole}>{teamData.mentor.role}</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MyTeam;
