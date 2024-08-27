import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import CharmForm from "../components/CharmForm";
import { axiosInstance } from "../../config";
import Swal from "sweetalert2";
import PenModel from "../components/PenModel";

const PenModelPage = () => {
  // ====================dashboard================
  const navigate = useNavigate();

  // add mew member ==============================
  const [isOpen, setIsOpen] = useState(false);
  const uploadDivWidth = isOpen ? "calc(100% - 300px)" : "calc(100% - 80px)";

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const back = () => {
    navigate(-1);
  };

  const [showaddcharm, setshowaddcharm] = useState(false);

  const token = localStorage.getItem("admin");
  const [charms, setCharms] = useState([]);

  useEffect(() => {
    fetchCharms();
  }, []);

  const fetchCharms = () => {
    axiosInstance
      .get("model/getmodel", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCharms(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [charmid, setcharmid] = useState("");

  const handleDeleteCharm = (charmId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(`model/delete/${charmId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            Swal.fire("Deleted!", "Model has been deleted.", "success");
            fetchCharms();
          })
          .catch((error) => {
            console.error(error);
            Swal.fire("Error", error.response.data.error, "error");
          });
      }
    });
  };

  return (
    <>
      <div
        className={`dashboard my-custom-class ${isOpen ? "open" : "closed"} ${
          isOpen ? "" : "dashboard-closed"
        }`}
      >
        {/* ========= sidebar ============ */}
        <Navigation />
        <div className="dashtoggle toggle-button" onClick={toggleSidebar}>
          {isOpen ? (
            <div className="row">
              <div className="logo1 col-2">
                <i id="times" className="fa-solid fa-times"></i>
              </div>
            </div>
          ) : (
            <i id="bars" className="bars fa-solid fa-bars col-2"></i>
          )}
        </div>
      </div>
      {/* ========= right pane =========*/}
      <div
        className="main"
        style={{ width: uploadDivWidth, right: "0px" }}
        id="upload-div"
      >
        {/* =========topbar ========= */}
        <div className="topbar">
          <h4>Welcome Admin</h4>
          <NavLink className="panelbtns btn" onClick={back}>
            <i className="fa-solid fa-angle-left"></i>&nbsp;back
          </NavLink>
        </div>
        {/*========== only admin =========== */}
        <div className="middle mt-5 container">
          <div className="charmpage">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="user-h1">
                <i class="fa-solid fa-pen"></i> Pen Models
              </h1>
              <div>
                {showaddcharm ? (
                  <button
                    onClick={() => {
                      setshowaddcharm(false);
                    }}
                    className="btn"
                  >
                    Models
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setshowaddcharm(true);
                    }}
                    className="btn"
                  >
                    + Add new Model
                  </button>
                )}
              </div>
            </div>
            <hr />
            {showaddcharm ? (
              <div className="container">
                <PenModel charmId={charmid} fetchCharms={fetchCharms} />
              </div>
            ) : (
              <div className="categories-container container">
                <div className="row justify-content-center">
                  {charms.map((charm) => (
                    <div
                      className="col-3 d-flex justify-content-between align-items-center border rounded m-2"
                    >
                      <h6 className="mb-0 p-2">
                        {charm.name}
                      </h6>
                      {/* Render additional category details here */}
                      <div className=" d-flex gap-1">
                        <button
                          onClick={() => {
                            setcharmid(charm._id);
                            setshowaddcharm(true);
                          }}
                          className="btn"
                        >
                          {" "}
                          <i class="fa-solid fa-pen"></i>
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteCharm(charm._id);
                          }}
                          className="btn"
                        >
                          {" "}
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* ============================ bottom ================ */}
        <div className="bottom">
          <div className="bottombar">
            <h6>
              <i className="fa-regular fa-copyright"></i> powered by{" "}
              <a
                className="intoggle-powered text-decoration-none"
                href="https://www.intoggle.com/"
              >
                Intoggle
              </a>
            </h6>
          </div>
        </div>
      </div>
    </>
  );
};

export default PenModelPage;
