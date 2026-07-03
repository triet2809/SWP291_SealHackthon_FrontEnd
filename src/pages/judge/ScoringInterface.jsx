import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, Code, ExternalLink, FileText } from 'lucide-react';
import { getRoundCriteria, getScores, getSubmission, upsertScore } from '../../api/hackathonApi';
import { getStoredUser } from '../../utils/authUser';
import styles from './ScoringInterface.module.css';

const pageItems = (data) => data?.content || data || [];

const ScoringInterface = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [criteria, setCriteria] = useState([]);
  const [scores, setScores] = useState({});
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError('');
      try {
        const user = getStoredUser();
        const sub = await getSubmission(id);
        setSubmission(sub);
        const [criteriaData, scoreData] = await Promise.all([
          getRoundCriteria({ roundId: sub.roundId, size: 100 }),
          user?.id ? getScores({ submissionId: id, judgeId: user.id, size: 100 }) : Promise.resolve({ content: [] }),
        ]);
        const crit = pageItems(criteriaData);
        const existing = pageItems(scoreData);
        setCriteria(crit);
        setScores(Object.fromEntries(crit.map((c) => [c.id, existing.find((s) => s.criterionId === c.id)?.score || 0])));
        setComment(existing.find((s) => s.comment)?.comment || '');
      } catch (e) { setError(e.message || 'Cannot load scoring form'); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const averageScore = useMemo(() => {
    if (!criteria.length) return 0;
    const weightedTotal = criteria.reduce((sum, c) => sum + Number(scores[c.id] || 0) * Number(c.weight || 0), 0);
    const weightTotal = criteria.reduce((sum, c) => sum + Number(c.weight || 0), 0);
    return Math.round(weightTotal ? weightedTotal / weightTotal : criteria.reduce((sum, c) => sum + Number(scores[c.id] || 0), 0) / criteria.length);
  }, [criteria, scores]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      if (!criteria.length) throw new Error('Round has no criteria. Coordinator must create criteria first.');
      await Promise.all(criteria.map((criterion) => upsertScore({ submissionId: id, criterionId: criterion.id, score: Number(scores[criterion.id] || 0), comment: comment || null })));
      navigate('/judge/submissions');
    } catch (e) { setError(e.message || 'Submit evaluation failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="py-4 text-center"><Spinner size="sm" className="me-2" />Loading scoring form...</div>;

  return (
    <div className="py-2">
      <div className={styles.pageHeader}><h1 className={styles.pageTitle}>Scoring Interface</h1><div className={styles.pageSubtitle}>Review materials and evaluate the submission</div></div>
      <div className="d-flex justify-content-end mb-3"><Button variant="outline-danger" size="sm" className="d-flex align-items-center gap-2" onClick={() => navigate('/judge/incidents/create')}><AlertTriangle size={16} /> Report Incident</Button></div>
      {error && <Alert variant="danger">{error}</Alert>}
      {!submission ? <Alert variant="warning">Submission not found</Alert> : <Row>
        <Col lg={7} className="mb-4 mb-lg-0"><Card className={styles.dossierCard}>
          <div className={styles.teamHeader}><h2 className={styles.teamName}>{submission.teamName || 'Team submission'}</h2><div className={styles.projectName}>Round submission</div></div>
          <div className={styles.sectionTitle}>Submission Metadata</div><p className={styles.description}>{submission.apiMetadata || 'No metadata provided.'}</p>
          <div className={styles.sectionTitle}>Submitted Materials</div><div className={styles.fileList}>{[
            ['Repository', submission.repoUrl, <Code size={20} className={styles.fileIcon} />],
            ['Demo', submission.demoUrl, <ExternalLink size={20} className={styles.fileIcon} />],
            ['Slides', submission.slideUrl, <FileText size={20} className={styles.fileIcon} />],
            ['Report', submission.reportUrl, <FileText size={20} className={styles.fileIcon} />],
          ].map(([name, url, icon]) => <div key={name} className={styles.fileCard}><div className={styles.fileInfo}>{icon}<div><div className={styles.fileName}>{name}</div><div className={styles.fileMeta}>{url || 'Not provided'}</div></div></div><button type="button" className={styles.downloadBtn} disabled={!url} onClick={() => url && window.open(url, '_blank')}>View</button></div>)}</div>
        </Card></Col>
        <Col lg={5}><Card className={styles.scoringCard}><div className={styles.finalScoreBox}><div className={styles.scoreLabel}>Final Weighted Score</div><div className={styles.scoreValue}>{averageScore}<span style={{fontSize: '1.25rem', color: '#86efac'}}>/100</span></div></div>
          <Form onSubmit={handleSubmit}>
            {criteria.length === 0 ? <Alert variant="warning">No criteria configured for this round. Coordinator must add round criteria first.</Alert> : criteria.map((criterion, index) => <div className={styles.criteriaGroup} key={criterion.id}><div className={styles.criteriaHeader}><span className={styles.criteriaTitle}>{index + 1}. {criterion.name} <small className="text-muted">({criterion.weight})</small></span><span className={styles.criteriaScore}>{scores[criterion.id] || 0}/100</span></div><Form.Range className={styles.customRange} min="0" max="100" value={scores[criterion.id] || 0} onChange={(e) => setScores({ ...scores, [criterion.id]: e.target.value })} /><div className="small text-muted">{criterion.description}</div></div>)}
            <div className={styles.feedbackGroup}><div className={styles.feedbackLabel}>Private Notes / Comment</div><textarea className={styles.feedbackTextarea} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Notes for this evaluation..." /></div>
            <div className={styles.actionRow}><Button type="submit" className={styles.submitBtn} disabled={saving || criteria.length === 0}>{saving ? 'Saving…' : 'Submit Evaluation'}</Button><Button variant="link" className={styles.cancelBtn} onClick={() => navigate('/judge/submissions')}>Cancel</Button></div>
          </Form>
        </Card></Col>
      </Row>}
    </div>
  );
};

export default ScoringInterface;
