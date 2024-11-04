import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
// import Link from 'antd/es/typography/Link'
import { Link } from "react-router-dom";
import Spinner from "../../components/Layout/Spinner";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [Loading, setLoading] = useState(false);

  //function to fetch all products
  const getAllProducts = async (req, res) => {
    try {
      const { data } = await axios.get("/api/v1/products/get-products");
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };
  const toggleFeaturedProduct = async (id) => {
    try {
      const toggle = await axios.post(
        `/api/v1/products/featured-product/${id}`
      );
      toast.success(toggle.data.message);
      setLoading(false);
    } catch (error) {
      console.log("Error in toggle feature product");
      toast.error("Error in toggle feature product");
      setLoading(false);
    }
  };
  // getAllProducts()
  useEffect(() => {
    getAllProducts();
  }, [Loading]);
  return (
    <Layout>
      <div>
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Products Here</h1>
            {Loading ? (
              <div class="d-flex justify-content-center align-items-center vh-100">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-wrap">
                {products?.map((p, i) => (
                  <div
                    className="card"
                    style={{ width: "18rem", margin: "10px" }}
                  >
                    <Link
                      key={p._id}
                      to={`/dashboard/admin/product/${p.slug}`}
                      className="product-link"
                    >
                      <img
                        // src={`/api/v1/products/get-product-photo/${p._id}`}
                        src={p.photoUrl}
                        className="card-img-top"
                        alt={p.name}
                      />
                    </Link>
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">{p.description}</p>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="toggleSwitch"
                          checked={p.featured}
                          onClick={() => {
                            setLoading(true);
                            toggleFeaturedProduct(p.productId);
                          }}
                        />
                        <label className="form-check-label" for="toggleSwitch">
                          Featured Product
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Product;
