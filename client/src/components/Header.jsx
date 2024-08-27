import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import Mobilenav from "./Mobilenav";
import { axiosInstance } from "../config";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;
      if (scroll > 150) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.classList.toggle("fix");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.classList.remove("fix");
  };

  const opensearch = () => {
    setIsSearchOpen(true);
  };
  const closesearch = () => {
    setIsSearchOpen(false);
  };

  const [isHomePage, setIsHomePage] = useState(false);

  useEffect(() => {
    // Check if the current path is the homepage
    const isHome = window.location.pathname === "/";
    setIsHomePage(isHome);
  }, []);

  // search bar
  const navigate = useNavigate("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    try {
      // navigate(`/search/${searchQuery}`);
      setIsSearchOpen(false);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  return (
    <header className={`fl-header ${isSticky ? "is-sticky" : ""}`}>
      {/* <!-- haeader bottom Start --> */}
      <div
        className={`header-bottom-area ${
          isSticky ? "" : `${isHomePage ? "transparent-header" : ""}`
        } `}
      >
        <Navigation toggleMenu={toggleMenu} opensearch={opensearch} />
      </div>
      {/* <!-- haeader bottom End --> */}

      {/* <!-- main-search start --> */}
      <div className={`main-search-active ${isSearchOpen ? "inside" : ""}`}>
        <div className="sidebar-search-icon">
          <button onClick={closesearch} className="search-close">
            <span className="ion-android-close"></span>
          </button>
        </div>
        <div className="sidebar-search-input">
          <form onSubmit={handleSearch}>
            <div className="form-search">
              <input
                id="search"
                className="input-text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search entire store here ..."
                type="search"
              />
              <Link to={`/search/${searchQuery}`} onClick={handleSearch}>
                {" "}
                <button className="search-btn" type="submit">
                  <i className="ion-ios-search"></i>
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
      {/* <!-- main-search start --> */}

      {/* <!-- off-canvas menu start --> */}
      <Mobilenav isMenuOpen={isMenuOpen} closeMenu={closeMenu} />
      {/* <!-- off-canvas menu end --> */}
    </header>
  );
};

export default Header;
