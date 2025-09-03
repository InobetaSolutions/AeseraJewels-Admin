import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Addamc() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tagid: "",
    description: "",
    goldtype: "",
    price: "",
  });
  const [file, setFile] = useState(null);

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    if (file) {
      // ✅ only file + name (no C:/ path!)
      fd.append("image", file, file.name);
    }
    fd.append("tagid", formData.tagid);
    fd.append("description", formData.description);
    fd.append("goldtype", formData.goldtype);
    fd.append("price", formData.price);

    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/create-products",
        {
          method: "POST",
          body: fd,
        }
      );

      const result = await response.json(); // ✅ parse JSON, not just text
      console.log("Create Product Response:", result);

      alert("Product added successfully!");
      navigate(`${process.env.PUBLIC_URL}/app/CatalogManagment`);
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Failed to add product");
    }
  };

  return (
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 style={{ color: "#082038" }}>Add Product</h5>
          {/* <h5 className="text-primary">Add Product</h5> */}
          {/* <Button
            variant="secondary"
            onClick={() =>
              navigate(`${process.env.PUBLIC_URL}/app/CatalogManagment`)
            }
          >
            Back
          </Button> */}
            <button
            style={{
              backgroundColor: "#082038",
              borderColor: "#082038",
              color: "#fff",
              boxShadow: "none",
            }}
          
            onClick={() =>
              navigate(`${process.env.PUBLIC_URL}/app/CatalogManagment`)
            }
          >
            Back
          </button>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tag ID</Form.Label>
            <Form.Control
              type="text"
              name="tagid"
              value={formData.tagid}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Gold Type</Form.Label>
            <Form.Control
              type="text"
              name="goldtype"
              value={formData.goldtype}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
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
            Add Product
          </button>

          {/* <Button type="submit" className="btn-primary">
            Add Product
          </Button> */}
        </Form>
      </Card.Body>
    </Card>
  );
}
