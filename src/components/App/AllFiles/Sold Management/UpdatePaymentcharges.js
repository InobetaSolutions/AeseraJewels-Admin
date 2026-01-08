import React, { useState, useEffect } from "react";
import { Card, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

export default function UpdateContact() {
  const navigate = useNavigate();
  const location = useLocation();
  const contact = location.state;

  const [formData, setFormData] = useState({
    _id: "",
    mobile: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (contact) {
      setFormData({
        _id: contact._id,
        mobile: contact.value || "",
      });
    }
  }, [contact]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setFormData({ ...formData, [name]: value });
    setError("");
  };

  // ✅ Update Payment Gateway Charges
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d+$/.test(formData.mobile)) {
      setError("Value must be numeric.");
      return;
    }

    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/updatePaymentGatewayCharges",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: formData._id,
            value: Number(formData.mobile),
          }),
        }
      );

      if (response.ok) {
        alert("✅ Payment gateway charges updated successfully!");
        navigate(`${process.env.PUBLIC_URL}/app/PaymentCharges`);
      } else {
        alert("❌ Failed to update payment gateway charges.");
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ An error occurred while updating.");
    }
  };

  // ✅ Delete Payment Gateway Charges
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/deletePaymentGatewayCharges",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: formData._id }),
        }
      );

      if (response.ok) {
        alert("🗑 Payment gateway charges deleted successfully!");
        navigate(`${process.env.PUBLIC_URL}/app/PaymentCharges`);
      } else {
        alert("❌ Failed to delete payment gateway charges.");
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ An error occurred while deleting.");
    }
  };

  return (
    <Card>
      <Card.Body>
        <div
          className="card-title main-content-label"
          style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
        >
          Update PaymentCharges
        </div>

        <Form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
          <Form.Group className="mb-3">
            <Form.Label>Value</Form.Label>
            <Form.Control
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter value"
              required
            />
            {error && <small style={{ color: "red" }}>{error}</small>}
          </Form.Group>

          <button
            type="submit"
            style={{
              backgroundColor: "#082038",
              border: "1px solid #082038",
              color: "#fff",
              padding: "0.375rem 0.75rem",
              borderRadius: "0.25rem",
              cursor: "pointer",
              marginRight: "0.5rem",
            }}
          >
            Update
          </button>

          <button
            type="button"
            onClick={handleDelete}
            style={{
              backgroundColor: "#dc3545",
              border: "1px solid #dc3545",
              color: "#fff",
              padding: "0.375rem 0.75rem",
              borderRadius: "0.25rem",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </Form>
      </Card.Body>
    </Card>
  );
}
