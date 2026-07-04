import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { ArrowLeft, Trophy, DollarSign, Tag, CheckCircle, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPrize, createPrize, updatePrize, getEvents, getTeams } from '../../api/hackathonApi';

const listOf = (data) => data?.content || data || [];

const AwardForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [award, setAward] = useState({
    name: '',
    prize: '',
    category: 'Overall',
    status: 'Unassigned',
    winner: '',
    teamId: '',
    eventId: ''
  });
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setError('');
        const evData = await getEvents({ size: 100 });
        const evList = listOf(evData);
        if (!active) return;
        setEvents(evList);

        if (isEditing) {
          const prize = await getPrize(id);
          if (!active) return;
          setAward({
            name: prize.name || '',
            prize: prize.description || '',
            category: prize.trackName || 'Overall',
            status: prize.teamId ? 'Assigned' : 'Unassigned',
            winner: prize.teamName || '',
            teamId: prize.teamId || '',
            eventId: prize.eventId || ''
          });
          const teamData = await getTeams({ eventId: prize.eventId, size: 200 });
          if (active) setTeams(listOf(teamData));
        } else if (evList.length === 1) {
          setAward((prev) => ({ ...prev, eventId: evList[0].id }));
        }
      } catch (err) {
        if (active) setError(err.message || 'Failed to load award');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAward(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!award.name || !award.prize) {
      alert('Please fill out the award name and prize amount.');
      return;
    }
    if (!award.eventId) {
      alert('Please select an event for this award.');
      return;
    }
    try {
      setSaving(true);
      setError('');
      const payload = {
        eventId: award.eventId,
        name: award.name,
        description: award.prize
      };
      if (isEditing) {
        const patch = { name: award.name, description: award.prize };
        // Winner assignment: set team + awardedAt, or clear both when unassigned.
        if (award.teamId) {
          patch.teamId = award.teamId;
          patch.awardedAt = new Date().toISOString().slice(0, 19);
        }
        await updatePrize(id, patch);
      } else {
        await createPrize(payload);
      }
      navigate('/coordinator/awards');
    } catch (err) {
      setError(err.message || 'Failed to save award');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Button variant="link" className="p-0 text-muted" onClick={() => navigate('/coordinator/awards')}>
          <ArrowLeft size={24} />
        </Button>
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>
            {isEditing ? 'Edit Award' : 'Create New Award'}
          </h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>
            {isEditing ? 'Update prize details and assign winners' : 'Configure a new prize pool'}
          </div>
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      <Row className="justify-content-center">
        <Col lg={8}>
          <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="p-4 p-md-5">
              <Form>
                <div className="mb-4">
                  <h5 className="fw-bold mb-3 border-bottom pb-2">Basic Information</h5>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium d-flex align-items-center gap-2"><Trophy size={16} className="text-warning"/> Award Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="e.g. Grand Prize Winner"
                      value={award.name}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium d-flex align-items-center gap-2"><DollarSign size={16} className="text-success"/> Prize Amount</Form.Label>
                        <Form.Control
                          type="text"
                          name="prize"
                          placeholder="e.g. $10,000"
                          value={award.prize}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium d-flex align-items-center gap-2"><Tag size={16} className="text-info"/> Event</Form.Label>
                        <Form.Select name="eventId" value={award.eventId} onChange={handleChange} disabled={isEditing}>
                          <option value="">Select Event</option>
                          {events.map((ev) => (
                            <option key={ev.id} value={ev.id}>{ev.title}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                <div className="mb-4">
                  <h5 className="fw-bold mb-3 border-bottom pb-2">Assignment</h5>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium d-flex align-items-center gap-2"><CheckCircle size={16} className="text-primary"/> Status</Form.Label>
                        <Form.Control type="text" value={award.teamId ? 'Assigned' : 'Unassigned'} disabled />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium d-flex align-items-center gap-2"><Users size={16} className="text-secondary"/> Winner (Team)</Form.Label>
                        {isEditing ? (
                          <Form.Select name="teamId" value={award.teamId} onChange={handleChange}>
                            <option value="">— No winner (unassigned) —</option>
                            {teams.map((t) => (
                              <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                          </Form.Select>
                        ) : (
                          <Form.Control type="text" value="Save award first, then assign a winner" disabled />
                        )}
                        <Form.Text className="text-muted">Select the winning team to award this prize.</Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                <div className="d-flex justify-content-end gap-3 mt-5 pt-3 border-top">
                  <Button variant="secondary" onClick={() => navigate('/coordinator/awards')} disabled={saving}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Award'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AwardForm;
