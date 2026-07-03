import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Form, InputGroup, Spinner, Table } from 'react-bootstrap';
import { Edit, Plus, Search, Trash2, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { deletePrize, getEvents, getPrizes } from '../../api/hackathonApi';

const pageItems = (data) => data?.content || data || [];

const AwardsManagement = () => {
  const navigate = useNavigate();
  const [awards, setAwards] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventFilter, setEventFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [prizeData, eventData] = await Promise.all([getPrizes({ size: 500, ...(eventFilter ? { eventId: eventFilter } : {}) }), getEvents({ size: 500 })]);
      setAwards(pageItems(prizeData)); setEvents(pageItems(eventData));
    } catch (e) { setError(e.message || 'Cannot load awards'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [eventFilter]);

  const filteredAwards = useMemo(() => awards.filter((award) => `${award.name || ''} ${award.teamName || ''} ${award.trackName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())), [awards, searchTerm]);

  const handleDeleteAward = async (id) => { if (!window.confirm('Delete this award?')) return; try { await deletePrize(id); await load(); } catch (e) { setError(e.message || 'Delete award failed'); } };

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4"><div><h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Awards Management</h1><div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Configure backend prize pools and assign winners</div></div><Button variant="primary" className="d-flex align-items-center gap-2" onClick={() => navigate('/coordinator/awards/new')}><Plus size={18} /> Add Award</Button></div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="p-3 border-bottom d-flex flex-wrap gap-3 justify-content-between"><InputGroup style={{ maxWidth: '300px' }}><InputGroup.Text><Search size={16} /></InputGroup.Text><Form.Control placeholder="Search awards..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></InputGroup><Form.Select style={{ width: '320px' }} value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}><option value="">All Events</option>{events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}</Form.Select></div>
        <div className="table-responsive"><Table className="mb-0" hover><thead><tr><th>Award Name</th><th>Prize</th><th>Track</th><th>Status</th><th>Winner</th><th className="text-end">Actions</th></tr></thead><tbody>{loading ? <tr><td colSpan="6" className="text-center py-4"><Spinner size="sm" className="me-2" />Loading...</td></tr> : filteredAwards.length === 0 ? <tr><td colSpan="6" className="text-center py-4 text-muted">No awards found</td></tr> : filteredAwards.map((award) => <tr key={award.id}><td className="fw-medium py-3 d-flex align-items-center gap-2"><Trophy size={16} className="text-warning" /><span style={{ color: 'var(--cf-text-primary)' }}>{award.name}</span></td><td className="py-3 text-success fw-medium">{award.prizeAmount ?? '-'}</td><td className="py-3">{award.trackName || 'Overall'}</td><td className="py-3"><Badge bg={award.teamId ? 'success' : award.awardedAt ? 'info' : 'secondary'}>{award.teamId ? 'Assigned' : award.awardedAt ? 'Awarded' : 'Unassigned'}</Badge></td><td className="py-3 fw-medium" style={{ color: 'var(--cf-text-primary)' }}>{award.teamName || '-'}</td><td className="py-3 text-end"><Button variant="link" size="sm" className="p-0 text-primary me-3" onClick={() => navigate(`/coordinator/awards/${award.id}/edit`)}><Edit size={16} /></Button><Button variant="link" size="sm" className="p-0 text-danger" onClick={() => handleDeleteAward(award.id)}><Trash2 size={16} /></Button></td></tr>)}</tbody></Table></div>
      </Card>
    </div>
  );
};

export default AwardsManagement;
