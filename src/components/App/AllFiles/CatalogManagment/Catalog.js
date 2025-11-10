// import React, { Fragment, useEffect, useState } from "react";
// import { Card, OverlayTrigger, Popover, Spinner, Alert } from "react-bootstrap";
// import {
//   useTable,
//   useSortBy,
//   useGlobalFilter,
//   usePagination,
// } from "react-table";
// import { useNavigate } from "react-router-dom";
// import "./Catalog.css";

// export default function Catalog() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/get-products",
//         {
//           method: "GET",
//         }
//       );

//       const text = await response.text();
//       console.log("Raw API Response:", text);

//       try {
//         const result = JSON.parse(text);
//         const products = Array.isArray(result) ? result : [result];

//         setData(
//           products.map((product, index) => {
//             // keep backend-only fields hidden from UI
//             const { _id, __v, createdAt, updatedAt, ...rest } = product;
//             return {
//               _id, // ✅ keep id internally (needed for actions)
//               serial: index + 1,
//               ...rest,
//               ...(createdAt
//                 ? { IstDate: new Date(createdAt).toLocaleString("en-IN") }
//                 : {}),
//             };
//           })
//         );
//       } catch (err) {
//         console.error("JSON parse error:", err);
//         setError("Invalid response format");
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       setError("Failed to fetch products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Navigate to Add Product page
//   const handleAddProduct = () => {
//     navigate(`${process.env.PUBLIC_URL}/app/CatalogManagment/Addamc`);
//   };

//   // Navigate to View/Edit Product page
//   const handleView = (product) => {
//     let path = `${process.env.PUBLIC_URL}/app/ViewCatolog`;
//     navigate(path, { state: { productdata: product } });
//   };

//   // Dynamic Columns
//   const COLUMNS = React.useMemo(() => {
//     if (data.length === 0) return [];

//     const cols = Object.keys(data[0])
//       .filter(
//         (key) =>
//           key !== "_id" &&
//           key !== "__v" &&
//           key !== "createdAt" &&
//           key !== "updatedAt"
//       )
//       .map((key) => {
//         if (key === "image") {
//           return {
//             Header: "Image",
//             accessor: key,
//             className: "wd-15p borderrigth",
//             Cell: ({ value }) =>
//               value ? (
//                 <OverlayTrigger
//                   placement="right"
//                   delay={{ show: 200, hide: 100 }}
//                   overlay={
//                     <Popover>
//                       <Popover.Body className="p-1">
//                         <img
//                           src={`http://13.204.96.244:3000/api/uploads/${value}`}
//                           alt="product-large"
//                           style={{
//                             width: "200px",
//                             height: "auto",
//                             objectFit: "contain",
//                             borderRadius: "6px",
//                           }}
//                         />
//                       </Popover.Body>
//                     </Popover>
//                   }
//                 >
//                   <img
//                     src={`http://13.204.96.244:3000/api/uploads/${value}`}
//                     alt="product"
//                     className="product-img-hover"
//                     style={{
//                       width: "80px",
//                       height: "50px",
//                       objectFit: "cover",
//                       cursor: "pointer",
//                       borderRadius: "4px",
//                     }}
//                   />
//                 </OverlayTrigger>
//               ) : (
//                 "—"
//               ),
//           };
//         }
//         return {
//           Header:
//             key === "serial"
//               ? "S.No"
//               : key.charAt(0).toUpperCase() + key.slice(1),
//           accessor: key,
//           className: "wd-20p borderrigth",
//           Cell: ({ value }) =>
//             value !== null && value !== undefined ? value.toString() : "—",
//         };
//       });

//     // ✅ Add Actions column
//     cols.push({
//       Header: "Actions",
//       accessor: "actions",
//       className: "wd-10p borderrigth",
//       Cell: ({ row }) => (
//         <div className="d-flex">
//           <button
//             onClick={() => handleView(row.original)}
//             className="me-2"
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
//         </div>
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
//     state,
//     page,
//     nextPage,
//     previousPage,
//     canNextPage,
//     canPreviousPage,
//     pageOptions,
//     gotoPage,
//     pageCount,
//     setPageSize,
//     setGlobalFilter,
//   } = tableInstance;

//   const { globalFilter, pageIndex, pageSize } = state;

//   if (loading) return <Spinner animation="border" className="m-4" />;
//   if (error) return <Alert variant="danger">{error}</Alert>;

//   return (
//     <Fragment>
//       <Card>
//         <Card.Body>
//           {/* Title + Add Product */}
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <div
//               className="card-title main-content-label"
//               style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
//             >
//               Catalog Management
//             </div>
//             <button
//               onClick={handleAddProduct}
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
//               Add Product
//             </button>
//           </div>

//           {/* Filters */}
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
//             <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
//           </div>

//           {/* Table */}
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

//           {/* Pagination */}
//           <div className="d-block d-sm-flex mt-4">
//             <span>
//               Page{" "}
//               <strong>
//                 {pageIndex + 1} of {pageOptions.length}
//               </strong>
//             </span>
//             <span className="ms-sm-auto">
//               <button
//                 className="btn-default tablebutton me-2 d-sm-inline d-block my-1"
//                 onClick={() => gotoPage(0)}
//                 disabled={!canPreviousPage}
//               >
//                 {" Previous "}
//               </button>
//               <button
//                 className="btn-default tablebutton me-2 my-1"
//                 onClick={() => previousPage()}
//                 disabled={!canPreviousPage}
//               >
//                 {" << "}
//               </button>
//               <button
//                 className="btn-default tablebutton me-2 my-1"
//                 onClick={() => nextPage()}
//                 disabled={!canNextPage}
//               >
//                 {" >> "}
//               </button>
//               <button
//                 className="btn-default tablebutton me-2 d-sm-inline d-block my-1"
//                 onClick={() => gotoPage(pageCount - 1)}
//                 disabled={!canNextPage}
//               >
//                 {" Next "}
//               </button>
//             </span>
//           </div>
//         </Card.Body>
//       </Card>
//     </Fragment>
//   );
// }

// // ✅ Search Component
// const GlobalFilter = ({ filter, setFilter }) => {
//   return (
//     <span className="d-flex ms-auto">
//       <input
//         value={filter || ""}
//         onChange={(e) => setFilter(e.target.value)}
//         className="form-control mb-4"
//         placeholder="Search..."
//       />
//     </span>
//   );
// };



// import React, { Fragment, useEffect, useState } from "react";
// import { Card, OverlayTrigger, Popover, Spinner, Alert } from "react-bootstrap";
// import {
//   useTable,
//   useSortBy,
//   useGlobalFilter,
//   usePagination,
// } from "react-table";
// import { useNavigate } from "react-router-dom";
// import "./Catalog.css";

// export default function Catalog() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/get-products",
//         requestOptions
//       );

//       const text = await response.text();
//       console.log("Raw API Response:", text);

//       try {
//         const result = JSON.parse(text);
//         const products = Array.isArray(result) ? result : [result];

//         setData(
//           products.map((product, index) => {
//             // keep backend-only fields hidden from UI
//             const { _id, __v, createdAt, updatedAt, ...rest } = product;
//             return {
//               _id, // ✅ keep id internally (needed for actions)
//               serial: index + 1,
//               ...rest,
//               ...(createdAt
//                 ? { IstDate: new Date(createdAt).toLocaleString("en-IN") }
//                 : {}),
//             };
//           })
//         );
//       } catch (err) {
//         console.error("JSON parse error:", err);
//         setError("Invalid response format");
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       setError("Failed to fetch products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Navigate to Add Product page
//   const handleAddProduct = () => {
//     navigate(`${process.env.PUBLIC_URL}/app/CatalogManagment/Addamc`);
//   };

//   // Navigate to View/Edit Product page
//   const handleView = (product) => {
//     let path = `${process.env.PUBLIC_URL}/app/ViewCatolog`;
//     navigate(path, { state: { productdata: product } });
//   };

//   // Dynamic Columns
//   const COLUMNS = React.useMemo(() => {
//     if (data.length === 0) return [];

//     const cols = Object.keys(data[0])
//       .filter(
//         (key) =>
//           key !== "_id" &&
//           key !== "__v" &&
//           key !== "createdAt" &&
//           key !== "updatedAt"
//       )
//       .map((key) => {
//         if (key === "image") {
//           return {
//             Header: "Image",
//             accessor: key,
//             className: "wd-15p borderrigth",
//             Cell: ({ value }) =>
//               value ? (
//                 <OverlayTrigger
//                   placement="right"
//                   delay={{ show: 200, hide: 100 }}
//                   overlay={
//                     <Popover>
//                       <Popover.Body className="p-1">
//                         <img
//                           src={`http://13.204.96.244:3000/api/uploads/${value}`}
//                           alt="product-large"
//                           style={{
//                             width: "200px",
//                             height: "auto",
//                             objectFit: "contain",
//                             borderRadius: "6px",
//                           }}
//                         />
//                       </Popover.Body>
//                     </Popover>
//                   }
//                 >
//                   <img
//                     src={`http://13.204.96.244:3000/api/uploads/${value}`}
//                     alt="product"
//                     className="product-img-hover"
//                     style={{
//                       width: "80px",
//                       height: "50px",
//                       objectFit: "cover",
//                       cursor: "pointer",
//                       borderRadius: "4px",
//                     }}
//                   />
//                 </OverlayTrigger>
//               ) : (
//                 "—"
//               ),
//           };
//         }
//         return {
//           Header:
//             key === "serial"
//               ? "S.No"
//               : key.charAt(0).toUpperCase() + key.slice(1),
//           accessor: key,
//           className: "wd-20p borderrigth",
//           Cell: ({ value }) =>
//             value !== null && value !== undefined ? value.toString() : "—",
//         };
//       });

//     // ✅ Add Actions column
//     cols.push({
//       Header: "Actions",
//       accessor: "actions",
//       className: "wd-10p borderrigth",
//       Cell: ({ row }) => (
//         <div className="d-flex">
//           <button
//             onClick={() => handleView(row.original)}
//             className="me-2"
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
//         </div>
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
//     state,
//     page,
//     nextPage,
//     previousPage,
//     canNextPage,
//     canPreviousPage,
//     pageOptions,
//     gotoPage,
//     pageCount,
//     setPageSize,
//     setGlobalFilter,
//   } = tableInstance;

//   const { globalFilter, pageIndex, pageSize } = state;

//   if (loading) return <Spinner animation="border" className="m-4" />;
//   if (error) return <Alert variant="danger">{error}</Alert>;

//   return (
//     <Fragment>
//       <Card>
//         <Card.Body>
//           {/* Title + Add Product */}
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <div
//               className="card-title main-content-label"
//               style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
//             >
//               Catalog Management
//             </div>
//             <button
//               onClick={handleAddProduct}
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
//               Add Product
//             </button>
//           </div>

//           {/* Filters */}
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
//             <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
//           </div>

//           {/* Table */}
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

//           {/* Pagination */}
//           <div className="d-block d-sm-flex mt-4">
//             <span>
//               Page{" "}
//               <strong>
//                 {pageIndex + 1} of {pageOptions.length}
//               </strong>
//             </span>
//             <span className="ms-sm-auto">
//               <button
//                 className="btn-default tablebutton me-2 d-sm-inline d-block my-1"
//                 onClick={() => gotoPage(0)}
//                 disabled={!canPreviousPage}
//               >
//                 {" Previous "}
//               </button>
//               <button
//                 className="btn-default tablebutton me-2 my-1"
//                 onClick={() => previousPage()}
//                 disabled={!canPreviousPage}
//               >
//                 {" << "}
//               </button>
//               <button
//                 className="btn-default tablebutton me-2 my-1"
//                 onClick={() => nextPage()}
//                 disabled={!canNextPage}
//               >
//                 {" >> "}
//               </button>
//               <button
//                 className="btn-default tablebutton me-2 d-sm-inline d-block my-1"
//                 onClick={() => gotoPage(pageCount - 1)}
//                 disabled={!canNextPage}
//               >
//                 {" Next "}
//               </button>
//             </span>
//           </div>
//         </Card.Body>
//       </Card>
//     </Fragment>
//   );
// }

// // ✅ Search Component
// const GlobalFilter = ({ filter, setFilter }) => {
//   return (
//     <span className="d-flex ms-auto">
//       <input
//         value={filter || ""}
//         onChange={(e) => setFilter(e.target.value)}
//         className="form-control mb-4"
//         placeholder="Search..."
//       />
//     </span>
//   );
// };


// import React, { Fragment, useEffect, useState } from "react";
// import { Card, Spinner, Alert } from "react-bootstrap";
// import {
//   useTable,
//   useSortBy,
//   useGlobalFilter,
//   usePagination,
// } from "react-table";
// import { useNavigate } from "react-router-dom";
// import "./Catalog.css";

// export default function Catalog() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCoinPayments();
//   }, []);

//   const fetchCoinPayments = async () => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     try {
//       const response = await fetch(
//         "http://13.204.96.244:3000/api/getAllCoinPayment",
//         requestOptions
//       );
//       const text = await response.text();
//       console.log("Raw API Response:", text);

//       const result = JSON.parse(text);
//       if (result.status && Array.isArray(result.data)) {
//         const formatted = result.data.map((item, index) => {
//           const { _id, __v, createdAt, updatedAt, items, ...rest } = item;

//           // Flatten items array for display
//           const itemSummary = items
//             .map(
//               (it, idx) =>
//                 `#${idx + 1}: ${it.coinGrams}g × ${it.quantity} = ₹${it.amount}`
//             )
//             .join(" | ");

//           return {
//             _id,
//             serial: index + 1,
//             mobileNumber: item.mobileNumber || "—",
//             // items: itemSummary || "—",
//             totalAmount: item.totalAmount || 0,
//             taxAmount: item.taxAmount || 0,
//             deliveryCharge: item.deliveryCharge || 0,
//             amountPayable: item.amountPayable || 0,
//             investAmount: item.investAmount || 0,
//             // address: item.address || "—",
//             // city: item.city || "—",
//             // postCode: item.postCode || "—",
//             status: item.status || "—",
//             // createdAt: createdAt
//             //   ? new Date(createdAt).toLocaleString("en-IN")
//             //   : "—",
//           };
//         });
//         setData(formatted);
//       } else {
//         setError("Unexpected response format");
//       }
//     } catch (error) {
//       console.error("Error fetching payments:", error);
//       setError("Failed to fetch coin payments");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Navigate to View Page (optional, can be used later)
//   const handleView = (row) => {
//     let path = `${process.env.PUBLIC_URL}/app/ViewCatolog`;
//     navigate(path, { state: { paymentData: row } });
//   };

//   // Define Table Columns
//   const COLUMNS = React.useMemo(() => {
//     if (data.length === 0) return [];

//     const cols = Object.keys(data[0])
//       .filter((key) => key !== "_id")
//       .map((key) => ({
//         Header:
//           key === "serial"
//             ? "S.No"
//             : key === "mobileNumber"
//             ? "Mobile Number"
//             : key === "createdAt"
//             ? "Created Date"
//             : key.charAt(0).toUpperCase() + key.slice(1),
//         accessor: key,
//         className: "wd-20p borderrigth",
//         Cell: ({ value }) =>
//           value !== null && value !== undefined ? value.toString() : "—",
//       }));

//     cols.push({
//       Header: "Actions",
//       accessor: "actions",
//       className: "wd-10p borderrigth",
//       Cell: ({ row }) => (
//         <div className="d-flex">
//           <button
//             onClick={() => handleView(row.original)}
//             className="me-2"
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
//         </div>
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
//     state,
//     page,
//     nextPage,
//     previousPage,
//     canNextPage,
//     canPreviousPage,
//     pageOptions,
//     gotoPage,
//     pageCount,
//     setPageSize,
//     setGlobalFilter,
//   } = tableInstance;

//   const { globalFilter, pageIndex, pageSize } = state;

//   if (loading) return <Spinner animation="border" className="m-4" />;
//   if (error) return <Alert variant="danger">{error}</Alert>;

//   return (
//     <Fragment>
//       <Card>
//         <Card.Body>
//           {/* Title */}
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <div
//               className="card-title main-content-label"
//               style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
//             >
//               Coin Payment Management
//             </div>
//           </div>

//           {/* Filters */}
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
//             <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
//           </div>

//           {/* Table */}
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

//           {/* Pagination */}
//           <div className="d-block d-sm-flex mt-4">
//             <span>
//               Page{" "}
//               <strong>
//                 {pageIndex + 1} of {pageOptions.length}
//               </strong>
//             </span>
//             <span className="ms-sm-auto">
//               <button
//                 className="btn-default tablebutton me-2 d-sm-inline d-block my-1"
//                 onClick={() => gotoPage(0)}
//                 disabled={!canPreviousPage}
//               >
//                 {" Previous "}
//               </button>
//               <button
//                 className="btn-default tablebutton me-2 my-1"
//                 onClick={() => previousPage()}
//                 disabled={!canPreviousPage}
//               >
//                 {" << "}
//               </button>
//               <button
//                 className="btn-default tablebutton me-2 my-1"
//                 onClick={() => nextPage()}
//                 disabled={!canNextPage}
//               >
//                 {" >> "}
//               </button>
//               <button
//                 className="btn-default tablebutton me-2 d-sm-inline d-block my-1"
//                 onClick={() => gotoPage(pageCount - 1)}
//                 disabled={!canNextPage}
//               >
//                 {" Next "}
//               </button>
//             </span>
//           </div>
//         </Card.Body>
//       </Card>
//     </Fragment>
//   );
// }

// // ✅ Search Component
// const GlobalFilter = ({ filter, setFilter }) => {
//   return (
//     <span className="d-flex ms-auto">
//       <input
//         value={filter || ""}
//         onChange={(e) => setFilter(e.target.value)}
//         className="form-control mb-4"
//         placeholder="Search..."
//       />
//     </span>
//   );
// };



import React, { Fragment, useEffect, useState } from "react";
import { Card, Spinner, Alert, Modal, Button } from "react-bootstrap";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { useNavigate } from "react-router-dom";
import "./Catalog.css";

export default function Catalog() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [detailedData, setDetailedData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCoinPayments();
  }, []);

  const fetchCoinPayments = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/getAllCoinPayment",
        requestOptions
      );
      const text = await response.text();
      console.log("Raw API Response:", text);

      const result = JSON.parse(text);
      if (result.status && Array.isArray(result.data)) {
        const formatted = result.data.map((item, index) => {
          const { _id, __v, createdAt, updatedAt, items, ...rest } = item;

          // Flatten items array for display
          const itemSummary = items
            .map(
              (it, idx) =>
                `#${idx + 1}: ${it.coinGrams}g × ${it.quantity} = ₹${it.amount}`
            )
            .join(" | ");

          return {
            _id,
            serial: index + 1,
            mobileNumber: item.mobileNumber || "—",
            // items: itemSummary || "—",
            totalAmount: item.totalAmount || 0,
            taxAmount: item.taxAmount || 0,
            deliveryCharge: item.deliveryCharge || 0,
            amountPayable: item.amountPayable || 0,
            investAmount: item.investAmount || 0,
            // address: item.address || "—",
            // city: item.city || "—",
            // postCode: item.postCode || "—",
            status: item.status || "—",
            // createdAt: createdAt
            //   ? new Date(createdAt).toLocaleString("en-IN")
            //   : "—",
          };
        });
        setData(formatted);
      } else {
        setError("Unexpected response format");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError("Failed to fetch coin payments");
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed data for modal
  const fetchDetailedData = async (paymentId) => {
    setModalLoading(true);
    setModalError("");
    setDetailedData(null);

    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/getAllCoinPayment",
        requestOptions
      );
      const text = await response.text();
      console.log("Detailed API Response:", text);

      const result = JSON.parse(text);
      if (result.status && Array.isArray(result.data)) {
        // Find the specific payment by ID
        const detailedPayment = result.data.find(item => item._id === paymentId);
        if (detailedPayment) {
          setDetailedData(detailedPayment);
        } else {
          setModalError("Payment details not found");
        }
      } else {
        setModalError("Unexpected response format");
      }
    } catch (error) {
      console.error("Error fetching detailed payment:", error);
      setModalError("Failed to fetch payment details");
    } finally {
      setModalLoading(false);
    }
  };

  // Open modal and fetch detailed data
  const handleView = (row) => {
    setSelectedPayment(row);
    setShowModal(true);
    fetchDetailedData(row._id);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPayment(null);
    setDetailedData(null);
    setModalError("");
  };

  // Define Table Columns
  const COLUMNS = React.useMemo(() => {
    if (data.length === 0) return [];

    const cols = Object.keys(data[0])
      .filter((key) => key !== "_id")
      .map((key) => ({
        Header:
          key === "serial"
            ? "S.No"
            : key === "mobileNumber"
            ? "Mobile Number"
            : key === "createdAt"
            ? "Created Date"
            : key.charAt(0).toUpperCase() + key.slice(1),
        accessor: key,
        className: "wd-20p borderrigth",
        Cell: ({ value }) =>
          value !== null && value !== undefined ? value.toString() : "—",
      }));

    cols.push({
      Header: "Actions",
      accessor: "actions",
      className: "wd-10p borderrigth",
      Cell: ({ row }) => (
        <div className="d-flex">
          <button
            onClick={() => handleView(row.original)}
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
            View
          </button>
        </div>
      ),
    });

    return cols;
  }, [data]);

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
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  if (loading) return <Spinner animation="border" className="m-4" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Fragment>
      <Card>
        <Card.Body>
          {/* Title */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div
              className="card-title main-content-label"
              style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
            >
              Coin Payment Management
            </div>
          </div>

          {/* Filters */}
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
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </div>

          {/* Table */}
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

          {/* Pagination */}
          <div className="d-block d-sm-flex mt-4">
            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
            </span>
            <span className="ms-sm-auto">
              <button
                className="btn-default tablebutton me-2 d-sm-inline d-block my-1"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                {" Previous "}
              </button>
              <button
                className="btn-default tablebutton me-2 my-1"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                {" << "}
              </button>
              <button
                className="btn-default tablebutton me-2 my-1"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                {" >> "}
              </button>
              <button
                className="btn-default tablebutton me-2 d-sm-inline d-block my-1"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                {" Next "}
              </button>
            </span>
          </div>
        </Card.Body>
      </Card>

      {/* View Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Payment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalLoading && <Spinner animation="border" className="m-4" />}
          {modalError && <Alert variant="danger">{modalError}</Alert>}
          
          {detailedData && !modalLoading && (
            <div className="row">
              <div className="col-md-6">
                <p><strong>Mobile Number:</strong> {detailedData.mobileNumber || "—"}</p>
                <p><strong>Total Amount:</strong> ₹{detailedData.totalAmount || 0}</p>
                <p><strong>Tax Amount:</strong> ₹{detailedData.taxAmount || 0}</p>
                <p><strong>Delivery Charge:</strong> ₹{detailedData.deliveryCharge || 0}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Amount Payable:</strong> ₹{detailedData.amountPayable || 0}</p>
                <p><strong>Invest Amount:</strong> ₹{detailedData.investAmount || 0}</p>
                <p><strong>Status:</strong> {detailedData.status || "—"}</p>
                {/* {detailedData.createdAt && (
                  <p><strong>Created:</strong> {new Date(detailedData.createdAt).toLocaleString("en-IN")}</p>
                )} */}
              </div>
              
              {/* Items Details */}
              {detailedData.items && detailedData.items.length > 0 && (
                <div className="col-12 mt-3">
                  <h6>Items:</h6>
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
                        {detailedData.items.map((item, index) => (
                          <tr key={index}>
                            <td>#{index + 1}</td>
                            <td>{item.coinGrams}g</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Address Details */}
              {(detailedData.address || detailedData.city || detailedData.postCode) && (
                <div className="col-12 mt-3">
                  <h6>Address Details:</h6>
                  <p><strong>Address:</strong> {detailedData.address || "—"}</p>
                  <p><strong>City:</strong> {detailedData.city || "—"}</p>
                  <p><strong>Post Code:</strong> {detailedData.postCode || "—"}</p>
                </div>
              )}
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

// ✅ Search Component
const GlobalFilter = ({ filter, setFilter }) => {
  return (
    <span className="d-flex ms-auto">
      <input
        value={filter || ""}
        onChange={(e) => setFilter(e.target.value)}
        className="form-control mb-4"
        placeholder="Search..."
      />
    </span>
  );
};
