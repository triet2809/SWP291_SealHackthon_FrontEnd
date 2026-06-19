import React, { useState } from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar, User, ShieldAlert, History } from 'lucide-react';
import { incidentDetail } from '../../data/mockData';
import IncidentStatusBadge from '../../components/incident/IncidentStatusBadge';
import DecisionPanel from '../../components/incident/DecisionPanel';

const IncidentReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Using the mock data for demonstration. In a real app, fetch based on 'id'
  const incident = incidentDetail;
  const [currentStatus, setCurrentStatus] = useState(incident.status);
  const [decisionHistory, setDecisionHistory] = useState([]);

  const handleDecision = (newStatus) => {
    setCurrentStatus(newStatus);
    setDecisionHistory([
      {
        action: `Status Updated to ${newStatus}`,
        user: 'Coordinator',
        date: new Date().toLocaleString()
      },
      ...decisionHistory
    ]);
  };

  return (
    <div className="py-2">
      <div className="mb-4">
        <Button
          variant="link"
          className="p-0 text-decoration-none d-inline-flex align-items-center gap-2 mb-3"
          style={{ color: 'var(--cf-text-secondary)' }}
          onClick={() => navigate('/coordinator/incidents')}
        >
          <ArrowLeft size={16} /> Back to Incidents
        </Button>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className="d-flex align-items-center gap-3 mb-2">
              <h1 className="h3 fw-bold mb-0" style={{ color: 'var(--cf-text-primary)' }}>{incident.title}</h1>
              <IncidentStatusBadge status={currentStatus} />
            </div>
            <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }} className="d-flex align-items-center gap-3">
              <span>Report ID: {incident.id}</span>
              <span>•</span>
              <span className="d-flex align-items-center gap-1"><Calendar size={14} /> {incident.reporter.date}</span>
            </div>
          </div>
        </div>
      </div>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="mb-4" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: 'var(--cf-text-primary)' }}>
                <ShieldAlert size={20} className="text-warning" />
                Incident Details
              </h5>

              <Row className="mb-4">
                <Col md={6}>
                  <div className="mb-3">
                    <div style={{ fontSize: '0.75rem', color: 'var(--cf-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</div>
                    <div className="fw-medium" style={{ color: 'var(--cf-text-primary)' }}>{incident.incidentType}</div>
                  </div>
                  <div className="mb-3">
                    <div style={{ fontSize: '0.75rem', color: 'var(--cf-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Team</div>
                    <div className="fw-medium text-primary">{incident.team}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--cf-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Submission Involved</div>
                    <div className="fw-medium" style={{ color: 'var(--cf-text-primary)' }}>{incident.submission}</div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <div style={{ fontSize: '0.75rem', color: 'var(--cf-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Severity</div>
                    <Badge bg="danger">{incident.severity}</Badge>
                  </div>
                  <div className="mb-3">
                    <div style={{ fontSize: '0.75rem', color: 'var(--cf-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Event & Round</div>
                    <div className="fw-medium" style={{ color: 'var(--cf-text-primary)' }}>{incident.event} - {incident.round}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--cf-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</div>
                    <div className="fw-medium" style={{ color: 'var(--cf-text-primary)' }}>{incident.category}</div>
                  </div>
                </Col>
              </Row>

              <hr style={{ borderColor: 'var(--cf-border-color)' }} />

              <div className="mb-4">
                <h6 className="fw-bold mb-2" style={{ color: 'var(--cf-text-primary)' }}>Description</h6>
                <p style={{ color: 'var(--cf-text-secondary)', lineHeight: '1.6' }}>{incident.description}</p>
              </div>

              <div>
                <h6 className="fw-bold mb-2" style={{ color: 'var(--cf-text-primary)' }}>Evidence</h6>
                <a href={incident.evidenceUrl} target="_blank" rel="noreferrer" className="d-inline-flex align-items-center gap-2 p-3 rounded text-decoration-none" style={{ backgroundColor: 'var(--cf-bg-main)', border: '1px solid var(--cf-border-color)' }}>
                  <ExternalLink size={16} />
                  <span>View Submitted Evidence</span>
                </a>
              </div>
              <div className="mt-4">
                <h6 className="fw-bold mb-3" style={{ color: "var(--cf-text-primary)" }}>
                  Quick Actions
                </h6>
                <div className="d-flex gap-2">
                  <Button variant="warning" onClick={() => handleDecision('Under Review')} >
                    Mark Under Review
                  </Button>
                  <Button variant="success" onClick={() => handleDecision('Resolved')} >
                    Resolve
                  </Button>
                  <Button variant="danger" onClick={() => handleDecision('Rejected')}  >
                    Reject Report
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>

          <DecisionPanel onDecisionMade={handleDecision} />
        </Col>

        <Col lg={4}>
          <Card className="mb-4" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: 'var(--cf-text-primary)' }}>
                <User size={20} />
                Reporter Info
              </h5>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                  {incident.reporter.name.charAt(0)}
                </div>
                <div>
                  <div className="fw-bold" style={{ color: 'var(--cf-text-primary)' }}>{incident.reporter.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--cf-text-secondary)' }}>{incident.reporter.role}</div>
                </div>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--cf-text-secondary)' }}>
                <strong>Email:</strong> {incident.reporter.email}
              </div>
            </Card.Body>
          </Card>

          <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: 'var(--cf-text-primary)' }}>
                <History size={20} />
                Audit Trail
              </h5>
              <div className="d-flex flex-column gap-3">
                {incident.auditLogs.map((log, index) => (
                  <div key={index} className="position-relative ps-3" style={{ borderLeft: '2px solid var(--cf-border-color)' }}>
                    <div className="position-absolute rounded-circle bg-primary" style={{ width: '8px', height: '8px', left: '-5px', top: '5px' }}></div>
                    <div className="fw-medium mb-1" style={{ color: 'var(--cf-text-primary)', fontSize: '0.875rem' }}>{log.action}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--cf-text-secondary)' }}>{log.date} by {log.user}</div>
                  </div>
                ))}
                {decisionHistory.map((log, index) => (
                  <div key={index} className="position-relative ps-3" style={{ borderLeft: '2px solid var(--cf-status-success)' }} >
                    <div className="position-absolute rounded-circle bg-success" style={{ width: "8px", height: "8px", left: "-5px", top: "5px" }} />
                    <div className="fw-medium mb-1 text-success" style={{ fontSize: "0.875rem" }}>
                      {log.action}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--cf-text-secondary)" }}>
                      {log.date} by {log.user}
                    </div>
                  </div>
                ))}
                {currentStatus !== incident.status && (
                  <div className="position-relative ps-3" style={{ borderLeft: '2px solid var(--cf-status-success)' }}>
                    <div className="position-absolute rounded-circle bg-success" style={{ width: '8px', height: '8px', left: '-5px', top: '5px' }}></div>
                    <div className="fw-medium mb-1 text-success" style={{ fontSize: '0.875rem' }}>Status Updated to: {currentStatus}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--cf-text-secondary)' }}>Just now by You</div>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default IncidentReportDetail;
