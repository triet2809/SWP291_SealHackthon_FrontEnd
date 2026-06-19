import React, { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Send, AlertTriangle } from 'lucide-react';

const IncidentReportForm = ({ isJudge = false }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className="text-center p-5 border-0 shadow-sm" style={{ backgroundColor: 'var(--cf-bg-surface)', borderRadius: 'var(--cf-radius-lg)' }}>
        <div className="mx-auto mb-4 bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
          <Send size={40} className="text-success" />
        </div>
        <h3 className="h4 fw-bold" style={{ color: 'var(--cf-text-primary)' }}>Report Submitted</h3>
        <p style={{ color: 'var(--cf-text-secondary)' }}>
          Your incident report has been securely submitted to the Event Coordinators. 
          You will be notified once a decision is made.
        </p>
        <Button variant="primary" className="mt-3" onClick={() => setSubmitted(false)}>
          Submit Another Report
        </Button>
      </Card>
    );
  }

  return (
    <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <Card.Body className="p-4">
        <Form onSubmit={handleSubmit}>
          <div className="mb-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--cf-text-primary)' }}>
              <AlertTriangle size={20} className="text-warning" />
              Report an Incident or Violation
            </h5>
            <p style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>
              Please provide detailed information regarding the rule violation. False reporting may result in penalties.
            </p>
          </div>

          <Row className="g-3 mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-medium" style={{ color: 'var(--cf-text-primary)', fontSize: '0.875rem' }}>Event</Form.Label>
                <Form.Select required>
                  <option value="">Select Event...</option>
                  <option value="1">SEAL Hackathon 2026</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-medium" style={{ color: 'var(--cf-text-primary)', fontSize: '0.875rem' }}>Round</Form.Label>
                <Form.Select required>
                  <option value="">Select Round...</option>
                  <option value="1">Preliminary Submission</option>
                  <option value="2">Final Judging</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={isJudge ? 4 : 6}>
              <Form.Group>
                <Form.Label className="fw-medium" style={{ color: 'var(--cf-text-primary)', fontSize: '0.875rem' }}>Category</Form.Label>
                <Form.Select required>
                  <option value="">Select Category...</option>
                  <option value="ai">AI/ML</option>
                  <option value="data">Data Science</option>
                  <option value="web">Web Dev</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={isJudge ? 4 : 6}>
              <Form.Group>
                <Form.Label className="fw-medium" style={{ color: 'var(--cf-text-primary)', fontSize: '0.875rem' }}>Team</Form.Label>
                <Form.Select required>
                  <option value="">Select Team...</option>
                  <option value="1">Neural Nexus</option>
                  <option value="2">DataCraft</option>
                  <option value="3">ByteBuilders</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            {isJudge && (
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-medium" style={{ color: 'var(--cf-text-primary)', fontSize: '0.875rem' }}>Submission</Form.Label>
                  <Form.Select required>
                    <option value="">Select Submission...</option>
                    <option value="1">EduTrack AI v0.2</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            )}

            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-medium" style={{ color: 'var(--cf-text-primary)', fontSize: '0.875rem' }}>Incident Type</Form.Label>
                <Form.Select required>
                  <option value="">Select Type...</option>
                  <option value="plagiarism">Code Plagiarism</option>
                  <option value="conduct">Unprofessional Conduct</option>
                  <option value="rules">Rules Violation (Team Size, Late Submission, etc.)</option>
                  <option value="content">Inappropriate Content</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-medium" style={{ color: 'var(--cf-text-primary)', fontSize: '0.875rem' }}>Title</Form.Label>
                <Form.Control required type="text" placeholder="Brief summary of the incident" />
              </Form.Group>
            </Col>
            
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-medium" style={{ color: 'var(--cf-text-primary)', fontSize: '0.875rem' }}>Description</Form.Label>
                <Form.Control required as="textarea" rows={5} placeholder="Provide a detailed description of the incident..." />
              </Form.Group>
            </Col>
            
            <Col md={8}>
              <Form.Group>
                <Form.Label className="fw-medium" style={{ color: 'var(--cf-text-primary)', fontSize: '0.875rem' }}>Evidence URL</Form.Label>
                <Form.Control type="url" placeholder="Link to repository, screenshot, or other evidence" />
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-medium" style={{ color: 'var(--cf-text-primary)', fontSize: '0.875rem' }}>Severity</Form.Label>
                <Form.Select required>
                  <option value="">Select Severity...</option>
                  <option value="low">Low (Minor Infraction)</option>
                  <option value="medium">Medium (Rule Violation)</option>
                  <option value="high">High (Disqualifiable Offense)</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
            <Button variant="light" type="button">Cancel</Button>
            <Button variant="danger" type="submit" className="d-flex align-items-center gap-2">
              <Send size={18} /> Submit Report
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default IncidentReportForm;
