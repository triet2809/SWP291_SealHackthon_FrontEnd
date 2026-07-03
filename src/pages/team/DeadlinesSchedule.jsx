import React, { useEffect, useState } from 'react';
import { Alert, Card, Spinner } from 'react-bootstrap';
import { getEvents, getMyTeams, getRounds } from '../../api/hackathonApi';
import styles from './DeadlinesSchedule.module.css';

const pageItems = (data) => data?.content || data || [];
const typeForDate = (date) => {
  if (!date) return 'active';
  const diff = new Date(date) - new Date();
  if (diff < 0) return 'success';
  if (diff < 3 * 86400000) return 'danger';
  return 'active';
};

const DeadlinesSchedule = () => {
  const [state, setState] = useState({ loading: true, error: '', event: null, rounds: [] });
  useEffect(() => { (async () => { try { const teams = await getMyTeams(); const team = teams?.[0] || null; let event = null, rounds = []; if (team) { const [eventsRes, roundsRes] = await Promise.all([getEvents({ size: 100 }).catch(() => []), getRounds({ trackId: team.trackId, size: 100 }).catch(() => [])]); const events = pageItems(eventsRes); rounds = pageItems(roundsRes); event = events.find((e) => e.id === team.eventId) || events[0] || null; } setState({ loading: false, error: '', event, rounds }); } catch (e) { setState((s) => ({ ...s, loading: false, error: e.message || 'Cannot load schedule' })); } })(); }, []);
  const getIndicatorClass = (type) => type === 'active' ? styles.indicatorActive : type === 'danger' ? styles.indicatorDanger : type === 'success' ? styles.indicatorSuccess : '';
  const getBadgeClass = (type) => type === 'active' ? styles.badgeActive : type === 'danger' ? styles.badgeDanger : type === 'success' ? styles.badgeSuccess : '';
  if (state.loading) return <div className="py-4 text-center"><Spinner size="sm" className="me-2" />Loading schedule...</div>;
  if (state.error) return <Alert variant="danger">{state.error}</Alert>;
  const items = [state.event?.startTime && { id: 1, title: 'Event starts', date: state.event.startTime, badge: state.event.status }, ...state.rounds.map((r, idx) => ({ id: idx + 2, title: r.name, date: r.submissionDeadline, badge: 'Submission deadline' })), state.event?.endTime && { id: state.rounds.length + 2, title: 'Event ends', date: state.event.endTime, badge: 'Closing' }].filter(Boolean).sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
  return <div className="py-2"><div className={styles.pageHeader}><h1 className={styles.pageTitle}>Deadlines & Schedule</h1><div className={styles.pageSubtitle}>Key dates for {state.event?.name || 'your hackathon'}</div></div><Card className={styles.timelineCard}><Card.Body><div className={styles.timeline}>{items.length === 0 ? <div className="text-muted">No schedule configured.</div> : items.map((item) => { const type = typeForDate(item.date); return <div key={`${item.id}-${item.title}`} className={styles.timelineItem}><div className={`${styles.timelineIndicator} ${getIndicatorClass(type)}`}>{item.id}</div><div className={styles.timelineContent}><div className={styles.timelineHeader}><span className={styles.timelineDate}>{item.date ? new Date(item.date).toLocaleString() : '-'}</span><span className={styles.timelineDay}>· {item.title}</span>{item.badge && <span className={`${styles.statusBadge} ${getBadgeClass(type)}`}>{item.badge}</span>}</div><ul className={styles.eventList}><li className={styles.eventItem}>{item.title}</li></ul></div></div>; })}</div></Card.Body></Card></div>;
};

export default DeadlinesSchedule;
