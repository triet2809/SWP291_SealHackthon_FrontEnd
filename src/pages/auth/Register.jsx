import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Zap } from 'lucide-react';
import loginStyles from './Login.module.css';

const Register = () => {
  const navigate = useNavigate();
  const [studentType, setStudentType] = useState('fpt'); // 'fpt' or 'external'

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/pending-approval');
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
                onClick={() => setStudentType('fpt')}
              >
                FPT Student
              </Button>
              <Button 
                variant={studentType === 'external' ? 'primary' : 'outline-primary'} 
                className="flex-grow-1"
                onClick={() => setStudentType('external')}
              >
                External Student
              </Button>
            </div>

            <Form onSubmit={handleRegister} className={loginStyles.form}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" placeholder="John Doe" required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="you@example.com" required />
              </Form.Group>

              {studentType === 'fpt' ? (
                <Form.Group className="mb-3">
                  <Form.Label>FPT Student ID</Form.Label>
                  <Form.Control type="text" placeholder="SE123456" required />
                </Form.Group>
              ) : (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Student ID</Form.Label>
                      <Form.Control type="text" placeholder="ID Number" required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>University Name</Form.Label>
                      <Form.Control type="text" placeholder="University" required />
                    </Form.Group>
                  </Col>
                </Row>
              )}

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="••••••••" required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="••••••••" required />
                  </Form.Group>
                </Col>
              </Row>

              <Button variant="primary" type="submit" className="w-100 py-2">
                Create Account
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
