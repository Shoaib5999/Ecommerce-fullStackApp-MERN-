// import { Layout } from "antd";
// import Layout from "../components/Layout/Layout";
import React from "react";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const removeItem = (id) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item.id === id);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {}
  };
  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2">
              {`Hello ${auth?.token && auth?.user?.name}`}
            </h1>
            <h4 className="text-center">
              {cart?.length > 1
                ? `You Have ${cart.length} items in your cart ${
                    auth?.token ? "" : "please login to checkout"
                  }`
                : "Your Cart Is Empty"}
              {console.log(cart)}
            </h4>
          </div>
          <div className="row">
            <div className="col-md-9">
              {cart?.map((p) => (
                <div className="row m-2 mb-3 card flex-row">
                  <div className="col-md-4">
                    <img
                      src={`${process.env.REACT_APP_API}/api/v1/products/get-product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                      width={"100px"}
                      // height={"100px"}
                    />
                  </div>
                  <div className="col-md-8">
                    <p>{p.name}</p>
                    <p>{p.description.substring(0, 30)}</p>
                    <p>Price : ${p.price}</p>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-md-3">Checkout|Payment</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
