// import React, { Fragment, useEffect, useState, useCallback } from "react";
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

// export default function GetCatalogAllotments() {
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

//   // ✅ Format timestamps to IST
//   const formatToIST = useCallback((timestamp) => {
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
//   }, []);

//   // ✅ Normalize API response data
//   const normalizeData = useCallback((result) => {
//     let dataArray = [];

//     if (Array.isArray(result)) {
//       dataArray = result;
//     } else if (result?.data) {
//       if (Array.isArray(result.data)) {
//         dataArray = result.data;
//       } else {
//         dataArray = [result.data];
//       }
//     }

//     return dataArray.map((item, idx) => ({
//       ...item,
//       serial: idx + 1,
//       totalAmount: Number(item.amount || item.totalAmount) || 0,
//       totalGrams: Number(item.grams || item.totalGrams) || 0,
//       catalogID: item._id || item.catalogID,
//     }));
//   }, []);

//   // ✅ Fetch catalog payments
//   const fetchCatalogPayments = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getCatalogPayment",
//         { 
//           method: "GET", 
//           headers: {
//             'Accept': 'application/json',
//           }
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log("📌 API Response:", result);

//       const cleaned = normalizeData(result);
//       setData(cleaned);
//     } catch (err) {
//       console.error("Error fetching catalog payments:", err);
//       setError("Failed to fetch catalog payments. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   }, [normalizeData]);

//   useEffect(() => {
//     fetchCatalogPayments();
//   }, [fetchCatalogPayments]);

//   // ✅ Handle allotment
//   const handleAllotment = async (mobileNumber, catalogID, availableGrams) => {
//     const gramValue = Number(allotment[mobileNumber]);
    
//     if (!gramValue || gramValue <= 0) {
//       setAllotmentError({
//         ...allotmentError,
//         [mobileNumber]: "Please enter a valid gram value.",
//       });
//       return;
//     }
    
//     if (gramValue > availableGrams) {
//       setAllotmentError({
//         ...allotmentError,
//         [mobileNumber]: `Cannot allot more than ${availableGrams}g.`,
//       });
//       return;
//     }

//     setSubmitting(mobileNumber);
//     setAllotmentError({ ...allotmentError, [mobileNumber]: "" });
//     setAllotmentSuccess({ ...allotmentSuccess, [mobileNumber]: "" });

//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/setCatalogAllotment",
//         {
//           method: "POST",
//           headers: { 
//             "Content-Type": "application/json",
//             "Accept": "application/json"
//           },
//           body: JSON.stringify({ 
//             mobileNumber, 
//             catalogID, 
//             gram: gramValue 
//           }),
//         }
//       );

//       const result = await response.json().catch(() => ({}));

//       if (response.ok) {
//         setAllotmentSuccess({
//           ...allotmentSuccess,
//           [mobileNumber]: result?.message || "Allotment successful!",
//         });

//         Swal.fire({
//           title: "Success", 
//           text: result?.message || "Allotment successful!", 
//           icon: "success",
//           timer: 2000,
//           showConfirmButton: false
//         });
        
//         setActiveRow("");
//         setAllotment({ ...allotment, [mobileNumber]: "" });
//         fetchCatalogPayments();
//       } else {
//         const errorMsg = result?.message || "Failed to set allotment.";
//         setAllotmentError({
//           ...allotmentError,
//           [mobileNumber]: errorMsg,
//         });
//         Swal.fire("Failed", errorMsg, "error");
//       }
//     } catch (err) {
//       console.error("Error in setCatalogAllotment:", err);
//       Swal.fire("Error", "Server error, please try again later.", "error");
//     } finally {
//       setSubmitting("");
//     }
//   };

//   // ✅ Handle view catalog allotments (per user) - UPDATED API CALL
//   const handleView = async (mobile) => {
//     setSelectedMobile(mobile);
//     setModalLoading(true);
//     setShowModal(true);
//     setModalData(null);

//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getbyUserCatalog",
//         {
//           method: "POST",
//           headers: { 
//             "Content-Type": "application/json",
//             "Accept": "application/json"
//           },
//           body: JSON.stringify({ 
//             mobileNumber: mobile
//           }),
//         }
//       );

//       if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//       const result = await response.json();
//       console.log("User catalog response:", result);
      
//       let dataArray = [];
      
//       if (Array.isArray(result)) {
//         dataArray = result;
//       } else if (result?.data) {
//         dataArray = Array.isArray(result.data) ? result.data : [result.data];
//       } else if (result?.catalogs) {
//         dataArray = Array.isArray(result.catalogs) ? result.catalogs : [result.catalogs];
//       } else if (result) {
//         // If the response is a single object, wrap it in an array
//         dataArray = [result];
//       }

//       setModalData(dataArray);
//     } catch (err) {
//       console.error("Error fetching user catalog details:", err);
//       setModalData([]);
//       Swal.fire("Error", "Failed to fetch user catalog details.", "error");
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   // ✅ Render modal content - UPDATED to show only specific fields
//   const renderModalContent = () => {
//     if (modalLoading) {
//       return (
//         <div className="text-center">
//           <Spinner animation="border" variant="primary" />
//           <p className="mt-2">Loading catalog data for {selectedMobile}...</p>
//         </div>
//       );
//     }
    
//     if (!modalData || modalData.length === 0) {
//       return <Alert variant="info">No catalog items found for {selectedMobile}.</Alert>;
//     }

//     // Define the specific columns we want to show
//     const columnsToShow = ['tagid', 'address' , 'postCode', 'amount','createdAt'];
    
//     return (
//       <div className="table-responsive">
//         <Table bordered striped hover>
//           <thead>
//             <tr>
//               {columnsToShow.map((key) => (
//                 <th key={key}>
//                   {key === 'createdAt' ? 'Timestamp' : 
//                    key === 'tagid' ? 'Tag ID' :
//                    key === 'postCode' ? 'Post Code' :
//                    key.charAt(0).toUpperCase() + key.slice(1)}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {modalData.map((row, idx) => (
//               <tr key={idx}>
//                 {columnsToShow.map((key) => (
//                   <td key={key}>
//                     {row[key] !== undefined && row[key] !== null
//                       ? key.toLowerCase().includes("createdat")
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

//   // ✅ Reset form for a specific user
//   const resetForm = (mobileNumber) => {
//     setActiveRow("");
//     setAllotment({ ...allotment, [mobileNumber]: "" });
//     setAllotmentError({ ...allotmentError, [mobileNumber]: "" });
//     setAllotmentSuccess({ ...allotmentSuccess, [mobileNumber]: "" });
//   };

//   return (
//     <Fragment>
//       <Card className="shadow-sm">
//         <Card.Body>
//           <div
//             className="card-title main-content-label"
//             style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
//           >
//             Catalog Allotment 
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
//                     <th>Tag ID</th>
//                     <th>Total Amount</th>
//                     <th>Total Grams</th>
//                     <th>Action</th>
//                     <th>View Catalog</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data.length > 0 ? (
//                     data.map((item) => (
//                       <tr key={`${item.mobileNumber}-${item.tagid}`}>
//                         <td>{item.serial}</td>
//                         <td>{item.mobileNumber}</td>
//                         <td>{item.tagid}</td>
//                         <td>₹ {item.totalAmount.toFixed(2)}</td>
//                         <td>{item.totalGrams} g</td>
//                         <td>
//                           {activeRow === item.mobileNumber ? (
//                             <div>
//                               <div className="d-flex gap-2 mb-2">
//                                 <Form.Control
//                                   type="number"
//                                   placeholder="Enter grams"
//                                   value={allotment[item.mobileNumber] || ""}
//                                   onChange={(e) => {
//                                     const value = e.target.value;
//                                     setAllotment({
//                                       ...allotment,
//                                       [item.mobileNumber]: value,
//                                     });
//                                     setAllotmentError({
//                                       ...allotmentError,
//                                       [item.mobileNumber]: "",
//                                     });
//                                     setAllotmentSuccess({
//                                       ...allotmentSuccess,
//                                       [item.mobileNumber]: "",
//                                     });
//                                   }}
//                                   style={{ width: "120px" }}
//                                   max={item.totalGrams}
//                                   disabled={submitting === item.mobileNumber}
//                                 />
//                                 <Button
//                                   variant="success"
//                                   size="sm"
//                                   disabled={submitting === item.mobileNumber || !allotment[item.mobileNumber]}
//                                   onClick={() =>
//                                     handleAllotment(item.mobileNumber, item.catalogID, item.totalGrams)
//                                   }
//                                 >
//                                   {submitting === item.mobileNumber
//                                     ? "Submitting..."
//                                     : "Confirm"}
//                                 </Button>
//                                 <Button
//                                   variant="secondary"
//                                   size="sm"
//                                   onClick={() => resetForm(item.mobileNumber)}
//                                   disabled={submitting === item.mobileNumber}
//                                 >
//                                   Cancel
//                                 </Button>
//                               </div>
//                               {allotmentError[item.mobileNumber] && (
//                                 <div className="text-danger small">
//                                   {allotmentError[item.mobileNumber]}
//                                 </div>
//                               )}
//                               {allotmentSuccess[item.mobileNumber] && (
//                                 <div className="text-success small">
//                                   {allotmentSuccess[item.mobileNumber]}
//                                 </div>
//                               )}
//                             </div>
//                           ) : (
//                             <button
//                               size="sm"
//                               onClick={() => setActiveRow(item.mobileNumber)}
//                               disabled={item.totalGrams <= 0}
//                               style={{
//                                 backgroundColor: item.totalGrams <= 0 ? "#6c757d" : "#082038",
//                                 border: "1px solid #082038",
//                                 color: "#fff",
//                                 padding: "0.375rem 0.75rem",
//                                 borderRadius: "0.25rem",
//                                 cursor: item.totalGrams <= 0 ? "not-allowed" : "pointer",
//                               }}
//                             >
//                               Catalog Allotment
//                             </button>
//                           )}
//                         </td>
//                         <td>
//                           <button
//                             size="sm"
//                             onClick={() => handleView(item.mobileNumber)}
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
//                       <td colSpan="7" className="text-center text-muted">
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

//       {/* Modal for viewing catalog details */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Catalog Details for {selectedMobile}</Modal.Title>
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


// import React, { Fragment, useEffect, useState, useCallback } from "react";
// import {
//   Card,
//   Spinner,
//   Button,
//   Modal,
//   Table,
//   Alert,
// } from "react-bootstrap";
// import Swal from "sweetalert2";

// export default function GetCatalogAllotments() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [submitting, setSubmitting] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [modalData, setModalData] = useState(null);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [selectedMobile, setSelectedMobile] = useState("");

//   // ✅ Format timestamps to IST
//   const formatToIST = useCallback((timestamp) => {
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
//   }, []);

//   // ✅ Normalize API response data
//   const normalizeData = useCallback((result) => {
//     let dataArray = [];

//     if (Array.isArray(result)) {
//       dataArray = result;
//     } else if (result?.data) {
//       if (Array.isArray(result.data)) {
//         dataArray = result.data;
//       } else {
//         dataArray = [result.data];
//       }
//     }

//     return dataArray.map((item, idx) => ({
//       ...item,
//       serial: idx + 1,
//       totalAmount: Number(item.amount || item.totalAmount) || 0,
//       totalGrams: Number(item.grams || item.totalGrams) || 0,
//       catalogID: item._id || item.catalogID,
//       delivered: item.delivered || false, // track delivery status
//     }));
//   }, []);

//   // ✅ Fetch catalog payments
//   const fetchCatalogPayments = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getCatalogPayment",
//         { method: "GET", headers: { Accept: "application/json" } }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log("📌 API Response:", result);

//       const cleaned = normalizeData(result);
//       setData(cleaned);
//     } catch (err) {
//       console.error("Error fetching catalog payments:", err);
//       setError("Failed to fetch catalog payments. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   }, [normalizeData]);

//   useEffect(() => {
//     fetchCatalogPayments();
//   }, [fetchCatalogPayments]);

//   // ✅ Handle direct allotment (Delivered)
//   const handleDelivered = async (mobileNumber, catalogID, availableGrams) => {
//     if (availableGrams <= 0) {
//       Swal.fire("Error", "No grams available for allotment.", "error");
//       return;
//     }

//     setSubmitting(mobileNumber);
//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/setCatalogAllotment",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//           body: JSON.stringify({
//             mobileNumber,
//             catalogID,
//             gram: availableGrams, // ✅ automatically allot all available grams
//           }),
//         }
//       );

//       const result = await response.json().catch(() => ({}));

//       if (response.ok) {
//         Swal.fire({
//           title: "Delivered",
//           text: result?.message || "Catalog marked as delivered!",
//           icon: "success",
//           timer: 2000,
//           showConfirmButton: false,
//         });

//         // ✅ Update only the matching row, not all rows
//         setData((prev) =>
//           prev.map((item) =>
//             item.mobileNumber === mobileNumber && item.catalogID === catalogID
//               ? { ...item, delivered: true }
//               : item
//           )
//         );
//       } else {
//         Swal.fire("Failed", result?.message || "Failed to set allotment.", "error");
//       }
//     } catch (err) {
//       console.error("Error in setCatalogAllotment:", err);
//       Swal.fire("Error", "Server error, please try again later.", "error");
//     } finally {
//       setSubmitting("");
//     }
//   };

//   // ✅ Handle view catalog allotments
//   const handleView = async (mobile) => {
//     setSelectedMobile(mobile);
//     setModalLoading(true);
//     setShowModal(true);
//     setModalData(null);

//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getbyUserCatalog",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//           body: JSON.stringify({ mobileNumber: mobile }),
//         }
//       );

//       if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//       const result = await response.json();
//       console.log("User catalog response:", result);

//       let dataArray = [];

//       if (Array.isArray(result)) {
//         dataArray = result;
//       } else if (result?.data) {
//         dataArray = Array.isArray(result.data) ? result.data : [result.data];
//       } else if (result?.catalogs) {
//         dataArray = Array.isArray(result.catalogs)
//           ? result.catalogs
//           : [result.catalogs];
//       } else if (result) {
//         dataArray = [result];
//       }

//       setModalData(dataArray);
//     } catch (err) {
//       console.error("Error fetching user catalog details:", err);
//       setModalData([]);
//       Swal.fire("Error", "Failed to fetch user catalog details.", "error");
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   // ✅ Render modal content
//   const renderModalContent = () => {
//     if (modalLoading) {
//       return (
//         <div className="text-center">
//           <Spinner animation="border" variant="primary" />
//           <p className="mt-2">Loading catalog data for {selectedMobile}...</p>
//         </div>
//       );
//     }

//     if (!modalData || modalData.length === 0) {
//       return (
//         <Alert variant="info">
//           No catalog items found for {selectedMobile}.
//         </Alert>
//       );
//     }

//     const columnsToShow = ["tagid", "address", "postCode", "amount", "createdAt"];

//     return (
//       <div className="table-responsive">
//         <Table bordered striped hover>
//           <thead>
//             <tr>
//               {columnsToShow.map((key) => (
//                 <th key={key}>
//                   {key === "createdAt"
//                     ? "Timestamp"
//                     : key === "tagid"
//                     ? "Tag ID"
//                     : key === "postCode"
//                     ? "Post Code"
//                     : key.charAt(0).toUpperCase() + key.slice(1)}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {modalData.map((row, idx) => (
//               <tr key={idx}>
//                 {columnsToShow.map((key) => (
//                   <td key={key}>
//                     {row[key] !== undefined && row[key] !== null
//                       ? key.toLowerCase().includes("createdat")
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
//             Catalog Allotment
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
//                     <th>Tag ID</th>
//                     <th>Total Amount</th>
//                     <th>Total Grams</th>
//                     <th>Status</th>
//                     <th>View Catalog</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data.length > 0 ? (
//                     data.map((item) => (
//                       <tr key={`${item.mobileNumber}-${item.tagid}`}>
//                         <td>{item.serial}</td>
//                         <td>{item.mobileNumber}</td>
//                         <td>{item.tagid}</td>
//                         <td>₹ {item.totalAmount.toFixed(2)}</td>
//                         <td>{item.totalGrams} g</td>
//                         <td>
//                           {item.delivered ? (
//                             <span className="badge bg-success">Delivered</span>
//                           ) : (
//                             <button
//                               size="sm"
//                               onClick={() =>
//                                 handleDelivered(
//                                   item.mobileNumber,
//                                   item.catalogID,
//                                   item.totalGrams
//                                 )
//                               }
//                               disabled={
//                                 submitting === item.mobileNumber ||
//                                 item.totalGrams <= 0
//                               }
//                               style={{
//                                 backgroundColor:
//                                   item.totalGrams <= 0 ? "#6c757d" : "#082038",
//                                 border: "1px solid #082038",
//                                 color: "#fff",
//                                 padding: "0.375rem 0.75rem",
//                                 borderRadius: "0.25rem",
//                                 cursor:
//                                   item.totalGrams <= 0 ? "not-allowed" : "pointer",
//                               }}
//                             >
//                               {submitting === item.mobileNumber
//                                 ? "Submitting..."
//                                 : "Catalog Allotment"}
//                             </button>
//                           )}
//                         </td>
//                         <td>
//                           <button
//                             size="sm"
//                             onClick={() => handleView(item.mobileNumber)}
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
//                       <td colSpan="7" className="text-center text-muted">
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
//           <Modal.Title>Catalog Details for {selectedMobile}</Modal.Title>
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

// import React, { Fragment, useEffect, useState, useCallback } from "react";
// import { Card, Spinner, Button, Modal, Table, Alert } from "react-bootstrap";
// import Swal from "sweetalert2";

// export default function GetCatalogAllotments() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [submitting, setSubmitting] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [modalData, setModalData] = useState(null);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [selectedMobile, setSelectedMobile] = useState("");

//   // Format timestamps to IST
//   const formatToIST = useCallback((timestamp) => {
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
//   }, []);

//   // Normalize API response data
//   const normalizeData = useCallback((result) => {
//     let dataArray = [];

//     if (Array.isArray(result)) {
//       dataArray = result;
//     } else if (result?.data) {
//       dataArray = Array.isArray(result.data) ? result.data : [result.data];
//     }

//     return dataArray.map((item, idx) => ({
//       ...item,
//       serial: idx + 1,
//       totalAmount: Number(item.amount || item.totalAmount) || 0,
//       totalGrams: Number(item.grams || item.totalGrams) || 0,
//       catalogID: item._id || item.catalogID,
//       delivered:
//         item.allotmentStatus?.toLowerCase() === "delivered" || false, // ✅ Use backend delivered status
//     }));
//   }, []);

//   // Fetch catalog payments
//   const fetchCatalogPayments = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getCatalogPayment",
//         { method: "GET", headers: { Accept: "application/json" } }
//       );

//       if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//       const result = await response.json();
//       console.log("📌 API Response:", result);

//       const cleaned = normalizeData(result);
//       setData(cleaned);
//     } catch (err) {
//       console.error("Error fetching catalog payments:", err);
//       setError("Failed to fetch catalog payments. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   }, [normalizeData]);

//   useEffect(() => {
//     fetchCatalogPayments();
//   }, [fetchCatalogPayments]);

//   // Handle direct allotment (Delivered)
//   const handleDelivered = async (mobileNumber, catalogID, availableGrams) => {
//     if (availableGrams <= 0) {
//       Swal.fire("Error", "No grams available for allotment.", "error");
//       return;
//     }

//     setSubmitting(mobileNumber);
//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/setCatalogAllotment",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//           body: JSON.stringify({
//             mobileNumber,
//             catalogID,
//             gram: availableGrams,
//           }),
//         }
//       );

//       const result = await response.json().catch(() => ({}));

//       if (response.ok) {
//         Swal.fire({
//           title: "Delivered",
//           text: result?.message || "Catalog marked as delivered!",
//           icon: "success",
//           timer: 2000,
//           showConfirmButton: false,
//         });

//         // Update only the matching row using backend delivered status
//         setData((prev) =>
//           prev.map((item) =>
//             item.mobileNumber === mobileNumber && item.catalogID === catalogID
//               ? { ...item, delivered: true }
//               : item
//           )
//         );
//       } else {
//         Swal.fire(
//           "Failed",
//           result?.message || "Failed to set allotment.",
//           "error"
//         );
//       }
//     } catch (err) {
//       console.error("Error in setCatalogAllotment:", err);
//       Swal.fire("Error", "Server error, please try again later.", "error");
//     } finally {
//       setSubmitting("");
//     }
//   };

//   // Handle view catalog allotments
//   const handleView = async (mobile) => {
//     setSelectedMobile(mobile);
//     setModalLoading(true);
//     setShowModal(true);
//     setModalData(null);

//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getbyUserCatalog",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//           body: JSON.stringify({ mobileNumber: mobile }),
//         }
//       );

//       if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//       const result = await response.json();
//       console.log("User catalog response:", result);

//       let dataArray = [];
//       if (Array.isArray(result)) dataArray = result;
//       else if (result?.data) dataArray = Array.isArray(result.data) ? result.data : [result.data];
//       else if (result?.catalogs) dataArray = Array.isArray(result.catalogs) ? result.catalogs : [result.catalogs];
//       else if (result) dataArray = [result];

//       setModalData(dataArray);
//     } catch (err) {
//       console.error("Error fetching user catalog details:", err);
//       setModalData([]);
//       Swal.fire("Error", "Failed to fetch user catalog details.", "error");
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const renderModalContent = () => {
//     if (modalLoading) {
//       return (
//         <div className="text-center">
//           <Spinner animation="border" variant="primary" />
//           <p className="mt-2">Loading catalog data for {selectedMobile}...</p>
//         </div>
//       );
//     }

//     if (!modalData || modalData.length === 0) {
//       return <Alert variant="info">No catalog items found for {selectedMobile}.</Alert>;
//     }

//     const columnsToShow = ["tagid", "address", "postCode", "amount", "createdAt"];

//     return (
//       <div className="table-responsive">
//         <Table bordered striped hover>
//           <thead>
//             <tr>
//               {columnsToShow.map((key) => (
//                 <th key={key}>
//                   {key === "createdAt" ? "Timestamp" : key === "tagid" ? "Tag ID" : key === "postCode" ? "Post Code" : key.charAt(0).toUpperCase() + key.slice(1)}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {modalData.map((row, idx) => (
//               <tr key={idx}>
//                 {columnsToShow.map((key) => (
//                   <td key={key}>
//                     {row[key] !== undefined && row[key] !== null
//                       ? key.toLowerCase().includes("createdat")
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
//           <div className="card-title main-content-label" style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}>
//             Catalog Allotment
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
//                     <th>Tag ID</th>
//                     <th>Total Amount</th>
//                     <th>Total Grams</th>
//                     <th>Status</th>
//                     <th>View Catalog</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data.length > 0 ? (
//                     data.map((item) => (
//                       <tr key={`${item.mobileNumber}-${item.tagid}`}>
//                         <td>{item.serial}</td>
//                         <td>{item.mobileNumber}</td>
//                         <td>{item.tagid}</td>
//                         <td>₹ {item.totalAmount.toFixed(2)}</td>
//                         <td>{item.totalGrams} g</td>
//                         <td>
//                           {item.delivered ? (
//                             <span className="badge bg-success">Delivered</span>
//                           ) : (
//                             <button
//                               size="sm"
//                               onClick={() =>
//                                 handleDelivered(item.mobileNumber, item.catalogID, item.totalGrams)
//                               }
//                               disabled={submitting === item.mobileNumber || item.totalGrams <= 0}
//                               style={{
//                                 backgroundColor: item.totalGrams <= 0 ? "#6c757d" : "#082038",
//                                 border: "1px solid #082038",
//                                 color: "#fff",
//                                 padding: "0.375rem 0.75rem",
//                                 borderRadius: "0.25rem",
//                                 cursor: item.totalGrams <= 0 ? "not-allowed" : "pointer",
//                               }}
//                             >
//                               {submitting === item.mobileNumber ? "Submitting..." : "Catalog Allotment"}
//                             </button>
//                           )}
//                         </td>
//                         <td>
//                           <button
//                             size="sm"
//                             onClick={() => handleView(item.mobileNumber)}
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
//                       <td colSpan="7" className="text-center text-muted">
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
//           <Modal.Title>Catalog Details for {selectedMobile}</Modal.Title>
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


import React, { Fragment, useEffect, useState, useCallback } from "react";
import { Card, Spinner, Button, Modal, Table, Alert } from "react-bootstrap";
import Swal from "sweetalert2";

export default function GetCoinAllotments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedMobile, setSelectedMobile] = useState("");

  // Format timestamps to IST
  const formatToIST = useCallback((timestamp) => {
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
  }, []);

  // Normalize API response data for coin payments
  const normalizeData = useCallback((result) => {
    let dataArray = [];

    if (result.status && Array.isArray(result.data)) {
      dataArray = result.data;
    } else if (Array.isArray(result)) {
      dataArray = result;
    }

    // Filter only approved/payment confirmed payments
    const approvedPayments = dataArray.filter(item => 
      item.status === "Payment Confirmed" || 
      item.status === "approved" ||
      item.status?.toLowerCase().includes("confirmed")
    );

    return approvedPayments.map((item, idx) => ({
      ...item,
      serial: idx + 1,
      totalAmount: Number(item.totalAmount) || 0,
      totalGrams: item.items ? item.items.reduce((sum, curr) => sum + (curr.coinGrams * curr.quantity), 0) : 0,
      coinPaymentID: item._id || item.coinPaymentID,
      delivered: item.allotmentStatus?.toLowerCase() === "delivered" || false,
    }));
  }, []);

  // Fetch coin payments
  const fetchCoinPayments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/getAllCoinPayment",
        { method: "GET", headers: { Accept: "application/json" } }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();
      console.log("📌 Coin Payments API Response:", result);

      const cleaned = normalizeData(result);
      setData(cleaned);
    } catch (err) {
      console.error("Error fetching coin payments:", err);
      setError("Failed to fetch coin payments. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [normalizeData]);

  useEffect(() => {
    fetchCoinPayments();
  }, [fetchCoinPayments]);

  // Handle coin allotment (Delivered) - USING GET METHOD
  const handleDelivered = async (mobileNumber, coinPaymentID, availableGrams) => {
    if (availableGrams <= 0) {
      Swal.fire("Error", "No grams available for allotment.", "error");
      return;
    }

    setSubmitting(mobileNumber);
    try {
      console.log("Sending coin allotment request:", {
        mobileNumber,
        coinPaymentID
      });

      const requestBody = {
        mobileNumber: mobileNumber,
        coinPaymentID: coinPaymentID
      };

      console.log("Request body:", JSON.stringify(requestBody));

      // Using GET method with body (as per your API specification)
      const response = await fetch(
        "http://13.204.96.244:3000/api/setCoinAllotment",
        {
          method: "POST", // Changed to GET
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(requestBody), // Body with GET method
        }
      );

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      if (result.status) {
        Swal.fire({
          title: "Delivered",
          text: result?.message || "Coin marked as delivered!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        // Update the data with the new allotment status
        setData((prev) =>
          prev.map((item) =>
            item.mobileNumber === mobileNumber && item.coinPaymentID === coinPaymentID
              ? { 
                  ...item, 
                  delivered: true, 
                  allotmentStatus: "Delivered",
                  updatedAt: new Date().toISOString() 
                }
              : item
          )
        );
      } else {
        console.error("API Error:", result);
        Swal.fire(
          "Failed",
          result?.message || "Failed to set coin allotment.",
          "error"
        );
      }
    } catch (err) {
      console.error("Error in setCoinAllotment:", err);
      console.error("Error details:", err.message);
      
      // More specific error messages
      if (err.message.includes("Failed to fetch")) {
        Swal.fire("Network Error", "Cannot connect to server. Please check your internet connection and try again.", "error");
      } else if (err.message.includes("HTTP error")) {
        Swal.fire("Server Error", "Server returned an error. Please try again later.", "error");
      } else {
        Swal.fire("Error", "Something went wrong. Please try again.", "error");
      }
    } finally {
      setSubmitting("");
    }
  };

  // Handle view coin payments for specific mobile number
  const handleView = async (mobile) => {
    setSelectedMobile(mobile);
    setModalLoading(true);
    setShowModal(true);
    setModalData(null);

    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/getAllCoinPayment",
        {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();
      console.log("All coin payments response:", result);

      let dataArray = [];
      if (result.status && Array.isArray(result.data)) {
        dataArray = result.data;
      } else if (Array.isArray(result)) {
        dataArray = result;
      }

      // Filter by mobile number and only show approved payments
      const userPayments = dataArray.filter(payment => 
        payment.mobileNumber === mobile && 
        (payment.status === "Payment Confirmed" || payment.status === "approved")
      );

      setModalData(userPayments);
    } catch (err) {
      console.error("Error fetching user coin payments:", err);
      setModalData([]);
      Swal.fire("Error", "Failed to fetch user coin payments.", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const renderModalContent = () => {
    if (modalLoading) {
      return (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading coin payments for {selectedMobile}...</p>
        </div>
      );
    }

    if (!modalData || modalData.length === 0) {
      return <Alert variant="info">No approved coin payments found for {selectedMobile}.</Alert>;
    }

    return (
      <div className="table-responsive">
        <Table bordered striped hover>
          <thead>
            <tr>
              <th>Total Amount</th>
              <th>Tax Amount</th>
              <th>Delivery Charge</th>
              <th>Amount Payable</th>
              <th>Invest Amount</th>
              <th>Status</th>
              <th>Allotment Status</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {modalData.map((row, idx) => (
              <tr key={idx}>
                <td>₹{row.totalAmount?.toLocaleString()}</td>
                <td>₹{row.taxAmount?.toLocaleString()}</td>
                <td>₹{row.deliveryCharge?.toLocaleString()}</td>
                <td>₹{row.amountPayable?.toLocaleString()}</td>
                <td>₹{row.investAmount?.toLocaleString()}</td>
                <td>
                  <span className="badge bg-success">
                    {row.status}
                  </span>
                </td>
                <td>
                  <span className={`badge ${row.allotmentStatus === 'Delivered' ? 'bg-success' : 'bg-secondary'}`}>
                    {row.allotmentStatus || 'Pending'}
                  </span>
                </td>
                <td>{formatToIST(row.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Items Details */}
        {modalData.map((payment, paymentIndex) => (
          payment.items && payment.items.length > 0 && (
            <div key={paymentIndex} className="mt-4">
              <h6>Items for Payment #{paymentIndex + 1}:</h6>
              <Table bordered striped hover size="sm">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Coin Grams</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                    <th>Total Grams</th>
                  </tr>
                </thead>
                <tbody>
                  {payment.items.map((item, itemIndex) => (
                    <tr key={itemIndex}>
                      <td>#{itemIndex + 1}</td>
                      <td>{item.coinGrams}g</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.amount?.toLocaleString()}</td>
                      <td>{item.coinGrams * item.quantity}g</td>
                    </tr>
                  ))}
                  <tr className="fw-bold">
                    <td colSpan="4" className="text-end">Total Grams:</td>
                    <td>{payment.items.reduce((sum, item) => sum + (item.coinGrams * item.quantity), 0)}g</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          )
        ))}
      </div>
    );
  };

  return (
    <Fragment>
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="card-title main-content-label" style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}>
              Coin Allotment
            </div>
            <Button
              variant="primary"
              onClick={fetchCoinPayments}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
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
                    <th>Items Count</th>
                    <th>Status</th>
                    <th>View Payments</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((item) => (
                      <tr key={`${item.mobileNumber}-${item.coinPaymentID}`}>
                        <td>{item.serial}</td>
                        <td>{item.mobileNumber}</td>
                        <td>₹ {item.totalAmount.toLocaleString()}</td>
                        <td>{item.totalGrams} g</td>
                        <td>{item.items ? item.items.length : 0}</td>
                        <td>
                          {item.delivered ? (
                            <span className="badge bg-success">Delivered</span>
                          ) : (
                            <button
                              size="sm"
                              onClick={() =>
                                handleDelivered(item.mobileNumber, item.coinPaymentID, item.totalGrams)
                              }
                              disabled={submitting === item.mobileNumber || item.totalGrams <= 0}
                              style={{
                                backgroundColor: item.totalGrams <= 0 ? "#6c757d" : "#082038",
                                border: "1px solid #082038",
                                color: "#fff",
                                padding: "0.375rem 0.75rem",
                                borderRadius: "0.25rem",
                                cursor: item.totalGrams <= 0 ? "not-allowed" : "pointer",
                              }}
                            >
                              {submitting === item.mobileNumber ? "Submitting..." : "Coin Allotment"}
                            </button>
                          )}
                        </td>
                        <td>
                          <button
                            size="sm"
                            onClick={() => handleView(item.mobileNumber)}
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
                      <td colSpan="7" className="text-center text-muted">
                        No coin payments available for allotment
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Coin Payments for {selectedMobile}</Modal.Title>
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