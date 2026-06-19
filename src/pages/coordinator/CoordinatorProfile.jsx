import React from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { Mail, Phone, Building, Briefcase } from 'lucide-react';
import { users } from '../../data/mockData';

const CoordinatorProfile = () => {
  const coordinator = users.coordinator;

  return (
    <div className="py-2">
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Coordinator Profile</h1>
        <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Manage your account settings and preferences</div>
      </div>

      <Row className="g-4">
        <Col lg={4}>
          <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="text-center p-4">
              <div 
                className="mx-auto mb-3 d-flex align-items-center justify-content-center text-white fw-bold" 
                style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: 'var(--cf-brand-blue)', fontSize: '2rem' }}
              >
                {coordinator.initials}
              </div>
              <h4 className="fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>{coordinator.name}</h4>
              <p style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }} className="mb-3">{coordinator.position}</p>
              
              <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
                <span className="badge bg-danger">Admin</span>
              </div>

              <div className="text-start">
                <hr style={{ borderColor: 'var(--cf-border-color)' }} />
                <div className="d-flex align-items-center gap-3 mb-3">
                  <Mail size={18} className="text-muted" />
                  <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>{coordinator.email}</div>
                </div>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <Phone size={18} className="text-muted" />
                  <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>{coordinator.phone}</div>
                </div>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <Building size={18} className="text-muted" />
                  <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>{coordinator.department}</div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <Briefcase size={18} className="text-muted" />
                  <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>{coordinator.universityId}</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4" style={{ color: 'var(--cf-text-primary)' }}>Personal Information</h5>
              <Form>
                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-medium" style={{ color: 'var(--cf-text-primary)', fontSize: '0.875rem' }}>Full Name</Form.Label>
                      <Form.Control type="text" defaultValue={coordinator.name} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-medium" style={{ color: 'var(--cf-text-primary)', fontSize: '0.875rem' }}>Email Address</Form.Label>
                      <Form.Control type="email" defaultValue={coordinator.email} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-medium" style={{ color: 'var(--cf-text-primary)', fontSize: '0.875rem' }}>Phone Number</Form.Label>
                      <Form.Control type="tel" defaultValue={coordinator.phone} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-medium" style={{ color: 'var(--cf-text-primary)', fontSize: '0.875rem' }}>Department</Form.Label>
                      <Form.Control type="text" defaultValue={coordinator.department} />
                    </Form.Group>
                  </Col>
                </Row>

                <h5 className="fw-bold mb-3 mt-5" style={{ color: 'var(--cf-text-primary)' }}>System Preferences</h5>
                <div className="mb-4">
                  <Form.Check 
                    type="switch"
                    id="email-notifications"
                    label="Receive email notifications for critical system events"
                    defaultChecked
                    className="mb-2"
                  />
                  <Form.Check 
                    type="switch"
                    id="weekly-reports"
                    label="Generate weekly summary reports automatically"
                    defaultChecked
                  />
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                  <Button variant="light">Cancel</Button>
                  <Button variant="primary">Save Changes</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CoordinatorProfile;
