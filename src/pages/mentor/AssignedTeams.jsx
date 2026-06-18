import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { mentorAssignedTeams } from '../../data/mockData';
import styles from './AssignedTeams.module.css';

const AssignedTeams = () => {
  
  const getProgressColor = (progress) => {
    if (progress >= 80) return styles.fillGreen;
    if (progress >= 60) return styles.fillOrange;
    return styles.fillRed;
  };

  const getStatusClass = (status) => {
    switch(status) {
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
          {mentorAssignedTeams.length} teams under your mentorship
        </div>
      </div>

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
              {mentorAssignedTeams.map((team) => (
                <tr key={team.id} className={styles.tableRow}>
                  
                  <td className={styles.tableCell}>
                    <div className={styles.teamNameCell}>
                      <div className={styles.teamAvatar}>{team.initials}</div>
                      <span className={styles.teamName}>{team.name}</span>
                    </div>
                  </td>
                  
                  <td className={styles.tableCell}>
                    <span className={styles.projectText}>{team.project}</span>
                  </td>
                  
                  <td className={styles.tableCell}>
                    {team.members}
                  </td>
                  
                  <td className={styles.tableCell}>
                    <span className={styles.categoryBadge}>{team.category}</span>
                  </td>
                  
                  <td className={styles.tableCell}>
                    <div className={styles.progressWrapper}>
                      <div className={styles.progressBarContainer}>
                        <div 
                          className={`${styles.progressBarFill} ${getProgressColor(team.progress)}`}
                          style={{ width: `${team.progress}%` }}
                        ></div>
                      </div>
                      <span className={styles.progressText}>{team.progress}%</span>
                    </div>
                  </td>
                  
                  <td className={styles.tableCell}>
                    {team.lastActive}
                  </td>
                  
                  <td className={styles.tableCell}>
                    <span className={`${styles.statusBadge} ${getStatusClass(team.status)}`}>
                      {team.status}
                    </span>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default AssignedTeams;
