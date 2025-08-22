import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { API_URL } from "../../../../service";

const CreateBanner = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    offer: "",
    link: "",
    buttonName: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer {{Authorization}}");

    const addbanner = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({ ...formData, type: "Banner", image: "N/A", service_id: "" }),
      redirect: "follow",
    };

    try {
      const response = await fetch(API_URL + "addbanner");
      const result = await response.json();
      
      if (result.status === 200) {
        setSuccess("Banner created successfully!");
        setFormData({ title: "", description: "", offer: "", link: "", buttonName: "" });
      } else {
        setError("Failed to create banner.");
      }
    } catch (err) {
      setError("Error creating banner.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-primary mb-4">Create Banner</h3>
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control type="text" name="description" value={formData.description} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Offer</Form.Label>
          <Form.Control type="text" name="offer" value={formData.offer} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Link</Form.Label>
          <Form.Control type="text" name="link" value={formData.link} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Button Name</Form.Label>
          <Form.Control type="text" name="buttonName" value={formData.buttonName} onChange={handleChange} required />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : "Create Banner"}
        </Button>
      </Form>
    </div>
  );
};

export default CreateBanner;
