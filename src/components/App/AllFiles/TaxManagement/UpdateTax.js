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
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (contact) {
//       setFormData({
//         _id: contact._id,
//         email: contact.email || "",
//         mobile: contact.mobile || "",
//       });
//     }
//   }, [contact]);

 

 

//   return (
//     <Card>
//       <Card.Body>
//         <div
//           className="card-title main-content-label"
//           style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
//         >
//           Update Amount
//         </div>
//         <Form style={{ marginTop: "1rem" }}>
//           <Form.Group className="mb-3">
//             <Form.Label>Amount</Form.Label>
//             <Form.Control
//               type="number"
//               name="number"
//               value={formData.email}
             
//               placeholder="Enter email"
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

// import React, { useState, useEffect } from "react";
// import { Card, Form } from "react-bootstrap";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function UpdateTax() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const contact = location.state; // record passed from Delivery page

//   const [formData, setFormData] = useState({
//     _id: "",
//     amount: "",
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (contact) {
//       setFormData({
//         _id: contact._id,
//         amount: contact.amount || "",
//       });
//     }
//   }, [contact]);

//   // handle input change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

 
//   return (
//     <Card>
//       <Card.Body>
//         <div
//           className="card-title main-content-label"
//           style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
//         >
//           Update Percentage
//         </div>

//         <Form style={{ marginTop: "1rem" }} onSubmit={handleSubmit}>
//           <Form.Group className="mb-3">
//             <Form.Label>Percentage</Form.Label>
//             <Form.Control
//               type="number"
//               name="amount"
//               value={formData.amount}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>

//           {error && <p style={{ color: "red" }}>{error}</p>}

//           <button
//             type="submit"
//             disabled={loading}
//             style={{
//               backgroundColor: "#082038",
//               border: "1px solid #082038",
//               color: "#fff",
//               padding: "0.375rem 0.75rem",
//               borderRadius: "0.25rem",
//               cursor: "pointer",
//             }}
//           >
//             {loading ? "Updating..." : "Update"}
//           </button>
//         </Form>
//       </Card.Body>
//     </Card>
//   );
// }

import React, { useState, useEffect } from "react";
import { Card, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

export default function UpdateTax() {
  const navigate = useNavigate();
  const location = useLocation();
  const contact = location.state; // record passed from Delivery page

  const [formData, setFormData] = useState({
    _id: "",
    amount: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contact) {
      setFormData({
        _id: contact._id,
        amount: contact.percentage || "",
      });
    }
  }, [contact]);

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ handle form submit with API integration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiI2MzgxNjE1MDUyIiwibmFtZSI6InBhcnRoYSIsImlhdCI6MTc1ODM3MDg4OCwiZXhwIjoxNzU4NTQzNjg4fQ.I94Acb9e6bL9g-4i6lruzbKBPpUiVp8R9HAPhvqnuZg"
      );

      const raw = JSON.stringify({
        percentage: Number(formData.amount), // backend expects "percentage"
      });

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
      };

      const response = await fetch(
        "http://13.204.96.244:3000/api/updateTax",
        requestOptions
      );
      const result = await response.json();
      console.log(result);

      if (result.status) {
        alert("Percentage updated successfully!");
        navigate(-1); // go back after success
      } else {
        setError(result.message || "Failed to update percentage");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Body>
        <div
          className="card-title main-content-label"
          style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
        >
          Update Percentage
        </div>

        <Form style={{ marginTop: "1rem" }} onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Percentage</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#082038",
              border: "1px solid #082038",
              color: "#fff",
              padding: "0.375rem 0.75rem",
              borderRadius: "0.25rem",
              cursor: "pointer",
            }}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </Form>
      </Card.Body>
    </Card>
  );
}
