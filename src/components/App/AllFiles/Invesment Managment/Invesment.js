import React, { Fragment, useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";

export default function GetCurrentRate() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const response = await fetch("http://13.204.96.244:3000/api/getAllCurrentRate", {
        method: "GET",
        redirect: "follow",
      });
      const text = await response.text();
      console.log("Raw API Response:", text);

      try {
        const result = JSON.parse(text);
        const rates = Array.isArray(result) ? result : [result];

        setData(
          rates.map((rate, index) => ({
            serial: index + 1,
            ...rate, // keep dynamic fields
          }))
        );
      } catch (err) {
        console.error("JSON parse error:", err);
      }
    } catch (error) {
      console.error("Error fetching rates:", error);
    }
  };

  // Dynamic Columns
  const COLUMNS = React.useMemo(() => {
    if (data.length === 0) return [];

    const headers = Object.keys(data[0]);
    return headers.map((key) => ({
      Header: key === "serial" ? "S.No" : key.charAt(0).toUpperCase() + key.slice(1),
      accessor: key,
      className: "wd-20p borderrigth",
      Cell: ({ value }) => (value !== null && value !== undefined ? value.toString() : "—"),
    }));
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
              Current Rates
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
