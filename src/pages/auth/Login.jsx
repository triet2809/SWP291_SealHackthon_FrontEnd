import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { Zap, Users, Award, Calendar, ArrowRight } from 'lucide-react';
import { users } from '../../data/mockData';
import { login } from '../../api/authApi';
import { getMyTeams } from '../../api/hackathonApi';
import styles from './Login.module.css';
import { useTheme } from '../../context/ThemeContext';

const routeByRole = (roles = []) => {
  const r = roles.map((x) => String(x).toLowerCase());
  if (r.includes('coordinator')) return '/coordinator/dashboard';
  if (r.includes('mentor')) return '/mentor/dashboard';
  if (r.includes('judge')) return '/judge/dashboard';
  // Participant landing is decided after checking team membership (see resolveParticipantRoute).
  if (r.includes('team_leader') || r.includes('team_member')) return null;
  return null;
};

// Participants with a team land in the team workspace; those without a team
// land in the student area where they can create or join a team.
const resolveParticipantRoute = async () => {
  try {
    const teams = await getMyTeams();
    const list = Array.isArray(teams) ? teams : (teams?.content || []);
    return list.length > 0 ? '/team/dashboard' : '/student/dashboard';
  } catch {
    return '/student/dashboard';
  }
};

const Login = () => {
  const navigate = useNavigate();
  const { setForceTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForceTheme('light');
    return () => setForceTheme(null);
  }, [setForceTheme]);

  const handleDemoLogin = (role) => {
    if (role === 'student') {
      navigate('/student');
    } else {
      navigate(`/${role}/dashboard`);
    }
  };

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const result = await login({ email, password });
      if (!result.ok) {
        setError(result.data?.message || 'Incorrect email or password');
        return;
      }
      const auth = result.data?.data || result.data;
      if (!auth?.accessToken) {
        setError('Login response is missing the access token');
        return;
      }
      localStorage.setItem('seal_access_token', auth.accessToken);
      localStorage.setItem('seal_refresh_token', auth.refreshToken || '');
      localStorage.setItem('seal_token_type', auth.tokenType || 'Bearer');
      localStorage.setItem('seal_user', JSON.stringify(auth.user || {}));
      const staticRoute = routeByRole(auth.user?.roles);
      const dest = staticRoute || await resolveParticipantRoute();
      navigate(dest, { replace: true });
    } catch {
      setError('Could not connect to the server');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <Row className="g-0 min-vh-100">
        {/* Left Side - Hero Section */}
        <Col lg={5} className={styles.heroSection}>
          <div className={styles.heroContent}>
            <div className={styles.brandBadge}>
              <Zap size={16} fill="currentColor" /> SEAL Hackathon 2026
            </div>
            
            <h1 className={styles.heroTitle}>
              FPT University<br />
              Software Engineering<br />
              Competition
            </h1>
            
            <p className={styles.heroDescription}>
              The premier hackathon platform for building, collaborating, and competing with the best engineering talent.
            </p>
            
            <div className={styles.statsContainer}>
              <div className={styles.statItem}>
                <div className={styles.statIcon}><Users size={16} /></div>
                <span>48 registered teams · 192 participants</span>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statIcon}><Award size={16} /></div>
                <span>$25,000 in prizes across 6 categories</span>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statIcon}><Calendar size={16} /></div>
                <span>June 20–22, 2026 · Engineering Complex</span>
              </div>
            </div>

            <div className={styles.roleTags}>
              <span className={styles.roleTag}>Student</span>
              <span className={styles.roleTag}>Team Leader</span>
              <span className={styles.roleTag}>Mentor</span>
              <span className={styles.roleTag}>Judge</span>
            </div>
          </div>
          
          {/* Abstract circles decoration */}
          <div className={`${styles.circle} ${styles.circle1}`}></div>
          <div className={`${styles.circle} ${styles.circle2}`}></div>
        </Col>

        {/* Right Side - Login Form */}
        <Col lg={7} className={styles.formSection}>
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Welcome back</h2>
            <p className={styles.formSubtitle}>Sign in to access your dashboard</p>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleStandardLogin} className={styles.form}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="you@fpt.edu.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 py-2" disabled={submitting}>
                {submitting ? <><Spinner size="sm" className="me-2" />Signing in...</> : 'Sign In'}
              </Button>
            </Form>

            <div className="text-center mt-2 mb-3">
              <span className="text-muted">Don't have an account? </span>
              <Link to="/register" className="fw-medium text-primary text-decoration-none">
                Sign up
              </Link>
            </div>

            <div className={styles.demoSection}>
              <div className={styles.demoDivider}>
                <span>DEMO ACCESS</span>
              </div>

              <div className={styles.demoCards}>
                {Object.entries(users).map(([role, user]) => (
                  <Card 
                    key={role} 
                    className={styles.demoCard} 
                    onClick={() => handleDemoLogin(role)}
                  >
                    <Card.Body className="d-flex align-items-center justify-content-between p-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className={styles.demoAvatar} data-role={role}>
                          {user.initials}
                        </div>
                        <div>
                          <div className={styles.demoName}>{user.name}</div>
                          <div className={styles.demoRole}>{user.role}</div>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-muted" />
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
