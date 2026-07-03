import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, ProgressBar, Row, Spinner } from 'react-bootstrap';
import { ArrowLeft, MessageSquare, Star, Trophy, Zap } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getRoundRankings, getRounds, getScores, getSubmissions } from '../../api/hackathonApi';

const pageItems = (data) => data?.content || data || [];
const statusLabel = (status) => ({ promoted: 'Advanced', eliminated: 'Eliminated', pending: 'Pending Review' }[status] || status || 'Pending Review');
const statusVariant = (status) => status === 'promoted' ? 'success' : status === 'eliminated' ? 'danger' : 'warning';

const RankingDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [ranking, setRanking] = useState(location.state?.ranking || null);
  const [roundName, setRoundName] = useState(location.state?.roundName || '');
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(!location.state?.ranking);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError('');
      try {
        let found = ranking;
        const rounds = pageItems(await getRounds({ size: 500 }));
        if (!found) {
          for (const round of rounds) {
            const data = pageItems(await getRoundRankings({ roundId: round.id, size: 500 }).catch(() => ({ content: [] })));
            found = data.find((r) => r.id === id);
            if (found) { setRoundName(round.name); break; }
          }
        }
        if (!found) throw new Error('Ranking not found');
        setRanking(found);
        if (!roundName) setRoundName(rounds.find((r) => r.id === found.roundId)?.name || '');
        const submissions = pageItems(await getSubmissions({ teamId: found.teamId, roundId: found.roundId, size: 1 }).catch(() => ({ content: [] })));
        if (submissions[0]?.id) setScores(pageItems(await getScores({ submissionId: submissions[0].id, size: 500 }).catch(() => ({ content: [] }))));
      } catch (e) { setError(e.message || 'Cannot load ranking detail'); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const groupedCriteria = useMemo(() => {
    const byName = {};
    scores.forEach((s) => { const key = s.criterionName || 'Criterion'; if (!byName[key]) byName[key] = []; byName[key].push(Number(s.score || 0)); });
    return Object.entries(byName).map(([name, vals]) => ({ name, score: vals.reduce((a, b) => a + b, 0) / vals.length }));
  }, [scores]);

  if (loading) return <div className="py-4 text-center"><Spinner size="sm" className="me-2" />Loading ranking...</div>;

  return (
    <div className="py-2">
      <div className="d-flex align-items-center gap-3 mb-4"><Button variant="link" className="p-0 text-muted" onClick={() => navigate('/coordinator/ranking')}><ArrowLeft size={24} /></Button><div>{ranking && <div className="d-flex align-items-center gap-3 mb-1"><h1 className="h3 fw-bold mb-0" style={{ color: 'var(--cf-text-primary)' }}>{ranking.teamName}</h1><Badge bg={statusVariant(ranking.status)} className="fs-6" text={ranking.status === 'pending' ? 'dark' : 'light'}>{statusLabel(ranking.status)}</Badge></div>}<div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Round: {roundName || ranking?.roundId}</div></div></div>
      {error && <Alert variant="danger">{error}</Alert>}
      {!ranking ? <Alert variant="warning">Ranking not found</Alert> : <>
        <Row className="g-4 mb-4"><Col lg={4}><Card className="h-100 text-center" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><Card.Body className="d-flex flex-column justify-content-center p-5"><div className="d-flex justify-content-center mb-3"><div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: '80px', height: '80px', backgroundColor: ranking.rank <= 3 ? 'var(--cf-status-warning)' : 'var(--cf-border-color)', color: ranking.rank <= 3 ? '#fff' : 'var(--cf-text-secondary)' }}><Trophy size={40} /></div></div><h2 className="display-4 fw-bold mb-0" style={{ color: 'var(--cf-text-primary)' }}>#{ranking.rank}</h2><p className="text-muted mb-4">Overall Rank</p><div className="pt-4 border-top"><div className="display-6 fw-bold text-primary mb-0">{Number(ranking.totalScore || 0).toFixed(2)}</div><div className="text-muted small">Weighted Score</div></div></Card.Body></Card></Col>
        <Col lg={8}><Card className="h-100" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><Card.Header className="bg-transparent border-bottom p-4"><h5 className="fw-bold mb-0">Score Breakdown</h5><div className="text-muted small mt-1">Average by criterion from score records</div></Card.Header><Card.Body className="p-4">{groupedCriteria.length === 0 ? <div className="text-muted">No score breakdown found.</div> : groupedCriteria.map((c, idx) => <div className="mb-4" key={c.name}><div className="d-flex justify-content-between mb-2"><span className="fw-medium d-flex align-items-center gap-2">{idx === 0 ? <Zap size={16} className="text-warning" /> : <Star size={16} className="text-primary" />} {c.name}</span><span className="fw-bold">{c.score.toFixed(1)}/100</span></div><ProgressBar variant={idx === 0 ? 'warning' : 'primary'} now={c.score} className="rounded-pill" style={{ height: '8px' }} /></div>)}</Card.Body></Card></Col></Row>
        <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><Card.Header className="bg-transparent border-bottom p-4"><h5 className="fw-bold mb-0 d-flex align-items-center gap-2"><MessageSquare size={20} className="text-primary"/> Judges' Feedback</h5></Card.Header><Card.Body className="p-4">{scores.filter((s) => s.comment).length === 0 ? <div className="text-muted">No judge comments yet.</div> : scores.filter((s) => s.comment).map((s) => <div key={s.id} className="p-3 mb-3 rounded" style={{ backgroundColor: 'var(--cf-bg-main)', border: '1px solid var(--cf-border-color)' }}><div className="fw-bold mb-1">{s.judgeEmail || 'Judge'} · {s.criterionName}</div><p className="text-muted mb-0">{s.comment}</p></div>)}<div className="small text-muted mt-3">Tie breaker: {ranking.tieBreakerReason || '-'}</div></Card.Body></Card>
      </>}
    </div>
  );
};

export default RankingDetail;
