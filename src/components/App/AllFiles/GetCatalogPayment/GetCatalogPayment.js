// import React, { Fragment, useEffect, useState } from "react";
// import { Button, Card, Spinner, Form, Alert } from "react-bootstrap";
// import Swal from "sweetalert2";
// import {
//   useTable,
//   useSortBy,
//   useGlobalFilter,
//   usePagination,
// } from "react-table";

// export default function GetGoldRecords() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeRow, setActiveRow] = useState(""); 
//   const [submitting, setSubmitting] = useState(""); 
//   const [approveError, setApproveError] = useState({});
//   const [approveSuccess, setApproveSuccess] = useState({});

//   // ✅ Approve Allotment API Call
//   const approveAllotment = async (mobileNumber, catalogID, rowIndex) => {
//     setSubmitting(rowIndex);
//     setApproveError({ ...approveError, [rowIndex]: "" });
//     setApproveSuccess({ ...approveSuccess, [rowIndex]: "" });

//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/setCatalogAllotment",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ mobileNumber, catalogID }),
//         }
//       );

//       const result = await response.json();
//       console.log("Approve API Response:", result);

//       if (result.status) {
//         setApproveSuccess({
//           ...approveSuccess,
//           [rowIndex]: result.message || "Payment approved successfully",
//         });

//         Swal.fire("Success!", result.message || "Payment approved", "success");

//         // ✅ Update UI
//         setData((prev) =>
//           prev.map((item, i) =>
//             i === rowIndex ? { ...item, allotmentStatus: "Approved" } : item
//           )
//         );

//         setActiveRow(""); // close row action
//       } else {
//         setApproveError({
//           ...approveError,
//           [rowIndex]: result.message || "Failed to approve payment",
//         });

//         Swal.fire("Error!", result.message || "Failed to approve payment", "error");
//       }
//     } catch (error) {
//       console.error("Error approving payment:", error);
//       setApproveError({
//         ...approveError,
//         [rowIndex]: "Server error, please try again later.",
//       });

//       Swal.fire("Error!", "Server error, please try again later", "error");
//     } finally {
//       setSubmitting("");
//     }
//   };

//   // ✅ Table columns
//   const COLUMNS = React.useMemo(
//     () => [
//       { Header: "S.No", accessor: "serial", Cell: ({ row }) => row.index + 1 },
//       { Header: "Mobile", accessor: "mobileNumber" },
//       { Header: "Tag ID", accessor: "tagid" },
//       { Header: "Gold Type", accessor: "goldType" },
//       {
//         Header: "Amount",
//         accessor: "amount",
//         Cell: ({ value }) => `₹ ${value?.toLocaleString() || 0}`,
//       },
//       {
//         Header: "Grams",
//         accessor: "grams",
//         Cell: ({ value }) => `${value || 0} g`,
//       },
//       {
//         Header: "Paid Amount",
//         accessor: "Paidamount",
//         Cell: ({ value }) => `₹ ${value?.toLocaleString() || 0}`,
//       },
//       {
//         Header: "Paid Grams",
//         accessor: "Paidgrams",
//         Cell: ({ value }) => `${value || 0} g`,
//       },
//       {
//         Header: "Allotment Status",
//         accessor: "allotmentStatus",
//         Cell: ({ value, row }) => {
//           const rowIndex = row.index;

//           if (value === "Approved") {
//             return (
//               <span className="badge bg-success px-3 py-2">Approved</span>
//             );
//           }

//           if (activeRow === rowIndex) {
//             return (
//               <div>
//                 <div className="d-flex gap-2 mb-2">
//                   <Button
//                     variant="success"
//                     size="sm"
//                     disabled={submitting === rowIndex}
//                     onClick={() =>
//                       approveAllotment(
//                         row.original.mobileNumber,
//                         row.original._id,
//                         rowIndex
//                       )
//                     }
//                   >
//                     {submitting === rowIndex ? "Submitting..." : "Confirm"}
//                   </Button>
//                   <Button
//                     variant="secondary"
//                     size="sm"
//                     onClick={() => setActiveRow("")}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//                 {approveError[rowIndex] && (
//                   <div className="text-danger small">
//                     {approveError[rowIndex]}
//                   </div>
//                 )}
//                 {approveSuccess[rowIndex] && (
//                   <div className="text-success small">
//                     {approveSuccess[rowIndex]}
//                   </div>
//                 )}
//               </div>
//             );
//           }

//           return (
//             <button
//               size="sm"
//               style={{
//                 backgroundColor: "#082038",
//                 border: "1px solid #082038",
//                 color: "#fff",
//               }}
//               onClick={() => setActiveRow(rowIndex)}
//             >
//               Approve
//             </button>
//           );
//         },
//       },
//     ],
//     [activeRow, submitting, approveError, approveSuccess]
//   );

//   // ✅ Fetch API
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getCatalogPayment"
//       );
//       const result = await response.json();
//       console.log("API Response:", result);

//       if (result.status && Array.isArray(result.data)) {
//         setData(
//           result.data.map((item, index) => ({
//             _id: item._id,
//             serial: index + 1,
//             mobileNumber: item.mobileNumber || "N/A",
//             tagid: item.tagid || "N/A",
//             goldType: item.goldType || "N/A",
//             description: item.description || "N/A",
//             amount: item.amount || 0,
//             grams: item.grams || 0,
//             Paidamount: item.Paidamount || 0,
//             Paidgrams: item.Paidgrams || 0,
//             allotmentStatus: item.allotmentStatus || "Pending",
//           }))
//         );
//       } else {
//         Swal.fire("Error!", "Unexpected response format", "error");
//       }
//     } catch (error) {
//       Swal.fire("Error!", "Failed to fetch records", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const tableInstance = useTable(
//     { columns: COLUMNS, data },
//     useGlobalFilter,
//     useSortBy,
//     usePagination
//   );

//   const {
//     getTableProps,
//     headerGroups,
//     getTableBodyProps,
//     prepareRow,
//     state,
//     page,
//     pageOptions,
//     nextPage,
//     previousPage,
//     canNextPage,
//     canPreviousPage,
//   } = tableInstance;

//   const { pageIndex } = state;

//   if (loading) {
//     return (
//       <Card>
//         <Card.Body className="text-center">
//           <Spinner animation="border" variant="primary" />
//           <div className="mt-2">Loading records...</div>
//         </Card.Body>
//       </Card>
//     );
//   }

//   return (
//     <Fragment>
//       <Card>
//         <Card.Body>
//           <h5 className="mb-4" style={{ color: "#082038" }}>
//             Catalog Payment
//           </h5>

//           <div className="table-responsive">
//             <table {...getTableProps()} className="table table-hover mb-0">
//               <thead>
//                 {headerGroups.map((headerGroup) => (
//                   <tr {...headerGroup.getHeaderGroupProps()}>
//                     {headerGroup.headers.map((column) => (
//                       <th {...column.getHeaderProps()}>
//                         {column.render("Header")}
//                       </th>
//                     ))}
//                   </tr>
//                 ))}
//               </thead>
//               <tbody {...getTableBodyProps()}>
//                 {page.map((row) => {
//                   prepareRow(row);
//                   return (
//                     <tr {...row.getRowProps()}>
//                       {row.cells.map((cell) => (
//                         <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
//                       ))}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           <div className="d-flex justify-content-between align-items-center mt-4">
//             <span>
//               Page {pageIndex + 1} of {pageOptions.length}
//             </span>
//             <div>
//               <Button
//                 className="btn-default tablebutton me-2 my-1"
//                 onClick={() => previousPage()}
//                 disabled={!canPreviousPage}
//               >
//                 {" << "}
//               </Button>
//               <Button
//                 className="btn-default tablebutton me-2 my-1"
//                 onClick={() => nextPage()}
//                 disabled={!canNextPage}
//               >
//                 {" >> "}
//               </Button>
//             </div>
//           </div>
//         </Card.Body>
//       </Card>
//     </Fragment>
//   );
// }



// import React, { Fragment, useEffect, useState } from "react";
// import { Button, Card, Spinner, Alert, Modal } from "react-bootstrap";
// import Swal from "sweetalert2";
// import {
//   useTable,
//   useSortBy,
//   useGlobalFilter,
//   usePagination,
// } from "react-table";

// export default function GetGoldRecords() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeRow, setActiveRow] = useState("");
//   const [submitting, setSubmitting] = useState("");
//   const [approveError, setApproveError] = useState({});
//   const [approveSuccess, setApproveSuccess] = useState({});
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);

//   // ✅ View Catalog Details
//   const handleView = (record) => {
//     setSelectedRecord(record);
//     setShowViewModal(true);
//   };

//   // ✅ Simulate Approve Payment (No API call)
//   const approveAllotment = (rowIndex) => {
//     setSubmitting(rowIndex);
//     setApproveError({ ...approveError, [rowIndex]: "" });
//     setApproveSuccess({ ...approveSuccess, [rowIndex]: "" });

//     // Simulate delay
//     setTimeout(() => {
//       setData((prev) =>
//         prev.map((item, i) =>
//           i === rowIndex
//             ? { ...item, allotmentStatus: "Approved" } // always set Approved
//             : item
//         )
//       );
//       setApproveSuccess({
//         ...approveSuccess,
//         [rowIndex]: "Payment approved successfully",
//       });

//       Swal.fire("Success!", "Payment approved successfully", "success");
//       setActiveRow("");
//       setSubmitting("");
//     }, 500);
//   };

//   // ✅ Table columns
//   const COLUMNS = React.useMemo(
//     () => [
//       { Header: "S.No", accessor: "serial", Cell: ({ row }) => row.index + 1 },
//       { Header: "Mobile", accessor: "mobileNumber" },
//       { Header: "Tag ID", accessor: "tagid" },
//       { Header: "Gold Type", accessor: "goldType" },
//       {
//         Header: "Amount",
//         accessor: "amount",
//         Cell: ({ value }) => `₹ ${value?.toLocaleString("en-IN") || 0}`,
//       },
//       {
//         Header: "Grams",
//         accessor: "grams",
//         Cell: ({ value }) => `${value || 0} g`,
//       },
//       {
//         Header: "Paid Amount",
//         accessor: "Paidamount",
//         Cell: ({ value }) => `₹ ${value?.toLocaleString("en-IN") || 0}`,
//       },
//       {
//         Header: "Paid Grams",
//         accessor: "Paidgrams",
//         Cell: ({ value }) => `${value || 0} g`,
//       },
//       {
//         Header: "Allotment Status",
//         accessor: "allotmentStatus",
//         Cell: ({ row }) => {
//           const rowIndex = row.index;

//           // Show Confirm/Cancel if active
//           if (activeRow === rowIndex) {
//             return (
//               <div>
//                 <div className="d-flex gap-2 mb-2">
//                   <Button
//                     variant="success"
//                     size="sm"
//                     disabled={submitting === rowIndex}
//                     onClick={() => approveAllotment(rowIndex)}
//                   >
//                     {submitting === rowIndex ? "Submitting..." : "Confirm"}
//                   </Button>
//                   <Button
//                     variant="secondary"
//                     size="sm"
//                     onClick={() => setActiveRow("")}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//                 {approveError[rowIndex] && (
//                   <div className="text-danger small">{approveError[rowIndex]}</div>
//                 )}
//                 {approveSuccess[rowIndex] && (
//                   <div className="text-success small">{approveSuccess[rowIndex]}</div>
//                 )}
//               </div>
//             );
//           }

//           // Always show Approve button
//           return (
//             <button
//               size="sm"
//               style={{
//                 backgroundColor: "#082038",
//                 border: "1px solid #082038",
//                 color: "#fff",
//                 padding: "0.375rem 0.75rem",
//                 borderRadius: "0.25rem",
//                 cursor: "pointer",
//               }}
//               onClick={() => setActiveRow(rowIndex)}
//             >
//               Approve
//             </button>
//           );
//         },
//       },
//       {
//         Header: "View Catalog",
//         accessor: "viewCatalog",
//         Cell: ({ row }) => (
//           <button
//             size="sm"
//             onClick={() => handleView(row.original)}
//             style={{
//               backgroundColor: "#082038",
//               border: "1px solid #082038",
//               color: "#fff",
//               padding: "0.375rem 0.75rem",
//               borderRadius: "0.25rem",
//               cursor: "pointer",
//             }}
//           >
//             View
//           </button>
//         ),
//       },
//     ],
//     [activeRow, submitting, approveError, approveSuccess]
//   );

//   // ✅ Fetch API
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getCatalogPayment"
//       );
//       const result = await response.json();
//       console.log(" Response:", result);

//       if (result.status && Array.isArray(result.data)) {
//         setData(
//           result.data.map((item, index) => ({
//             _id: item._id,
//             serial: index + 1,
//             mobileNumber: item.mobileNumber || "N/A",
//             tagid: item.tagid || "N/A",
//             goldType: item.goldType || "N/A",
//             description: item.description || "N/A",
//             amount: item.amount || 0,
//             grams: item.grams || 0,
//             Paidamount: item.Paidamount || 0,
//             Paidgrams: item.Paidgrams || 0,
//             allotmentStatus: item.allotmentStatus || "Pending",
//             address: item.address || "N/A",
//             createdAt: item.createdAt || "N/A",
//             postCode: item.postCode || "N/A",
//           }))
//         );
//       } else {
//         Swal.fire("Error!", "Unexpected response format", "error");
//       }
//     } catch (error) {
//       Swal.fire("Error!", "Failed to fetch records", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const tableInstance = useTable(
//     { columns: COLUMNS, data },
//     useGlobalFilter,
//     useSortBy,
//     usePagination
//   );

//   const {
//     getTableProps,
//     headerGroups,
//     getTableBodyProps,
//     prepareRow,
//     state,
//     page,
//     pageOptions,
//     nextPage,
//     previousPage,
//     canNextPage,
//     canPreviousPage,
//   } = tableInstance;

//   const { pageIndex } = state;

//   if (loading) {
//     return (
//       <Card>
//         <Card.Body className="text-center">
//           <Spinner animation="border" variant="primary" />
//           <div className="mt-2">Loading records...</div>
//         </Card.Body>
//       </Card>
//     );
//   }

//   return (
//     <Fragment>
//       <Card>
//         <Card.Body>
//           <h5 className="mb-4" style={{ color: "#082038" }}>
//             Catalog Payment
//           </h5>

//           <div className="table-responsive">
//             <table {...getTableProps()} className="table table-hover mb-0">
//               <thead>
//                 {headerGroups.map((headerGroup) => (
//                   <tr {...headerGroup.getHeaderGroupProps()}>
//                     {headerGroup.headers.map((column) => (
//                       <th {...column.getHeaderProps()}>{column.render("Header")}</th>
//                     ))}
//                   </tr>
//                 ))}
//               </thead>
//               <tbody {...getTableBodyProps()}>
//                 {page.map((row) => {
//                   prepareRow(row);
//                   return (
//                     <tr {...row.getRowProps()}>
//                       {row.cells.map((cell) => (
//                         <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
//                       ))}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           <div className="d-flex justify-content-between align-items-center mt-4">
//             <span>
//               Page {pageIndex + 1} of {pageOptions.length}
//             </span>
//             <div>
//               <Button
//                 className="btn-default tablebutton me-2 my-1"
//                 onClick={() => previousPage()}
//                 disabled={!canPreviousPage}
//               >
//                 {" << "}
//               </Button>
//               <Button
//                 className="btn-default tablebutton me-2 my-1"
//                 onClick={() => nextPage()}
//                 disabled={!canNextPage}
//               >
//                 {" >> "}
//               </Button>
//             </div>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* View Catalog Modal */}
//       <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Catalog Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedRecord ? (
//             <div className="table-responsive">
//               <table className="table table-bordered table-striped">
//                 <thead>
//                   <tr>
//                     <th>Tag ID</th>
//                     <th>Amount (₹)</th>
//                     <th>Post Code</th>
//                     <th>Address</th>
//                     <th>Created At</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>{selectedRecord.tagid}</td>
//                     <td>₹ {selectedRecord.amount?.toLocaleString("en-IN") || 0}</td>
//                     <td>{selectedRecord.postCode}</td>
//                     <td>{selectedRecord.address}</td>
//                     <td>
//                       {selectedRecord.createdAt
//                         ? new Date(selectedRecord.createdAt).toLocaleString("en-IN", {
//                             timeZone: "Asia/Kolkata",
//                             dateStyle: "medium",
//                             timeStyle: "short",
//                           })
//                         : "N/A"}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <Alert variant="info">No record selected</Alert>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowViewModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Fragment>
//   );
// }






// import React, { Fragment, useEffect, useState } from "react";
// import { Button, Card, Spinner, Alert, Modal } from "react-bootstrap";
// import Swal from "sweetalert2";
// import {
//   useTable,
//   useSortBy,
//   useGlobalFilter,
//   usePagination,
// } from "react-table";

// export default function GetGoldRecords() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeRow, setActiveRow] = useState(null);
//   const [submitting, setSubmitting] = useState(null);
//   const [approveError, setApproveError] = useState({});
//   const [approveSuccess, setApproveSuccess] = useState({});
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);

//   // ✅ View Catalog Details
//   const handleView = (record) => {
//     setSelectedRecord(record);
//     setShowViewModal(true);
//   };

//   // ✅ Approve Payment (with API call)
//   const approveAllotment = async (rowIndex) => {
//     setSubmitting(rowIndex);
//     setApproveError((prev) => ({ ...prev, [rowIndex]: "" }));
//     setApproveSuccess((prev) => ({ ...prev, [rowIndex]: "" }));

//     const record = data[rowIndex]; // get the record to approve

//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/approveCatalogPayment",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             mobileNumber: record.mobileNumber,
//             catalogID: record._id,
//           }),
//         }
//       );

//       const result = await response.json();
//       console.log("Approve API Response:", result);

//       if (result.status) {
//         // ✅ Update only the approved row locally
//         setData((prev) =>
//           prev.map((item, i) =>
//             i === rowIndex
//               ? {
//                   ...item,
//                   allotmentStatus: result.data.allotmentStatus,
//                   paymentStatus: result.data.paymentStatus,
//                 }
//               : item
//           )
//         );

//         setApproveSuccess((prev) => ({
//           ...prev,
//           [rowIndex]: "Payment approved successfully",
//         }));

//         Swal.fire("Success!", "Payment approved successfully", "success");
//       } else {
//         setApproveError((prev) => ({
//           ...prev,
//           [rowIndex]: result.message || "Failed to approve payment",
//         }));
//         Swal.fire(
//           "Error!",
//           result.message || "Failed to approve payment",
//           "error"
//         );
//       }
//     } catch (error) {
//       console.error(error);
//       setApproveError((prev) => ({
//         ...prev,
//         [rowIndex]: "Something went wrong. Try again!",
//       }));
//       Swal.fire("Error!", "Something went wrong. Try again!", "error");
//     } finally {
//       setSubmitting(null);
//       setActiveRow(null);
//     }
//   };

//   // ✅ Table columns
//   const COLUMNS = React.useMemo(
//     () => [
//       { Header: "S.No", accessor: "serial", Cell: ({ row }) => row.index + 1 },
//       { Header: "Mobile", accessor: "mobileNumber" },
//       { Header: "Tag ID", accessor: "tagid" },
//       { Header: "Gold Type", accessor: "goldType" },
//       {
//         Header: "Amount",
//         accessor: "amount",
//         Cell: ({ value }) => `₹ ${value?.toLocaleString("en-IN") || 0}`,
//       },
//       {
//         Header: "Grams",
//         accessor: "grams",
//         Cell: ({ value }) => `${value || 0} g`,
//       },
//       {
//         Header: "Paid Amount",
//         accessor: "Paidamount",
//         Cell: ({ value }) => `₹ ${value?.toLocaleString("en-IN") || 0}`,
//       },
//       {
//         Header: "Paid Grams",
//         accessor: "Paidgrams",
//         Cell: ({ value }) => `${value || 0} g`,
//       },
//       {
//         Header: "Payment Status",
//         accessor: "allotmentStatus",
//         Cell: ({ row }) => {
//           const rowIndex = row.index;
//           const allotmentStatus = row.original.allotmentStatus?.toLowerCase();
//           const paymentStatus = row.original.paymentStatus?.toLowerCase();

//           // ✅ Show Approved if backend says Delivered or Payment Approved
//           if (
//             allotmentStatus === "delivered" ||
//             paymentStatus?.includes("payment approved")
//           ) {
//             return <span className="badge bg-success">Approved</span>;
//           }

//           if (activeRow === rowIndex) {
//             return (
//               <div>
//                 <div className="d-flex gap-2 mb-2">
//                   <Button
//                     variant="success"
//                     size="sm"
//                     disabled={submitting === rowIndex}
//                     onClick={() => approveAllotment(rowIndex)}
//                   >
//                     {submitting === rowIndex ? "Submitting..." : "Confirm"}
//                   </Button>
//                   <Button
//                     variant="secondary"
//                     size="sm"
//                     onClick={() => setActiveRow(null)}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//                 {approveError[rowIndex] && (
//                   <div className="text-danger small">
//                     {approveError[rowIndex]}
//                   </div>
//                 )}
//                 {approveSuccess[rowIndex] && (
//                   <div className="text-success small">
//                     {approveSuccess[rowIndex]}
//                   </div>
//                 )}
//               </div>
//             );
//           }

//           return (
//             <button
//               size="sm"
//               style={{
//                 backgroundColor: "#082038",
//                 border: "1px solid #082038",
//                 color: "#fff",
//                 padding: "0.375rem 0.75rem",
//                 borderRadius: "0.25rem",
//                 cursor: "pointer",
//               }}
//               onClick={() => setActiveRow(rowIndex)}
//             >
//               Approve
//             </button>
//           );
//         },
//       },
//       {
//         Header: "View Catalog",
//         accessor: "viewCatalog",
//         Cell: ({ row }) => (
//           <button
//             size="sm"
//             onClick={() => handleView(row.original)}
//             style={{
//               backgroundColor: "#082038",
//               border: "1px solid #082038",
//               color: "#fff",
//               padding: "0.375rem 0.75rem",
//               borderRadius: "0.25rem",
//               cursor: "pointer",
//             }}
//           >
//             View
//           </button>
//         ),
//       },
//     ],
//     [activeRow, submitting, approveError, approveSuccess]
//   );

//   // ✅ Fetch API
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getCatalogPayment"
//       );
//       const result = await response.json();
//       console.log(" Response:", result);

//       if (result.status && Array.isArray(result.data)) {
//         setData(
//           result.data.map((item, index) => ({
//             _id: item._id,
//             serial: index + 1,
//             mobileNumber: item.mobileNumber || "N/A",
//             tagid: item.tagid || "N/A",
//             goldType: item.goldType || "N/A",
//             description: item.description || "N/A",
//             amount: item.amount || 0,
//             grams: item.grams || 0,
//             Paidamount: item.Paidamount || 0,
//             Paidgrams: item.Paidgrams || 0,
//             allotmentStatus: item.allotmentStatus || "Pending",
//             paymentStatus: item.paymentStatus || "",
//             address: item.address || "N/A",
//             createdAt: item.createdAt || "N/A",
//             postCode: item.postCode || "N/A",
//           }))
//         );
//       } else {
//         Swal.fire("Error!", "Unexpected response format", "error");
//       }
//     } catch (error) {
//       Swal.fire("Error!", "Failed to fetch records", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const tableInstance = useTable(
//     { columns: COLUMNS, data },
//     useGlobalFilter,
//     useSortBy,
//     usePagination
//   );

//   const {
//     getTableProps,
//     headerGroups,
//     getTableBodyProps,
//     prepareRow,
//     state,
//     page,
//     pageOptions,
//     nextPage,
//     previousPage,
//     canNextPage,
//     canPreviousPage,
//   } = tableInstance;

//   const { pageIndex } = state;

//   if (loading) {
//     return (
//       <Card>
//         <Card.Body className="text-center">
//           <Spinner animation="border" variant="primary" />
//           <div className="mt-2">Loading records...</div>
//         </Card.Body>
//       </Card>
//     );
//   }

//   return (
//     <Fragment>
//       <Card>
//         <Card.Body>
//           <h5 className="mb-4" style={{ color: "#082038" }}>
//             Catalog Payment
//           </h5>

//           <div className="table-responsive">
//             <table {...getTableProps()} className="table table-hover mb-0">
//               <thead>
//                 {headerGroups.map((headerGroup) => (
//                   <tr {...headerGroup.getHeaderGroupProps()}>
//                     {headerGroup.headers.map((column) => (
//                       <th {...column.getHeaderProps()}>
//                         {column.render("Header")}
//                       </th>
//                     ))}
//                   </tr>
//                 ))}
//               </thead>
//               <tbody {...getTableBodyProps()}>
//                 {page.map((row) => {
//                   prepareRow(row);
//                   return (
//                     <tr {...row.getRowProps()}>
//                       {row.cells.map((cell) => (
//                         <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
//                       ))}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           <div className="d-flex justify-content-between align-items-center mt-4">
//             <span>
//               Page {pageIndex + 1} of {pageOptions.length}
//             </span>
//             <div>
//               <Button
//                 className="btn-default tablebutton me-2 my-1"
//                 onClick={() => previousPage()}
//                 disabled={!canPreviousPage}
//               >
//                 {" << "}
//               </Button>
//               <Button
//                 className="btn-default tablebutton me-2 my-1"
//                 onClick={() => nextPage()}
//                 disabled={!canNextPage}
//               >
//                 {" >> "}
//               </Button>
//             </div>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* View Catalog Modal */}
//       <Modal
//         show={showViewModal}
//         onHide={() => setShowViewModal(false)}
//         size="lg"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Catalog Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedRecord ? (
//             <div className="table-responsive">
//               <table className="table table-bordered table-striped">
//                 <thead>
//                   <tr>
//                     <th>Tag ID</th>
//                     <th>Amount (₹)</th>
//                     <th>Post Code</th>
//                     <th>Address</th>
//                     <th>Created At</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>{selectedRecord.tagid}</td>
//                     <td>
//                       ₹ {selectedRecord.amount?.toLocaleString("en-IN") || 0}
//                     </td>
//                     <td>{selectedRecord.postCode}</td>
//                     <td>{selectedRecord.address}</td>
//                     <td>
//                       {selectedRecord.createdAt
//                         ? new Date(selectedRecord.createdAt).toLocaleString(
//                             "en-IN",
//                             {
//                               timeZone: "Asia/Kolkata",
//                               dateStyle: "medium",
//                               timeStyle: "short",
//                             }
//                           )
//                         : "N/A"}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <Alert variant="info">No record selected</Alert>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowViewModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Fragment>
//   );
// }







// import React, { Fragment, useEffect, useState } from "react";
// import { Button, Card, Spinner, Alert, Modal } from "react-bootstrap";
// import Swal from "sweetalert2";
// import {
//   useTable,
//   useSortBy,
//   useGlobalFilter,
//   usePagination,
// } from "react-table";
// import { useNavigate } from "react-router-dom"; // ✅ Import navigation hook

// export default function GetGoldRecords() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeRow, setActiveRow] = useState(null);
//   const [submitting, setSubmitting] = useState(null);
//   const [approveError, setApproveError] = useState({});
//   const [approveSuccess, setApproveSuccess] = useState({});
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);

//   const navigate = useNavigate(); // ✅ Initialize navigation

//   // ✅ View Catalog Details
//   const handleView = (record) => {
//     setSelectedRecord(record);
//     setShowViewModal(true);
//   };

//   // ✅ Approve Payment (with API call)
//   const approveAllotment = async (rowIndex) => {
//     setSubmitting(rowIndex);
//     setApproveError((prev) => ({ ...prev, [rowIndex]: "" }));
//     setApproveSuccess((prev) => ({ ...prev, [rowIndex]: "" }));

//     const record = data[rowIndex]; // get the record to approve

//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/approveCatalogPayment",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             mobileNumber: record.mobileNumber,
//             catalogID: record._id,
//           }),
//         }
//       );

//       const result = await response.json();
//       console.log("Approve API Response:", result);

//       if (result.status) {
//         // ✅ Update only the approved row locally
//         setData((prev) =>
//           prev.map((item, i) =>
//             i === rowIndex
//               ? {
//                   ...item,
//                   allotmentStatus: result.data.allotmentStatus,
//                   paymentStatus: result.data.paymentStatus,
//                 }
//               : item
//           )
//         );

//         setApproveSuccess((prev) => ({
//           ...prev,
//           [rowIndex]: "Payment approved successfully",
//         }));

//         Swal.fire("Success!", "Payment approved successfully", "success").then(
//           () => {
//             navigate("/app/ApprovedCatalog"); // ✅ Redirect after success
//           }
//         );
//       } else {
//         setApproveError((prev) => ({
//           ...prev,
//           [rowIndex]: result.message || "Failed to approve payment",
//         }));
//         Swal.fire(
//           "Error!",
//           result.message || "Failed to approve payment",
//           "error"
//         );
//       }
//     } catch (error) {
//       console.error(error);
//       setApproveError((prev) => ({
//         ...prev,
//         [rowIndex]: "Something went wrong. Try again!",
//       }));
//       Swal.fire("Error!", "Something went wrong. Try again!", "error");
//     } finally {
//       setSubmitting(null);
//       setActiveRow(null);
//     }
//   };

//   // ✅ Table columns
//   const COLUMNS = React.useMemo(
//     () => [
//       { Header: "S.No", accessor: "serial", Cell: ({ row }) => row.index + 1 },
//       { Header: "Mobile", accessor: "mobileNumber" },
//       { Header: "Tag ID", accessor: "tagid" },
//       { Header: "Gold Type", accessor: "goldType" },
//       {
//         Header: "Amount",
//         accessor: "amount",
//         Cell: ({ value }) => `₹ ${value?.toLocaleString("en-IN") || 0}`,
//       },
//       {
//         Header: "Grams",
//         accessor: "grams",
//         Cell: ({ value }) => `${value || 0} g`,
//       },
//       {
//         Header: "Paid Amount",
//         accessor: "Paidamount",
//         Cell: ({ value }) => `₹ ${value?.toLocaleString("en-IN") || 0}`,
//       },
//       {
//         Header: "Paid Grams",
//         accessor: "Paidgrams",
//         Cell: ({ value }) => `${value || 0} g`,
//       },
//       {
//         Header: "Payment Status",
//         accessor: "allotmentStatus",
//         Cell: ({ row }) => {
//           const rowIndex = row.index;
//           const allotmentStatus = row.original.allotmentStatus?.toLowerCase();
//           const paymentStatus = row.original.paymentStatus?.toLowerCase();

//           if (
//             allotmentStatus === "delivered" ||
//             paymentStatus?.includes("payment approved")
//           ) {
//             return <span className="badge bg-success">Approved</span>;
//           }

//           if (activeRow === rowIndex) {
//             return (
//               <div>
//                 <div className="d-flex gap-2 mb-2">
//                   <Button
//                     variant="success"
//                     size="sm"
//                     disabled={submitting === rowIndex}
//                     onClick={() => approveAllotment(rowIndex)}
//                   >
//                     {submitting === rowIndex ? "Submitting..." : "Confirm"}
//                   </Button>
//                   <Button
//                     variant="secondary"
//                     size="sm"
//                     onClick={() => setActiveRow(null)}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//                 {approveError[rowIndex] && (
//                   <div className="text-danger small">
//                     {approveError[rowIndex]}
//                   </div>
//                 )}
//                 {approveSuccess[rowIndex] && (
//                   <div className="text-success small">
//                     {approveSuccess[rowIndex]}
//                   </div>
//                 )}
//               </div>
//             );
//           }

//           return (
//             <button
//               size="sm"
//               style={{
//                 backgroundColor: "#082038",
//                 border: "1px solid #082038",
//                 color: "#fff",
//                 padding: "0.375rem 0.75rem",
//                 borderRadius: "0.25rem",
//                 cursor: "pointer",
//               }}
//               onClick={() => setActiveRow(rowIndex)}
//             >
//               Approve
//             </button>
//           );
//         },
//       },
//       {
//         Header: "View Catalog",
//         accessor: "viewCatalog",
//         Cell: ({ row }) => (
//           <button
//             size="sm"
//             onClick={() => handleView(row.original)}
//             style={{
//               backgroundColor: "#082038",
//               border: "1px solid #082038",
//               color: "#fff",
//               padding: "0.375rem 0.75rem",
//               borderRadius: "0.25rem",
//               cursor: "pointer",
//             }}
//           >
//             View
//           </button>
//         ),
//       },
//     ],
//     [activeRow, submitting, approveError, approveSuccess]
//   );

//   // ✅ Fetch API
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getCatalogPayment"
//       );
//       const result = await response.json();
//       console.log(" Response:", result);

//       if (result.status && Array.isArray(result.data)) {
//         setData(
//           result.data.map((item, index) => ({
//             _id: item._id,
//             serial: index + 1,
//             mobileNumber: item.mobileNumber || "N/A",
//             tagid: item.tagid || "N/A",
//             goldType: item.goldType || "N/A",
//             description: item.description || "N/A",
//             amount: item.amount || 0,
//             grams: item.grams || 0,
//             Paidamount: item.Paidamount || 0,
//             Paidgrams: item.Paidgrams || 0,
//             allotmentStatus: item.allotmentStatus || "Pending",
//             paymentStatus: item.paymentStatus || "",
//             address: item.address || "N/A",
//             createdAt: item.createdAt || "N/A",
//             postCode: item.postCode || "N/A",
//           }))
//         );
//       } else {
//         Swal.fire("Error!", "Unexpected response format", "error");
//       }
//     } catch (error) {
//       Swal.fire("Error!", "Failed to fetch records", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const tableInstance = useTable(
//     { columns: COLUMNS, data },
//     useGlobalFilter,
//     useSortBy,
//     usePagination
//   );

//   const {
//     getTableProps,
//     headerGroups,
//     getTableBodyProps,
//     prepareRow,
//     state,
//     page,
//     pageOptions,
//     nextPage,
//     previousPage,
//     canNextPage,
//     canPreviousPage,
//   } = tableInstance;

//   const { pageIndex } = state;

//   if (loading) {
//     return (
//       <Card>
//         <Card.Body className="text-center">
//           <Spinner animation="border" variant="primary" />
//           <div className="mt-2">Loading records...</div>
//         </Card.Body>
//       </Card>
//     );
//   }

//   return (
//     <Fragment>
//       <Card>
//         <Card.Body>
//           <h5 className="mb-4" style={{ color: "#082038" }}>
//             Catalog Payment
//           </h5>

//           <div className="table-responsive">
//             <table {...getTableProps()} className="table table-hover mb-0">
//               <thead>
//                 {headerGroups.map((headerGroup) => (
//                   <tr {...headerGroup.getHeaderGroupProps()}>
//                     {headerGroup.headers.map((column) => (
//                       <th {...column.getHeaderProps()}>
//                         {column.render("Header")}
//                       </th>
//                     ))}
//                   </tr>
//                 ))}
//               </thead>
//               <tbody {...getTableBodyProps()}>
//                 {page.map((row) => {
//                   prepareRow(row);
//                   return (
//                     <tr {...row.getRowProps()}>
//                       {row.cells.map((cell) => (
//                         <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
//                       ))}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           <div className="d-flex justify-content-between align-items-center mt-4">
//             <span>
//               Page {pageIndex + 1} of {pageOptions.length}
//             </span>
//             <div>
//               <Button
//                 className="btn-default tablebutton me-2 my-1"
//                 onClick={() => previousPage()}
//                 disabled={!canPreviousPage}
//               >
//                 {" << "}
//               </Button>
//               <Button
//                 className="btn-default tablebutton me-2 my-1"
//                 onClick={() => nextPage()}
//                 disabled={!canNextPage}
//               >
//                 {" >> "}
//               </Button>
//             </div>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* View Catalog Modal */}
//       <Modal
//         show={showViewModal}
//         onHide={() => setShowViewModal(false)}
//         size="lg"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Catalog Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedRecord ? (
//             <div className="table-responsive">
//               <table className="table table-bordered table-striped">
//                 <thead>
//                   <tr>
//                     <th>Tag ID</th>
//                     <th>Amount (₹)</th>
//                     <th>Post Code</th>
//                     <th>Address</th>
//                     <th>Created At</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>{selectedRecord.tagid}</td>
//                     <td>
//                       ₹ {selectedRecord.amount?.toLocaleString("en-IN") || 0}
//                     </td>
//                     <td>{selectedRecord.postCode}</td>
//                     <td>{selectedRecord.address}</td>
//                     <td>
//                       {selectedRecord.createdAt
//                         ? new Date(selectedRecord.createdAt).toLocaleString(
//                             "en-IN",
//                             {
//                               timeZone: "Asia/Kolkata",
//                               dateStyle: "medium",
//                               timeStyle: "short",
//                             }
//                           )
//                         : "N/A"}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <Alert variant="info">No record selected</Alert>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowViewModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Fragment>
//   );
// }





// import React, { Fragment, useEffect, useState } from "react";
// import { Button, Card, Spinner, Modal } from "react-bootstrap";
// import Swal from "sweetalert2";
// import {
//   useTable,
//   useSortBy,
//   useGlobalFilter,
//   usePagination,
// } from "react-table";
// import { useNavigate } from "react-router-dom";

// export default function GetGoldRecords() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeRow, setActiveRow] = useState(null);
//   const [submitting, setSubmitting] = useState(null);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);

//   const navigate = useNavigate();

//   // ✅ View Catalog
//   const handleView = (record) => {
//     setSelectedRecord(record);
//     setShowViewModal(true);
//   };

//   // ✅ Approve API
//   const approveAllotment = async (rowIndex) => {
//     setSubmitting(rowIndex);
//     const record = data[rowIndex];

//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/approveCatalogPayment",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             mobileNumber: record.mobileNumber,
//             catalogID: record._id,
//           }),
//         }
//       );

//       const result = await response.json();
//       if (result.status) {
//         Swal.fire("Success!", "Payment approved successfully", "success").then(
//           () => navigate("/app/ApprovedCatalog")
//         );
//       } else {
//         Swal.fire("Error!", result.message || "Failed to approve", "error");
//       }
//     } catch (err) {
//       Swal.fire("Error!", "Something went wrong. Try again!", "error");
//     } finally {
//       setSubmitting(null);
//       setActiveRow(null);
//     }
//   };

//   // ✅ Cancel API
//   const cancelAllotment = async (rowIndex) => {
//     setSubmitting(rowIndex);
//     const record = data[rowIndex];

//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/cancelCatalogPayment",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             catalogID: record._id,
//             mobileNumber: record.mobileNumber,
//           }),
//         }
//       );

//       const result = await response.json();

//       if (result.status) {
//         Swal.fire("Cancelled!", "Catalog payment cancelled", "success").then(
//           () => navigate("/app/Cancelcatalog")
//         );
//       } else {
//         Swal.fire("Error!", result.message || "Failed to cancel", "error");
//       }
//     } catch (err) {
//       Swal.fire("Error!", "Something went wrong. Try again!", "error");
//     } finally {
//       setSubmitting(null);
//       setActiveRow(null);
//     }
//   };

//   // ✅ Table Columns
//   const COLUMNS = React.useMemo(
//     () => [
//       { Header: "S.No", accessor: "serial", Cell: ({ row }) => row.index + 1 },
//       { Header: "Mobile", accessor: "mobileNumber" },
//       { Header: "Tag ID", accessor: "tagid" },
//       { Header: "Gold Type", accessor: "goldType" },
//       {
//         Header: "Amount",
//         accessor: "amount",
//         Cell: ({ value }) => `₹ ${value?.toLocaleString("en-IN") || 0}`,
//       },
//       {
//         Header: "Grams",
//         accessor: "grams",
//         Cell: ({ value }) => `${value || 0} g`,
//       },
//       {
//         Header: "Paid Amount",
//         accessor: "Paidamount",
//         Cell: ({ value }) => `₹ ${value?.toLocaleString("en-IN") || 0}`,
//       },
//       {
//         Header: "Paid Grams",
//         accessor: "Paidgrams",
//         Cell: ({ value }) => `${value || 0} g`,
//       },
//       {
//         Header: "Payment Status",
//         accessor: "allotmentStatus",
//         Cell: ({ row }) => {
//           const rowIndex = row.index;
//           const allotmentStatus = row.original.allotmentStatus?.toLowerCase();
//           const paymentStatus = row.original.paymentStatus?.toLowerCase();

//           if (
//             allotmentStatus === "delivered" ||
//             paymentStatus?.includes("payment approved")
//           ) {
//             return <span className="badge bg-success">Approved</span>;
//           }

//           if (activeRow === rowIndex) {
//             return (
//               <div>
//                 <div className="d-flex gap-2 mb-2">
//                   <Button
//                     variant="success"
//                     size="sm"
//                     disabled={submitting === rowIndex}
//                     onClick={() => approveAllotment(rowIndex)}
//                   >
//                     {submitting === rowIndex ? "Submitting..." : "Confirm"}
//                   </Button>
//                   <Button
//                     variant="danger"
//                     size="sm"
//                     disabled={submitting === rowIndex}
//                     onClick={() => cancelAllotment(rowIndex)}
//                   >
//                     {submitting === rowIndex ? "Cancelling..." : "Cancel"}
//                   </Button>
//                 </div>
//               </div>
//             );
//           }

//           return (
//             <button
//               size="sm"
//               style={{
//                 backgroundColor: "#082038",
//                 border: "1px solid #082038",
//                 color: "#fff",
//                 padding: "0.375rem 0.75rem",
//                 borderRadius: "0.25rem",
//                 cursor: "pointer",
//               }}
//               onClick={() => setActiveRow(rowIndex)}
//             >
//               Approve
//             </button>
//           );
//         },
//       },
//       {
//         Header: "View Catalog",
//         accessor: "viewCatalog",
//         Cell: ({ row }) => (
//           <button
//             size="sm"
//             onClick={() => handleView(row.original)}
//             style={{
//               backgroundColor: "#082038",
//               border: "1px solid #082038",
//               color: "#fff",
//               padding: "0.375rem 0.75rem",
//               borderRadius: "0.25rem",
//               cursor: "pointer",
//             }}
//           >
//             View
//           </button>
//         ),
//       },
//     ],
//     [activeRow, submitting]
//   );

//   // ✅ Fetch API
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getCatalogPayment"
//       );
//       const result = await response.json();

//       if (result.status && Array.isArray(result.data)) {
//         setData(
//           result.data.map((item, index) => ({
//             _id: item._id,
//             serial: index + 1,
//             mobileNumber: item.mobileNumber || "N/A",
//             tagid: item.tagid || "N/A",
//             goldType: item.goldType || "N/A",
//             description: item.description || "N/A",
//             amount: item.amount || 0,
//             grams: item.grams || 0,
//             Paidamount: item.Paidamount || 0,
//             Paidgrams: item.Paidgrams || 0,
//             allotmentStatus: item.allotmentStatus || "Pending",
//             paymentStatus: item.paymentStatus || "",
//             address: item.address || "N/A",
//             createdAt: item.createdAt || "N/A",
//             postCode: item.postCode || "N/A",
//           }))
//         );
//       } else {
//         Swal.fire("Error!", "Unexpected response format", "error");
//       }
//     } catch (error) {
//       Swal.fire("Error!", "Failed to fetch records", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // ✅ Table instance
//   const tableInstance = useTable(
//     { columns: COLUMNS, data },
//     useGlobalFilter,
//     useSortBy,
//     usePagination
//   );

//   const {
//     getTableProps,
//     headerGroups,
//     getTableBodyProps,
//     prepareRow,
//     state,
//     page,
//     pageOptions,
//     nextPage,
//     previousPage,
//     canNextPage,
//     canPreviousPage,
//   } = tableInstance;

//   const { pageIndex } = state;

//   if (loading) {
//     return (
//       <Card>
//         <Card.Body className="text-center">
//           <Spinner animation="border" variant="primary" />
//           <div className="mt-2">Loading records...</div>
//         </Card.Body>
//       </Card>
//     );
//   }

//   return (
//     <Fragment>
//       <Card>
//         <Card.Body>
//           <table
//             {...getTableProps()}
//             className="table table-bordered table-striped"
//           >
//             <thead>
//               {headerGroups.map((headerGroup) => (
//                 <tr {...headerGroup.getHeaderGroupProps()}>
//                   {headerGroup.headers.map((column) => (
//                     <th {...column.getHeaderProps(column.getSortByToggleProps())}>
//                       {column.render("Header")}
//                     </th>
//                   ))}
//                 </tr>
//               ))}
//             </thead>
//             <tbody {...getTableBodyProps()}>
//               {page.map((row) => {
//                 prepareRow(row);
//                 return (
//                   <tr {...row.getRowProps()}>
//                     {row.cells.map((cell) => (
//                       <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
//                     ))}
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>

//           {/* Pagination */}
//           <div className="d-flex justify-content-between mt-3">
//             <Button
//               onClick={() => previousPage()}
//               disabled={!canPreviousPage}
//               variant="secondary"
//             >
//               Previous
//             </Button>
//             <span>
//               Page {pageIndex + 1} of {pageOptions.length}
//             </span>
//             <Button
//               onClick={() => nextPage()}
//               disabled={!canNextPage}
//               variant="secondary"
//             >
//               Next
//             </Button>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* View Catalog Modal */}
//       <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Catalog Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedRecord ? (
//             <pre>{JSON.stringify(selectedRecord, null, 2)}</pre>
//           ) : (
//             "No record selected"
//           )}
//         </Modal.Body>
//       </Modal>
//     </Fragment>
//   );
// }





import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Spinner, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { useNavigate } from "react-router-dom";

export default function GetGoldRecords() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRow, setActiveRow] = useState(null);
  const [submitting, setSubmitting] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const navigate = useNavigate();

  // ✅ View Catalog
  const handleView = (record) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  // ✅ Approve API
  const approveAllotment = async (rowIndex) => {
    setSubmitting(rowIndex);
    const record = data[rowIndex];

    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/approveCatalogPayment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mobileNumber: record.mobileNumber,
            catalogID: record._id,
          }),
        }
      );

      const result = await response.json();
      if (result.status) {
        Swal.fire("Success!", "Payment approved successfully", "success").then(
          () => navigate("/app/ApprovedCatalog")
        );
      } else {
        Swal.fire("Error!", result.message || "Failed to approve", "error");
      }
    } catch (err) {
      Swal.fire("Error!", "Something went wrong. Try again!", "error");
    } finally {
      setSubmitting(null);
      setActiveRow(null);
    }
  };

  // ✅ Cancel API
  const cancelAllotment = async (rowIndex) => {
    setSubmitting(rowIndex);
    const record = data[rowIndex];

    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/cancelCatalogPayment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            catalogID: record._id,
            mobileNumber: record.mobileNumber,
          }),
        }
      );

      const result = await response.json();

      if (result.status) {
        Swal.fire("Cancelled!", "Catalog payment cancelled", "success").then(
          () => navigate("/app/Cancelcatalog")
        );
      } else {
        Swal.fire("Error!", result.message || "Failed to cancel", "error");
      }
    } catch (err) {
      Swal.fire("Error!", "Something went wrong. Try again!", "error");
    } finally {
      setSubmitting(null);
      setActiveRow(null);
    }
  };

  // ✅ Table Columns
  const COLUMNS = React.useMemo(
    () => [
      { Header: "S.No", accessor: "serial", Cell: ({ row }) => row.index + 1 },
      { Header: "Mobile", accessor: "mobileNumber" },
      { Header: "Tag ID", accessor: "tagid" },
      { Header: "Gold Type", accessor: "goldType" },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: ({ value }) => `₹ ${value?.toLocaleString("en-IN") || 0}`,
      },
      {
        Header: "Grams",
        accessor: "grams",
        Cell: ({ value }) => `${value || 0} g`,
      },
      {
        Header: "Paid Amount",
        accessor: "Paidamount",
        Cell: ({ value }) => `₹ ${value?.toLocaleString("en-IN") || 0}`,
      },
      {
        Header: "Paid Grams",
        accessor: "Paidgrams",
        Cell: ({ value }) => `${value || 0} g`,
      },
      {
        Header: "Payment Status",
        accessor: "allotmentStatus",
        Cell: ({ row }) => {
          const rowIndex = row.index;
          const allotmentStatus = row.original.allotmentStatus?.toLowerCase();
          const paymentStatus = row.original.paymentStatus?.toLowerCase();

          if (
            allotmentStatus === "delivered" ||
            paymentStatus?.includes("payment approved")
          ) {
            return <span className="badge bg-success">Approved</span>;
          }

          if (activeRow === rowIndex) {
            return (
              <div>
                <div className="d-flex gap-2 mb-2">
                  <Button
                    variant="success"
                    size="sm"
                    disabled={submitting === rowIndex}
                    onClick={() => approveAllotment(rowIndex)}
                  >
                    {submitting === rowIndex ? "Submitting..." : "Confirm"}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={submitting === rowIndex}
                    onClick={() => cancelAllotment(rowIndex)}
                  >
                    {submitting === rowIndex ? "Cancelling..." : "Cancel"}
                  </Button>
                </div>
              </div>
            );
          }

          return (
            <button
              size="sm"
              style={{
                backgroundColor: "#082038",
                border: "1px solid #082038",
                color: "#fff",
                padding: "0.375rem 0.75rem",
                borderRadius: "0.25rem",
                cursor: "pointer",
              }}
              onClick={() => setActiveRow(rowIndex)}
            >
              Approve
            </button>
          );
        },
      },
      {
        Header: "View Catalog",
        accessor: "viewCatalog",
        Cell: ({ row }) => (
          <button
            size="sm"
            onClick={() => handleView(row.original)}
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
        ),
      },
    ],
    [activeRow, submitting]
  );

  // ✅ Fetch API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/getCatalogPayment"
      );
      const result = await response.json();

      if (result.status && Array.isArray(result.data)) {
        setData(
          result.data.map((item, index) => ({
            _id: item._id,
            serial: index + 1,
            mobileNumber: item.mobileNumber || "N/A",
            tagid: item.tagid || "N/A",
            goldType: item.goldType || "N/A",
            description: item.description || "N/A",
            amount: item.amount || 0,
            grams: item.grams || 0,
            Paidamount: item.Paidamount || 0,
            Paidgrams: item.Paidgrams || 0,
            allotmentStatus: item.allotmentStatus || "Pending",
            paymentStatus: item.paymentStatus || "",
            address: item.address || "N/A",
            createdAt: item.createdAt || "N/A",
            postCode: item.postCode || "N/A",
          }))
        );
      } else {
        Swal.fire("Error!", "Unexpected response format", "error");
      }
    } catch (error) {
      Swal.fire("Error!", "Failed to fetch records", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Table instance
  const tableInstance = useTable(
    { columns: COLUMNS, data },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    headerGroups,
    getTableBodyProps,
    prepareRow,
    state,
    page,
    pageOptions,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    gotoPage,
    pageCount,
    setPageSize,
  } = tableInstance;

  const { pageIndex, pageSize } = state;

  if (loading) {
    return (
      <Card>
        <Card.Body className="text-center">
          <Spinner animation="border" variant="primary" />
          <div className="mt-2">Loading records...</div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Fragment>
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div
              className="card-title main-content-label"
              style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
            >
              Gold Records
            </div>
          </div>

          <div className="d-flex">
            <select
              className="mb-4 selectpage border me-1"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[10, 25, 50].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>

          <div className="table-responsive">
            <table
              {...getTableProps()}
              className="table table-bordered table-striped"
            >
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ✅ Updated Pagination (same as ApprovedCatalogPayments) */}
          <div className="d-block d-sm-flex mt-4">
            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
            </span>
            <span className="ms-sm-auto">
              <Button
                variant=""
                className="btn-default tablebutton me-2 d-sm-inline d-block my-1"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                {" Previous "}
              </Button>
              <Button
                variant=""
                className="btn-default tablebutton me-2 my-1"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                {" << "}
              </Button>
              <Button
                variant=""
                className="btn-default tablebutton me-2 my-1"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                {" >> "}
              </Button>
              <Button
                variant=""
                className="btn-default tablebutton me-2 d-sm-inline d-block my-1"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                {" Next "}
              </Button>
            </span>
          </div>
        </Card.Body>
      </Card>

      {/* View Catalog Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Catalog Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecord ? (
            <pre>{JSON.stringify(selectedRecord, null, 2)}</pre>
          ) : (
            "No record selected"
          )}
        </Modal.Body>
      </Modal>
    </Fragment>
  );
}

