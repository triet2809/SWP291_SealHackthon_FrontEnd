import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import { ArrowLeft, Trophy, DollarSign, Tag, CheckCircle, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const AwardForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [award, setAward] = useState({
    name: '',
    prize: '',
    category: 'Overall',
    status: 'Unassigned',
    winner: ''
  });

  useEffect(() => {
    if (isEditing) {
      // In a real app, fetch award by ID here. Mocking data for now.
      setAward({
        name: 'Best AI/ML Solution',
        prize: '$5,000',
        category: 'AI/ML',
        status: 'Assigned',
        winner: 'QuantumLeap'
      });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAward(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!award.name || !award.prize) {
      alert('Please fill out the award name and prize amount.');
      return;
    }
    alert(`Award ${isEditing ? 'updated' : 'created'} successfully!`);
    navigate('/coordinator/awards');
  };

  return (
    <div className="py-2">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Button variant="link" className="p-0 text-muted" onClick={() => navigate('/coordinator/awards')}>
          <ArrowLeft size={24} />
        </Button>
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>
            {isEditing ? 'Edit Award' : 'Create New Award'}
          </h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>
            {isEditing ? 'Update prize details and assign winners' : 'Configure a new prize pool'}
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
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium d-flex align-items-center gap-2"><Trophy size={16} className="text-warning"/> Award Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="e.g. Grand Prize Winner"
                      value={award.name}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium d-flex align-items-center gap-2"><DollarSign size={16} className="text-success"/> Prize Amount</Form.Label>
                        <Form.Control
                          type="text"
                          name="prize"
                          placeholder="e.g. $10,000"
                          value={award.prize}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium d-flex align-items-center gap-2"><Tag size={16} className="text-info"/> Category</Form.Label>
                        <Form.Select name="category" value={award.category} onChange={handleChange}>
                          <option>Overall</option>
                          <option>AI/ML</option>
                          <option>Web Dev</option>
                          <option>Data Science</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                <div className="mb-4">
                  <h5 className="fw-bold mb-3 border-bottom pb-2">Assignment</h5>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium d-flex align-items-center gap-2"><CheckCircle size={16} className="text-primary"/> Status</Form.Label>
                        <Form.Select name="status" value={award.status} onChange={handleChange}>
                          <option>Unassigned</option>
                          <option>Voting Active</option>
                          <option>Assigned</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium d-flex align-items-center gap-2"><Users size={16} className="text-secondary"/> Winner (Team Name)</Form.Label>
                        <Form.Control
                          type="text"
                          name="winner"
                          placeholder="Leave blank if unassigned"
                          value={award.winner}
                          onChange={handleChange}
                          disabled={award.status !== 'Assigned'}
                        />
                        {award.status !== 'Assigned' && (
                          <Form.Text className="text-muted">Change status to 'Assigned' to input a winner.</Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                <div className="d-flex justify-content-end gap-3 mt-5 pt-3 border-top">
                  <Button variant="secondary" onClick={() => navigate('/coordinator/awards')}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSave}>
                    {isEditing ? 'Save Changes' : 'Create Award'}
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

export default AwardForm;
