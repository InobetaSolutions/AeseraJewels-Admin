import React, { useState } from "react";
import { Button, Col, Form, Row, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Firebase/firebase";
import Swal from "sweetalert2";

const SignIn = () => {
  const [err, setError] = useState("");
  const [data, setData] = useState({
    email: "GoldPointAdmin@gmail.com",
    password: "GoldPointAdmin@123",
  });
  const { email, password } = data;

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError("");
  };

  let navigate = useNavigate();
  const routeChange = () => {
    let path = `${process.env.PUBLIC_URL}/dashboard/dashboard-1/`;
    if (
      data.email === "GoldPointAdmin@gmail.com" &&
      data.password === "GoldPointAdmin@123"
    ) {
      navigate(path);
    } else {
      Warningalert("Please Enter Correct Email & Password");
    }
  };

  function Warningalert(errorMessage) {
    Swal.fire({
      title: errorMessage,
      icon: "warning",
    });
  }

  const Login = (e) => {
    e.preventDefault();
    routeChange();
    // auth.signInWithEmailAndPassword(email, password).then(
    // user => {console.log(user);routeChange()}).catch(err => {console.log(err);setError(err.message)})
  };

  return (
    <React.Fragment>
      <div className="square-box">
        <div></div> <div></div> <div></div> <div></div> <div></div> <div></div>
        <div></div> <div></div> <div></div> <div></div> <div></div> <div></div>
        <div></div> <div></div> <div></div>
      </div>
      {/* <div className="page bg-primary"> */}
      <div
        className="page"
        style={{ backgroundColor: "#082038", minHeight: "100vh" }}
      >
        <div className="page-single">
          <div className="container" style={{ marginTop: "89px" }}>
            <Row>
              <Col
                xl={5}
                lg={6}
                md={8}
                sm={8}
                xs={10}
                className="card-sigin-main mx-auto my-auto py-4 justify-content-center"
              >
                <div className="card-sigin">
                  <div className="main-card-signin d-md-flex">
                    <div className="wd-100p">
                      {/* Centered Logo */}
                      <div className="d-flex justify-content-center align-items-center mb-4">
                        <Link to="#">
                          <img
                            src={require("../assets/img/brand/logo5124.png")}
                            className="sign-favicon ht-40"
                            alt="logo"
                          />
                        </Link>
                      </div>

                      <div className="">
                        <div className="main-signup-header">
                          <h6 className="font-weight-semibold mb-4">
                            Please sign in to continue.
                          </h6>
                          <div className="panel panel-primary">
                            <div className="tab-menu-heading mb-2 border-bottom-0">
                              <div className="tabs-menu1">
                                {err && <Alert variant="danger">{err}</Alert>}
                                <Form>
                                  <Form.Group className="form-group">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                      className="form-control"
                                      placeholder="Enter your email"
                                      name="email"
                                      type="text"
                                      value={email}
                                      onChange={changeHandler}
                                      required
                                    />
                                  </Form.Group>
                                  <Form.Group className="form-group">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                      className="form-control"
                                      placeholder="Enter your password"
                                      name="password"
                                      type="password"
                                      value={password}
                                      onChange={changeHandler}
                                      required
                                    />
                                  </Form.Group>
                                  <button
                                    variant=""
                                    type="submit"
                                    className="btn  btn-block"
                                    style={{
                                      backgroundColor: "#082038",
                                      border: "1px solid #082038",
                                      color: "#fff",
                                      padding: "0.375rem 0.75rem",
                                      borderRadius: "0.25rem",
                                      cursor: "pointer",
                                    }}
                                    onClick={Login}
                                  >
                                    Sign In
                                  </button>

                                  <div className="main-signin-footer text-center mt-3">
                                    {/* Extra links can go here */}
                                  </div>
                                </Form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

SignIn.propTypes = {};
SignIn.defaultProps = {};
export default SignIn;
