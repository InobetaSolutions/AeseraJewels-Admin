import React, { useState } from "react";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../../service";

const AddAMC = () => {
  const [amcValue, setAmcValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(API_URL + "AdminAddAMC", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ AMC: amcValue }),
      });

      const result = await response.json();

      if (result.Status === 200 && result.response) {
        setSuccessMessage("AMC added successfully!");
        setAmcValue(""); // Reset input field
        setTimeout(() => {
          navigate("/app/PlanManagement"); // Navigate after success
        }, 1500);
      } else {
        setError("Failed to add AMC.");
      }
    } catch (err) {
      setError("Error while adding AMC.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Body>
        <h3 className="text-primary mb-4">Add AMC</h3>

        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>AMC Value</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter AMC"
              value={amcValue}
              onChange={(e) => setAmcValue(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : "Add AMC"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddAMC;
