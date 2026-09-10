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
import { useFormik } from "formik";
import * as Yup from "yup";
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

const EmployeeRegistrationModal = ({ show, handleClose }) => {
  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL;

  // Form validation schemas for each step
  const stepSchemas = [
    Yup.object().shape({
      first_name: Yup.string().required("First name is required"),
      last_name: Yup.string().required("Last name is required"),
      username: Yup.string().required("Username is required"),
      date_of_birth: Yup.date().required("Date of birth is required"),
      employment_type: Yup.string().required("Employment type is required"),
      designation: Yup.string().required("Designation is required"),
      password: Yup.string()
        .required("Password is required")
        .matches(/^(?=.*[A-Z])(?=.*[\W_]).+$/, "Must contain at least one uppercase letter and one special character"),
      department_id: Yup.string().required("Department is required"),
    }),
    Yup.object().shape({
      phone: Yup.string().required("Phone is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      address: Yup.string().required("Address is required"),
      bank_account_details: Yup.string().required("Bank account details are required"),
      pan_number: Yup.string().required("PAN number is required"),
      pf_uan_number: Yup.string().required("PF/UAN number is required"),
    }),
    Yup.object().shape({
      emergency_name: Yup.string(),
      emergency_phone: Yup.string(),
      emergency_relation: Yup.string(),
    }),
    Yup.object().shape({
      certificate: Yup.mixed(),
      experience: Yup.mixed(),
    }),
  ];

  const formik = useFormik({
    initialValues: {
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
      image: null,
      certificate: null,
      experience: null,
      password: "",
      date_of_birth: "",
      employment_type: "full-time",
      designation: "",
      bank_account_details: "",
      pan_number: "",
      pf_uan_number: "",
    },
    validationSchema: stepSchemas[step - 1],
    onSubmit: async (values) => {
      if (step < 4) {
        setStep(step + 1);
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const data = new FormData();
        for (let key in values) {
          data.append(key, values[key]);
        }

        const res = await fetch(
          `${BASE_URL}backend/api/employees/reg_employee.php`,
          {
            method: "POST",
            credentials: "include",
            body: data,
          }
        );

        const result = await res.json();

        if (result.success) {
          handleClose();
          formik.resetForm();
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
    },
  });

  useEffect(() => {
    if (show) {
      const fetchDepartments = async () => {
        try {
          const res = await fetch(
            `${BASE_URL}backend/api/department/fetctDepartment.php`,
            {
              credentials: "include",
            }
          );
          const result = await res.json();
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

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    formik.setFieldValue(name, file);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      backdrop="static"
      centered
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Register New Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-1">
        <div className="mb-4">
          <ProgressBar
            now={(step / 4) * 100}
            className="mb-2"
            style={{ height: "6px" }}
          />
          <div className="d-flex justify-content-between text-muted small">
            <span className={step >= 1 ? "fw-bold text-primary" : ""}>
              Personal Info
            </span>
            <span className={step >= 2 ? "fw-bold text-primary" : ""}>
              Contact
            </span>
            <span className={step >= 3 ? "fw-bold text-primary" : ""}>
              Emergency
            </span>
            <span className={step >= 4 ? "fw-bold text-primary" : ""}>
              Documents
            </span>
          </div>
        </div>

        {submitError && (
          <Alert variant="danger" className="mb-4">
            {submitError}
          </Alert>
        )}

        <Form onSubmit={formik.handleSubmit}>
          {step === 1 && (
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FiUser className="me-2" /> First Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    placeholder="John"
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.first_name && formik.errors.first_name
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.first_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FiUser className="me-2" /> Last Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    placeholder="Doe"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.last_name && formik.errors.last_name
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.last_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FiUser className="me-2" /> Username
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="johndoe"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.username && formik.errors.username
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.username}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FiLock className="me-2" /> Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Choose a password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.password && formik.errors.password
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.password}
                  </Form.Control.Feedback>
                  <div className="text-warning small mt-1">
                    Password must include at least one uppercase letter and one special character.
                  </div>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FiUsers className="me-2" /> Department
                  </Form.Label>
                  <Form.Select
                    name="department_id"
                    value={formik.values.department_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.department_id &&
                      formik.errors.department_id
                    }
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.department_id}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FiUser className="me-2" /> Date of Birth
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="date_of_birth"
                    value={formik.values.date_of_birth}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.date_of_birth && formik.errors.date_of_birth
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.date_of_birth}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FiBriefcase className="me-2" /> Designation
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="designation"
                    placeholder="Software Engineer"
                    value={formik.values.designation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.designation && formik.errors.designation
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.designation}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FiBriefcase className="me-2" /> Employment Type
                  </Form.Label>
                  <Form.Select
                    name="employment_type"
                    value={formik.values.employment_type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.employment_type && formik.errors.employment_type
                    }
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="intern">Intern</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.employment_type}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FiPhone className="me-2" /> Phone
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.phone && formik.errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FiMail className="me-2" /> Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="john.doe@example.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.email && formik.errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-12">
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FiHome className="me-2" /> Address
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address"
                    placeholder="123 Main St, City, Country"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.address && formik.errors.address}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.address}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label className="d-flex align-item-center">
                    <FiUpload className="me-2" />Photo
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  {formik.values.image &&(
                    <div className="mt-2 small text-muted">
                      Select: {formik.values.image.name}
                    </div>
                  )}
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FiDollarSign className="me-2" /> Bank Account Details
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="bank_account_details"
                    placeholder="Account number"
                    value={formik.values.bank_account_details}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.bank_account_details && formik.errors.bank_account_details
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.bank_account_details}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FiDollarSign className="me-2" /> PAN Number
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="pan_number"
                    placeholder="ABCDE1234F"
                    value={formik.values.pan_number}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.pan_number && formik.errors.pan_number
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.pan_number}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FiDollarSign className="me-2" /> PF / UAN Number
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="pf_uan_number"
                    placeholder="UAN number"
                    value={formik.values.pf_uan_number}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.pf_uan_number && formik.errors.pf_uan_number
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.pf_uan_number}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Emergency Contact Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="emergency_name"
                    placeholder="Jane Smith"
                    value={formik.values.emergency_name}
                    onChange={formik.handleChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Emergency Contact Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="emergency_phone"
                    placeholder="+1 (555) 987-6543"
                    value={formik.values.emergency_phone}
                    onChange={formik.handleChange}
                  />
                </Form.Group>
              </div>
              <div className="col-12">
                <Form.Group>
                  <Form.Label>Relationship</Form.Label>
                  <Form.Control
                    type="text"
                    name="emergency_relation"
                    placeholder="Spouse"
                    value={formik.values.emergency_relation}
                    onChange={formik.handleChange}
                  />
                </Form.Group>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FiUpload className="me-2" /> Certificate (PDF)
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="certificate"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                  />
                  {formik.values.certificate && (
                    <div className="mt-2 small text-muted">
                      Selected: {formik.values.certificate.name}
                    </div>
                  )}
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FiUpload className="me-2" /> Experience (PDF)
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="experience"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                  />
                  {formik.values.experience && (
                    <div className="mt-2 small text-muted">
                      Selected: {formik.values.experience.name}
                    </div>
                  )}
                </Form.Group>
              </div>
            </div>
          )}

          <div className="d-flex justify-content-between mt-4">
            <Button
              variant="outline-secondary"
              onClick={step === 1 ? handleClose : handleBack}
              disabled={isSubmitting}
            >
              {step === 1 ? "Cancel" : "Back"}
            </Button>

            <Button
              variant={step === 4 ? "primary" : "outline-primary"}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Spinner animation="border" size="sm" className="me-2" />
              )}
              {step === 4 ? "Complete Registration" : "Next"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EmployeeRegistrationModal;
