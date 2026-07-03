import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Form, InputGroup, Spinner, Table } from 'react-bootstrap';
import { AlertTriangle, Eye, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getIncidents } from '../../api/hackathonApi';
import IncidentStatusBadge from '../../components/incident/IncidentStatusBadge';

const pageItems = (data) => data?.content || data || [];
const label = (v) => (v || '').replaceAll('_', ' ').replace(/\b\w/g, (m) => m.toUpperCase());

const IncidentReports = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => { setLoading(true); setError(''); try { const data = await getIncidents({ size: 500, ...(statusFilter ? { status: statusFilter } : {}) }); setIncidents(pageItems(data)); } catch (e) { setError(e.message || 'Cannot load incidents'); } finally { setLoading(false); } };
  useEffect(() => { load(); }, [statusFilter]);

  const filteredIncidents = useMemo(() => incidents.filter((incident) => `${incident.title || ''} ${incident.reporterEmail || ''} ${incident.type || ''} ${incident.teamId || ''}`.toLowerCase().includes(searchTerm.toLowerCase())), [incidents, searchTerm]);

  return (
    <div className="py-2"><div className="d-flex justify-content-between align-items-center mb-4"><div><h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Incident Review</h1><div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Review and manage backend incident reports</div></div></div>{error && <Alert variant="danger">{error}</Alert>}
      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><div className="p-3 border-bottom d-flex align-items-center justify-content-between"><InputGroup style={{ maxWidth: '300px' }}><InputGroup.Text className="bg-transparent border-end-0"><Search size={16} /></InputGroup.Text><Form.Control className="border-start-0" placeholder="Search incidents..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></InputGroup><Form.Select style={{ width: '180px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="">All Statuses</option><option value="reported">Reported</option><option value="under_review">Under Review</option><option value="resolved">Resolved</option><option value="rejected">Rejected</option></Form.Select></div><div className="table-responsive"><Table className="mb-0" hover><thead><tr><th>ID</th><th>Title</th><th>Reporter</th><th>Type</th><th>Status</th><th>Created</th><th className="text-end">Action</th></tr></thead><tbody>{loading ? <tr><td colSpan="7" className="text-center py-4"><Spinner size="sm" className="me-2" />Loading...</td></tr> : filteredIncidents.length === 0 ? <tr><td colSpan="7" className="text-center py-4 text-muted">No incidents found</td></tr> : filteredIncidents.map((incident) => <tr key={incident.id} className="align-middle"><td className="py-3 small text-muted">{incident.id.slice(0, 8)}</td><td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{incident.title}</td><td className="py-3"><div style={{ color: 'var(--cf-text-primary)' }}>{incident.reporterEmail || incident.reporterId}</div></td><td className="py-3"><span className="d-flex align-items-center gap-1">{incident.type !== 'technical_issue' && <AlertTriangle size={14} className="text-warning" />}{label(incident.type)}</span></td><td className="py-3"><IncidentStatusBadge status={label(incident.status)} /></td><td className="py-3">{incident.createdAt ? new Date(incident.createdAt).toLocaleString() : '-'}</td><td className="py-3 text-end"><Button variant="primary" size="sm" className="d-inline-flex align-items-center gap-1" onClick={() => navigate(`/coordinator/incidents/${incident.id}`)}><Eye size={14} /> Review</Button></td></tr>)}</tbody></Table></div></Card>
    </div>
  );
};

export default IncidentReports;
