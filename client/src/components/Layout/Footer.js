import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <div className=" text-light footer">
        <h4 className="text-center">All Right Reserved &copy; Shoaibyt</h4>
        <p className="footer-links">
          <Link className="footer-link" to={"/about"}>
            ABOUT |{" "}
          </Link>
          <Link className="footer-link" to={"/contact"}>
            CONTACT |{" "}
          </Link>
          <Link className="footer-link" to={"/policy"}>
            POLICY
          </Link>
        </p>
      </div>
    </>
  );
}

export default Footer;
