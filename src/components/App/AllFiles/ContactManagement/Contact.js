// // import React, { useEffect, useState, Fragment } from "react";
// // import { Card } from "react-bootstrap";
// // import { useNavigate } from "react-router-dom";

// // export default function Catalog() {
// //   const [data, setData] = useState([]);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     fetchSupport();
// //   }, []);

// //   const fetchSupport = async () => {
// //     try {
// //       const requestOptions = {
// //         method: "POST",
// //         redirect: "follow",
// //       };

// //       const response = await fetch(
// //         "http://13.204.96.244:3000/api/getSupport",
// //         requestOptions
// //       );

// //       const result = await response.json();
// //       if (result.data && Array.isArray(result.data)) {
// //         setData(result.data);
// //         console.log("Fetched support data:", result.data);
// //       } else {
// //         setData([]);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching support data:", error);
// //     }
// //   };

// //   // Navigate to AddContact page
// //   const handleAddContact = () => {
// //     navigate(`${process.env.PUBLIC_URL}/app/AddContact`);
// //   };

// //   return (
// //     <Fragment>
// //       <Card>
// //         <Card.Body>
// //           {/* Title + Add Contact button */}
// //           <div className="d-flex justify-content-between align-items-center mb-4">
// //             <div
// //               className="card-title main-content-label"
// //               style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
// //             >
// //               Support Records
// //             </div>
// //             <button
// //               onClick={handleAddContact}
// //               className="me-2"
// //               style={{
// //                 backgroundColor: "#082038",
// //                 border: "1px solid #082038",
// //                 color: "#fff",
// //                 padding: "0.375rem 0.75rem",
// //                 borderRadius: "0.25rem",
// //                 cursor: "pointer",
// //               }}
// //             >
// //               Add Contact
// //             </button>
// //           </div>

// //           {/* Table */}
// //           <div className="table-responsive mt-3">
// //             <table className="table table-bordered">
// //               <thead>
// //                 <tr>
// //                   <th>S.No</th>
// //                   <th>Email</th>
// //                   <th>Mobile</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {data.length > 0 ? (
// //                   data.map((item, index) => (
// //                     <tr key={index}>
// //                       <td>{index + 1}</td>
// //                       <td>{item.email || "—"}</td>
// //                       <td>{item.mobile || "—"}</td>
// //                     </tr>
// //                   ))
// //                 ) : (
// //                   <tr>
// //                     <td colSpan="3" className="text-center">
// //                       No records found
// //                     </td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         </Card.Body>
// //       </Card>
// //     </Fragment>
// //   );
// // }

// import React, { useEffect, useState, Fragment } from "react";
// import { Card } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// export default function Catalog() {
//   const [data, setData] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchSupport();
//   }, []);

//   const fetchSupport = async () => {
//     try {
//       const requestOptions = {
//         method: "POST",
//         redirect: "follow",
//       };

//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getSupport",
//         requestOptions
//       );

//       const textResult = await response.text();
//       const parsed = JSON.parse(textResult);

//       if (parsed.data) {
//         const records = Array.isArray(parsed.data) ? parsed.data : [parsed.data];
//         setData(records);
//       } else {
//         setData([]);
//       }
//     } catch (error) {
//       console.error("Error fetching support data:", error);
//     }
//   };

//   const handleAddContact = () => {
//     navigate(`${process.env.PUBLIC_URL}/app/AddContact`);
//   };

//   const handleEditContact = (item) => {
//     navigate(`${process.env.PUBLIC_URL}/app/UpdateContact/${item._id}`, {
//       state: item, // pass full record to UpdateContact
//     });
//   };

//   const handleDeleteContact = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this contact?")) return;

//     try {
//       const requestOptions = {
//         method: "DELETE",
//         redirect: "follow",
//       };

//       const response = await fetch(
//         `http://13.204.96.244:3000/api/deleteSupport/${id}`,
//         requestOptions
//       );

//       const result = await response.text();
//       console.log(result);

//       // Refresh the table
//       fetchSupport();
//     } catch (error) {
//       console.error("Error deleting contact:", error);
//       alert("Failed to delete contact.");
//     }
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
//               Support Records
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
//               Add Contact
//             </button>
//           </div>

//           {/* Table */}
//           <div className="table-responsive mt-3">
//             <table className="table table-bordered">
//               <thead>
//                 <tr>
//                   <th>S.No</th>
//                   <th>Email</th>
//                   <th>Mobile</th>
//                   <th>Actions</th>
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
//                           onClick={() => handleEditContact(item)}
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
//                           onClick={() => handleDeleteContact(item._id)}
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

import React, { useEffect, useState, Fragment } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Catalog() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSupport();
  }, []);

  // Fetch support records
  const fetchSupport = async () => {
    try {
      const response = await fetch("http://13.204.96.244:3000/api/getSupport", {
        method: "POST",
        redirect: "follow",
      });

      const result = await response.json();
      if (result.data) {
        const records = Array.isArray(result.data) ? result.data : [result.data];
        setData(records);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching support data:", error);
    }
  };

  // Navigate to Add Contact page
  const handleAddContact = () => {
    navigate(`${process.env.PUBLIC_URL}/app/AddContact`);
  };

  // Navigate to Update Contact page with state
  const handleEditContact = (item) => {
    navigate(`${process.env.PUBLIC_URL}/app/UpdateContact/${item._id}`, {
      state: item,
    });
  };

  // Delete contact
  const handleDeleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    try {
      const response = await fetch("http://13.204.96.244:3000/api/deleteSupport", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      console.log("Deleted:", result);

      // Remove deleted record from state immediately
      setData((prevData) => prevData.filter((item) => item._id !== id));

      alert(result.message || "Contact deleted successfully");
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete contact.");
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
              Support Records
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
              Add Contact
            </button>
          </div>

          {/* Table */}
          <div className="table-responsive mt-3">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={item._id || index}>
                      <td>{index + 1}</td>
                      <td>{item.email || "—"}</td>
                      <td>{item.mobile || "—"}</td>
                      <td>
                        <button
                          onClick={() => handleEditContact(item)}
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
                          onClick={() => handleDeleteContact(item._id)}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No records found
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
