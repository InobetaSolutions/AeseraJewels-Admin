// import React, { Fragment, useEffect, useState } from "react";
// import { Button, Card, Spinner } from "react-bootstrap";
// import Swal from "sweetalert2";
// import {
//   useTable,
//   useSortBy,
//   useGlobalFilter,
//   usePagination,
// } from "react-table";

// export default function GetCancelledPayments() {
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
//         accessor: "mobile",
//         className: "wd-15p borderrigth",
//       },
//       {
//         Header: "Amount",
//         accessor: "amount",
//         Cell: ({ value }) => `₹ ${value.toLocaleString()}`,
//         className: "wd-15p borderrigth",
//       },
//       {
//         Header: "Gram",
//         accessor: "gram",
//         className: "wd-10p borderrigth",
//       },
//       // {
//       //   Header: "Amount Allocated",
//       //   accessor: "amount_allocated",
//       //   Cell: ({ value }) => `₹ ${value.toLocaleString()}`,
//       //   className: "wd-15p borderrigth",
//       // },
//       {
//         Header: "Gram Allocated",
//         accessor: "gram_allocated",
//         className: "wd-15p borderrigth",
//       },
//       {
//         Header: "Status",
//         accessor: "status",
//         Cell: ({ value }) => (
//           <span
//             className={
//               value === "Payment Cancelled"
//                 ? "text-danger fw-bold"
//                 : "text-success fw-bold"
//             }
//           >
//             {value}
//           </span>
//         ),
//         className: "wd-15p borderrigth",
//       },
//        {
//         Header: "Re Approve",
//         accessor: "Re Approve",
//         className: "wd-15p borderrigth",
//       },
//       {
//         Header: "Timestamp",
//         accessor: "timestamp",
//         Cell: ({ value }) => formatToIST(value),
//         className: "wd-20p borderrigth",
//       },
//     ],
//     []
//   );

//   // ✅ Utility: Format timestamps into IST (handle both Date + string)
//   const formatToIST = (timestamp) => {
//     if (!timestamp) return "N/A";
//     try {
//       // if already formatted string like "17/9/2025, 12:39:50 pm", just return
//       if (typeof timestamp === "string" && timestamp.includes("/")) {
//         return timestamp;
//       }
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
//     fetchCancelledPayments();
//   }, []);

//   const fetchCancelledPayments = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getAllCancelledPayments"
//       );
//       const result = await response.json();
//       console.log("Fetched cancelled payments:", result);

//       if (result.success && Array.isArray(result.data)) {
//         setData(
//           result.data.map((p, index) => ({
//             serial: index + 1,
//             id: p._id || index,
//             mobile: p.mobile || "N/A",
//             amount: p.amount || 0,
//             gram: p.gram || 0,
//             status: p.status || "N/A",
//             timestamp: p.timestamp,
//             amount_allocated: p.amount_allocated || 0,
//             gram_allocated: p.gram_allocated || 0,
//           }))
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching cancelled payments:", error);
//       Swal.fire({
//         title: "Error!",
//         text: "Failed to fetch cancelled payments.",
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
//           <div className="mt-2">Loading cancelled payments...</div>
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
//               Cancelled Payments
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
import { Button, Card, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { useNavigate } from "react-router-dom";

export default function GetCancelledPayments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Utility: Format timestamps into IST (handle both Date + string)
  const formatToIST = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      if (typeof timestamp === "string" && timestamp.includes("/")) {
        return timestamp;
      }
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

  // ✅ Handle Re-Approve API call with confirmation
  const handleReApprove = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to Re-Approve this payment",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve it!",
      cancelButtonText: "Back",
      // reverseButtons: true,
    });

    if (confirm.isConfirmed) {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({ id });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        const response = await fetch(
          "http://13.204.96.244:3000/api/approve-payment",
          requestOptions
        );

        const result = await response.json();

        if (result.message === "Payment Approved") {
          Swal.fire("Success!", "Payment has been Re-Approved.", "success").then(
            () => {
              navigate("/app/Approved"); // ✅ redirect after success
            }
          );
        } else {
          Swal.fire("Error!", result.message || "Failed to approve.", "error");
        }
      } catch (error) {
        console.error("Re-Approve error:", error);
        Swal.fire("Error!", "Something went wrong while approving.", "error");
      }
    }
  };

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
        accessor: "mobile",
        className: "wd-15p borderrigth",
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: ({ value }) => `₹ ${value.toLocaleString()}`,
        className: "wd-15p borderrigth",
      },
      {
        Header: "Gram",
        accessor: "gram",
        className: "wd-10p borderrigth",
      },
      {
        Header: "Gram Allocated",
        accessor: "gram_allocated",
        className: "wd-15p borderrigth",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={
              value === "Payment Cancelled"
                ? "text-danger fw-bold"
                : "text-success fw-bold"
            }
          >
            {value}
          </span>
        ),
        className: "wd-15p borderrigth",
      },
      {
        Header: "Re Approve",
        accessor: "reapprove",
        Cell: ({ row }) => (
          <Button
            variant="success"
            size="sm"
            onClick={() => handleReApprove(row.original.id)}
          >
            Re-Approve
          </Button>
        ),
        className: "wd-15p borderrigth",
      },
      {
        Header: "Timestamp",
        accessor: "timestamp",
        Cell: ({ value }) => formatToIST(value),
        className: "wd-20p borderrigth",
      },
    ],
    []
  );

  useEffect(() => {
    fetchCancelledPayments();
  }, []);

  const fetchCancelledPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/getAllCancelledPayments"
      );
      const result = await response.json();
      console.log("Fetched cancelled payments:", result);

      if (result.success && Array.isArray(result.data)) {
        setData(
          result.data.map((p, index) => ({
            serial: index + 1,
            id: p._id || index,
            mobile: p.mobile || "N/A",
            amount: p.amount || 0,
            gram: p.gram || 0,
            status: p.status || "N/A",
            timestamp: p.timestamp,
            amount_allocated: p.amount_allocated || 0,
            gram_allocated: p.gram_allocated || 0,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching cancelled payments:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch cancelled payments.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
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
          <div className="mt-2">Loading cancelled payments...</div>
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
              Cancelled Payments
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
    </Fragment>
  );
}
