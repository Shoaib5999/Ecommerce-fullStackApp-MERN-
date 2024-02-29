import { Layout } from "antd";
import React from "react";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <h1 className="text-center bg-light p-2">
            {`Hello ${auth?.name && auth?.user?.name}`}
            heyther
          </h1>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
