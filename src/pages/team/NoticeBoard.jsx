import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import { Clock } from 'lucide-react';
import { createNotice, getNotices } from '../../api/hackathonApi';
import { getInitials } from '../../utils/authUser';
import styles from './NoticeBoard.module.css';

const items = (data) => data?.content || data || [];
const roleClass = (stylesObj, role) => role === 'judge' ? stylesObj.roleJudge : role === 'mentor' ? stylesObj.roleMentor : stylesObj.roleAdmin;
const avatarClass = (stylesObj, role) => role === 'judge' ? stylesObj.avatarJudge : role === 'mentor' ? stylesObj.avatarMentor : stylesObj.avatarAdmin;

const NoticeBoard = () => {
  const [state, setState] = useState({ loading: true, error: '', notices: [] });
  useEffect(() => { (async () => { try { const data = await getNotices({ targetRole: 'team_member', size: 50 }); setState({ loading: false, error: '', notices: items(data) }); } catch (e) { setState({ loading: false, error: e.message || 'Cannot load notices', notices: [] }); } })(); }, []);
  if (state.loading) return <div className="py-4 text-center"><Spinner size="sm" className="me-2" />Loading notices...</div>;
  return <div className="py-2"><div className={styles.pageHeader}><h1 className={styles.pageTitle}>Notice Board</h1><div className={styles.pageSubtitle}>Recent announcements from organizers and mentors</div></div>{state.error && <Alert variant="danger">{state.error}</Alert>}<div className={styles.noticeList}>{state.notices.length === 0 ? <Card className={styles.noticeCard}><Card.Body className="p-4 text-muted">No notices.</Card.Body></Card> : state.notices.map((notice) => <Card key={notice.id} className={`${styles.noticeCard} ${notice.priority === 'high' ? styles.priorityHigh : styles.priorityNormal}`}><Card.Body className="p-4"><div className={styles.cardHeader}><div className={styles.authorInfo}><div className={`${styles.avatar} ${avatarClass(styles, notice.targetRole)}`}>{getInitials(notice.authorName || notice.authorEmail)}</div><div className={styles.authorDetails}><span className={styles.authorName}>{notice.authorName || notice.authorEmail}</span><span className={`${styles.authorRole} ${roleClass(styles, notice.targetRole)}`}>{notice.targetRole || 'global'}</span></div></div><div className={styles.noticeDate}><Clock size={12} />{notice.createdAt ? new Date(notice.createdAt).toLocaleString() : ''}</div></div><h5 className={styles.noticeTitle}>{notice.title}{notice.priority === 'high' && <span className={styles.importantIndicator}>Important</span>}</h5><p className={styles.noticeContent}>{notice.content}</p></Card.Body></Card>)}</div></div>;
};

export default NoticeBoard;
