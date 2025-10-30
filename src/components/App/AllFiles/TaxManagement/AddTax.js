
// import React, { useState } from "react";
// import { Card, Form } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// export default function AddContact() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     amount: "",
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // handle input change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

 

//   return (
//     <Card>
//       <Card.Body>
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5 style={{ color: "#082038" }}>Add Tax</h5>
//           <button
//             style={{
//               backgroundColor: "#082038",
//               borderColor: "#082038",
//               color: "#fff",
//               boxShadow: "none",
//             }}
//             onClick={() => navigate(`${process.env.PUBLIC_URL}/app/Delivery`)}
//           >
//             Back
//           </button>
//         </div>

//         <Form onSubmit={handleSubmit}>
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
//               borderColor: "#082038",
//               color: "#fff",
//               boxShadow: "none",
//               padding: "0.375rem 0.75rem",
//               borderRadius: "0.25rem",
//             }}
//           >
//             {loading ? "Adding..." : "Add Amount"}
//           </button>
//         </Form>
//       </Card.Body>
//     </Card>
//   );
// }

// import React, { useState } from "react";
// import { Card, Form } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// export default function AddTax() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     percentage: "",
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // handle input change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const myHeaders = new Headers();
//       myHeaders.append("Content-Type", "application/json");
//       myHeaders.append(
//         "Authorization",
//         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiI3NDgzNzIwMzM0IiwibmFtZSI6ImthbXBhbGxpIiwiaWF0IjoxNzU4MzY1ODQ2LCJleHAiOjE3NTg1Mzg2NDZ9.7YxtB9naywmxHNF7f0HX0ksKM5ompFsiWNVIaqsSF-s"
//       );

//       const raw = JSON.stringify({
//         percentage: Number(formData.percentage),
//       });

//       const requestOptions = {
//         method: "POST",
//         headers: myHeaders,
//         body: raw,
//         redirect: "follow",
//       };

//       const response = await fetch("http://13.204.96.244:3000/api/createTax", requestOptions);
//       const result = await response.json();
//       console.log("Create Tax Response:", result);

//       if (result.status) {
//         alert("Tax added successfully!");
//         navigate(`${process.env.PUBLIC_URL}/app/Tax`); // back to Tax Management
//       } else {
//         setError(result.message || "Failed to add tax");
//       }
//     } catch (err) {
//       console.error("Error adding tax:", err);
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card>
//       <Card.Body>
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5 style={{ color: "#082038" }}>Add Tax</h5>
//           <button
//             style={{
//               backgroundColor: "#082038",
//               borderColor: "#082038",
//               color: "#fff",
//               boxShadow: "none",
//             }}
//             onClick={() => navigate(`${process.env.PUBLIC_URL}/app/Delivery`)}
//           >
//             Back
//           </button>
//         </div>

//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3">
//             <Form.Label>Percentage</Form.Label>
//             <Form.Control
//               type="number"
//               name="percentage"
//               value={formData.percentage}
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
//               borderColor: "#082038",
//               color: "#fff",
//               boxShadow: "none",
//               padding: "0.375rem 0.75rem",
//               borderRadius: "0.25rem",
//             }}
//           >
//             {loading ? "Adding..." : "Add Percentage"}
//           </button>
//         </Form>
//       </Card.Body>
//     </Card>
//   );
// }



import React, { useState } from "react";
import { Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function AddTax() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    percentage: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        percentage: Number(formData.percentage),
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch("http://13.204.96.244:3000/api/createTax", requestOptions);
      const result = await response.json();
      console.log("Create Tax Response:", result);

      if (result.status) {
        alert("Tax added successfully!");
        navigate(`${process.env.PUBLIC_URL}/app/Tax`); // back to Tax Management
      } else {
        setError(result.message || "Failed to add tax");
      }
    } catch (err) {
      console.error("Error adding tax:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 style={{ color: "#082038" }}>Add Tax</h5>
          <button
            style={{
              backgroundColor: "#082038",
              borderColor: "#082038",
              color: "#fff",
              boxShadow: "none",
            }}
            onClick={() => navigate(`${process.env.PUBLIC_URL}/app/Delivery`)}
          >
            Back
          </button>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Percentage</Form.Label>
            <Form.Control
              type="number"
              name="percentage"
              value={formData.percentage}
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
              borderColor: "#082038",
              color: "#fff",
              boxShadow: "none",
              padding: "0.375rem 0.75rem",
              borderRadius: "0.25rem",
            }}
          >
            {loading ? "Adding..." : "Add Percentage"}
          </button>
        </Form>
      </Card.Body>
    </Card>
  );
}
