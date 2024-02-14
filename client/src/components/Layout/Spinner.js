import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Spinner = () => {
  const [count, setCount] = useState(5);
  const navigate = useNavigate();
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => prevValue - 1);
    }, 1000);
    count === 0 && navigate("/login");

    return () => {
      clearInterval(interval); //this clearInterval function will make that interval again to its previous value
    };
  }, [count]);

  return (
    <>
      <div
        className="d-flex flex-column justify-content-center align-items-center "
        style={{ height: "100vh" }}
      >
        <h1 className="Text-center">redirecting to you in {count} second </h1>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </>
  );
};

export default Spinner;
