import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "./Navigation";
import Mobilenav from "./Mobilenav";

const HomeHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;
      if (scroll > 500) {
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
    console.log(isHome,window.location.pathname,"homepage")
  }, []);

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
          <form>
            <div className="form-search">
              <input
                id="search"
                className="input-text"
                // value=""
                placeholder="Search entire store here ..."
                type="search"
              />
              <button className="search-btn" type="button">
                <i className="ion-ios-search"></i>
              </button>
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

export default HomeHeader;
