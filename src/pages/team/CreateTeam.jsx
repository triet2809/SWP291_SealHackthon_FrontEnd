import React, { useEffect, useState } from 'react';
import { Card, Button, Form, Row, Col, Alert, Badge, Spinner } from 'react-bootstrap';
import { Plus, Trash2, Users, Save, AlertTriangle, Key, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTracks, createTeam } from '../../api/hackathonApi';
import { getStoredUser } from '../../utils/authUser';

const MAX_MEMBERS = 5; // leader + up to 4 teammates
const MAX_EMAIL_SLOTS = MAX_MEMBERS - 1; // 4 email slots

const CreateTeam = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [createdTeam, setCreatedTeam] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [tracks, setTracks] = useState([]);
  const [tracksLoading, setTracksLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const currentUser = getStoredUser() || {};

  const [teamData, setTeamData] = useState({ name: '', trackId: '' });
  // One email slot shown by default (person #2). "+" adds up to 3 more (person #3/#4/#5).
  const [memberEmails, setMemberEmails] = useState(['']);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await getTracks({ size: 100 });
        const list = res?.content || res || [];
        if (!active) return;
        setTracks(list);
        if (list.length) setTeamData((prev) => ({ ...prev, trackId: prev.trackId || list[0].id }));
      } catch (e) {
        if (active) setError(e.message || 'Failed to load tracks');
      } finally {
        if (active) setTracksLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const handleTeamChange = (e) => {
    const { name, value } = e.target;
    setTeamData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (idx, value) => {
    setMemberEmails((prev) => prev.map((v, i) => (i === idx ? value : v)));
  };

  const addEmailSlot = () => {
    if (memberEmails.length < MAX_EMAIL_SLOTS) setMemberEmails((prev) => [...prev, '']);
  };

  const removeEmailSlot = (idx) => {
    setMemberEmails((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!teamData.name.trim()) { setError('Vui lòng nhập tên team.'); return; }
    if (!teamData.trackId) { setError('Vui lòng chọn track.'); return; }

    const emails = memberEmails.map((s) => s.trim()).filter(Boolean);
    // Basic email format check for filled slots.
    const bad = emails.find((em) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em));
    if (bad) { setError(`Email không hợp lệ: ${bad}`); return; }

    setSubmitting(true);
    try {
      const created = await createTeam({
        trackId: teamData.trackId,
        name: teamData.name.trim(),
        leaderUserId: currentUser.id || undefined,
        memberEmails: emails, // BE resolves to approved users; blank list = solo team
      });
      setCreatedTeam(created);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Tạo team thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = async () => {
    const code = createdTeam?.inviteCode;
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked; user can copy manually */ }
  };

  // Total headcount = leader (1) + filled email slots.
  const filledCount = memberEmails.filter((s) => s.trim()).length;
  const totalMembers = 1 + filledCount;

  return (
    <div className="py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--cf-text-primary)' }}>Create a Team</h1>
          <div style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>Tạo team mới. Bạn là leader; có thể thêm thành viên ngay hoặc mời sau bằng mã.</div>
        </div>
      </div>

      {success ? (
        <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <Card.Body className="p-5 text-center">
            <div className="d-inline-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle mb-4" style={{ width: '80px', height: '80px' }}>
              <Save size={40} />
            </div>
            <h3 className="fw-bold mb-3" style={{ color: 'var(--cf-text-primary)' }}>Tạo team thành công!</h3>
            <p className="mb-4 text-muted mx-auto" style={{ maxWidth: '500px' }}>
              Team <strong>{createdTeam?.name || teamData.name}</strong> đã được tạo. Bạn là Team Leader.
            </p>

            {createdTeam?.inviteCode && (
              <div className="p-4 rounded mb-4 mx-auto" style={{ maxWidth: '420px', backgroundColor: 'var(--cf-bg-main)', border: '1px solid var(--cf-border-color)' }}>
                <div className="text-muted mb-2 text-uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Mã mời (Invite Code)</div>
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <Key size={20} className="text-primary" />
                  <span className="fw-bold text-primary" style={{ letterSpacing: '3px', fontSize: '1.5rem' }}>{createdTeam.inviteCode}</span>
                  <Button variant="link" className="p-0 text-secondary" onClick={copyCode} title="Copy">
                    {copied ? <Check size={18} className="text-success" /> : <Copy size={18} />}
                  </Button>
                </div>
              </div>
            )}

            <p className="text-muted mb-4 small">
              Chia sẻ mã này cho bạn bè để họ nhập ở trang Join Team.
              <br />Team cần từ 3 đến 5 thành viên trước khi sự kiện bắt đầu.
            </p>

            <Button variant="primary" className="px-4 py-2" onClick={() => navigate('/team/dashboard')}>
              Vào Team Dashboard
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
          <Row className="g-4">
            <Col lg={4}>
              <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: 'var(--cf-text-primary)' }}>
                    <Users size={20} className="text-primary" /> Team Information
                  </h5>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--cf-text-secondary)' }}>Tên team *</Form.Label>
                    <Form.Control type="text" name="name" value={teamData.name} onChange={handleTeamChange} required placeholder="Nhập tên team" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--cf-text-secondary)' }}>Track *</Form.Label>
                    <Form.Select name="trackId" value={teamData.trackId} onChange={handleTeamChange} disabled={tracksLoading} required>
                      {tracksLoading && <option>Đang tải track...</option>}
                      {!tracksLoading && tracks.length === 0 && <option value="">Không có track khả dụng</option>}
                      {tracks.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={8}>
              <Card style={{ border: 'none', borderRadius: 'var(--cf-radius-lg)', backgroundColor: 'var(--cf-bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0" style={{ color: 'var(--cf-text-primary)' }}>
                      Thành viên ({totalMembers}/{MAX_MEMBERS})
                    </h5>
                    {memberEmails.length < MAX_EMAIL_SLOTS && (
                      <Button variant="outline-primary" size="sm" className="d-flex align-items-center gap-1" onClick={addEmailSlot}>
                        <Plus size={16} /> Thêm thành viên
                      </Button>
                    )}
                  </div>

                  <Alert variant="warning" className="py-2 mb-4 d-flex align-items-center gap-2" style={{ fontSize: '0.875rem' }}>
                    <AlertTriangle size={16} />
                    <span><strong>Lưu ý:</strong> Nhập email thành viên đã đăng ký tài khoản (và đã được duyệt). Để trống cũng được — mời sau bằng mã. Team tối đa 5 người.</span>
                  </Alert>

                  <div className="d-flex flex-column gap-3">
                    {/* Leader row (you) */}
                    <div className="p-3 rounded" style={{ border: '1px solid var(--cf-status-info)', backgroundColor: 'var(--cf-bg-main)' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold" style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>
                          Thành viên 1 <Badge bg="info" className="ms-2">Team Leader (Bạn)</Badge>
                        </span>
                        <span className="text-muted small">{currentUser.email || currentUser.fullName || 'You'}</span>
                      </div>
                    </div>

                    {/* Email slots (person #2..#5) */}
                    {memberEmails.map((email, idx) => (
                      <div key={idx} className="p-3 rounded position-relative" style={{ border: '1px solid var(--cf-border-color)', backgroundColor: 'var(--cf-bg-main)' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="fw-bold" style={{ color: 'var(--cf-text-secondary)', fontSize: '0.875rem' }}>
                            Thành viên {idx + 2}
                          </span>
                          <Button variant="link" className="text-danger p-0" onClick={() => removeEmailSlot(idx)} title="Bỏ ô này">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        <Form.Group>
                          <Form.Label style={{ fontSize: '0.875rem', color: 'var(--cf-text-secondary)' }}>Email thành viên</Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="teammate@example.com"
                            value={email}
                            onChange={(e) => handleEmailChange(idx, e.target.value)}
                          />
                        </Form.Group>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex justify-content-end mt-4 pt-3" style={{ borderTop: '1px solid var(--cf-border-color)' }}>
                    <Button variant="primary" type="submit" className="px-4 py-2 d-flex align-items-center gap-2" disabled={submitting}>
                      {submitting ? <Spinner animation="border" size="sm" /> : <Save size={18} />}
                      {submitting ? 'Đang tạo...' : 'Tạo team'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
      )}
    </div>
  );
};

export default CreateTeam;
