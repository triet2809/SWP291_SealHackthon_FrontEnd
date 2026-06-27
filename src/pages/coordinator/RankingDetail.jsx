import React from 'react';
import { Card, Badge, Button, Row, Col, ProgressBar } from 'react-bootstrap';
import { ArrowLeft, Trophy, Star, Zap, Layout, Monitor, MessageSquare } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const RankingDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Expanded mock data with detailed scores for the tie-breaker demonstration
  const allRankings = [
    { 
      id: 'team1', team: 'DataCraft', category: 'Data Science', 
      scores: { innovation: 95, technical: 90, design: 88, presentation: 91 },
      status: 'Advanced' 
    },
    { 
      id: 'team2', team: 'QuantumLeap', category: 'AI/ML', 
      scores: { innovation: 89, technical: 88, design: 80, presentation: 79 },
      status: 'Advanced' 
    },
    { 
      id: 'team3', team: 'Neural Nexus', category: 'AI/ML', 
      scores: { innovation: 84, technical: 92, design: 81, presentation: 79 }, // Same total (336) as QuantumLeap, but lower innovation
      status: 'Pending Review' 
    },
    { 
      id: 'team4', team: 'AlgoArts', category: 'AI/ML', 
      scores: { innovation: 78, technical: 75, design: 80, presentation: 71 },
      status: 'Eliminated' 
    },
  ];

  // Calculate totals and sort
  const scoredRankings = allRankings.map(t => {
    const totalScore = Object.values(t.scores).reduce((sum, val) => sum + val, 0);
    const avgScore = (totalScore / 4).toFixed(1);
    return { ...t, totalScore, avgScore };
  });

  // Sort by totalScore (desc). Tie-breaker: innovation (desc).
  const sortedRankings = [...scoredRankings].sort((a, b) => {
    if (b.totalScore === a.totalScore) {
      return b.scores.innovation - a.scores.innovation;
    }
    return b.totalScore - a.totalScore;
  });

  // Assign ranks
  const finalRankings = sortedRankings.map((t, idx) => ({ ...t, rank: idx + 1 }));

  // Find the specific team being viewed
  const teamId = id || 'team1';
  const teamData = finalRankings.find(t => t.id === teamId) || finalRankings[0];

  return (
    <div className="py-2">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Button variant="link" className="p-0 text-muted" onClick={() => navigate('/coordinator/ranking')}>
          <ArrowLeft size={24} />
        </Button>
        <div>
          <div className="d-flex align-items-center gap-3 mb-1">
            <h1 className="h3 fw-bold mb-0" style={{ color: 'var(--cf-text-primary)' }}>{teamData.team}</h1>
            <Badge bg={
                teamData.status === 'Advanced' ? 'success' :
                teamData.status === 'Eliminated' ? 'danger' : 'warning'
            } className="fs-6" text={teamData.status === 'Pending Review' ? 'dark' : 'light'}>
                {teamData.status}
            </Badge>
          </div>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Category: {teamData.category}</div>
        </div>
      </div>

      <Row className="g-4 mb-4">
        <Col lg={4}>
          <Card className="h-100 text-center" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="d-flex flex-column justify-content-center p-5">
              <div className="d-flex justify-content-center mb-3">
                <div className="d-flex align-items-center justify-content-center rounded-circle" 
                     style={{ width: '80px', height: '80px', backgroundColor: teamData.rank <= 3 ? 'var(--cf-status-warning)' : 'var(--cf-border-color)', color: teamData.rank <= 3 ? '#fff' : 'var(--cf-text-secondary)' }}>
                  <Trophy size={40} />
                </div>
              </div>
              <h2 className="display-4 fw-bold mb-0" style={{ color: 'var(--cf-text-primary)' }}>#{teamData.rank}</h2>
              <p className="text-muted mb-4">Overall Rank</p>
              
              <div className="pt-4 border-top">
                <div className="display-6 fw-bold text-primary mb-0">{teamData.avgScore} <span className="fs-5 text-muted">/ 100</span></div>
                <div className="text-muted small">Average Final Score</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="h-100" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Header className="bg-transparent border-bottom p-4">
              <h5 className="fw-bold mb-0">Score Breakdown</h5>
              <div className="text-muted small mt-1">Detailed evaluation across standard criteria</div>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-medium d-flex align-items-center gap-2"><Zap size={16} className="text-warning"/> Innovation & Originality <Badge bg="warning" text="dark" className="ms-2">Primary Tie-breaker</Badge></span>
                  <span className="fw-bold">{teamData.scores.innovation}/100</span>
                </div>
                <ProgressBar variant="warning" now={teamData.scores.innovation} className="rounded-pill" style={{ height: '8px' }} />
              </div>
              
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-medium d-flex align-items-center gap-2"><Monitor size={16} className="text-primary"/> Technical Complexity</span>
                  <span className="fw-bold">{teamData.scores.technical}/100</span>
                </div>
                <ProgressBar variant="primary" now={teamData.scores.technical} className="rounded-pill" style={{ height: '8px' }} />
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-medium d-flex align-items-center gap-2"><Layout size={16} className="text-info"/> UI/UX & Design</span>
                  <span className="fw-bold">{teamData.scores.design}/100</span>
                </div>
                <ProgressBar variant="info" now={teamData.scores.design} className="rounded-pill" style={{ height: '8px' }} />
              </div>

              <div className="mb-0">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-medium d-flex align-items-center gap-2"><Star size={16} className="text-success"/> Presentation & Pitch</span>
                  <span className="fw-bold">{teamData.scores.presentation}/100</span>
                </div>
                <ProgressBar variant="success" now={teamData.scores.presentation} className="rounded-pill" style={{ height: '8px' }} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <Card.Header className="bg-transparent border-bottom p-4">
          <h5 className="fw-bold mb-0 d-flex align-items-center gap-2"><MessageSquare size={20} className="text-primary"/> Judges' Feedback</h5>
        </Card.Header>
        <Card.Body className="p-4">
          <div className="p-3 mb-3 rounded" style={{ backgroundColor: 'var(--cf-bg-main)', border: '1px solid var(--cf-border-color)' }}>
            <div className="fw-bold mb-1">Lead Judge (Dr. Priya Patel)</div>
            <p className="text-muted mb-0">Exceptional approach to the core problem. The machine learning model was well-trained and deployed effectively. The UI could use a bit more polish, but the backend architecture is incredibly solid.</p>
          </div>
          <div className="p-3 rounded" style={{ backgroundColor: 'var(--cf-bg-main)', border: '1px solid var(--cf-border-color)' }}>
            <div className="fw-bold mb-1">Panel Judge (Marcus Wright)</div>
            <p className="text-muted mb-0">Very impressive presentation. The team clearly understood the market need. The technical complexity was slightly lower than other teams, but their innovation in solving the user pain points was top-tier.</p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RankingDetail;
