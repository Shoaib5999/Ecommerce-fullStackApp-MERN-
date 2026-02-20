import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useWishlist } from "../context/wishlist";
import { addToCart } from "../utils/cartUtils";
import { toggleWishlist } from "../utils/wishlistUtils";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const [cart, setCart] = useCart();
  const [wishlist, setWishlist] = useWishlist();

  const pageTitle = useMemo(() => {
    if (!p?.name) return "Product Details";
    return `${p.name} | Ecommerce App`;
  }, [p?.name]);

  const getSingleProduct = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/v1/products/get-product/${slug}`);
      setP(data?.products ?? null);
    } catch (error) {
      console.log(error);
      toast.error("Unable to load product details");
      setP(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSingleProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    setQty(1);
  }, [p?._id]);

  const handleAddToCart = () => {
    if (!p?._id) return;
    const updated = addToCart(cart, p, qty);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    toast.success("Added to cart");
  };

  const handleToggleWishlist = () => {
    if (!p?._id) return;
    const updated = toggleWishlist(wishlist, p);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    const exists = wishlist.some((item) => item._id === p._id);
    toast.info(exists ? "Removed from wishlist" : "Saved to wishlist");
  };

  const handleGoBack = () => navigate(-1);

  useEffect(() => {
    const existing = localStorage.getItem("recentlyViewed");
    if (existing) {
      try {
        setRecentlyViewed(JSON.parse(existing) ?? []);
      } catch (err) {
        setRecentlyViewed([]);
      }
    }
  }, []);

  useEffect(() => {
    if (!p?._id) return;
    const entry = {
      _id: p._id,
      name: p.name,
      price: p.price,
      photoUrl: p.photoUrl,
      slug: p.slug,
    };
    const existingRaw = localStorage.getItem("recentlyViewed");
    let existing = [];
    if (existingRaw) {
      try {
        existing = JSON.parse(existingRaw) ?? [];
      } catch (err) {
        existing = [];
      }
    }
    const updated = [
      entry,
      ...existing.filter((item) => item._id !== p._id),
    ].slice(0, 6);
    localStorage.setItem("recentlyViewed", JSON.stringify(updated));
    setRecentlyViewed(updated);
  }, [p?._id]);

  return (
    <Layout
      title={pageTitle}
      description={p?.description ?? "Product details page"}
      keywords={
        p?.name ? `${p.name}, ecommerce, product` : "ecommerce, product"
      }
      author="Ecommerce App"
    >
      <div className="container py-4">
        {/* Top actions */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleGoBack}
          >
            Back
          </button>

          <div className="text-muted" style={{ fontSize: "0.95rem" }}>
            {loading
              ? "Loading product..."
              : p?.name
                ? "Product details"
                : "Not found"}
          </div>
        </div>

        {/* Loading / Empty states */}
        {loading && (
          <div className="surface p-4">
            <h3 className="mb-2">Loading...</h3>
            <p className="text-muted mb-0">Fetching product information.</p>
          </div>
        )}

        {!loading && !p && (
          <div className="surface p-4">
            <h3 className="mb-2">Product not found</h3>
            <p className="text-muted mb-3">
              The product you’re looking for doesn’t exist or may have been
              removed.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/")}
            >
              Go to Home
            </button>
          </div>
        )}

        {/* Product details */}
        {!loading && p && (
          <div className="row g-4 align-items-start">
            {/* Image */}
            <div className="col-12 col-lg-6">
              <div className="surface p-3">
                <div
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    background: "rgba(241, 243, 249, 1)",
                  }}
                >
                  <img
                    src={p.photoUrl}
                    alt={p?.name ?? "Product image"}
                    style={{
                      width: "100%",
                      aspectRatio: "4 / 3",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="col-12 col-lg-6">
              <div className="surface p-4">
                <div className="d-flex flex-column gap-2">
                  <div>
                    <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                      Product
                    </div>
                    <h1
                      className="mt-1 mb-0"
                      style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
                    >
                      {p.name}
                    </h1>
                  </div>

                  {p.featured ? (
                    <div>
                      <span className="badge bg-warning text-dark px-3 py-2">
                        Featured
                      </span>
                    </div>
                  ) : null}

                  <div
                    className="mt-2"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.75rem",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        padding: "0.6rem 0.9rem",
                        borderRadius: "999px",
                        border: "1px solid rgba(226, 232, 240, 1)",
                        background: "rgba(255, 255, 255, 0.7)",
                        fontWeight: 700,
                      }}
                    >
                      ${p.price}
                    </div>

                    {p.quantity !== undefined && p.quantity !== null ? (
                      <div className="text-muted" style={{ fontWeight: 500 }}>
                        {p.quantity > 0
                          ? `${p.quantity} in stock`
                          : "Out of stock"}
                      </div>
                    ) : null}
                    <div className="text-muted" style={{ fontWeight: 500 }}>
                      Delivery in 3-5 business days
                    </div>
                  </div>

                  <hr className="my-3" />

                  <div>
                    <h5 className="mb-2">Description</h5>
                    <p
                      className="text-muted mb-0"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {p.description}
                    </p>
                  </div>

                  <div className="mt-4 d-flex flex-wrap gap-3 align-items-center">
                    <div className="qty-stepper">
                      <button
                        type="button"
                        className="btn btn-light btn-icon"
                        onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                      >
                        -
                      </button>
                      <span className="qty-value">{qty}</span>
                      <button
                        type="button"
                        className="btn btn-light btn-icon"
                        onClick={() =>
                          setQty((prev) => {
                            const maxQty =
                              p?.quantity && p.quantity > 0 ? p.quantity : 99;
                            return Math.min(maxQty, prev + 1);
                          })
                        }
                        disabled={p?.quantity === 0}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleAddToCart}
                      disabled={p.quantity === 0}
                      style={{ minWidth: 180 }}
                    >
                      Add To Cart
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate("/dashboard/shopping/cart")}
                      style={{ minWidth: 180 }}
                    >
                      Go To Cart
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={handleToggleWishlist}
                      style={{ minWidth: 180 }}
                    >
                      {wishlist.some((item) => item._id === p._id) ? (
                        <>
                          <AiFillHeart className="me-2 text-danger" />
                          Saved
                        </>
                      ) : (
                        <>
                          <AiOutlineHeart className="me-2" />
                          Save for Later
                        </>
                      )}
                    </button>
                  </div>

                  <div
                    className="mt-3 text-muted"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Tip: Use the filters on the home page to find similar items.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && recentlyViewed.length > 1 && (
          <div className="mt-5">
            <h3 className="mb-3">Recently Viewed</h3>
            <div className="recent-grid">
              {recentlyViewed
                .filter((item) => item.slug !== slug)
                .slice(0, 4)
                .map((item) => (
                  <div key={item._id} className="surface p-3 recent-card">
                    <img
                      src={item.photoUrl}
                      alt={item.name}
                      className="recent-image"
                    />
                    <div className="mt-2">
                      <h6 className="mb-1">{item.name}</h6>
                      <div className="text-muted">${item.price}</div>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm mt-2 w-100"
                        onClick={() => navigate(`/${item.slug}`)}
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetails;
