import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { Clock } from 'lucide-react';
import { noticesList } from '../../data/mockData';
import styles from './JudgeNoticeBoard.module.css';

const JudgeNoticeBoard = () => {
  const [localNotices, setLocalNotices] = useState(noticesList);
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);

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
      authorName: 'Prof. James Kim', // Mocked Judge Name
      authorRole: 'Judge',
      authorInitials: 'JK',
      date: 'Just now',
      priority: isImportant ? 'High' : 'Normal',
      target: 'Global' // Judge notices are always global
    };

    // Unshift adds it to the top of the array
    setLocalNotices([newNotice, ...localNotices]);
    
    // Reset Form and hide
    setTitle('');
    setContent('');
    setIsImportant(false);
    setShowForm(false);
  };

  return (
    <div className="py-2">
      <div className={styles.pageHeader}>
        <div className="d-flex justify-content-between align-items-end">
          <div>
            <h1 className={styles.pageTitle}>Notice Board</h1>
            <div className={styles.pageSubtitle}>
              Post global announcements and view event updates
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
              <h5 style={{ fontWeight: 600, margin: 0 }}>Create Global Announcement</h5>
              <Button 
                variant="link" 
                className="text-muted p-0 text-decoration-none"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
            <Form onSubmit={handlePostNotice}>
              <Form.Group className="mb-3">
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

              <Form.Group className="mb-3">
                <Form.Label className={styles.formLabel}>Message Content</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={4} 
                  className={styles.formControl}
                  placeholder="What do you want to announce globally?"
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
                  style={{ fontSize: '0.875rem', fontWeight: 500 }}
                />
                <Button type="submit" className={styles.submitBtn}>
                  Post Global Notice
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Notices Feed */}
      <div>
        {localNotices.map(notice => (
          <Card 
            key={notice.id} 
            className={`${styles.noticeCard} ${notice.priority === 'High' ? styles.noticeImportant : ''}`}
          >
            <Card.Body className="p-4">
              <div className={styles.noticeHeader}>
                <div>
                  <h4 className={styles.noticeTitle}>
                    {notice.title}
                    {notice.priority === 'High' && (
                      <span className={styles.priorityBadge}>IMPORTANT</span>
                    )}
                  </h4>
                  <div className={styles.noticeMeta}>
                    <div className={styles.authorInfo}>
                      <div className={`${styles.avatar} ${getAvatarClass(notice.authorRole)}`}>
                        {notice.authorInitials}
                      </div>
                      <span className={styles.authorName}>{notice.authorName}</span>
                      <span className={`${styles.authorRole} ${getRoleClass(notice.authorRole)}`}>{notice.authorRole}</span>
                    </div>
                    {notice.target && (
                      <span className={styles.targetBadge}>To: {notice.target}</span>
                    )}
                  </div>
                </div>
                <div className={styles.noticeDate}>
                  <Clock size={14} />
                  {notice.date}
                </div>
              </div>
              
              <p className={styles.noticeContent}>
                {notice.content}
              </p>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JudgeNoticeBoard;
