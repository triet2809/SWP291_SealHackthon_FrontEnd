import React, { useEffect, useState } from 'react';
import { Card, Table, Spinner, Alert } from 'react-bootstrap';
import { getMentorTeams, getSubmissions } from '../../api/hackathonApi';
import { getStoredUser } from '../../utils/authUser';
import styles from './AssignedTeams.module.css';

const statusFromTeam = (teamStatus) => {
  switch ((teamStatus || '').toLowerCase()) {
    case 'active':
      return { label: 'On Track', progress: 80 };
    case 'disqualified':
      return { label: 'At Risk', progress: 30 };
    default:
      return { label: 'Needs Attention', progress: 60 };
  }
};

const AssignedTeams = () => {
  const user = getStoredUser();
  const mentorId = user?.id;
  const [teams, setTeams] = useState([]);
  // Map teamId -> submission projectName (BE project data)
  const [projectByTeam, setProjectByTeam] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      if (!mentorId) {
        setError('No mentor session found.');
        setLoading(false);
        return;
      }
      try {
        const res = await getMentorTeams(mentorId);
        const list = Array.isArray(res) ? res : res?.content || [];
        if (!active) return;
        setTeams(list);

        // Best-effort: pull submissions to fill the Project column (BE projectName).
        try {
          const subRes = await getSubmissions();
          const subs = Array.isArray(subRes) ? subRes : subRes?.content || [];
          const map = {};
          subs.forEach((s) => {
            const tid = s.teamId || s.team?.id;
            if (tid && s.projectName) map[tid] = s.projectName;
          });
          if (active) setProjectByTeam(map);
        } catch {
          // submissions optional; leave Project as placeholder
        }
      } catch (err) {
        if (active) setError(err.message || 'Failed to load teams');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [mentorId]);

  const getProgressColor = (progress) => {
    if (progress >= 80) return styles.fillGreen;
    if (progress >= 60) return styles.fillOrange;
    return styles.fillRed;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'On Track': return styles.statusOnTrack;
      case 'Needs Attention': return styles.statusNeedsAttention;
      case 'At Risk': return styles.statusAtRisk;
      default: return '';
    }
  };

  return (
    <div className="py-2">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Assigned Teams</h1>
        <div className={styles.pageSubtitle}>
          {teams.length} teams under your mentorship
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <Card className={styles.tableCard}>
          <div className="table-responsive">
            <Table className="mb-0" hover>
              <thead>
                <tr>
                  <th className={`border-top-0 ${styles.tableHeader}`}>Team</th>
                  <th className={`border-top-0 ${styles.tableHeader}`}>Project</th>
                  <th className={`border-top-0 ${styles.tableHeader}`}>Members</th>
                  <th className={`border-top-0 ${styles.tableHeader}`}>Category</th>
                  <th className={`border-top-0 ${styles.tableHeader}`}>Progress</th>
                  <th className={`border-top-0 ${styles.tableHeader}`}>Last Active</th>
                  <th className={`border-top-0 ${styles.tableHeader}`}>Status</th>
                </tr>
              </thead>
              <tbody>
                {teams.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-muted text-center py-4">
                      No teams assigned yet.
                    </td>
                  </tr>
                )}
                {teams.map((team) => {
                  const meta = statusFromTeam(team.teamStatus);
                  const project = projectByTeam[team.teamId] || team.projectName || '—';
                  const memberCount =
                    team.memberCount ??
                    team.membersCount ??
                    (Array.isArray(team.members) ? team.members.length : team.members);
                  return (
                    <tr key={team.teamId} className={styles.tableRow}>

                      <td className={styles.tableCell}>
                        <div className={styles.teamNameCell}>
                          <div className={styles.teamAvatar}>{(team.teamName || '?').charAt(0)}</div>
                          <span className={styles.teamName}>{team.teamName}</span>
                        </div>
                      </td>

                      <td className={styles.tableCell}>
                        <span className={styles.projectText}>{project}</span>
                      </td>

                      <td className={styles.tableCell}>
                        {memberCount ?? '—'}
                      </td>

                      <td className={styles.tableCell}>
                        <span className={styles.categoryBadge}>{team.trackName}</span>
                      </td>

                      <td className={styles.tableCell}>
                        {/* Progress has no BE field; derived from team status (display-only) */}
                        <div className={styles.progressWrapper}>
                          <div className={styles.progressBarContainer}>
                            <div
                              className={`${styles.progressBarFill} ${getProgressColor(meta.progress)}`}
                              style={{ width: `${meta.progress}%` }}
                            ></div>
                          </div>
                          <span className={styles.progressText}>{meta.progress}%</span>
                        </div>
                      </td>

                      <td className={styles.tableCell}>
                        {/* Last Active has no BE field (display-only) */}
                        {team.lastActive || '—'}
                      </td>

                      <td className={styles.tableCell}>
                        <span className={`${styles.statusBadge} ${getStatusClass(meta.label)}`}>
                          {meta.label}
                        </span>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AssignedTeams;
