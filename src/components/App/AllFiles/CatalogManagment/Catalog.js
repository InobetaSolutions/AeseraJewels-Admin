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



import React, { Fragment, useEffect, useState } from "react";
import { Card, OverlayTrigger, Popover, Spinner, Alert } from "react-bootstrap";
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/get-products",
        requestOptions
      );

      const text = await response.text();
      console.log("Raw API Response:", text);

      try {
        const result = JSON.parse(text);
        const products = Array.isArray(result) ? result : [result];

        setData(
          products.map((product, index) => {
            // keep backend-only fields hidden from UI
            const { _id, __v, createdAt, updatedAt, ...rest } = product;
            return {
              _id, // ✅ keep id internally (needed for actions)
              serial: index + 1,
              ...rest,
              ...(createdAt
                ? { IstDate: new Date(createdAt).toLocaleString("en-IN") }
                : {}),
            };
          })
        );
      } catch (err) {
        console.error("JSON parse error:", err);
        setError("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to Add Product page
  const handleAddProduct = () => {
    navigate(`${process.env.PUBLIC_URL}/app/CatalogManagment/Addamc`);
  };

  // Navigate to View/Edit Product page
  const handleView = (product) => {
    let path = `${process.env.PUBLIC_URL}/app/ViewCatolog`;
    navigate(path, { state: { productdata: product } });
  };

  // Dynamic Columns
  const COLUMNS = React.useMemo(() => {
    if (data.length === 0) return [];

    const cols = Object.keys(data[0])
      .filter(
        (key) =>
          key !== "_id" &&
          key !== "__v" &&
          key !== "createdAt" &&
          key !== "updatedAt"
      )
      .map((key) => {
        if (key === "image") {
          return {
            Header: "Image",
            accessor: key,
            className: "wd-15p borderrigth",
            Cell: ({ value }) =>
              value ? (
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 200, hide: 100 }}
                  overlay={
                    <Popover>
                      <Popover.Body className="p-1">
                        <img
                          src={`http://13.204.96.244:3000/api/uploads/${value}`}
                          alt="product-large"
                          style={{
                            width: "200px",
                            height: "auto",
                            objectFit: "contain",
                            borderRadius: "6px",
                          }}
                        />
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <img
                    src={`http://13.204.96.244:3000/api/uploads/${value}`}
                    alt="product"
                    className="product-img-hover"
                    style={{
                      width: "80px",
                      height: "50px",
                      objectFit: "cover",
                      cursor: "pointer",
                      borderRadius: "4px",
                    }}
                  />
                </OverlayTrigger>
              ) : (
                "—"
              ),
          };
        }
        return {
          Header:
            key === "serial"
              ? "S.No"
              : key.charAt(0).toUpperCase() + key.slice(1),
          accessor: key,
          className: "wd-20p borderrigth",
          Cell: ({ value }) =>
            value !== null && value !== undefined ? value.toString() : "—",
        };
      });

    // ✅ Add Actions column
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
          {/* Title + Add Product */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div
              className="card-title main-content-label"
              style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
            >
              Catalog Management
            </div>
            <button
              onClick={handleAddProduct}
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
              Add Product
            </button>
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

