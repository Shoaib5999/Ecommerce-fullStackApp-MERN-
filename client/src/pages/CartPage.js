import React, { useState, useEffect, useMemo } from "react";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import { useWishlist } from "../context/wishlist";
import { addToWishlist } from "../utils/wishlistUtils";
import { cartSubtotal, updateCartQty, cartCount } from "../utils/cartUtils";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [wishlist, setWishlist] = useWishlist();
  const Navigate = useNavigate();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(null);

  const removeItem = (id) => {
    try {
      const updated = updateCartQty(cart, id, 0);
      setCart(updated);
      localStorage.setItem("cart", JSON.stringify(updated));
    } catch (error) {}
  };

  const updateQty = (id, qty) => {
    const updated = updateCartQty(cart, id, qty);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleMoveToWishlist = (product) => {
    const updatedWishlist = addToWishlist(wishlist, product);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    removeItem(product._id);
  };

  const subtotal = useMemo(() => cartSubtotal(cart), [cart]);
  const shipping = subtotal >= 100 ? 0 : subtotal === 0 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const discount = promoApplied === "SAVE10" ? subtotal * 0.1 : 0;
  const total = subtotal + shipping + tax - discount;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

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

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === "SAVE10") {
      setPromoApplied(code);
    } else {
      setPromoApplied("INVALID");
    }
  };
  return (
    <Layout>
      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div>
            <h1 className="mb-1">
              {auth?.token ? `Hello ${auth?.user?.name}` : "Your Cart"}
            </h1>
            <p className="text-muted mb-0">
              {cart?.length > 0
                ? `You have ${cartCount(cart)} items in your cart.`
                : "Your cart is empty."}
            </p>
          </div>
          <Link to="/" className="btn btn-secondary">
            Continue Shopping
          </Link>
        </div>

        {cart?.length === 0 ? (
          <div className="surface p-4 text-center">
            <h3 className="mb-2">Your cart is empty</h3>
            <p className="text-muted mb-3">
              Browse the catalog and add items to get started.
            </p>
            <Link to="/" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div className="d-flex flex-column gap-3">
                {cart?.map((p) => (
                  <div key={p._id} className="surface p-3 cart-item">
                    <div className="d-flex flex-column flex-md-row gap-3 align-items-center">
                      <img
                        src={p.photoUrl}
                        className="cart-item-image"
                        alt={p.name}
                      />
                      <div className="flex-grow-1">
                        <h5 className="mb-1">{p.name}</h5>
                        <p className="text-muted mb-2">
                          {p.description?.substring(0, 80)}
                        </p>
                        <div className="d-flex flex-wrap gap-2 align-items-center">
                          <span className="price-chip">
                            {formatCurrency(p.price)}
                          </span>
                          <Link to={`/${p.slug}`} className="btn btn-light">
                            View Details
                          </Link>
                        </div>
                      </div>
                      <div className="d-flex flex-column gap-2 align-items-center">
                        <div className="qty-stepper">
                          <button
                            type="button"
                            className="btn btn-light btn-icon"
                            onClick={() => updateQty(p._id, (p.qty || 1) - 1)}
                          >
                            -
                          </button>
                          <span className="qty-value">{p.qty || 1}</span>
                          <button
                            type="button"
                            className="btn btn-light btn-icon"
                            onClick={() => updateQty(p._id, (p.qty || 1) + 1)}
                          >
                            +
                          </button>
                        </div>
                        <div className="text-muted">
                          {formatCurrency((p.price || 0) * (p.qty || 1))}
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleMoveToWishlist(p)}
                          >
                            Save for Later
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => removeItem(p._id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="surface p-4 sticky-summary">
                <h2 className="mb-2">Order Summary</h2>
                <p className="text-muted mb-3">
                  {cartCount(cart)} items · {formatCurrency(subtotal)} subtotal
                </p>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{formatCurrency(shipping)}</span>
                </div>
                <div className="summary-row">
                  <span>Estimated tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                {discount > 0 && (
                  <div className="summary-row text-success">
                    <span>Promo discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <hr />
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                <div className="promo-box mt-3">
                  <label className="form-label">Promo code</label>
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="SAVE10"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleApplyPromo}
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied === "INVALID" && (
                    <div className="text-danger mt-2">
                      Promo code not recognized.
                    </div>
                  )}
                  {promoApplied === "SAVE10" && (
                    <div className="text-success mt-2">
                      Promo applied! 10% off.
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  {auth?.user ? (
                    <>
                      <div className="address-box">
                        <h5 className="mb-1">Delivery Address</h5>
                        <p className="text-muted mb-2">{auth.user.address}</p>
                        <button
                          type="button"
                          className="btn btn-outline-primary w-100"
                          onClick={() => {
                            Navigate("/dashboard/user/profile");
                          }}
                        >
                          Change Address
                        </button>
                      </div>
                      <div className="mt-3">
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
                          className="btn btn-primary w-100"
                          onClick={handlePayment}
                          disabled={!instance || !auth?.user?.address}
                        >
                          Make Payment
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="surface p-3 text-center">
                      <h5>Please Login</h5>
                      <p className="text-muted">
                        Login to continue checkout.
                      </p>
                      <button
                        type="button"
                        className="btn btn-warning w-100"
                        onClick={() => {
                          Navigate("/login", {
                            state: "/dashboard/shopping/cart",
                          });
                        }}
                      >
                        Login To Continue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
