import React, { useState } from 'react';
import { Card, Button, Form, Badge, Row, Col } from 'react-bootstrap';
import { ArrowLeft, UserCheck, Mail, Bookmark, Layers } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const JudgeAssign = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock judges array
  const judges = [
    { id: 1, name: 'Prof. James Kim', email: 'j.kim@meridian.edu', role: 'Lead Judge', assignedTracks: ['AI Track A', 'Web Track B'], assignedRounds: ['Preliminary', 'Finals'], status: 'Confirmed' },
    { id: 2, name: 'Dr. Emily Chen', email: 'e.chen@fpt.edu.vn', role: 'Panel Judge', assignedTracks: ['Data Track B'], assignedRounds: ['Finals'], status: 'Confirmed' },
    { id: 3, name: 'Michael Ross', email: 'm.ross@techcorp.com', role: 'Guest Judge', assignedTracks: ['Web Track A'], assignedRounds: ['Preliminary'], status: 'Pending Invite' },
  ];

  const judgeId = parseInt(id) || 1;
  const judge = judges.find(j => j.id === judgeId) || judges[0];

  // Mock data for Tracks and Rounds in the event
  const availableTracks = [
    { id: 't1', name: 'AI Track A' },
    { id: 't2', name: 'AI Track B' },
    { id: 't3', name: 'Web Track A' },
    { id: 't4', name: 'Web Track B' },
    { id: 't5', name: 'Data Track A' },
  ];

  const availableRounds = [
    { id: 'r1', name: 'Preliminary' },
    { id: 'r2', name: 'Semi-Finals' },
    { id: 'r3', name: 'Finals' },
  ];

  const [selectedTracks, setSelectedTracks] = useState(
    availableTracks.filter(t => judge.assignedTracks.includes(t.name)).map(t => t.id)
  );

  const [selectedRounds, setSelectedRounds] = useState(
    availableRounds.filter(r => judge.assignedRounds.includes(r.name)).map(r => r.id)
  );

  const handleToggleTrack = (trackId) => {
    if (selectedTracks.includes(trackId)) {
      setSelectedTracks(selectedTracks.filter(id => id !== trackId));
    } else {
      setSelectedTracks([...selectedTracks, trackId]);
    }
  };

  const handleToggleRound = (roundId) => {
    if (selectedRounds.includes(roundId)) {
      setSelectedRounds(selectedRounds.filter(id => id !== roundId));
    } else {
      setSelectedRounds([...selectedRounds, roundId]);
    }
  };

  const handleSave = () => {
    alert('Judge assignments saved successfully!');
    navigate('/coordinator/judges');
  };

  return (
    <div className="py-2">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Button variant="link" className="p-0 text-muted" onClick={() => navigate('/coordinator/judges')}>
          <ArrowLeft size={24} />
        </Button>
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Assign Tracks & Rounds to Judge</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Select what this judge will evaluate</div>
        </div>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '1.5rem' }}>
        <Card.Body className="p-4 d-flex justify-content-between align-items-center">
          <div className="d-flex gap-4 align-items-center">
            <div className="d-flex align-items-center justify-content-center rounded-circle bg-info bg-opacity-10 text-info" style={{ width: '64px', height: '64px' }}>
              <UserCheck size={32} />
            </div>
            <div>
              <h4 className="fw-bold mb-1">{judge.name}</h4>
              <div className="text-muted d-flex gap-3 align-items-center">
                <span><Mail size={14} className="me-1" /> {judge.email}</span>
                <span><Bookmark size={14} className="me-1" /> {judge.role}</span>
                <Badge bg={judge.status === 'Confirmed' ? 'success' : 'warning'} text={judge.status === 'Pending Invite' ? 'dark' : 'light'}>
                  {judge.status}
                </Badge>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Row className="g-4">
        <Col md={6}>
          <Card className="h-100" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Header className="bg-transparent border-bottom p-4">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2"><Layers size={20} className="text-primary" /> Assign Tracks</h5>
              <div className="text-muted small mt-1">Which specific tracks will they judge?</div>
            </Card.Header>
            <Card.Body className="p-4">
              <Form className="d-flex flex-column gap-3">
                {availableTracks.map(track => {
                  const isSelected = selectedTracks.includes(track.id);
                  return (
                    <div 
                      key={track.id}
                      className={`p-3 rounded border ${isSelected ? 'border-primary bg-primary bg-opacity-10' : 'border-light'}`}
                      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                      onClick={() => handleToggleTrack(track.id)}
                    >
                      <Form.Check 
                        type="checkbox" 
                        id={`track-${track.id}`}
                        label={<span className="fw-medium ms-2">{track.name}</span>}
                        checked={isSelected}
                        onChange={() => {}}
                        className="mb-0"
                      />
                    </div>
                  );
                })}
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Header className="bg-transparent border-bottom p-4">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2"><Bookmark size={20} className="text-info" /> Assign Rounds</h5>
              <div className="text-muted small mt-1">Which rounds will they participate in?</div>
            </Card.Header>
            <Card.Body className="p-4">
              <Form className="d-flex flex-column gap-3">
                {availableRounds.map(round => {
                  const isSelected = selectedRounds.includes(round.id);
                  return (
                    <div 
                      key={round.id}
                      className={`p-3 rounded border ${isSelected ? 'border-info bg-info bg-opacity-10' : 'border-light'}`}
                      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                      onClick={() => handleToggleRound(round.id)}
                    >
                      <Form.Check 
                        type="checkbox" 
                        id={`round-${round.id}`}
                        label={<span className="fw-medium ms-2">{round.name}</span>}
                        checked={isSelected}
                        onChange={() => {}}
                        className="mb-0"
                      />
                    </div>
                  );
                })}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="mt-4 d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={() => navigate('/coordinator/judges')}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save Judge Assignments</Button>
      </div>
    </div>
  );
};

export default JudgeAssign;
