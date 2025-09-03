import React, { Fragment, useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { FaUsers, FaUserTie } from "react-icons/fa";

export default function HomePage() {
  const [data, setData] = useState({
    totalUsers: 0,
    approvedExpertsCount: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Call get-products API
      const productsRes = await fetch(
        "http://13.204.96.244:3000/api/get-products",
        {
          method: "GET",
          redirect: "follow",
        }
      );
      const productsData = await productsRes.json();

      // Call get-users API
      const usersRes = await fetch(
        "http://13.204.96.244:3000/api/get-users",
        {
          method: "GET",
          redirect: "follow",
        }
      );
      const usersData = await usersRes.json();

      // Update state (adjust keys as per API response structure)
      setData({
        totalUsers: usersData?.length || 0, // assuming users API returns an array
        approvedExpertsCount: productsData?.length || 0, // assuming products API returns an array
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <Fragment>
      <div className="p-3">
       <div
              className="card-title main-content-label"
              style={{ fontSize: "1.25rem", paddingLeft: 10, color: "#082038" }}
            >
          Dashboard
        </div>
        <Row className="gy-4">
          {/* Card 1: Total Users */}
          <Col xl={4} lg={4} md={6} sm={12}>
            <Card
              className="h-100 border-0 shadow"
              style={{
                background: "linear-gradient(135deg, #1e3c72, #2a5298)",
                borderRadius: "15px",
                height: "210px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Row className="align-items-center p-4">
                <Col xs={3} className="text-center">
                  <FaUsers size={60} color="#FFD700" style={{ opacity: 1 }} />
                </Col>
                <Col xs={9}>
                  <h6 className=" mb-2" style={{ color: "black" }}>
                    Users Count
                  </h6>
                  <h2 style={{ fontWeight: "700", color: "#000" }}>
                    {data.totalUsers}
                  </h2>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Card 2: Catalog Count */}
          <Col xl={4} lg={4} md={6} sm={12}>
            <Card
              className="h-100 border-0 shadow"
              style={{
                background: "linear-gradient(135deg, #4b6cb7, #182848)",
                borderRadius: "15px",
                height: "210px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Row className="align-items-center p-4">
                <Col xs={3} className="text-center">
                  <FaUserTie size={60} color="#FFA500" style={{ opacity: 1 }} />
                </Col>
                <Col xs={9}>
                  <h6 className="mb-2" style={{ color: "black" }}>
                    Catalog Count
                  </h6>
                  <h2 style={{ fontWeight: "700", color: "#000" }}>
                    {data.approvedExpertsCount}
                  </h2>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
}
