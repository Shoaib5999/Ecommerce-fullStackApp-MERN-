import React from "react";
import { NavLink, Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useAuth } from "../../context/auth";
function Header() {
  const [auth, setAuth] = useAuth();
  const handleLogout = () => {
    localStorage.removeItem("auth"); // here we are doing both things removing auth from localstorage and setting auth because if we only remove from localstorage we need to refresh the page
    setAuth({
      ...auth,
      user: "",
      token: "",
    });
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <Link to="/" className="navbar-brand">
              <AiOutlineShoppingCart className="navbar-logo" /> Ecommerce App
            </Link>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/" className="nav-link " aria-current="page">
                  Home
                </NavLink>
              </li>
              {!auth.user ? (
                <>
                  <li className="nav-item">
                    <NavLink to="/register" className="nav-link">
                      REGISTER
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link">
                      LOGIN
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink
                      onClick={handleLogout}
                      to="/login"
                      className="nav-link"
                    >
                      LOGOUT
                    </NavLink>
                  </li>
                </>
              )}
              <li className="nav-item">
                <NavLink to="/cart" className="nav-link">
                  CART(0)
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
