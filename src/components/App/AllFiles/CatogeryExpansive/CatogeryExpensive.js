import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_URL = "http://45.198.13.152:7002/getAllBanners";

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", "Bearer {{Authorization}}");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({ type: "0" }),
        redirect: "follow",
      };

      try {
        const response = await fetch(API_URL, requestOptions);
        const result = await response.json();
        
        if (result.status === 200) {
          setBanners(result.response);
        } else {
          setError("Failed to retrieve banners.");
        }
      } catch (err) {
        setError("Error fetching banners.");
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  const handleAddbannersClick = () => {
    navigate("/app/Addbanners"); // Make sure this path is correct
  };

  return (
    <div>
      <h3 className="text-primary mb-4">Banners</h3>
       <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-primary">Banners Data</h3>
                <Button variant="primary" onClick={handleAddbannersClick}>
                  Addbannersy
                </Button>
              </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Description</th>
            <th>Offer</th>
            <th>Link</th>
            <th>Button</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner) => (
            <tr key={banner._id}>
              <td>
                {banner.image !== "N/A" ? (
                  <img src={banner.image} alt={banner.title} width="100" />
                ) : (
                  "No Image"
                )}
              </td>
              <td>{banner.title}</td>
              <td>{banner.description}</td>
              <td>{banner.offer}%</td>
              <td>
                <a href={banner.link} target="_blank" rel="noopener noreferrer">
                  View
                </a>
              </td>
              <td>
                <Button variant="primary" href={banner.link} target="_blank">
                  {banner.buttonName}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default BannerList;
