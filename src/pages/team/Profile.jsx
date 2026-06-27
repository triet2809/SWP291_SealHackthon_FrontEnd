import React from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { users } from '../../data/mockData';
import styles from './Profile.module.css';

const Profile = () => {
  const location = useLocation();
  const isStudent = location.pathname.includes('/student');
  const user = isStudent ? users.student : users.team;

  return (
    <div className="py-2">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Profile</h1>
        <div className={styles.pageSubtitle}>
          Manage your account information
        </div>
      </div>

      <Card className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {user.initials}
          </div>
          <div className={styles.headerInfo}>
            <div className={styles.userName}>{user.name}</div>
            <div className={styles.teamRole}>
              {user.teamRole} · {user.teamName}
            </div>
            <div className={styles.roleBadge}>{user.role}</div>
          </div>
        </div>

        <Card.Body className="p-4">
          <Form>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className={styles.formLabel}>Full Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    defaultValue={user.name} 
                    className={styles.formControl}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className={styles.formLabel}>Email Address</Form.Label>
                  <Form.Control 
                    type="email" 
                    defaultValue={user.email} 
                    className={styles.formControl}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className={styles.formLabel}>University ID</Form.Label>
                  <Form.Control 
                    type="text" 
                    defaultValue={user.universityId} 
                    className={styles.formControl}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className={styles.formLabel}>Department</Form.Label>
                  <Form.Control 
                    type="text" 
                    defaultValue={user.department} 
                    className={styles.formControl}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className={styles.formLabel}>Year of Study</Form.Label>
                  <Form.Control 
                    type="text" 
                    defaultValue={user.yearOfStudy} 
                    className={styles.formControl}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className={styles.formLabel}>Phone</Form.Label>
                  <Form.Control 
                    type="tel" 
                    defaultValue={user.phone} 
                    className={styles.formControl}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" className={styles.saveBtn}>
              Save Changes
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profile;
