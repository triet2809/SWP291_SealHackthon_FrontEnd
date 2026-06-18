import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { teamMembersList, teamData } from '../../data/mockData';
import styles from './TeamMembers.module.css';

const TeamMembers = () => {
  return (
    <div className="py-2">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Team Members</h1>
        <div className={styles.pageSubtitle}>
          {teamMembersList.length} members · {teamData.teamName}
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className="table-responsive">
          <Table className="mb-0" hover>
            <thead>
              <tr>
                <th className={`border-top-0 ${styles.tableHeader}`}>Member</th>
                <th className={`border-top-0 ${styles.tableHeader}`}>Role</th>
                <th className={`border-top-0 ${styles.tableHeader}`}>Email</th>
                <th className={`border-top-0 ${styles.tableHeader}`}>Skills</th>
              </tr>
            </thead>
            <tbody>
              {teamMembersList.map((member) => (
                <tr key={member.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div className={styles.memberCell}>
                      <div className={styles.memberAvatar}>
                        {member.initials}
                      </div>
                      <span className={styles.memberName}>{member.name}</span>
                    </div>
                  </td>
                  <td className={styles.tableCell}>{member.role}</td>
                  <td className={styles.tableCell}>{member.email}</td>
                  <td className={styles.tableCell}>
                    <div className={styles.skillTags}>
                      {member.skills.map((skill, index) => (
                        <span key={index} className={styles.skillBadge}>
                          {skill}
                        </span>
                      ))}
                    </div>
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

export default TeamMembers;
