import React, { useState, useEffect, useMemo } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useCart } from "../context/cart";
import { FaStar } from "react-icons/fa";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useWishlist } from "../context/wishlist";
import { addToCart } from "../utils/cartUtils";
import { toggleWishlist } from "../utils/wishlistUtils";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("featured");
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [pagination, setPagination] = useState({
    hasNextPage: false,
    hasPreviousPage: false,
    totalCount: 0,
    page: 1,
  });
  const [cart, setCart] = useCart();
  const [wishlist, setWishlist] = useWishlist();
  //get All Categories
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const { data } = await axios.post(
          `/api/v1/products/get-products-per-page/${page}`,
          { checked },
        );
        setProducts(data?.products ?? []);
        setPagination({
          hasNextPage: data?.hasNextPage ?? false,
          hasPreviousPage: data?.hasPreviousPage ?? false,
          totalCount: data?.totalCount ?? 0,
          page: data?.page ?? 1,
        });
      } catch (error) {
        console.log(error);
        toast.error("Something Went Wrong");
      }
    };

    getAllProducts();
  }, [checked, page]);

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(`/api/v1/category/get-category`);

      if (data?.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable To Fetch Categories");
    }
  };

  // NOTE: getAllProducts is inlined inside the effect to avoid exhaustive-deps issues.
  // const getFilteredProducts = async()=>{
  //   const {data} = await axios.post(`/api/v1/products/get-filter-products-per-page/${page}`,{checked})
  // setProducts(data.products)

  // console.log(data)
  // }
  const handleFilter = (value, id) => {
    const idStr = String(id);
    setPage(1);
    setChecked((prev) => {
      if (value) {
        return prev.includes(idStr) ? prev : [...prev, idStr];
      }
      return prev.filter((item) => item !== idStr);
    });
  };

  useEffect(() => {
    getAllCategories();
    // getFilteredProducts()
  }, []);

  useEffect(() => {
    if (window?.matchMedia?.("(max-width: 767.98px)")?.matches) {
      setCategoryOpen(false);
    }
  }, []);

  const sortedProducts = useMemo(() => {
    const list = [...(products ?? [])];
    if (sortBy === "price-low") {
      return list.sort((a, b) => (a.price || 0) - (b.price || 0));
    }
    if (sortBy === "price-high") {
      return list.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    if (sortBy === "name") {
      return list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }
    if (sortBy === "featured") {
      return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return list;
  }, [products, sortBy]);

  const handleAddToCart = (product) => {
    const updated = addToCart(cart, product, 1);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    toast.success("Added To Cart");
  };

  const handleToggleWishlist = (product) => {
    const updated = toggleWishlist(wishlist, product);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    const exists = wishlist.some((item) => item._id === product._id);
    toast.info(exists ? "Removed from wishlist" : "Saved to wishlist");
  };

  return (
    <>
      <Layout title={"All Products - Best Offers"}>
        <div className="row">
          <div className="col-md-3">
            <div className="category-header mt-4">
              <h4 className="text-center mb-0">Filter By Category</h4>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm category-toggle d-md-none"
                aria-expanded={categoryOpen}
                aria-controls="categoryFilters"
                onClick={() => setCategoryOpen((open) => !open)}
              >
                Categories
                <span
                  className={`category-chevron ${
                    categoryOpen ? "is-open" : ""
                  }`}
                />
              </button>
            </div>
            <div
              id="categoryFilters"
              className={`category-list ${categoryOpen ? "is-open" : "is-closed"}`}
            >
              {categories.map((c, i) => (
                <div className="form-check" key={i}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id={`categoryCheckbox_${c._id}`}
                    onChange={(e) => handleFilter(e.target.checked, c._id)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`categoryCheckbox_${c._id}`}
                  >
                    {c.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-9">
            <h1 className="text-center mt-4">All Products</h1>
            <div className="catalog-toolbar surface p-3 mt-3 mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
              <div className="text-muted">
                Showing <strong>{sortedProducts.length}</strong> items
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted">Sort by</span>
                <select
                  className="form-select form-select-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ minWidth: 180 }}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>

            <div className="d-flex flex-wrap">
              {sortedProducts?.map((p, i) => (
                <div
                  className="card"
                  style={{ width: "18rem", margin: "10px" }}
                  key={p._id}
                >
                  <img
                    src={p.photoUrl}
                    className="card-img-top"
                    alt="network error"
                  />
                  <div className="d-flex justify-content-between align-items-center p-2">
                    {p.featured ? (
                      <span className="badge bg-warning text-dark d-flex align-items-center px-2 py-1">
                        <FaStar color="green" size={12} className="me-1" />
                        Featured
                      </span>
                    ) : (
                      <span />
                    )}
                    <button
                      type="button"
                      className="btn btn-light btn-icon"
                      onClick={() => handleToggleWishlist(p)}
                      aria-label="Save to wishlist"
                    >
                      {wishlist.some((item) => item._id === p._id) ? (
                        <AiFillHeart className="text-danger" />
                      ) : (
                        <AiOutlineHeart />
                      )}
                    </button>
                  </div>

                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">
                      {p.description?.substring(0, 30)}...
                    </p>
                    <p className="card-text"> ${p.price}</p>

                    <div className="d-flex ">
                      <Link to={`${p.slug}`}>
                        <button href="#" className="btn btn-primary ms-4">
                          Details
                        </button>
                      </Link>
                      <button
                        href="#"
                        className="btn btn-secondary ms-4"
                        onClick={() => handleAddToCart(p)}
                      >
                        Add To Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {products?.length === 0 && (
              <p className="text-center text-muted mt-4">No products found.</p>
            )}
            <div className="d-flex justify-content-center align-items-center gap-2 mt-3 p-2">
              <button
                className="btn btn-primary"
                disabled={!pagination.hasPreviousPage}
                onClick={() =>
                  setPage(
                    pagination.hasPreviousPage
                      ? pagination.page - 1
                      : pagination.page,
                  )
                }
              >
                Previous
              </button>
              <span className="align-self-center px-2">
                Page {pagination.page}
              </span>
              <button
                className="btn btn-primary"
                disabled={!pagination.hasNextPage}
                onClick={() =>
                  setPage(
                    pagination.hasNextPage
                      ? pagination.page + 1
                      : pagination.page,
                  )
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Home;
