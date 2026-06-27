import React, { useState } from 'react';
import { Card, Button, Form, Row, Col, Alert, Badge } from 'react-bootstrap';
import { Plus, Trash2, Users, Save, AlertTriangle, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { users } from '../../data/mockData';

const CreateTeam = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  
  const currentUser = users.team;

  const [teamData, setTeamData] = useState({
    name: '',
    project: '',
    category: 'AI/ML',
    description: ''
  });

  const [members, setMembers] = useState([
    { id: currentUser.id, name: currentUser.name, studentId: 'FPT-2024-001', email: currentUser.email, major: 'Software Engineering' }
  ]);

  const handleTeamChange = (e) => {
    const { name, value } = e.target;
    setTeamData(prev => ({ ...prev, [name]: value }));
  };

  const handleMemberChange = (id, field, value) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const addMember = () => {
    if (members.length < 4) {
      setMembers([...members, { 
        id: Date.now(), 
        name: '', 
        studentId: '', 
        email: '', 
        major: '' 
      }]);
    }
  };

  const removeMember = (id) => {
    // Prevent removing the team leader (current user)
    if (id === currentUser.id) return;
    setMembers(members.filter(m => m.id !== id));
  };

  const generateInviteCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'SEAL-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = generateInviteCode();
    setInviteCode(code);
    setSuccess(true);
  };

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Create a Team</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Register a new team for the hackathon and invite your teammates.</div>
        </div>
      </div>

      {success ? (
        <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <Card.Body className="p-5 text-center">
            <div className="d-inline-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle mb-4" style={{ width: '80px', height: '80px' }}>
              <Save size={40} />
            </div>
            <h3 className="fw-bold mb-3" style={{ color: 'var(--cf-text-primary)' }}>Team Registered Successfully!</h3>
            <p className="mb-4 text-muted mx-auto" style={{ maxWidth: '500px' }}>
              Your team <strong>{teamData.name}</strong> has been created. You are the designated Team Leader.
            </p>
            
            <div className="p-4 rounded mb-4 mx-auto" style={{ maxWidth: '400px', backgroundColor: 'var(--cf-bg-main)', border: '1px solid var(--cf-border-color)' }}>
              <div className="text-muted mb-2 text-uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Your Team Invite Code</div>
              <div className="d-flex align-items-center justify-content-center gap-2">
                <Key size={20} className="text-primary" />
                <span className="fs-3 fw-bold text-primary" style={{ letterSpacing: '2px' }}>{inviteCode}</span>
              </div>
            </div>

            <p className="text-muted mb-4 small">
              Share this code with your teammates so they can join your team. 
              <br/>Remember, your team must have exactly 4 members before the event starts.
            </p>

            <Button 
              variant="primary" 
              className="px-4 py-2"
              onClick={() => navigate('/team/dashboard')}
            >
              Go to Team Dashboard
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Row className="g-4">
            <Col lg={4}>
              <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: 'var(--cf-text-primary)' }}>
                    <Users size={20} className="text-primary" /> Team Information
                  </h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--cf-text-secondary)' }}>Team Name *</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="name"
                      value={teamData.name}
                      onChange={handleTeamChange}
                      required
                      placeholder="Enter team name"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--cf-text-secondary)' }}>Project Name *</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="project"
                      value={teamData.project}
                      onChange={handleTeamChange}
                      required
                      placeholder="Enter project name"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--cf-text-secondary)' }}>Category</Form.Label>
                    <Form.Select 
                      name="category"
                      value={teamData.category}
                      onChange={handleTeamChange}
                    >
                      <option value="AI/ML">AI/ML</option>
                      <option value="Web Dev">Web Dev</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Mobile App">Mobile App</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--cf-text-secondary)' }}>Project Description</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={4}
                      name="description"
                      value={teamData.description}
                      onChange={handleTeamChange}
                      placeholder="Brief overview of the project..."
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={8}>
              <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0" style={{ color: 'var(--cf-text-primary)' }}>
                      Team Members ({members.length}/4)
                    </h5>
                    {members.length < 4 && (
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="d-flex align-items-center gap-1"
                        onClick={addMember}
                      >
                        <Plus size={16} /> Add Member Slot
                      </Button>
                    )}
                  </div>

                  {members.length < 4 && (
                    <Alert variant="warning" className="py-2 mb-4 d-flex align-items-center gap-2" style={{ fontSize: '0.875rem' }}>
                      <AlertTriangle size={16} />
                      <strong>Important Rule:</strong> Teams must have exactly 4 contestants. You can add them here now, or generate an Invite Code after registering to have them join later. Teams with fewer than 4 members before the event starts will be flagged for disqualification.
                    </Alert>
                  )}

                  <div className="d-flex flex-column gap-3">
                    {members.map((member, index) => {
                      const isLeader = index === 0;
                      return (
                        <div 
                          key={member.id} 
                          className="p-3 rounded position-relative" 
                          style={{ border: isLeader ? '1px solid var(--cf-status-info)' : '1px solid var(--cf-border-color)', backgroundColor: 'var(--cf-bg-main)' }}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="fw-bold" style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>
                              Member {index + 1} {isLeader && <Badge bg="info" className="ms-2">Team Leader (You)</Badge>}
                            </span>
                            {!isLeader && (
                              <Button 
                                variant="link" 
                                className="text-danger p-0" 
                                onClick={() => removeMember(member.id)}
                                title="Remove Member"
                              >
                                <Trash2 size={16} />
                              </Button>
                            )}
                          </div>

                          <Row className="g-3">
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label style={{ fontSize: '0.875rem', color: 'var(--cf-text-secondary)' }}>Full Name *</Form.Label>
                                <Form.Control 
                                  type="text" 
                                  required
                                  disabled={isLeader}
                                  placeholder="John Doe"
                                  value={member.name}
                                  onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label style={{ fontSize: '0.875rem', color: 'var(--cf-text-secondary)' }}>Student ID *</Form.Label>
                                <Form.Control 
                                  type="text" 
                                  required
                                  disabled={isLeader}
                                  placeholder="FPT-2026-1234"
                                  value={member.studentId}
                                  onChange={(e) => handleMemberChange(member.id, 'studentId', e.target.value)}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label style={{ fontSize: '0.875rem', color: 'var(--cf-text-secondary)' }}>Email Address *</Form.Label>
                                <Form.Control 
                                  type="email" 
                                  required
                                  disabled={isLeader}
                                  placeholder="john.doe@fpt.edu.vn"
                                  value={member.email}
                                  onChange={(e) => handleMemberChange(member.id, 'email', e.target.value)}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label style={{ fontSize: '0.875rem', color: 'var(--cf-text-secondary)' }}>Major / Department</Form.Label>
                                <Form.Control 
                                  type="text" 
                                  disabled={isLeader}
                                  placeholder="Computer Science"
                                  value={member.major}
                                  onChange={(e) => handleMemberChange(member.id, 'major', e.target.value)}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </div>
                      );
                    })}
                  </div>

                  <div className="d-flex justify-content-end mt-4 pt-3" style={{ borderTop: '1px solid var(--cf-border-color)' }}>
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="px-4 py-2 d-flex align-items-center gap-2"
                      disabled={success}
                    >
                      <Save size={18} /> Register Team & Get Invite Code
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
      )}
    </div>
  );
};

export default CreateTeam;
