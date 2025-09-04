// import React, { Fragment, useEffect, useState } from "react";
// import { Button, Card } from "react-bootstrap";
// import Swal from "sweetalert2";
// import {
//   useTable,
//   useSortBy,
//   useGlobalFilter,
//   usePagination,
// } from "react-table";

// export default function GetPayments() {
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
//         className: "wd-20p borderrigth",
//       },
//       {
//         Header: "Amount",
//         accessor: "amount",
//         Cell: ({ value }) => `₹${value.toLocaleString()}`,
//         className: "wd-20p borderrigth",
//       },
//       {
//         Header: "Status",
//         accessor: "status",
//         Cell: ({ value }) => (
//           <span
//             className={
//               value === "Approved"
//                 ? "text-success fw-bold"
//                 : "text-danger fw-bold"
//             }
//           >
//             {value}
//           </span>
//         ),
//         className: "wd-15p borderrigth",
//       },
//       {
//         Header: "Actions",
//         accessor: "actions",
//         Cell: ({ row }) =>
//           row.original.status !== "Approved" ? (
//             // <Button
//             //   variant="primary"
//             //   size="sm"
//             //   onClick={() => approvePayment(row.original.id)}
//             // >
//             //   Approve
//             // </Button>
//             <button
//               style={{
//                 backgroundColor: "#082038",
//                 border: "1px solid #082038",
//                 color: "#fff",
//                 padding: "0.375rem 0.75rem",
//                 borderRadius: "0.25rem",
//                 cursor: "pointer",
//               }}
//               size="sm"
//               onClick={() => approvePayment(row.original.id)}
//             >
//               Approve
//             </button>
//           ) : (
//             "-"
//           ),
//         className: "wd-15p borderrigth",
//       },
//     ],
//     []
//   );

//   const [data, setData] = useState([]);

//   useEffect(() => {
//     fetchPayments();
//   }, []);

//   const fetchPayments = async () => {
//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getAllPayments"
//       );
//       const result = await response.json();
//       if (Array.isArray(result)) {
//         setData(
//           result.map((p, index) => ({
//             serial: index + 1,
//             id: p._id || index,
//             mobile: p.mobile || "N/A",
//             amount: p.amount || 0,
//              name: p.name || "N/A",
//             status: p.status || "Pending",
//           }))
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching payments:", error);
//     }
//   };

//   const approvePayment = async (id) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "Hope, You Verified the Payment.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Verified!",
//       cancelButtonText: "Cancel",
//       confirmButtonColor: "#007bff",
//     });

//     if (result.isConfirmed) {
//       try {
//         await fetch("http://13.204.96.244:3000/api/approve-payment", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ id }),
//         });

//         setData((prev) =>
//           prev.map((p) => (p.id === id ? { ...p, status: "Approved" } : p))
//         );

//         Swal.fire({
//           title: "Success!",
//           text: "Payment has been Approved successfully.",
//           icon: "success",
//           timer: 1500,
//         });
//       } catch (error) {
//         Swal.fire({
//           title: "Error!",
//           text: "Something went wrong while approving payment.",
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
//               Payments
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
//                         {...column.getHeaderProps(
//                           column.getSortByToggleProps()
//                         )}
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



import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Modal, Table, Spinner, Alert } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";

export default function GetPayments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedMobile, setSelectedMobile] = useState("");
  const [modalData, setModalData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const COLUMNS = React.useMemo(
    () => [
      {
        Header: "S.No",
        accessor: "serial",
        Cell: ({ row }) => row.index + 1,
        className: "wd-5p borderrigth",
      },
      {
        Header: "Name",
        accessor: "name",
        className: "wd-20p borderrigth",
      },
      {
        Header: "Mobile",
        accessor: "mobile",
        className: "wd-20p borderrigth",
      },
       
      {
        Header: "Amount",
        accessor: "amount",
        Cell: ({ value }) => `₹ ${value.toLocaleString()}`,
        className: "wd-20p borderrigth",
      },
      // {
      //   Header: "OthersMobile",
      //   accessor: "others",
      //   className: "wd-20p borderrigth",
      // },
      // {
      //   Header: "OthersRupees",
      //   accessor: "totalAmount",
      //   className: "wd-20p borderrigth",
      // },
      // {
      //   Header: "OthersGrams",
      //   accessor: "totalGrams",
      //   className: "wd-20p borderrigth",
      // },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={
              value === "Approved"
                ? "text-success fw-bold"
                : "text-danger fw-bold"
            }
          >
            {value}
          </span>
        ),
        className: "wd-15p borderrigth",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) =>
          row.original.status !== "Approved" ? (
            <button
              style={customButtonStyle}
              size="sm"
              onClick={() => approvePayment(row.original.id)}
            >
              Approve
            </button>
          ) : (
            "-"
          ),
        className: "wd-15p borderrigth",
      },
      {
        Header: "Allotment",
        accessor: "allotment",
        Cell: ({ row }) => (
          <button
            style={customButtonStyle}
            size="sm"
            onClick={() => handleView(row.original.mobile)}
          >
            View
          </button>
        ),
        className: "wd-15p borderrigth",
      },
    ],
    []
  );

  const customButtonStyle = {
    backgroundColor: "#082038",
    border: "1px solid #082038",
    color: "#fff",
    padding: "0.375rem 0.75rem",
    borderRadius: "0.25rem",
    cursor: "pointer",
  };

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
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/getAllPayments"
      );
      const result = await response.json();
      if (Array.isArray(result)) {
        setData(
          result.map((p, index) => ({
            serial: index + 1,
            id: p._id || index,
            mobile: p.mobile || "N/A",
            // others: p.others || "N/A",
            //  totalAmount: p.totalAmount || "N/A",
            //   totalGrams: p.totalGrams || "N/A",
            amount: p.amount || 0,
            name: p.name || "N/A",
            status: p.status || "Pending",
            timestamp: p.timestamp,
            gram: p.gram,
            amount_allocated: p.amount_allocated,
            gram_allocated: p.gram_allocated,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch payments.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const approvePayment = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Hope, You Verified the Payment.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Verified!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#007bff",
    });

    if (result.isConfirmed) {
      try {
        await fetch("http://13.204.96.244:3000/api/approve-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        setData((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: "Approved" } : p))
        );

        Swal.fire({
          title: "Success!",
          text: "Payment has been Approved successfully.",
          icon: "success",
          timer: 1500,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong while approving payment.",
          icon: "error",
        });
      }
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

  // ✅ Render Modal Content
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
                        key.toLowerCase().includes("date") ||
                        key.toLowerCase().includes("timestamp")
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
          <div className="mt-2">Loading payments...</div>
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
              Payments
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
            <table {...getTableProps()} className="table table-hover mb-0">
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        className={column.className}
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
                        <td className="borderrigth" {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

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

      {/* Modal for Viewing Allotment */}
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