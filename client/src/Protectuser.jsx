import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Protectuser = (props) => {
  const navigate = useNavigate();
  const { Component } = props;

  useEffect(() => {
    const login = localStorage.getItem("token");
    if (!login) {
      // Show SweetAlert2 prompt when the user is not logged in
      Swal.fire({
        title: "Login first",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Go to Login",
        cancelButtonText: "Go to Home",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login-register");
        }else{
          navigate("/");
        }
      });
    }
  }, [navigate]);

  if (!localStorage.getItem("token")) {
    return null;
  }

  return (
    <div>
      <Component />
    </div>
  );
};

export default Protectuser;
