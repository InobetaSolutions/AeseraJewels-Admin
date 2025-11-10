// import React, { Fragment, useEffect, useState } from "react";
// import { Button, Card, Spinner } from "react-bootstrap";
// import Swal from "sweetalert2";
// import {
//   useTable,
//   useSortBy,
//   useGlobalFilter,
//   usePagination,
// } from "react-table";

// export default function GetApprovedCatalogPayments() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const COLUMNS = React.useMemo(
//     () => [
//       {
//         Header: "S.No",
//         accessor: "serial",
//         Cell: ({ row }) => row.index + 1,
//         className: "wd-5p borderrigth",
//       },
//       {
//         Header: "Mobile",
//         accessor: "mobileNumber",
//         className: "wd-15p borderrigth",
//       },
//       {
//         Header: "Tag ID",
//         accessor: "tagid",
//         className: "wd-15p borderrigth",
//       },
//       {
//         Header: "Gold Type",
//         accessor: "goldType",
//         className: "wd-10p borderrigth",
//       },
//       {
//         Header: "Description",
//         accessor: "description",
//         className: "wd-20p borderrigth",
//       },
//       {
//         Header: "Amount",
//         accessor: "amount",
//         Cell: ({ value }) => `₹ ${value.toLocaleString()}`,
//         className: "wd-15p borderrigth",
//       },
//       {
//         Header: "Grams",
//         accessor: "grams",
//         className: "wd-10p borderrigth",
//       },
//       {
//         Header: "Paid Amount",
//         accessor: "Paidamount",
//         Cell: ({ value }) => `₹ ${value.toLocaleString()}`,
//         className: "wd-15p borderrigth",
//       },
//       {
//         Header: "InvestAmount",
//         accessor: "investAmount",
//         Cell: ({ value }) => `₹ ${value.toLocaleString()}`,
//         className: "wd-15p borderrigth",
//       },
//       {
//         Header: "Paid Grams",
//         accessor: "Paidgrams",
//         className: "wd-10p borderrigth",
//       },
//       {
//         Header: "Payment Status",
//         accessor: "paymentStatus",
//         Cell: ({ value }) => (
//           <span
//             className={
//               value?.toLowerCase().includes("approved")
//                 ? "text-success fw-bold"
//                 : "text-danger fw-bold"
//             }
//           >
//             {value}
//           </span>
//         ),
//         className: "wd-20p borderrigth",
//       },
//       // {
//       //   Header: "Allotment Status",
//       //   accessor: "allotmentStatus",
//       //   Cell: ({ value }) => (
//       //     <span
//       //       className={
//       //         value?.toLowerCase().includes("delivered")
//       //           ? "text-success fw-bold"
//       //           : "text-danger fw-bold"
//       //       }
//       //     >
//       //       {value}
//       //     </span>
//       //   ),
//       //   className: "wd-20p borderrigth",
//       // },
//       // {
//       //   Header: "Address",
//       //   accessor: "address",
//       //   className: "wd-20p borderrigth",
//       // },
//       // {
//       //   Header: "City",
//       //   accessor: "city",
//       //   className: "wd-15p borderrigth",
//       // },
//       // {
//       //   Header: "Post Code",
//       //   accessor: "postCode",
//       //   className: "wd-10p borderrigth",
//       // },
//       {
//         Header: "Timestamp",
//         accessor: "timestamp",
//         className: "wd-20p borderrigth",
//       },
//     ],
//     []
//   );

//   useEffect(() => {
//     fetchApprovedCatalogPayments();
//   }, []);

//   const fetchApprovedCatalogPayments = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getAllCatalogApprovePayments"
//       );
//       const result = await response.json();
//       console.log("Fetched approved catalog payments:", result);

//       if (result.status && Array.isArray(result.data)) {
//         setData(result.data);
//       } else {
//         Swal.fire({
//           title: "Error!",
//           text: "No approved catalog payments found.",
//           icon: "warning",
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching approved catalog payments:", error);
//       Swal.fire({
//         title: "Error!",
//         text: "Failed to fetch approved catalog payments.",
//         icon: "error",
//       });
//     } finally {
//       setLoading(false);
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

//   if (loading) {
//     return (
//       <Card>
//         <Card.Body className="text-center">
//           <Spinner animation="border" variant="primary" />
//           <div className="mt-2">Loading approved catalog payments...</div>
//         </Card.Body>
//       </Card>
//     );
//   }

//   return (
//     <Fragment>
//       <Card>
//         <Card.Body>
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <div
//               className="card-title main-content-label"
//               style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
//             >
//               Approved Catalog Payments
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




// import React, { Fragment, useEffect, useState } from "react";
// import { Button, Card, Spinner } from "react-bootstrap";
// import Swal from "sweetalert2";
// import {
//   useTable,
//   useSortBy,
//   useGlobalFilter,
//   usePagination,
// } from "react-table";

// export default function GetApprovedCoinPayments() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const COLUMNS = React.useMemo(
//     () => [
//       {
//         Header: "S.No",
//         accessor: "serial",
//         Cell: ({ row }) => row.index + 1,
//         className: "wd-5p borderrigth",
//       },
//       {
//         Header: "Mobile",
//         accessor: "mobileNumber",
//         className: "wd-10p borderrigth",
//       },
//       {
//         Header: "Total Amount",
//         accessor: "totalAmount",
//         Cell: ({ value }) => `₹ ${value?.toLocaleString() || 0}`,
//         className: "wd-15p borderrigth",
//       },
//       {
//         Header: "Tax Amount",
//         accessor: "taxAmount",
//         Cell: ({ value }) => `₹ ${value?.toLocaleString() || 0}`,
//         className: "wd-15p borderrigth",
//       },
//       {
//         Header: "Delivery Charge",
//         accessor: "deliveryCharge",
//         Cell: ({ value }) => `₹ ${value?.toLocaleString() || 0}`,
//         className: "wd-15p borderrigth",
//       },
//       {
//         Header: "Amount Payable",
//         accessor: "amountPayable",
//         Cell: ({ value }) => `₹ ${value?.toLocaleString() || 0}`,
//         className: "wd-15p borderrigth",
//       },
//       {
//         Header: "Invest Amount",
//         accessor: "investAmount",
//         Cell: ({ value }) => `₹ ${value?.toLocaleString() || 0}`,
//         className: "wd-15p borderrigth",
//       },
//       {
//         Header: "Status",
//         accessor: "status",
//         Cell: ({ value }) => (
//           <span className="text-success fw-bold">
//             {value || "Payment Confirmed"}
//           </span>
//         ),
//         className: "wd-15p borderrigth",
//       },
//       {
//         Header: "Address",
//         accessor: "address",
//         className: "wd-15p borderrigth",
//         Cell: ({ value }) => value || "—",
//       },
//       {
//         Header: "City",
//         accessor: "city",
//         className: "wd-10p borderrigth",
//         Cell: ({ value }) => value || "—",
//       },
//       {
//         Header: "Post Code",
//         accessor: "postCode",
//         className: "wd-10p borderrigth",
//         Cell: ({ value }) => value || "—",
//       },
//       {
//         Header: "Items Count",
//         accessor: "itemsCount",
//         Cell: ({ value }) => value || 0,
//         className: "wd-10p borderrigth",
//       },
//       {
//         Header: "Created Date",
//         accessor: "createdAt",
//         Cell: ({ value }) => 
//           value ? new Date(value).toLocaleString("en-IN") : "—",
//         className: "wd-15p borderrigth",
//       },
//       {
//         Header: "Approved Date",
//         accessor: "approvedAt",
//         Cell: ({ value }) => 
//           value ? new Date(value).toLocaleString("en-IN") : "—",
//         className: "wd-15p borderrigth",
//       },
//     ],
//     []
//   );

//   useEffect(() => {
//     fetchApprovedCoinPayments();
//   }, []);

//   const fetchApprovedCoinPayments = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getApprovedCoinPayments"
//       );
//       const result = await response.json();
//       console.log("Fetched approved coin payments:", result);

//       if (result.status && Array.isArray(result.data)) {
//         // Format the data for the table
//         const formattedData = result.data.map((item, index) => ({
//           ...item,
//           serial: index + 1,
//           itemsCount: item.items ? item.items.length : 0,
//           // Format dates if they exist
//           createdAt: item.createdAt || null,
//           approvedAt: item.approvedAt || null,
//         }));
//         setData(formattedData);
//       } else {
//         Swal.fire({
//           title: "Info!",
//           text: "No approved coin payments found.",
//           icon: "info",
//         });
//         setData([]);
//       }
//     } catch (error) {
//       console.error("Error fetching approved coin payments:", error);
//       Swal.fire({
//         title: "Error!",
//         text: "Failed to fetch approved coin payments.",
//         icon: "error",
//       });
//       setData([]);
//     } finally {
//       setLoading(false);
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

//   if (loading) {
//     return (
//       <Card>
//         <Card.Body className="text-center">
//           <Spinner animation="border" variant="primary" />
//           <div className="mt-2">Loading approved coin payments...</div>
//         </Card.Body>
//       </Card>
//     );
//   }

//   return (
//     <Fragment>
//       <Card>
//         <Card.Body>
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <div
//               className="card-title main-content-label"
//               style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
//             >
//               Approved Coin Payments
//             </div>
//             <Button
//               variant="primary"
//               onClick={fetchApprovedCoinPayments}
//               disabled={loading}
//             >
//               {loading ? "Refreshing..." : "Refresh"}
//             </Button>
//           </div>

//           {data.length === 0 ? (
//             <div className="text-center py-4">
//               <h5>No approved coin payments found</h5>
//               <p className="text-muted">There are no approved coin payments to display.</p>
//             </div>
//           ) : (
//             <>
//               <div className="d-flex">
//                 <select
//                   className="mb-4 selectpage border me-1"
//                   value={pageSize}
//                   onChange={(e) => setPageSize(Number(e.target.value))}
//                 >
//                   {[10, 25, 50].map((size) => (
//                     <option key={size} value={size}>
//                       Show {size}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="table-responsive">
//                 <table {...getTableProps()} className="table table-hover mb-0">
//                   <thead>
//                     {headerGroups.map((headerGroup) => (
//                       <tr {...headerGroup.getHeaderGroupProps()}>
//                         {headerGroup.headers.map((column) => (
//                           <th
//                             className={column.className}
//                             {...column.getHeaderProps(
//                               column.getSortByToggleProps()
//                             )}
//                           >
//                             {column.render("Header")}
//                           </th>
//                         ))}
//                       </tr>
//                     ))}
//                   </thead>
//                   <tbody {...getTableBodyProps()}>
//                     {page.map((row) => {
//                       prepareRow(row);
//                       return (
//                         <tr {...row.getRowProps()}>
//                           {row.cells.map((cell) => (
//                             <td className="borderrigth" {...cell.getCellProps()}>
//                               {cell.render("Cell")}
//                             </td>
//                           ))}
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>

//               <div className="d-block d-sm-flex mt-4 align-items-center">
//                 <span className="me-3">
//                   Page{" "}
//                   <strong>
//                     {pageIndex + 1} of {pageOptions.length}
//                   </strong>
//                 </span>
//                 <span className="ms-sm-auto">
//                   <Button
//                     variant=""
//                     className="btn-default tablebutton me-2 d-sm-inline d-block my-1"
//                     onClick={() => gotoPage(0)}
//                     disabled={!canPreviousPage}
//                   >
//                     {" First "}
//                   </Button>
//                   <Button
//                     variant=""
//                     className="btn-default tablebutton me-2 my-1"
//                     onClick={() => previousPage()}
//                     disabled={!canPreviousPage}
//                   >
//                     {" Previous "}
//                   </Button>
//                   <Button
//                     variant=""
//                     className="btn-default tablebutton me-2 my-1"
//                     onClick={() => nextPage()}
//                     disabled={!canNextPage}
//                   >
//                     {" Next "}
//                   </Button>
//                   <Button
//                     variant=""
//                     className="btn-default tablebutton me-2 d-sm-inline d-block my-1"
//                     onClick={() => gotoPage(pageCount - 1)}
//                     disabled={!canNextPage}
//                   >
//                     {" Last "}
//                   </Button>
//                 </span>
//               </div>
//             </>
//           )}
//         </Card.Body>
//       </Card>
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

export default function GetApprovedCoinPayments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const COLUMNS = React.useMemo(
    () => [
      {
        Header: "S.No",
        accessor: "serial",
        Cell: ({ row }) => row.index + 1,
        className: "wd-5p borderrigth",
      },
      {
        Header: "Mobile",
        accessor: "mobileNumber",
        className: "wd-10p borderrigth",
      },
      {
        Header: "Total Amount",
        accessor: "totalAmount",
        Cell: ({ value }) => `₹ ${value?.toLocaleString() || 0}`,
        className: "wd-15p borderrigth",
      },
      {
        Header: "Amount Payable",
        accessor: "amountPayable",
        Cell: ({ value }) => `₹ ${value?.toLocaleString() || 0}`,
        className: "wd-15p borderrigth",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span className="badge bg-success">
            {value || "Payment Confirmed"}
          </span>
        ),
        className: "wd-15p borderrigth",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleView(row.original)}
            style={{
              backgroundColor: "#082038",
              border: "1px solid #082038",
            }}
          >
            View Details
          </Button>
        ),
        className: "wd-15p borderrigth",
      },
    ],
    []
  );

  useEffect(() => {
    fetchApprovedCoinPayments();
  }, []);

  const fetchApprovedCoinPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/getApprovedCoinPayments"
      );
      const result = await response.json();
      console.log("Fetched approved coin payments:", result);

      if (result.status && Array.isArray(result.data)) {
        const formattedData = result.data.map((item, index) => ({
          ...item,
          serial: index + 1,
          itemsCount: item.items ? item.items.length : 0,
        }));
        setData(formattedData);
      } else {
        Swal.fire({
          title: "Info!",
          text: "No approved coin payments found.",
          icon: "info",
        });
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching approved coin payments:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch approved coin payments.",
        icon: "error",
      });
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPayment(null);
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
          <div className="mt-2">Loading approved coin payments...</div>
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
              Approved Coin Payments
            </div>
            <Button
              variant="primary"
              onClick={fetchApprovedCoinPayments}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          {data.length === 0 ? (
            <div className="text-center py-4">
              <h5>No approved coin payments found</h5>
              <p className="text-muted">There are no approved coin payments to display.</p>
            </div>
          ) : (
            <>
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

              <div className="d-block d-sm-flex mt-4 align-items-center">
                <span className="me-3">
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
                    {" First "}
                  </Button>
                  <Button
                    variant=""
                    className="btn-default tablebutton me-2 my-1"
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                  >
                    {" Previous "}
                  </Button>
                  <Button
                    variant=""
                    className="btn-default tablebutton me-2 my-1"
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                  >
                    {" Next "}
                  </Button>
                  <Button
                    variant=""
                    className="btn-default tablebutton me-2 d-sm-inline d-block my-1"
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                  >
                    {" Last "}
                  </Button>
                </span>
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      {/* View Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Payment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPayment && (
            <div className="row">
              <div className="col-md-6">
                <p><strong>Mobile Number:</strong> {selectedPayment.mobileNumber || "—"}</p>
                <p><strong>Total Amount:</strong> ₹{selectedPayment.totalAmount?.toLocaleString() || 0}</p>
                <p><strong>Tax Amount:</strong> ₹{selectedPayment.taxAmount?.toLocaleString() || 0}</p>
                <p><strong>Delivery Charge:</strong> ₹{selectedPayment.deliveryCharge?.toLocaleString() || 0}</p>
                <p><strong>Amount Payable:</strong> ₹{selectedPayment.amountPayable?.toLocaleString() || 0}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Invest Amount:</strong> ₹{selectedPayment.investAmount?.toLocaleString() || 0}</p>
                <p><strong>Status:</strong> <span className="badge bg-success">{selectedPayment.status || "—"}</span></p>
                <p><strong>Address:</strong> {selectedPayment.address || "—"}</p>
                <p><strong>City:</strong> {selectedPayment.city || "—"}</p>
                <p><strong>Post Code:</strong> {selectedPayment.postCode || "—"}</p>
              </div>
              
              {/* Items Details */}
              {selectedPayment.items && selectedPayment.items.length > 0 && (
                <div className="col-12 mt-3">
                  <h6>Items ({selectedPayment.items.length}):</h6>
                  <div className="table-responsive">
                    <table className="table table-sm table-bordered">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Coin Grams</th>
                          <th>Quantity</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPayment.items.map((item, index) => (
                          <tr key={index}>
                            <td>#{index + 1}</td>
                            <td>{item.coinGrams}g</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.amount?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="col-12 mt-3">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Created Date:</strong> {selectedPayment.createdAt ? new Date(selectedPayment.createdAt).toLocaleString("en-IN") : "—"}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Approved Date:</strong> {selectedPayment.approvedAt ? new Date(selectedPayment.approvedAt).toLocaleString("en-IN") : "—"}</p>
                  </div>
                </div>
              </div>
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