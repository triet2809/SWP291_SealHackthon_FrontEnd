import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Form, InputGroup, Modal, Spinner, Table } from 'react-bootstrap';
import { Download, Eye, History, Search } from 'lucide-react';
import { getAuditLogs } from '../../api/hackathonApi';

const pageItems = (data) => data?.content || data || [];

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => { (async () => { setLoading(true); setError(''); try { setLogs(pageItems(await getAuditLogs({ size: 500, sort: 'occurredAt,desc' }))); } catch (e) { setError(e.message || 'Cannot load audit logs'); } finally { setLoading(false); } })(); }, []);

  const actions = useMemo(() => Array.from(new Set(logs.map((l) => l.action).filter(Boolean))), [logs]);
  const filteredLogs = logs.filter((log) => { const hay = `${log.action || ''} ${log.userEmail || ''} ${log.teamName || ''} ${log.targetType || ''} ${log.details || ''}`.toLowerCase(); return hay.includes(searchTerm.toLowerCase()) && (actionFilter === 'All' || log.action === actionFilter); });
  const exportCsv = () => { const header = ['occurredAt','action','userEmail','targetType','targetId','teamName','details']; const lines = [header.join(',')].concat(filteredLogs.map((l) => header.map((k) => JSON.stringify(l[k] ?? '')).join(','))); const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `audit-logs-${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url); };

  return <div className="py-2"><div className="d-flex justify-content-between align-items-center mb-4"><div><h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Audit Logs</h1><div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Track system activity and administrative actions</div></div></div>{error && <Alert variant="danger">{error}</Alert>}<Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><div className="p-3 border-bottom d-flex align-items-center justify-content-between"><InputGroup style={{ maxWidth: '300px' }}><InputGroup.Text><Search size={16} /></InputGroup.Text><Form.Control placeholder="Search logs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></InputGroup><div className="d-flex gap-2"><Form.Select style={{ width: '220px' }} value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}><option>All</option>{actions.map((a) => <option key={a}>{a}</option>)}</Form.Select><Button variant="outline-primary" onClick={exportCsv} className="d-flex align-items-center gap-1"><Download size={16} />Export</Button></div></div><div className="table-responsive"><Table className="mb-0" hover><thead><tr><th>Timestamp</th><th>Action</th><th>User</th><th>Target</th><th>Team</th><th>Details</th><th className="text-end">Actions</th></tr></thead><tbody>{loading ? <tr><td colSpan="7" className="text-center py-4"><Spinner size="sm" className="me-2" />Loading...</td></tr> : filteredLogs.length === 0 ? <tr><td colSpan="7" className="text-center py-4 text-muted">No audit logs</td></tr> : filteredLogs.map((log) => <tr key={log.id}><td className="py-3" style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}><div className="d-flex align-items-center gap-2"><History size={14} /> {log.occurredAt ? new Date(log.occurredAt).toLocaleString() : '-'}</div></td><td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{log.action}</td><td className="py-3">{log.userEmail || log.userId || '-'}</td><td className="py-3"><Badge bg="secondary" className="bg-opacity-25 text-secondary border">{log.targetType || '-'}</Badge></td><td className="py-3">{log.teamName || log.teamId || '-'}</td><td className="py-3 text-truncate" style={{ maxWidth: 280 }}>{log.details || log.newValue || '-'}</td><td className="py-3 text-end"><Button variant="link" size="sm" className="p-0 text-primary" onClick={() => { setSelectedLog(log); setShowModal(true); }}><Eye size={16} /></Button></td></tr>)}</tbody></Table></div></Card><Modal show={showModal} onHide={() => setShowModal(false)}><Modal.Header closeButton><Modal.Title>Audit Log Details</Modal.Title></Modal.Header><Modal.Body>{selectedLog && <pre className="small bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(selectedLog, null, 2)}</pre>}</Modal.Body><Modal.Footer><Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button></Modal.Footer></Modal></div>;
};

export default AuditLogs;
