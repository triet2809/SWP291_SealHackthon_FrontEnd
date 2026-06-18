import React, { useState } from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { AlertCircle, Upload } from 'lucide-react';
import { teamData } from '../../data/mockData';
import styles from './SubmissionManagement.module.css';

const SubmissionManagement = () => {
  const [formData, setFormData] = useState({
    title: teamData.project,
    category: teamData.category,
    description: teamData.fullDescription || teamData.description,
    github: 'https://github.com/neural-nexus/edutrack-ai'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submission logic would go here
  };

  return (
    <div className="py-2">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Submission Management</h1>
        <div className={styles.pageSubtitle}>
          Upload and manage your hackathon project
        </div>
      </div>

      <Card className={styles.formCard}>
        <Card.Body className="p-4">
          <h5 className={styles.cardTitle}>Current Submission</h5>
          
          <div className={styles.draftAlert}>
            <AlertCircle size={18} className={styles.draftAlertIcon} />
            <span>Submission is in <strong>Draft</strong> status. Final deadline: June 19, 11:59 PM.</span>
          </div>

          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className={styles.formLabel}>Project Title</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={styles.formControl}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className={styles.formLabel}>Category</Form.Label>
                  <Form.Select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={styles.formControl}
                  >
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Web3 & Blockchain">Web3 & Blockchain</option>
                    <option value="HealthTech">HealthTech</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label className={styles.formLabel}>Project Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={styles.formControl}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className={styles.formLabel}>Project Files</Form.Label>
              <div className={styles.dropzone}>
                <Upload size={24} className={styles.dropzoneIcon} />
                <div className={styles.dropzoneTitle}>Drop files here or click to browse</div>
                <div className={styles.dropzoneSubtitle}>ZIP, PDF, MP4 up to 100MB</div>
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className={styles.formLabel}>GitHub Repository URL</Form.Label>
              <Form.Control 
                type="url" 
                name="github"
                value={formData.github}
                onChange={handleChange}
                className={styles.formControl}
              />
            </Form.Group>

            <div className={styles.buttonContainer}>
              <button type="button" className={`btn ${styles.btnSave}`}>
                Save Draft
              </button>
              <Button variant="primary" type="submit" className={styles.btnSubmit}>
                Submit Final
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SubmissionManagement;
