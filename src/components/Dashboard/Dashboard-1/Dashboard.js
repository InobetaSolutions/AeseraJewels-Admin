import React, { Fragment, useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
// import Api_Service from "../../services/apisevices";
import { FaUsers, FaUserTie, FaUser } from "react-icons/fa"; // Importing Font Awesome Icons

export default function HomePage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getAllUser();
  }, []);

  const getAllUser = async () => {
    try {
      const result = await Api_Service.authpost("getAllUserCountAndExpertCount");
      if (result.Status === true) {
        setData(result.data);
      } else {
        console.error(result.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  return (
    <Fragment>
      <div className="p-3">
      <div
            className="card-title mb-4 main-content-label text-primary"
            style={{ fontSize: "1.5rem", paddingLeft: 10 }}
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
                  <h6 className=" mb-2" style={{color:'black'}}>Users Count</h6>
                  <h2 style={{ fontWeight: "700", color: "#000" }}>
                    {data?.totalUsers || 0}
                  </h2>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Card 2: Expert Users */}
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
                  <h6 className="mb-2" style={{color:'black'}}>Catalog Count</h6>
                  <h2 style={{ fontWeight: "700", color: "#000" }}>
                    {data?.approvedExpertsCount || 0}
                  </h2>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Card 3: Normal Users */}
          {/* <Col xl={4} lg={4} md={6} sm={12}>
            <Card
              className="h-100 border-0 shadow"
              style={{
                background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
                borderRadius: "15px",
                height: "210px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Row className="align-items-center p-4">
                <Col xs={3} className="text-center">
                  <FaUser size={60} color="#00FF7F" style={{ opacity: 1 }} />
                </Col>
                <Col xs={9}>
                  <h6 className=" mb-2" style={{color:'black'}}>Normal Users</h6>
                  <h2 style={{ fontWeight: "700", color: "#000" }}>
                    {data?.normalUsersCount || 0}
                  </h2>
                </Col>
              </Row>
            </Card>
          </Col> */}
        </Row>
      </div>
    </Fragment>
  );
}
