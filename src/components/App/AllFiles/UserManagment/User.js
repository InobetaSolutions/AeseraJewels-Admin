import React, { Fragment, useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";

export default function GetUsers() {
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
        className: "wd-25p borderrigth",
      },
      // {
      //   Header: "Actions",
      //   accessor: "actions",
      //   Cell: ({ row }) => (
      //     <Button
      //       variant={row.original.blocked ? "success" : "danger"}
      //       onClick={() => handleBlockUnblock(row.original.id, row.original.blocked)}
      //     >
      //       {row.original.blocked ? "Unblock" : "Block"}
      //     </Button>
      //   ),
      //   className: "wd-20p borderrigth",
      // },
    ],
    []
  );

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://13.204.96.244:3000/api/get-users");
      const text = await response.text();
      try {
        const result = JSON.parse(text);
        if (Array.isArray(result)) {
          setData(
            result.map((user, index) => ({
              serial: index + 1,
              id: user._id || index,
              name: user.name || "N/A",
              mobile: user.mobile || "N/A",
              // blocked: Boolean(user.blocked), // assuming API has `blocked`
            }))
          );
        }
      } catch (err) {
        console.error("JSON parse error:", err);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleBlockUnblock = async (userId, currentStatus) => {
    const action = currentStatus ? "unblock" : "block";
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `You are about to ${action} this user.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} it!`,
      cancelButtonText: "Cancel",
      confirmButtonColor: currentStatus ? "#28a745" : "#dc3545",
    });

    if (result.isConfirmed) {
      try {
        // Replace with your real API call
        // await Api_Service.authpost("blockUnblockUser", { _id: userId, blockStatus: !currentStatus });

        setData((prevData) =>
          prevData.map((user) =>
            user.id === userId ? { ...user, blocked: !currentStatus } : user
          )
        );

        Swal.fire({
          title: "Success!",
          text: `User has been ${action}ed successfully.`,
          icon: "success",
          timer: 1500,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong while updating user.",
          icon: "error",
        });
      }
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

  return (
    <Fragment>
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div
              className="card-title main-content-label text-primary"
              style={{ fontSize: "1.25rem", paddingLeft: 10 }}
            >
              User List
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
                        {...column.getHeaderProps(column.getSortByToggleProps())}
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
