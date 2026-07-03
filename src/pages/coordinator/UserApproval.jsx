import React, { useEffect, useMemo, useState } from 'react';
import { Card, Table, Button, Badge, Modal, Form, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { Check, X, Eye, Search } from 'lucide-react';
import { approveUser, getPendingUsers, rejectUser } from '../../api/userApi';

const formatDate = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleString();
};

const UserApproval = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState('');

  const loadPendingUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getPendingUsers();
      if (!result.ok) {
        setError(result.data?.message || 'Cannot load pending users');
        return;
      }
      setPendingUsers(result.value);
    } catch {
      setError('Cannot reach the server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const handleApprove = async (id) => {
    setActionId(id);
    setError('');
    try {
      const result = await approveUser(id);
      if (!result.ok) {
        setError(result.data?.message || 'Approve failed');
        return;
      }
      setPendingUsers((users) => users.filter((user) => user.id !== id));
    } catch {
      setError('Cannot reach the server');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this request?')) return;
    setActionId(id);
    setError('');
    try {
      const result = await rejectUser(id);
      if (!result.ok) {
        setError(result.data?.message || 'Reject failed');
        return;
      }
      setPendingUsers((users) => users.filter((user) => user.id !== id));
    } catch {
      setError('Cannot reach the server');
    } finally {
      setActionId(null);
    }
  };

  const filteredUsers = useMemo(() => pendingUsers.filter((user) =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ), [pendingUsers, searchTerm]);

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>User Approval</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Review and approve pending account requests</div>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="p-3 border-bottom">
          <InputGroup style={{ maxWidth: '300px' }}>
            <InputGroup.Text><Search size={16} /></InputGroup.Text>
            <Form.Control placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </InputGroup>
        </div>
        <div className="table-responsive">
          <Table className="mb-0" hover>
            <thead>
              <tr>
                <th className="border-top-0 border-bottom">Name</th>
                <th className="border-top-0 border-bottom">Email</th>
                <th className="border-top-0 border-bottom">Student Type</th>
                <th className="border-top-0 border-bottom">Roles</th>
                <th className="border-top-0 border-bottom">Date</th>
                <th className="border-top-0 border-bottom text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4"><Spinner size="sm" className="me-2" />Loading...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4 text-muted">No pending users</td></tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{user.fullName}</td>
                  <td className="py-3" style={{ color: 'var(--cf-text-secondary)' }}>{user.email}</td>
                  <td className="py-3"><Badge bg="secondary" className="bg-opacity-25 text-secondary border">{user.studentType}</Badge><div className="small text-muted">{user.universityName || user.campusName || '-'}</div></td>
                  <td className="py-3 fw-medium">{user.roles?.join(', ') || '-'}</td>
                  <td className="py-3">{formatDate(user.createdAt)}</td>
                  <td className="py-3 text-end">
                    <Button variant="link" size="sm" className="text-primary me-2" onClick={() => { setSelectedUser(user); setShowModal(true); }}><Eye size={14} /></Button>
                    <Button variant="outline-success" size="sm" className="me-2 d-inline-flex align-items-center gap-1" disabled={actionId === user.id} onClick={() => handleApprove(user.id)}><Check size={14} /> Approve</Button>
                    <Button variant="outline-danger" size="sm" className="d-inline-flex align-items-center gap-1" disabled={actionId === user.id} onClick={() => handleReject(user.id)}><X size={14} /> Reject</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>User Request Details</Modal.Title></Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <p><strong>Name:</strong> {selectedUser.fullName}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Student Type:</strong> {selectedUser.studentType}</p>
              <p><strong>University:</strong> {selectedUser.universityName || '-'}</p>
              <p><strong>Campus:</strong> {selectedUser.campusName || '-'}</p>
              <p><strong>Status:</strong> {selectedUser.status}</p>
              <p><strong>Roles:</strong> {selectedUser.roles?.join(', ') || '-'}</p>
              <p><strong>Created:</strong> {formatDate(selectedUser.createdAt)}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button></Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserApproval;
