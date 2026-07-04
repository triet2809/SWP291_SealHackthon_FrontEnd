import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { ArrowLeft, User, Mail, Shield, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUsers, addUserRole, removeUserRole } from '../../api/userApi';

const JUDGE_ROLE = 'judge';

const JudgeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  // In create mode we grant judge role to an existing user (no BE create-user endpoint).
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [judge, setJudge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getUsers({});
        const users = res.value || [];
        if (!active) return;
        setAllUsers(users);
        if (isEditing) {
          const found = users.find((u) => u.id === id);
          setJudge(found || null);
          if (!found) setError('Judge user not found.');
        }
      } catch (err) {
        if (active) setError(err.message || 'Failed to load users');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id, isEditing]);

  const hasJudge = (u) => (u?.roles || []).some((r) => r.toLowerCase() === JUDGE_ROLE);

  const handleGrant = async () => {
    if (!selectedUserId) {
      alert('Please select a user to grant the judge role.');
      return;
    }
    const user = allUsers.find((u) => u.id === selectedUserId);
    if (!user) return;
    try {
      setSaving(true);
      setError('');
      await addUserRole(user, JUDGE_ROLE);
      navigate('/coordinator/judges');
    } catch (err) {
      setError(err.message || 'Failed to grant judge role');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleRole = async () => {
    if (!judge) return;
    try {
      setSaving(true);
      setError('');
      if (hasJudge(judge)) {
        await removeUserRole(judge, JUDGE_ROLE);
      } else {
        await addUserRole(judge, JUDGE_ROLE);
      }
      navigate('/coordinator/judges');
    } catch (err) {
      setError(err.message || 'Failed to update judge role');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // candidates for granting judge role = users who are not already judges
  const candidates = allUsers.filter((u) => !hasJudge(u));

  return (
    <div className="py-2">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Button variant="link" className="p-0 text-muted" onClick={() => navigate('/coordinator/judges')}>
          <ArrowLeft size={24} />
        </Button>
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>
            {isEditing ? 'Edit Judge Profile' : 'Invite New Judge'}
          </h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>
            {isEditing ? 'Manage this user\u2019s judge role' : 'Grant the judge role to an existing user'}
          </div>
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      <Row className="justify-content-center">
        <Col lg={8}>
          <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="p-4 p-md-5">
              <Form>
                <div className="mb-4">
                  <h5 className="fw-bold mb-3 border-bottom pb-2">Basic Information</h5>

                  {isEditing ? (
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-medium d-flex align-items-center gap-2"><User size={16} className="text-primary"/> Full Name</Form.Label>
                          <Form.Control type="text" value={judge?.fullName || ''} readOnly disabled />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-medium d-flex align-items-center gap-2"><Mail size={16} className="text-danger"/> Email Address</Form.Label>
                          <Form.Control type="email" value={judge?.email || ''} readOnly disabled />
                        </Form.Group>
                      </Col>
                    </Row>
                  ) : (
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium d-flex align-items-center gap-2"><User size={16} className="text-primary"/> Select User</Form.Label>
                      <Form.Select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
                        <option value="">Select a user to make a judge</option>
                        {candidates.map((u) => (
                          <option key={u.id} value={u.id}>{u.fullName || u.email} ({u.email})</option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-muted">
                        The backend has no create-user endpoint; new accounts self-register. You can only grant the judge role to existing users.
                      </Form.Text>
                    </Form.Group>
                  )}
                </div>

                {isEditing && (
                  <div className="mb-4">
                    <h5 className="fw-bold mb-3 border-bottom pb-2">Roles</h5>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium d-flex align-items-center gap-2"><Shield size={16} className="text-warning"/> Current Roles</Form.Label>
                      <div>{(judge?.roles || []).join(', ') || '\u2014'}</div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium d-flex align-items-center gap-2"><CheckCircle size={16} className="text-success"/> Status</Form.Label>
                      <div>{judge?.status || '\u2014'}</div>
                    </Form.Group>
                  </div>
                )}

                <div className="d-flex justify-content-end gap-3 mt-5 pt-3 border-top">
                  <Button variant="secondary" onClick={() => navigate('/coordinator/judges')} disabled={saving}>
                    Cancel
                  </Button>
                  {isEditing ? (
                    <Button variant={hasJudge(judge) ? 'danger' : 'primary'} onClick={handleToggleRole} disabled={saving || !judge}>
                      {saving ? 'Saving...' : hasJudge(judge) ? 'Revoke Judge Role' : 'Grant Judge Role'}
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={handleGrant} disabled={saving}>
                      {saving ? 'Saving...' : 'Grant Judge Role'}
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default JudgeForm;
