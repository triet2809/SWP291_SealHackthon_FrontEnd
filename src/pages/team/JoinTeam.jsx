import React, { useState } from 'react';
import { Alert, Card, Button, Form, Row, Col, Badge, InputGroup, Nav, Tab } from 'react-bootstrap';
import { Key, Search, Users, ArrowRight, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { joinTeamByInviteCode } from '../../api/hackathonApi';

const JoinTeam = () => {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState('');
  const [activeTab, setActiveTab] = useState('code');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  // Simulated list of public teams looking for members
  const publicTeams = [
    { id: 1, name: 'DataForge', project: 'Predictive Analytics', members: 3, category: 'Data Science' },
    { id: 2, name: 'Neural Nexus', project: 'EduTrack AI', members: 2, category: 'AI/ML' },
    { id: 3, name: 'WebWeavers', project: 'Campus Connect', members: 3, category: 'Web Dev' },
    { id: 4, name: 'CyberShield', project: 'Zero Trust Auth', members: 1, category: 'Security' }
  ];

  const handleJoinViaCode = async (e) => {
    e.preventDefault();
    if (!inviteCode) return;
    setError('');
    try {
      await joinTeamByInviteCode(inviteCode);
      navigate('/team/dashboard');
    } catch (err) {
      setError(err.message || 'Cannot join team');
    }
  };

  const handleSendRequest = (teamName) => {
    alert(`A request has been sent to the Team Leader of ${teamName}. You will be notified when they accept.`);
  };

  const filteredTeams = publicTeams.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Join a Team</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Use an invite code from your team leader or browse public teams.</div>
        </div>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav variant="pills" className="mb-4 d-flex gap-2">
          <Nav.Item>
            <Nav.Link 
              eventKey="code" 
              className={`px-4 py-2 fw-medium ${activeTab === 'code' ? 'bg-primary text-white' : 'bg-transparent text-muted border'}`}
              style={{ borderRadius: 'var(--cf-radius-md)', cursor: 'pointer' }}
            >
              Have an Invite Code?
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              eventKey="browse" 
              className={`px-4 py-2 fw-medium ${activeTab === 'browse' ? 'bg-primary text-white' : 'bg-transparent text-muted border'}`}
              style={{ borderRadius: 'var(--cf-radius-md)', cursor: 'pointer' }}
            >
              Browse Public Teams
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="code">
            <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', maxWidth: '600px' }}>
              <Card.Body className="p-5 text-center">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-circle mb-4" style={{ width: '80px', height: '80px' }}>
                  <Key size={40} />
                </div>
                <h4 className="fw-bold mb-2" style={{ color: 'var(--cf-text-primary)' }}>Enter Invite Code</h4>
                <p className="text-muted mb-4">
                  Did your team leader already create the team? Ask them for the 6-character invite code and enter it below to instantly join.
                </p>

                <Form onSubmit={handleJoinViaCode} className="mx-auto" style={{ maxWidth: '350px' }}>
                  <InputGroup className="mb-4 shadow-sm" size="lg">
                    <InputGroup.Text className="bg-white border-end-0">
                      <Key size={20} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="e.g. SEAL-ABC123"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      className="border-start-0 text-center fw-bold"
                      style={{ letterSpacing: '2px' }}
                      required
                    />
                  </InputGroup>
                  <Button variant="primary" type="submit" size="lg" className="w-100 d-flex align-items-center justify-content-center gap-2">
                    Join Team <ArrowRight size={20} />
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="browse">
            <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0" style={{ color: 'var(--cf-text-primary)' }}>
                    Teams Looking for Members
                  </h5>
                  <div style={{ width: '300px' }}>
                    <InputGroup>
                      <InputGroup.Text className="bg-transparent border-end-0">
                        <Search size={16} className="text-muted" />
                      </InputGroup.Text>
                      <Form.Control
                        placeholder="Search by team or project name..."
                        className="border-start-0 bg-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </InputGroup>
                  </div>
                </div>

                <Row className="g-4">
                  {filteredTeams.map((team) => (
                    <Col md={6} lg={4} key={team.id}>
                      <Card className="h-100 border transition-hover" style={{ backgroundColor: 'var(--cf-bg-main)' }}>
                        <Card.Body className="p-4 d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <Badge bg="light" text="dark" className="border">{team.category}</Badge>
                            <Badge bg={team.members === 4 ? 'danger' : 'success'}>
                              {team.members}/4 Members
                            </Badge>
                          </div>
                          
                          <h5 className="fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>{team.name}</h5>
                          <p className="text-muted small mb-4">Project: {team.project}</p>
                          
                          <div className="mt-auto pt-3" style={{ borderTop: '1px solid var(--cf-border-color)' }}>
                            <Button 
                              variant={team.members === 4 ? "secondary" : "outline-primary"}
                              className="w-100 d-flex align-items-center justify-content-center gap-2"
                              disabled={team.members === 4}
                              onClick={() => handleSendRequest(team.name)}
                            >
                              <UserPlus size={18} />
                              {team.members === 4 ? 'Team Full' : 'Request to Join'}
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                  
                  {filteredTeams.length === 0 && (
                    <Col xs={12}>
                      <div className="text-center py-5 text-muted">
                        <Users size={48} className="mb-3 opacity-50" />
                        <h5>No teams found matching "{searchQuery}"</h5>
                      </div>
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default JoinTeam;
