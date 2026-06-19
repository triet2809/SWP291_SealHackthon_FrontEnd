import React, { useState } from 'react';
import { Card, Table, Button, Row, Col, Modal, Form, InputGroup } from 'react-bootstrap';
import { Download, FileText, BarChart2, Search, Trash2, Eye } from 'lucide-react';

const Reports = () => {
  const [reports, setReports] = useState([
    { id: 1, name: 'Final Hackathon Results', type: 'Excel', lastGenerated: 'Today, 10:00 AM', size: '1.2 MB' },
    { id: 2, name: 'Participant Demographics', type: 'CSV', lastGenerated: 'Yesterday, 4:00 PM', size: '450 KB' },
    { id: 3, name: 'Detailed Judging Scores', type: 'Excel', lastGenerated: 'June 18, 2026', size: '2.5 MB' },
    { id: 4, name: 'Mentor Engagement Stats', type: 'CSV', lastGenerated: 'June 15, 2026', size: '120 KB' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [newReport, setNewReport] = useState({
    name: '',
    type: 'PDF',
    dateRange: ''
  });
  const filteredReports = reports.filter((report) =>
    report.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  const handleGenerateReport = () => {
    if (!newReport.name) {
      alert('Enter report name');
      return;
    }
    setReports([
      {
        id: Date.now(),
        name: newReport.name,
        type: newReport.type,
        lastGenerated: 'Just now',
        size: '0.5 MB'
      },
      ...reports
    ]);
    setNewReport({
      name: '',
      type: 'PDF',
      dateRange: ''
    });
    setShowModal(false);
  };
  const handleDeleteReport = (id) => {
    if (window.confirm('Delete this report?')) {
      setReports(
        reports.filter((r) => r.id !== id)
      );
    }
  };
  const handleDownload = (report) => {
    alert(`Downloading ${report.name}`);
  };
  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Reports & Analytics</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Export data and view event analytics</div>
        </div>
        <Button variant="primary" className="d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <BarChart2 size={18} /> Generate Custom Report
        </Button>
      </div>

      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%' }}>
            <Card.Body className="p-4 d-flex flex-column align-items-center justify-content-center text-center">
              <div className="mb-3 text-primary bg-primary bg-opacity-10 p-3 rounded-circle">
                <Download size={32} />
              </div>
              <h5 className="fw-bold" style={{ color: 'var(--cf-text-primary)' }}>Export All Data</h5>
              <p style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Download a comprehensive ZIP file containing all teams, submissions, scores, and user data.</p>
              <Button variant="outline-primary" className="mt-2">Download Master Archive</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%' }}>
            <InputGroup className="mb-3">
              <InputGroup.Text>
                <Search size={16} />
              </InputGroup.Text>
              <Form.Control placeholder="Search reports..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </InputGroup>
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4" style={{ color: 'var(--cf-text-primary)' }}>Available Reports</h5>
              <div className="d-flex flex-column gap-3">
                {filteredReports.map((report) => (
                  <div key={report.id} className="d-flex align-items-center justify-content-between p-3 rounded" style={{ backgroundColor: 'var(--cf-bg-main)' }}>
                    <div className="d-flex align-items-center gap-3">
                      <FileText size={18} className="text-secondary" />
                      <div>
                        <div className="fw-medium" style={{ color: 'var(--cf-text-primary)' }}>{report.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--cf-text-secondary)' }}>{report.type} • {report.size} • Last generated {report.lastGenerated}</div>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <Button variant="link" size="sm" className="p-0 text-primary" onClick={() => { setSelectedReport(report); setShowViewModal(true); }} >
                        <Eye size={16} />
                      </Button>
                      <Button variant="link" size="sm" className="p-0 text-success" onClick={() => handleDownload(report)}>
                        <Download size={16} />
                      </Button>
                      <Button variant="link" size="sm" className="p-0 text-danger" onClick={() => handleDeleteReport(report.id)}   >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Generate Report
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Form.Group className="mb-3">
            <Form.Label>
              Report Name
            </Form.Label>

            <Form.Control
              value={newReport.name}
              onChange={(e) =>
                setNewReport({
                  ...newReport,
                  name: e.target.value
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Format
            </Form.Label>

            <Form.Select
              value={newReport.type}
              onChange={(e) =>
                setNewReport({
                  ...newReport,
                  type: e.target.value
                })
              }
            >
              <option>PDF</option>
              <option>Excel</option>
              <option>CSV</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>
              Date Range
            </Form.Label>

            <Form.Control
              type="date"
            />
          </Form.Group>

        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() =>
              setShowModal(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleGenerateReport}
          >
            Generate
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Report Details
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedReport && (
            <>
              <p>
                <strong>Name:</strong>{' '}
                {selectedReport.name}
              </p>

              <p>
                <strong>Format:</strong>{' '}
                {selectedReport.type}
              </p>

              <p>
                <strong>Size:</strong>{' '}
                {selectedReport.size}
              </p>

              <p>
                <strong>Generated:</strong>{' '}
                {selectedReport.lastGenerated}
              </p>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowViewModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Reports;
