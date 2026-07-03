import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Form, InputGroup, Modal, Spinner, Table } from 'react-bootstrap';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { createRoundCriterion, deleteRoundCriterion, getRoundCriteria, getRounds, updateRoundCriterion } from '../../api/hackathonApi';

const pageItems = (data) => data?.content || data || [];

const emptyForm = { name: '', weight: 25, description: '' };

const CriteriaManagement = () => {
  const [criteria, setCriteria] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [selectedRoundId, setSelectedRoundId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadRounds = async () => {
    const data = await getRounds({ size: 500 });
    const list = pageItems(data);
    setRounds(list);
    setSelectedRoundId((prev) => prev || list[0]?.id || '');
  };

  const loadCriteria = async (roundId = selectedRoundId) => {
    if (!roundId) { setCriteria([]); return; }
    const data = await getRoundCriteria({ roundId, size: 500 });
    setCriteria(pageItems(data));
  };

  useEffect(() => { (async () => { setLoading(true); setError(''); try { await loadRounds(); } catch (e) { setError(e.message || 'Cannot load rounds'); } finally { setLoading(false); } })(); }, []);
  useEffect(() => { if (selectedRoundId) { setLoading(true); loadCriteria(selectedRoundId).catch((e) => setError(e.message || 'Cannot load criteria')).finally(() => setLoading(false)); } }, [selectedRoundId]);

  const filteredCriteria = useMemo(() => criteria.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())), [criteria, searchTerm]);
  const totalWeight = criteria.reduce((sum, c) => sum + Number(c.weight || 0), 0);

  const openCreate = () => { setEditingCriteria(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (item) => { setEditingCriteria(item); setForm({ name: item.name || '', weight: item.weight || 0, description: item.description || '' }); setShowModal(true); };

  const handleSaveCriteria = async () => {
    if (!selectedRoundId) { setError('Select round first'); return; }
    if (!form.name || form.weight === '') { setError('Name and weight required'); return; }
    setSaving(true); setError('');
    try {
      if (editingCriteria) await updateRoundCriterion(editingCriteria.id, { name: form.name, weight: Number(form.weight), description: form.description || null });
      else await createRoundCriterion({ roundId: selectedRoundId, name: form.name, weight: Number(form.weight), description: form.description || null });
      setShowModal(false); await loadCriteria();
    } catch (e) { setError(e.message || 'Save criteria failed'); }
    finally { setSaving(false); }
  };

  const handleDeleteCriteria = async (id) => {
    if (!window.confirm('Delete this criteria?')) return;
    try { await deleteRoundCriterion(id); await loadCriteria(); }
    catch (e) { setError(e.message || 'Delete criteria failed'); }
  };

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4"><div><h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Criteria Management</h1><div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Manage backend round scoring criteria</div></div><Button variant="primary" className="d-flex align-items-center gap-2" onClick={openCreate} disabled={!selectedRoundId}><Plus size={18} /> Add Criteria</Button></div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="p-3 border-bottom d-flex flex-wrap gap-3 align-items-center justify-content-between"><InputGroup style={{ maxWidth: '300px' }}><InputGroup.Text><Search size={16} /></InputGroup.Text><Form.Control placeholder="Search criteria..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></InputGroup><div className="d-flex align-items-center gap-2"><Form.Select style={{ width: '320px' }} value={selectedRoundId} onChange={(e) => setSelectedRoundId(e.target.value)}><option value="">Select round</option>{rounds.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</Form.Select><Badge bg={Math.round(totalWeight) === 100 ? 'success' : 'warning'} text={Math.round(totalWeight) === 100 ? 'light' : 'dark'}>Total weight: {totalWeight}%</Badge></div></div>
        <div className="table-responsive"><Table className="mb-0" hover><thead><tr><th>Criteria Name</th><th>Weight</th><th>Description</th><th>Status</th><th className="text-end">Actions</th></tr></thead><tbody>{loading ? <tr><td colSpan="5" className="text-center py-4"><Spinner size="sm" className="me-2" />Loading...</td></tr> : filteredCriteria.length === 0 ? <tr><td colSpan="5" className="text-center py-4 text-muted">No criteria found for selected round</td></tr> : filteredCriteria.map((item) => <tr key={item.id}><td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{item.name}</td><td className="py-3"><Badge bg="secondary" className="bg-opacity-25 text-secondary border">{item.weight}%</Badge></td><td className="py-3">{item.description || '-'}</td><td className="py-3"><Badge bg="success">Active</Badge></td><td className="py-3 text-end"><Button variant="link" size="sm" className="p-0 text-primary me-3" onClick={() => openEdit(item)}><Edit size={16} /></Button><Button variant="link" size="sm" className="p-0 text-danger" onClick={() => handleDeleteCriteria(item.id)}><Trash2 size={16} /></Button></td></tr>)}</tbody></Table></div>
      </Card>
      <Modal show={showModal} onHide={() => { setShowModal(false); setEditingCriteria(null); }}><Modal.Header closeButton><Modal.Title>{editingCriteria ? 'Edit Criteria' : 'Create Criteria'}</Modal.Title></Modal.Header><Modal.Body><Form><Form.Group className="mb-3"><Form.Label>Criteria Name</Form.Label><Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Form.Group><Form.Group className="mb-3"><Form.Label>Weight</Form.Label><Form.Control type="number" min="0" step="0.01" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} /></Form.Group><Form.Group><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Form.Group></Form></Modal.Body><Modal.Footer><Button variant="secondary" onClick={() => { setShowModal(false); setEditingCriteria(null); }}>Cancel</Button><Button variant="primary" disabled={saving} onClick={handleSaveCriteria}>{saving ? 'Saving…' : editingCriteria ? 'Update Criteria' : 'Create Criteria'}</Button></Modal.Footer></Modal>
    </div>
  );
};

export default CriteriaManagement;
