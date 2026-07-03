import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, ProgressBar, Row, Spinner, Table } from 'react-bootstrap';
import { ArrowLeft, Code, ExternalLink, FileText, ShieldCheck } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRounds, getScores, getSubmission, getTeams, getTracks } from '../../api/hackathonApi';

const pageItems = (data) => data?.content || data || [];
const avg = (items) => items.length ? items.reduce((sum, item) => sum + Number(item.score || 0), 0) / items.length : 0;

const SubmissionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [scores, setScores] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError('');
      try {
        const sub = await getSubmission(id);
        setSubmission(sub);
        const [scoreData, roundData, trackData, teamData] = await Promise.all([
          getScores({ submissionId: id, size: 500 }).catch(() => ({ content: [] })),
          getRounds({ size: 500 }).catch(() => ({ content: [] })),
          getTracks({ size: 500 }).catch(() => ({ content: [] })),
          getTeams({ size: 500 }).catch(() => ({ content: [] })),
        ]);
        setScores(pageItems(scoreData)); setRounds(pageItems(roundData)); setTracks(pageItems(trackData)); setTeams(pageItems(teamData));
      } catch (e) { setError(e.message || 'Cannot load submission'); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const roundMap = useMemo(() => Object.fromEntries(rounds.map((r) => [r.id, r])), [rounds]);
  const trackMap = useMemo(() => Object.fromEntries(tracks.map((t) => [t.id, t])), [tracks]);
  const teamMap = useMemo(() => Object.fromEntries(teams.map((t) => [t.id, t])), [teams]);
  const criteria = useMemo(() => scores.map((s) => ({ name: s.criterionName || 'Criterion', score: Number(s.score || 0), weightedScore: Number(s.weightedScore || 0) })), [scores]);
  const averageScore = avg(scores);
  const judges = useMemo(() => scores.reduce((acc, s) => { const key = s.judgeId || s.judgeEmail || 'unknown'; if (!acc[key]) acc[key] = { judgeEmail: s.judgeEmail || key, total: 0, count: 0, comments: [] }; acc[key].total += Number(s.score || 0); acc[key].count += 1; if (s.comment) acc[key].comments.push(s.comment); return acc; }, {}), [scores]);

  if (loading) return <div className="py-4 text-center"><Spinner size="sm" className="me-2" />Loading submission...</div>;

  const round = roundMap[submission?.roundId];
  const track = trackMap[submission?.trackId];
  const team = teamMap[submission?.teamId];

  return (
    <div className="py-2">
      <div className="d-flex align-items-center gap-3 mb-4"><Button variant="link" className="p-0 text-muted" onClick={() => navigate('/coordinator/submissions')}><ArrowLeft size={24} /></Button><div><h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Submission Details</h1><div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Review project links and scoring data</div></div></div>
      {error && <Alert variant="danger">{error}</Alert>}
      {!submission ? <Alert variant="warning">Submission not found</Alert> : <Row className="g-4">
        <Col lg={8}>
          <Card className="mb-4" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-start mb-4"><div><h4 className="fw-bold mb-2">{submission.teamName || team?.name || 'Submission'}</h4><div className="d-flex align-items-center gap-2 text-muted small"><span>Team <strong>{submission.teamName || team?.name || submission.teamId}</strong></span><span>•</span><Badge bg="secondary">{track?.name || submission.trackId}</Badge><Badge bg="info" text="dark">{round?.name || submission.roundId}</Badge></div></div><div className="text-end"><Badge bg={scores.length ? 'success' : 'warning'} text={scores.length ? 'light' : 'dark'} className="px-3 py-2 mb-2 d-inline-block">{scores.length ? 'Scored' : 'Pending scoring'}</Badge><div className="text-muted small">Submitted:<br/><strong>{submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : '-'}</strong></div></div></div>
            <div className="mb-4"><h6 className="fw-bold text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Metadata / Notes</h6><p>{submission.apiMetadata || 'No metadata provided.'}</p></div>
            <Row className="g-3 mb-4"><Col sm={6}><Button variant="outline-primary" className="w-100 d-flex align-items-center justify-content-center gap-2" disabled={!submission.repoUrl} onClick={() => window.open(submission.repoUrl, '_blank')}><Code size={18} /> View Repository</Button></Col><Col sm={6}><Button variant="outline-primary" className="w-100 d-flex align-items-center justify-content-center gap-2" disabled={!submission.demoUrl} onClick={() => window.open(submission.demoUrl, '_blank')}><ExternalLink size={18} /> Live Demo</Button></Col></Row>
            <div><h6 className="fw-bold text-muted text-uppercase mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Attached Links</h6><div className="d-flex flex-column gap-2">{[['Slide', submission.slideUrl], ['Report', submission.reportUrl], ['Repo', submission.repoUrl], ['Demo', submission.demoUrl]].map(([name, url]) => <div key={name} className="d-flex align-items-center justify-content-between p-3 rounded" style={{ backgroundColor: 'var(--cf-bg-main)', border: '1px solid var(--cf-border-color)' }}><div className="d-flex align-items-center gap-2"><FileText size={18} className="text-primary" /><span className="fw-medium">{name}</span></div>{url ? <a href={url} target="_blank" rel="noreferrer">Open</a> : <span className="text-muted small">Not provided</span>}</div>)}</div></div>
          </Card.Body></Card>
          <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><Card.Body className="p-4"><h5 className="fw-bold mb-4">Judge Reviews</h5>{Object.keys(judges).length ? <div className="d-flex flex-column gap-3">{Object.values(judges).map((judge) => <div key={judge.judgeEmail} className="p-3 rounded" style={{ border: '1px solid var(--cf-border-color)' }}><div className="d-flex justify-content-between align-items-center mb-2"><span className="fw-bold">{judge.judgeEmail}</span><Badge bg="primary" pill className="fs-6">{(judge.total / judge.count).toFixed(1)}/100</Badge></div><p className="text-muted mb-0 small">{judge.comments.join(' · ') || 'No comment'}</p></div>)}</div> : <div className="text-muted">No judge scores yet.</div>}</Card.Body></Card>
        </Col>
        <Col lg={4}>
          <Card className="mb-4 text-center" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><Card.Body className="p-4"><h6 className="fw-bold text-muted text-uppercase mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Average Score</h6><div className="display-3 fw-bold text-primary mb-2">{averageScore.toFixed(1)}</div><div className="text-muted small">{scores.length} score item(s)</div></Card.Body></Card>
          <Card className="mb-4" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><Card.Body className="p-4"><h6 className="fw-bold text-muted text-uppercase mb-4" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Criteria Breakdown</h6>{criteria.length ? <div className="d-flex flex-column gap-3">{criteria.map((c, idx) => <div key={idx}><div className="d-flex justify-content-between mb-1 small"><span className="fw-medium">{c.name}</span><span className="fw-bold">{c.score}/100</span></div><ProgressBar now={c.score} max={100} variant="primary" style={{ height: '6px' }} /></div>)}</div> : <div className="text-muted">No criteria scores yet.</div>}</Card.Body></Card>
          <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}><Card.Body className="p-4"><h6 className="fw-bold text-muted text-uppercase mb-3 d-flex align-items-center gap-2" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}><ShieldCheck size={16} className="text-success" /> Integrity Check</h6><Table size="sm" className="mb-0"><tbody><tr><td className="text-muted">Backend automated check</td><td className="text-end">Not available</td></tr><tr><td className="text-muted">Manual score records</td><td className="text-end">{scores.length}</td></tr></tbody></Table></Card.Body></Card>
        </Col>
      </Row>}
    </div>
  );
};

export default SubmissionDetail;
