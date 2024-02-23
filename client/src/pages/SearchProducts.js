import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout/Layout";
import { useSearch } from "../context/search";
const SearchProducts = () => {
  const [products, setProducts] = useState();
  const [loading, setLoading] = useState(true);
  let { search, setSearch } = useSearch();
  // let search = "demo";
  useEffect(() => {
    getProducts();
    console.log(search);
  }, []);

  const getProducts = async (req, res) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/products/search/${search}`
      );
      // console.log(data);
      setLoading(false);
      setProducts(data?.results);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      <Layout>
        <h1>Products for :{search}</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="d-flex flex-wrap">
            {/* {console.log(products)} */}
            {products?.map((p, i) => (
              <div
                className="card"
                style={{ width: "18rem", margin: "10px" }}
                key={p._id}
              >
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/products/get-product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">
                    {p.description.substring(0, 30)}...
                  </p>
                  <p className="card-text"> ${p.price}</p>

                  <div className="d-flex ">
                    <button href="#" className="btn btn-primary ms-4">
                      Details
                    </button>
                    <button href="#" className="btn btn-secondary ms-4">
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Layout>
    </>
  );
};

export default SearchProducts;
