import React, { useState } from "react";
import { Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function AddContact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    value: "",
  });
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "value") {
      // Allow only numbers
      if (!/^\d*$/.test(value)) return;

      // Restrict to max 10 digits
      if (value.length > 10) return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{1,10}$/.test(formData.value)) {
      setError("Value must be numeric.");
      return;
    }

    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/createPaymentGatewayCharges",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            value: Number(formData.value),
          }),
        }
      );

      const result = await response.json();
      console.log("Create Payment Gateway Charges Response:", result);

      alert("✅ Payment gateway charges added successfully!");
      navigate(`${process.env.PUBLIC_URL}/app/PaymentCharges`);
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Failed to add payment gateway charges");
    }
  };

  return (
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 style={{ color: "#082038" }}>Add PaymentCharges</h5>
          <button
            style={{
              backgroundColor: "#082038",
              borderColor: "#082038",
              color: "#fff",
              boxShadow: "none",
            }}
            onClick={() =>
              navigate(`${process.env.PUBLIC_URL}/app/OtherCharges`)
            }
          >
            Back
          </button>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Add Value</Form.Label>
            <Form.Control
              type="text"
              name="value"
              value={formData.value}
              onChange={handleChange}
              required
              placeholder="Enter value"
            />
            {error && <small style={{ color: "red" }}>{error}</small>}
          </Form.Group>

          <button
            type="submit"
            style={{
              backgroundColor: "#082038",
              borderColor: "#082038",
              color: "#fff",
              boxShadow: "none",
            }}
          >
            Add PaymentCharges
          </button>
        </Form>
      </Card.Body>
    </Card>
  );
}
