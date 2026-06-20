import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { Download } from 'lucide-react';
import { submissionHistoryList, teamData } from '../../data/mockData';
import styles from './SubmissionHistory.module.css';

const SubmissionHistory = () => {
  return (
    <div className="py-2">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Submission History</h1>
        <div className={styles.pageSubtitle}>
          All submissions for {teamData.teamName}
        </div>
      </div>

      <Card className={styles.tableCard}>
        <div className="table-responsive">
          <Table className="mb-0" hover>
            <thead>
              <tr>
                <th className={`border-top-0 ${styles.tableHeader}`}>Version</th>
                <th className={`border-top-0 ${styles.tableHeader}`}>Title</th>
                <th className={`border-top-0 ${styles.tableHeader}`}>Submitted</th>
                <th className={`border-top-0 ${styles.tableHeader}`}>Size</th>
                <th className={`border-top-0 ${styles.tableHeader}`}>Status</th>
                <th className={`border-top-0 ${styles.tableHeader}`}></th>
              </tr>
            </thead>
            <tbody>
              {submissionHistoryList.map((submission) => (
                <tr key={submission.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <span className={styles.versionBadge}>{submission.version}</span>
                  </td>
                  <td className={styles.tableCell}>
                    <span className={styles.titleText}>{submission.title}</span>
                  </td>
                  <td className={`${styles.tableCell} ${styles.tableCellSecondary}`}>
                    {submission.date}
                  </td>
                  <td className={`${styles.tableCell} ${styles.tableCellSecondary}`}>
                    {submission.size}
                  </td>
                  <td className={styles.tableCell}>
                    <span className={styles.statusBadge}>{submission.status}</span>
                  </td>
                  <td className={styles.tableCell}>
                    <button className={styles.downloadBtn}>
                      <Download size={16} /> Download
                    </button>
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

export default SubmissionHistory;
