import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { getMe, updateMe } from '../../api/userApi';
import { getMyTeams } from '../../api/hackathonApi';
import { getInitials, saveStoredUser } from '../../utils/authUser';
import styles from './Profile.module.css';

const Profile = () => {
  const location = useLocation();
  const isStudent = location.pathname.includes('/student');
  const [state, setState] = useState({ loading: true, saving: false, error: '', success: '', user: null, team: null });
  const [form, setForm] = useState({ fullName: '', studentId: '' });
  useEffect(() => { (async () => { try { const [me, teams] = await Promise.all([getMe(), getMyTeams().catch(() => [])]); setState({ loading: false, saving: false, error: '', success: '', user: me.value, team: teams?.[0] || null }); setForm({ fullName: me.value?.fullName || '', studentId: me.value?.studentId || '' }); } catch (e) { setState((s) => ({ ...s, loading: false, error: e.message || 'Cannot load profile' })); } })(); }, []);
  const save = async (e) => { e.preventDefault(); setState((s) => ({ ...s, saving: true, error: '', success: '' })); try { const res = await updateMe({ fullName: form.fullName, studentId: form.studentId }); saveStoredUser(res.value); setState((s) => ({ ...s, saving: false, success: 'Profile updated', user: res.value })); } catch (err) { setState((s) => ({ ...s, saving: false, error: err.message || 'Cannot update profile' })); } };
  if (state.loading) return <div className="py-4 text-center"><Spinner size="sm" className="me-2" />Loading profile...</div>;
  const user = state.user || {};
  const roles = user.roles || [];
  const member = state.team?.members?.find((m) => m.userId === user.id || m.email === user.email);
  return <div className="py-2"><div className={styles.pageHeader}><h1 className={styles.pageTitle}>Profile</h1><div className={styles.pageSubtitle}>Manage your account information</div></div>{state.error && <Alert variant="danger">{state.error}</Alert>}{state.success && <Alert variant="success">{state.success}</Alert>}<Card className={styles.profileCard}><div className={styles.profileHeader}><div className={styles.avatar}>{getInitials(user.fullName || user.email)}</div><div className={styles.headerInfo}><div className={styles.userName}>{user.fullName || user.email}</div><div className={styles.teamRole}>{member?.role || (isStudent ? 'Student' : 'Team member')} · {state.team?.name || 'No team'}</div><div className={styles.roleBadge}>{roles.join(', ') || 'team_member'}</div></div></div><Card.Body className="p-4"><Form onSubmit={save}><Row className="mb-4"><Col md={6}><Form.Group><Form.Label className={styles.formLabel}>Full Name</Form.Label><Form.Control type="text" value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} className={styles.formControl} required /></Form.Group></Col><Col md={6}><Form.Group><Form.Label className={styles.formLabel}>Email Address</Form.Label><Form.Control type="email" value={user.email || ''} className={styles.formControl} readOnly /></Form.Group></Col></Row><Row className="mb-4"><Col md={6}><Form.Group><Form.Label className={styles.formLabel}>Student ID</Form.Label><Form.Control type="text" value={form.studentId} onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))} className={styles.formControl} /></Form.Group></Col><Col md={6}><Form.Group><Form.Label className={styles.formLabel}>Campus</Form.Label><Form.Control type="text" value={user.campusName || user.campusId || ''} className={styles.formControl} readOnly /></Form.Group></Col></Row><Row className="mb-4"><Col md={6}><Form.Group><Form.Label className={styles.formLabel}>University</Form.Label><Form.Control type="text" value={user.universityName || user.universityId || ''} className={styles.formControl} readOnly /></Form.Group></Col><Col md={6}><Form.Group><Form.Label className={styles.formLabel}>Account Status</Form.Label><Form.Control type="text" value={user.status || ''} className={styles.formControl} readOnly /></Form.Group></Col></Row><Button type="submit" className={styles.saveBtn} disabled={state.saving}>{state.saving ? 'Saving...' : 'Save Changes'}</Button></Form></Card.Body></Card></div>;
};

export default Profile;
