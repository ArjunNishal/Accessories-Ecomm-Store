import { useState, useEffect, useRef } from "react";
import React from "react";
import { axiosInstance, renderUrl } from "../../config";
import jwtdecode from "jwt-decode";
import Swal from "sweetalert2";

const Profile = () => {
  const [user, setUser] = useState({});
  const token = localStorage.getItem("admin");
  console.log(token);
  const decoded = jwtdecode(token);
  const loggedinuser = decoded.id;
  console.log(loggedinuser, "decoded");

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get(
        `admin/view/profile/${loggedinuser}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(token);
      console.log(response.data, "response");
      setUser(response.data);
      setusername(response.data.name);
      setemail(response.data.email);
      setmobileno(response.data.mobileno);
      onImagecancel();
    } catch (error) {
      console.log("Failed to fetch user profile.", error);
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const [username, setusername] = useState("");
  const [Email, setemail] = useState("");
  const [Mobileno, setmobileno] = useState("");
  const [error, setError] = useState("");
  //   console.log("Error:", username);
  const [showchangepass, setshowchangepass] = useState(false);

  const setUpdateImageAction = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("image", picture.pictureAsFile);

    try {
      const response = await axiosInstance.put(
        `admin/updatepicture/${loggedinuser}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatearticle = response.data;

      if (updatearticle) {
        console.log("Successfully updated image");
        alert("Profile updated");
        setshowupdate(false);
        onImagecancel();
        fetchUserProfile();
      } else {
        console.log("Error found");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      setError("email invalid");
      return;
    }

    try {
      const response = await axiosInstance.put(
        `admin/updateprofile/${loggedinuser}`,
        {
          name: username,
          mobileno: Mobileno,
          email: Email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      alert("Profile updated");
      setshowupdate2(false);
      fetchUserProfile();
    } catch (error) {
      console.error(error);
    }
  };

  const fileInputRef = React.useRef(null);
  const [picture, setPicture] = useState(null);
  const [showupdate, setshowupdate] = useState(false);
  const [showupdate2, setshowupdate2] = useState(false);
  const uploadPicture = (e) => {
    setPicture({
      /* contains the preview, if you want to show the picture to the user
           you can access it with this.state.currentPicture
       */
      picturePreview: URL.createObjectURL(e.target.files[0]),
      /* this contains the file we want to send */
      pictureAsFile: e.target.files[0],
    });
  };

  const onImagecancel = () => {
    fileInputRef.current.value = "";
    setPicture(null);
  };
  // password reset
  // reset password
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentpassword, setcurrentpassword] = useState("");
  const [message, setMessage] = useState("");
  console.log(password, confirmPassword);

  const handlepasswordSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const data = { password, confirmPassword, currentpassword };
      console.log("started", data);
      const response = await axiosInstance.put(
        `admin/resetpassword/${loggedinuser}/${token}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success message using SweetAlert
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data, // This should be the success message from the server response
      });
      setshowchangepass(false);
      fetchUserProfile();
      setPassword("");
      setConfirmPassword("");
      setcurrentpassword("");
      setMessage("")
    } catch (error) {
      console.error("Error resetting password:", error);
      if (error.response.data === "Incorrect current password") {
        setMessage("Incorrect current password");
      } else {
        setMessage("Failed to reset password. Please try again later.");
      }
    }
  };

  return (
    <div className=" p-4">
      <div className="d-flex">
        <div className="profilepic2 m-3">
          {user.image ? (
            <img
              src={`${renderUrl}uploads/admins/${user.image}`}
              alt="profile pic"
            />
          ) : (
            ""
          )}
        </div>
        <div className="profiledetails">
          {!showupdate && (
            <button
              className="profilebtn btn btn-outline-info m-1"
              onClick={() => {
                setshowupdate2(false);
                setshowupdate(true);
                setshowchangepass(false);
              }}
            >
              <i class="fa-solid fa-camera"></i>
            </button>
          )}
          {!showupdate2 && (
            <button
              className="profilebtn btn btn-outline-success m-1"
              onClick={() => {
                setshowupdate(false);
                setshowupdate2(true);
                setshowchangepass(false);
              }}
            >
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
          )}
          <button
            onClick={() => {
              setshowchangepass(true);
              setshowupdate(false);
              setshowupdate2(false);
            }}
            className="btn mx-2 p-2"
          >
            reset password
          </button>
          <h5 className="text-capitalize">name: {user.name}</h5>
          <h6>email: {user.email}</h6>
          <h6>mobileno: {user.mobileno}</h6>
        </div>
      </div>
      {showupdate && (
        <div className="updateprofile">
          <form className="createform  p-3 border rounded">
            <div className="d-flex justify-content-end">
              <button
                onClick={() => {
                  setshowupdate(false);
                }}
                className=" btn-close "
              ></button>
            </div>
            {picture && (
              <div className="row">
                {picture ? (
                  <div className=" col-12 d-flex flex-column">
                    <img
                      src={picture.picturePreview}
                      ref={fileInputRef}
                      alt="Preview"
                      className="previewimage2"
                    />
                  </div>
                ) : (
                  ""
                )}
                <div className="d-flex justify-content-between">
                  <button
                    onClick={onImagecancel}
                    className="btn btn-danger text-white flex-end"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    name="upload"
                    className="btn btn-success text-white"
                    onClick={setUpdateImageAction}
                  >
                    Update
                  </button>
                </div>
              </div>
            )}

            {!picture && (
              <div>
                <label className=" custom-file-upload rounded">
                  Choose Photo
                  <input
                    className="filebtn"
                    ref={fileInputRef}
                    type="file"
                    onChange={uploadPicture}
                    accept="image/*"
                  />
                </label>
              </div>
            )}
          </form>
        </div>
      )}
      {showupdate2 && (
        <div className="updateprofile border rounded">
          <form className="createform p-3">
            <div className="mb-3 col-4 d-flex align-items-center">
              <label for="exampleInputTitle1" class="blogs create-form-label">
                Name&nbsp;:&nbsp;
              </label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => {
                  setusername(e.target.value);
                }}
                class="form-control"
                id="exampleInputTitle1"
                placeholder="Title"
                aria-describedby="TitleHelp"
              />
            </div>
            <div className="mb-3 col-4 d-flex align-items-center">
              <label for="exampleInputTitle1" class="blogs create-form-label">
                Email&nbsp;:&nbsp;
              </label>
              <input
                type="email"
                name="email"
                value={Email}
                onChange={(e) => {
                  setemail(e.target.value);
                }}
                class="form-control"
                id="exampleInputTitle1"
                placeholder="email"
                aria-describedby="TitleHelp"
              />
            </div>
            <div className="mb-3 col-4 d-flex align-items-center">
              <label for="exampleInputTitle1" class="blogs create-form-label">
                Mobileno&nbsp;:&nbsp;
              </label>
              <input
                type="number"
                name="mobileno"
                value={Mobileno}
                onChange={(e) => {
                  setmobileno(e.target.value);
                }}
                class="form-control"
                id="exampleInputTitle1"
                placeholder="Mobileno"
                aria-describedby="TitleHelp"
                minLength={10}
                maxLength={10}
              />
            </div>

            <div className="d-flex gap-3 align-items-center">
              <button
                type="submit"
                name="upload"
                onClick={handleSubmit}
                class="btn btn-success text-white"
                id="createsubmit"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setshowupdate2(false);
                  setError("");
                }}
                className="btn "
              >
                Cancel
              </button>
            </div>
            {error ? (
              <>
                <p>{error}</p>
              </>
            ) : (
              ""
            )}
          </form>
        </div>
      )}
      {showchangepass && (
        <form className="col-6" onSubmit={handlepasswordSubmit}>
          <hr />
          <h4>Change Password</h4>
          <div>
            <label className="form-label mt-2" htmlFor="password">
              Current Password:
            </label>
            <input
              className="form-control"
              type="password"
              id="currentpassword"
              value={currentpassword}
              onChange={(e) => setcurrentpassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="form-label mt-2" htmlFor="password">
              New Password:
            </label>
            <input
              className="form-control"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="form-label mt-2" htmlFor="confirmPassword">
              Confirm Password:
            </label>
            <input
              className="form-control"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {message && <p>{message}</p>}
          <button className="btn corporate-gifts p-2 my-2" type="submit">
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
