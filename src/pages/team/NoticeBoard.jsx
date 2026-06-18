import React from 'react';
import { Card } from 'react-bootstrap';
import { Clock } from 'lucide-react';
import { noticesList } from '../../data/mockData';
import styles from './NoticeBoard.module.css';

const NoticeBoard = () => {
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

  return (
    <div className="py-2">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Notice Board</h1>
        <div className={styles.pageSubtitle}>
          Recent announcements from organizers and mentors
        </div>
      </div>

      <div className={styles.noticeList}>
        {noticesList.map((notice) => (
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
              </h5>
              <p className={styles.noticeContent}>{notice.content}</p>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NoticeBoard;
