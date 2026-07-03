import React, { useState } from 'react';
import { Alert, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { Send, LifeBuoy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createSupportTicket } from '../../api/hackathonApi';

const SupportTicket = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ category: '', priority: 'low', subject: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try { await createSupportTicket(form); setSubmitted(true); } catch (err) { setError(err.message || 'Cannot submit ticket'); }
  };

  if (submitted) {
    return (
      <div className="py-2">
        <div className="mb-4">
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Submit a Ticket</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Contact the organizing team for assistance</div>
        </div>

        <Card className="text-center p-5 border-0 shadow-sm" style={{ backgroundColor: 'var(--cf-bg-surface)', borderRadius: 'var(--cf-radius-lg)' }}>
          <div className="mx-auto mb-4 bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
            <Send size={40} className="text-success" />
          </div>
          <h3 className="h4 fw-bold" style={{ color: 'var(--cf-text-primary)' }}>Ticket Submitted Successfully!</h3>
          <p style={{ color: 'var(--cf-text-secondary)' }}>
            Your request has been securely submitted to the Event Coordinators. 
            We will review it and get back to you shortly via the Notice Board or Email.
          </p>
          <Button variant="primary" className="mt-3" onClick={() => navigate('/team/dashboard')}>
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Submit a Ticket</h1>
        <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Contact the organizing team for assistance</div>
      </div>

        {error && <Alert variant="danger">{error}</Alert>}
      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <div className="mb-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--cf-text-primary)' }}>
                <LifeBuoy size={20} className="text-primary" />
                How can we help?
              </h5>
              <p style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>
                Whether you're facing technical issues, need rule clarifications, or have an emergency, submit a ticket below.
              </p>
            </div>

            <Row className="g-3 mb-4">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-medium" style={{ color: 'var(--cf-text-primary)', fontSize: '0.875rem' }}>Category</Form.Label>
                  <Form.Select required value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                    <option value="">Select Topic...</option>
                    <option value="technical">Technical / Platform Issue</option>
                    <option value="rules">Rule Clarification</option>
                    <option value="team">Team Member Changes</option>
                    <option value="other">Other Inquiry</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-medium" style={{ color: 'var(--cf-text-primary)', fontSize: '0.875rem' }}>Priority</Form.Label>
                  <Form.Select required value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}>
                    <option value="low">Low - General Question</option>
                    <option value="medium">Medium - Hindering Progress</option>
                    <option value="high">High - Critical Issue (Emergency)</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-medium" style={{ color: 'var(--cf-text-primary)', fontSize: '0.875rem' }}>Ticket Subject *</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Brief summary of your issue..." 
                    required
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-medium" style={{ color: 'var(--cf-text-primary)', fontSize: '0.875rem' }}>Detailed Description *</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={6} 
                    placeholder="Provide all relevant details, links, or context..."
                    required
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end pt-3" style={{ borderTop: '1px solid var(--cf-border-color)' }}>
              <Button variant="primary" type="submit" className="d-flex align-items-center gap-2 px-4">
                <Send size={18} /> Submit Ticket
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SupportTicket;
