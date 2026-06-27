import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, InputGroup, Button, Badge } from 'react-bootstrap';
import { Send, Image as ImageIcon, Paperclip, MoreVertical, Search, CheckCheck } from 'lucide-react';
import { users } from '../../data/mockData';

const TeamChat = () => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Mock initial messages
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Alex Chen', initials: 'AC', role: 'Team Lead', time: '10:30 AM', text: 'Hey team, I just pushed the latest updates to the recommendation engine.', isMine: true },
    { id: 2, sender: 'Maya Rodriguez', initials: 'MR', role: 'Backend', time: '10:32 AM', text: 'Awesome! Did you include the edge cases we discussed yesterday?', isMine: false },
    { id: 3, sender: 'Alex Chen', initials: 'AC', role: 'Team Lead', time: '10:33 AM', text: 'Yes, both null values and outliers are handled now. You can pull the latest from main.', isMine: true },
    { id: 4, sender: 'Sam Taylor', initials: 'ST', role: 'UI/UX', time: '10:45 AM', text: 'I am finishing up the dashboard wireframes. Will upload them here shortly.', isMine: false },
    { id: 5, sender: 'System', initials: 'SYS', role: 'Bot', time: '11:00 AM', text: 'Reminder: Final submission is due in 48 hours.', isSystem: true }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: users.team.name,
      initials: users.team.initials,
      role: users.team.teamRole,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: message,
      isMine: true
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  return (
    <div className="py-2 h-100 d-flex flex-column" style={{ minHeight: 'calc(100vh - 120px)' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Team Chat</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Collaborate with your team members in real-time</div>
        </div>
        <div className="d-flex gap-2">
          <Badge bg="primary" pill className="d-flex align-items-center px-3 py-2">
            4 Members Online
          </Badge>
        </div>
      </div>

      <Card className="flex-grow-1 d-flex flex-column" style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {/* Chat Header */}
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center" style={{ backgroundColor: 'var(--cf-bg-main)' }}>
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center justify-content-center bg-primary text-white rounded-circle fw-bold" style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>
              #
            </div>
            <div>
              <h6 className="fw-bold mb-0">General Discussion</h6>
              <small className="text-muted">Neural Nexus Team Space</small>
            </div>
          </div>
          <div className="d-flex gap-2">
            <Button variant="link" className="p-1 text-muted"><Search size={20} /></Button>
            <Button variant="link" className="p-1 text-muted"><MoreVertical size={20} /></Button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-grow-1 p-4 overflow-auto" style={{ backgroundColor: 'var(--cf-bg-body)', maxHeight: '550px' }}>
          <div className="d-flex flex-column gap-4">
            <div className="text-center">
              <Badge bg="secondary" className="px-3 py-1 fw-normal text-muted" style={{ backgroundColor: 'var(--cf-border-color)!important' }}>Today</Badge>
            </div>

            {messages.map((msg) => {
              if (msg.isSystem) {
                return (
                  <div key={msg.id} className="text-center my-2">
                    <span className="small text-muted bg-light px-3 py-1 rounded-pill border">{msg.text}</span>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`d-flex ${msg.isMine ? 'justify-content-end' : 'justify-content-start'}`}>
                  <div className={`d-flex gap-2 max-w-75 ${msg.isMine ? 'flex-row-reverse' : ''}`} style={{ maxWidth: '75%' }}>
                    
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className={`d-flex align-items-center justify-content-center text-white rounded-circle fw-bold ${msg.isMine ? 'bg-primary' : 'bg-secondary'}`} style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}>
                        {msg.initials}
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className={`d-flex flex-column ${msg.isMine ? 'align-items-end' : 'align-items-start'}`}>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="fw-medium small" style={{ color: 'var(--cf-text-primary)' }}>{msg.sender}</span>
                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>{msg.time}</span>
                      </div>
                      <div className={`p-3 rounded-3 shadow-sm ${msg.isMine ? 'text-white' : ''}`} style={{ backgroundColor: msg.isMine ? 'var(--cf-primary)' : 'var(--cf-bg-surface)', border: msg.isMine ? 'none' : '1px solid var(--cf-border-color)', borderTopRightRadius: msg.isMine ? '4px' : '', borderTopLeftRadius: msg.isMine ? '' : '4px' }}>
                        <p className="mb-0" style={{ fontSize: '0.95rem' }}>{msg.text}</p>
                      </div>
                      {msg.isMine && (
                        <div className="mt-1 d-flex justify-content-end">
                          <CheckCheck size={14} className="text-primary" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input Area */}
        <div className="p-3 border-top" style={{ backgroundColor: 'var(--cf-bg-surface)' }}>
          <Form onSubmit={handleSend}>
            <InputGroup className="align-items-end">
              <div className="d-flex bg-light border rounded-start px-2 py-1 align-items-center h-100" style={{ borderRight: 'none' }}>
                <Button variant="link" className="p-1 text-muted"><Paperclip size={20} /></Button>
                <Button variant="link" className="p-1 text-muted"><ImageIcon size={20} /></Button>
              </div>
              <Form.Control
                as="textarea"
                rows={1}
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                style={{ resize: 'none', borderLeft: 'none', backgroundColor: 'var(--cf-bg-main)' }}
                className="py-3 shadow-none"
              />
              <Button type="submit" variant="primary" className="px-4 d-flex align-items-center justify-content-center rounded-end h-100" disabled={!message.trim()} style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
                <Send size={18} />
              </Button>
            </InputGroup>
            <div className="text-muted mt-2 text-end" style={{ fontSize: '0.75rem' }}>
              Press Enter to send, Shift+Enter for new line
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default TeamChat;
