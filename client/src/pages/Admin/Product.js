import React, { useState, useEffect, useMemo } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";
import { fetchProductsPerPage } from "../../store/slices/productSlice";
import { useDispatch, useSelector } from "react-redux";

const Product = () => {
  const dispatch = useDispatch();
  const {
    products,
    loading,
    error,
    hasNextPage,
    hasPreviousPage,
    page,
  } = useSelector((state) => state.product);
  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredProducts = useMemo(() => {
    if (!searchKeyword.trim()) return products ?? [];
    const term = searchKeyword.trim().toLowerCase();
    return (products ?? []).filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(term)) ||
        (p.description && p.description.toLowerCase().includes(term))
    );
  }, [products, searchKeyword]);

  const toggleFeaturedProduct = async (id) => {
    try {
      const { data } = await axios.post(
        `/api/v1/products/featured-product/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success(data?.message || "Updated");
      dispatch(fetchProductsPerPage(page));
    } catch (err) {
      console.error("Error toggling featured product", err);
      toast.error("Error updating featured product");
      dispatch(fetchProductsPerPage(page));
    }
  };

  useEffect(() => {
    dispatch(fetchProductsPerPage(1));
  }, [dispatch]);

  const goToPage = (newPage) => {
    if (newPage < 1) return;
    dispatch(fetchProductsPerPage(newPage));
  };

  return (
    <Layout>
      <div>
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Products</h1>

            <div className="mb-3">
              <input
                type="search"
                className="form-control"
                placeholder="Search by name or description..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                aria-label="Search products"
              />
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {loading ? (
              <div className="d-flex justify-content-center align-items-center vh-50 py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-wrap">
                {filteredProducts.length === 0 ? (
                  <p className="text-muted">
                    {searchKeyword.trim()
                      ? "No products match your search."
                      : "No products yet."}
                  </p>
                ) : (
                  filteredProducts.map((p) => (
                    <div
                      key={p._id}
                      className="card"
                      style={{ width: "18rem", margin: "10px" }}
                    >
                      <Link
                        to={`/dashboard/admin/product/${p.slug}`}
                        className="product-link"
                      >
                        <img
                          src={p.photoUrl}
                          className="card-img-top"
                          alt={p.name}
                        />
                      </Link>
                      <div className="card-body">
                        <h5 className="card-title">{p.name}</h5>
                        <p className="card-text text-truncate" style={{ maxWidth: "100%" }}>
                          {p.description}
                        </p>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`toggle-${p._id}`}
                            checked={!!p.featured}
                            onChange={() => toggleFeaturedProduct(p.productId)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`toggle-${p._id}`}
                          >
                            Featured
                          </label>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {!searchKeyword.trim() && (
              <div className="d-flex justify-content-center align-items-center gap-2 mt-3 p-2">
                <button
                  className="btn btn-primary"
                  disabled={!hasPreviousPage}
                  onClick={() => goToPage(page - 1)}
                >
                  Previous
                </button>
                <span className="align-self-center px-2">Page {page}</span>
                <button
                  className="btn btn-primary"
                  disabled={!hasNextPage}
                  onClick={() => goToPage(page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Product;
