import React, { useEffect, useState } from 'react';
import { Card, Button, Form, Row, Col, Alert, Badge, Spinner } from 'react-bootstrap';
import { Plus, Trash2, Users, Save, AlertTriangle, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTracks, createTeam } from '../../api/hackathonApi';
import { getStoredUser } from '../../utils/authUser';

const CreateTeam = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [createdTeam, setCreatedTeam] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [tracks, setTracks] = useState([]);
  const [tracksLoading, setTracksLoading] = useState(true);

  const currentUser = getStoredUser() || {};

  const [teamData, setTeamData] = useState({
    name: '',
    project: '',
    trackId: '',
    description: ''
  });

  const [members, setMembers] = useState([
    { id: currentUser.id || 'leader', name: currentUser.fullName || '', studentId: '', email: currentUser.email || '', major: '' }
  ]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await getTracks({ size: 100 });
        const list = res?.content || res || [];
        if (!active) return;
        setTracks(list);
        if (list.length) setTeamData((prev) => ({ ...prev, trackId: prev.trackId || list[0].id }));
      } catch (e) {
        if (active) setError(e.message || 'Failed to load tracks');
      } finally {
        if (active) setTracksLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

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
    if (id === (currentUser.id || 'leader')) return;
    setMembers(members.filter(m => m.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!teamData.trackId) {
      setError('Please select a track.');
      return;
    }
    setSubmitting(true);
    try {
      // BE resolves leader from token; members added later via invite code / addTeamMember.
      const created = await createTeam({
        trackId: teamData.trackId,
        name: teamData.name,
        leaderUserId: currentUser.id || undefined,
      });
      setCreatedTeam(created);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to create team');
    } finally {
      setSubmitting(false);
    }
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
              Your team <strong>{createdTeam?.name || teamData.name}</strong> has been created. You are the designated Team Leader.
            </p>

            {createdTeam?.id && (
              <div className="p-4 rounded mb-4 mx-auto" style={{ maxWidth: '400px', backgroundColor: 'var(--cf-bg-main)', border: '1px solid var(--cf-border-color)' }}>
                <div className="text-muted mb-2 text-uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Your Team ID</div>
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <Key size={20} className="text-primary" />
                  <span className="fw-bold text-primary" style={{ letterSpacing: '1px' }}>{createdTeam.id}</span>
                </div>
              </div>
            )}

            <p className="text-muted mb-4 small">
              Share your team with teammates so they can join.
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
          {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
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
                    <Form.Label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--cf-text-secondary)' }}>Project Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="project"
                      value={teamData.project}
                      onChange={handleTeamChange}
                      placeholder="Enter project name"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--cf-text-secondary)' }}>Track *</Form.Label>
                    <Form.Select
                      name="trackId"
                      value={teamData.trackId}
                      onChange={handleTeamChange}
                      disabled={tracksLoading}
                      required
                    >
                      {tracksLoading && <option>Loading tracks...</option>}
                      {!tracksLoading && tracks.length === 0 && <option value="">No tracks available</option>}
                      {tracks.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
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

                  <Alert variant="warning" className="py-2 mb-4 d-flex align-items-center gap-2" style={{ fontSize: '0.875rem' }}>
                    <AlertTriangle size={16} />
                    <strong>Note:</strong> Teams are created with you as leader. Add teammates afterward by sharing your team invite so they can join. Teams must reach exactly 4 members before the event starts.
                  </Alert>

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
                                <Form.Label style={{ fontSize: '0.875rem', color: 'var(--cf-text-secondary)' }}>Full Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  disabled={isLeader}
                                  placeholder="John Doe"
                                  value={member.name}
                                  onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label style={{ fontSize: '0.875rem', color: 'var(--cf-text-secondary)' }}>Student ID</Form.Label>
                                <Form.Control
                                  type="text"
                                  disabled={isLeader}
                                  placeholder="FPT-2026-1234"
                                  value={member.studentId}
                                  onChange={(e) => handleMemberChange(member.id, 'studentId', e.target.value)}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label style={{ fontSize: '0.875rem', color: 'var(--cf-text-secondary)' }}>Email Address</Form.Label>
                                <Form.Control
                                  type="email"
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
                      disabled={submitting}
                    >
                      {submitting ? <Spinner animation="border" size="sm" /> : <Save size={18} />}
                      {submitting ? 'Creating...' : 'Register Team'}
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
