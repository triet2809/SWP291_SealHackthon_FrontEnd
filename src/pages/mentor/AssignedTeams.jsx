import React, { useEffect, useState } from 'react';
import { Alert, Card, Spinner, Table } from 'react-bootstrap';
import { getTeams, getTrackMentors } from '../../api/hackathonApi';
import { getInitials, getStoredUser } from '../../utils/authUser';
import styles from './AssignedTeams.module.css';

const pageItems = (data) => data?.content || data || [];

const AssignedTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const getProgressColor = (progress) => progress >= 80 ? styles.fillGreen : progress >= 60 ? styles.fillOrange : styles.fillRed;
  const getStatusClass = (status) => status === 'active' ? styles.statusOnTrack : status === 'disqualified' ? styles.statusAtRisk : styles.statusNeedsAttention;

  useEffect(() => { (async () => { setLoading(true); setError(''); try { const user = getStoredUser(); const assignments = pageItems(await getTrackMentors({ userId: user?.id, size: 500 })); const teamGroups = await Promise.all(assignments.map(async (a) => pageItems(await getTeams({ trackId: a.trackId, size: 500 }).catch(() => [])).map((t) => ({ ...t, trackName: a.trackName })))); setTeams(teamGroups.flat()); } catch (e) { setError(e.message || 'Cannot load assigned teams'); } finally { setLoading(false); } })(); }, []);

  return (
    <div className="py-2"><div className={styles.pageHeader}><h1 className={styles.pageTitle}>Assigned Teams</h1><div className={styles.pageSubtitle}>{teams.length} teams under your mentorship</div></div>{error && <Alert variant="danger">{error}</Alert>}<Card className={styles.tableCard}><div className="table-responsive"><Table className="mb-0" hover><thead><tr><th className={`border-top-0 ${styles.tableHeader}`}>Team</th><th className={`border-top-0 ${styles.tableHeader}`}>Project</th><th className={`border-top-0 ${styles.tableHeader}`}>Members</th><th className={`border-top-0 ${styles.tableHeader}`}>Category</th><th className={`border-top-0 ${styles.tableHeader}`}>Progress</th><th className={`border-top-0 ${styles.tableHeader}`}>Last Active</th><th className={`border-top-0 ${styles.tableHeader}`}>Status</th></tr></thead><tbody>{loading ? <tr><td colSpan="7" className="text-center py-4"><Spinner size="sm" className="me-2" />Loading...</td></tr> : teams.length === 0 ? <tr><td colSpan="7" className="text-center py-4 text-muted">No assigned teams</td></tr> : teams.map((team) => { const progress = team.members?.length ? Math.min(100, (team.members.length / 5) * 100) : 20; return <tr key={team.id} className={styles.tableRow}><td className={styles.tableCell}><div className={styles.teamNameCell}><div className={styles.teamAvatar}>{getInitials(team.name)}</div><span className={styles.teamName}>{team.name}</span></div></td><td className={styles.tableCell}><span className={styles.projectText}>{team.projectName || team.name}</span></td><td className={styles.tableCell}>{team.members?.length || team.memberCount || 0}</td><td className={styles.tableCell}><span className={styles.categoryBadge}>{team.trackName || team.trackId}</span></td><td className={styles.tableCell}><div className={styles.progressWrapper}><div className={styles.progressBarContainer}><div className={`${styles.progressBarFill} ${getProgressColor(progress)}`} style={{ width: `${progress}%` }}></div></div><span className={styles.progressText}>{Math.round(progress)}%</span></div></td><td className={styles.tableCell}>{team.updatedAt ? new Date(team.updatedAt).toLocaleString() : '-'}</td><td className={styles.tableCell}><span className={`${styles.statusBadge} ${getStatusClass(team.status)}`}>{team.status || 'active'}</span></td></tr>; })}</tbody></Table></div></Card></div>
  );
};

export default AssignedTeams;
