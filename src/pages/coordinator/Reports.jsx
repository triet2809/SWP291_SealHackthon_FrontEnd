import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Form, InputGroup, Modal, Row, Spinner } from 'react-bootstrap';
import { BarChart2, Download, Eye, FileText, Search } from 'lucide-react';
import { downloadRankingCsv, getAnonymizedDataset, getJudgeVariance, getRounds } from '../../api/hackathonApi';

const pageItems = (data) => data?.content || data || [];

const Reports = () => {
  const [rounds, setRounds] = useState([]);
  const [selectedRoundId, setSelectedRoundId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [preview, setPreview] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { (async () => { setLoading(true); setError(''); try { const list = pageItems(await getRounds({ size: 500 })); setRounds(list); setSelectedRoundId(list[0]?.id || ''); } catch (e) { setError(e.message || 'Cannot load rounds'); } finally { setLoading(false); } })(); }, []);

  const reports = useMemo(() => [
    { id: 'ranking-csv', name: 'Round Ranking CSV', type: 'CSV', description: 'Official persisted ranking export for selected round.' },
    { id: 'anonymized-dataset', name: 'Anonymized Scoring Dataset', type: 'JSON', description: 'Team and judge identities replaced with stable aliases.' },
    { id: 'judge-variance', name: 'Judge Variance Analytics', type: 'JSON', description: 'Mean, variance, stddev, min/max per team and criterion.' },
  ], []);
  const filteredReports = reports.filter((report) => report.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const downloadText = (name, text, mime = 'text/plain') => { const blob = new Blob([text], { type: mime }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url); };
  const handleDownload = async (report) => { if (!selectedRoundId) { setError('Select round first'); return; } setError(''); try { if (report.id === 'ranking-csv') downloadText(`round-${selectedRoundId}-ranking.csv`, await downloadRankingCsv(selectedRoundId), 'text/csv'); if (report.id === 'anonymized-dataset') downloadText(`round-${selectedRoundId}-anonymized.json`, JSON.stringify(await getAnonymizedDataset(selectedRoundId), null, 2), 'application/json'); if (report.id === 'judge-variance') downloadText(`round-${selectedRoundId}-judge-variance.json`, JSON.stringify(await getJudgeVariance(selectedRoundId), null, 2), 'application/json'); } catch (e) { setError(e.message || 'Download failed'); } };
  const handlePreview = async (report) => { if (!selectedRoundId) { setError('Select round first'); return; } setError(''); try { const data = report.id === 'ranking-csv' ? await downloadRankingCsv(selectedRoundId) : report.id === 'anonymized-dataset' ? await getAnonymizedDataset(selectedRoundId) : await getJudgeVariance(selectedRoundId); setPreview({ report, data }); setShowViewModal(true); } catch (e) { setError(e.message || 'Preview failed'); } };

  return (
    <div className="py-2"><div className="d-flex justify-content-between align-items-center mb-4"><div><h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Reports & Analytics</h1><div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Export ranking, anonymized score data, and judge variance analytics</div></div><Button variant="primary" className="d-flex align-items-center gap-2" onClick={() => handlePreview(reports[2])}><BarChart2 size={18} /> Preview Analytics</Button></div>{error && <Alert variant="danger">{error}</Alert>}
      <Row className="g-4 mb-4"><Col md={6}><Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%' }}><Card.Body className="p-4 d-flex flex-column align-items-center justify-content-center text-center"><div className="mb-3 text-primary bg-primary bg-opacity-10 p-3 rounded-circle"><Download size={32} /></div><h5 className="fw-bold" style={{ color: 'var(--cf-text-primary)' }}>Select Round</h5><p style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Reports are generated from backend score/ranking endpoints.</p>{loading ? <Spinner size="sm" /> : <Form.Select value={selectedRoundId} onChange={(e) => setSelectedRoundId(e.target.value)}>{rounds.map((round) => <option key={round.id} value={round.id}>{round.name}</option>)}</Form.Select>}</Card.Body></Card></Col><Col md={6}><Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%' }}><Card.Body className="p-4"><InputGroup className="mb-3"><InputGroup.Text><Search size={16} /></InputGroup.Text><Form.Control placeholder="Search reports..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></InputGroup><h5 className="fw-bold mb-4" style={{ color: 'var(--cf-text-primary)' }}>Available Reports</h5><div className="d-flex flex-column gap-3">{filteredReports.map((report) => <div key={report.id} className="d-flex align-items-center justify-content-between p-3 rounded" style={{ backgroundColor: 'var(--cf-bg-main)' }}><div className="d-flex align-items-center gap-3"><FileText size={18} className="text-secondary" /><div><div className="fw-medium" style={{ color: 'var(--cf-text-primary)' }}>{report.name}</div><div style={{ fontSize: '0.75rem', color: 'var(--cf-text-secondary)' }}>{report.type} • {report.description}</div></div></div><div className="d-flex gap-2"><Button variant="link" size="sm" className="p-0 text-primary" onClick={() => handlePreview(report)}><Eye size={16} /></Button><Button variant="link" size="sm" className="p-0 text-success" onClick={() => handleDownload(report)}><Download size={16} /></Button></div></div>)}</div></Card.Body></Card></Col></Row>
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg"><Modal.Header closeButton><Modal.Title>{preview?.report?.name}</Modal.Title></Modal.Header><Modal.Body><pre className="p-3 rounded" style={{ backgroundColor: 'var(--cf-bg-main)', maxHeight: '60vh', overflow: 'auto' }}>{typeof preview?.data === 'string' ? preview.data : JSON.stringify(preview?.data, null, 2)}</pre></Modal.Body><Modal.Footer><Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button></Modal.Footer></Modal>
    </div>
  );
};

export default Reports;
