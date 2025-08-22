import React, { useEffect, useState } from "react";
import { Card, Table, Spinner, Alert, Button } from "react-bootstrap";
import { API_URL } from "../../../../service";

const ProfessionList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProfessions = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL + "getAllProfession");
      const result = await response.json();

      if (result.profession) {
        setData(result.profession);
      } else {
        setError("Failed to fetch profession data.");
      }
    } catch (err) {
      setError("Error fetching profession data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessions();
  }, []);

  return (
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-primary">Profession List</h3>
          <Button variant="primary" onClick={fetchProfessions} disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : "addprofession"}
          </Button>
        </div>

        {loading && (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && data.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Profession Name</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.profession}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && !error && <p className="text-center">No profession data available.</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProfessionList;
