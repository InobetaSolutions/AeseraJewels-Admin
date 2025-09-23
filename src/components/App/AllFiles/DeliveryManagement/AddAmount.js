// import React, { useState } from "react";
// import { Card, Form } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// export default function AddContact() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: "",
//     mobile: "",
//   });
//   const [error, setError] = useState("");

 
 

//   return (
//     <Card>
//       <Card.Body>
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5 style={{ color: "#082038" }}>Add Amount</h5>
//           <button
//             style={{
//               backgroundColor: "#082038",
//               borderColor: "#082038",
//               color: "#fff",
//               boxShadow: "none",
//             }}
//             onClick={() =>
//               navigate(`${process.env.PUBLIC_URL}/app/Delivery`)
//             }
//           >
//             Back
//           </button>
//         </div>

//         <Form >
//           <Form.Group className="mb-3">
//             <Form.Label>Amount</Form.Label>
//             <Form.Control
//               type="number"
//               name="number"
//               value={formData.email}
            
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
//             Add Amount
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
    amount: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle submit
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
        amount: Number(formData.amount), // ensure number
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "http://13.204.96.244:3000/api/createDeliveryCharge",
        requestOptions
      );
      const result = await response.json();
      console.log(result);

      if (result.status) {
        alert("Delivery charge added successfully!");
        navigate(`${process.env.PUBLIC_URL}/app/Delivery`);
      } else {
        setError(result.message || "Failed to add delivery charge");
      }
    } catch (err) {
      console.error("Error adding delivery charge:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 style={{ color: "#082038" }}>Add Amount</h5>
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
            <Form.Label>Amount</Form.Label>
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
              borderColor: "#082038",
              color: "#fff",
              boxShadow: "none",
              padding: "0.375rem 0.75rem",
              borderRadius: "0.25rem",
            }}
          >
            {loading ? "Adding..." : "Add Amount"}
          </button>
        </Form>
      </Card.Body>
    </Card>
  );
}
