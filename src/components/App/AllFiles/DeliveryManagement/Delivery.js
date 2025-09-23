// import React, { useEffect, useState, Fragment } from "react";
// import { Card } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// export default function Delivery() {
//   const [data, setData] = useState([]);
//   const navigate = useNavigate();


//   // Navigate to Add Contact page
//   const handleAddContact = () => {
//     navigate(`${process.env.PUBLIC_URL}/app/AddAmount`);
//   };

//   // Navigate to Update Contact page with state
//   const handleEditContact = (item) => {
//     navigate(`${process.env.PUBLIC_URL}/app/UpdateContact/${item._id}`, {
//       state: item,
//     });
//   };

 

//   return (
//     <Fragment>
//       <Card>
//         <Card.Body>
//           {/* Title + Add Contact button */}
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <div
//               className="card-title main-content-label"
//               style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
//             >
//               Delivery Management
//             </div>
//             <button
//               onClick={handleAddContact}
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
//               Add Amount
//             </button>
//           </div>

//           {/* Table */}
//           <div className="table-responsive mt-3">
//             <table className="table table-bordered">
//               <thead>
//                 <tr>
//                   <th>S.No</th>
//                   <th>Amount</th>
                 
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.length > 0 ? (
//                   data.map((item, index) => (
//                     <tr key={item._id || index}>
//                       <td>{index + 1}</td>
//                       <td>{item.email || "—"}</td>
//                       <td>{item.mobile || "—"}</td>
//                       <td>
//                         <button
//                         //   onClick={() => handleEditContact(item)}
//                           style={{
//                             backgroundColor: "#ffc107",
//                             border: "1px solid #ffc107",
//                             color: "#fff",
//                             padding: "0.25rem 0.5rem",
//                             borderRadius: "0.25rem",
//                             cursor: "pointer",
//                             marginRight: "0.5rem",
//                           }}
//                         >
//                           Edit
//                         </button>
//                         <button
//                         //   onClick={() => handleDeleteContact(item._id)}
//                           style={{
//                             backgroundColor: "#dc3545",
//                             border: "1px solid #dc3545",
//                             color: "#fff",
//                             padding: "0.25rem 0.5rem",
//                             borderRadius: "0.25rem",
//                             cursor: "pointer",
//                           }}
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="4" className="text-center">
//                       No records found
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


// import React, { useEffect, useState, Fragment } from "react";
// import { Card } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// export default function Delivery() {
//   const [delivery, setDelivery] = useState(null); // single object, not array
//   const navigate = useNavigate();

//   // Fetch delivery charge on mount
//   useEffect(() => {
//     const fetchDelivery = async () => {
//       try {
//         const response = await fetch("http://13.204.96.244:3000/api/getDeliveryCharge");
//         const result = await response.json();
//         if (result.status && result.data) {
//           setDelivery(result.data);
//         } else {
//           setDelivery(null);
//         }
//       } catch (error) {
//         console.error("Error fetching delivery charges:", error);
//         setDelivery(null);
//       }
//     };

//     fetchDelivery();
//   }, []);

//   // Navigate to Add Amount page
//   const handleAddContact = () => {
//     navigate(`${process.env.PUBLIC_URL}/app/AddAmount`);
//   };

//   // Navigate to Update Contact page with state
//   const handleEditDelivery = (item) => {
//     navigate(`${process.env.PUBLIC_URL}/app/UpdateAmount/${item._id}`, {
//       state: item,
//     });
//   };

//   return (
//     <Fragment>
//       <Card>
//         <Card.Body>
//           {/* Title + Add Contact button */}
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <div
//               className="card-title main-content-label"
//               style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
//             >
//               Delivery Management
//             </div>
//             <button
//               onClick={handleAddContact}
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
//               Add Amount
//             </button>
//           </div>

//           {/* Table */}
//           <div className="table-responsive mt-3">
//             <table className="table table-bordered">
//               <thead>
//                 <tr>
//                   <th>S.No</th>
//                   <th>Amount</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {delivery ? (
//                   <tr>
//                     <td>1</td>
//                     <td>{delivery.amount}</td>
//                     <td>
//                       <button
//                         onClick={() => handleEditDelivery(delivery)}
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
//                       No delivery charges found
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

export default function Delivery() {
  const [delivery, setDelivery] = useState(null); // single object
  const navigate = useNavigate();

  // Fetch delivery charge on mount
  useEffect(() => {
    fetchDelivery();
  }, []);

  const fetchDelivery = async () => {
    try {
      const response = await fetch("http://13.204.96.244:3000/api/getDeliveryCharge");
      const result = await response.json();
      if (result.status && result.data) {
        setDelivery(result.data);
      } else {
        setDelivery(null);
      }
    } catch (error) {
      console.error("Error fetching delivery charges:", error);
      setDelivery(null);
    }
  };

  // Navigate to Add Amount page
  const handleAddContact = () => {
    navigate(`${process.env.PUBLIC_URL}/app/AddAmount`);
  };

  // Navigate to Update page with state
  const handleEditDelivery = (item) => {
    navigate(`${process.env.PUBLIC_URL}/app/UpdateAmount/${item._id}`, {
      state: item,
    });
  };

  // Delete delivery charge
  const handleDeleteDelivery = async (id) => {
    if (!window.confirm("Are you sure you want to delete this delivery charge?")) return;

    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiI2MzgxNjE1MDUyIiwibmFtZSI6InBhcnRoYSIsImlhdCI6MTc1ODM3MDg4OCwiZXhwIjoxNzU4NTQzNjg4fQ.I94Acb9e6bL9g-4i6lruzbKBPpUiVp8R9HAPhvqnuZg");

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch("http://13.204.96.244:3000/api/deleteDeliveryCharge", requestOptions);
      const result = await response.json();
      console.log(result);

      if (result.status) {
        alert("Delivery charge deleted successfully!");
        setDelivery(null); // since only one exists, clear it
      } else {
        alert(result.message || "Failed to delete delivery charge");
      }
    } catch (error) {
      console.error("Error deleting delivery charge:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <Fragment>
      <Card>
        <Card.Body>
          {/* Title + Add Contact button */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div
              className="card-title main-content-label"
              style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
            >
              Delivery Management
            </div>
            <button
              onClick={handleAddContact}
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
              Add Amount
            </button>
          </div>

          {/* Table */}
          <div className="table-responsive mt-3">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {delivery ? (
                  <tr>
                    <td>1</td>
                    <td>{delivery.amount}</td>
                    <td>
                      <button
                        onClick={() => handleEditDelivery(delivery)}
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
                        onClick={() => handleDeleteDelivery(delivery._id)}
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
                      No delivery charges found
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
