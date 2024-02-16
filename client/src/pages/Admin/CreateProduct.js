import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios"
const CreateProduct = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [categoryList,setCategories] =useState();
  const dropdownItems = [
    "Apple",
    "Banana",
    "Cherry",
    "Grapes",
    "Lemon",
    "Orange",
  ];

  // Products states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(null);
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(null);
  const [shipping, setShipping] = useState(false);
  const [photo, setPhoto] = useState(null);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setSearchTerm(""); // Clear search term after selecting an item
    setCategory(item); // Update the category state
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name || !description || !price || !category || !quantity) {
      alert("Please fill in all required fields.");
      return;
    }
    // Log or perform any other action with the form data
    console.log({
      name,
      description,
      price,
      category,
      quantity,
      shipping,
      photo,
    });
    setName("");
  setDescription("");
  setPrice(null);
  setCategory("");
  setQuantity(null);
  setShipping(false);
  setPhoto(null);
  setSelectedItem(null);
  };

  const filteredItems = dropdownItems.filter((item) =>
    item.toLowerCase().includes(searchTerm)
  );
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      );
      // console.log(data.category[0])
      if (data?.success) {
        console.log(data.categoryz)
        setCategories(data.category);
        // console.log("category is",data.category)
      }
    } catch (error) {
      console.log(error);
      // toast.error("Unable To Fetch Categories");
    }
  };
  useEffect(()=>{
getAllCategories()
console.log("category list")
console.log(categoryList)
  },[])

  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Create product</h1>
            <form onSubmit={handleFormSubmit} className="w-75">
              <div>
                <div className="dropdown">
                  <button
                    className="btn border dropdown-toggle w-75"
                    type="button "
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {selectedItem ? selectedItem : "Select Categories"}
                  </button>
                  <ul
                    className="dropdown-menu w-75"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <li>
                      <div className="dropdown-search">
                        <input
                          type="text"
                          className="form-control search-input"
                          placeholder="Search..."
                          aria-label="Filter"
                          value={searchTerm}
                          onChange={handleSearchChange}
                        />
                      </div>
                    </li>
                    {filteredItems.map((item) => (
                      <li key={item} onClick={() => handleItemClick(item)}>
                        <a className="dropdown-item" href="#">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-3 col-md-12 mt-3">
                  <label
                    htmlFor="photo"
                    className="btn btn-outline-secondary w-75"
                  >
                    {photo ? photo.name : "Upload Photo"}
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files[0])}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
                <div className="mb-3 w-75">
                  {photo && (
                    <div className="text-center">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt="product photo"
                        height={"200px"}
                        className="img img-responsive"
                      />
                    </div>
                  )}
                </div>
                <div className="mb-3 w-75">
                  <input
                    type="text"
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="Write Product Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-3 w-75">
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    placeholder="Write Description Of Product"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <input
                  type="number"
                  className="form-control mb-3 w-75"
                  id="exampleFormControlInput1"
                  placeholder="Write A Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <input
                  type="number"
                  className="form-control mb-3 w-75"
                  id="exampleFormControlInput1"
                  placeholder="Write A Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <div className="mb-3 w-75" >
                  <label htmlFor="yesNoSelect" className="form-label">
                    Select Shipping:
                  </label>
                  <select
                    className="form-select"
                    id="yesNoSelect"
                    name="yesNoSelect"
                    value={shipping ? "yes" : "no"}
                    onChange={(e) => setShipping(e.target.value === "yes")}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <button className="btn btn-primary" type="submit">
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
