import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Shield, Tag } from 'lucide-react';
import { mentorCategories } from '../../data/mockData';
import styles from './AssignedCategories.module.css';

const AssignedCategories = () => {
  
  const renderIcon = (iconName, color) => {
    const iconClass = color === 'blue' ? styles.iconBlue : styles.iconPurple;
    const IconComponent = iconName === 'Shield' ? Shield : Tag;
    
    return (
      <div className={`${styles.iconWrapper} ${iconClass}`}>
        <IconComponent size={24} />
      </div>
    );
  };

  return (
    <div className="py-2">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Assigned Categories</h1>
        <div className={styles.pageSubtitle}>
          2 active categories under your mentorship
        </div>
      </div>

      <Row>
        {mentorCategories.map((category) => {
          const progressPercentage = Math.round((category.submittedTeams / category.totalTeams) * 100);
          
          return (
            <Col md={6} key={category.id} className="mb-4">
              <Card className={styles.categoryCard}>
                <Card.Body className="p-4 d-flex flex-column">
                  
                  <div className={styles.cardHeader}>
                    {renderIcon(category.icon, category.color)}
                    <div>
                      <h3 className={styles.categoryName}>{category.name}</h3>
                      <p className={styles.categoryDesc}>{category.description}</p>
                    </div>
                  </div>

                  <div className={styles.statsGrid}>
                    <div className={styles.statBox}>
                      <span className={styles.statValue}>{category.totalTeams}</span>
                      <span className={styles.statLabel}>Total Teams</span>
                    </div>
                    <div className={styles.statBox}>
                      <span className={styles.statValue}>{category.submittedTeams}</span>
                      <span className={styles.statLabel}>Submitted</span>
                    </div>
                  </div>

                  <div className={styles.progressSection}>
                    <div className={styles.progressBarContainer}>
                      <div 
                        className={`${styles.progressBarFill} ${category.color === 'blue' ? styles.fillBlue : styles.fillPurple}`}
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <p className={styles.progressLabel}>{progressPercentage}% submission rate</p>
                  </div>

                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default AssignedCategories;
