// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Card, Form } from "react-bootstrap";

// export default function UpdateContact() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const contact = location.state; // record passed from Catalog.js

//   const [formData, setFormData] = useState({
//     email: "",
//     mobile: "",
//   });

//   // Prefill form with contact data
//   useEffect(() => {
//     if (contact) {
//       setFormData({
//         email: contact.email || "",
//         mobile: contact.mobile || "",
//       });
//     }
//   }, [contact]);

//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Handle update
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("http://13.204.96.244:3000/api/updateSupport", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const result = await response.json();
//       if (result.success) {
//         alert("Contact updated successfully!");
//         navigate(`${process.env.PUBLIC_URL}/app/Catalog`);
//       } else {
//         alert("Failed to update contact.");
//       }
//     } catch (error) {
//       console.error("Error updating contact:", error);
//     }
//   };

//   return (
//     <Card>
//       <Card.Body>
//         <h4 className="mb-3">Update Contact</h4>
//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3">
//             <Form.Label>Email</Form.Label>
//             <Form.Control
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter email"
//               required
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Mobile</Form.Label>
//             <Form.Control
//               type="text"
//               name="mobile"
//               value={formData.mobile}
//               onChange={handleChange}
//               placeholder="Enter mobile number"
//               required
//             />
//           </Form.Group>

//           <button
//             type="submit"
//             style={{
//               backgroundColor: "#082038",
//               border: "1px solid #082038",
//               color: "#fff",
//               padding: "0.375rem 0.75rem",
//               borderRadius: "0.25rem",
//               cursor: "pointer",
//             }}
//           >
//             Update Contact
//           </button>
//         </Form>
//       </Card.Body>
//     </Card>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { Card, Form } from "react-bootstrap";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function UpdateContact() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const contact = location.state; // record passed from Catalog or ContactManagement

//   const [formData, setFormData] = useState({
//     _id: "",
//     email: "",
//     mobile: "",
//   });

//   useEffect(() => {
//     if (contact) {
//       setFormData({
//         _id: contact._id,
//         email: contact.email || "",
//         mobile: contact.mobile || "",
//       });
//     }
//   }, [contact]);

//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/updateSupport",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData), // includes _id, email, mobile
//         }
//       );

//       if (response.ok) {
//         alert("Contact updated successfully!");
//         // Navigate back to Contact page
//         navigate(`${process.env.PUBLIC_URL}/app/ContactManagement`);
//         // Or use: navigate(-1); to go back to previous page
//       } else {
//         alert("Failed to update contact.");
//       }
//     } catch (error) {
//       console.error("Error updating contact:", error);
//       alert("An error occurred while updating contact.");
//     }
//   };

//   return (
//     <Card>
//       <Card.Body>
//         <div
//           className="card-title main-content-label"
//           style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
//         >
//           Update Contact
//         </div>
//         <Form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
//           <Form.Group className="mb-3">
//             <Form.Label>Email</Form.Label>
//             <Form.Control
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter email"
//               required
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Mobile</Form.Label>
//             <Form.Control
//               type="text"
//               name="mobile"
//               value={formData.mobile}
//               onChange={handleChange}
//               placeholder="Enter mobile number"
//               required
//             />
//           </Form.Group>

//           <button
//             type="submit"
//             style={{
//               backgroundColor: "#082038",
//               border: "1px solid #082038",
//               color: "#fff",
//               padding: "0.375rem 0.75rem",
//               borderRadius: "0.25rem",
//               cursor: "pointer",
//             }}
//           >
//             Update
//           </button>
//         </Form>
//       </Card.Body>
//     </Card>
//   );
// }

import React, { useState, useEffect } from "react";
import { Card, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

export default function UpdateContact() {
  const navigate = useNavigate();
  const location = useLocation();
  const contact = location.state; // record passed from Catalog or ContactManagement

  const [formData, setFormData] = useState({
    _id: "",
    email: "",
    mobile: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (contact) {
      setFormData({
        _id: contact._id,
        email: contact.email || "",
        mobile: contact.mobile || "",
      });
    }
  }, [contact]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate mobile number
    if (!/^\d{10}$/.test(formData.mobile)) {
      setError("Mobile number must be exactly 10 digits.");
      return;
    }

    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/updateSupport",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData), // includes _id, email, mobile
        }
      );

      if (response.ok) {
        alert("✅ Contact updated successfully!");
        navigate(`${process.env.PUBLIC_URL}/app/ContactManagement`);
      } else {
        alert("❌ Failed to update contact.");
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      alert("⚠️ An error occurred while updating contact.");
    }
  };

  return (
    <Card>
      <Card.Body>
        <div
          className="card-title main-content-label"
          style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
        >
          Update Contact
        </div>
        <Form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mobile</Form.Label>
            <Form.Control
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter 10 digit mobile number"
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
            }}
          >
            Update
          </button>
        </Form>
      </Card.Body>
    </Card>
  );
}
