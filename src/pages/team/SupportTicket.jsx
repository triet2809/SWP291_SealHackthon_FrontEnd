import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Row, Col, Alert, Badge, Spinner } from 'react-bootstrap';
import { Send, LifeBuoy, Inbox } from 'lucide-react';
import { createSupportTicket, getSupportTickets, markAllNotificationsRead } from '../../api/hackathonApi';

const CATEGORY_LABELS = {
  technical: 'Technical / Platform Issue',
  rules: 'Rule Clarification',
  team: 'Team Member Changes',
  other: 'Other Inquiry',
};

const STATUS_VARIANT = {
  open: 'secondary',
  in_progress: 'info',
  resolved: 'success',
  closed: 'dark',
};

const STATUS_LABEL = {
  open: 'Đang mở',
  in_progress: 'Đang xử lý',
  resolved: 'Đã giải quyết',
  closed: 'Đã đóng',
};

const PRIORITY_VARIANT = { low: 'light', medium: 'warning', high: 'danger' };

const SupportTicket = () => {
  const [form, setForm] = useState({ category: '', priority: 'low', subject: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [justSubmitted, setJustSubmitted] = useState(false);

  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);

  const loadMine = async () => {
    setTicketsLoading(true);
    try {
      // BE scopes non-coordinators to their own tickets regardless of param.
      const res = await getSupportTickets();
      const list = Array.isArray(res) ? res : (res?.content || []);
      setTickets(list);
    } catch {
      // Non-fatal: form still usable even if list fails.
      setTickets([]);
    } finally {
      setTicketsLoading(false);
    }
  };

  useEffect(() => { loadMine(); markAllNotificationsRead('my_support').catch(() => {}); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.category) { setError('Vui lòng chọn chủ đề.'); return; }
    setSubmitting(true);
    try {
      await createSupportTicket({
        category: form.category,
        priority: form.priority,
        subject: form.subject.trim(),
        description: form.description.trim(),
      });
      setForm({ category: '', priority: 'low', subject: '', description: '' });
      setJustSubmitted(true);
      setTimeout(() => setJustSubmitted(false), 5000);
      await loadMine();
    } catch (err) {
      setError(err.message || 'Gửi ticket thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-2">
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Submit a Ticket</h1>
        <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Liên hệ ban tổ chức để được hỗ trợ. Ticket của bạn sẽ được điều phối viên (coordinator) xử lý.</div>
      </div>

      <Row className="g-4">
        <Col lg={7}>
          <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="p-4">
              {justSubmitted && <Alert variant="success">Đã gửi ticket tới ban tổ chức. Bạn có thể theo dõi trạng thái ở danh sách bên phải.</Alert>}
              {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--cf-text-primary)' }}>
                    <LifeBuoy size={20} className="text-primary" />
                    Chúng tôi có thể giúp gì?
                  </h5>
                </div>

                <Row className="g-3 mb-4">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-medium" style={{ color: 'var(--cf-text-primary)', fontSize: '0.875rem' }}>Chủ đề *</Form.Label>
                      <Form.Select name="category" value={form.category} onChange={handleChange} required>
                        <option value="">Chọn chủ đề...</option>
                        <option value="technical">Kỹ thuật / Nền tảng</option>
                        <option value="rules">Làm rõ luật</option>
                        <option value="team">Thay đổi thành viên team</option>
                        <option value="other">Câu hỏi khác</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-medium" style={{ color: 'var(--cf-text-primary)', fontSize: '0.875rem' }}>Mức độ ưu tiên</Form.Label>
                      <Form.Select name="priority" value={form.priority} onChange={handleChange} required>
                        <option value="low">Thấp - Câu hỏi chung</option>
                        <option value="medium">Trung bình - Cản trở tiến độ</option>
                        <option value="high">Cao - Sự cố nghiêm trọng (khẩn)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-medium" style={{ color: 'var(--cf-text-primary)', fontSize: '0.875rem' }}>Tiêu đề *</Form.Label>
                      <Form.Control type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="Tóm tắt ngắn gọn vấn đề..." required />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-medium" style={{ color: 'var(--cf-text-primary)', fontSize: '0.875rem' }}>Mô tả chi tiết *</Form.Label>
                      <Form.Control as="textarea" name="description" rows={6} value={form.description} onChange={handleChange} placeholder="Cung cấp chi tiết, link, hoặc bối cảnh liên quan..." required />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end pt-3" style={{ borderTop: '1px solid var(--cf-border-color)' }}>
                  <Button variant="primary" type="submit" className="d-flex align-items-center gap-2 px-4" disabled={submitting}>
                    {submitting ? <Spinner animation="border" size="sm" /> : <Send size={18} />}
                    {submitting ? 'Đang gửi...' : 'Gửi Ticket'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-3" style={{ color: 'var(--cf-text-primary)' }}>Ticket của tôi</h5>
              {ticketsLoading ? (
                <div className="text-center py-4"><Spinner animation="border" size="sm" /></div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <Inbox size={40} className="mb-2 opacity-50" />
                  <div>Chưa có ticket nào.</div>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {tickets.map((t) => (
                    <div key={t.id} className="p-3 rounded" style={{ border: '1px solid var(--cf-border-color)', backgroundColor: 'var(--cf-bg-main)' }}>
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <span className="fw-bold" style={{ color: 'var(--cf-text-primary)', fontSize: '0.9rem' }}>{t.subject}</span>
                        <Badge bg={STATUS_VARIANT[t.status] || 'secondary'}>{STATUS_LABEL[t.status] || t.status}</Badge>
                      </div>
                      <div className="d-flex gap-2 mb-2">
                        <Badge bg="light" text="dark" className="border">{CATEGORY_LABELS[t.category] || t.category}</Badge>
                        <Badge bg={PRIORITY_VARIANT[t.priority] || 'light'} text={t.priority === 'low' ? 'dark' : undefined}>{t.priority}</Badge>
                      </div>
                      <p className="text-muted small mb-0" style={{ whiteSpace: 'pre-wrap' }}>{t.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SupportTicket;
