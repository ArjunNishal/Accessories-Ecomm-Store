import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginschema } from "./schemas/Loginschema";
import { useFormik } from "formik";
import jwt_decode from "jwt-decode";
import { axiosInstance } from "../../config";

const initialValues = {
  email: "",
  password: "",
};

function LoginForm() {
  const [name, setname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [redirect, setredirect] = useState(false);
  const [User, setUser] = useState({});

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: loginschema,
      onSubmit: async (values) => {
        console.log("values", values);
        try {
          const res = await axiosInstance.post(
            "user/admin-login",
            values
          );
          localStorage.setItem("admin", res.data.token);
          const token = res.data.token;
          const decoded = jwt_decode(token);
          const loggedinuser = decoded.id;
          console.log("response", res, decoded);
          navigate("/admin");
        } catch (error) {
          console.log("error", error);
          setError(error.response.data.message);
        }
      },
    });
  console.log(errors, "error");

  return (
    <div className="loginmaster">
      <div className="login container">
        <div className="loginmain rounded row p-4 m-md-0 m-2">
          <h3 className="text-center">Login</h3>
          <div className="loginrow">
            {/* <div className="loginleft "> */}
              <form
                className="loginform d-flex flex-column align-items-center"
                onSubmit={handleSubmit}
              >
                <div className="username mb-3 col-12">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {errors.email && touched.email ? (
                    <p className="form-error">{errors.email}</p>
                  ) : (
                    <div>
                      <p></p>
                    </div>
                  )}
                </div>
                <div className="mb-3 col-12">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="exampleInputPassword1"
                    name="password"
                    // maxLength={16}
                    value={values.password}
                    minLength={6}
                    maxLength={16}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    // placeholder="Enter 6-16 characters"
                  />
                  {errors.password && touched.password ? (
                    <p className="form-error">{errors.password}</p>
                  ) : (
                    <div>
                      <p>Enter 6-16 Charachters.</p>
                    </div>
                  )}
                </div>
                {error && <div style={{ color: "red" }}>{error}</div>}
                {/* <div className="loginbtn p-1 "> */}
                <button className="btn " type="submit">
                  Log In
                </button>
                {/* </div> */}
              </form>
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
