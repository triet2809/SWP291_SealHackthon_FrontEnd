import React, { useEffect, useState } from 'react';
import { Alert, Card, Spinner, Table } from 'react-bootstrap';
import { getMyTeams } from '../../api/hackathonApi';
import { getInitials } from '../../utils/authUser';
import styles from './TeamMembers.module.css';

const TeamMembers = () => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { (async () => { try { const teams = await getMyTeams(); setTeam(teams?.[0] || null); } catch (e) { setError(e.message || 'Cannot load team members'); } finally { setLoading(false); } })(); }, []);
  if (loading) return <div className="py-4 text-center"><Spinner size="sm" className="me-2" />Loading members...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!team) return <Alert variant="info">Bạn chưa thuộc team nào.</Alert>;
  const members = team.members || [];
  return <div className="py-2"><div className={styles.pageHeader}><h1 className={styles.pageTitle}>Team Members</h1><div className={styles.pageSubtitle}>{members.length} members · {team.name}</div></div><Card className={styles.tableCard}><div className="table-responsive"><Table className="mb-0" hover><thead><tr><th className={`border-top-0 ${styles.tableHeader}`}>Member</th><th className={`border-top-0 ${styles.tableHeader}`}>Role</th><th className={`border-top-0 ${styles.tableHeader}`}>Email</th><th className={`border-top-0 ${styles.tableHeader}`}>Status</th></tr></thead><tbody>{members.length === 0 ? <tr><td colSpan="4" className="text-center py-4 text-muted">No members.</td></tr> : members.map((member) => <tr key={member.userId || member.id || member.email} className={styles.tableRow}><td className={styles.tableCell}><div className={styles.memberCell}><div className={styles.memberAvatar}>{getInitials(member.fullName || member.name || member.email)}</div><span className={styles.memberName}>{member.fullName || member.name || member.email}</span></div></td><td className={styles.tableCell}>{member.role || '-'}</td><td className={styles.tableCell}>{member.email || '-'}</td><td className={styles.tableCell}><div className={styles.skillTags}><span className={styles.skillBadge}>{member.status || 'active'}</span></div></td></tr>)}</tbody></Table></div></Card></div>;
};

export default TeamMembers;
