/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  ProgressBar,
  Alert,
  Spinner,
} from "react-bootstrap";
import {
  FiUpload,
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiUsers,
  FiLock,
  FiBriefcase,
  FiDollarSign,
} from "react-icons/fi";
import axios from "axios";

const EmployeeRegistrationModal = ({ show, handleClose }) => {
  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [errors, setErrors] = useState({});
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    username: "",
    department_id: "",
    address: "",
    emergency_name: "",
    emergency_phone: "",
    emergency_relation: "",
    certificate: null,
    experience: null,
    password: "",
    date_of_birth: "",
    employment_type: "full-time",
    designation: "",
    bank_account_details: "",
    pan_number: "",
    pf_uan_number: "",
  });

  useEffect(() => {
    if (show) {
      const fetchDepartments = async () => {
        try {
          const res = await axios.get(
            `${BASE_URL}backend/api/department/fetctDepartment.php`,
            { withCredentials: true }
          );
          const result = res.data;
          if (result.success) {
            setDepartments(result.departments);
          } else {
            throw new Error(result.message || "Failed to fetch departments");
          }
        } catch (err) {
          console.error("Department load failed:", err.message);
        }
      };
      fetchDepartments();
    }
  }, [show]);

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.first_name) newErrors.first_name = "First name is required";
      if (!formData.last_name) newErrors.last_name = "Last name is required";
      if (!formData.username) newErrors.username = "Username is required";
      if (!formData.password) newErrors.password = "Password is required";
      else if (!/^(?=.*[A-Z])(?=.*[\W_]).+$/.test(formData.password)) newErrors.password = "Must contain at least one uppercase letter and one special character";
      if (!formData.date_of_birth) newErrors.date_of_birth = "Date of birth is required";
      if (!formData.designation) newErrors.designation = "Designation is required";
      if (!formData.department_id) newErrors.department_id = "Department is required";
    } else if (step === 2) {
      if (!formData.phone) newErrors.phone = "Phone is required";
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.bank_account_details) newErrors.bank_account_details = "Bank account details are required";
      if (!formData.pan_number) newErrors.pan_number = "PAN number is required";
      if (!formData.pf_uan_number) newErrors.pf_uan_number = "PF/UAN number is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    if (step < 4) {
      setStep(step + 1);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      const res = await axios.post(
        `${BASE_URL}backend/api/employees/reg_employee.php`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const result = res.data;

      if (result.success) {
        handleClose();
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          username: "",
          department_id: "",
          address: "",
          emergency_name: "",
          emergency_phone: "",
          emergency_relation: "",
          certificate: null,
          experience: null,
          password: "",
          date_of_birth: "",
          employment_type: "full-time",
          designation: "",
          bank_account_details: "",
          pan_number: "",
          pf_uan_number: "",
        });
        setStep(1);
      } else {
        setSubmitError(result.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setSubmitError("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Register New Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-1">
        <div className="mb-4">
          <ProgressBar now={(step / 4) * 100} className="mb-2" style={{ height: "6px" }} />
          <div className="d-flex justify-content-between text-muted small">
            <span className={step >= 1 ? "fw-bold text-primary" : ""}>Personal Info</span>
            <span className={step >= 2 ? "fw-bold text-primary" : ""}>Contact</span>
            <span className={step >= 3 ? "fw-bold text-primary" : ""}>Emergency</span>
            <span className={step >= 4 ? "fw-bold text-primary" : ""}>Documents</span>
          </div>
        </div>

        {submitError && <Alert variant="danger">{submitError}</Alert>}

        <Form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="row g-3">
              <Form.Group className="col-md-6">
                <Form.Label><FiUser className="me-2" /> First Name</Form.Label>
                <Form.Control
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  isInvalid={!!errors.first_name}
                />
                <Form.Control.Feedback type="invalid">{errors.first_name}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="col-md-6">
                <Form.Label><FiUser className="me-2" /> Last Name</Form.Label>
                <Form.Control
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  isInvalid={!!errors.last_name}
                />
                <Form.Control.Feedback type="invalid">{errors.last_name}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="col-md-6">
                <Form.Label><FiUser className="me-2" /> Username</Form.Label>
                <Form.Control
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="col-md-6">
                <Form.Label><FiLock className="me-2" /> Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                <div className="text-warning small mt-1">
                  Password must include at least one uppercase letter and one special character.
                </div>
              </Form.Group>

              <Form.Group className="col-md-6">
                <Form.Label><FiUsers className="me-2" /> Department</Form.Label>
                <Form.Select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleInputChange}
                  isInvalid={!!errors.department_id}
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.department_id}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="col-md-6">
                <Form.Label><FiUser className="me-2" /> Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  isInvalid={!!errors.date_of_birth}
                />
                <Form.Control.Feedback type="invalid">{errors.date_of_birth}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="col-md-6">
                <Form.Label><FiBriefcase className="me-2" /> Designation</Form.Label>
                <Form.Control
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  isInvalid={!!errors.designation}
                />
                <Form.Control.Feedback type="invalid">{errors.designation}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="col-md-6">
                <Form.Label><FiBriefcase className="me-2" /> Employment Type</Form.Label>
                <Form.Select
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleInputChange}
                  isInvalid={!!errors.employment_type}
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="intern">Intern</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.employment_type}</Form.Control.Feedback>
              </Form.Group>
            </div>
          )}

          {step === 2 && (
            <div className="row g-3">
              <Form.Group className="col-md-6">
                <Form.Label><FiPhone className="me-2" /> Phone</Form.Label>
                <Form.Control
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  isInvalid={!!errors.phone}
                />
                <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="col-md-6">
                <Form.Label><FiMail className="me-2" /> Email</Form.Label>
                <Form.Control
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="col-12">
                <Form.Label><FiHome className="me-2" /> Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  isInvalid={!!errors.address}
                />
                <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="col-md-4">
                <Form.Label><FiDollarSign className="me-2" /> Bank Account Details</Form.Label>
                <Form.Control
                  type="text"
                  name="bank_account_details"
                  value={formData.bank_account_details}
                  onChange={handleInputChange}
                  isInvalid={!!errors.bank_account_details}
                />
                <Form.Control.Feedback type="invalid">{errors.bank_account_details}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="col-md-4">
                <Form.Label><FiDollarSign className="me-2" /> PAN Number</Form.Label>
                <Form.Control
                  type="text"
                  name="pan_number"
                  value={formData.pan_number}
                  onChange={handleInputChange}
                  isInvalid={!!errors.pan_number}
                />
                <Form.Control.Feedback type="invalid">{errors.pan_number}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="col-md-4">
                <Form.Label><FiDollarSign className="me-2" /> PF / UAN Number</Form.Label>
                <Form.Control
                  type="text"
                  name="pf_uan_number"
                  value={formData.pf_uan_number}
                  onChange={handleInputChange}
                  isInvalid={!!errors.pf_uan_number}
                />
                <Form.Control.Feedback type="invalid">{errors.pf_uan_number}</Form.Control.Feedback>
              </Form.Group>
            </div>
          )}

          {step === 3 && (
            <div className="row g-3">
              <Form.Group className="col-md-6">
                <Form.Label>Emergency Contact Name</Form.Label>
                <Form.Control
                  name="emergency_name"
                  value={formData.emergency_name}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="col-md-6">
                <Form.Label>Emergency Phone</Form.Label>
                <Form.Control
                  name="emergency_phone"
                  value={formData.emergency_phone}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="col-12">
                <Form.Label>Relationship</Form.Label>
                <Form.Control
                  name="emergency_relation"
                  value={formData.emergency_relation}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </div>
          )}

          {step === 4 && (
            <div className="row g-3">
              <Form.Group className="col-md-6">
                <Form.Label><FiUpload className="me-2" /> Certificate</Form.Label>
                <Form.Control type="file" name="certificate" onChange={handleFileChange} />
                {formData.certificate && (
                  <div className="small mt-2 text-muted">Selected: {formData.certificate.name}</div>
                )}
              </Form.Group>

              <Form.Group className="col-md-6">
                <Form.Label><FiUpload className="me-2" /> Experience</Form.Label>
                <Form.Control type="file" name="experience" onChange={handleFileChange} />
                {formData.experience && (
                  <div className="small mt-2 text-muted">Selected: {formData.experience.name}</div>
                )}
              </Form.Group>
            </div>
          )}

          <div className="d-flex justify-content-between mt-4">
            <Button variant="outline-secondary" onClick={step === 1 ? handleClose : handleBack} disabled={isSubmitting}>
              {step === 1 ? "Cancel" : "Back"}
            </Button>
            <Button variant={step === 4 ? "primary" : "outline-primary"} type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner animation="border" size="sm" className="me-2" />}
              {step === 4 ? "Complete Registration" : "Next"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EmployeeRegistrationModal;
