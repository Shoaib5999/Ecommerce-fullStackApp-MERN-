import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const [p, setP] = useState();
  const { slug } = useParams();

  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/products/get-product/${slug}`
      );
      setP(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, [slug]); // Call getSingleProduct whenever slug changes

  return (
    <>
      <div>
        {p ? (
          <div
            className="container d-flex"
            // style={{ width: "18rem", margin: "10px" }}
            key={p._id}
          >
            <img
              src={`${process.env.REACT_APP_API}/api/v1/products/get-product-photo/${p._id}`}
              className="card-img-top"
              alt={p.name}
              style={{ marginLeft: "0px", width: "48rem", margin: "1em" }}
            />
            <div>
              <h1>Product Details</h1>
              <div className="mt-5">
                <h5 className="">Name :{p.name}</h5>
                <p className="">Description :{p.description}</p>
                <p className=""> price :${p.price}</p>
                {/* <p className=""> Category :{p.category.name}</p> */}
                <div className="d-flex">
                  <button href="#" className="btn btn-secondary">
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
