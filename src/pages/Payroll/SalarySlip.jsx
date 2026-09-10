import React, { useState, useEffect } from "react";
import { Card, Button, Alert, Spinner, Table, Badge } from "react-bootstrap";
import { FiDownload, FiPrinter } from "react-icons/fi";

const formatCurrency = (value) => {
  return (value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const SalarySlip = ({ employeeId: propEmployeeId, month: propMonth, year: propYear }) => {
  const [slip, setSlip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const BASE_URL = import.meta.env.VITE_API_URL;

  const currentMonth = propMonth || new Date().getMonth() + 1;
  const currentYear = propYear || new Date().getFullYear();

  useEffect(() => {
    fetchSalarySlip();
  }, []);

  const fetchSalarySlip = async () => {
    setLoading(true);
    setError("");

    try {
      let url = `${BASE_URL}backend/api/payroll/salary_slip.php?month=${currentMonth}&year=${currentYear}`;
      if (propEmployeeId) {
        url += `&employee_id=${propEmployeeId}`;
      }

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load salary slip");
      }

      setSlip(data.slip);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="info" className="mt-4">
        {error}
      </Alert>
    );
  }

  if (!slip) {
    return (
      <Alert variant="info" className="mt-4">
        Salary slip is not available for this pay period.
      </Alert>
    );
  }

  return (
    <div className="salary-slip-container">
      <div className="d-flex justify-content-between align-items-center mb-4 no-print">
        <h4 className="fw-bold mb-0">Salary Slip</h4>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={handlePrint}>
            <FiPrinter className="me-2" />
            Print / Save PDF
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-0 salary-slip-document" id="salary-slip-print-area">
        <Card.Body className="p-4 p-md-5">
          <div className="text-center mb-4 pb-3 border-bottom">
            <h3 className="fw-bold text-primary mb-1">Desk.in</h3>
            <p className="text-muted mb-0">Employee Management System</p>
            <h5 className="mt-3 fw-semibold">Salary Slip</h5>
            <p className="text-muted mb-0">{slip.pay_period}</p>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <h6 className="text-uppercase text-muted small fw-bold mb-2">Employee Information</h6>
              <Table borderless size="sm" className="mb-0">
                <tbody>
                  <tr>
                    <td className="fw-semibold ps-0" style={{ width: "140px" }}>Employee Name</td>
                    <td>{slip.employee_name}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold ps-0">Employee ID</td>
                    <td>
                      <Badge bg="primary">{slip.employee_id}</Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-semibold ps-0">Department</td>
                    <td>{slip.department}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold ps-0">Designation</td>
                    <td>{slip.designation}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
            <div className="col-md-6">
              <h6 className="text-uppercase text-muted small fw-bold mb-2">Pay Details</h6>
              <Table borderless size="sm" className="mb-0">
                <tbody>
                  <tr>
                    <td className="fw-semibold ps-0" style={{ width: "140px" }}>Pay Period</td>
                    <td>{slip.pay_period}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold ps-0">Generated On</td>
                    <td>{formatDate(slip.generated_at)}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold ps-0">Email</td>
                    <td>{slip.email}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold ps-0">Phone</td>
                    <td>{slip.phone}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>

          <div className="mb-4">
            <h6 className="text-uppercase text-muted small fw-bold mb-3">Salary Breakdown</h6>
            <Table bordered hover responsive className="salary-table">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "40%" }}>Description</th>
                  <th className="text-end" style={{ width: "30%" }}>Amount</th>
                  <th className="text-end" style={{ width: "30%" }}>Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Basic Salary</td>
                  <td className="text-end">{formatCurrency(slip.basic_salary)}</td>
                  <td className="text-end text-success">Earning</td>
                </tr>
                <tr>
                  <td>Bonus</td>
                  <td className="text-end">{formatCurrency(slip.bonus)}</td>
                  <td className="text-end text-success">Earning</td>
                </tr>
                <tr>
                  <td>Overtime</td>
                  <td className="text-end">{formatCurrency(slip.overtime)}</td>
                  <td className="text-end text-success">Earning</td>
                </tr>
                <tr className="table-primary fw-semibold">
                  <td>Gross Salary</td>
                  <td className="text-end">{formatCurrency(slip.gross_salary)}</td>
                  <td className="text-end text-success">Total Earnings</td>
                </tr>
                <tr>
                  <td>Deductions</td>
                  <td className="text-end">{formatCurrency(slip.deduction)}</td>
                  <td className="text-end text-danger">Deduction</td>
                </tr>
                <tr>
                  <td>Late Fine</td>
                  <td className="text-end">{formatCurrency(slip.late_fine)}</td>
                  <td className="text-end text-danger">Deduction</td>
                </tr>
                <tr>
                  <td>Total Deductions</td>
                  <td className="text-end">{formatCurrency(slip.total_deductions)}</td>
                  <td className="text-end text-danger">Total</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="table-success fw-bold">
                  <td className="fs-5">Net Salary</td>
                  <td className="text-end fs-5">{formatCurrency(slip.net_salary)}</td>
                  <td className="text-end text-success">Take Home</td>
                </tr>
              </tfoot>
            </Table>
          </div>

          <div className="text-center mt-4 pt-3 border-top text-muted small">
            <p className="mb-0">
              This is a computer-generated salary slip and does not require a signature.
            </p>
            <p className="mb-0">Desk.in &copy; {new Date().getFullYear()}</p>
          </div>
        </Card.Body>
      </Card>

      <style jsx>{`
        .salary-slip-container {
          max-width: 900px;
          margin: 0 auto;
        }
        .salary-slip-document {
          border: 1px solid #e5e7eb !important;
        }
        .salary-table th,
        .salary-table td {
          padding: 0.75rem 1rem;
        }
        .salary-table thead th {
          border-bottom: 2px solid #dee2e6;
        }
        .salary-table tfoot td {
          border-top: 2px solid #198754 !important;
          border-bottom: 2px solid #198754 !important;
        }

        @media print {
          .no-print {
            display: none !important;
          }
          .salary-slip-container {
            max-width: 100%;
            margin: 0;
          }
          .salary-slip-document {
            border: none !important;
            box-shadow: none !important;
          }
          body {
            background: #fff !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SalarySlip;
