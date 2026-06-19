import React from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import { History } from 'lucide-react';

const AuditLogs = () => {
  const logs = [
    { id: 1, action: 'Published Final Rankings', user: 'Sarah Connor', role: 'Coordinator', timestamp: 'Today, 10:15 AM', ip: '192.168.1.45' },
    { id: 2, action: 'Updated Score: "QuantumLeap"', user: 'Prof. James Kim', role: 'Judge', timestamp: 'Today, 09:30 AM', ip: '10.0.0.12' },
    { id: 3, action: 'Approved User "David Lee"', user: 'System', role: 'System', timestamp: 'Yesterday, 14:20 PM', ip: '127.0.0.1' },
    { id: 4, action: 'Submitted Project "EduTrack AI"', user: 'Alex Chen', role: 'Team Member', timestamp: 'June 18, 11:55 PM', ip: '192.168.1.104' },
    { id: 5, action: 'Deleted Category "Blockchain"', user: 'Sarah Connor', role: 'Coordinator', timestamp: 'June 17, 08:00 AM', ip: '192.168.1.45' },
  ];

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Audit Logs</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Track system activity and administrative actions</div>
        </div>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="table-responsive">
          <Table className="mb-0" hover>
            <thead>
              <tr>
                <th className="border-top-0 border-bottom">Timestamp</th>
                <th className="border-top-0 border-bottom">Action</th>
                <th className="border-top-0 border-bottom">User</th>
                <th className="border-top-0 border-bottom">Role</th>
                <th className="border-top-0 border-bottom">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="py-3" style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>
                    <div className="d-flex align-items-center gap-2">
                      <History size={14} /> {log.timestamp}
                    </div>
                  </td>
                  <td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{log.action}</td>
                  <td className="py-3">{log.user}</td>
                  <td className="py-3">
                    <Badge bg="secondary" className="bg-opacity-25 text-secondary border">{log.role}</Badge>
                  </td>
                  <td className="py-3" style={{ fontFamily: 'monospace', color: 'var(--cf-text-secondary)' }}>{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default AuditLogs;
