import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
// import toast from "react-hot-toast";
// import { Toast } from "react-toastify/dist/components";
import { toast } from "react-toastify";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
const { Option } = Select;
//Cloudinary
// import { Cloudinary } from "@cloudinary/url-gen";
// import { auto } from "@cloudinary/url-gen/actions/resize";
// import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
// import { AdvancedImage } from "@cloudinary/react";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photos, setPhotos] = useState([]);
  const [auth] = useAuth();

  //get all category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`/api/v1/category/get-category`);
      // console.log(data.category[0])
      if (data?.success) {
        setCategories(data.category);
        // console.log("category is",data.category)
      }
    } catch (error) {
      console.log(error);
      toast.error("Something wwent wrong in getting catgeory");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  //create product function
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !description || !price || !quantity || !category || !photos.length) {
      toast.error("All fields including at least one photo are required");
      return;
    }
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      photos.forEach((file) => {
        productData.append("photos", file);
      });
      productData.append("category", category);
      if (shipping !== undefined && shipping !== "") {
        productData.append("shipping", shipping);
      }
      const { data } = await axios.post(
        `/api/v1/products/create-product`,
        productData,
        {
          headers: {
            Authorization: `${auth.token}`,
          },
        }
      );
      if (data?.success) {
        toast.success(data?.message || "Product Created Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Failed to create product");
      }
    } catch (error) {
      console.log(error);
      const msg =
        error.response?.data?.message || error.response?.data?.error || "Something went wrong";
      toast.error(msg);
    }
  };

  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Create Product</h1>
            <div className="m-1 w-75">
              <Select
                bordered={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setCategory(value);
                }}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photos.length ? `${photos.length} photo(s) selected` : "Upload Photos"}
                  <input
                    type="file"
                    name="photos"
                    accept="image/*"
                    multiple
                    onChange={(e) => setPhotos(Array.from(e.target.files || []))}
                    hidden
                  />
                </label>
              </div>
              <div className="mb-3">
                {!!photos.length && (
                  <div className="d-flex flex-wrap gap-2">
                    {photos.map((file, index) => (
                      <img
                        key={`${file.name}-${index}`}
                        src={URL.createObjectURL(file)}
                        alt="product_photo"
                        height={"120px"}
                        className="img img-responsive"
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="write a name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  type="text"
                  value={description}
                  placeholder="write a description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="write a Price"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="write a quantity"
                  className="form-control"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <Select
                  bordered={false}
                  placeholder="Select Shipping "
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => {
                    setShipping(value);
                  }}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>
              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleCreate}>
                  CREATE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
