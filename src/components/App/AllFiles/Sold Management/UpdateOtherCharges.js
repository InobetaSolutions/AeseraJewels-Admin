
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

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "mobile") {
//       // Allow only numbers
//       if (!/^\d*$/.test(value)) return;

//       // Restrict to max 10 digits
//       if (value.length > 10) return;
//     }

//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//     setError("");
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate mobile number
//     if (!/^\d{10}$/.test(formData.mobile)) {
//       setError("Mobile number must be exactly 10 digits.");
//       return;
//     }

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
//         alert("✅ Contact updated successfully!");
//         navigate(`${process.env.PUBLIC_URL}/app/ContactManagement`);
//       } else {
//         alert("❌ Failed to update contact.");
//       }
//     } catch (error) {
//       console.error("Error updating contact:", error);
//       alert("⚠️ An error occurred while updating contact.");
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
//               placeholder="Enter 10 digit mobile number"
//               required
//             />
//             {error && <small style={{ color: "red" }}>{error}</small>}
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
  };

  // 🔹 Update Other Charges
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d+$/.test(formData.mobile)) {
      setError("Value must be numeric.");
      return;
    }

    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/UpdateOtherCharges",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: formData._id,
            value: Number(formData.mobile),
          }),
        }
      );

      if (response.ok) {
        alert("✅ Other charges updated successfully!");
        navigate(`${process.env.PUBLIC_URL}/app/OtherCharges`);
      } else {
        alert("❌ Failed to update other charges.");
      }
    } catch (error) {
      console.error("Error updating:", error);
      alert("⚠️ An error occurred while updating.");
    }
  };

  // 🔹 Delete Other Charges
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/deleteOtherCharges",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: formData._id }),
        }
      );

      if (response.ok) {
        alert("🗑 Other charges deleted successfully!");
        navigate(`${process.env.PUBLIC_URL}/app/OtherCharges`);
      } else {
        alert("❌ Failed to delete.");
      }
    } catch (error) {
      console.error("Error deleting:", error);
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
          Update OtherCharges
        </div>

        <Form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
          

          <Form.Group className="mb-3">
            <Form.Label>Mobile</Form.Label>
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
