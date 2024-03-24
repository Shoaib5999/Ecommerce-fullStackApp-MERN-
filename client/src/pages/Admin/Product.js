import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
// import Link from 'antd/es/typography/Link'
import { Link } from "react-router-dom";

const Product = () => {
  const [products, setProducts] = useState([]);
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
  // getAllProducts()
  useEffect(() => {
    getAllProducts();
  }, []);
  return (
    <Layout>
      <div>
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Products Here</h1>
            <div className="d-flex flex-wrap">
              {products?.map((p, i) => (
                <Link
                  key={p._id}
                  to={`/dashboard/admin/product/${p._id}`}
                  className="product-link"
                >
                  <div
                    className="card"
                    style={{ width: "18rem", margin: "10px" }}
                  >
                    <img
                      src={`/api/v1/products/get-product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">{p.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Product;
