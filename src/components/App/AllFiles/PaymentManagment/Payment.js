import React, { Fragment, useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";

export default function GetPayments() {
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
        className: "wd-20p borderrigth",
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: ({ value }) => `₹${value.toLocaleString()}`,
        className: "wd-20p borderrigth",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span className={value === "approved" ? "text-success fw-bold" : "text-danger fw-bold"}>
            {value}
          </span>
        ),
        className: "wd-15p borderrigth",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) =>
          row.original.status !== "approved" ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => approvePayment(row.original.id)}
            >
              Approve
            </Button>
          ) : (
            "-"
          ),
        className: "wd-15p borderrigth",
      },
    ],
    []
  );

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch("http://13.204.96.244:3000/api/getAllPayments");
      const result = await response.json();
      if (Array.isArray(result)) {
        setData(
          result.map((p, index) => ({
            serial: index + 1,
            id: p._id || index,
            mobile: p.mobile || "N/A",
            amount: p.amount || 0,
            status: p.status || "pending",
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const approvePayment = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to approve this payment.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, approve it!",
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
          prev.map((p) => (p.id === id ? { ...p, status: "approved" } : p))
        );

        Swal.fire({
          title: "Success!",
          text: "Payment has been approved successfully.",
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
