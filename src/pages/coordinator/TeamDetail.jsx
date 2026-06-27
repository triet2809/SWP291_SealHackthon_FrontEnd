import React from 'react';
import { Card, Badge, Button, Row, Col } from 'react-bootstrap';
import { ArrowLeft, Users, FolderOpen, Target, Activity } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { mentorAssignedTeams } from '../../data/mockData';

const TeamDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Find team by ID or use a fallback for mock display
  const teamId = parseInt(id) || 1;
  const team = mentorAssignedTeams.find(t => t.id === teamId) || mentorAssignedTeams[0];

  return (
    <div className="py-2">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Button variant="link" className="p-0 text-muted" onClick={() => navigate('/coordinator/teams')}>
          <ArrowLeft size={24} />
        </Button>
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>{team.name}</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Team ID: #{team.id}</div>
        </div>
        <Badge bg={
          team.status === 'On Track' ? 'success' :
          team.status === 'Needs Attention' ? 'warning' :
          team.status === 'Disqualified' ? 'danger' : 'primary'
        } className="ms-auto px-3 py-2 fs-6">
          {team.status || 'Registered'}
        </Badge>
      </div>

      <Row className="g-4 mb-4">
        <Col md={8}>
          <Card className="h-100" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4 border-bottom pb-3">Project Information</h5>
              
              <div className="mb-4">
                <div className="text-muted small fw-medium mb-1 d-flex align-items-center gap-2">
                  <Target size={16} /> Project Title
                </div>
                <div className="fw-medium fs-5" style={{ color: 'var(--cf-text-primary)' }}>{team.project}</div>
              </div>

              <div className="mb-0">
                <div className="text-muted small fw-medium mb-1 d-flex align-items-center gap-2">
                  <FolderOpen size={16} /> Category
                </div>
                <div><Badge bg="secondary" className="px-2 py-1">{team.category}</Badge></div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4 border-bottom pb-3">Team Information</h5>
              
              <div className="mb-4">
                <div className="text-muted small fw-medium mb-1 d-flex align-items-center gap-2">
                  <Users size={16} /> Team Size
                </div>
                <div className="fw-bold fs-4">{team.members} <span className="fs-6 text-muted fw-normal">Members</span></div>
              </div>

              <div className="mb-0">
                <div className="text-muted small fw-medium mb-1 d-flex align-items-center gap-2">
                  <Activity size={16} /> Current Status
                </div>
                <div className="fw-medium text-dark">{team.status}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TeamDetail;
