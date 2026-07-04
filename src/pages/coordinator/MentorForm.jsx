import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { ArrowLeft, User, Mail, Briefcase, Tag, FileText, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUsers, addUserRole, removeUserRole } from '../../api/userApi';

const MentorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [mentor, setMentor] = useState({
    name: '',
    email: '',
    company: '',
    category: 'AI/ML',
    expertise: '',
    bio: '',
    status: 'Active'
  });
  const [userRecord, setUserRecord] = useState(null);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditing) return;
    (async () => {
      try {
        setLoading(true);
        setError('');
        // Users list has no by-id endpoint; fetch and match locally.
        const res = await getUsers({ role: 'mentor' });
        let u = (res.value || []).find((x) => x.id === id);
        if (!u) {
          const all = await getUsers({});
          u = (all.value || []).find((x) => x.id === id);
        }
        if (u) {
          setUserRecord(u);
          setMentor({
            name: u.fullName || '',
            email: u.email || '',
            company: u.department || u.universityName || '',
            category: 'AI/ML',
            expertise: (u.position || ''),
            bio: '',
            status: u.status === 'approved' ? 'Active' : 'Inactive',
          });
        } else {
          setError('Mentor not found.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load mentor');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMentor(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!mentor.name || !mentor.email) {
      setError('Please fill out the mentor name and email.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (isEditing) {
        // Only role changes persist: ensure mentor role present (or removed if set Inactive).
        if (userRecord) {
          if (mentor.status === 'Inactive') {
            await removeUserRole(userRecord, 'mentor');
          } else if (!(userRecord.roles || []).includes('mentor')) {
            await addUserRole(userRecord, 'mentor');
          }
        }
      } else {
        // No admin create-user endpoint: grant mentor role to an existing user by email.
        const res = await getUsers({ search: mentor.email });
        const match = (res.value || []).find(
          (u) => (u.email || '').toLowerCase() === mentor.email.toLowerCase()
        );
        if (!match) {
          throw new Error('No existing user with that email. User must register first, then be granted the mentor role.');
        }
        await addUserRole(match, 'mentor');
      }
      navigate('/coordinator/mentors');
    } catch (err) {
      setError(err.message || 'Failed to save mentor');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Button variant="link" className="p-0 text-muted" onClick={() => navigate('/coordinator/mentors')}>
          <ArrowLeft size={24} />
        </Button>
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>
            {isEditing ? 'Edit Mentor Profile' : 'Invite New Mentor'}
          </h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>
            {isEditing ? 'Update mentor details and characteristics' : 'Add a new mentor to the hackathon platform'}
          </div>
        </div>
      </div>

      <Row className="justify-content-center">
        <Col lg={8}>
          {error && <Alert variant="danger">{error}</Alert>}
          <Alert variant="info" className="small">
            {isEditing
              ? 'Only the mentor role and active status persist to the backend. Profile fields (company, expertise, bio) have no admin update endpoint yet.'
              : 'Mentors are existing users granted the mentor role. Enter the email of a registered user; saving grants them the mentor role.'}
          </Alert>
          <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="p-4 p-md-5">
              <Form>
                <div className="mb-4">
                  <h5 className="fw-bold mb-3 border-bottom pb-2">Basic Information</h5>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium d-flex align-items-center gap-2"><User size={16} className="text-primary"/> Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="e.g. Dr. Jane Smith"
                          value={mentor.name}
                          onChange={handleChange}
                          readOnly={isEditing}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium d-flex align-items-center gap-2"><Mail size={16} className="text-danger"/> Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="name@example.com"
                          value={mentor.email}
                          onChange={handleChange}
                          readOnly={isEditing}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium d-flex align-items-center gap-2"><Briefcase size={16} className="text-info"/> Company / Organization</Form.Label>
                    <Form.Control
                      type="text"
                      name="company"
                      placeholder="e.g. Google, Tech Startup Inc."
                      value={mentor.company}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </div>

                <div className="mb-4">
                  <h5 className="fw-bold mb-3 border-bottom pb-2">Expertise & Characteristics</h5>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium d-flex align-items-center gap-2"><Tag size={16} className="text-warning"/> Primary Category</Form.Label>
                        <Form.Select name="category" value={mentor.category} onChange={handleChange}>
                          <option>AI/ML</option>
                          <option>Web Dev</option>
                          <option>Data Science</option>
                          <option>Cybersecurity</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium d-flex align-items-center gap-2"><CheckCircle size={16} className="text-success"/> Status</Form.Label>
                        <Form.Select name="status" value={mentor.status} onChange={handleChange}>
                          <option>Active</option>
                          <option>Inactive</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium d-flex align-items-center gap-2"><Tag size={16} className="text-secondary"/> Specific Expertise (Comma separated)</Form.Label>
                    <Form.Control
                      type="text"
                      name="expertise"
                      placeholder="e.g. React, Node.js, System Design"
                      value={mentor.expertise}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium d-flex align-items-center gap-2"><FileText size={16} className="text-primary"/> Professional Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="bio"
                      placeholder="A short biography outlining their background, achievements, and mentoring style..."
                      value={mentor.bio}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </div>

                <div className="d-flex justify-content-end gap-3 mt-5 pt-3 border-top">
                  <Button variant="secondary" onClick={() => navigate('/coordinator/mentors')} disabled={saving}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSave} disabled={saving}>
                    {saving ? <Spinner animation="border" size="sm" /> : (isEditing ? 'Save Changes' : 'Invite Mentor')}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MentorForm;
