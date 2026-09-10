import React, { useState } from "react";
import { Nav, Card, Button, Form, Row, Col } from "react-bootstrap";
import { CashStack, FileEarmarkText } from "react-bootstrap-icons";
import GeneratePayroll from "../../pages/Payroll/GeneratePayroll";
import SalarySlip from "../../pages/Payroll/SalarySlip";

const PayrollContent = ({ activeSubTab, setActiveSubTab, selectedEmployeeId }) => {
  return (
    <div>
      <h2 className="mb-4">Payroll Management</h2>

      <Nav variant="pills" className="mb-4 payroll-sub-nav">
        <Nav.Item>
          <Nav.Link
            active={activeSubTab === "generate"}
            onClick={() => setActiveSubTab("generate")}
            className="d-flex align-items-center"
          >
            <CashStack className="me-2" />
            Generate Payroll
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeSubTab === "salarySlip"}
            onClick={() => setActiveSubTab("salarySlip")}
            className="d-flex align-items-center"
          >
            <FileEarmarkText className="me-2" />
            Salary Slip
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {activeSubTab === "generate" && <GeneratePayroll />}
      {activeSubTab === "salarySlip" && <SalarySlip employeeId={selectedEmployeeId} />}
    </div>
  );
};

export default PayrollContent;
