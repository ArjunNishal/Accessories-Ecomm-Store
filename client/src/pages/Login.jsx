import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { axiosInstance } from "../config";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/actions/action";

const Login = () => {
  const navigate = useNavigate("");
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mobileno, setmobileno] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosInstance.post("user/signup", {
        username,
        email,
        password,
        mobileno,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "User registered successfully!",
      });

      setusername("");
      setPassword("");
      setEmail("");
      setmobileno("");

      console.log("User registered successfully:", response.data);
    } catch (error) {
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data,
        });
        console.log("User registration failed:", error.response.data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error registering user",
        });
        console.error("Error registering user:", error);
      }
    }
  };
  const dispatch = useDispatch();

  const handleSubmitlogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosInstance.post("user/login", {
        mobileno,
        password,
      });

      if (response.status === 200) {
        const { token, data } = response.data;
        localStorage.setItem("token", token);
        console.log(
          "User logged in successfully:",
          data,
          token,
          localStorage.getItem("token") === token
        );
        if (localStorage.getItem("token") === token) {
          // Dispatch the addUser action only if the token is set
          dispatch(addUser({ data }));
        }
        navigate("/collections/allproducts");
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data,
        });
        console.log("Login failed:", error.response.data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error logging in",
        });
        console.error("Error logging in:", error);
      }
    }
  };

  return (
    <div>
      <Header />
      {/* main-content-wrap start */}
      <div className="login-main main-content-wraplagin-and-register-page">
        <div className="container-md p-lg-5">
          <div className="row p-lg-5 py-3 rounded-md justify-content-center">
            <div className="col-lg-7 col-12">
              <h2 className="text-white text-center">Customize Here</h2>
            </div>
            <div className="col-lg-5 col-md-10 col-12">
              <div className="login-register-wrapper bg-white rounded p-lg-5 py-3">
                {/* login-register-tab-list start */}
                <div className="nav login-register-tab-list">
                  <button
                    className="login-register-tab-btn active"
                    data-bs-toggle="tab"
                    data-bs-target="#login"
                    type="button"
                  >
                    Login
                  </button>
                  <button
                    className="login-register-tab-btn"
                    data-bs-toggle="tab"
                    data-bs-target="#register"
                    type="button"
                  >
                    Register
                  </button>
                </div>
                <div className="tab-content">
                  <div className="tab-pane show active" id="login">
                    <div className="login-form-container">
                      <div className="login-register-form">
                        <form onSubmit={handleSubmitlogin}>
                          <div className="login-input-box">
                            <input
                              type="number"
                              className="form-control"
                              id="user-mobile"
                              name="user-mobile"
                              placeholder="Mobile Number"
                              value={mobileno}
                              onChange={(event) =>
                                setmobileno(event.target.value)
                              }
                              required
                            />
                            <input
                              type="password"
                              name="user-password"
                              id="inputPassword6"
                              placeholder="Password"
                              className="form-control"
                              aria-labelledby="passwordHelpInline"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <div className="button-box">
                            <div className="login-toggle-btn">
                              {/* <input type="checkbox" />
                              <label>Remember me</label> */}
                              <Link to="/forgotpassword">Forgot Password?</Link>
                            </div>
                            <div className="button-box">
                              <button className="login-btn btn" type="submit">
                                <span>Login</span>
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane" id="register">
                    <div className="login-form-container">
                      <div className="login-register-form">
                        <form onSubmit={handleSubmit}>
                          <div className="login-input-box">
                            <div className="form-group">
                              <label htmlFor="user-name">
                                <b>User Name</b>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="user-name"
                                name="user-name"
                                placeholder="User Name"
                                value={username}
                                onChange={(event) =>
                                  setusername(event.target.value)
                                }
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="user-password">
                                <b>Password</b>
                              </label>
                              <input
                                type="password"
                                className="form-control"
                                id="user-password"
                                name="user-password"
                                placeholder="Password"
                                value={password}
                                onChange={(event) =>
                                  setPassword(event.target.value)
                                }
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="user-email">
                                <b>Email</b>
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                id="user-email"
                                name="user-email"
                                placeholder="Email"
                                value={email}
                                onChange={(event) =>
                                  setEmail(event.target.value)
                                }
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="user-mobile">
                                <b>Mobile Number</b>
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="user-mobile"
                                name="user-mobile"
                                placeholder="Mobile Number"
                                value={mobileno}
                                onChange={(event) =>
                                  setmobileno(event.target.value)
                                }
                                required
                              />
                            </div>
                          </div>
                          <div className="button-box">
                            <button className="register-btn btn" type="submit">
                              <span>Register</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                {/* login-register-tab-list end */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* main-content-wrap end */}

      <Footer />
    </div>
  );
};

export default Login;
