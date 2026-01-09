// import React, { Fragment, useEffect, useState } from "react";
// import { Card, Spinner, Alert, Modal, Button } from "react-bootstrap";
// import {
//   useTable,
//   useSortBy,
//   useGlobalFilter,
//   usePagination,
// } from "react-table";

// export default function Catalog() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [detailedData, setDetailedData] = useState(null);

//   useEffect(() => {
//     fetchSellPayments();
//   }, []);

//   // 🔹 Fetch Sell Payment History
//   const fetchSellPayments = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getAllSellPaymentHistoryForAdmin",
//         { method: "GET", redirect: "follow" }
//       );

//       const result = await response.json();

//       if (result.success && Array.isArray(result.data)) {
//         const formatted = result.data.map((item, index) => ({
//           _id: item._id,
//           serial: index + 1,
//           mobileNumber: item.mobileNumber || "—",
//           amount: item.amount || 0,
//           paymentGatewayCharges: item.paymentGatewayCharges || 0,
//           taxAmount: item.taxAmount || 0,
//           otherCharges: item.otherCharges || 0,
//           paymentStatus: item.paymentStatus || "—",
//           // timestamp: item.timestamp || "—",
//         }));
//         setData(formatted);
//       } else {
//         setError("Unexpected response format");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch sell payment history");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 APPROVE PAYMENT (SINGLE BUTTON ACTION)
//   const approvePayment = async (id) => {
//     if (!window.confirm("Are you sure you want to approve this payment?")) return;

//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/approveSellPayment",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ id }),
//         }
//       );

//       const result = await response.json();
//       console.log("Approve Response:", result);

//       if (result.success) {
//         alert("✅ Payment approved successfully");

//         // refresh list
//         fetchSellPayments();

//         // close modal
//         setShowModal(false);
//         setDetailedData(null);
//       } else {
//         alert(result.message || "Approval failed");
//       }
//     } catch (error) {
//       console.error("Approve error:", error);
//       alert("Something went wrong while approving");
//     }
//   };

//   // 🔹 View modal
//   const handleView = (row) => {
//     setDetailedData(row);
//     setShowModal(true);
//   };

//   // 🔹 Table columns
//   const COLUMNS = React.useMemo(() => {
//     if (!data.length) return [];

//     const cols = Object.keys(data[0])
//       .filter((key) => key !== "_id")
//       .map((key) => ({
//         Header:
//           key === "serial"
//             ? "S.No"
//             : key === "mobileNumber"
//             ? "Mobile Number"
//             : key.replace(/([A-Z])/g, " $1"),
//         accessor: key,
//       }));

//     cols.push({
//       Header: "Actions",
//       Cell: ({ row }) => (
//         <Button
//           size="sm"
//           onClick={() => handleView(row.original)}
//           style={{
//             backgroundColor: "#082038",
//             border: "1px solid #082038",
//             color: "#fff",
//           }}
//         >
//           Approve
//         </Button>
//       ),
//     });

//     return cols;
//   }, [data]);

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
//     page,
//     state,
//     setGlobalFilter,
//   } = tableInstance;

//   if (loading) return <Spinner animation="border" className="m-4" />;
//   if (error) return <Alert variant="danger">{error}</Alert>;

//   return (
//     <Fragment>
//       <Card>
//         <Card.Body>
//           <div className="card-title main-content-label mb-4">
//             Sell Payment Management
//           </div>

//           <div className="d-flex mb-3">
//             <GlobalFilter
//               filter={state.globalFilter}
//               setFilter={setGlobalFilter}
//             />
//           </div>

//           <div className="table-responsive">
//             <table {...getTableProps()} className="table table-hover">
//               <thead>
//                 {headerGroups.map((hg) => (
//                   <tr {...hg.getHeaderGroupProps()}>
//                     {hg.headers.map((col) => (
//                       <th {...col.getHeaderProps()}>
//                         {col.render("Header")}
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
//                         <td {...cell.getCellProps()}>
//                           {cell.render("Cell")}
//                         </td>
//                       ))}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* 🔹 MODAL WITH APPROVE BUTTON */}
//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Sell Payment Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {detailedData && (
//             <>
//               <p><strong>Mobile:</strong> {detailedData.mobileNumber}</p>
//               <p><strong>Amount:</strong> ₹{detailedData.amount}</p>
//               <p><strong>Gateway Charges:</strong> ₹{detailedData.paymentGatewayCharges}</p>
//               <p><strong>Tax:</strong> ₹{detailedData.taxAmount}</p>
//               <p><strong>Other Charges:</strong> ₹{detailedData.otherCharges}</p>
//               <p><strong>Status:</strong> {detailedData.paymentStatus}</p>

//               {detailedData.paymentStatus === "Admin Approve Pending" && (
//                 <Button
//                   variant="success"
//                   onClick={() => approvePayment(detailedData._id)}
//                 >
//                   Approve
//                 </Button>
//               )}
//             </>
//           )}
//         </Modal.Body>
//       </Modal>
//     </Fragment>
//   );
// }

// // 🔹 Search
// const GlobalFilter = ({ filter, setFilter }) => (
//   <input
//     value={filter || ""}
//     onChange={(e) => setFilter(e.target.value)}
//     className="form-control ms-auto"
//     placeholder="Search..."
//   />
// );


// import React, { Fragment, useEffect, useState, useMemo } from "react";
// import { Card, Spinner, Alert, Modal, Button } from "react-bootstrap";
// import {
//   useTable,
//   useSortBy,
//   useGlobalFilter,
//   usePagination,
// } from "react-table";

// export default function Catalog() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [showModal, setShowModal] = useState(false);
//   const [detailedData, setDetailedData] = useState(null);
//   const [approving, setApproving] = useState(false);

//   useEffect(() => {
//     fetchSellPayments();
//   }, []);

//   // 🔹 Fetch Sell Payment History
//   const fetchSellPayments = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getAllSellPaymentHistoryForAdmin"
//       );
//       const result = await response.json();

//       if (result.success && Array.isArray(result.data)) {
//         const formatted = result.data.map((item, index) => ({
//           _id: item._id,
//           serial: index + 1,
//           mobileNumber: item.mobileNumber || "—",
//           amount: item.amount || 0,
//           paymentGatewayCharges: item.paymentGatewayCharges || 0,
//           taxAmount: item.taxAmount || 0,
//           otherCharges: item.otherCharges || 0,
//           paymentStatus: item.paymentStatus || "—",
//           timestamp: item.timestamp || "—",
//         }));
//         setData(formatted);
//       } else {
//         setError("Unexpected response format");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch sell payment history");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Open Modal
//   const handleView = (row) => {
//     setDetailedData(row);
//     setShowModal(true);
//   };

//   // 🔹 Close Modal
//   const closeModal = () => {
//     setShowModal(false);
//     setDetailedData(null);
//     setApproving(false);
//   };

//   // 🔹 Approve Payment (NO NAVIGATION)
//   const approvePayment = async () => {
//     if (!detailedData?._id) return;

//     setApproving(true);

//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/approveSellPayment",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ id: detailedData._id }),
//         }
//       );

//       const result = await response.json();

//       if (result.success === true) {
//         alert("✅ Sell payment approved successfully");

//         closeModal();          // close modal
//         fetchSellPayments();   // refresh table
//       } else {
//         alert(result.message || "Approval failed");
//       }
//     } catch (error) {
//       console.error("Approve error:", error);
//       alert("Something went wrong while approving");
//     } finally {
//       setApproving(false);
//     }
//   };

//   // 🔹 Table Columns
//   const COLUMNS = useMemo(
//     () => [
//       { Header: "S.No", accessor: "serial" },
//       { Header: "Mobile Number", accessor: "mobileNumber" },
//       { Header: "Amount", accessor: "amount" },
//       { Header: "Gateway Charges", accessor: "paymentGatewayCharges" },
//       { Header: "Tax Amount", accessor: "taxAmount" },
//       { Header: "deliveryCharges", accessor: "deliveryCharges" },
//       { Header: "Status", accessor: "paymentStatus" },
//       {
//         Header: "Actions",
//         Cell: ({ row }) => (
//           <Button
//             size="sm"
//             onClick={() => handleView(row.original)}
//             style={{
//               backgroundColor: "#082038",
//               border: "1px solid #082038",
//               color: "#fff",
//             }}
//           >
//             View
//           </Button>
//         ),
//       },
//     ],
//     []
//   );

//   const tableInstance = useTable(
//     {
//       columns: COLUMNS,
//       data,
//       initialState: { pageIndex: 0 },
//     },
//     useGlobalFilter,
//     useSortBy,
//     usePagination
//   );

//   const {
//     getTableProps,
//     headerGroups,
//     getTableBodyProps,
//     prepareRow,
//     page,
//     state: { globalFilter },
//     setGlobalFilter,
//   } = tableInstance;

//   if (loading) return <Spinner animation="border" className="m-4" />;
//   if (error) return <Alert variant="danger">{error}</Alert>;

//   return (
//     <Fragment>
//       <Card>
//         <Card.Body>
//           <div className="card-title main-content-label mb-4">
//             Sell Payment Management
//           </div>

//           {/* 🔍 Search */}
//           <div className="mb-3">
//             <input
//               value={globalFilter || ""}
//               onChange={(e) => setGlobalFilter(e.target.value)}
//               className="form-control"
//               placeholder="Search..."
//             />
//           </div>

//           {/* 📊 Table */}
//           <div className="table-responsive mt-3">
//             <table {...getTableProps()} className="table table-hover">
//               <thead>
//                 {headerGroups.map((hg) => (
//                   <tr {...hg.getHeaderGroupProps()}>
//                     {hg.headers.map((col) => (
//                       <th {...col.getHeaderProps(col.getSortByToggleProps())}>
//                         {col.render("Header")}
//                         {col.isSorted ? (col.isSortedDesc ? " 🔽" : " 🔼") : ""}
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
//                         <td {...cell.getCellProps()}>
//                           {cell.render("Cell")}
//                         </td>
//                       ))}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* ✅ MODAL */}
//       <Modal show={showModal} onHide={closeModal} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Sell Payment Details</Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           {detailedData && (
//             <>
//               <p><strong>Mobile:</strong> {detailedData.mobileNumber}</p>
//               <p><strong>Amount:</strong> ₹{detailedData.amount}</p>
//               <p><strong>Gateway Charges:</strong> ₹{detailedData.paymentGatewayCharges}</p>
//               <p><strong>Tax Amount:</strong> ₹{detailedData.taxAmount}</p>
//               <p><strong>Other Charges:</strong> ₹{detailedData.deliveryCharges}</p>
//               <p><strong>Status:</strong> {detailedData.paymentStatus}</p>

//               {detailedData.paymentStatus === "Admin Approve Pending" && (
//                 <Button
//                   variant="success"
//                   onClick={approvePayment}
//                   disabled={approving}
//                 >
//                   {approving ? "Approving..." : "Approve"}
//                 </Button>
//               )}
//             </>
//           )}
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={closeModal}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Fragment>
//   );
// }


import React, { Fragment, useEffect, useState, useMemo } from "react";
import { Card, Spinner, Alert, Button } from "react-bootstrap";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { useNavigate } from "react-router-dom";

export default function Catalog() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    fetchSellPayments();
  }, []);

  // 🔹 Fetch Sell Payment History
  const fetchSellPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/getAllSellPaymentHistoryForAdmin"
      );
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        const formatted = result.data.map((item, index) => ({
          _id: item._id,
          serial: index + 1,
          user_name: item.user_name || "—",
          mobileNumber: item.mobileNumber || "—",
          amount: item.amount || 0,
          paymentGatewayCharges: item.paymentGatewayCharges || 0,
          taxAmount: item.taxAmount || 0,
          otherCharges: item.otherCharges || 0,
          paymentStatus: item.paymentStatus || "—",
          timestamp: item.timestamp || "—",
        }));
        setData(formatted);
      } else {
        setError("Unexpected response format");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch sell payment history");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Direct Approve Payment with Navigation
  const handleApprove = async (paymentId, paymentStatus) => {
    if (!paymentId) return;

    // Don't approve if already approved
    if (paymentStatus === "Approved") {
      alert("This payment is already approved");
      return;
    }

    setApprovingId(paymentId);

    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/approveSellPayment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: paymentId }),
        }
      );

      const result = await response.json();

      if (result.success === true) {
        alert("✅ Sell payment approved successfully");

        // Refresh the table data
        fetchSellPayments();

        // Navigate to Sold page after 1 second
        setTimeout(() => {
          navigate("/app/Sold");
        }, 1000);
      } else {
        alert(result.message || "Approval failed");
      }
    } catch (error) {
      console.error("Approve error:", error);
      alert("Something went wrong while approving");
    } finally {
      setApprovingId(null);
    }
  };

  // 🔹 Table Columns
  const COLUMNS = useMemo(() => [
    { Header: "S.No", accessor: "serial" },
     { Header: "Name", accessor: "user_name" },
    { Header: "Mobile Number", accessor: "mobileNumber" },
    { Header: "Amount", accessor: "amount" },
    { Header: "Gateway Charges", accessor: "paymentGatewayCharges" },
    { Header: "Tax Amount", accessor: "taxAmount" },
    { Header: "Other Charges", accessor: "otherCharges" },
    { 
      Header: "Status", 
      accessor: "paymentStatus",
      Cell: ({ value }) => (
        <span style={{
          color: value === "Approved" ? "green" : 
                 value === "Pending" || value === "Admin Approve Pending" ? "orange" : "inherit",
          fontWeight: "bold"
        }}>
          {value}
        </span>
      )
    },
    {
      Header: "Actions",
      Cell: ({ row }) => {
        const paymentId = row.original._id;
        const paymentStatus = row.original.paymentStatus;
        const isApproving = approvingId === paymentId;
        
        // Only show Approve button for pending payments
        if (paymentStatus === "Admin Approve Pending" || paymentStatus === "Pending") {
          return (
            <Button
              size="sm"
              onClick={() => handleApprove(paymentId, paymentStatus)}
              disabled={isApproving}
              style={{
                backgroundColor: "#082038",
                border: "1px solid #082038",
                color: "#fff",
                opacity: isApproving ? 0.6 : 1,
              }}
            >
              {isApproving ? "Approving..." : "Approve"}
            </Button>
          );
        }
        
        // For already approved payments, show disabled button
        return (
          <Button
            size="sm"
            disabled
            style={{
              backgroundColor: "#28a745",
              border: "1px solid #28a745",
              color: "#fff",
            }}
          >
            Approved
          </Button>
        );
      },
    },
  ], [approvingId]);

  const tableInstance = useTable(
    {
      columns: COLUMNS,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    headerGroups,
    getTableBodyProps,
    prepareRow,
    page,
    state: { globalFilter },
    setGlobalFilter,
  } = tableInstance;

  if (loading) return <Spinner animation="border" className="m-4" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Fragment>
      <Card>
        <Card.Body>
          <div className="card-title main-content-label mb-4">
            Sell Payment Management
          </div>

          {/* 🔍 Search */}
          <div className="mb-3">
            <input
              value={globalFilter || ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="form-control"
              placeholder="Search..."
            />
          </div>

          {/* 📊 Table */}
          <div className="table-responsive mt-3">
            <table {...getTableProps()} className="table table-hover">
              <thead>
                {headerGroups.map((hg) => (
                  <tr {...hg.getHeaderGroupProps()}>
                    {hg.headers.map((col) => (
                      <th {...col.getHeaderProps(col.getSortByToggleProps())}>
                        {col.render("Header")}
                        {col.isSorted ? (col.isSortedDesc ? " 🔽" : " 🔼") : ""}
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
                        <td {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </Fragment>
  );
}