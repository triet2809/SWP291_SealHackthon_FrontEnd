import React, { useState } from 'react';
import { Card, Table, Badge, Button, Row, Col, Modal, Form } from 'react-bootstrap';
import { ArrowLeft, Calendar, Users, Target, Plus, Eye, CheckCircle, Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import TrackGeneratorModal from '../../components/coordinator/TrackGeneratorModal';
import { mentorAssignedTeams } from '../../data/mockData'; // Reusing mock teams for simplicity

const EventDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock Event Data
  const event = {
    id: id,
    name: 'SEAL Hackathon 2026',
    term: 'Summer 2026',
    prize: '$5000',
    registrationStartDate: 'May 01, 2026',
    registrationEndDate: 'June 15, 2026',
    startDate: 'June 20, 2026',
    endDate: 'June 22, 2026',
    status: 'Active',
    description: 'The premier software engineering and AI hackathon for students.',
    participants: 168
  };

  const [activeTab, setActiveTab] = useState('Rounds'); // 'Rounds' | 'Teams'
  
  // Mock Rounds Data (Re-used from old RoundManagement)
  const [rounds, setRounds] = useState([
    { id: 1, name: 'Registration', startDate: 'May 01, 2026', endDate: 'June 16, 2026', status: 'Completed', tracks: [] },
    { id: 2, name: 'Preliminary Submission', startDate: 'June 17, 2026', endDate: 'June 19, 2026', status: 'Active', tracks: [] },
    { id: 3, name: 'Final Judging', startDate: 'June 20, 2026', endDate: 'June 22, 2026', status: 'Upcoming', tracks: [] },
  ]);

  const [showRoundModal, setShowRoundModal] = useState(false);
  const [newRound, setNewRound] = useState({ name: '', startDate: '', endDate: '', status: 'Upcoming' });

  // Track Generator State
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [selectedRoundForTracks, setSelectedRoundForTracks] = useState(null);

  const handleSaveRound = () => {
    if (!newRound.name || !newRound.startDate || !newRound.endDate) {
      alert('Please fill all fields');
      return;
    }
    setRounds([...rounds, { id: Date.now(), ...newRound, tracks: [] }]);
    setNewRound({ name: '', startDate: '', endDate: '', status: 'Upcoming' });
    setShowRoundModal(false);
  };

  const handleGenerateTracks = (category, trackNames, availableTeams) => {
    // This is called when TrackGeneratorModal confirms generation
    // We attach these tracks to the selected round
    
    // Simulate distributing teams evenly across tracks
    const numTracks = trackNames.length;
    const shuffled = [...availableTeams].sort(() => 0.5 - Math.random());
    
    const generatedTracks = trackNames.map((name, index) => {
      // Pick teams for this track (e.g. every nth team)
      const assignedTeams = shuffled.filter((_, idx) => idx % numTracks === index);
      return {
        name: name,
        category: category !== 'All' ? category : 'Mixed',
        assignedTeamIds: assignedTeams.map(t => t.id)
      };
    });

    setRounds(rounds.map(r => r.id === selectedRoundForTracks.id ? { ...r, tracks: generatedTracks } : r));
    alert(`Successfully divided round into ${numTracks} tracks!`);
  };

  return (
    <div className="py-2">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Button variant="link" className="p-0 text-muted" onClick={() => navigate('/coordinator/events')}>
          <ArrowLeft size={24} />
        </Button>
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>{event.name}</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>{event.term} • {event.description}</div>
        </div>
        <Badge bg="success" className="ms-auto px-3 py-2 fs-6">{event.status}</Badge>
      </div>

      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="h-100" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="d-flex align-items-center gap-3 p-3">
              <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary" style={{ width: '40px', height: '40px' }}>
                <Calendar size={20} />
              </div>
              <div>
                <div className="text-muted small fw-medium">Event Dates</div>
                <div className="fw-bold">{event.startDate} - {event.endDate}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="d-flex align-items-center gap-3 p-3">
              <div className="d-flex align-items-center justify-content-center rounded-circle bg-info bg-opacity-10 text-info" style={{ width: '40px', height: '40px' }}>
                <Users size={20} />
              </div>
              <div>
                <div className="text-muted small fw-medium">Participants</div>
                <div className="fw-bold">{event.participants} Teams</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="d-flex align-items-center gap-3 p-3">
              <div className="d-flex align-items-center justify-content-center rounded-circle bg-warning bg-opacity-10 text-warning" style={{ width: '40px', height: '40px' }}>
                <Target size={20} />
              </div>
              <div>
                <div className="text-muted small fw-medium">Total Rounds</div>
                <div className="fw-bold">{rounds.length} Rounds</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <div className="d-flex gap-4 mb-4 border-bottom pb-2">
        <div 
          className={`cursor-pointer fw-medium pb-2 ${activeTab === 'Rounds' ? 'text-primary border-bottom border-primary border-2' : 'text-muted'}`}
          onClick={() => setActiveTab('Rounds')}
          style={{ cursor: 'pointer' }}
        >
          Event Rounds & Tracks
        </div>
        <div 
          className={`cursor-pointer fw-medium pb-2 ${activeTab === 'Teams' ? 'text-primary border-bottom border-primary border-2' : 'text-muted'}`}
          onClick={() => setActiveTab('Teams')}
          style={{ cursor: 'pointer' }}
        >
          Participating Teams
        </div>
      </div>

      {activeTab === 'Rounds' && (
        <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">Rounds</h5>
            <Button variant="primary" size="sm" className="d-flex align-items-center gap-2" onClick={() => setShowRoundModal(true)}>
              <Plus size={16} /> Add Round
            </Button>
          </div>
          <div className="table-responsive">
            <Table className="mb-0 align-middle" hover>
              <thead>
                <tr>
                  <th className="border-top-0 border-bottom text-muted py-3">Round Name</th>
                  <th className="border-top-0 border-bottom text-muted py-3">Duration</th>
                  <th className="border-top-0 border-bottom text-muted py-3">Status</th>
                  <th className="border-top-0 border-bottom text-muted py-3">Tracks</th>
                  <th className="border-top-0 border-bottom text-muted py-3 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rounds.map((round) => (
                  <tr key={round.id}>
                    <td className="fw-bold py-3" style={{ color: 'var(--cf-text-primary)' }}>{round.name}</td>
                    <td className="py-3 text-muted">{round.startDate} - {round.endDate}</td>
                    <td className="py-3">
                      <Badge bg={round.status === 'Completed' ? 'success' : round.status === 'Active' ? 'primary' : 'secondary'}>
                        {round.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      {round.tracks && round.tracks.length > 0 ? (
                        <div className="d-flex gap-1 flex-wrap">
                          {round.tracks.map((t, i) => (
                            <Badge key={i} bg="info" text="dark">{t.name} ({t.assignedTeamIds.length} teams)</Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted small">No tracks created</span>
                      )}
                    </td>
                    <td className="py-3 text-end">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={() => {
                          setSelectedRoundForTracks(round);
                          setShowGeneratorModal(true);
                        }}
                      >
                        Create Tracks
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}

      {activeTab === 'Teams' && (
        <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div className="p-3 border-bottom">
            <h5 className="fw-bold mb-0">Registered Teams</h5>
          </div>
          <div className="table-responsive">
            <Table className="mb-0 align-middle" hover>
              <thead>
                <tr>
                  <th className="border-top-0 border-bottom text-muted py-3">Team Name</th>
                  <th className="border-top-0 border-bottom text-muted py-3">Project</th>
                  <th className="border-top-0 border-bottom text-muted py-3">Category</th>
                  <th className="border-top-0 border-bottom text-muted py-3 text-center">Size</th>
                  <th className="border-top-0 border-bottom text-muted py-3 text-end">Status</th>
                </tr>
              </thead>
              <tbody>
                {mentorAssignedTeams.map((team) => (
                  <tr key={team.id}>
                    <td className="fw-bold py-3" style={{ color: 'var(--cf-text-primary)' }}>{team.name}</td>
                    <td className="py-3 text-muted">{team.project}</td>
                    <td className="py-3"><Badge bg="secondary">{team.category}</Badge></td>
                    <td className="py-3 text-center">{team.members}</td>
                    <td className="py-3 text-end">
                      <Badge bg="success">Registered</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}

      {/* Add Round Modal */}
      <Modal show={showRoundModal} onHide={() => setShowRoundModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Round</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Round Name</Form.Label>
              <Form.Control type="text" value={newRound.name} onChange={(e) => setNewRound({...newRound, name: e.target.value})} />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control type="date" value={newRound.startDate} onChange={(e) => setNewRound({...newRound, startDate: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control type="date" value={newRound.endDate} onChange={(e) => setNewRound({...newRound, endDate: e.target.value})} />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRoundModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveRound}>Save Round</Button>
        </Modal.Footer>
      </Modal>

      {/* Track Generator Modal */}
      {selectedRoundForTracks && (
        <TrackGeneratorModal
          show={showGeneratorModal}
          onHide={() => setShowGeneratorModal(false)}
          teams={mentorAssignedTeams}
          onGenerate={handleGenerateTracks}
        />
      )}
    </div>
  );
};

export default EventDetails;
