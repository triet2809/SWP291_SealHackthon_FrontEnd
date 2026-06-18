import React, { useState } from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { Clock } from 'lucide-react';
import { noticesList, mentorAssignedTeams } from '../../data/mockData';
import styles from './MentorNoticeBoard.module.css';

const MentorNoticeBoard = () => {
  const [localNotices, setLocalNotices] = useState(noticesList);
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [targetAudience, setTargetAudience] = useState('Global');

  const [showForm, setShowForm] = useState(false);

  const getAvatarClass = (role) => {
    switch (role) {
      case 'Judge': return styles.avatarJudge;
      case 'Mentor': return styles.avatarMentor;
      case 'Admin': return styles.avatarAdmin;
      default: return '';
    }
  };

  const getRoleClass = (role) => {
    switch (role) {
      case 'Judge': return styles.roleJudge;
      case 'Mentor': return styles.roleMentor;
      case 'Admin': return styles.roleAdmin;
      default: return '';
    }
  };

  const handlePostNotice = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newNotice = {
      id: Date.now(), // Generate unique ID
      title: title,
      content: content,
      authorName: 'Dr. Priya Patel', // Mocked Mentor Name
      authorRole: 'Mentor',
      authorInitials: 'PP',
      date: 'Just now',
      priority: isImportant ? 'High' : 'Normal',
      target: targetAudience
    };

    // Unshift adds it to the top of the array
    setLocalNotices([newNotice, ...localNotices]);
    
    // Reset Form and hide
    setTitle('');
    setContent('');
    setIsImportant(false);
    setTargetAudience('Global');
    setShowForm(false);
  };

  return (
    <div className="py-2">
      <div className={styles.pageHeader}>
        <div className="d-flex justify-content-between align-items-end">
          <div>
            <h1 className={styles.pageTitle}>Notice Board</h1>
            <div className={styles.pageSubtitle}>
              Post updates to your teams and view global announcements
            </div>
          </div>
          {!showForm && (
            <Button 
              className={styles.postBtn}
              onClick={() => setShowForm(true)}
            >
              + Create Announcement
            </Button>
          )}
        </div>
      </div>

      {/* Post Notice Form */}
      {showForm && (
        <Card className={styles.postCard}>
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 style={{ fontWeight: 600, margin: 0 }}>Create Announcement</h5>
              <Button 
                variant="link" 
                className="text-muted p-0 text-decoration-none"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
            <Form onSubmit={handlePostNotice}>
              <Row className="mb-3">
                <Col md={8}>
                  <Form.Group>
                    <Form.Label className={styles.formLabel}>Title</Form.Label>
                    <Form.Control 
                      type="text" 
                      className={styles.formControl}
                      placeholder="Brief, descriptive title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className={styles.formLabel}>To:</Form.Label>
                  <Form.Select 
                    className={styles.formControl}
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  >
                    <option value="Global">Global (All Teams)</option>
                    <option disabled>──────────</option>
                    {mentorAssignedTeams.map(team => (
                      <option key={team.id} value={team.name}>{team.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className={styles.formLabel}>Message Content</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4} 
                className={styles.formControl}
                placeholder="What do you want to announce?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center">
              <Form.Check 
                type="checkbox"
                id="important-flag"
                label="Flag as Important"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
                className={styles.formLabel}
                style={{ marginBottom: 0 }}
              />
              <Button type="submit" className={styles.postBtn}>
                Post Notice
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      )}

      {/* Notice Feed */}
      <div className={styles.noticeList}>
        {localNotices.map((notice) => (
          <Card 
            key={notice.id} 
            className={`${styles.noticeCard} ${notice.priority === 'High' ? styles.priorityHigh : styles.priorityNormal}`}
          >
            <Card.Body className="p-4">
              <div className={styles.cardHeader}>
                <div className={styles.authorInfo}>
                  <div className={`${styles.avatar} ${getAvatarClass(notice.authorRole)}`}>
                    {notice.authorInitials}
                  </div>
                  <div className={styles.authorDetails}>
                    <span className={styles.authorName}>{notice.authorName}</span>
                    <span className={`${styles.authorRole} ${getRoleClass(notice.authorRole)}`}>
                      {notice.authorRole}
                    </span>
                  </div>
                </div>
                <div className={styles.noticeDate}>
                  <Clock size={12} />
                  {notice.date}
                </div>
              </div>
              
              <h5 className={styles.noticeTitle}>
                {notice.title}
                {notice.priority === 'High' && (
                  <span className={styles.importantIndicator}>Important</span>
                )}
                {notice.target && notice.target !== 'Global' && (
                  <span className={styles.targetBadge}>Targeted: {notice.target}</span>
                )}
              </h5>
              <p className={styles.noticeContent}>{notice.content}</p>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MentorNoticeBoard;
