import React, { useState, useEffect, useMemo } from "react";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useWishlist } from "../context/wishlist";
import { addToWishlist } from "../utils/wishlistUtils";
import { cartSubtotal, updateCartQty, cartCount } from "../utils/cartUtils";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [wishlist, setWishlist] = useWishlist();
  const Navigate = useNavigate();

  // Razorpay (sample) state
  const [rzpReady, setRzpReady] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

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

  // Load Razorpay checkout script (safe to replace key later)
  useEffect(() => {
    const scriptId = "razorpay-checkout-js";

    const existing = document.getElementById(scriptId);
    if (existing) {
      setRzpReady(true);
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => setRzpReady(true);
    script.onerror = () => setRzpReady(false);

    document.body.appendChild(script);
  }, []);

  //handle payments (Razorpay sample)
  const handlePayment = async () => {
    try {
      if (!auth?.token) return;

      if (!rzpReady || !window.Razorpay) {
        console.log("Razorpay SDK not ready");
        return;
      }

      setPayLoading(true);

      // 1) Create order on server (server calculates amount)
      const { data } = await axios.post(
        "/api/v1/products/razorpay/create-order",
        {
          cart,
          promoCode: promoApplied === "SAVE10" ? promoApplied : promoCode,
        },
        {
          headers: {
            Authorization: auth?.token,
          },
        },
      );

      if (!data?.success || !data?.order?.id) {
        console.log("Failed to create Razorpay order", data);
        setPayLoading(false);
        return;
      }

      const { keyId, order } = data;

      // 2) Open Razorpay Checkout
      const options = {
        key: keyId, // replace later via env on server; returned here for convenience
        amount: order.amount, // in paise
        currency: order.currency || "INR",
        name: "Ecommerce App",
        description: "Order payment",
        order_id: order.id,
        prefill: {
          name: auth?.user?.name || "",
          email: auth?.user?.email || "",
          contact: auth?.user?.phone || "",
        },
        notes: {
          promoCode: promoApplied === "SAVE10" ? "SAVE10" : undefined,
        },
        theme: {
          color: "#0d6efd",
        },
        handler: async function (response) {
          try {
            // 3) Verify payment signature on server + create DB order
            const verifyRes = await axios.post(
              "/api/v1/products/razorpay/verify-payment",
              {
                cart,
                promoCode: promoApplied === "SAVE10" ? promoApplied : promoCode,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: auth?.token,
                },
              },
            );

            if (verifyRes?.data?.success) {
              // Clear cart on success
              setCart([]);
              localStorage.removeItem("cart");
              Navigate("/dashboard/user/orders");
            } else {
              console.log("Payment verification failed", verifyRes?.data);
            }
          } catch (err) {
            console.log("Error verifying payment", err);
          } finally {
            setPayLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setPayLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
      setPayLoading(false);
    }
  };

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
              <div className="sticky-shopping">
                <Link to="/" className="btn btn-secondary ">
                  Continue Shopping
                </Link>
              </div>
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
                        <p className="text-muted mb-2">
                          {(() => {
                            const list = auth.user.deliveryAddresses || [];
                            const defaultOrFirst =
                              list.find((a) => a.isDefault) || list[0];
                            if (defaultOrFirst) {
                              return [
                                defaultOrFirst.street,
                                defaultOrFirst.city,
                                defaultOrFirst.state,
                                defaultOrFirst.zip,
                                defaultOrFirst.country,
                              ]
                                .filter(Boolean)
                                .join(", ");
                            }
                            return (
                              auth.user.address ||
                              "Add an address in your profile"
                            );
                          })()}
                        </p>
                        <button
                          type="button"
                          className="btn btn-outline-primary w-100"
                          onClick={() => Navigate("/dashboard/user/profile")}
                        >
                          Change Address
                        </button>
                      </div>
                      <div className="mt-3">
                        <div className="p-3 border rounded bg-light">
                          <h6 className="mb-2">Payment</h6>
                          <p className="text-muted mb-2">
                            Razorpay Checkout (sample). You will replace
                            `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` in env
                            later.
                          </p>
                          <button
                            className="btn btn-primary w-100"
                            onClick={handlePayment}
                            disabled={
                              payLoading ||
                              !rzpReady ||
                              !(
                                auth?.user?.address ||
                                (auth?.user?.deliveryAddresses &&
                                  auth.user.deliveryAddresses.length > 0)
                              )
                            }
                          >
                            {payLoading ? "Processing..." : "Pay with Razorpay"}
                          </button>
                          {!rzpReady && (
                            <p className="text-danger mt-2 mb-0">
                              Razorpay SDK failed to load. Check your network
                              and try again.
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="surface p-3 text-center">
                      <h5>Please Login</h5>
                      <p className="text-muted">Login to continue checkout.</p>
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
