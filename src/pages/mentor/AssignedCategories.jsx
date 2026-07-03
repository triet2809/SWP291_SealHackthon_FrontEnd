import React, { useEffect, useState } from 'react';
import { Alert, Card, Col, Row, Spinner } from 'react-bootstrap';
import { Shield, Tag } from 'lucide-react';
import { getTeams, getTrackMentors } from '../../api/hackathonApi';
import { getStoredUser } from '../../utils/authUser';
import styles from './AssignedCategories.module.css';

const pageItems = (data) => data?.content || data || [];

const AssignedCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const renderIcon = (idx) => { const iconClass = idx % 2 === 0 ? styles.iconBlue : styles.iconPurple; const IconComponent = idx % 2 === 0 ? Shield : Tag; return <div className={`${styles.iconWrapper} ${iconClass}`}><IconComponent size={24} /></div>; };

  useEffect(() => { (async () => { setLoading(true); setError(''); try { const user = getStoredUser(); const assignments = pageItems(await getTrackMentors({ userId: user?.id, size: 500 })); const rows = await Promise.all(assignments.map(async (a) => { const teams = pageItems(await getTeams({ trackId: a.trackId, size: 500 }).catch(() => [])); const submitted = teams.filter((t) => t.status !== 'draft').length; return { ...a, totalTeams: teams.length, submittedTeams: submitted }; })); setCategories(rows); } catch (e) { setError(e.message || 'Cannot load assigned categories'); } finally { setLoading(false); } })(); }, []);

  return (
    <div className="py-2"><div className={styles.pageHeader}><h1 className={styles.pageTitle}>Assigned Categories</h1><div className={styles.pageSubtitle}>{categories.length} active categories under your mentorship</div></div>{error && <Alert variant="danger">{error}</Alert>}{loading ? <div className="text-center py-4"><Spinner size="sm" className="me-2" />Loading...</div> : <Row>{categories.length === 0 ? <Col><Alert variant="info">No assigned categories yet.</Alert></Col> : categories.map((category, idx) => { const progressPercentage = category.totalTeams ? Math.round((category.submittedTeams / category.totalTeams) * 100) : 0; return <Col md={6} key={category.id} className="mb-4"><Card className={styles.categoryCard}><Card.Body className="p-4 d-flex flex-column"><div className={styles.cardHeader}>{renderIcon(idx)}<div><h3 className={styles.categoryName}>{category.trackName}</h3><p className={styles.categoryDesc}>Track assigned to {category.fullName || category.email}</p></div></div><div className={styles.statsGrid}><div className={styles.statBox}><span className={styles.statValue}>{category.totalTeams}</span><span className={styles.statLabel}>Total Teams</span></div><div className={styles.statBox}><span className={styles.statValue}>{category.submittedTeams}</span><span className={styles.statLabel}>Active</span></div></div><div className={styles.progressSection}><div className={styles.progressBarContainer}><div className={`${styles.progressBarFill} ${idx % 2 === 0 ? styles.fillBlue : styles.fillPurple}`} style={{ width: `${progressPercentage}%` }}></div></div><p className={styles.progressLabel}>{progressPercentage}% activity rate</p></div></Card.Body></Card></Col>; })}</Row>}</div>
  );
};

export default AssignedCategories;
