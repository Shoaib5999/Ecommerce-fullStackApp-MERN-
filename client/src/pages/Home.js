import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/auth";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useCart } from "../context/cart";
import { FaStar } from "react-icons/fa";
import { useDispatch } from "react-redux";

function Home() {
  const [auth, setAuth] = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [selectedCat, setSelectedCat] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    hasNextPage: false,
    hasPreviousPage: false,
    totalCount: 0,
    page: 1,
  });
  const [cart, setCart] = useCart();
  //get All Categories
  useEffect(() => {
    // if (checked.length !== 0) {
    //   setSelectedCat(false);
    // }
    getAllProducts();
    // getFilteredProducts()
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

  const getAllProducts = async () => {
    try {
      const { data } = await axios.post(
        `/api/v1/products/get-products-per-page/${page}`,
        { checked }
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
    getAllProducts();
    getAllCategories();
    // getFilteredProducts()
  }, []);
  const dispatch = useDispatch();
  return (
    <>
      <Layout title={"All Products - Best Offers"}>
        <div className="row">
          <div className="col-md-3">
            <h4 className="text-center mt-4">Filter By Category</h4>
            <div className="">
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

            <div className="d-flex flex-wrap">
              {products?.map((p, i) => (
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
                  {p.featured ? (
                    <div className="d-flex justify-content-end align-items-center p-2">
                      <span className="badge bg-warning text-dark d-flex align-items-center px-2 py-1">
                        <FaStar color="green" size={12} className="me-1" />
                        Featured
                      </span>
                    </div>
                  ) : (
                    <></>
                  )}

                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">
                      {p.description.substring(0, 30)}...
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
              ))}
            </div>
            {products?.length === 0 && (
              <p className="text-center text-muted mt-4">No products found.</p>
            )}
              <div className="d-flex justify-content-center align-items-center gap-2 mt-3 p-2">
                <button
                  className="btn btn-primary"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => setPage(pagination.hasPreviousPage ? pagination.page - 1 : pagination.page)}
                >
                  Previous
                </button>
                <span className="align-self-center px-2">Page {pagination.page}</span>
                <button
                  className="btn btn-primary"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage(pagination.hasNextPage ? pagination.page + 1 : pagination.page)}
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
