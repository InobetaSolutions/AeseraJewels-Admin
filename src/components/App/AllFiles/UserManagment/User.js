import React, { Fragment, useEffect, useState, useMemo } from "react";
import { Button, Card, Modal, Spinner, Alert } from "react-bootstrap";
import { useTable, useSortBy, usePagination } from "react-table";

export default function GetUsers() {
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [detailedData, setDetailedData] = useState(null);
  const [selectedMobile, setSelectedMobile] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [downloadLoading, setDownloadLoading] = useState(false);
  
  // Date range state
  const [dateRange, setDateRange] = useState({
    start_date: "",
    end_date: ""
  });

  // Initialize date range with current month on component mount
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };
    
    setDateRange({
      start_date: formatDate(firstDay),
      end_date: formatDate(lastDay)
    });
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    setDetailedData(null);
    setSelectedMobile("");
    setSelectedName("");
    setDownloadLoading(false);
  };

  const customButtonStyle = {
    backgroundColor: "#082038",
    border: "1px solid #082038",
    color: "#fff",
    padding: "0.375rem 0.75rem",
    borderRadius: "0.25rem",
    cursor: "pointer",
    userSelect: "none",
  };

  // Download Excel report
  const downloadCSV = async () => {
    if (!selectedMobile) {
      alert("No mobile number selected");
      return;
    }

    if (!dateRange.start_date || !dateRange.end_date) {
      alert("Please select both start and end dates");
      return;
    }

    // Validate date range
    if (new Date(dateRange.start_date) > new Date(dateRange.end_date)) {
      alert("Start date cannot be later than end date");
      return;
    }

    setDownloadLoading(true);

    try {
      // Prepare the request body
      const requestBody = {
        mobile: selectedMobile,
        name: selectedName,
        start_date: dateRange.start_date,
        end_date: dateRange.end_date
      };

      console.log("Sending request body:", requestBody);

      // Fetch Excel data from the API
      const response = await fetch(
        "http://13.204.96.244:3000/api/generate-transaction-report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }

      // Get the blob from response
      const blob = await response.blob();
      
      // Create filename with customer name and date range
      const cleanName = selectedName
        .replace(/[/\\?%*:|"<>]/g, '') // Remove problematic characters
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .trim();
      
      const startDateFormatted = dateRange.start_date.replace(/-/g, '');
      const endDateFormatted = dateRange.end_date.replace(/-/g, '');
      
      const filename = `transaction_report_${cleanName}_${startDateFormatted}_to_${endDateFormatted}.xlsx`;
      
      // Create and download the Excel file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error("Download failed:", err);
      alert(`Failed to download report: ${err.message}`);
    } finally {
      setDownloadLoading(false);
    }
  };

  // Fetch details and open modal
  const handleView = async (mobile, name) => {
    setSelectedMobile(mobile);
    setSelectedName(name || "");
    setShowModal(true);
    setModalLoading(true);
    setModalError("");
    setDetailedData(null);

    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/getUserPaymentAndAllotment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile }),
        }
      );

      const text = await response.text();
      const result = JSON.parse(text);

      if (!result || !result.payments) throw new Error("Invalid API response");

      const formatted = {
        payments: result.payments.map((p) => ({
          timestamp: p.timestamp,
          amount: p.amount ?? 0,
          totalGrams: p.totalGrams ?? 0,
        })),
      };

      setDetailedData(formatted);
    } catch (err) {
      console.error(err);
      setModalError("Unable to load details.");
    }

    setModalLoading(false);
  };

  // Table columns
  const COLUMNS = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: "serial",
        Cell: ({ row }) => row.index + 1,
        width: 80,
      },
      {
        Header: "Name",
        accessor: "name",
        minWidth: 150,
      },
      {
        Header: "Mobile",
        accessor: "mobile",
        minWidth: 150,
      },
      {
        Header: "Action",
        accessor: "actions",
        Cell: ({ row }) => (
          <button
            style={customButtonStyle}
            onClick={() => handleView(row.original.mobile, row.original.name)}
          >
            Report
          </button>
        ),
        width: 100,
      },
    ],
    []
  );

  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Fetch users
  useEffect(() => {
    fetch("http://13.204.96.244:3000/api/get-users")
      .then((res) => res.text())
      .then((t) => {
        const result = JSON.parse(t);
        if (Array.isArray(result)) {
          setData(
            result.map((user, index) => ({
              serial: index + 1,
              name: user.name || "N/A",
              mobile: user.mobile || "N/A",
            }))
          );
        }
      })
      .catch(console.error);
  }, []);

  const filteredData = useMemo(() => {
    const term = searchText.toLowerCase();
    return data.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        u.mobile.toLowerCase().includes(term)
    );
  }, [data, searchText]);

  const tableInstance = useTable(
    {
      columns: COLUMNS,
      data: filteredData,
      initialState: { pageSize: 10 },
    },
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
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    gotoPage,
    pageCount,
    pageOptions,
    setPageSize,
  } = tableInstance;

  const { pageIndex, pageSize } = state;

  return (
    <Fragment>
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between mb-4">
            <h4>User Management</h4>

            <input
              type="text"
              className="form-control w-25"
              placeholder="Search by name or mobile..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* TABLE */}
          <div className="table-responsive">
            <table
              {...getTableProps()}
              className="table table-hover mb-0"
              style={{ width: "100%" }}
            >
              <thead className="table-light">
                {headerGroups.map((group) => (
                  <tr {...group.getHeaderGroupProps()}>
                    {group.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        className="py-3"
                        style={{
                          borderBottom: "2px solid #dee2e6",
                          fontWeight: "600",
                          fontSize: "14px",
                          userSelect: "none",
                        }}
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody {...getTableBodyProps()}>
                {page.length > 0 ? (
                  page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td
                            {...cell.getCellProps()}
                            className="py-2 align-middle"
                            style={{ userSelect: "none" }}
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={COLUMNS.length}
                      className="text-center py-4 text-muted"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>

      {/* MODAL */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        
        {/* HEADER WITH DOWNLOAD BUTTON */}
        <Modal.Header closeButton>
          <Modal.Title>
            Payment Details – {selectedName} ({selectedMobile})
          </Modal.Title>

          <Button
            variant="primary"
            size="sm"
            style={{ 
              marginLeft: "auto", 
              fontWeight: "600",
              minWidth: "160px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "8px 16px"
            }}
            onClick={downloadCSV}
            disabled={downloadLoading || !selectedMobile || !dateRange.start_date || !dateRange.end_date}
          >
            {downloadLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Downloading...
              </>
            ) : (
              <>
                <i className="fas fa-download"></i>
                Download Report
              </>
            )}
          </Button>
        </Modal.Header>

        <Modal.Body>
          {modalLoading && (
            <div className="text-center p-4">
              <Spinner animation="border" />
              <p className="mt-2">Loading details...</p>
            </div>
          )}

          {modalError && <Alert variant="danger">{modalError}</Alert>}

          {/* Date Range Selector - Always show when modal is open */}
          {!modalLoading && (
            <div className="mb-4 p-3 border rounded bg-light">
              <h6 className="mb-3 fw-bold">Select Date Range for Report</h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dateRange.start_date}
                    onChange={(e) => setDateRange(prev => ({
                      ...prev,
                      start_date: e.target.value
                    }))}
                    max={dateRange.end_date}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">To Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dateRange.end_date}
                    onChange={(e) => setDateRange(prev => ({
                      ...prev,
                      end_date: e.target.value
                    }))}
                    min={dateRange.start_date}
                  />
                </div>
              </div>
              <div className="mt-3 text-muted small d-flex justify-content-between align-items-center">
                <div>
                  <i className="fas fa-info-circle me-1"></i>
                  Report will include transactions from <strong>{dateRange.start_date}</strong> to <strong>{dateRange.end_date}</strong>
                </div>
                <div className="text-end">
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => {
                      const today = new Date();
                      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                      
                      const formatDate = (date) => {
                        return date.toISOString().split('T')[0];
                      };
                      
                      setDateRange({
                        start_date: formatDate(firstDay),
                        end_date: formatDate(lastDay)
                      });
                    }}
                  >
                    Reset to Current Month
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PAYMENT TABLE */}
          {detailedData && !modalLoading && (
            <div className="mt-4">
              {/* <h6 className="mb-3 fw-bold">Recent Transactions</h6>
              <div className="table-responsive">
                <table className="table table-hover mb-0" style={{ width: "100%" }}>
                  <thead style={{ background: "#f5f6fa" }}>
                    <tr>
                      <th style={{ padding: "12px", userSelect: "none", fontWeight: "600" }}>SL No</th>
                      <th style={{ padding: "12px", userSelect: "none", fontWeight: "600" }}>Timestamp</th>
                      <th style={{ padding: "12px", userSelect: "none", fontWeight: "600" }}>Invest Amount</th>
                      <th style={{ padding: "12px", userSelect: "none", fontWeight: "600" }}>Received Gold(gm)</th>
                    </tr>
                  </thead>

                  <tbody>
                    {detailedData.payments.length > 0 ? (
                      detailedData.payments.map((p, index) => (
                        <tr key={index}>
                          <td style={{ padding: "12px" }}>{index + 1}</td>
                          <td style={{ padding: "12px" }}>{p.timestamp || "-"}</td>
                          <td style={{ padding: "12px", fontWeight: "500" }}>
                            ₹{p.amount.toFixed(2)}
                          </td>
                          <td style={{ padding: "12px", fontWeight: "500" }}>
                            {p.totalGrams ? `${p.totalGrams.toFixed(2)}g` : "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-3 text-muted">
                          No transaction records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div> */}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}







// import React, { Fragment, useEffect, useState, useMemo } from "react";
// import { Button, Card, Modal, Spinner, Alert } from "react-bootstrap";
// import { useTable, useSortBy, usePagination } from "react-table";

// export default function GetUsers() {
//   const [showModal, setShowModal] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [modalError, setModalError] = useState("");
//   const [detailedData, setDetailedData] = useState(null);
//   const [selectedMobile, setSelectedMobile] = useState("");

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setDetailedData(null);
//     setSelectedMobile("");
//   };

//   const customButtonStyle = {
//     backgroundColor: "#082038",
//     border: "1px solid #082038",
//     color: "#fff",
//     padding: "0.375rem 0.75rem",
//     borderRadius: "0.25rem",
//     cursor: "pointer",
//     userSelect: "none",
//   };

//   // ⭐ FETCH DETAILS + OPEN MODAL
//   const handleView = async (mobile) => {
//     setSelectedMobile(mobile);
//     setShowModal(true);
//     setModalLoading(true);
//     setModalError("");
//     setDetailedData(null);

//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getUserPaymentAndAllotment",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ mobile }),
//         }
//       );

//       const text = await response.text();
//       const result = JSON.parse(text);

//       if (!result || !result.payments) throw new Error("Invalid API response");

//       // FORMAT DATA (Correct fields)
//       const formatted = {
//         payments: result.payments.map((p) => ({
//           timestamp: p.timestamp,
//           totalAmount: p.totalAmount ?? 0,
//           // receivedAmount: p.totalAmount ?? 0,
//           totalGrams: p.totalGrams ?? 0
//         })),
//       };

//       setDetailedData(formatted);
//     } catch (err) {
//       console.error(err);
//       setModalError("Unable to load details.");
//     }

//     setModalLoading(false);
//   };

//   // ⭐ TABLE COLUMNS
//   const COLUMNS = useMemo(
//     () => [
//       {
//         Header: "S.No",
//         accessor: "serial",
//         Cell: ({ row }) => row.index + 1,
//         width: 80,
//       },
//       {
//         Header: "Name",
//         accessor: "name",
//         minWidth: 150,
//       },
//       {
//         Header: "Mobile",
//         accessor: "mobile",
//         minWidth: 150,
//       },
//       {
//         Header: "Action",
//         accessor: "actions",
//         Cell: ({ row }) => (
//           <button
//             style={customButtonStyle}
//             onClick={() => handleView(row.original.mobile)}
//           >
//             View
//           </button>
//         ),
//         width: 100,
//       },
//     ],
//     []
//   );

//   // FETCH USERS LIST
//   const [data, setData] = useState([]);
//   const [searchText, setSearchText] = useState("");

//   useEffect(() => {
//     fetch("http://13.204.96.244:3000/api/get-users")
//       .then((res) => res.text())
//       .then((t) => {
//         const result = JSON.parse(t);
//         if (Array.isArray(result)) {
//           setData(
//             result.map((user, index) => ({
//               serial: index + 1,
//               name: user.name || "N/A",
//               mobile: user.mobile || "N/A",
//             }))
//           );
//         }
//       })
//       .catch(console.error);
//   }, []);

//   const filteredData = useMemo(() => {
//     const term = searchText.toLowerCase();
//     return data.filter(
//       (u) =>
//         u.name.toLowerCase().includes(term) ||
//         u.mobile.toLowerCase().includes(term)
//     );
//   }, [data, searchText]);

//   const tableInstance = useTable(
//     {
//       columns: COLUMNS,
//       data: filteredData,
//       initialState: { pageSize: 10 },
//     },
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
//     nextPage,
//     previousPage,
//     canNextPage,
//     canPreviousPage,
//     gotoPage,
//     pageCount,
//     pageOptions,
//     setPageSize,
//   } = tableInstance;

//   const { pageIndex, pageSize } = state;

//   return (
//     <Fragment>
//       <Card>
//         <Card.Body>
//           <div className="d-flex justify-content-between mb-4">
//             <h4>User Management</h4>

//             <input
//               type="text"
//               className="form-control w-25"
//               placeholder="Search by name or mobile..."
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//             />
//           </div>

//           {/* TABLE */}
//           <div className="table-responsive">
//             <table
//               {...getTableProps()}
//               className="table table-hover mb-0"
//               style={{ width: "100%" }}
//             >
//               <thead className="table-light">
//                 {headerGroups.map((group) => (
//                   <tr {...group.getHeaderGroupProps()}>
//                     {group.headers.map((column) => (
//                       <th
//                         {...column.getHeaderProps()}
//                         className="py-3"
//                         style={{
//                           borderBottom: "2px solid #dee2e6",
//                           fontWeight: "600",
//                           fontSize: "14px",
//                           userSelect: "none",
//                         }}
//                       >
//                         {column.render("Header")}
//                       </th>
//                     ))}
//                   </tr>
//                 ))}
//               </thead>

//               <tbody {...getTableBodyProps()}>
//                 {page.length > 0 ? (
//                   page.map((row) => {
//                     prepareRow(row);
//                     return (
//                       <tr {...row.getRowProps()}>
//                         {row.cells.map((cell) => (
//                           <td
//                             {...cell.getCellProps()}
//                             className="py-2 align-middle"
//                             style={{ userSelect: "none" }}
//                           >
//                             {cell.render("Cell")}
//                           </td>
//                         ))}
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={COLUMNS.length}
//                       className="text-center py-4 text-muted"
//                     >
//                       No users found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//         </Card.Body>
//       </Card>

//       {/* MODAL */}
//       <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
//         <Modal.Header
//           closeButton
//           style={{ backgroundColor: "#082038", color: "white" }}
//         >
//           <Modal.Title>Payment Details – {selectedMobile}</Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           {modalLoading && (
//             <div className="text-center p-4">
//               <Spinner animation="border" />
//               <p className="mt-2">Loading details...</p>
//             </div>
//           )}

//           {modalError && <Alert variant="danger">{modalError}</Alert>}

//           {/* CLEAN PAYMENT DETAILS TABLE */}
//           {detailedData && !modalLoading && (
//             <div className="table-responsive">

//               <table className="table mb-0" style={{ width: "100%" }}>
//                 <thead style={{ background: "#f5f6fa" }}>
//                   <tr>
//                     <th style={{ padding: "12px", userSelect: "none" }}>SL No</th>
//                     <th style={{ padding: "12px", userSelect: "none" }}>Timestamp</th>
//                     <th style={{ padding: "12px", userSelect: "none" }}>Total Amount</th>
//                     {/* <th style={{ padding: "12px", userSelect: "none" }}>Received Amount</th> */}
//                     <th style={{ padding: "12px", userSelect: "none" }}>Gold (g)</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {detailedData.payments.map((p, index) => (
//                     <tr key={index}>
//                       <td style={{ padding: "12px" }}>{index + 1}</td>
//                       <td style={{ padding: "12px" }}>{p.timestamp || "-"}</td>
//                       <td style={{ padding: "12px" }}>₹{p.totalAmount.toFixed(2)}</td>
//                       {/* <td style={{ padding: "12px" }}>₹{p.receivedAmount.toFixed(2)}</td> */}
//                       <td style={{ padding: "12px" }}>
//                         {p.totalGrams ? `${p.totalGrams}g` : "-"}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//             </div>
//           )}
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Fragment>
//   );
// }





// import React, { Fragment, useEffect, useState, useMemo } from "react";
// import { Button, Card, Modal, Spinner, Alert } from "react-bootstrap";
// import { useTable, useSortBy, usePagination } from "react-table";

// export default function GetUsers() {
//   const [showModal, setShowModal] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [modalError, setModalError] = useState("");
//   const [detailedData, setDetailedData] = useState(null);
//   const [selectedMobile, setSelectedMobile] = useState("");

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setDetailedData(null);
//     setSelectedMobile("");
//   };

//   const customButtonStyle = {
//     backgroundColor: "#082038",
//     border: "1px solid #082038",
//     color: "#fff",
//     padding: "0.375rem 0.75rem",
//     borderRadius: "0.25rem",
//     cursor: "pointer",
//   };

//   // ⭐ OPEN MODAL + FETCH DETAIL DATA
//   const handleView = async (mobile) => {
//     setSelectedMobile(mobile);
//     setShowModal(true);
//     setModalLoading(true);
//     setModalError("");
//     setDetailedData(null);

//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getUserPaymentAndAllotment",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ mobile }),
//         }
//       );

//       const text = await response.text();
//       const result = JSON.parse(text);

//       if (result.error) {
//         throw new Error(result.error);
//       }

//       // Format the API response for display
//       const formattedData = {
//         mobileNumber: result.mobile,
//         summary: {
//           totalAmount: result.summary?.totalAmount || 0,
//           totalGrams: result.summary?.totalGrams || 0,
//         },
//         payments: result.payments?.map(payment => ({
//           id: payment._id,
//           amount: payment.amount,
//           totalWithTax: payment.totalWithTax,
//           taxAmount: payment.taxAmount,
//           gramAllocated: payment.gram_allocated,
//           status: payment.status,
//           timestamp: payment.timestamp,
//           createdAt: payment.createdAt,
//           updatedAt: payment.updatedAt,
//           gold: payment.gold || 0,
//           // Calculate amount per gram if available
//           amountPerGram: payment.gold ? (payment.amount / payment.gold).toFixed(2) : "N/A"
//         })) || [],
//         allotments: result.allotments?.map(allotment => ({
//           id: allotment._id,
//           grams: allotment.gram,
//           amountReduced: allotment.amountReduced,
//           status: allotment.status,
//           timestamp: allotment.timestamp,
//           // Calculate rate per gram
//           ratePerGram: allotment.amountReduced && allotment.gram ? 
//             (allotment.amountReduced / allotment.gram).toFixed(2) : "N/A"
//         })) || []
//       };

//       setDetailedData(formattedData);

//     } catch (error) {
//       console.error("Error fetching detailed data:", error);
//       setModalError("Unable to load data. Please try again.");
//     }

//     setModalLoading(false);
//   };

//   // 🔒 TABLE COLUMNS (with proper handleView reference)
//   const COLUMNS = useMemo(
//     () => [
//       {
//         Header: "S.No",
//         accessor: "serial",
//         Cell: ({ row }) => row.index + 1,
//       },
//       {
//         Header: "Name",
//         accessor: "name",
//       },
//       {
//         Header: "Mobile",
//         accessor: "mobile",
//       },
//       {
//         Header: "Actions",
//         accessor: "actions",
//         Cell: ({ row }) => (
//           <button
//             style={customButtonStyle}
//             size="sm"
//             onClick={() => handleView(row.original.mobile)}
//           >
//             View Details
//           </button>
//         ),
//       },
//     ],
//     []
//   );

//   const [data, setData] = useState([]);
//   const [searchText, setSearchText] = useState("");

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await fetch("http://13.204.96.244:3000/api/get-users");
//       const text = await response.text();
//       const result = JSON.parse(text);

//       if (Array.isArray(result)) {
//         setData(
//           result.map((user, index) => ({
//             serial: index + 1,
//             id: user._id || index,
//             name: user.name || "N/A",
//             mobile: user.mobile || "N/A",
//           }))
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   const filteredData = useMemo(() => {
//     const term = searchText.toLowerCase();
//     return data.filter(
//       (u) =>
//         u.name.toLowerCase().includes(term) ||
//         u.mobile.toLowerCase().includes(term)
//     );
//   }, [data, searchText]);

//   const tableInstance = useTable(
//     { columns: COLUMNS, data: filteredData },
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
//     nextPage,
//     previousPage,
//     canNextPage,
//     canPreviousPage,
//     gotoPage,
//     pageCount,
//     setPageSize,
//     pageOptions,
//   } = tableInstance;

//   const { pageIndex, pageSize } = state;

//   return (
//     <Fragment>
//       <Card>
//         <Card.Body>
//           <div className="d-flex justify-content-between mb-4">
//             <h4>User Management</h4>
//             <input
//               type="text"
//               placeholder="Search by name or Mobile..."
//               className="form-control w-25"
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//             />
//           </div>

//           <div className="d-flex mb-3">
//             <select
//               className="border me-2"
//               value={pageSize}
//               onChange={(e) => setPageSize(Number(e.target.value))}
//             >
//               {[10, 25, 50].map((size) => (
//                 <option key={size} value={size}>
//                   Show {size}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="table-responsive">
//             <table {...getTableProps()} className="table table-hover">
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

//           {/* PAGINATION */}
//           <div className="d-flex justify-content-between mt-3">
//             <span>
//               Page {pageIndex + 1} of {pageOptions.length}
//             </span>
//             <div>
//               <Button 
//                 variant="outline-secondary" 
//                 size="sm"
//                 onClick={() => gotoPage(0)} 
//                 disabled={!canPreviousPage}
//                 className="me-2"
//               >
//                 First
//               </Button>
//               <Button 
//                 variant="outline-secondary" 
//                 size="sm"
//                 onClick={() => previousPage()} 
//                 disabled={!canPreviousPage}
//                 className="me-2"
//               >
//                 Prev
//               </Button>
//               <Button 
//                 variant="outline-secondary" 
//                 size="sm"
//                 onClick={() => nextPage()} 
//                 disabled={!canNextPage}
//                 className="me-2"
//               >
//                 Next
//               </Button>
//               <Button 
//                 variant="outline-secondary" 
//                 size="sm"
//                 onClick={() => gotoPage(pageCount - 1)} 
//                 disabled={!canNextPage}
//               >
//                 Last
//               </Button>
//             </div>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* --------------------- MODAL ---------------------- */}
//       <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
//         <Modal.Header closeButton>
//           <Modal.Title>
//             User Details - {selectedMobile}
//           </Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           {modalLoading && (
//             <div className="text-center p-5">
//               <Spinner animation="border" variant="primary" />
//               <p className="mt-2">Loading user details...</p>
//             </div>
//           )}
          
//           {modalError && (
//             <Alert variant="danger" className="text-center">
//               {modalError}
//             </Alert>
//           )}

//           {detailedData && !modalLoading && (
//             <div className="container-fluid">
//               {/* SUMMARY SECTION */}
//               <div className="row mb-4">
//                 {/* <div className="col-12">
//                   <h5 className="border-bottom pb-2">Summary</h5>
//                   <div className="row">
//                     <div className="col-md-6">
//                       <div className="card bg-light">
//                         <div className="card-body">
//                           <h6 className="card-subtitle mb-2 text-muted">Total Investment</h6>
//                           <h4 className="card-title">₹{detailedData.summary.totalAmount.toFixed(2)}</h4>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-md-6">
//                       <div className="card bg-light">
//                         <div className="card-body">
//                           <h6 className="card-subtitle mb-2 text-muted">Total Grams</h6>
//                           <h4 className="card-title">{detailedData.summary.totalGrams} g</h4>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div> */}
//               </div>

//               {/* PAYMENTS SECTION */}
//               <div className="row mb-4">
//                 <div className="col-12">
//                   <h5 className="border-bottom pb-2 mb-3">Payment History</h5>
//                   <div className="table-responsive">
//                     <table className="">
//                       <thead className="table-dark">
//                         <tr>
//                           <th>#</th>
//                           <th>Amount (₹)</th>
//                           {/* <th>Total with Tax (₹)</th>
//                           <th>Tax (₹)</th>
//                           <th>Grams Allocated</th>
//                           <th>Gold (g)</th>
//                           <th>Rate/g (₹)</th>
//                           <th>Status</th> */}
//                           <th>Date</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {detailedData.payments.map((payment, index) => (
//                           <tr key={payment.id}>
//                             <td>{index + 1}</td>
//                             <td>{payment.amount.toFixed(2)}</td>
//                             {/* <td>{payment.totalWithTax.toFixed(2)}</td>
//                             <td>{payment.taxAmount.toFixed(2)}</td>
//                             <td>{payment.gramAllocated.toFixed(4)}</td>
//                             <td>{payment.gold.toFixed(4) || "N/A"}</td> */}
//                             {/* <td>{payment.amountPerGram}</td> */}
//                             <td>
//                               {/* <span className={`badge ${payment.status === 'Payment Confirmed' ? 'bg-success' : 'bg-warning'}`}>
//                                 {payment.status}
//                               </span> */}
//                             </td>
//                             <td>{payment.timestamp}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>

//               {/* ALLOTMENTS SECTION */}
//               <div className="row">
//                 <div className="col-12">
//                   <h5 className="border-bottom pb-2 mb-3">Allotments</h5>
//                   {detailedData.allotments.length > 0 ? (
//                     <div className="table-responsive">
//                       <table className="">
//                         <thead className="table-dark">
//                           <tr>
//                             <th>#</th>
//                             <th>Grams</th>
//                             {/* <th>Amount Reduced (₹)</th>
//                             <th>Rate/g (₹)</th>
//                             <th>Status</th> */}
//                             <th>Date</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {detailedData.allotments.map((allotment, index) => (
//                             <tr key={allotment.id}>
//                               <td>{index + 1}</td>
//                               <td>{allotment.grams} g</td>
//                               {/* <td>₹{allotment.amountReduced.toFixed(2)}</td>
//                               <td>₹{allotment.ratePerGram}/g</td> */}
//                               <td>
//                                 {/* <span className={`badge ${allotment.status === 'Payment Confirmed' ? 'bg-success' : 'bg-warning'}`}>
//                                   {allotment.status}
//                                 </span> */}
//                               </td>
//                               <td>{allotment.timestamp}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <Alert variant="info">
//                       No allotments found for this user.
//                     </Alert>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Fragment>
//   );
// }






// import React, { Fragment, useEffect, useState, useMemo } from "react";
// import { Button, Card, Modal, Spinner, Alert } from "react-bootstrap";
// import { useTable, useSortBy, usePagination } from "react-table";

// export default function GetUsers() {

//   const [showModal, setShowModal] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [modalError, setModalError] = useState("");
//   const [detailedData, setDetailedData] = useState(null);

//   const handleCloseModal = () => setShowModal(false);

//   const customButtonStyle = {
//     backgroundColor: "#082038",
//     border: "1px solid #082038",
//     color: "#fff",
//     padding: "0.375rem 0.75rem",
//     borderRadius: "0.25rem",
//     cursor: "pointer",
//   };

//   // ⭐ OPEN MODAL + FETCH DETAIL DATA
//   const handleView = async (mobile) => {
//     setShowModal(true);
//     setModalLoading(true);
//     setModalError("");
//     setDetailedData(null);

//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getUserPaymentAndAllotment",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ mobile }),
//         }
//       );

//       const text = await response.text();
//       const result = JSON.parse(text);

//       setDetailedData({
//         mobileNumber: result.mobile,
//         totalAmount: result.summary?.totalAmount,
//         totalGrams: result.summary?.totalGrams,

//         // PAYMENT DETAILS (first payment)
//         amountPayable: result.payments[0]?.totalWithTax,
//         taxAmount: result.payments[0]?.taxAmount,
//         investAmount: result.payments[0]?.investAmount || 0,
//         status: result.payments[0]?.status,
//         createdAt: result.payments[0]?.timestamp,
//         deliveryCharge: 300,

//         // Items
//         items: result.payments.map((p) => ({
//           coinGrams: p.gram_allocated,
//           quantity: 1,
//           amount: p.amount,
//         })),

//         // Address dummy (you can replace if API provides)
//         address: "23, Muthu mari St",
//         city: "Chennai",
//         postCode: "600001",

//         // Allotments
//         allotments: result.allotments,
//       });

//     } catch (error) {
//       console.error(error);
//       setModalError("Unable to load data. Please try again.");
//     }

//     setModalLoading(false);
//   };

//   // 🔒 TABLE COLUMNS
//   const COLUMNS = useMemo(
//     () => [
//       {
//         Header: "S.No",
//         accessor: "serial",
//         Cell: ({ row }) => row.index + 1,
//       },
//       {
//         Header: "Name",
//         accessor: "name",
//       },
//       {
//         Header: "Mobile",
//         accessor: "mobile",
//       },
//       {
//         Header: "Status",
//         accessor: "status",
//         Cell: ({ row }) => (
//           <button
//             style={customButtonStyle}
//             size="sm"
//             onClick={() => handleView(row.original.mobile)}
//           >
//             View
//           </button>
//         ),
//       },
//     ],
//     []
//   );

//   const [data, setData] = useState([]);
//   const [searchText, setSearchText] = useState("");

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await fetch("http://13.204.96.244:3000/api/get-users");
//       const text = await response.text();
//       const result = JSON.parse(text);

//       if (Array.isArray(result)) {
//         setData(
//           result.map((user, index) => ({
//             serial: index + 1,
//             id: user._id || index,
//             name: user.name || "N/A",
//             mobile: user.mobile || "N/A",
//           }))
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   const filteredData = useMemo(() => {
//     const term = searchText.toLowerCase();
//     return data.filter(
//       (u) =>
//         u.name.toLowerCase().includes(term) ||
//         u.mobile.toLowerCase().includes(term)
//     );
//   }, [data, searchText]);

//   const tableInstance = useTable(
//     { columns: COLUMNS, data: filteredData },
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
//     nextPage,
//     previousPage,
//     canNextPage,
//     canPreviousPage,
//     gotoPage,
//     pageCount,
//     setPageSize,
//     pageOptions,
//   } = tableInstance;

//   const { pageIndex, pageSize } = state;

//   return (
//     <Fragment>
//       <Card>
//         <Card.Body>
//           <div className="d-flex justify-content-between mb-4">
//             <h4>User Management</h4>

//             <input
//               type="text"
//               placeholder="Search by name or Mobile..."
//               className="form-control w-25"
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//             />
//           </div>

//           <div className="d-flex mb-3">
//             <select
//               className="border me-2"
//               value={pageSize}
//               onChange={(e) => setPageSize(Number(e.target.value))}
//             >
//               {[10, 25, 50].map((size) => (
//                 <option key={size} value={size}>
//                   Show {size}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="table-responsive">
//             <table {...getTableProps()} className="table table-hover">
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

//           {/* PAGINATION */}
//           <div className="d-flex justify-content-between mt-3">
//             <span>
//               Page {pageIndex + 1} of {pageOptions.length}
//             </span>

//             <div>
//               <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
//                 First
//               </Button>
//               <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
//                 Prev
//               </Button>
//               <Button onClick={() => nextPage()} disabled={!canNextPage}>
//                 Next
//               </Button>
//               <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
//                 Last
//               </Button>
//             </div>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* --------------------- MODAL ---------------------- */}
//       <Modal show={showModal} onHide={handleCloseModal} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Payment Details</Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           {modalLoading && <Spinner animation="border" className="m-4" />}
//           {modalError && <Alert variant="danger">{modalError}</Alert>}

//           {detailedData && !modalLoading && (
//             <div className="row">
//               {/* LEFT SIDE */}
//               <div className="col-md-6">
//                 {/* <p><strong>Mobile Number:</strong> {detailedData.mobileNumber}</p> */}
//                 <p><strong>Total Amount:</strong> ₹{detailedData.totalAmount}</p>
//                 {/* <p><strong>Tax Amount:</strong> ₹{detailedData.taxAmount}</p>
//                 <p><strong>Delivery Charge:</strong> ₹{detailedData.deliveryCharge}</p> */}
//               </div>

//               {/* RIGHT SIDE */}
//               <div className="col-md-6">
//                 {/* <p><strong>Total Grams:</strong> {detailedData.totalGrams}</p>
//                 <p><strong>Amount Payable:</strong> ₹{detailedData.amountPayable}</p>
//                 <p><strong>Status:</strong> {detailedData.status}</p> */}
//                 <p><strong>Created:</strong> {detailedData.createdAt}</p>
//               </div>

//               {/* ITEMS */}
//               {detailedData.items?.length > 0 && (
//                 <div className="col-12 mt-3">
//                   {/* <h6>Items:</h6> */}
//                   <table className="table table-bordered table-sm">
//                     {/* <thead>
//                       <tr>
//                         <th>#</th>
//                         <th>Coin Grams</th>
//                         <th>Quantity</th>
//                         <th>Amount</th>
//                       </tr>
//                     </thead> */}
//                     <tbody>
//                       {detailedData.items.map((item, i) => (
//                         <tr key={i}>
//                           {/* <td>{i + 1}</td>
//                           <td>{item.coinGrams} g</td>
//                           <td>{item.quantity}</td>
//                           <td>₹{item.amount}</td> */}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}

//               {/* ALLOTMENTS */}
//               {detailedData.allotments?.length > 0 && (
//                 <div className="col-12 mt-3">
//                   <h6>Allotments:</h6>
//                   <table className="table table-bordered table-sm">
//                     <thead>
//                       <tr>
//                         <th>#</th>
//                         {/* <th>Grams</th>
//                         <th>Amount Reduced</th>
//                         <th>Status</th> */}
//                         <th>Timestamp</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {detailedData.allotments.map((a, i) => (
//                         <tr key={i}>
//                           <td>{i + 1}</td>
//                           {/* <td>{a.gram}</td>
//                           <td>{a.amountReduced}</td>
//                           <td>{a.status}</td> */}
//                           <td>{a.timestamp}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}

//               {/* ADDRESS */}
             
//             </div>
//           )}
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Fragment>
//   );
// }










// import React, { Fragment, useEffect, useState, useMemo } from "react";
// import { Button, Card } from "react-bootstrap";
// import Swal from "sweetalert2";
// import { useTable, useSortBy, usePagination } from "react-table";

// export default function GetUsers() {

//   const customButtonStyle = {
//     backgroundColor: "#082038",
//     border: "1px solid #082038",
//     color: "#fff",
//     padding: "0.375rem 0.75rem",
//     borderRadius: "0.25rem",
//     cursor: "pointer",
//   };

//   // 🔒 MEMOIZED COLUMNS (prevents infinite rerenders)
//   const COLUMNS = useMemo(
//     () => [
//       {
//         Header: "S.No",
//         accessor: "serial",
//         Cell: ({ row }) => row.index + 1,
//         className: "wd-5p borderrigth",
//       },
//       {
//         Header: "Name",
//         accessor: "name",
//         className: "wd-20p borderrigth",
//       },
//       {
//         Header: "Mobile",
//         accessor: "mobile",
//         className: "wd-25p borderrigth",
//       },

//       // ⭐ NEW COLUMN ADDED — Status + View Button
//       {
//         Header: "Status",
//         accessor: "status",
//         className: "wd-20p borderrigth",
//         // Cell: ({ row }) => (
//         //   <Button
//         //     variant="primary"
//         //     size="sm"
//         //     onClick={() => alert(`Viewing user: ${row.original.name}`)}
//         //   >
//         //     View
//         //   </Button>
//         // ),
//           Cell: ({ row }) => (
//           <button
//             style={customButtonStyle}
//             size="sm"
//             onClick={() => handleView(row.original.mobile)}
//           >
//             View
//           </button>
//         ),
//         className: "wd-15p borderrigth",
//       },
//     ],
//     []
//   );

//   const [data, setData] = useState([]);
//   const [searchText, setSearchText] = useState("");

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await fetch("http://13.204.96.244:3000/api/get-users");
//       const text = await response.text();
//       try {
//         const result = JSON.parse(text);
//         if (Array.isArray(result)) {
//           setData(
//             result.map((user, index) => ({
//               serial: index + 1,
//               id: user._id || index,
//               name: user.name || "N/A",
//               mobile: user.mobile || "N/A",
//             }))
//           );
//         }
//       } catch (err) {
//         console.error("JSON parse error:", err);
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   // 🔍 FILTER DATA (Memoized)
//   const filteredData = useMemo(() => {
//     const term = searchText.toLowerCase();

//     return data.filter(
//       (user) =>
//         user.name.toLowerCase().includes(term) ||
//         user.mobile.toLowerCase().includes(term)
//     );
//   }, [data, searchText]);

//   const tableInstance = useTable(
//     { columns: COLUMNS, data: filteredData },
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
//     gotoPage,
//     pageCount,
//     setPageSize,
//   } = tableInstance;

//   const { pageIndex, pageSize } = state;

//   return (
//     <Fragment>
//       <Card>
//         <Card.Body>
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <div
//               className="card-title main-content-label"
//               style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
//             >
//               User Management
//             </div>

//             {/* 🔍 SEARCH INPUT */}
//             <input
//               type="text"
//               placeholder="Search by name or Mobile..."
//               className="form-control w-25"
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//             />
//           </div>

//           <div className="d-flex">
//             <select
//               className="mb-4 selectpage border me-1"
//               value={pageSize}
//               onChange={(e) => setPageSize(Number(e.target.value))}
//             >
//               {[10, 25, 50].map((size) => (
//                 <option key={size} value={size}>
//                   Show {size}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="table-responsive">
//             <table {...getTableProps()} className="table table-hover mb-0">
//               <thead>
//                 {headerGroups.map((headerGroup) => (
//                   <tr {...headerGroup.getHeaderGroupProps()}>
//                     {headerGroup.headers.map((column) => (
//                       <th
//                         className={column.className}
//                         {...column.getHeaderProps(column.getSortByToggleProps())}
//                       >
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
//                         <td className="borderrigth" {...cell.getCellProps()}>
//                           {cell.render("Cell")}
//                         </td>
//                       ))}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="d-block d-sm-flex mt-4">
//             <span>
//               Page{" "}
//               <strong>
//                 {pageIndex + 1} of {pageOptions.length}
//               </strong>
//             </span>
//             <span className="ms-sm-auto">
//               <Button
//                 variant=""
//                 className="btn-default tablebutton me-2"
//                 onClick={() => gotoPage(0)}
//                 disabled={!canPreviousPage}
//               >
//                 {" Previous "}
//               </Button>

//               <Button
//                 variant=""
//                 className="btn-default tablebutton me-2"
//                 onClick={() => previousPage()}
//                 disabled={!canPreviousPage}
//               >
//                 {" << "}
//               </Button>

//               <Button
//                 variant=""
//                 className="btn-default tablebutton me-2"
//                 onClick={() => nextPage()}
//                 disabled={!canNextPage}
//               >
//                 {" >> "}
//               </Button>

//               <Button
//                 variant=""
//                 className="btn-default tablebutton me-2"
//                 onClick={() => gotoPage(pageCount - 1)}
//                 disabled={!canNextPage}
//               >
//                 {" Next "}
//               </Button>
//             </span>
//           </div>
//         </Card.Body>
//       </Card>
//     </Fragment>
//   );
// }





// import React, { Fragment, useEffect, useState, useMemo } from "react";
// import { Button, Card } from "react-bootstrap";
// import Swal from "sweetalert2";
// import { useTable, useSortBy, usePagination } from "react-table";

// export default function GetUsers() {
//   // 🔒 MEMOIZED COLUMNS (prevents infinite rerenders)
//   const COLUMNS = useMemo(
//     () => [
//       {
//         Header: "S.No",
//         accessor: "serial",
//         Cell: ({ row }) => row.index + 1,
//         className: "wd-5p borderrigth",
//       },
//       {
//         Header: "Name",
//         accessor: "name",
//         className: "wd-20p borderrigth",
//       },
//       {
//         Header: "Mobile",
//         accessor: "mobile",
//         className: "wd-25p borderrigth",
//       },
//     ],
//     []
//   );

//   const [data, setData] = useState([]);
//   const [searchText, setSearchText] = useState("");

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await fetch("http://13.204.96.244:3000/api/get-users");
//       const text = await response.text();
//       try {
//         const result = JSON.parse(text);
//         if (Array.isArray(result)) {
//           setData(
//             result.map((user, index) => ({
//               serial: index + 1,
//               id: user._id || index,
//               name: user.name || "N/A",
//               mobile: user.mobile || "N/A",
//             }))
//           );
//         }
//       } catch (err) {
//         console.error("JSON parse error:", err);
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   // 🔍 FILTER DATA (Memoized to prevent infinite loops)
//   const filteredData = useMemo(() => {
//     const term = searchText.toLowerCase();

//     return data.filter(
//       (user) =>
//         user.name.toLowerCase().includes(term) ||
//         user.mobile.toLowerCase().includes(term)
//     );
//   }, [data, searchText]);

//   // ⛔ NO useGlobalFilter (avoids recursive sorting update)
//   const tableInstance = useTable(
//     { columns: COLUMNS, data: filteredData },
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
//     gotoPage,
//     pageCount,
//     setPageSize,
//   } = tableInstance;

//   const { pageIndex, pageSize } = state;

//   return (
//     <Fragment>
//       <Card>
//         <Card.Body>
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <div
//               className="card-title main-content-label"
//               style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
//             >
//               User Management
//             </div>

//             {/* 🔍 SEARCH INPUT */}
//             <input
//               type="text"
//               placeholder="Search by name or Mobile..."
//               className="form-control w-25"
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//             />
//           </div>

//           <div className="d-flex">
//             <select
//               className="mb-4 selectpage border me-1"
//               value={pageSize}
//               onChange={(e) => setPageSize(Number(e.target.value))}
//             >
//               {[10, 25, 50].map((size) => (
//                 <option key={size} value={size}>
//                   Show {size}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="table-responsive">
//             <table {...getTableProps()} className="table table-hover mb-0">
//               <thead>
//                 {headerGroups.map((headerGroup) => (
//                   <tr {...headerGroup.getHeaderGroupProps()}>
//                     {headerGroup.headers.map((column) => (
//                       <th
//                         className={column.className}
//                         {...column.getHeaderProps(column.getSortByToggleProps())}
//                       >
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
//                         <td className="borderrigth" {...cell.getCellProps()}>
//                           {cell.render("Cell")}
//                         </td>
//                       ))}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="d-block d-sm-flex mt-4">
//             <span>
//               Page{" "}
//               <strong>
//                 {pageIndex + 1} of {pageOptions.length}
//               </strong>
//             </span>
//             <span className="ms-sm-auto">
//               <Button
//                 variant=""
//                 className="btn-default tablebutton me-2"
//                 onClick={() => gotoPage(0)}
//                 disabled={!canPreviousPage}
//               >
//                 {" Previous "}
//               </Button>

//               <Button
//                 variant=""
//                 className="btn-default tablebutton me-2"
//                 onClick={() => previousPage()}
//                 disabled={!canPreviousPage}
//               >
//                 {" << "}
//               </Button>

//               <Button
//                 variant=""
//                 className="btn-default tablebutton me-2"
//                 onClick={() => nextPage()}
//                 disabled={!canNextPage}
//               >
//                 {" >> "}
//               </Button>

//               <Button
//                 variant=""
//                 className="btn-default tablebutton me-2"
//                 onClick={() => gotoPage(pageCount - 1)}
//                 disabled={!canNextPage}
//               >
//                 {" Next "}
//               </Button>
//             </span>
//           </div>
//         </Card.Body>
//       </Card>
//     </Fragment>
//   );
// }






// import React, { Fragment, useEffect, useState } from "react";
// import { Button, Card } from "react-bootstrap";
// import Swal from "sweetalert2";
// import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";

// export default function GetUsers() {
//   const COLUMNS = React.useMemo(
//     () => [
//       {
//         Header: "S.No",
//         accessor: "serial",
//         Cell: ({ row }) => row.index + 1,
//         className: "wd-5p borderrigth",
//       },
//       {
//         Header: "Name",
//         accessor: "name",
//         className: "wd-20p borderrigth",
//       },
//       {
//         Header: "Mobile",
//         accessor: "mobile",
//         className: "wd-25p borderrigth",
//       },
//       // {
//       //   Header: "Actions",
//       //   accessor: "actions",
//       //   Cell: ({ row }) => (
//       //     <Button
//       //       variant={row.original.blocked ? "success" : "danger"}
//       //       onClick={() => handleBlockUnblock(row.original.id, row.original.blocked)}
//       //     >
//       //       {row.original.blocked ? "Unblock" : "Block"}
//       //     </Button>
//       //   ),
//       //   className: "wd-20p borderrigth",
//       // },
//     ],
//     []
//   );

//   const [data, setData] = useState([]);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await fetch("http://13.204.96.244:3000/api/get-users");
//       const text = await response.text();
//       try {
//         const result = JSON.parse(text);
//         if (Array.isArray(result)) {
//           setData(
//             result.map((user, index) => ({
//               serial: index + 1,
//               id: user._id || index,
//               name: user.name || "N/A",
//               mobile: user.mobile || "N/A",
//               // blocked: Boolean(user.blocked), // assuming API has `blocked`
//             }))
//           );
//         }
//       } catch (err) {
//         console.error("JSON parse error:", err);
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   const handleBlockUnblock = async (userId, currentStatus) => {
//     const action = currentStatus ? "unblock" : "block";
//     const result = await Swal.fire({
//       title: `Are you sure?`,
//       text: `You are about to ${action} this user.`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: `Yes, ${action} it!`,
//       cancelButtonText: "Cancel",
//       confirmButtonColor: currentStatus ? "#28a745" : "#dc3545",
//     });

//     if (result.isConfirmed) {
//       try {
//         // Replace with your real API call
//         // await Api_Service.authpost("blockUnblockUser", { _id: userId, blockStatus: !currentStatus });

//         setData((prevData) =>
//           prevData.map((user) =>
//             user.id === userId ? { ...user, blocked: !currentStatus } : user
//           )
//         );

//         Swal.fire({
//           title: "Success!",
//           text: `User has been ${action}ed successfully.`,
//           icon: "success",
//           timer: 1500,
//         });
//       } catch (error) {
//         Swal.fire({
//           title: "Error!",
//           text: "Something went wrong while updating user.",
//           icon: "error",
//         });
//       }
//     }
//   };

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
//     gotoPage,
//     pageCount,
//     setPageSize,
//   } = tableInstance;

//   const { pageIndex, pageSize } = state;

//   return (
//     <Fragment>
//       <Card>
//         <Card.Body>
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <div
//               className="card-title main-content-label"
//               style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
//             >
//               User Management
//             </div>
//           </div>

//           <div className="d-flex">
//             <select
//               className="mb-4 selectpage border me-1"
//               value={pageSize}
//               onChange={(e) => setPageSize(Number(e.target.value))}
//             >
//               {[10, 25, 50].map((size) => (
//                 <option key={size} value={size}>
//                   Show {size}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="table-responsive">
//             <table {...getTableProps()} className="table table-hover mb-0">
//               <thead>
//                 {headerGroups.map((headerGroup) => (
//                   <tr {...headerGroup.getHeaderGroupProps()}>
//                     {headerGroup.headers.map((column) => (
//                       <th
//                         className={column.className}
//                         {...column.getHeaderProps(column.getSortByToggleProps())}
//                       >
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
//                         <td className="borderrigth" {...cell.getCellProps()}>
//                           {cell.render("Cell")}
//                         </td>
//                       ))}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           <div className="d-block d-sm-flex mt-4">
//             <span>
//               Page{" "}
//               <strong>
//                 {pageIndex + 1} of {pageOptions.length}
//               </strong>
//             </span>
//             <span className="ms-sm-auto">
//               <Button
//                 variant=""
//                 className="btn-default tablebutton me-2 d-sm-inline d-block my-1"
//                 onClick={() => gotoPage(0)}
//                 disabled={!canPreviousPage}
//               >
//                 {" Previous "}
//               </Button>
//               <Button
//                 variant=""
//                 className="btn-default tablebutton me-2 my-1"
//                 onClick={() => previousPage()}
//                 disabled={!canPreviousPage}
//               >
//                 {" << "}
//               </Button>
//               <Button
//                 variant=""
//                 className="btn-default tablebutton me-2 my-1"
//                 onClick={() => nextPage()}
//                 disabled={!canNextPage}
//               >
//                 {" >> "}
//               </Button>
//               <Button
//                 variant=""
//                 className="btn-default tablebutton me-2 d-sm-inline d-block my-1"
//                 onClick={() => gotoPage(pageCount - 1)}
//                 disabled={!canNextPage}
//               >
//                 {" Next "}
//               </Button>
//             </span>
//           </div>
//         </Card.Body>
//       </Card>
//     </Fragment>
//   );
// }










// import React, { Fragment, useEffect, useState } from "react";
// import { Button, Card } from "react-bootstrap";
// import Swal from "sweetalert2";
// import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";
// import { useNavigate } from "react-router-dom";

// export default function GetUsers() {
//   const COLUMNS = React.useMemo(
//     () => [
//       {
//         Header: "S.No",
//         accessor: "serial",
//         Cell: ({ row }) => row.index + 1,
//         className: "wd-5p borderrigth",
//       },
//       {
//         Header: "Name",
//         accessor: "name",
//         className: "wd-20p borderrigth",
//       },
//       {
//         Header: "Mobile",
//         accessor: "mobile",
//         className: "wd-25p borderrigth",
//       },
//       {
//         Header: "Actions",
//         accessor: "actions",
//         Cell: ({ row }) => (
//           <div>
//             <Button
//               variant="primary"
//               onClick={() => handleView(row.original)}
//               className="me-2"
//             >
//               View
//             </Button>
//             <Button
//               variant={row.original.blocked ? "success" : "danger"}
//               onClick={() => handleBlockUnblock(row.original.id, row.original.blocked)}
//             >
//               {row.original.blocked ? "Unblock" : "Block"}
//             </Button>
//           </div>
//         ),
//         className: "wd-20p borderrigth",
//       },
//     ],
//     []
//   );

//   const [data, setData] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await fetch("http://13.204.96.244:3000/api/get-users");
//       const text = await response.text();
//       try {
//         const result = JSON.parse(text);
//         if (Array.isArray(result)) {
//           setData(
//             result.map((user, index) => ({
//               serial: index + 1,
//               id: user._id || index,
//               name: user.name || "N/A",
//               mobile: user.mobile || "N/A",
//               blocked: Boolean(user.blocked), // assume API gives `blocked`
//             }))
//           );
//         } else {
//           console.error("Unexpected response format", result);
//         }
//       } catch (err) {
//         console.error("JSON parse error:", err);
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   const handleView = (user) => {
//     let path = `${process.env.PUBLIC_URL}/usermanagement/userdetails`;
//     navigate(path, { state: { userdata: user } });
//   };

//   const handleBlockUnblock = async (userId, currentStatus) => {
//     const action = currentStatus ? "unblock" : "block";
//     const result = await Swal.fire({
//       title: `Are you sure?`,
//       text: `You are about to ${action} this user.`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: `Yes, ${action} it!`,
//       cancelButtonText: "Cancel",
//       confirmButtonColor: currentStatus ? "#28a745" : "#dc3545",
//     });

//     if (result.isConfirmed) {
//       try {
//         // Fake API update, replace with your real API call
//         // await Api_Service.authpost("blockUnblockUser", { _id: userId, blockStatus: !currentStatus });

//         setData((prevData) =>
//           prevData.map((user) =>
//             user.id === userId ? { ...user, blocked: !currentStatus } : user
//           )
//         );

//         Swal.fire({
//           title: "Success!",
//           text: `User has been ${action}ed successfully.`,
//           icon: "success",
//           timer: 1500,
//         });
//       } catch (error) {
//         Swal.fire({
//           title: "Error!",
//           text: "Something went wrong while updating user.",
//           icon: "error",
//         });
//       }
//     }
//   };

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
//     gotoPage,
//     pageCount,
//     setPageSize,
//   } = tableInstance;

//   const { pageIndex, pageSize } = state;

//   return (
//     <Fragment>
//       <Card>
//         <Card.Body>
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <div
//               className="card-title main-content-label text-primary"
//               style={{ fontSize: "1.25rem", paddingLeft: 10 }}
//             >
//               User List
//             </div>
//           </div>

//           <div className="d-flex">
//             <select
//               className="mb-4 selectpage border me-1"
//               value={pageSize}
//               onChange={(e) => setPageSize(Number(e.target.value))}
//             >
//               {[10, 25, 50].map((size) => (
//                 <option key={size} value={size}>
//                   Show {size}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="table-responsive">
//             <table {...getTableProps()} className="table table-hover mb-0">
//               <thead>
//                 {headerGroups.map((headerGroup) => (
//                   <tr {...headerGroup.getHeaderGroupProps()}>
//                     {headerGroup.headers.map((column) => (
//                       <th
//                         className={column.className}
//                         {...column.getHeaderProps(column.getSortByToggleProps())}
//                       >
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
//                         <td className="borderrigth" {...cell.getCellProps()}>
//                           {cell.render("Cell")}
//                         </td>
//                       ))}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           <div className="d-block d-sm-flex mt-4">
//             <span>
//               Page{" "}
//               <strong>
//                 {pageIndex + 1} of {pageOptions.length}
//               </strong>
//             </span>
//             <span className="ms-sm-auto">
//               <Button
//                 variant=""
//                 className="btn-default tablebutton me-2 d-sm-inline d-block my-1"
//                 onClick={() => gotoPage(0)}
//                 disabled={!canPreviousPage}
//               >
//                 {" Previous "}
//               </Button>
//               <Button
//                 variant=""
//                 className="btn-default tablebutton me-2 my-1"
//                 onClick={() => previousPage()}
//                 disabled={!canPreviousPage}
//               >
//                 {" << "}
//               </Button>
//               <Button
//                 variant=""
//                 className="btn-default tablebutton me-2 my-1"
//                 onClick={() => nextPage()}
//                 disabled={!canNextPage}
//               >
//                 {" >> "}
//               </Button>
//               <Button
//                 variant=""
//                 className="btn-default tablebutton me-2 d-sm-inline d-block my-1"
//                 onClick={() => gotoPage(pageCount - 1)}
//                 disabled={!canNextPage}
//               >
//                 {" Next "}
//               </Button>
//             </span>
//           </div>
//         </Card.Body>
//       </Card>
//     </Fragment>
//   );
// }
