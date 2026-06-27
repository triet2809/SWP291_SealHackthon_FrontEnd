import React, { useState } from 'react';
import { Card, Button, Form, Badge, Row, Col } from 'react-bootstrap';
import { ArrowLeft, Users, Mail, Bookmark } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { mentorAssignedTeams } from '../../data/mockData';

const MentorAssign = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock mentors array
  const mentors = [
    { id: 1, name: 'Dr. Priya Patel', email: 'p.patel@fpt.edu.vn', category: 'AI/ML', assignedTeams: ['Neural Nexus', 'CodeCraft', 'ByteBuilders'], status: 'Active' },
    { id: 2, name: 'Marcus Wright', email: 'm.wright@industry.com', category: 'Web Dev', assignedTeams: ['CloudNative', 'DataCraft'], status: 'Active' },
    { id: 3, name: 'Sarah Lee', email: 's.lee@startup.io', category: 'Data Science', assignedTeams: ['PredictIt', 'Visionary'], status: 'Inactive' },
  ];

  const mentorId = parseInt(id) || 1;
  const mentor = mentors.find(m => m.id === mentorId) || mentors[0];

  const [selectedTeams, setSelectedTeams] = useState(
    mentorAssignedTeams.filter(t => mentor.assignedTeams.includes(t.name)).map(t => t.id)
  );

  const handleToggleTeam = (teamId) => {
    if (selectedTeams.includes(teamId)) {
      setSelectedTeams(selectedTeams.filter(tId => tId !== teamId));
    } else {
      setSelectedTeams([...selectedTeams, teamId]);
    }
  };

  const handleSave = () => {
    alert('Mentor assignments saved successfully!');
    navigate('/coordinator/mentors');
  };

  return (
    <div className="py-2">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Button variant="link" className="p-0 text-muted" onClick={() => navigate('/coordinator/mentors')}>
          <ArrowLeft size={24} />
        </Button>
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Assign Teams to Mentor</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Select which teams this mentor will guide</div>
        </div>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '1.5rem' }}>
        <Card.Body className="p-4 d-flex justify-content-between align-items-center">
          <div className="d-flex gap-4 align-items-center">
            <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary" style={{ width: '64px', height: '64px' }}>
              <Users size={32} />
            </div>
            <div>
              <h4 className="fw-bold mb-1">{mentor.name}</h4>
              <div className="text-muted d-flex gap-3 align-items-center">
                <span><Mail size={14} className="me-1" /> {mentor.email}</span>
                <span><Bookmark size={14} className="me-1" /> {mentor.category}</span>
                <Badge bg={mentor.status === 'Active' ? 'success' : 'secondary'}>{mentor.status}</Badge>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <Card.Header className="bg-transparent border-bottom p-4">
          <h5 className="fw-bold mb-0">Available Teams</h5>
          <div className="text-muted small mt-1">Select the teams you want to assign to this mentor.</div>
        </Card.Header>
        <Card.Body className="p-4">
          <Row className="g-3">
            {mentorAssignedTeams.map(team => {
              const isSelected = selectedTeams.includes(team.id);
              return (
                <Col md={6} lg={4} key={team.id}>
                  <div 
                    className={`p-3 rounded border ${isSelected ? 'border-primary bg-primary bg-opacity-10' : 'border-light'}`}
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                    onClick={() => handleToggleTeam(team.id)}
                  >
                    <Form.Check 
                      type="checkbox" 
                      id={`team-${team.id}`}
                      label={
                        <div className="ms-2">
                          <div className="fw-bold text-dark">{team.name}</div>
                          <div className="text-muted small">{team.project}</div>
                          <Badge bg="secondary" className="mt-2">{team.category}</Badge>
                        </div>
                      }
                      checked={isSelected}
                      onChange={() => {}} // Handled by parent div
                    />
                  </div>
                </Col>
              );
            })}
          </Row>
        </Card.Body>
        <Card.Footer className="bg-transparent border-top p-4 d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={() => navigate('/coordinator/mentors')}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save Assignments ({selectedTeams.length})</Button>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default MentorAssign;
