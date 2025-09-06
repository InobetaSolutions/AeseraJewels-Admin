import React, { Fragment, useEffect, useState, useCallback } from "react";
import {
  Card,
  Spinner,
  Button,
  Form,
  Modal,
  Table,
  Alert,
} from "react-bootstrap";
import Swal from "sweetalert2";

export default function GetCatalogAllotments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allotment, setAllotment] = useState({});
  const [submitting, setSubmitting] = useState("");
  const [activeRow, setActiveRow] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedMobile, setSelectedMobile] = useState("");
  const [allotmentError, setAllotmentError] = useState({});
  const [allotmentSuccess, setAllotmentSuccess] = useState({});

  // ✅ Format timestamps to IST
  const formatToIST = useCallback((timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
    } catch {
      return timestamp;
    }
  }, []);

  // ✅ Normalize API response data
  const normalizeData = useCallback((result) => {
    let dataArray = [];

    if (Array.isArray(result)) {
      dataArray = result;
    } else if (result?.data) {
      if (Array.isArray(result.data)) {
        dataArray = result.data;
      } else {
        dataArray = [result.data];
      }
    }

    return dataArray.map((item, idx) => ({
      ...item,
      serial: idx + 1,
      totalAmount: Number(item.amount || item.totalAmount) || 0,
      totalGrams: Number(item.grams || item.totalGrams) || 0,
      catalogID: item._id || item.catalogID,
    }));
  }, []);

  // ✅ Fetch catalog payments
  const fetchCatalogPayments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/getCatalogPayment",
        { 
          method: "GET", 
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("📌 API Response:", result);

      const cleaned = normalizeData(result);
      setData(cleaned);
    } catch (err) {
      console.error("Error fetching catalog payments:", err);
      setError("Failed to fetch catalog payments. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [normalizeData]);

  useEffect(() => {
    fetchCatalogPayments();
  }, [fetchCatalogPayments]);

  // ✅ Handle allotment
  const handleAllotment = async (mobileNumber, catalogID, availableGrams) => {
    const gramValue = Number(allotment[mobileNumber]);
    
    if (!gramValue || gramValue <= 0) {
      setAllotmentError({
        ...allotmentError,
        [mobileNumber]: "Please enter a valid gram value.",
      });
      return;
    }
    
    if (gramValue > availableGrams) {
      setAllotmentError({
        ...allotmentError,
        [mobileNumber]: `Cannot allot more than ${availableGrams}g.`,
      });
      return;
    }

    setSubmitting(mobileNumber);
    setAllotmentError({ ...allotmentError, [mobileNumber]: "" });
    setAllotmentSuccess({ ...allotmentSuccess, [mobileNumber]: "" });

    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/setCatalogAllotment",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ 
            mobileNumber, 
            catalogID, 
            gram: gramValue 
          }),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (response.ok) {
        setAllotmentSuccess({
          ...allotmentSuccess,
          [mobileNumber]: result?.message || "Allotment successful!",
        });

        Swal.fire({
          title: "Success", 
          text: result?.message || "Allotment successful!", 
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
        
        setActiveRow("");
        setAllotment({ ...allotment, [mobileNumber]: "" });
        fetchCatalogPayments();
      } else {
        const errorMsg = result?.message || "Failed to set allotment.";
        setAllotmentError({
          ...allotmentError,
          [mobileNumber]: errorMsg,
        });
        Swal.fire("Failed", errorMsg, "error");
      }
    } catch (err) {
      console.error("Error in setCatalogAllotment:", err);
      Swal.fire("Error", "Server error, please try again later.", "error");
    } finally {
      setSubmitting("");
    }
  };

  // ✅ Handle view catalog allotments (per user) - UPDATED API CALL
  const handleView = async (mobile) => {
    setSelectedMobile(mobile);
    setModalLoading(true);
    setShowModal(true);
    setModalData(null);

    try {
      const response = await fetch(
        "http://13.204.96.244:3000/api/getbyUserCatalog",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ 
            mobileNumber: mobile
          }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();
      console.log("User catalog response:", result);
      
      let dataArray = [];
      
      if (Array.isArray(result)) {
        dataArray = result;
      } else if (result?.data) {
        dataArray = Array.isArray(result.data) ? result.data : [result.data];
      } else if (result?.catalogs) {
        dataArray = Array.isArray(result.catalogs) ? result.catalogs : [result.catalogs];
      } else if (result) {
        // If the response is a single object, wrap it in an array
        dataArray = [result];
      }

      setModalData(dataArray);
    } catch (err) {
      console.error("Error fetching user catalog details:", err);
      setModalData([]);
      Swal.fire("Error", "Failed to fetch user catalog details.", "error");
    } finally {
      setModalLoading(false);
    }
  };

  // ✅ Render modal content - UPDATED to show only specific fields
  const renderModalContent = () => {
    if (modalLoading) {
      return (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading catalog data for {selectedMobile}...</p>
        </div>
      );
    }
    
    if (!modalData || modalData.length === 0) {
      return <Alert variant="info">No catalog items found for {selectedMobile}.</Alert>;
    }

    // Define the specific columns we want to show
    const columnsToShow = ['tagid', 'address' , 'postCode', 'amount','createdAt'];
    
    return (
      <div className="table-responsive">
        <Table bordered striped hover>
          <thead>
            <tr>
              {columnsToShow.map((key) => (
                <th key={key}>
                  {key === 'createdAt' ? 'Timestamp' : 
                   key === 'tagid' ? 'Tag ID' :
                   key === 'postCode' ? 'Post Code' :
                   key.charAt(0).toUpperCase() + key.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modalData.map((row, idx) => (
              <tr key={idx}>
                {columnsToShow.map((key) => (
                  <td key={key}>
                    {row[key] !== undefined && row[key] !== null
                      ? key.toLowerCase().includes("createdat")
                        ? formatToIST(row[key])
                        : row[key]
                      : "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  // ✅ Reset form for a specific user
  const resetForm = (mobileNumber) => {
    setActiveRow("");
    setAllotment({ ...allotment, [mobileNumber]: "" });
    setAllotmentError({ ...allotmentError, [mobileNumber]: "" });
    setAllotmentSuccess({ ...allotmentSuccess, [mobileNumber]: "" });
  };

  return (
    <Fragment>
      <Card className="shadow-sm">
        <Card.Body>
          <div
            className="card-title main-content-label"
            style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
          >
            Catalog Allotment 
          </div>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
            <div className="text-danger text-center">{error}</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Mobile</th>
                    <th>Tag ID</th>
                    <th>Total Amount</th>
                    <th>Total Grams</th>
                    <th>Action</th>
                    <th>View Catalog</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((item) => (
                      <tr key={`${item.mobileNumber}-${item.tagid}`}>
                        <td>{item.serial}</td>
                        <td>{item.mobileNumber}</td>
                        <td>{item.tagid}</td>
                        <td>₹ {item.totalAmount.toFixed(2)}</td>
                        <td>{item.totalGrams} g</td>
                        <td>
                          {activeRow === item.mobileNumber ? (
                            <div>
                              <div className="d-flex gap-2 mb-2">
                                <Form.Control
                                  type="number"
                                  placeholder="Enter grams"
                                  value={allotment[item.mobileNumber] || ""}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setAllotment({
                                      ...allotment,
                                      [item.mobileNumber]: value,
                                    });
                                    setAllotmentError({
                                      ...allotmentError,
                                      [item.mobileNumber]: "",
                                    });
                                    setAllotmentSuccess({
                                      ...allotmentSuccess,
                                      [item.mobileNumber]: "",
                                    });
                                  }}
                                  style={{ width: "120px" }}
                                  max={item.totalGrams}
                                  disabled={submitting === item.mobileNumber}
                                />
                                <Button
                                  variant="success"
                                  size="sm"
                                  disabled={submitting === item.mobileNumber || !allotment[item.mobileNumber]}
                                  onClick={() =>
                                    handleAllotment(item.mobileNumber, item.catalogID, item.totalGrams)
                                  }
                                >
                                  {submitting === item.mobileNumber
                                    ? "Submitting..."
                                    : "Confirm"}
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => resetForm(item.mobileNumber)}
                                  disabled={submitting === item.mobileNumber}
                                >
                                  Cancel
                                </Button>
                              </div>
                              {allotmentError[item.mobileNumber] && (
                                <div className="text-danger small">
                                  {allotmentError[item.mobileNumber]}
                                </div>
                              )}
                              {allotmentSuccess[item.mobileNumber] && (
                                <div className="text-success small">
                                  {allotmentSuccess[item.mobileNumber]}
                                </div>
                              )}
                            </div>
                          ) : (
                            <button
                              size="sm"
                              onClick={() => setActiveRow(item.mobileNumber)}
                              disabled={item.totalGrams <= 0}
                              style={{
                                backgroundColor: item.totalGrams <= 0 ? "#6c757d" : "#082038",
                                border: "1px solid #082038",
                                color: "#fff",
                                padding: "0.375rem 0.75rem",
                                borderRadius: "0.25rem",
                                cursor: item.totalGrams <= 0 ? "not-allowed" : "pointer",
                              }}
                            >
                              Catalog Allotment
                            </button>
                          )}
                        </td>
                        <td>
                          <button
                            size="sm"
                            onClick={() => handleView(item.mobileNumber)}
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
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal for viewing catalog details */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Catalog Details for {selectedMobile}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderModalContent()}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}