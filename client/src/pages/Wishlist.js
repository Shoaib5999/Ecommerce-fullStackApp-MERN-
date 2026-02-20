import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { useWishlist } from "../context/wishlist";
import { useCart } from "../context/cart";
import { addToCart, cartSubtotal } from "../utils/cartUtils";
import { removeFromWishlist } from "../utils/wishlistUtils";
import { toast } from "react-toastify";

const Wishlist = () => {
  const [wishlist, setWishlist] = useWishlist();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  const handleMoveToCart = (product) => {
    const updatedCart = addToCart(cart, product, 1);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    const updatedWishlist = removeFromWishlist(wishlist, product._id);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    toast.success("Moved to cart");
  };

  const handleRemove = (id) => {
    const updatedWishlist = removeFromWishlist(wishlist, id);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  return (
    <Layout title="Wishlist">
      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div>
            <h1 className="mb-1">Wishlist</h1>
            <p className="text-muted mb-0">
              Save items for later and move them to your cart when you’re ready.
            </p>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
            <Link to="/" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>

        {wishlist?.length === 0 ? (
          <div className="surface p-4 text-center">
            <h3 className="mb-2">Your wishlist is empty</h3>
            <p className="text-muted mb-3">
              Explore the catalog and tap the heart icon to save favorites.
            </p>
            <Link to="/" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="row g-3">
            <div className="col-12 col-lg-8">
              <div className="d-flex flex-column gap-3">
                {wishlist.map((item) => (
                  <div key={item._id} className="surface p-3 cart-item">
                    <div className="d-flex flex-column flex-md-row gap-3 align-items-center">
                      <img
                        src={item.photoUrl}
                        alt={item.name}
                        className="cart-item-image"
                      />
                      <div className="flex-grow-1">
                        <h5 className="mb-1">{item.name}</h5>
                        <p className="text-muted mb-2">
                          {item.description?.substring(0, 80)}
                        </p>
                        <div className="d-flex flex-wrap gap-2 align-items-center">
                          <span className="price-chip">${item.price}</span>
                          <Link
                            to={`/${item.slug}`}
                            className="btn btn-outline-primary btn-sm"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                      <div className="d-flex flex-column gap-2">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => handleMoveToCart(item)}
                        >
                          Move to Cart
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => handleRemove(item._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="surface p-4">
                <h4 className="mb-3">Cart Preview</h4>
                <p className="text-muted mb-2">
                  You already have {cart?.length || 0} items in your cart.
                </p>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Current subtotal</span>
                  <span className="fw-semibold">
                    ${cartSubtotal(cart).toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary w-100 mt-3"
                  onClick={() => navigate("/dashboard/shopping/cart")}
                >
                  Go To Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;
