import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Zap } from 'lucide-react';
import loginStyles from './Login.module.css';
import { useTheme } from '../../context/ThemeContext';
import { FPT_CAMPUSES, FPT_UNIVERSITY_ID } from '../../config/registerConfig';
import { registerFpt, registerExternal } from '../../api/authApi';
import { getCampuses } from '../../api/universityApi';

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  studentId: '',
  campusId: '',
  universityName: '',
};

const Register = () => {
  const navigate = useNavigate();
  const { setForceTheme } = useTheme();
  const [studentType, setStudentType] = useState('fpt'); // 'fpt' or 'external'
  const [form, setForm] = useState(initialForm);
  const [campuses, setCampuses] = useState(FPT_CAMPUSES);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForceTheme('light');
    getCampuses({ universityId: FPT_UNIVERSITY_ID })
      .then((items) => {
        if (items.length) setCampuses(items);
      })
      .catch(() => {
        // Fallback to static campus seed IDs if public campus API is unavailable.
        setCampuses(FPT_CAMPUSES);
      });
    return () => setForceTheme(null);
  }, [setForceTheme]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const switchType = (type) => {
    setStudentType(type);
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Password and confirmation do not match.');
      return;
    }

    if (studentType === 'fpt' && !form.campusId) {
      setError('Please select an FPT campus.');
      return;
    }

    setSubmitting(true);
    try {
      const result =
        studentType === 'fpt'
          ? await registerFpt({
              fullName: form.fullName,
              email: form.email,
              password: form.password,
              studentId: form.studentId,
              universityId: FPT_UNIVERSITY_ID,
              campusId: form.campusId,
            })
          : await registerExternal({
              fullName: form.fullName,
              email: form.email,
              password: form.password,
              universityName: form.universityName,
            });

      if (result.ok) {
        navigate('/pending-approval');
      } else {
        setError(result.data?.message || `Registration failed (${result.status}).`);
      }
    } catch {
      setError('Cannot reach the server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={loginStyles.loginPage}>
      <Row className="g-0 min-vh-100">
        <Col lg={5} className={loginStyles.heroSection}>
          <div className={loginStyles.heroContent}>
            <div className={loginStyles.brandBadge}>
              <Zap size={16} fill="currentColor" /> SEAL Hackathon 2026
            </div>
            <h1 className={loginStyles.heroTitle}>Join the Competition</h1>
            <p className={loginStyles.heroDescription}>
              Register your account to join a team, submit projects, and compete for $25,000 in prizes.
            </p>
          </div>
          <div className={`${loginStyles.circle} ${loginStyles.circle1}`}></div>
          <div className={`${loginStyles.circle} ${loginStyles.circle2}`}></div>
        </Col>

        <Col lg={7} className={loginStyles.formSection}>
          <div className={loginStyles.formContainer}>
            <h2 className={loginStyles.formTitle}>Create Account</h2>
            <p className={loginStyles.formSubtitle}>Join SEAL Hackathon 2026 as a participant</p>

            <div className="d-flex gap-2 mb-4">
              <Button
                variant={studentType === 'fpt' ? 'primary' : 'outline-primary'}
                className="flex-grow-1"
                onClick={() => switchType('fpt')}
              >
                FPT Student
              </Button>
              <Button
                variant={studentType === 'external' ? 'primary' : 'outline-primary'}
                className="flex-grow-1"
                onClick={() => switchType('external')}
              >
                External Student
              </Button>
            </div>

            {error && <Alert variant="danger" className="py-2">{error}</Alert>}

            <Form onSubmit={handleRegister} className={loginStyles.form}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </Form.Group>

              {studentType === 'fpt' ? (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>FPT Student ID</Form.Label>
                      <Form.Control
                        type="text"
                        name="studentId"
                        value={form.studentId}
                        onChange={handleChange}
                        placeholder="SE123456"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Campus</Form.Label>
                      <Form.Select
                        name="campusId"
                        value={form.campusId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select your campus</option>
                        {campuses.map((campus) => (
                          <option key={campus.id} value={campus.id}>
                            {campus.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              ) : (
                <Form.Group className="mb-3">
                  <Form.Label>University Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="universityName"
                    value={form.universityName}
                    onChange={handleChange}
                    placeholder="e.g. Ho Chi Minh University of Technology"
                    required
                  />
                  <Form.Text className="text-muted">
                    If your university is not in our system yet, it will be added automatically.
                  </Form.Text>
                </Form.Group>
              )}

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button variant="primary" type="submit" className="w-100 py-2" disabled={submitting}>
                {submitting ? 'Creating…' : 'Create Account'}
              </Button>
            </Form>

            <div className="text-center mt-4">
              <span className="text-muted">Already have an account? </span>
              <Link to="/login" className="fw-medium text-primary text-decoration-none">
                Sign in
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
