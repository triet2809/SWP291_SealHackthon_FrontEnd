import React from 'react';
import { Card } from 'react-bootstrap';
import { scheduleList } from '../../data/mockData';
import styles from './DeadlinesSchedule.module.css';

const DeadlinesSchedule = () => {
  
  const getIndicatorClass = (type) => {
    switch(type) {
      case 'active': return styles.indicatorActive;
      case 'danger': return styles.indicatorDanger;
      case 'success': return styles.indicatorSuccess;
      default: return '';
    }
  };

  const getBadgeClass = (type) => {
    switch(type) {
      case 'active': return styles.badgeActive;
      case 'danger': return styles.badgeDanger;
      case 'success': return styles.badgeSuccess;
      default: return '';
    }
  };

  return (
    <div className="py-2">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Deadlines & Schedule</h1>
        <div className={styles.pageSubtitle}>
          Key dates for SEAL Hackathon 2026
        </div>
      </div>

      <Card className={styles.timelineCard}>
        <Card.Body>
          <div className={styles.timeline}>
            {scheduleList.map((item) => (
              <div key={item.id} className={styles.timelineItem}>
                
                <div className={`${styles.timelineIndicator} ${getIndicatorClass(item.type)}`}>
                  {item.id}
                </div>
                
                <div className={styles.timelineContent}>
                  <div className={styles.timelineHeader}>
                    <span className={styles.timelineDate}>{item.date}</span>
                    <span className={styles.timelineDay}>· {item.day}</span>
                    {item.badge && (
                      <span className={`${styles.statusBadge} ${getBadgeClass(item.type)}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  
                  <ul className={styles.eventList}>
                    {item.events.map((event, index) => (
                      <li key={index} className={styles.eventItem}>
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DeadlinesSchedule;
