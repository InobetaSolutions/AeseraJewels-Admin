// import React, { useState } from "react";
// import { Card, Form } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// export default function AddContact() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: "",
//     mobile: "",
//   });

//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/createSupport",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(formData),
//         }
//       );

//       const result = await response.json();
//       console.log("Create Support Response:", result);

//       alert("✅ Contact added successfully!");
//       navigate(`${process.env.PUBLIC_URL}/app/Contact`);
//     } catch (err) {
//       console.error("Error:", err);
//       alert("❌ Failed to add contact");
//     }
//   };

//   return (
//     <Card>
//       <Card.Body>
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5 style={{ color: "#082038" }}>Add Contact</h5>
//           <button
//             style={{
//               backgroundColor: "#082038",
//               borderColor: "#082038",
//               color: "#fff",
//               boxShadow: "none",
//             }}
//             onClick={() =>
//               navigate(`${process.env.PUBLIC_URL}/app/ContactManagement`)
//             }
//           >
//             Back
//           </button>
//         </div>

//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3">
//             <Form.Label>Email</Form.Label>
//             <Form.Control
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Mobile Number</Form.Label>
//             <Form.Control
//               type="text"
//               name="mobile"
//               value={formData.mobile}
//               onChange={handleChange}
//               required
//             />
//           </Form.Group>

//           <button
//             type="submit"
//             style={{
//               backgroundColor: "#082038",
//               borderColor: "#082038",
//               color: "#fff",
//               boxShadow: "none",
//             }}
//           >
//             Add Contact
//           </button>
//         </Form>
//       </Card.Body>
//     </Card>
//   );
// }

import React, { useState } from "react";
import { Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function AddContact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
  });
  const [error, setError] = useState("");

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

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate mobile number
    if (!/^\d{10}$/.test(formData.mobile)) {
      setError("Mobile number must be exactly 10 digits.");
      return;
    }

    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/createSupport",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      console.log("Create Support Response:", result);

      alert("✅ Contact added successfully!");
      navigate(`${process.env.PUBLIC_URL}/app/Contact`);
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Failed to add contact");
    }
  };

  return (
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 style={{ color: "#082038" }}>Add Contact</h5>
          <button
            style={{
              backgroundColor: "#082038",
              borderColor: "#082038",
              color: "#fff",
              boxShadow: "none",
            }}
            onClick={() =>
              navigate(`${process.env.PUBLIC_URL}/app/ContactManagement`)
            }
          >
            Back
          </button>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              placeholder="Enter 10 digit mobile number"
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
            Add Contact
          </button>
        </Form>
      </Card.Body>
    </Card>
  );
}
