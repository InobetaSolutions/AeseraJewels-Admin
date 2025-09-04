// import React, { Fragment, useEffect, useState } from "react";
// import { Card, Spinner, Button, Form, Modal, Table, Alert } from "react-bootstrap";

// export default function GetFullPaymentSummary() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [allotment, setAllotment] = useState({});
//   const [submitting, setSubmitting] = useState("");
//   const [activeRow, setActiveRow] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [modalData, setModalData] = useState(null);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [selectedMobile, setSelectedMobile] = useState("");

//   useEffect(() => {
//     fetchSummary();
//   }, []);

//   const fetchSummary = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getFullPayment",
//         { method: "GET", redirect: "follow" }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const result = await response.json();
//       setData(result.summary || []);
//     } catch (err) {
//       console.error("Error fetching summary:", err);
//       setError("Failed to fetch payment summary.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAllotment = async (mobile) => {
//     const gram = allotment[mobile];
//     if (!gram || gram <= 0) {
//       alert("Please enter a valid gram value.");
//       return;
//     }

//     setSubmitting(mobile);
//     try {
//       const myHeaders = new Headers();
//       myHeaders.append("Content-Type", "application/json");

//       const raw = JSON.stringify({
//         mobile,
//         gram: Number(gram),
//       });

//       const requestOptions = {
//         method: "POST",
//         headers: myHeaders,
//         body: raw,
//         redirect: "follow",
//       };

//       const response = await fetch(
//         "http://13.204.96.244:3000/api/setAllotment",
//         requestOptions
//       );

//       const result = await response.json();
//       alert(`Allotment success for ${mobile}`);
//       setActiveRow("");
//       fetchSummary();
//     } catch (error) {
//       console.error("Error in setAllotment:", error);
//       alert("Failed to set allotment. Try again.");
//     } finally {
//       setSubmitting("");
//     }
//   };

//   const handleView = async (mobile) => {
//     setSelectedMobile(mobile);
//     setModalLoading(true);
//     setShowModal(true);
//     setModalData(null);

//     try {
//       // Try without authorization header first
//       const response = await fetch(
//         `http://13.204.96.244:3000/api/getByUserAllotment?mobile=${mobile}`,
//         { method: "GET", redirect: "follow" }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log("API Response:", result); // For debugging

//       // Handle different response structures
//       let dataArray = [];
//       if (Array.isArray(result)) {
//         dataArray = result;
//       } else if (result.data && Array.isArray(result.data)) {
//         dataArray = result.data;
//       } else if (result.allotments && Array.isArray(result.allotments)) {
//         dataArray = result.allotments;
//       }

//       // Remove _id and __v fields from each object in the array
//       const cleanedData = dataArray.map(item => {
//         const { _id, __v, ...rest } = item;
//         return rest;
//       });

//       setModalData(cleanedData);
//     } catch (error) {
//       console.error("Error fetching allotment:", error);
//       setModalData({ error: "Failed to fetch data. Please check the console for details." });
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   // Function to render modal content based on data
//   const renderModalContent = () => {
//     if (modalLoading) {
//       return (
//         <div className="text-center">
//           <Spinner animation="border" variant="primary" />
//           <p className="mt-2">Loading data for {selectedMobile}...</p>
//         </div>
//       );
//     }

//     if (!modalData) {
//       return <Alert variant="warning">No data received from server.</Alert>;
//     }

//     if (modalData.error) {
//       return <Alert variant="danger">{modalData.error}</Alert>;
//     }

//     if (!Array.isArray(modalData) || modalData.length === 0) {
//       return <Alert variant="info">No allotment records found for {selectedMobile}.</Alert>;
//     }

//     // Get all unique keys from all objects for table headers (excluding _id and __v)
//     const allKeys = [...new Set(modalData.flatMap(item => Object.keys(item)))];

//     return (
//       <div className="table-responsive">
//         <Table bordered striped hover>
//           <thead>
//             <tr>
//               {allKeys.map(key => (
//                 <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {modalData.map((row, idx) => (
//               <tr key={idx}>
//                 {allKeys.map(key => (
//                   <td key={key}>{row[key] !== undefined ? row[key] : "N/A"}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>
//     );
//   };

//   return (
//     <Fragment>
//       <Card className="shadow-sm">
//         <Card.Body>
//           <div
//             className="card-title main-content-label text-primary mb-3"
//             style={{ fontSize: "1.25rem" }}
//           >
//             Allotment Management
//           </div>

//           {loading ? (
//             <div className="text-center">
//               <Spinner animation="border" variant="primary" />
//             </div>
//           ) : error ? (
//             <div className="text-danger text-center">{error}</div>
//           ) : (
//             <div className="table-responsive">
//               <table className="table table-bordered table-striped">
//                 <thead>
//                   <tr>
//                     <th>S.No</th>
//                     <th>Mobile</th>
//                     <th>Total Amount</th>
//                     <th>Total Grams</th>
//                     <th>Action</th>
//                     <th>View</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data.length > 0 ? (
//                     data.map((item, index) => (
//                       <tr key={item.mobile}>
//                         <td>{index + 1}</td>
//                         <td>{item.mobile}</td>
//                         <td>₹ {item.totalAmount.toFixed(2)}</td>
//                         <td>{item.totalGrams} g</td>
//                         <td>
//                           {activeRow === item.mobile ? (
//                             <div className="d-flex gap-2">
//                               <Form.Control
//                                 type="number"
//                                 placeholder="Enter grams"
//                                 value={allotment[item.mobile] || ""}
//                                 onChange={(e) =>
//                                   setAllotment({
//                                     ...allotment,
//                                     [item.mobile]: e.target.value,
//                                   })
//                                 }
//                                 style={{ width: "120px" }}
//                               />
//                               <Button
//                                 variant="success"
//                                 size="sm"
//                                 disabled={submitting === item.mobile}
//                                 onClick={() => handleAllotment(item.mobile)}
//                               >
//                                 {submitting === item.mobile
//                                   ? "Submitting..."
//                                   : "Confirm"}
//                               </Button>
//                               <Button
//                                 variant="secondary"
//                                 size="sm"
//                                 onClick={() => setActiveRow("")}
//                               >
//                                 Cancel
//                               </Button>
//                             </div>
//                           ) : (
//                             <Button
//                               variant="primary"
//                               size="sm"
//                               onClick={() => setActiveRow(item.mobile)}
//                             >
//                               Set Allotment
//                             </Button>
//                           )}
//                         </td>
//                         <td>
//                           <Button
//                             variant="primary"
//                             size="sm"
//                             onClick={() => handleView(item.mobile)}
//                           >
//                             View
//                           </Button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="6" className="text-center text-muted">
//                         No data available
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </Card.Body>
//       </Card>

//       {/* Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Allotment Details for {selectedMobile}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {renderModalContent()}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Fragment>
//   );
// }

// import React, { Fragment, useEffect, useState } from "react";
// import { Card, Spinner, Button, Form, Modal, Table, Alert } from "react-bootstrap";

// export default function GetFullPaymentSummary() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [allotment, setAllotment] = useState({});
//   const [submitting, setSubmitting] = useState("");
//   const [activeRow, setActiveRow] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [modalData, setModalData] = useState(null);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [selectedMobile, setSelectedMobile] = useState("");
//   const [allotmentError, setAllotmentError] = useState("");

//   useEffect(() => {
//     fetchSummary();
//   }, []);

//   const fetchSummary = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getFullPayment",
//         { method: "GET", redirect: "follow" }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const result = await response.json();
//       setData(result.summary || []);
//     } catch (err) {
//       console.error("Error fetching summary:", err);
//       setError("Failed to fetch payment summary.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAllotment = async (mobile) => {
//     const gram = allotment[mobile];
//     if (!gram || gram <= 0) {
//       setAllotmentError("Please enter a valid gram value.");
//       return;
//     }

//     // Find the user's data to check available grams
//     const userData = data.find(item => item.mobile === mobile);
//     if (!userData) {
//       setAllotmentError("User data not found.");
//       return;
//     }

//     // Check if entered grams exceed available grams
//     if (Number(gram) > userData.totalGrams) {
//       setAllotmentError("Not enough grams to allot.");
//       return;
//     }

//     setSubmitting(mobile);
//     setAllotmentError("");

//     try {
//       const myHeaders = new Headers();
//       myHeaders.append("Content-Type", "application/json");

//       const raw = JSON.stringify({
//         mobile,
//         gram: Number(gram),
//       });

//       const requestOptions = {
//         method: "POST",
//         headers: myHeaders,
//         body: raw,
//         redirect: "follow",
//       };

//       const response = await fetch(
//         "http://13.204.96.244:3000/api/setAllotment",
//         requestOptions
//       );

//       const result = await response.json();
//       alert(`Allotment success for ${mobile}`);
//       setActiveRow("");
//       setAllotment({...allotment, [mobile]: ""}); // Clear the input
//       fetchSummary();
//     } catch (error) {
//       console.error("Error in setAllotment:", error);
//       alert("Failed to set allotment. Try again.");
//     } finally {
//       setSubmitting("");
//     }
//   };

//   const handleView = async (mobile) => {
//     setSelectedMobile(mobile);
//     setModalLoading(true);
//     setShowModal(true);
//     setModalData(null);

//     try {
//       // Try without authorization header first
//       const response = await fetch(
//         `http://13.204.96.244:3000/api/getByUserAllotment?mobile=${mobile}`,
//         { method: "GET", redirect: "follow" }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log("API Response:", result); // For debugging

//       // Handle different response structures
//       let dataArray = [];
//       if (Array.isArray(result)) {
//         dataArray = result;
//       } else if (result.data && Array.isArray(result.data)) {
//         dataArray = result.data;
//       } else if (result.allotments && Array.isArray(result.allotments)) {
//         dataArray = result.allotments;
//       }

//       // Remove _id and __v fields from each object in the array
//       const cleanedData = dataArray.map(item => {
//         const { _id, __v, ...rest } = item;
//         return rest;
//       });

//       setModalData(cleanedData);
//     } catch (error) {
//       console.error("Error fetching allotment:", error);
//       setModalData({ error: "Failed to fetch data. Please check the console for details." });
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   // Function to render modal content based on data
//   const renderModalContent = () => {
//     if (modalLoading) {
//       return (
//         <div className="text-center">
//           <Spinner animation="border" variant="primary" />
//           <p className="mt-2">Loading data for {selectedMobile}...</p>
//         </div>
//       );
//     }

//     if (!modalData) {
//       return <Alert variant="warning">No data received from server.</Alert>;
//     }

//     if (modalData.error) {
//       return <Alert variant="danger">{modalData.error}</Alert>;
//     }

//     if (!Array.isArray(modalData) || modalData.length === 0) {
//       return <Alert variant="info">No allotment records found for {selectedMobile}.</Alert>;
//     }

//     // Get all unique keys from all objects for table headers (excluding _id and __v)
//     const allKeys = [...new Set(modalData.flatMap(item => Object.keys(item)))];

//     return (
//       <div className="table-responsive">
//         <Table bordered striped hover>
//           <thead>
//             <tr>
//               {allKeys.map(key => (
//                 <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {modalData.map((row, idx) => (
//               <tr key={idx}>
//                 {allKeys.map(key => (
//                   <td key={key}>{row[key] !== undefined ? row[key] : "N/A"}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>
//     );
//   };

//   return (
//     <Fragment>
//       <Card className="shadow-sm">
//         <Card.Body>
//           <div
//             className="card-title main-content-label text-primary mb-3"
//             style={{ fontSize: "1.25rem" }}
//           >
//             Full Payment Summary
//           </div>

//           {loading ? (
//             <div className="text-center">
//               <Spinner animation="border" variant="primary" />
//             </div>
//           ) : error ? (
//             <div className="text-danger text-center">{error}</div>
//           ) : (
//             <div className="table-responsive">
//               <table className="table table-bordered table-striped">
//                 <thead>
//                   <tr>
//                     <th>S.No</th>
//                     <th>Mobile</th>
//                     <th>Total Amount</th>
//                     <th>Total Grams</th>
//                     <th>Action</th>
//                     <th>View</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data.length > 0 ? (
//                     data.map((item, index) => (
//                       <tr key={item.mobile}>
//                         <td>{index + 1}</td>
//                         <td>{item.mobile}</td>
//                         <td>₹ {item.totalAmount.toFixed(2)}</td>
//                         <td>{item.totalGrams} g</td>
//                         <td>
//                           {activeRow === item.mobile ? (
//                             <div>
//                               <div className="d-flex gap-2 mb-2">
//                                 <Form.Control
//                                   type="number"
//                                   placeholder="Enter grams"
//                                   value={allotment[item.mobile] || ""}
//                                   onChange={(e) => {
//                                     setAllotment({
//                                       ...allotment,
//                                       [item.mobile]: e.target.value,
//                                     });
//                                     setAllotmentError(""); // Clear error when user types
//                                   }}
//                                   style={{ width: "120px" }}
//                                   max={item.totalGrams} // Set max value
//                                 />
//                                 <Button
//                                   variant="success"
//                                   size="sm"
//                                   disabled={submitting === item.mobile}
//                                   onClick={() => handleAllotment(item.mobile)}
//                                 >
//                                   {submitting === item.mobile
//                                     ? "Submitting..."
//                                     : "Confirm"}
//                                 </Button>
//                                 <Button
//                                   variant="secondary"
//                                   size="sm"
//                                   onClick={() => {
//                                     setActiveRow("");
//                                     setAllotmentError("");
//                                   }}
//                                 >
//                                   Cancel
//                                 </Button>
//                               </div>
//                               {allotmentError && (
//                                 <div className="text-danger small">{allotmentError}</div>
//                               )}
//                             </div>
//                           ) : (
//                             <Button
//                               variant="primary"
//                               size="sm"
//                               onClick={() => setActiveRow(item.mobile)}
//                             >
//                               Set Allotment
//                             </Button>
//                           )}
//                         </td>
//                         <td>
//                           <Button
//                             variant="primary"
//                             size="sm"
//                             onClick={() => handleView(item.mobile)}
//                           >
//                             View
//                           </Button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="6" className="text-center text-muted">
//                         No data available
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </Card.Body>
//       </Card>

//       {/* Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Allotment Details for {selectedMobile}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {renderModalContent()}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Fragment>
//   );
// }

// import React, { Fragment, useEffect, useState } from "react";
// import {
//   Card,
//   Spinner,
//   Button,
//   Form,
//   Modal,
//   Table,
//   Alert,
// } from "react-bootstrap";

// export default function GetFullPaymentSummary() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [allotment, setAllotment] = useState({});
//   const [submitting, setSubmitting] = useState("");
//   const [activeRow, setActiveRow] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [modalData, setModalData] = useState(null);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [selectedMobile, setSelectedMobile] = useState("");
//   const [allotmentError, setAllotmentError] = useState({}); // ✅ now per-user errors

//   // ✅ Utility: Format timestamps into IST
//   const formatToIST = (timestamp) => {
//     if (!timestamp) return "N/A";
//     try {
//       const date = new Date(timestamp);
//       return new Intl.DateTimeFormat("en-IN", {
//         timeZone: "Asia/Kolkata",
//         dateStyle: "medium",
//         timeStyle: "short",
//       }).format(date);
//     } catch {
//       return timestamp;
//     }
//   };

//   useEffect(() => {
//     fetchSummary();
//   }, []);

//   const fetchSummary = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getFullPayment",
//         { method: "GET", redirect: "follow" }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const result = await response.json();
//       setData(result.summary || []);
//     } catch (err) {
//       console.error("Error fetching summary:", err);
//       setError("Failed to fetch payment summary.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAllotment = async (mobile) => {
//     const gram = allotment[mobile];
//     if (!gram || gram <= 0) {
//       setAllotmentError({
//         ...allotmentError,
//         [mobile]: "Please enter a valid gram value.",
//       });
//       return;
//     }

//     const userData = data.find((item) => item.mobile === mobile);
//     if (!userData) {
//       setAllotmentError({
//         ...allotmentError,
//         [mobile]: "User data not found.",
//       });
//       return;
//     }

//     if (Number(gram) > userData.totalGrams) {
//       setAllotmentError({
//         ...allotmentError,
//         [mobile]: "Not enough grams to allot.",
//       });
//       return;
//     }

//     setSubmitting(mobile);
//     setAllotmentError({
//       ...allotmentError,
//       [mobile]: "",
//     });

//     try {
//       const myHeaders = new Headers();
//       myHeaders.append("Content-Type", "application/json");

//       const raw = JSON.stringify({
//         mobile,
//         gram: Number(gram),
//       });

//       const requestOptions = {
//         method: "POST",
//         headers: myHeaders,
//         body: raw,
//         redirect: "follow",
//       };

//       const response = await fetch(
//         "http://13.204.96.244:3000/api/setAllotment",
//         requestOptions
//       );

//       await response.json();
//       alert(`Allotment success for ${mobile}`);
//       setActiveRow("");
//       setAllotment({ ...allotment, [mobile]: "" });
//       fetchSummary();
//     } catch (error) {
//       console.error("Error in setAllotment:", error);
//       alert("Failed to set allotment. Try again.");
//     } finally {
//       setSubmitting("");
//     }
//   };

//   const handleView = async (mobile) => {
//     setSelectedMobile(mobile);
//     setModalLoading(true);
//     setShowModal(true);
//     setModalData(null);

//     try {
//       const response = await fetch(
//         `http://13.204.96.244:3000/api/getByUserAllotment?mobile=${mobile}`,
//         { method: "GET", redirect: "follow" }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log("API Response:", result);

//       let dataArray = [];
//       if (Array.isArray(result)) {
//         dataArray = result;
//       } else if (result.data && Array.isArray(result.data)) {
//         dataArray = result.data;
//       } else if (result.allotments && Array.isArray(result.allotments)) {
//         dataArray = result.allotments;
//       }

//       const cleanedData = dataArray.map((item) => {
//         const { _id, __v, ...rest } = item;
//         return rest;
//       });

//       setModalData(cleanedData);
//     } catch (error) {
//       console.error("Error fetching allotment:", error);
//       setModalData({
//         error: "Failed to fetch data. Please check the console for details.",
//       });
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   // ✅ Render Modal Content
//   const renderModalContent = () => {
//     if (modalLoading) {
//       return (
//         <div className="text-center">
//           <Spinner animation="border" variant="primary" />
//           <p className="mt-2">Loading data for {selectedMobile}...</p>
//         </div>
//       );
//     }

//     if (!modalData) {
//       return <Alert variant="warning">No data received from server.</Alert>;
//     }

//     if (modalData.error) {
//       return <Alert variant="danger">{modalData.error}</Alert>;
//     }

//     if (!Array.isArray(modalData) || modalData.length === 0) {
//       return (
//         <Alert variant="info">
//           No allotment records found for {selectedMobile}.
//         </Alert>
//       );
//     }

//     const allKeys = [
//       ...new Set(modalData.flatMap((item) => Object.keys(item))),
//     ];

//     return (
//       <div className="table-responsive">
//         <Table bordered striped hover>
//           <thead>
//             <tr>
//               {allKeys.map((key) => (
//                 <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {modalData.map((row, idx) => (
//               <tr key={idx}>
//                 {allKeys.map((key) => (
//                   <td key={key}>
//                     {row[key] !== undefined
//                       ? key.toLowerCase().includes("time") ||
//                         key.toLowerCase().includes("date")
//                         ? formatToIST(row[key])
//                         : row[key]
//                       : "N/A"}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>
//     );
//   };

//   return (
//     <Fragment>
//       <Card className="shadow-sm">
//         <Card.Body>
//           <div
//             className="card-title main-content-label"
//             style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
//           >
//             Allotment Management
//           </div>

//           {loading ? (
//             <div className="text-center">
//               <Spinner animation="border" variant="primary" />
//             </div>
//           ) : error ? (
//             <div className="text-danger text-center">{error}</div>
//           ) : (
//             <div className="table-responsive">
//               <table className="table table-bordered table-striped">
//                 <thead>
//                   <tr>
//                     <th>S.No</th>
//                     <th>Mobile</th>
//                     <th>Total Amount</th>
//                     <th>Total Grams</th>
//                     <th>Action</th>
//                     <th>View</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data.length > 0 ? (
//                     data.map((item, index) => (
//                       <tr key={item.mobile}>
//                         <td>{index + 1}</td>
//                         <td>{item.mobile}</td>
//                         <td>₹ {item.totalAmount.toFixed(2)}</td>
//                         <td>{item.totalGrams} g</td>
//                         <td>
//                           {activeRow === item.mobile ? (
//                             <div>
//                               <div className="d-flex gap-2 mb-2">
//                                 <Form.Control
//                                   type="number"
//                                   placeholder="Enter grams"
//                                   value={allotment[item.mobile] || ""}
//                                   onChange={(e) => {
//                                     setAllotment({
//                                       ...allotment,
//                                       [item.mobile]: e.target.value,
//                                     });
//                                     setAllotmentError({
//                                       ...allotmentError,
//                                       [item.mobile]: "",
//                                     });
//                                   }}
//                                   style={{ width: "120px" }}
//                                   max={item.totalGrams}
//                                 />
//                                 <Button
//                                   variant="success"
//                                   size="sm"
//                                   disabled={submitting === item.mobile}
//                                   onClick={() => handleAllotment(item.mobile)}
//                                 >
//                                   {submitting === item.mobile
//                                     ? "Submitting..."
//                                     : "Confirm"}
//                                 </Button>
//                                 <Button
//                                   variant="secondary"
//                                   size="sm"
//                                   onClick={() => {
//                                     setActiveRow("");
//                                     setAllotmentError({
//                                       ...allotmentError,
//                                       [item.mobile]: "",
//                                     });
//                                   }}
//                                 >
//                                   Cancel
//                                 </Button>
//                               </div>
//                               {allotmentError[item.mobile] && (
//                                 <div className="text-danger small">
//                                   {allotmentError[item.mobile]}
//                                 </div>
//                               )}
//                             </div>
//                           ) : (
//                             // <Button
//                             //   variant="primary"
//                             //   size="sm"
//                             //   onClick={() => setActiveRow(item.mobile)}
//                             // >
//                             //   Set Allotment
//                             // </Button>
//                             <button
//                               size="sm"
//                               onClick={() => setActiveRow(item.mobile)}
//                               style={{
//                                 backgroundColor: "#082038",
//                                 border: "1px solid #082038",
//                                 color: "#fff",
//                                 padding: "0.375rem 0.75rem",
//                                 borderRadius: "0.25rem",
//                                 cursor: "pointer",
//                               }}
//                             >
//                               Set Allotment
//                             </button>
//                           )}
//                         </td>
//                         <td>
//                           <button
//                             variant="primary"
//                             size="sm"
//                             onClick={() => handleView(item.mobile)}
//                              style={{
//                                 backgroundColor: "#082038",
//                                 border: "1px solid #082038",
//                                 color: "#fff",
//                                 padding: "0.375rem 0.75rem",
//                                 borderRadius: "0.25rem",
//                                 cursor: "pointer",
//                               }}
//                           >
//                             View
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="6" className="text-center text-muted">
//                         No data available
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </Card.Body>
//       </Card>

//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Allotment Details for {selectedMobile}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>{renderModalContent()}</Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Fragment>
//   );
// }

// import React, { Fragment, useEffect, useState } from "react";
// import {
//   Card,
//   Spinner,
//   Button,
//   Form,
//   Modal,
//   Table,
//   Alert,
// } from "react-bootstrap";
// import Swal from "sweetalert2";

// export default function GetFullPaymentSummary() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [allotment, setAllotment] = useState({});
//   const [submitting, setSubmitting] = useState("");
//   const [activeRow, setActiveRow] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [modalData, setModalData] = useState(null);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [selectedMobile, setSelectedMobile] = useState("");
//   const [allotmentError, setAllotmentError] = useState({});
//   const [allotmentSuccess, setAllotmentSuccess] = useState({});

//   // ✅ Utility: Format timestamps into IST
//   const formatToIST = (timestamp) => {
//     if (!timestamp) return "N/A";
//     try {
//       const date = new Date(timestamp);
//       return new Intl.DateTimeFormat("en-IN", {
//         timeZone: "Asia/Kolkata",
//         dateStyle: "medium",
//         timeStyle: "short",
//       }).format(date);
//     } catch {
//       return timestamp;
//     }
//   };

//   useEffect(() => {
//     fetchSummary();
//   }, []);

//   const fetchSummary = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getFullPayment",
//         { method: "GET", redirect: "follow" }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const result = await response.json();
//       setData(result.summary || []);
//     } catch (err) {
//       console.error("Error fetching summary:", err);
//       setError("Failed to fetch payment summary.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAllotment = async (mobile) => {
//     const gram = allotment[mobile];
//     if (!gram || gram <= 0) {
//       setAllotmentError({
//         ...allotmentError,
//         [mobile]: "Please enter a valid gram value.",
//       });
//       return;
//     }

//     const userData = data.find((item) => item.mobile === mobile);
//     if (!userData) {
//       setAllotmentError({
//         ...allotmentError,
//         [mobile]: "User data not found.",
//       });
//       return;
//     }

//     if (Number(gram) > userData.totalGrams) {
//       setAllotmentError({
//         ...allotmentError,
//         [mobile]: "Not enough grams to allot.",
//       });

//       // ❌ Error Alert
//       Swal.fire({
//         icon: "error",
//         title: "Invalid Allotment",
//         text: "Not enough grams to allot.",
//       });

//       return;
//     }

//     setSubmitting(mobile);
//     setAllotmentError({ ...allotmentError, [mobile]: "" });
//     setAllotmentSuccess({ ...allotmentSuccess, [mobile]: "" });

//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/setAllotment",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ mobile, gram: Number(gram) }),
//         }
//       );

//       const result = await response.json().catch(() => null);

//       if (response.ok) {
//         setAllotmentSuccess({
//           ...allotmentSuccess,
//           [mobile]: result?.message || "Allotment successful!",
//         });

//         // ✅ Success Alert
//         Swal.fire({
//           icon: "success",
//           title: "Success",
//           text: result?.message || "Allotment successful!",
//         });

//         setActiveRow("");
//         setAllotment({ ...allotment, [mobile]: "" });
//         fetchSummary();
//       } else {
//         setAllotmentError({
//           ...allotmentError,
//           [mobile]: result?.message || "Failed to set allotment.",
//         });

//         // ❌ Error Alert
//         Swal.fire({
//           icon: "error",
//           title: "Failed",
//           text: result?.message || "Failed to set allotment.",
//         });
//       }
//     } catch (error) {
//       console.error("Error in setAllotment:", error);
//       setAllotmentError({
//         ...allotmentError,
//         [mobile]: "Server error, please try again later.",
//       });

//       Swal.fire({
//         icon: "error",
//         title: "Server Error",
//         text: "Please try again later.",
//       });
//     } finally {
//       setSubmitting("");
//     }
//   };

//   const handleView = async (mobile) => {
//     setSelectedMobile(mobile);
//     setModalLoading(true);
//     setShowModal(true);
//     setModalData(null);

//     try {
//       const response = await fetch(
//         `http://13.204.96.244:3000/api/getByUserAllotment?mobile=${mobile}`,
//         { method: "GET", redirect: "follow" }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log("API Response:", result);

//       let dataArray = [];
//       if (Array.isArray(result)) {
//         dataArray = result;
//       } else if (result.data && Array.isArray(result.data)) {
//         dataArray = result.data;
//       } else if (result.allotments && Array.isArray(result.allotments)) {
//         dataArray = result.allotments;
//       }

//       const cleanedData = dataArray.map((item) => {
//         const { _id, __v, ...rest } = item;
//         return rest;
//       });

//       setModalData(cleanedData);
//     } catch (error) {
//       console.error("Error fetching allotment:", error);
//       setModalData({
//         error: "Failed to fetch data. Please check the console for details.",
//       });
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   // ✅ Render Modal Content
//   const renderModalContent = () => {
//     if (modalLoading) {
//       return (
//         <div className="text-center">
//           <Spinner animation="border" variant="primary" />
//           <p className="mt-2">Loading data for {selectedMobile}...</p>
//         </div>
//       );
//     }

//     if (!modalData) {
//       return <Alert variant="warning">No data received from server.</Alert>;
//     }

//     if (modalData.error) {
//       return <Alert variant="danger">{modalData.error}</Alert>;
//     }

//     if (!Array.isArray(modalData) || modalData.length === 0) {
//       return (
//         <Alert variant="info">
//           No allotment records found for {selectedMobile}.
//         </Alert>
//       );
//     }

//     const allKeys = [
//       ...new Set(modalData.flatMap((item) => Object.keys(item))),
//     ];

//     return (
//       <div className="table-responsive">
//         <Table bordered striped hover>
//           <thead>
//             <tr>
//               {allKeys.map((key) => (
//                 <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {modalData.map((row, idx) => (
//               <tr key={idx}>
//                 {allKeys.map((key) => (
//                   <td key={key}>
//                     {row[key] !== undefined
//                       ? key.toLowerCase().includes("time") ||
//                         key.toLowerCase().includes("date")
//                         ? formatToIST(row[key])
//                         : row[key]
//                       : "N/A"}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>
//     );
//   };

//   return (
//     <Fragment>
//       <Card className="shadow-sm">
//         <Card.Body>
//           <div
//             className="card-title main-content-label"
//             style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
//           >
//             Allotment Management
//           </div>

//           {loading ? (
//             <div className="text-center">
//               <Spinner animation="border" variant="primary" />
//             </div>
//           ) : error ? (
//             <div className="text-danger text-center">{error}</div>
//           ) : (
//             <div className="table-responsive">
//               <table className="table table-bordered table-striped">
//                 <thead>
//                   <tr>
//                     <th>S.No</th>
//                     <th>Mobile</th>
//                     <th>Total Amount</th>
//                     <th>Total Grams</th>
//                     <th>Action</th>
//                     <th>View</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data.length > 0 ? (
//                     data.map((item, index) => (
//                       <tr key={item.mobile}>
//                         <td>{index + 1}</td>
//                         <td>{item.mobile}</td>
//                         <td>₹ {item.totalAmount.toFixed(2)}</td>
//                         <td>{item.totalGrams} g</td>
//                         <td>
//                           {activeRow === item.mobile ? (
//                             <div>
//                               <div className="d-flex gap-2 mb-2">
//                                 <Form.Control
//                                   type="number"
//                                   placeholder="Enter grams"
//                                   value={allotment[item.mobile] || ""}
//                                   onChange={(e) => {
//                                     setAllotment({
//                                       ...allotment,
//                                       [item.mobile]: e.target.value,
//                                     });
//                                     setAllotmentError({
//                                       ...allotmentError,
//                                       [item.mobile]: "",
//                                     });
//                                     setAllotmentSuccess({
//                                       ...allotmentSuccess,
//                                       [item.mobile]: "",
//                                     });
//                                   }}
//                                   style={{ width: "120px" }}
//                                   max={item.totalGrams}
//                                 />
//                                 <Button
//                                   variant="success"
//                                   size="sm"
//                                   disabled={submitting === item.mobile}
//                                   onClick={() => handleAllotment(item.mobile)}
//                                 >
//                                   {submitting === item.mobile
//                                     ? "Submitting..."
//                                     : "Confirm"}
//                                 </Button>
//                                 <Button
//                                   variant="secondary"
//                                   size="sm"
//                                   onClick={() => {
//                                     setActiveRow("");
//                                     setAllotmentError({
//                                       ...allotmentError,
//                                       [item.mobile]: "",
//                                     });
//                                     setAllotmentSuccess({
//                                       ...allotmentSuccess,
//                                       [item.mobile]: "",
//                                     });
//                                   }}
//                                 >
//                                   Cancel
//                                 </Button>
//                               </div>
//                               {allotmentError[item.mobile] && (
//                                 <div className="text-danger small">
//                                   {allotmentError[item.mobile]}
//                                 </div>
//                               )}
//                               {allotmentSuccess[item.mobile] && (
//                                 <div className="text-success small">
//                                   {allotmentSuccess[item.mobile]}
//                                 </div>
//                               )}
//                             </div>
//                           ) : (
//                             <button
//                               size="sm"
//                               onClick={() => setActiveRow(item.mobile)}
//                               style={{
//                                 backgroundColor: "#082038",
//                                 border: "1px solid #082038",
//                                 color: "#fff",
//                                 padding: "0.375rem 0.75rem",
//                                 borderRadius: "0.25rem",
//                                 cursor: "pointer",
//                               }}
//                             >
//                               Set Allotment
//                             </button>
//                           )}
//                         </td>
//                         <td>
//                           <button
//                             size="sm"
//                             onClick={() => handleView(item.mobile)}
//                             style={{
//                               backgroundColor: "#082038",
//                               border: "1px solid #082038",
//                               color: "#fff",
//                               padding: "0.375rem 0.75rem",
//                               borderRadius: "0.25rem",
//                               cursor: "pointer",
//                             }}
//                           >
//                             View
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="6" className="text-center text-muted">
//                         No data available
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </Card.Body>
//       </Card>

//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Allotment Details for {selectedMobile}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>{renderModalContent()}</Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Fragment>
//   );
// }



import React, { Fragment, useEffect, useState } from "react";
import {
  Card,
  Spinner,
  Button,
  Form,
  Modal,
  Table,
  Alert,
} from "react-bootstrap";
import Swal from "sweetalert2";

export default function GetFullPaymentSummary() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allotment, setAllotment] = useState({});
  const [submitting, setSubmitting] = useState("");
  const [activeRow, setActiveRow] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedMobile, setSelectedMobile] = useState("");
  const [allotmentError, setAllotmentError] = useState({});
  const [allotmentSuccess, setAllotmentSuccess] = useState({});

  // ✅ Utility: Format timestamps into IST
  const formatToIST = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
    } catch {
      return timestamp;
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/getFullPayment",
        { method: "GET", redirect: "follow" }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      // ✅ Clean and normalize data
      const cleanedSummary = (result.summary || []).map((item) => ({
        ...item,
        totalAmount: Number(item.totalAmount) || 0,
        totalGrams: Number(item.totalGrams) || 0,
      }));

      setData(cleanedSummary);
    } catch (err) {
      console.error("Error fetching summary:", err);
      setError("Failed to fetch payment summary.");
    } finally {
      setLoading(false);
    }
  };

  const handleAllotment = async (mobile) => {
    const gram = allotment[mobile];
    if (!gram || gram <= 0) {
      setAllotmentError({
        ...allotmentError,
        [mobile]: "Please enter a valid gram value.",
      });
      return;
    }

    const userData = data.find((item) => item.mobile === mobile);
    if (!userData) {
      setAllotmentError({
        ...allotmentError,
        [mobile]: "User data not found.",
      });
      return;
    }

    if (Number(gram) > userData.totalGrams) {
      setAllotmentError({
        ...allotmentError,
        [mobile]: "Not enough grams to allot.",
      });

      Swal.fire({
        icon: "error",
        title: "Invalid Allotment",
        text: "Not enough grams to allot.",
      });

      return;
    }

    setSubmitting(mobile);
    setAllotmentError({ ...allotmentError, [mobile]: "" });
    setAllotmentSuccess({ ...allotmentSuccess, [mobile]: "" });

    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/setAllotment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile, gram: Number(gram) }),
        }
      );

      const result = await response.json().catch(() => null);

      if (response.ok) {
        setAllotmentSuccess({
          ...allotmentSuccess,
          [mobile]: result?.message || "Allotment successful!",
        });

        Swal.fire({
          icon: "success",
          title: "Success",
          text: result?.message || "Allotment successful!",
        });

        setActiveRow("");
        setAllotment({ ...allotment, [mobile]: "" });
        fetchSummary();
      } else {
        setAllotmentError({
          ...allotmentError,
          [mobile]: result?.message || "Failed to set allotment.",
        });

        Swal.fire({
          icon: "error",
          title: "Failed",
          text: result?.message || "Failed to set allotment.",
        });
      }
    } catch (error) {
      console.error("Error in setAllotment:", error);
      setAllotmentError({
        ...allotmentError,
        [mobile]: "Server error, please try again later.",
      });

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Please try again later.",
      });
    } finally {
      setSubmitting("");
    }
  };

  const handleView = async (mobile) => {
    setSelectedMobile(mobile);
    setModalLoading(true);
    setShowModal(true);
    setModalData(null);

    try {
      const response = await fetch(
        `http://13.204.96.244:3000/api/getByUserAllotment?mobile=${mobile}`,
        { method: "GET", redirect: "follow" }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      let dataArray = [];
      if (Array.isArray(result)) {
        dataArray = result;
      } else if (result.data && Array.isArray(result.data)) {
        dataArray = result.data;
      } else if (result.allotments && Array.isArray(result.allotments)) {
        dataArray = result.allotments;
      }

      const cleanedData = dataArray.map((item) => {
        const { _id, __v, ...rest } = item;
        return rest;
      });

      setModalData(cleanedData);
    } catch (error) {
      console.error("Error fetching allotment:", error);
      setModalData({
        error: "Failed to fetch data. Please check the console for details.",
      });
    } finally {
      setModalLoading(false);
    }
  };

  const renderModalContent = () => {
    if (modalLoading) {
      return (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading data for {selectedMobile}...</p>
        </div>
      );
    }

    if (!modalData) {
      return <Alert variant="warning">No data received from server.</Alert>;
    }

    if (modalData.error) {
      return <Alert variant="danger">{modalData.error}</Alert>;
    }

    if (!Array.isArray(modalData) || modalData.length === 0) {
      return (
        <Alert variant="info">
          No allotment records found for {selectedMobile}.
        </Alert>
      );
    }

    const allKeys = [
      ...new Set(modalData.flatMap((item) => Object.keys(item))),
    ];

    return (
      <div className="table-responsive">
        <Table bordered striped hover>
          <thead>
            <tr>
              {allKeys.map((key) => (
                <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modalData.map((row, idx) => (
              <tr key={idx}>
                {allKeys.map((key) => (
                  <td key={key}>
                    {row[key] !== undefined
                      ? key.toLowerCase().includes("time") ||
                        key.toLowerCase().includes("date")
                        ? formatToIST(row[key])
                        : row[key]
                      : "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  return (
    <Fragment>
      <Card className="shadow-sm">
        <Card.Body>
          <div
            className="card-title main-content-label"
            style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
          >
            Allotment Management
          </div>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
            <div className="text-danger text-center">{error}</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Mobile</th>
                    <th>Total Amount</th>
                    <th>Total Grams</th>
                    <th>Action</th>
                    <th>View</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <tr key={item.mobile}>
                        <td>{index + 1}</td>
                        <td>{item.mobile}</td>
                        <td>₹ {item.totalAmount.toFixed(2)}</td>
                        <td>{item.totalGrams} g</td>
                        <td>
                          {activeRow === item.mobile ? (
                            <div>
                              <div className="d-flex gap-2 mb-2">
                                <Form.Control
                                  type="number"
                                  placeholder="Enter grams"
                                  value={allotment[item.mobile] || ""}
                                  onChange={(e) => {
                                    setAllotment({
                                      ...allotment,
                                      [item.mobile]: e.target.value,
                                    });
                                    setAllotmentError({
                                      ...allotmentError,
                                      [item.mobile]: "",
                                    });
                                    setAllotmentSuccess({
                                      ...allotmentSuccess,
                                      [item.mobile]: "",
                                    });
                                  }}
                                  style={{ width: "120px" }}
                                  max={item.totalGrams}
                                />
                                <Button
                                  variant="success"
                                  size="sm"
                                  disabled={submitting === item.mobile}
                                  onClick={() => handleAllotment(item.mobile)}
                                >
                                  {submitting === item.mobile
                                    ? "Submitting..."
                                    : "Confirm"}
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => {
                                    setActiveRow("");
                                    setAllotmentError({
                                      ...allotmentError,
                                      [item.mobile]: "",
                                    });
                                    setAllotmentSuccess({
                                      ...allotmentSuccess,
                                      [item.mobile]: "",
                                    });
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                              {allotmentError[item.mobile] && (
                                <div className="text-danger small">
                                  {allotmentError[item.mobile]}
                                </div>
                              )}
                              {allotmentSuccess[item.mobile] && (
                                <div className="text-success small">
                                  {allotmentSuccess[item.mobile]}
                                </div>
                              )}
                            </div>
                          ) : (
                            <button
                              size="sm"
                              onClick={() => setActiveRow(item.mobile)}
                              style={{
                                backgroundColor: "#082038",
                                border: "1px solid #082038",
                                color: "#fff",
                                padding: "0.375rem 0.75rem",
                                borderRadius: "0.25rem",
                                cursor: "pointer",
                              }}
                            >
                              Set Allotment
                            </button>
                          )}
                        </td>
                        <td>
                          <button
                            size="sm"
                            onClick={() => handleView(item.mobile)}
                            style={{
                              backgroundColor: "#082038",
                              border: "1px solid #082038",
                              color: "#fff",
                              padding: "0.375rem 0.75rem",
                              borderRadius: "0.25rem",
                              cursor: "pointer",
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Allotment Details for {selectedMobile}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderModalContent()}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}

