import React, { Fragment, useEffect, useState } from "react";
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const EditIndustry = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    image: null,
    tagid: "",
    description: "",
    goldtype: "",
    price: "",
    grams:"",
  });

  useEffect(() => {
    if (location.state?.productdata) {
      const data = location.state.productdata;
      setProduct(data);
      setFormData({
        image: data.image || null,
        tagid: data.tagid || "",
        description: data.description || "",
        grams:data.grams|| "",
        goldtype: data.goldtype || "",
        price: data.price || "",
      });
      if (data.image) {
        setImagePreview(`http://13.204.96.244:3000/api/uploads/${data.image}`);
      }
      setLoading(false);
    } else if (id) {
      fetch(`http://13.204.96.244:3000/api/get-product/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?._id) {
            setProduct(data);
            setFormData({
              image: data.image || null,
              tagid: data.tagid || "",
              description: data.description || "",
               grams:data.grams|| "",
              goldtype: data.goldtype || "",
              price: data.price || "",
            });
            if (data.image) {
              setImagePreview(
                `http://13.204.96.244:3000/api/uploads/${data.image}`
              );
            }
          } else {
            setError("Product not found");
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load product");
          setLoading(false);
        });
    } else {
      setError("No product data provided");
      setLoading(false);
    }
  }, [location.state, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = newFileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    // Reset to original values
    setFormData({
      image: product.image || null,
      tagid: product.tagid || "",
      description: product.description || "",
       grams:data.grams|| "",
      goldtype: product.goldtype || "",
      price: product.price || "",
    });
    
    if (product.image) {
      setImagePreview(`http://13.204.96.244:3000/api/uploads/${product.image}`);
    } else {
      setImagePreview(null);
    }
    
    setEditMode(false);
  };

  const handleDelete = async () => {
    const productId = product?._id || id;
    if (!productId) {
      setError("Missing product ID");
      return;
    }
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(
          `http://13.204.96.244:3000/api/delete-products/${productId}`,
          { method: "DELETE" }
        );
        const result = await response.json();
        alert(result.message || "Product deleted successfully");
        navigate(`${process.env.PUBLIC_URL}/app/CatalogManagment`);
      } catch (err) {
        setError("Error deleting product");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productId = product?._id || id;
    if (!productId) {
      setError("Missing product ID");
      return;
    }
    if (window.confirm("Are you sure you want to update this product?")) {
      try {
        const formDataToSend = new FormData();
        if (formData.image instanceof File) {
          formDataToSend.append("image", formData.image);
        }
        formDataToSend.append("tagid", formData.tagid || "1234");
        formDataToSend.append("description", formData.description || "");
        formDataToSend.append("goldtype", formData.goldtype || "999");
        formDataToSend.append("price", formData.price || "0");
        formDataToSend.append("grams", formData.grams || "");

        const response = await fetch(
          `http://13.204.96.244:3000/api/update-products/${productId}`,
          { method: "PUT", body: formDataToSend }
        );
        const result = await response.json();
        alert(result.message || "Product updated successfully");
        setEditMode(false);
        navigate(`${process.env.PUBLIC_URL}/app/CatalogManagment`);
      } catch (err) {
        setError("Error updating product");
      }
    }
  };

  if (loading) return <Spinner animation="border" className="m-4" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!product) return <Alert variant="info">No product data found</Alert>;

  return (
    <Fragment>
      <Card className="shadow-sm border-0">
        <Card.Body>
          {/* Header - Moved outside the form */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h4 className="mb-0 text-primary fw-bold">Edit Product</h4>
            <div className="d-flex gap-2">
              {!editMode ? (
                <>
                  <Button variant="warning" type="button" onClick={handleEdit}>
                    Edit
                  </Button>
                  <Button variant="danger" type="button" onClick={handleDelete}>
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="primary"
                    type="button"
                    onClick={handleSubmit}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Form */}
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    readOnly={!editMode}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tag ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="tagid"
                    value={formData.tagid}
                    onChange={handleChange}
                    readOnly={!editMode}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Gold Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="goldtype"
                    value={formData.goldtype}
                    onChange={handleChange}
                    readOnly={!editMode}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    readOnly={!editMode}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>grams</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="grams"
                    value={formData.grams}
                    onChange={handleChange}
                    readOnly={!editMode}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Product Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={!editMode}
                  />
                  {imagePreview && (
                    <div className="mt-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="img-thumbnail"
                        style={{ width: "150px", height: "150px" }}
                      />
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default EditIndustry;