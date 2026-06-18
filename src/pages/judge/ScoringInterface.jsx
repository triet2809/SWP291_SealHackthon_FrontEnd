import React, { useState } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { File, FileText, Image, FileArchive, Video } from 'lucide-react';
import { judgeSubmissionDetails } from '../../data/mockData';
import styles from './ScoringInterface.module.css';

const ScoringInterface = () => {
  const navigate = useNavigate();
  const details = judgeSubmissionDetails;
  
  // State for the 4 criteria
  const [innovation, setInnovation] = useState(0);
  const [execution, setExecution] = useState(0);
  const [uiux, setUiux] = useState(0);
  const [practicality, setPracticality] = useState(0);

  // Calculate average
  const averageScore = Math.round((Number(innovation) + Number(execution) + Number(uiux) + Number(practicality)) / 4);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Evaluation submitted! Final Score: ${averageScore}/100`);
    navigate('/judge/submissions');
  };

  const getFileIcon = (type) => {
    switch(type) {
      case 'PDF': return <FileText size={20} className={styles.fileIcon} />;
      case 'Image': return <Image size={20} className={styles.fileIcon} />;
      case 'Archive': return <FileArchive size={20} className={styles.fileIcon} />;
      case 'Video': return <Video size={20} className={styles.fileIcon} />;
      default: return <File size={20} className={styles.fileIcon} />;
    }
  };

  return (
    <div className="py-2">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Scoring Interface</h1>
        <div className={styles.pageSubtitle}>
          Review materials and evaluate the submission
        </div>
      </div>

      <Row>
        {/* Left Pane: Submission Dossier */}
        <Col lg={7} className="mb-4 mb-lg-0">
          <Card className={styles.dossierCard}>
            <div className={styles.teamHeader}>
              <h2 className={styles.teamName}>{details.teamName}</h2>
              <div className={styles.projectName}>Project: {details.project}</div>
            </div>

            <div className={styles.sectionTitle}>Project Overview</div>
            <p className={styles.description}>{details.description}</p>
            <div className="mb-2">
              {details.techStack.map((tech, index) => (
                <span key={index} className={styles.techBadge}>{tech}</span>
              ))}
            </div>

            <div className={styles.sectionTitle}>Team Roster</div>
            <ul className={styles.rosterList}>
              {details.roster.map((member, index) => (
                <li key={index} className={styles.rosterItem}>
                  <span className={styles.rosterName}>{member.name}</span>
                  <span className={styles.rosterRole}>{member.role}</span>
                </li>
              ))}
            </ul>

            <div className={styles.sectionTitle}>Submitted Materials</div>
            <div className={styles.fileList}>
              {details.files.map((file) => (
                <div key={file.id} className={styles.fileCard}>
                  <div className={styles.fileInfo}>
                    {getFileIcon(file.type)}
                    <div>
                      <div className={styles.fileName}>{file.name}</div>
                      <div className={styles.fileMeta}>{file.type} &bull; {file.size}</div>
                    </div>
                  </div>
                  <button className={styles.downloadBtn}>View</button>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Right Pane: Scoring Form */}
        <Col lg={5}>
          <Card className={styles.scoringCard}>
            <div className={styles.finalScoreBox}>
              <div className={styles.scoreLabel}>Final Average Score</div>
              <div className={styles.scoreValue}>{averageScore}<span style={{fontSize: '1.25rem', color: '#86efac'}}>/100</span></div>
            </div>

            <Form onSubmit={handleSubmit}>
              <div className={styles.criteriaGroup}>
                <div className={styles.criteriaHeader}>
                  <span className={styles.criteriaTitle}>1. Innovation & Creativity</span>
                  <span className={styles.criteriaScore}>{innovation}/100</span>
                </div>
                <Form.Range className={styles.customRange} min="0" max="100" value={innovation} onChange={(e) => setInnovation(e.target.value)} />
              </div>

              <div className={styles.criteriaGroup}>
                <div className={styles.criteriaHeader}>
                  <span className={styles.criteriaTitle}>2. Technical Execution</span>
                  <span className={styles.criteriaScore}>{execution}/100</span>
                </div>
                <Form.Range className={styles.customRange} min="0" max="100" value={execution} onChange={(e) => setExecution(e.target.value)} />
              </div>

              <div className={styles.criteriaGroup}>
                <div className={styles.criteriaHeader}>
                  <span className={styles.criteriaTitle}>3. UI/UX Design</span>
                  <span className={styles.criteriaScore}>{uiux}/100</span>
                </div>
                <Form.Range className={styles.customRange} min="0" max="100" value={uiux} onChange={(e) => setUiux(e.target.value)} />
              </div>

              <div className={styles.criteriaGroup}>
                <div className={styles.criteriaHeader}>
                  <span className={styles.criteriaTitle}>4. Practicality & Impact</span>
                  <span className={styles.criteriaScore}>{practicality}/100</span>
                </div>
                <Form.Range className={styles.customRange} min="0" max="100" value={practicality} onChange={(e) => setPracticality(e.target.value)} />
              </div>

              <div className={styles.feedbackGroup}>
                <div className={styles.feedbackLabel}>Private Notes (Optional)</div>
                <textarea className={styles.feedbackTextarea} placeholder="Notes for your reference only..."></textarea>
              </div>

              <div className={styles.actionRow}>
                <Button type="submit" className={styles.submitBtn}>
                  Submit Evaluation
                </Button>
                <Button variant="link" className={styles.cancelBtn} onClick={() => navigate('/judge/submissions')}>
                  Cancel
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ScoringInterface;
