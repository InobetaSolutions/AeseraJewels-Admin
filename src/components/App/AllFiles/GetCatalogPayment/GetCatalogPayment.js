import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Spinner, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";

export default function GetGoldRecords() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Table columns (added Allotment Status)
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
        className: "wd-15p borderrigth",
      },

       {
        Header: "Image",
        accessor: "image",
        className: "wd-20p borderrigth",
      },
      {
        Header: "Tag ID",
        accessor: "tagid",
        className: "wd-10p borderrigth",
      },
      {
        Header: "Gold Type",
        accessor: "goldType",
        className: "wd-15p borderrigth",
      },
     
      {
        Header: "Amount",
        accessor: "amount",
        Cell: ({ value }) => `₹ ${value?.toLocaleString() || 0}`,
        className: "wd-10p borderrigth",
      },
      {
        Header: "Grams",
        accessor: "grams",
        Cell: ({ value }) => `${value || 0} g`,
        className: "wd-10p borderrigth",
      },
      {
        Header: "Paid Amount",
        accessor: "Paidamount",
        Cell: ({ value }) => `₹ ${value?.toLocaleString() || 0}`,
        className: "wd-10p borderrigth",
      },
      {
        Header: "Paid Grams",
        accessor: "Paidgrams",
        Cell: ({ value }) => `${value || 0} g`,
        className: "wd-10p borderrigth",
      },
      {
        Header: "Allotment Status",
        accessor: "allotmentStatus",
        Cell: ({ value }) => (
          <Badge
            bg={
              value === "Approved"
                ? "success"
                : value === "Rejected"
                ? "danger"
                : "warning"
            }
          >
            {value || "Pending"}
          </Badge>
        ),
        className: "wd-15p borderrigth",
      },
    ],
    []
  );

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Fetch API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://13.204.96.244:3000/api/getGoldRecords");
      const result = await response.json();

      if (Array.isArray(result)) {
        setData(
          result.map((item, index) => ({
            serial: index + 1,
            mobileNumber: item.mobileNumber || "N/A",
            tagid: item.tagid || "N/A",
            goldType: item.goldType || "N/A",
            descrption: item.descrption || "N/A",
            amount: item.amount || 0,
            grams: item.grams || 0,
            Paidamount: item.Paidamount || 0,
            Paidgrams: item.Paidgrams || 0,
            allotmentStatus: item.allotmentStatus || "Pending",
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching gold records:", error);
      Swal.fire("Error!", "Failed to fetch records", "error");
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
              Catalog Payment
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
