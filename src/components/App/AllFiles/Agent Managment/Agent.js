import React, { useEffect, useState } from "react";
import { Card, Table, Spinner, Badge, Alert } from "react-bootstrap";
import { API_URL } from "../../../../service"; // Adjust this import according to your API file

const KYCManagement = () => {
  const [kycData, setKycData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch KYC Data
  const fetchKycData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL + "getAllKyc"); // Update endpoint if necessary
      const result = await response.json();

      if (response.ok) {
        setKycData(result.response || []);
      } else {
        setError(result.message || "Failed to fetch KYC data.");
      }
    } catch (err) {
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycData();
  }, []);

  return (
    <Card>
      <Card.Body>
        <h4 className="text-primary mb-4">KYC Management</h4>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
            <p>Loading KYC Data...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <div className="table-responsive">
            <Table bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>KYC Type</th>
                  <th>KYC Number</th>
                  <th>Status</th>
                  <th>Front Image</th>
                  <th>Back Image</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {kycData.length > 0 ? (
                  kycData.map((kyc) => (
                    <tr key={kyc._id}>
                      <td>{kyc.name}</td>
                      <td>{kyc.kycType}</td>
                      <td>{kyc.kycNumber}</td>
                      <td>
                        {kyc.Approved ? (
                          <Badge bg="success">Approved</Badge>
                        ) : kyc.rejected ? (
                          <Badge bg="danger">Rejected</Badge>
                        ) : (
                          <Badge bg="warning">Pending</Badge>
                        )}
                      </td>
                      <td>
                        <img
                          src={`${API_URL}/uploads/${kyc.frontImage}`}
                          alt="Front"
                          style={{ width: "80px", height: "50px", objectFit: "cover" }}
                        />
                      </td>
                      <td>
                        <img
                          src={`${API_URL}/uploads/${kyc.backImage}`}
                          alt="Back"
                          style={{ width: "80px", height: "50px", objectFit: "cover" }}
                        />
                      </td>
                      <td>{new Date(kyc.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No KYC data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default KYCManagement;
