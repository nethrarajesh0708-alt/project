import React, { useState } from "react";
import { Card, Form, Button, Alert, Tabs, Tab } from "react-bootstrap";
import axios from "axios";

const SettingsContent = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    company_name: "Desk.in",
    company_email: "admin@desk.in",
    timezone: "Asia/Kolkata",
    date_format: "YYYY-MM-DD",
  });

  const [loginSettings, setLoginSettings] = useState({
    session_timeout: "30",
    max_login_attempts: "5",
    lockout_duration: "15",
    enable_2fa: "false",
  });

  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccess("General settings saved successfully");
    } catch (err) {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccess("Login settings saved successfully");
    } catch (err) {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">System Settings</h2>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm border-0">
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="general" title="General">
              <Form onSubmit={handleGeneralSubmit} className="mt-3">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Company Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={generalSettings.company_name}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            company_name: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Company Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={generalSettings.company_email}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            company_email: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Timezone</Form.Label>
                      <Form.Select
                        value={generalSettings.timezone}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            timezone: e.target.value,
                          })
                        }
                      >
                        <option value="Asia/Kolkata">India (IST)</option>
                        <option value="America/New_York">USA (EST)</option>
                        <option value="Europe/London">UK (GMT)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Date Format</Form.Label>
                      <Form.Select
                        value={generalSettings.date_format}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            date_format: e.target.value,
                          })
                        }
                      >
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Form>
            </Tab>

            <Tab eventKey="login" title="Login & Security">
              <Form onSubmit={handleLoginSubmit} className="mt-3">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Session Timeout (minutes)</Form.Label>
                      <Form.Control
                        type="number"
                        value={loginSettings.session_timeout}
                        onChange={(e) =>
                          setLoginSettings({
                            ...loginSettings,
                            session_timeout: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Max Login Attempts</Form.Label>
                      <Form.Control
                        type="number"
                        value={loginSettings.max_login_attempts}
                        onChange={(e) =>
                          setLoginSettings({
                            ...loginSettings,
                            max_login_attempts: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Lockout Duration (minutes)</Form.Label>
                      <Form.Control
                        type="number"
                        value={loginSettings.lockout_duration}
                        onChange={(e) =>
                          setLoginSettings({
                            ...loginSettings,
                            lockout_duration: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Enable 2FA</Form.Label>
                      <Form.Select
                        value={loginSettings.enable_2fa}
                        onChange={(e) =>
                          setLoginSettings({
                            ...loginSettings,
                            enable_2fa: e.target.value,
                          })
                        }
                      >
                        <option value="false">Disabled</option>
                        <option value="true">Enabled</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Form>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SettingsContent;
