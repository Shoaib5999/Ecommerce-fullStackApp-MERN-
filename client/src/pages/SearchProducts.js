import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { FaStar } from "react-icons/fa";
import { useCart } from "../context/cart";
import { toast } from "react-toastify";
import { fetchSearchResults } from "../store/slices/searchSlice";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useWishlist } from "../context/wishlist";
import { addToCart } from "../utils/cartUtils";
import { toggleWishlist } from "../utils/wishlistUtils";

const SearchProducts = () => {
  const { keyword } = useParams();
  const dispatch = useDispatch();
  const { results, loading, error } = useSelector((state) => state.search);
  const [cart, setCart] = useCart();
  const [wishlist, setWishlist] = useWishlist();

  useEffect(() => {
    if (keyword) {
      dispatch(fetchSearchResults(decodeURIComponent(keyword)));
    }
  }, [keyword, dispatch]);

  return (
    <Layout>
      <h1 className="mb-4">
        {keyword ? `Products for: ${decodeURIComponent(keyword)}` : "Search"}
      </h1>
      {error && (
        <p className="text-danger">{error}</p>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="row g-3 g-md-4">
          {results?.length === 0 ? (
            <div className="col-12">
              <p className="text-muted">No products found.</p>
            </div>
          ) : (
            results?.map((p) => (
              <div className="col-6 col-md-4 col-lg-3" key={p._id}>
                <div className="card h-100 shadow-sm">
                  <div
                    className="position-relative bg-light"
                    style={{ aspectRatio: "1", overflow: "hidden" }}
                  >
                    <img
                      src={p.photoUrl}
                      className="card-img-top w-100 h-100"
                      alt={p.name}
                      style={{ objectFit: "cover" }}
                    />
                    <div className="position-absolute top-0 start-0 end-0 d-flex justify-content-between align-items-start p-2">
                      {p.featured ? (
                        <span className="badge bg-warning text-dark">
                          <FaStar color="green" size={10} className="me-1" />
                          Featured
                        </span>
                      ) : (
                        <span />
                      )}
                      <button
                        type="button"
                        className="btn btn-light btn-sm rounded-circle p-1 shadow-sm"
                        aria-label="Wishlist"
                        onClick={() => {
                          const updated = toggleWishlist(wishlist, p);
                          setWishlist(updated);
                          localStorage.setItem("wishlist", JSON.stringify(updated));
                          const exists = wishlist.some((item) => item._id === p._id);
                          toast.info(
                            exists ? "Removed from wishlist" : "Saved to wishlist"
                          );
                        }}
                      >
                        {wishlist.some((item) => item._id === p._id) ? (
                          <AiFillHeart className="text-danger" />
                        ) : (
                          <AiOutlineHeart />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title text-truncate" title={p.name}>
                      {p.name}
                    </h6>
                    <p className="card-text small text-muted flex-grow-1">
                      {p.description?.substring(0, 50)}
                      {(p.description?.length ?? 0) > 50 ? "…" : ""}
                    </p>
                    <p className="card-text fw-bold mb-2">${p.price}</p>
                    <div className="d-flex gap-2 flex-wrap">
                      <Link
                        to={`/${p.slug}`}
                        className="btn btn-primary btn-sm flex-grow-1"
                      >
                        Details
                      </Link>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => {
                          const updated = addToCart(cart, p, 1);
                          setCart(updated);
                          localStorage.setItem("cart", JSON.stringify(updated));
                          toast.success("Added To Cart");
                        }}
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </Layout>
  );
};

export default SearchProducts;
