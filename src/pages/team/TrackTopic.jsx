import React from 'react';
import { Card, ListGroup, Badge, Row, Col } from 'react-bootstrap';
import { Target, CheckCircle, Award, BookOpen } from 'lucide-react';
import { trackTopicDetails } from '../../data/mockData';

const TrackTopic = () => {
  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Track Topic</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>View your assigned track theme and project requirements</div>
        </div>
      </div>

      <Row className="g-4">
        <Col lg={8}>
          <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }} className="mb-4">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div 
                  className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded" 
                  style={{ width: '48px', height: '48px' }}
                >
                  <Target size={24} />
                </div>
                <div>
                  <Badge bg="primary" className="mb-1">{trackTopicDetails.track}</Badge>
                  <h4 className="fw-bold mb-0" style={{ color: 'var(--cf-text-primary)' }}>{trackTopicDetails.theme}</h4>
                </div>
              </div>
              <p style={{ color: 'var(--cf-text-secondary)', lineHeight: '1.6' }} className="mb-0">
                {trackTopicDetails.description}
              </p>
            </Card.Body>
          </Card>

          <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: 'var(--cf-text-primary)' }}>
                <CheckCircle size={20} className="text-success" /> Technical & Submission Requirements
              </h5>
              <ListGroup variant="flush">
                {trackTopicDetails.requirements.map((req, index) => (
                  <ListGroup.Item 
                    key={index} 
                    className="px-0 py-3 bg-transparent"
                    style={{ borderBottom: index === trackTopicDetails.requirements.length - 1 ? 'none' : '1px solid var(--cf-border-color)' }}
                  >
                    <div className="d-flex align-items-start gap-3">
                      <div className="mt-1" style={{ color: 'var(--cf-text-secondary)' }}>
                        <BookOpen size={16} />
                      </div>
                      <span style={{ color: 'var(--cf-text-primary)' }}>{req}</span>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: 'var(--cf-text-primary)' }}>
                <Award size={20} className="text-warning" /> Evaluation Criteria
              </h5>
              <div className="d-flex flex-column gap-4">
                {trackTopicDetails.evaluationCriteria.map((criteria, index) => (
                  <div key={index}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold" style={{ color: 'var(--cf-text-primary)', fontSize: '0.875rem' }}>{criteria.name}</span>
                      <Badge bg="light" text="dark" style={{ border: '1px solid var(--cf-border-color)' }}>{criteria.weight}</Badge>
                    </div>
                    <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.8125rem', lineHeight: '1.5' }}>
                      {criteria.description}
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TrackTopic;
