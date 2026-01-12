import React, { Fragment, useEffect, useState } from "react";
import { Card, Spinner, Alert } from "react-bootstrap";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";

export default function ApprovedSellPayments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApprovedPayments();
  }, []);

  // 🔹 Fetch Approved Sell Payments
  const fetchApprovedPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/getApprovedSellPayment",
        { method: "GET" }
      );

      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        const formatted = result.data.map((item, index) => ({
          serial: index + 1,
          mobileNumber: item.mobileNumber || "—",
          amount: item.amount || 0,
          paymentGatewayCharges: item.paymentGatewayCharges || 0,
          taxAmount: item.taxAmount || 0,
          deliveryCharges: item.deliveryCharges || 0,
          paymentStatus: item.paymentStatus || "—",
          timestamp: item.timestamp || "—",
        }));

        setData(formatted);
      } else {
        setError("Unexpected response format");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch approved sell payments");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Table Columns
  const COLUMNS = React.useMemo(() => {
    if (!data.length) return [];

    return [
      { Header: "S.No", accessor: "serial" },
      { Header: "Mobile Number", accessor: "mobileNumber" },
      { Header: "Amount (₹)", accessor: "amount" },
      { Header: "Gateway Charges (₹)", accessor: "paymentGatewayCharges" },
      { Header: "Tax Amount (₹)", accessor: "taxAmount" },
      { Header: "Other Charges (₹)", accessor: "deliveryCharges" },
      { Header: "Status", accessor: "paymentStatus" },
    //   { Header: "Approved Time", accessor: "timestamp" },
    ];
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
    page,
    state,
    setGlobalFilter,
    pageOptions,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
  } = tableInstance;

  if (loading) return <Spinner animation="border" className="m-4" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Fragment>
      <Card>
        <Card.Body>
          <div
            className="card-title main-content-label mb-4"
            style={{ color: "#082038" }}
          >
            Approved Sell Payments
          </div>

          {/* 🔍 Search */}
          <input
            value={state.globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="form-control mb-3"
            placeholder="Search..."
          />

          {/* 📊 Table */}
          <div className="table-responsive">
            <table {...getTableProps()} className="table table-hover">
              <thead>
                {headerGroups.map((hg) => (
                  <tr {...hg.getHeaderGroupProps()}>
                    {hg.headers.map((col) => (
                      <th {...col.getHeaderProps()}>
                        {col.render("Header")}
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
                        <td {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ⏭ Pagination */}
          {/* <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={previousPage}
              disabled={!canPreviousPage}
            >
              Previous
            </button>
            <span>
              Page <strong>{pageOptions.length ? pageOptions.indexOf(page[0]) + 1 : 1}</strong>
            </span>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={nextPage}
              disabled={!canNextPage}
            >
              Next
            </button>
          </div> */}
        </Card.Body>
      </Card>
    </Fragment>
  );
}
