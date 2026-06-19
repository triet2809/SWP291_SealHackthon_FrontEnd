import React, { useState } from 'react';
import { Card, Table, Badge, Modal, Form, InputGroup, Button } from 'react-bootstrap';
import { History, Search, Trash2, Eye, Download } from 'lucide-react';

const AuditLogs = () => {
  const [logs] = useState([
    { id: 1, action: 'Published Final Rankings', user: 'Sarah Connor', role: 'Coordinator', timestamp: 'Today, 10:15 AM', ip: '192.168.1.45' },
    { id: 2, action: 'Updated Score: "QuantumLeap"', user: 'Prof. James Kim', role: 'Judge', timestamp: 'Today, 09:30 AM', ip: '10.0.0.12' },
    { id: 3, action: 'Approved User "David Lee"', user: 'System', role: 'System', timestamp: 'Yesterday, 14:20 PM', ip: '127.0.0.1' },
    { id: 4, action: 'Submitted Project "EduTrack AI"', user: 'Alex Chen', role: 'Team Member', timestamp: 'June 18, 11:55 PM', ip: '192.168.1.104' },
    { id: 5, action: 'Deleted Category "Blockchain"', user: 'Sarah Connor', role: 'Coordinator', timestamp: 'June 17, 08:00 AM', ip: '192.168.1.45' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === 'All' ||
      log.role === roleFilter;

    return matchesSearch && matchesRole;
  });
  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Audit Logs</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Track system activity and administrative actions</div>
        </div>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <InputGroup style={{ maxWidth: '300px' }}>
            <InputGroup.Text>
              <Search size={16} />
            </InputGroup.Text>

            <Form.Control
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <div className="d-flex gap-2">
            <Form.Select
              style={{ width: '180px' }}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option>All</option>
              <option>Coordinator</option>
              <option>Judge</option>
              <option>Team Member</option>
              <option>System</option>
            </Form.Select>

            <Button
              variant="outline-primary"
              onClick={() => alert('Exporting logs...')}
              className="d-flex align-items-center gap-1"
            >
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>
        
        <div className="table-responsive">
          <Table className="mb-0" hover>
            <thead>
              <tr>
                <th className="border-top-0 border-bottom">Timestamp</th>
                <th className="border-top-0 border-bottom">Action</th>
                <th className="border-top-0 border-bottom">User</th>
                <th className="border-top-0 border-bottom">Role</th>
                <th className="border-top-0 border-bottom">IP Address</th>
                <th className="border-top-0 border-bottom text-end"> Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
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
                  <td className="py-3 text-end">
                    <Button variant="link" size="sm" className="p-0 text-primary" onClick={() => { setSelectedLog(log), setShowModal(!0) }}>
                      <Eye size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Audit Log Details
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedLog && (
            <>
              <p>
                <strong>Action:</strong>{' '}
                {selectedLog.action}
              </p>

              <p>
                <strong>User:</strong>{' '}
                {selectedLog.user}
              </p>

              <p>
                <strong>Role:</strong>{' '}
                {selectedLog.role}
              </p>

              <p>
                <strong>Timestamp:</strong>{' '}
                {selectedLog.timestamp}
              </p>

              <p>
                <strong>IP:</strong>{' '}
                {selectedLog.ip}
              </p>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AuditLogs;
