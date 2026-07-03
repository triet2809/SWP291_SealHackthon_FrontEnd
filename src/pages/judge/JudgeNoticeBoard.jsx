import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import { Clock } from 'lucide-react';
import { createNotice, getNotices } from '../../api/hackathonApi';
import { getStoredUser } from '../../utils/authUser';
import styles from './JudgeNoticeBoard.module.css';

const pageItems = (data) => data?.content || data || [];

const JudgeNoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', priority: 'normal', targetRole: '' });
  const user = getStoredUser();

  const load = async () => {
    const data = await getNotices({ targetRole: 'judge', size: 50 });
    setNotices(pageItems(data));
  };

  useEffect(() => { (async () => { try { await load(); } catch (e) { setError(e.message || 'Cannot load notices'); } finally { setLoading(false); } })(); }, []);

  const post = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createNotice({ title: form.title, content: form.content, priority: form.priority, targetRole: form.targetRole || null });
      setForm({ title: '', content: '', priority: 'normal', targetRole: '' });
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err.message || 'Failed to post notice');
    }
  };

  if (loading) return <div className="py-4 text-center"><Spinner size="sm" className="me-2" />Loading notices...</div>;

  return (
    <div className="py-2">
      <div className={styles.pageHeader}>
        <div className="d-flex justify-content-between align-items-end">
          <div><h1 className={styles.pageTitle}>Notice Board</h1><div className={styles.pageSubtitle}>Post global announcements and view event updates</div></div>
          {!showForm && <Button className={styles.postBtn} onClick={() => setShowForm(true)}>+ Create Announcement</Button>}
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {showForm && <Card className={styles.postCard}><Card.Body className="p-4"><div className="d-flex justify-content-between align-items-center mb-4"><h5 style={{ fontWeight: 600, margin: 0 }}>Create Announcement</h5><Button variant="link" className="text-muted p-0 text-decoration-none" onClick={() => setShowForm(false)}>Cancel</Button></div><Form onSubmit={post}><Form.Group className="mb-3"><Form.Label className={styles.formLabel}>Title</Form.Label><Form.Control type="text" className={styles.formControl} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required /></Form.Group><Form.Group className="mb-3"><Form.Label className={styles.formLabel}>Message Content</Form.Label><Form.Control as="textarea" rows={4} className={styles.formControl} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} required /></Form.Group><div className="d-flex gap-3 align-items-center justify-content-between"><Form.Select style={{ maxWidth: 220 }} value={form.targetRole} onChange={(e) => setForm((f) => ({ ...f, targetRole: e.target.value }))}><option value="">Global</option><option value="judge">Judges</option><option value="mentor">Mentors</option><option value="team_member">Teams</option></Form.Select><Form.Check type="checkbox" id="important-flag" label="Flag as Important" checked={form.priority === 'high'} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.checked ? 'high' : 'normal' }))} /><Button type="submit" className={styles.submitBtn}>Post Notice</Button></div></Form></Card.Body></Card>}

      <div>{notices.length === 0 ? <Card className={styles.noticeCard}><Card.Body className="p-4 text-muted">No notices.</Card.Body></Card> : notices.map((notice) => <Card key={notice.id} className={`${styles.noticeCard} ${notice.priority === 'high' ? styles.noticeImportant : ''}`}><Card.Body className="p-4"><div className={styles.noticeHeader}><div><h4 className={styles.noticeTitle}>{notice.title}{notice.priority === 'high' && <span className={styles.priorityBadge}>IMPORTANT</span>}</h4><div className={styles.noticeMeta}><div className={styles.authorInfo}><div className={`${styles.avatar} ${styles.avatarJudge}`}>{(notice.authorName || notice.authorEmail || user?.fullName || 'U').slice(0, 2).toUpperCase()}</div><span className={styles.authorName}>{notice.authorName || notice.authorEmail}</span><span className={`${styles.authorRole} ${styles.roleJudge}`}>{notice.targetRole || 'Global'}</span></div></div></div><div className={styles.noticeDate}><Clock size={14} />{notice.createdAt ? new Date(notice.createdAt).toLocaleString() : 'Now'}</div></div><p className={styles.noticeContent}>{notice.content}</p></Card.Body></Card>)}</div>
    </div>
  );
};

export default JudgeNoticeBoard;
