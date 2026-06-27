import React, { useState } from 'react';
import { Card, Table, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { Search, Download, Eye } from 'lucide-react';
import { mentorSubmissions } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

const SubmissionManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roundFilter, setRoundFilter] = useState('All Rounds');
  const [submissions] = useState(mentorSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch = sub.teamName.toLowerCase().includes(searchTerm.toLowerCase()) || sub.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRound = roundFilter === 'All Rounds' || sub.round === roundFilter;
    return matchesSearch && matchesRound;
  });

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Submission Management</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Review all team submissions</div>
        </div>
        <Button variant="outline-primary" className="d-flex align-items-center gap-2" onClick={() => alert('Exporting submissions...')} >
          <Download size={18} /> Export All
        </Button>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <InputGroup style={{ maxWidth: '300px' }}>
            <InputGroup.Text className="bg-transparent border-end-0">
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control className="border-start-0" placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </InputGroup>
          <div className="d-flex gap-2">
            <Form.Select style={{ width: '150px' }} value={roundFilter} onChange={(e) => setRoundFilter(e.target.value)}>
              <option>All Rounds</option>
              <option>Preliminary</option>
              <option>Final</option>
            </Form.Select>
          </div>
        </div>
        <div className="table-responsive">
          <Table className="mb-0" hover>
            <thead>
              <tr>
                <th className="border-top-0 border-bottom">Team Name</th>
                <th className="border-top-0 border-bottom">Project Name</th>
                <th className="border-top-0 border-bottom">Version</th>
                <th className="border-top-0 border-bottom">Round</th>
                <th className="border-top-0 border-bottom">Submitted Date</th>
                <th className="border-top-0 border-bottom">Review Status</th>
                <th className="border-top-0 border-bottom text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((sub) => (
                <tr key={sub.id}>
                  <td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{sub.teamName}</td>
                  <td className="py-3">{sub.projectName}</td>
                  <td className="py-3"><Badge bg="secondary">{sub.version}</Badge></td>
                  <td className="py-3"><Badge bg="info">{sub.round}</Badge></td>
                  <td className="py-3">{sub.submittedDate}</td>
                  <td className="py-3">
                    <Badge bg={sub.status === 'Reviewed' ? 'success' : 'warning'} text={sub.status === 'Pending Review' ? 'dark' : 'light'}>
                      {sub.status}
                    </Badge>
                  </td>
                  <td className="text-end">
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 text-primary" 
                      onClick={() => navigate(`/coordinator/submissions/${sub.id}`)}
                    >
                      <Eye size={18} />
                    </Button>
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

export default SubmissionManagement;
