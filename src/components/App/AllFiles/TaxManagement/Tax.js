
// import React, { useEffect, useState, Fragment } from "react";
// import { Card } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// export default function Tax() {
//   const [tax, setTax] = useState(null); // single object for tax
//   const navigate = useNavigate();

//   // Fetch tax on mount
//   useEffect(() => {
//     fetchTax();
//   }, []);

//   const fetchTax = async () => {
//     try {
//       const response = await fetch("http://13.204.96.244:3000/api/getTax");
//       const result = await response.json();
//       console.log("Fetch Tax Response:", result);

//       if (result.status && result.data) {
//         setTax(result.data);
//       } else {
//         setTax(null);
//       }
//     } catch (error) {
//       console.error("Error fetching tax:", error);
//       setTax(null);
//     }
//   };

//   // Navigate to Add Tax page
//   const handleAddTax = () => {
//     navigate(`${process.env.PUBLIC_URL}/app/AddTax`);
//   };

//   // Navigate to Update Tax page with state
//   const handleEditTax = (item) => {
//     navigate(`${process.env.PUBLIC_URL}/app/UpdateTax/${item._id}`, {
//       state: item,
//     });
//   };

//   // Delete Tax
//   const handleDeleteTax = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this tax?")) return;

//     try {
//       const myHeaders = new Headers();
//       myHeaders.append(
//         "Authorization",
//         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiI2MzgxNjE1MDUyIiwibmFtZSI6InBhcnRoYSIsImlhdCI6MTc1ODM3MDg4OCwiZXhwIjoxNzU4NTQzNjg4fQ.I94Acb9e6bL9g-4i6lruzbKBPpUiVp8R9HAPhvqnuZg"
//       );

//       const requestOptions = {
//         method: "DELETE",
//         headers: myHeaders,
//         redirect: "follow",
//       };

//       const response = await fetch("http://13.204.96.244:3000/api/deleteTax", requestOptions);
//       const result = await response.json();
//       console.log("Delete Tax Response:", result);

//       if (result.status) {
//         alert("Tax deleted successfully!");
//         setTax(null);
//       } else {
//         alert(result.message || "Failed to delete tax");
//       }
//     } catch (error) {
//       console.error("Error deleting tax:", error);
//       alert("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <Fragment>
//       <Card>
//         <Card.Body>
//           {/* Title + Add Tax button */}
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <div
//               className="card-title main-content-label"
//               style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
//             >
//               Tax Management
//             </div>
//             <button
//               onClick={handleAddTax}
//               className="me-2"
//               style={{
//                 backgroundColor: "#082038",
//                 border: "1px solid #082038",
//                 color: "#fff",
//                 padding: "0.375rem 0.75rem",
//                 borderRadius: "0.25rem",
//                 cursor: "pointer",
//               }}
//             >
//               Add Percentage
//             </button>
//           </div>

//           {/* Table */}
//           <div className="table-responsive mt-3">
//             <table className="table table-bordered">
//               <thead>
//                 <tr>
//                   <th>S.No</th>
//                   <th>Percentage</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {tax ? (
//                   <tr>
//                     <td>1</td>
//                     <td>{tax.percentage}</td>
//                     <td>
//                       <button
//                         onClick={() => handleEditTax(tax)}
//                         style={{
//                           backgroundColor: "#ffc107",
//                           border: "1px solid #ffc107",
//                           color: "#fff",
//                           padding: "0.25rem 0.5rem",
//                           borderRadius: "0.25rem",
//                           cursor: "pointer",
//                           marginRight: "0.5rem",
//                         }}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDeleteTax(tax._id)}
//                         style={{
//                           backgroundColor: "#dc3545",
//                           border: "1px solid #dc3545",
//                           color: "#fff",
//                           padding: "0.25rem 0.5rem",
//                           borderRadius: "0.25rem",
//                           cursor: "pointer",
//                         }}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ) : (
//                   <tr>
//                     <td colSpan="3" className="text-center">
//                       No tax found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </Card.Body>
//       </Card>
//     </Fragment>
//   );
// }


import React, { useEffect, useState, Fragment } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Tax() {
  const [tax, setTax] = useState(null); // single object for tax
  const navigate = useNavigate();

  // Fetch tax on mount
  useEffect(() => {
    fetchTax();
  }, []);

  const fetchTax = async () => {
    try {
      const response = await fetch("http://13.204.96.244:3000/api/getTax");
      const result = await response.json();
      console.log("Fetch Tax Response:", result);

      if (result.status && result.data) {
        setTax(result.data);
      } else {
        setTax(null);
      }
    } catch (error) {
      console.error("Error fetching tax:", error);
      setTax(null);
    }
  };

  // Navigate to Add Tax page
  const handleAddTax = () => {
    navigate(`${process.env.PUBLIC_URL}/app/AddTax`);
  };

  // Navigate to Update Tax page with state
  const handleEditTax = (item) => {
    navigate(`${process.env.PUBLIC_URL}/app/UpdateTax/${item._id}`, {
      state: item,
    });
  };

  // ✅ Integrated Delete Tax API
  const handleDeleteTax = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tax?")) return;

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiI2MzgxNjE1MDUyIiwibmFtZSI6InBhcnRoYSIsImlhdCI6MTc1ODM3MDg4OCwiZXhwIjoxNzU4NTQzNjg4fQ.I94Acb9e6bL9g-4i6lruzbKBPpUiVp8R9HAPhvqnuZg"
      );

      const raw = JSON.stringify({ _id: id });

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: raw,
      };

      const response = await fetch(
        "http://13.204.96.244:3000/api/deleteTax",
        requestOptions
      );
      const result = await response.json();
      console.log("Delete Tax Response:", result);

      if (result.status) {
        alert("Tax deleted successfully!");
        setTax(null);
      } else {
        alert(result.message || "Failed to delete tax");
      }
    } catch (error) {
      console.error("Error deleting tax:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <Fragment>
      <Card>
        <Card.Body>
          {/* Title + Add Tax button */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div
              className="card-title main-content-label"
              style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
            >
              Tax Management
            </div>
            <button
              onClick={handleAddTax}
              className="me-2"
              style={{
                backgroundColor: "#082038",
                border: "1px solid #082038",
                color: "#fff",
                padding: "0.375rem 0.75rem",
                borderRadius: "0.25rem",
                cursor: "pointer",
              }}
            >
              Add Percentage
            </button>
          </div>

          {/* Table */}
          <div className="table-responsive mt-3">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Percentage</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tax ? (
                  <tr>
                    <td>1</td>
                    <td>{tax.percentage}</td>
                    <td>
                      <button
                        onClick={() => handleEditTax(tax)}
                        style={{
                          backgroundColor: "#ffc107",
                          border: "1px solid #ffc107",
                          color: "#fff",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          cursor: "pointer",
                          marginRight: "0.5rem",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTax(tax._id)}
                        style={{
                          backgroundColor: "#dc3545",
                          border: "1px solid #dc3545",
                          color: "#fff",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No tax found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </Fragment>
  );
}
