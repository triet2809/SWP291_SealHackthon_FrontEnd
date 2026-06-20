import React, { useState } from 'react';
import { Card, Table, Button, Badge, Form, InputGroup, Modal } from 'react-bootstrap';
import { Search, Mail, Edit } from 'lucide-react';

const MentorManagement = () => {
  const [mentors, setMentors] = useState([
    { id: 1, name: 'Dr. Priya Patel', email: 'p.patel@fpt.edu.vn', category: 'AI/ML', teamsAssigned: 3, status: 'Active' },
    { id: 2, name: 'Marcus Wright', email: 'm.wright@industry.com', category: 'Web Dev', teamsAssigned: 4, status: 'Active' },
    { id: 3, name: 'Sarah Lee', email: 's.lee@startup.io', category: 'Data Science', teamsAssigned: 2, status: 'Inactive' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMentor, setEditingMentor] = useState(null);
  const [newMentor, setNewMentor] = useState({
    name: '',
    email: '',
    category: '',
    status: 'Active'
  });

  const filteredMentors = mentors.filter((mentor) =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveMentor = () => {
    if (!newMentor.name || !newMentor.email || !newMentor.category || !newMentor.status) {
      alert('Please fill all fields');
      return;
    }

    if (editingMentor) {
      setMentors(mentors.map((m) => m.id === editingMentor.id ? { ...editingMentor, ...newMentor } : m));
    } else {
      setMentors([...mentors, { id: Date.now(), ...newMentor, teamsAssigned: 0 }]);
    }

    setEditingMentor(null);
    setNewMentor({ name: '', email: '', category: '', status: 'Active' });
    setShowModal(false);
  };

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Mentor Management</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Assign mentors to categories and teams</div>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditingMentor(null);
            setNewMentor({ name: '', email: '', category: '', status: 'Active' });
            setShowModal(true);
          }}
        >
          Invite Mentor
        </Button>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <InputGroup style={{ maxWidth: '300px' }}>
            <InputGroup.Text className="bg-transparent border-end-0">
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control
              className="border-start-0"
              placeholder="Search mentors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>
        <div className="table-responsive">
          <Table className="mb-0" hover>
            <thead>
              <tr>
                <th className="border-top-0 border-bottom">Name</th>
                <th className="border-top-0 border-bottom">Email</th>
                <th className="border-top-0 border-bottom">Category</th>
                <th className="border-top-0 border-bottom">Teams Assigned</th>
                <th className="border-top-0 border-bottom">Status</th>
                <th className="border-top-0 border-bottom text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMentors.map((mentor) => (
                <tr key={mentor.id}>
                  <td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{mentor.name}</td>
                  <td className="py-3" style={{ color: 'var(--cf-text-secondary)' }}>{mentor.email}</td>
                  <td className="py-3">{mentor.category}</td>
                  <td className="py-3">
                    <Badge bg="info" pill>{mentor.teamsAssigned}</Badge>
                  </td>
                  <td className="py-3">
                    <Badge bg={mentor.status === 'Active' ? 'success' : 'secondary'}>{mentor.status}</Badge>
                  </td>
                  <td className="py-3 text-end">
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 text-secondary me-3"
                      onClick={() => window.open(`mailto:${mentor.email}`)}
                    >
                      <Mail size={16} />
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 text-primary"
                      onClick={() => {
                        setEditingMentor(mentor);
                        setNewMentor({
                          name: mentor.name,
                          email: mentor.email,
                          category: mentor.category,
                          status: mentor.status
                        });
                        setShowModal(true);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingMentor ? 'Edit Mentor' : 'Invite Mentor'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={newMentor.name}
                onChange={(e) => setNewMentor({ ...newMentor, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newMentor.email}
                onChange={(e) => setNewMentor({ ...newMentor, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={newMentor.category}
                onChange={(e) => setNewMentor({ ...newMentor, category: e.target.value })}
              >
                <option value="">Select Category</option>
                <option>AI/ML</option>
                <option>Web Dev</option>
                <option>Data Science</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newMentor.status}
                onChange={(e) => setNewMentor({ ...newMentor, status: e.target.value })}
              >
                <option>Active</option>
                <option>Inactive</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveMentor}>
            {editingMentor ? 'Update Mentor' : 'Invite Mentor'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MentorManagement;