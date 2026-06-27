import React from 'react';
import { Card, Table, Badge, Button, Row, Col } from 'react-bootstrap';
import { Trophy, Calendar, ExternalLink, Award } from 'lucide-react';

const StudentDashboard = () => {
  // Mock data for previous hackathons the student has participated in
  const participateHistory = [
    {
      id: 1,
      name: 'Global AI Hackathon 2025',
      date: 'March 2025',
      role: 'Backend Developer',
      team: 'Neural Nexus',
      achievement: 'Top 10 Finalist',
      status: 'Completed'
    },
    {
      id: 2,
      name: 'CodeFest Winter 2024',
      date: 'December 2024',
      role: 'Fullstack Developer',
      team: 'ByteBuilders',
      achievement: 'Best Technical Implementation',
      status: 'Completed'
    },
    {
      id: 3,
      name: 'FinTech Challenge',
      date: 'August 2024',
      role: 'Frontend Developer',
      team: 'Solo Participant',
      achievement: 'Participant',
      status: 'Completed'
    }
  ];

  return (
    <div className="py-2">
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Student Dashboard</h1>
        <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Welcome back! Here is an overview of your hackathon journey.</div>
      </div>

      <Row className="g-4 mb-4">
        {/* Quick Stats */}
        <Col md={4}>
          <Card className="h-100" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="d-flex align-items-center gap-3 p-4">
              <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary" style={{ width: '48px', height: '48px' }}>
                <Trophy size={24} />
              </div>
              <div>
                <div className="text-muted small fw-medium text-uppercase mb-1" style={{ letterSpacing: '0.5px' }}>Total Hackathons</div>
                <div className="h3 fw-bold mb-0">3</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="h-100" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="d-flex align-items-center gap-3 p-4">
              <div className="d-flex align-items-center justify-content-center rounded-circle bg-warning bg-opacity-10 text-warning" style={{ width: '48px', height: '48px' }}>
                <Award size={24} />
              </div>
              <div>
                <div className="text-muted small fw-medium text-uppercase mb-1" style={{ letterSpacing: '0.5px' }}>Awards Won</div>
                <div className="h3 fw-bold mb-0">2</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <Card.Body className="p-4">
          <div className="d-flex align-items-center gap-2 mb-4">
            <Calendar size={20} className="text-primary" />
            <h5 className="fw-bold mb-0">Participation History</h5>
          </div>

          <div className="table-responsive">
            <Table className="mb-0 align-middle" hover>
              <thead>
                <tr>
                  <th className="border-top-0 border-bottom text-muted fw-medium py-3">Event Name</th>
                  <th className="border-top-0 border-bottom text-muted fw-medium py-3">Date</th>
                  <th className="border-top-0 border-bottom text-muted fw-medium py-3">Team / Role</th>
                  <th className="border-top-0 border-bottom text-muted fw-medium py-3">Achievement</th>
                  <th className="border-top-0 border-bottom text-muted fw-medium py-3 text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {participateHistory.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3">
                      <div className="fw-bold" style={{ color: 'var(--cf-text-primary)' }}>{item.name}</div>
                      <Badge bg="success" className="mt-1">{item.status}</Badge>
                    </td>
                    <td className="py-3 text-muted">{item.date}</td>
                    <td className="py-3">
                      <div className="fw-medium text-dark">{item.team}</div>
                      <div className="text-muted small">{item.role}</div>
                    </td>
                    <td className="py-3">
                      {item.achievement !== 'Participant' ? (
                        <div className="d-flex align-items-center gap-2 text-warning fw-bold">
                          <Trophy size={16} /> {item.achievement}
                        </div>
                      ) : (
                        <span className="text-muted">{item.achievement}</span>
                      )}
                    </td>
                    <td className="py-3 text-end">
                      <Button variant="outline-primary" size="sm" className="d-flex align-items-center gap-1 ms-auto">
                        View Details <ExternalLink size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default StudentDashboard;
