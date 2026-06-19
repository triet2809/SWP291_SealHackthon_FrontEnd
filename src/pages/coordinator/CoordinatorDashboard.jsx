import React from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import { Calendar, Users, Upload, Clock, Activity, Award, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import { eventDetails } from '../../data/mockData';

const CoordinatorDashboard = () => {
  const stats = [
    { title: 'Total Events', value: '3', icon: Calendar, color: 'primary' },
    { title: 'Active Events', value: '1', icon: Activity, color: 'success' },
    { title: 'Registered Teams', value: '42', icon: Users, color: 'info' },
    { title: 'Pending Approvals', value: '12', icon: CheckCircle, color: 'warning' },
    { title: 'Assigned Judges', value: '18', icon: Award, color: 'danger' },
    { title: 'Assigned Mentors', value: '24', icon: Star, color: 'purple' },
    { title: 'Submissions', value: '156', icon: Upload, color: 'primary' },
    { title: 'Pending Incidents', value: '2', icon: AlertTriangle, color: 'danger' },
  ];

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Coordinator Dashboard</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>
            System overview and quick metrics for {eventDetails.name}
          </div>
        </div>
      </div>

      <Row className="g-4 mb-4">
        {stats.map((stat, index) => (
          <Col md={3} sm={6} key={index}>
            <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <Card.Body className="d-flex align-items-center p-4">
                <div 
                  className={`d-flex align-items-center justify-content-center me-3`}
                  style={{ 
                    width: '48px', height: '48px', borderRadius: '12px',
                    backgroundColor: `var(--bs-${stat.color}-bg-subtle, rgba(0,0,0,0.05))`,
                    color: `var(--bs-${stat.color})`
                  }}
                >
                  <stat.icon size={24} />
                </div>
                <div>
                  <h3 className="h4 fw-bold mb-0" style={{ color: 'var(--cf-text-primary)' }}>{stat.value}</h3>
                  <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>{stat.title}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4" style={{ color: 'var(--cf-text-primary)' }}>Recent Activities</h5>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center justify-content-between p-3 rounded" style={{ backgroundColor: 'var(--cf-bg-main)' }}>
                  <div className="d-flex align-items-center gap-3">
                    <Activity size={18} className="text-primary" />
                    <div>
                      <div className="fw-medium" style={{ color: 'var(--cf-text-primary)' }}>New Team Registered: "DataWizards"</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--cf-text-secondary)' }}>2 hours ago</div>
                    </div>
                  </div>
                  <Badge bg="success">Team</Badge>
                </div>
                <div className="d-flex align-items-center justify-content-between p-3 rounded" style={{ backgroundColor: 'var(--cf-bg-main)' }}>
                  <div className="d-flex align-items-center gap-3">
                    <CheckCircle size={18} className="text-warning" />
                    <div>
                      <div className="fw-medium" style={{ color: 'var(--cf-text-primary)' }}>5 User Accounts Pending Approval</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--cf-text-secondary)' }}>4 hours ago</div>
                    </div>
                  </div>
                  <Badge bg="warning" text="dark">Action Required</Badge>
                </div>
                <div className="d-flex align-items-center justify-content-between p-3 rounded" style={{ backgroundColor: 'var(--cf-bg-main)' }}>
                  <div className="d-flex align-items-center gap-3">
                    <Upload size={18} className="text-info" />
                    <div>
                      <div className="fw-medium" style={{ color: 'var(--cf-text-primary)' }}>Submission received from "Neural Nexus"</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--cf-text-secondary)' }}>Yesterday</div>
                    </div>
                  </div>
                  <Badge bg="info">Submission</Badge>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4" style={{ color: 'var(--cf-text-primary)' }}>System Status</h5>
              <div className="d-flex flex-column gap-4">
                <div>
                  <div className="d-flex justify-content-between mb-1">
                    <span style={{ fontSize: '0.875rem', color: 'var(--cf-text-primary)', fontWeight: '500' }}>Platform Load</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--cf-text-secondary)' }}>24%</span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div className="progress-bar bg-success" role="progressbar" style={{ width: '24%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="d-flex justify-content-between mb-1">
                    <span style={{ fontSize: '0.875rem', color: 'var(--cf-text-primary)', fontWeight: '500' }}>Storage Capacity</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--cf-text-secondary)' }}>68%</span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div className="progress-bar bg-primary" role="progressbar" style={{ width: '68%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="d-flex justify-content-between mb-1">
                    <span style={{ fontSize: '0.875rem', color: 'var(--cf-text-primary)', fontWeight: '500' }}>Judging Progress</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--cf-text-secondary)' }}>12%</span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div className="progress-bar bg-warning" role="progressbar" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CoordinatorDashboard;
