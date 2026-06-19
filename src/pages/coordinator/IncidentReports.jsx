import React from 'react';
import { Card, Table, Button, Badge, InputGroup, Form } from 'react-bootstrap';
import { Search, Eye, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { incidentsList } from '../../data/mockData';
import IncidentStatusBadge from '../../components/incident/IncidentStatusBadge';

const IncidentReports = () => {
  const navigate = useNavigate();

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Incident Review</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Review and manage reported violations and incidents</div>
        </div>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <InputGroup style={{ maxWidth: '300px' }}>
            <InputGroup.Text className="bg-transparent border-end-0">
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control className="border-start-0" placeholder="Search incidents..." />
          </InputGroup>
          <div className="d-flex gap-2">
            <Form.Select style={{ width: '150px' }}>
              <option>All Statuses</option>
              <option>Pending Review</option>
              <option>Under Review</option>
              <option>Resolved</option>
            </Form.Select>
          </div>
        </div>
        <div className="table-responsive">
          <Table className="mb-0" hover>
            <thead>
              <tr>
                <th className="border-top-0 border-bottom">ID</th>
                <th className="border-top-0 border-bottom">Team</th>
                <th className="border-top-0 border-bottom">Reporter</th>
                <th className="border-top-0 border-bottom">Type</th>
                <th className="border-top-0 border-bottom">Severity</th>
                <th className="border-top-0 border-bottom">Status</th>
                <th className="border-top-0 border-bottom text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {incidentsList.map((incident) => (
                <tr key={incident.id} className="align-middle">
                  <td className="py-3" style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>{incident.id}</td>
                  <td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{incident.team}</td>
                  <td className="py-3">
                    <div style={{ color: 'var(--cf-text-primary)' }}>{incident.reporter}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--cf-text-secondary)' }}>{incident.role}</div>
                  </td>
                  <td className="py-3">{incident.type}</td>
                  <td className="py-3">
                    <span className="d-flex align-items-center gap-1" style={{ color: incident.severity === 'High' ? 'var(--cf-status-danger)' : incident.severity === 'Medium' ? 'var(--cf-status-warning)' : 'var(--cf-text-secondary)' }}>
                      {incident.severity === 'High' && <AlertTriangle size={14} />}
                      {incident.severity}
                    </span>
                  </td>
                  <td className="py-3">
                    <IncidentStatusBadge status={incident.status} />
                  </td>
                  <td className="py-3 text-end">
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="d-inline-flex align-items-center gap-1"
                      onClick={() => navigate(`/coordinator/incidents/${incident.id}`)}
                    >
                      <Eye size={14} /> Review
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default IncidentReports;
