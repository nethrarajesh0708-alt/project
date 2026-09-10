import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { 
  FiClock, FiUsers, FiTrendingUp,
  FiUser, FiArrowRight, FiCheckCircle, FiBell, FiBarChart, FiHeart
} from 'react-icons/fi';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <Container className="hero-container">
          <Row className="align-items-center">
            <Col lg={6} className="hero-content">
              <div className="hero-badge">Smart Employee Management</div>
              <h1 className="hero-title">
                Welcome to Desk.in <span className="hero-emoji">👋</span>
              </h1>
              <h2 className="hero-subtitle">Your work. Your team. One smarter workspace.</h2>
              <p className="hero-description">
                Desk.in brings your everyday work essentials together in one simple, secure workspace. 
                Track time, stay organized, understand productivity, and manage your workplace with less effort and more clarity.
              </p>
              <div className="hero-actions">
                <Link to="/LoginFetch" className="btn-get-started">
                  <span className="btn-text">Get Started</span>
                  <FiArrowRight className="btn-arrow" />
                </Link>
                <p className="hero-microcopy">Good to have you here.</p>
              </div>
            </Col>
            <Col lg={6} className="hero-visual">
              <div className="floating-workspace">
                <div className="float-card float-card-1">
                  <FiUser className="float-icon" />
                  <div className="float-text">
                    <strong>Team Update</strong>
                    <span>3 tasks completed</span>
                  </div>
                </div>
                
                <div className="float-card float-card-2">
                  <div className="productivity-ring">
                    <FiTrendingUp className="productivity-icon" />
                    <span className="productivity-text">86%</span>
                  </div>
                  <span className="float-label">Productive</span>
                </div>
                
                <div className="float-card float-card-3">
                  <FiClock className="float-icon" />
                  <div className="float-text">
                    <strong>06h 24m</strong>
                    <span>Work time today</span>
                  </div>
                </div>
                
                <div className="float-card float-card-4">
                  <FiCheckCircle className="float-icon success" />
                  <div className="float-text">
                    <strong>Attendance</strong>
                    <span>Marked present</span>
                  </div>
                </div>
                
                <div className="float-card float-card-5">
                  <FiBell className="float-icon" />
                  <div className="float-text">
                    <strong>Notification</strong>
                    <span>New message</span>
                  </div>
                </div>
                
                <div className="float-card float-card-6">
                  <FiBarChart className="float-icon" />
                  <div className="float-text">
                    <strong>Tasks</strong>
                    <span>12 completed</span>
                  </div>
                </div>
                
                <div className="central-illustration">
                  <div className="illustration-card">
                    <div className="illustration-header">
                      <div className="illustration-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span className="illustration-title">Dashboard</span>
                    </div>
                    <div className="illustration-body">
                      <div className="illustration-profile">
                        <div className="illustration-avatar">JD</div>
                        <div className="illustration-info">
                          <span className="illustration-name">John Doe</span>
                          <span className="illustration-role">Employee</span>
                        </div>
                      </div>
                      <div className="illustration-stats">
                        <div className="illustration-stat">
                          <span className="stat-value">86%</span>
                          <span className="stat-label">Productivity</span>
                        </div>
                        <div className="illustration-stat">
                          <span className="stat-value">6h</span>
                          <span className="stat-label">Work Time</span>
                        </div>
                        <div className="illustration-stat">
                          <span className="stat-value">12</span>
                          <span className="stat-label">Tasks</span>
                        </div>
                      </div>
                      <div className="illustration-chart">
                        <div className="chart-bar" style={{ height: '60%' }}></div>
                        <div className="chart-bar" style={{ height: '80%' }}></div>
                        <div className="chart-bar" style={{ height: '45%' }}></div>
                        <div className="chart-bar" style={{ height: '90%' }}></div>
                        <div className="chart-bar" style={{ height: '70%' }}></div>
                        <div className="chart-bar" style={{ height: '55%' }}></div>
                        <div className="chart-bar" style={{ height: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Better Way Section */}
      <section className="better-way-section">
        <Container>
          <div className="section-header text-center">
            <h2 className="section-title">A better way to stay on top of work.</h2>
            <p className="section-subtitle">
              From the first login of the day to the final task, Desk.in helps keep work, people, and productivity connected in one simple experience.
            </p>
          </div>
          <div className="digital-illustration">
            <div className="illustration-mockup">
              <div className="mockup-header">
                <div className="mockup-dot"></div>
                <div className="mockup-dot"></div>
                <div className="mockup-dot"></div>
              </div>
              <div className="mockup-body">
                <div className="mockup-card">
                  <div className="mockup-card-icon blue">
                    <FiUsers />
                  </div>
                  <div className="mockup-card-title">Employees</div>
                  <div className="mockup-card-value">248</div>
                  <div className="mockup-card-sub">Active now</div>
                </div>
                <div className="mockup-card">
                  <div className="mockup-card-icon green">
                    <FiCheckCircle />
                  </div>
                  <div className="mockup-card-title">Attendance</div>
                  <div className="mockup-card-value">96.4%</div>
                  <div className="mockup-card-sub">Today</div>
                </div>
                <div className="mockup-card">
                  <div className="mockup-card-icon teal">
                    <FiBarChart />
                  </div>
                  <div className="mockup-card-title">Tasks Done</div>
                  <div className="mockup-card-value">1,024</div>
                  <div className="mockup-card-sub">Completed</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-bg-pattern"></div>
        <Container>
          <div className="section-header text-center">
            <h2 className="section-title">About Desk.in</h2>
            <p className="section-subtitle">
              A complete employee management platform built for Admins, HR, and Employees.
            </p>
          </div>
          <Row className="g-4 justify-content-center">
            <Col md={4}>
              <Card className="feature-card">
                <Card.Body>
                  <div className="feature-icon">
                    <FiUsers />
                  </div>
                  <Card.Title>Who It's For</Card.Title>
                  <Card.Text>Designed for teams of all sizes—from startups to large organizations. Perfect for Employees, HR teams, and Admins.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="feature-card">
                <Card.Body>
                  <div className="feature-icon">
                    <FiCheckCircle />
                  </div>
                  <Card.Title>What It Does</Card.Title>
                  <Card.Text>Simplifies your work by helping you track time, manage attendance, assign tasks, and gain insights—all in one place.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="feature-card">
                <Card.Body>
                  <div className="feature-icon">
                    <FiHeart />
                  </div>
                  <Card.Title>Why Desk.in?</Card.Title>
                  <Card.Text>Because your workspace should work for you. Desk.in brings everything together in a simple, secure, and smart way.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="text-center mt-4">
            <Link to="/LoginFetch" className="btn-get-started">
              <span className="btn-text">Explore Features</span>
              <FiArrowRight className="btn-arrow" />
            </Link>
            <p className="human-touch" style={{ color: 'rgba(255,255,255,0.7)', marginTop: '1rem' }}>
              Less managing. More doing.
            </p>
          </div>
        </Container>
      </section>

    </div>
  );
};

export default Home;
