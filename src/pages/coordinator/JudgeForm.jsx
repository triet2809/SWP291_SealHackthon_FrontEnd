import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import { ArrowLeft, User, Mail, Briefcase, Tag, FileText, CheckCircle, Shield } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const JudgeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [judge, setJudge] = useState({
    name: '',
    email: '',
    company: '',
    type: 'Panel Judge',
    expertise: '',
    bio: '',
    status: 'Active'
  });

  useEffect(() => {
    if (isEditing) {
      setJudge({
        name: 'Dr. Alan Turing',
        email: 'alan.turing@example.com',
        company: 'Enigma Institute',
        type: 'Lead Judge',
        expertise: 'Algorithms, Cryptography, AI',
        bio: 'Pioneer of theoretical computer science and artificial intelligence.',
        status: 'Active'
      });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJudge(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!judge.name || !judge.email) {
      alert('Please fill out the judge name and email.');
      return;
    }
    alert(`Judge ${isEditing ? 'updated' : 'invited'} successfully!`);
    navigate('/coordinator/judges');
  };

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
            {isEditing ? 'Update judge details and qualifications' : 'Add a new judge to the evaluation panel'}
          </div>
        </div>
      </div>

      <Row className="justify-content-center">
        <Col lg={8}>
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
                          placeholder="e.g. Dr. John Doe"
                          value={judge.name}
                          onChange={handleChange}
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
                          value={judge.email}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium d-flex align-items-center gap-2"><Briefcase size={16} className="text-info"/> Company / Organization</Form.Label>
                    <Form.Control
                      type="text"
                      name="company"
                      placeholder="e.g. Microsoft, Stanford University"
                      value={judge.company}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </div>

                <div className="mb-4">
                  <h5 className="fw-bold mb-3 border-bottom pb-2">Evaluation Details</h5>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium d-flex align-items-center gap-2"><Shield size={16} className="text-warning"/> Judge Role</Form.Label>
                        <Form.Select name="type" value={judge.type} onChange={handleChange}>
                          <option>Panel Judge</option>
                          <option>Lead Judge</option>
                          <option>Guest Judge</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium d-flex align-items-center gap-2"><CheckCircle size={16} className="text-success"/> Status</Form.Label>
                        <Form.Select name="status" value={judge.status} onChange={handleChange}>
                          <option>Active</option>
                          <option>Inactive</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium d-flex align-items-center gap-2"><Tag size={16} className="text-secondary"/> Professional Expertise (Comma separated)</Form.Label>
                    <Form.Control
                      type="text"
                      name="expertise"
                      placeholder="e.g. Distributed Systems, Product Management"
                      value={judge.expertise}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium d-flex align-items-center gap-2"><FileText size={16} className="text-primary"/> Short Biography</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="bio"
                      placeholder="A short biography outlining their background, achievements, and evaluation criteria..."
                      value={judge.bio}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </div>

                <div className="d-flex justify-content-end gap-3 mt-5 pt-3 border-top">
                  <Button variant="secondary" onClick={() => navigate('/coordinator/judges')}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSave}>
                    {isEditing ? 'Save Changes' : 'Invite Judge'}
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

export default JudgeForm;
