import React, { useEffect, useState, Fragment } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Catalog() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSupport();
  }, []);

  const fetchSupport = async () => {
    try {
      const requestOptions = {
        method: "POST",
        redirect: "follow",
      };

      const response = await fetch(
        "http://13.204.96.244:3000/api/getSupport",
        requestOptions
      );

      const result = await response.json();
      if (result.data && Array.isArray(result.data)) {
        setData(result.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching support data:", error);
    }
  };

  // Navigate to AddContact page
  const handleAddContact = () => {
    navigate(`${process.env.PUBLIC_URL}/app/AddContact`);
  };

  return (
    <Fragment>
      <Card>
        <Card.Body>
          {/* Title + Add Contact button */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div
              className="card-title main-content-label"
              style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
            >
              Support Records
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
              Add Contact
            </button>
          </div>

          {/* Table */}
          <div className="table-responsive mt-3">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Email</th>
                  <th>Mobile</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.email || "—"}</td>
                      <td>{item.mobile || "—"}</td>
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
