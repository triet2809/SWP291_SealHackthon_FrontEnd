import React from 'react';
import { Card, Table, Button, Badge } from 'react-bootstrap';
import { Plus, Edit, Settings } from 'lucide-react';

const EventManagement = () => {
  const events = [
    { id: 1, name: 'SEAL Hackathon 2026', startDate: 'June 20, 2026', endDate: 'June 22, 2026', status: 'Active', participants: 168 },
    { id: 2, name: 'Winter CodeFest 2025', startDate: 'Dec 10, 2025', endDate: 'Dec 12, 2025', status: 'Completed', participants: 210 },
    { id: 3, name: 'AI Innovation Challenge', startDate: 'Aug 15, 2026', endDate: 'Aug 30, 2026', status: 'Draft', participants: 0 },
  ];

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Event Management</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Create and configure hackathon events</div>
        </div>
        <Button variant="primary" className="d-flex align-items-center gap-2">
          <Plus size={18} /> New Event
        </Button>
      </div>

      <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="table-responsive">
          <Table className="mb-0" hover>
            <thead>
              <tr>
                <th className="border-top-0 border-bottom">Event Name</th>
                <th className="border-top-0 border-bottom">Start Date</th>
                <th className="border-top-0 border-bottom">End Date</th>
                <th className="border-top-0 border-bottom">Participants</th>
                <th className="border-top-0 border-bottom">Status</th>
                <th className="border-top-0 border-bottom text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="fw-medium py-3" style={{ color: 'var(--cf-text-primary)' }}>{event.name}</td>
                  <td className="py-3">{event.startDate}</td>
                  <td className="py-3">{event.endDate}</td>
                  <td className="py-3">{event.participants}</td>
                  <td className="py-3">
                    <Badge bg={
                      event.status === 'Active' ? 'success' :
                      event.status === 'Draft' ? 'warning' : 'secondary'
                    } text={event.status === 'Draft' ? 'dark' : 'light'}>
                      {event.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-end">
                    <Button variant="link" size="sm" className="p-0 text-muted me-3">
                      <Settings size={16} />
                    </Button>
                    <Button variant="link" size="sm" className="p-0 text-primary">
                      <Edit size={16} />
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

export default EventManagement;
