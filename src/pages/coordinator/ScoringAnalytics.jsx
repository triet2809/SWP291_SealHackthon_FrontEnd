import React, { useState } from 'react';
import { Card, Table, Badge, Form, InputGroup } from 'react-bootstrap';
import { Search, BarChart2 } from 'lucide-react';

const ScoringAnalytics = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data representing the scoring analytics across multiple teams
  const [analyticsData] = useState([
    {
      id: 1,
      team: 'Neural Nexus',
      track: 'AI Track A',
      judges: {
        J1: { name: 'Prof. Kim', score: 94 },
        J2: { name: 'Dr. Lee', score: 91 },
        J3: { name: 'M. Chen', score: 92 }
      },
      average: 92.5,
      variance: 3.2,
      status: 'Reviewed'
    },
    {
      id: 2,
      team: 'DataCraft',
      track: 'Data Track B',
      judges: {
        J1: { name: 'Dr. Chen', score: 88 },
        J2: { name: 'S. Davis', score: 92 },
        J3: { name: 'Prof. Kim', score: 90 }
      },
      average: 90.0,
      variance: 4.0,
      status: 'Reviewed'
    },
    {
      id: 3,
      team: 'ByteBuilders',
      track: 'Web Track A',
      judges: {
        J1: { name: 'M. Ross', score: 75 },
        J2: { name: 'S. Davis', score: 88 },
        J3: { name: 'Dr. Lee', score: 82 }
      },
      average: 81.6,
      variance: 42.3, // High variance indicating disagreement
      status: 'High Variance'
    },
    {
      id: 4,
      team: 'CodeCraft',
      track: 'AI Track A',
      judges: {
        J1: { name: 'Prof. Kim', score: 85 },
        J2: { name: 'Dr. Lee', score: 84 },
        J3: { name: 'M. Chen', score: 86 }
      },
      average: 85.0,
      variance: 1.0, // Low variance indicating strong agreement
      status: 'Reviewed'
    }
  ]);

  const filteredData = analyticsData.filter((item) =>
    item.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.track.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Scoring Analytics</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Review team performance, average scores, and judge variances</div>
        </div>
        <div className="d-flex gap-2">
          <Badge bg="warning" text="dark" className="px-3 py-2 d-flex align-items-center gap-2">
            <BarChart2 size={16} /> Needs Review (High Variance)
          </Badge>
        </div>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="p-3 border-bottom">
          <InputGroup style={{ maxWidth: '300px' }}>
            <InputGroup.Text className="bg-transparent border-end-0">
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control
              className="border-start-0"
              placeholder="Search team or track..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>
        <div className="table-responsive">
          <Table className="mb-0 text-center align-middle" hover>
            <thead className="text-start">
              <tr>
                <th className="border-top-0 border-bottom text-start py-3">Team Name</th>
                <th className="border-top-0 border-bottom text-start py-3">Track</th>
                <th className="border-top-0 border-bottom py-3">Judge 1</th>
                <th className="border-top-0 border-bottom py-3">Judge 2</th>
                <th className="border-top-0 border-bottom py-3">Judge 3</th>
                <th className="border-top-0 border-bottom py-3">Avg Score</th>
                <th className="border-top-0 border-bottom py-3">Variance</th>
                <th className="border-top-0 border-bottom text-end py-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-start">
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td className="fw-bold" style={{ color: 'var(--cf-text-primary)' }}>{item.team}</td>
                  <td><Badge bg="secondary">{item.track}</Badge></td>
                  <td className="text-center">
                    <div className="fw-medium">{item.judges.J1.score}</div>
                    <small className="text-muted">{item.judges.J1.name}</small>
                  </td>
                  <td className="text-center">
                    <div className="fw-medium">{item.judges.J2.score}</div>
                    <small className="text-muted">{item.judges.J2.name}</small>
                  </td>
                  <td className="text-center">
                    <div className="fw-medium">{item.judges.J3.score}</div>
                    <small className="text-muted">{item.judges.J3.name}</small>
                  </td>
                  <td className="text-center fw-bold text-primary">{item.average.toFixed(1)}</td>
                  <td className="text-center">
                    <Badge bg={item.variance > 10 ? 'danger' : 'success'} className="px-2 py-1">
                      {item.variance.toFixed(1)}
                    </Badge>
                  </td>
                  <td className="text-end">
                    <Badge bg={item.status === 'High Variance' ? 'warning' : 'success'} text={item.status === 'High Variance' ? 'dark' : 'light'}>
                      {item.status}
                    </Badge>
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

export default ScoringAnalytics;
