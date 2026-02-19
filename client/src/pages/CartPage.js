import React, { useState, useEffect } from "react";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const Navigate = useNavigate();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");

  const removeItem = (id) => {
    try {
      const myCart = [...cart];
      const index = myCart.findIndex((item) => item._id === id);
      if (index === -1) return;
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {}
  };

  const totalPrice = () => {
    let Total = 0;
    cart?.forEach((item) => {
      Total = Total + item.price;
    });
    return Total;
  };

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get(`/api/v1/products/braintree/token`);
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);

  //handle payments
  const handlePayment = () => {};
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
            <div className="col-md-8">
              {cart?.map((p) => (
                <div className="row m-2 mb-3 card flex-row">
                  <div className="col-md-4">
                    {/* <img
                      src={`/api/v1/products/get-product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                      width={"100px"}
                      // height={"100px"}
                    /> */}
                    <img
                      src={p.photoUrl}
                      className="card-img-top"
                      alt="Network error"
                      width={"100px"}
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
            <div className="col-md-4">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr></hr>
              <h4>Total:${totalPrice()}</h4>
              <div className="">
                {auth?.user ? (
                  <>
                    <h2>Current Address Is </h2>
                    <h3>{auth.user.address}</h3>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => {
                        Navigate("/dashboard/user/profile");
                      }}
                    >
                      Change The Address
                    </button>
                    <div className="mt-2">
                      <DropIn
                        options={{
                          authorization: clientToken,
                          paypal: {
                            flow: "vault",
                          },
                        }}
                        onInstance={(instance) => setInstance(instance)}
                      />
                      <button
                        className="btn btn-primary"
                        onClick={handlePayment}
                        disabled={!instance || !auth?.user?.address}
                      >
                        Make Payment
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3>Please Login</h3>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => {
                        Navigate("/login", {
                          state: "/dashboard/shopping/cart",
                        });
                      }}
                    >
                      Login To Continue Shopping
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
