import React, { useState } from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { users } from '../../data/mockData';
import styles from './JudgeProfile.module.css';

const JudgeProfile = () => {
  const user = users.judge;
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    universityId: user.universityId,
    department: user.department,
    position: user.position,
    phone: user.phone
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  return (
    <div className="py-2">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Profile</h1>
        <div className={styles.pageSubtitle}>
          Manage your account information
        </div>
      </div>

      <Card className={styles.profileCard}>
        <Card.Body className="p-4 p-md-5">
          
          <div className={styles.profileHeaderInfo}>
            <div className={styles.avatarLarge}>
              {user.initials}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user.name}</div>
              <div className={styles.userSpecialty}>{user.specialty}</div>
              <div className={styles.roleBadge}>{user.role}</div>
            </div>
          </div>

          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={6} className="mb-3 mb-md-0">
                <Form.Group>
                  <Form.Label className={styles.formLabel}>Full Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name"
                    value={formData.name} 
                    onChange={handleChange}
                    className={styles.formControl}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className={styles.formLabel}>Email Address</Form.Label>
                  <Form.Control 
                    type="email" 
                    name="email"
                    value={formData.email} 
                    onChange={handleChange}
                    className={styles.formControl}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6} className="mb-3 mb-md-0">
                <Form.Group>
                  <Form.Label className={styles.formLabel}>University ID</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="universityId"
                    value={formData.universityId} 
                    onChange={handleChange}
                    className={styles.formControl}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className={styles.formLabel}>Department</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="department"
                    value={formData.department} 
                    onChange={handleChange}
                    className={styles.formControl}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6} className="mb-3 mb-md-0">
                <Form.Group>
                  <Form.Label className={styles.formLabel}>Title / Position</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="position"
                    value={formData.position} 
                    onChange={handleChange}
                    className={styles.formControl}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className={styles.formLabel}>Phone</Form.Label>
                  <Form.Control 
                    type="tel" 
                    name="phone"
                    value={formData.phone} 
                    onChange={handleChange}
                    className={styles.formControl}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" className={styles.saveBtn}>
              Save Changes
            </Button>
          </Form>

        </Card.Body>
      </Card>
    </div>
  );
};

export default JudgeProfile;
