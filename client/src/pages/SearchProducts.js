import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { FaStar } from "react-icons/fa";
import { useCart } from "../context/cart";
import { toast } from "react-toastify";
import { fetchSearchResults } from "../store/slices/searchSlice";

const SearchProducts = () => {
  const { keyword } = useParams();
  const dispatch = useDispatch();
  const { results, loading, error } = useSelector((state) => state.search);
  const [cart, setCart] = useCart();

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
        <div className="d-flex flex-wrap">
          {results?.length === 0 ? (
            <p className="text-muted">No products found.</p>
          ) : (
            results?.map((p) => (
              <div
                className="card"
                style={{ width: "18rem", margin: "10px" }}
                key={p._id}
              >
                <img
                  src={p.photoUrl}
                  className="card-img-top"
                  alt="product"
                />
                {p.featured ? (
                  <div className="d-flex justify-content-end align-items-center p-2">
                    <span className="badge bg-warning text-dark d-flex align-items-center px-2 py-1">
                      <FaStar color="green" size={12} className="me-1" />
                      Featured
                    </span>
                  </div>
                ) : null}
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">
                    {p.description?.substring(0, 30)}...
                  </p>
                  <p className="card-text">${p.price}</p>
                  <div className="d-flex">
                    <Link to={`/${p.slug}`} className="btn btn-primary ms-2">
                      Details
                    </Link>
                    <button
                      type="button"
                      className="btn btn-secondary ms-2"
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        toast.success("Added To Cart");
                      }}
                    >
                      Add To Cart
                    </button>
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
