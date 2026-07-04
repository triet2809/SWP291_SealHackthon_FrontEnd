import React, { useEffect, useState } from 'react';
import { Row, Col, Card, ProgressBar, Spinner, Alert } from 'react-bootstrap';
import { Code, Globe, FileText, ExternalLink } from 'lucide-react';
import { getMyTeams, getTrack, getSubmissions } from '../../api/hackathonApi';
import styles from './MyTeam.module.css';

const MyTeam = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [team, setTeam] = useState(null);
  const [trackName, setTrackName] = useState('');
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const teams = await getMyTeams();
        const list = Array.isArray(teams) ? teams : teams?.content || [];
        const current = list[0] || null;
        if (!active) return;
        setTeam(current);
        if (current?.trackId) {
          try {
            const track = await getTrack(current.trackId);
            if (active) setTrackName(track?.name || '');
          } catch { /* track optional */ }
        }
        if (current?.id) {
          try {
            const subs = await getSubmissions({ teamId: current.id });
            const subList = subs?.content || subs || [];
            if (active) setSubmission(subList[0] || null);
          } catch { /* submission optional */ }
        }
      } catch (e) {
        if (active) setError(e.message || 'Failed to load team');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const getResourceIcon = (type) => {
    switch (type) {
      case 'github': return <Code size={16} />;
      case 'globe': return <Globe size={16} />;
      case 'file': return <FileText size={16} />;
      default: return <ExternalLink size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="my-3">{error}</Alert>;
  }

  if (!team) {
    return <Alert variant="info" className="my-3">You are not part of any team yet.</Alert>;
  }

  // Derive resources from submission links (BE has no dedicated resources list).
  const resources = [
    submission?.repoUrl && { id: 1, name: 'GitHub Repository', type: 'github', url: submission.repoUrl },
    submission?.demoUrl && { id: 2, name: 'Live Demo', type: 'globe', url: submission.demoUrl },
    submission?.reportUrl && { id: 3, name: 'Project Docs', type: 'file', url: submission.reportUrl },
    submission?.slideUrl && { id: 4, name: 'Design Files', type: 'external', url: submission.slideUrl },
  ].filter(Boolean);

  const filledLinks = [submission?.repoUrl, submission?.demoUrl, submission?.slideUrl, submission?.reportUrl].filter(Boolean).length;
  const progress = submission ? Math.round((filledLinks / 4) * 100) : 0;
  const project = submission?.teamName || team.name;

  return (
    <div className="py-2">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Team</h1>
        <div className={styles.pageSubtitle}>
          {team.name}{trackName ? ` · ${trackName}` : ''}
        </div>
      </div>

      <Row className="g-4">
        {/* Left Column: Project Overview */}
        <Col lg={8}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <h5 className={styles.cardTitle}>Project Overview</h5>

              <div className={styles.projectTitle}>{project}</div>
              <div className={styles.projectSubtitle}>{trackName || 'Hackathon Project'}</div>

              <p className={styles.projectDescription}>
                {submission?.apiMetadata && submission.apiMetadata !== '{}'
                  ? submission.apiMetadata
                  : 'Submission details and project summary will appear here once your team submits.'}
              </p>

              <div className={styles.techStack}>
                {(trackName ? [trackName] : []).map((tech, index) => (
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
                  <span className={styles.progressValue}>{progress}%</span>
                </div>
                <ProgressBar
                  now={progress}
                  variant="primary"
                  style={{ height: '6px' }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column: Resources & Members */}
        <Col lg={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <h5 className={styles.cardTitle}>Resources</h5>

              <div className={styles.resourcesList}>
                {resources.length === 0 && (
                  <div className="text-muted small">No resources submitted yet.</div>
                )}
                {resources.map((resource) => (
                  <a href={resource.url} key={resource.id} target="_blank" rel="noreferrer" className={styles.resourceLink}>
                    {getResourceIcon(resource.type)}
                    <span>{resource.name}</span>
                  </a>
                ))}
              </div>

              <div className={styles.divider}></div>

              <h5 className={styles.cardTitle} style={{ marginBottom: '1rem' }}>Team Leader</h5>

              {(() => {
                const leader = (team.members || []).find((m) => m.role === 'leader') || (team.members || [])[0];
                if (!leader) return <div className="text-muted small">No members.</div>;
                const initials = (leader.fullName || leader.email || 'U')
                  .split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
                return (
                  <div className={styles.mentorCard}>
                    <div className={styles.mentorAvatar}>{initials}</div>
                    <div>
                      <div className={styles.mentorName}>{leader.fullName || leader.email}</div>
                      <div className={styles.mentorRole}>{leader.role}</div>
                    </div>
                  </div>
                );
              })()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MyTeam;
