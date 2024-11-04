import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/auth";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useCart } from "../context/cart";
import { FaStar } from "react-icons/fa";

function Home() {
  const [auth, setAuth] = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [selectedCat, setSelectedCat] = useState(true);
  const [page, setPage] = useState(1);
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
      // const { data } = await axios.get(
      // );
      const { data } = await axios.post(
        `/api/v1/products/get-products-per-page/${page}`,
        { checked }
      );

      products
        ? setProducts([...products, ...data.products])
        : setProducts(data.products);
      // setProducts(data.products);
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
    let all = [...checked];
    if (value) {
      all.push(`${id}`);
    } else {
      all = all.filter((item) => item !== id);
    }
    setChecked(all);
  };

  useEffect(() => {
    getAllProducts();
    getAllCategories();
    // getFilteredProducts()
  }, []);

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
              {console.log("Products data are", products)}
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
            <div className="mt-3 p-2">
              <button
                className="btn btn-danger"
                onClick={() => setPage(page + 1)}
              >
                Next Page
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Home;
