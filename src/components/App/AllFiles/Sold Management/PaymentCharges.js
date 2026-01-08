import React, { useEffect, useState, Fragment } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Catalog() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPaymentGatewayCharges();
  }, []);

  // 🔹 Fetch Payment Gateway Charges (NEW API)
  const fetchPaymentGatewayCharges = async () => {
    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/getPaymentGatewayCharges",
        {
          method: "GET",
          redirect: "follow",
        }
      );

      const result = await response.json();

      if (result.paymentGatewayCharges) {
        const records = Array.isArray(result.paymentGatewayCharges)
          ? result.paymentGatewayCharges
          : [result.paymentGatewayCharges];

        setData(records);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching payment gateway charges:", error);
    }
  };

  // Navigate to Add page
  const handleAddContact = () => {
    navigate(`${process.env.PUBLIC_URL}/app/AddPaymentcharges`);
  };

  // Navigate to Update page
  const handleEditContact = (item) => {
    navigate(
       `${process.env.PUBLIC_URL}/app/UpdatePaymentcharges/${item._id}`,
      { state: item }
    );
  };

  // 🔹 Delete Payment Gateway Charges
  const handleDeleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/deletePaymentGatewayCharges",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      const result = await response.json();

      setData((prev) => prev.filter((item) => item._id !== id));
      alert(result.message || "Deleted successfully");
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete record");
    }
  };

  return (
    <Fragment>
      <Card>
        <Card.Body>
          {/* Title + Add button */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div
              className="card-title main-content-label"
              style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
            >
              Payment Charges
            </div>
            <button
              onClick={handleAddContact}
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
              Add PaymentCharges
            </button>
          </div>

          {/* Table */}
          <div className="table-responsive mt-3">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.value}</td>
                      <td>
                        <button
                          onClick={() => handleEditContact(item)}
                          style={{
                            backgroundColor: "#ffc107",
                            border: "1px solid #ffc107",
                            color: "#fff",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            cursor: "pointer",
                            marginRight: "0.5rem",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteContact(item._id)}
                          style={{
                            backgroundColor: "#dc3545",
                            border: "1px solid #dc3545",
                            color: "#fff",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </Fragment>
  );
}
