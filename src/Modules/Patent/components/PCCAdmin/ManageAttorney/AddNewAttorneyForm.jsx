import React, { useState } from "react";
import { TextInput, Button, Title } from "@mantine/core";
import {
  UserCircle,
  Briefcase,
  Envelope,
  Phone,
  ArrowLeft,
} from "phosphor-react";
import PropTypes from "prop-types";
import "../../../style/Pcc_Admin/NewAttorneyForm.css";

function NewAttorneyForm({ onSubmit, onBack }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    firm_name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="new-attorney-form-container">
      <div className="new-attorney-form-header">
        <Title order={2} className="new-attorney-form-title">
          Add New Attorney
        </Title>
        <Button
          variant="subtle"
          leftIcon={<ArrowLeft size={20} weight="bold" />}
          onClick={onBack}
          className="new-attorney-back-btn"
        >
          Back
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="new-attorney-form-content">
        <div className="new-attorney-form-section">
          <div className="new-attorney-form-field">
            <div className="new-attorney-form-label">
              <UserCircle size={20} className="new-attorney-form-icon" />
              <span>Attorney Name</span>
            </div>
            <TextInput
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="new-attorney-form-input"
            />
          </div>

          <div className="new-attorney-form-field">
            <div className="new-attorney-form-label">
              <Envelope size={20} className="new-attorney-form-icon" />
              <span>Email</span>
            </div>
            <TextInput
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="new-attorney-form-input"
            />
          </div>
        </div>

        <div className="new-attorney-form-section">
          <div className="new-attorney-form-field">
            <div className="new-attorney-form-label">
              <Phone size={20} className="new-attorney-form-icon" />
              <span>Phone Number</span>
            </div>
            <TextInput
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="new-attorney-form-input"
            />
          </div>

          <div className="new-attorney-form-field">
            <div className="new-attorney-form-label">
              <Briefcase size={20} className="new-attorney-form-icon" />
              <span>Law Firm</span>
            </div>
            <TextInput
              name="firm_name"
              value={formData.firm_name}
              onChange={handleChange}
              className="new-attorney-form-input"
            />
          </div>
        </div>

        <div className="new-attorney-form-footer">
          <Button
            type="submit"
            variant="filled"
            color="blue"
            className="new-attorney-form-submit-btn"
          >
            Add Attorney
          </Button>
        </div>
      </form>
    </div>
  );
}

NewAttorneyForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default NewAttorneyForm;
