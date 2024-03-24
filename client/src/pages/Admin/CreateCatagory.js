import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import CreateCategoryForm from "../../components/Form/CreateCategoryForm";

const CreateCatagory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [auth] = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/v1/category/create-category`,
        { name },
        {
          headers: {
            Authorization: `${auth.token}`,
          },
        }
      );
      if (data?.success) {
        toast.success("New Category Added Successfully");
        getAllCategories();
        setName("");
      } else {
        toast.error("Error While Adding Category");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error In Input Form");
    }
  };
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(`/api/v1/category/get-category`);
      // console.log(data.category[0])
      if (data?.success) {
        setCategories(data.category);
        // console.log("category is",data.category)
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable To Fetch Categories");
    }
  };

  const updateCategory = async () => {
    try {
      setShowForm(!showForm);
      <CreateCatagory></CreateCatagory>;
    } catch (error) {
      console.log(error);
      toast.error("Could Not Update");
    }
  };
  const deleteCategory = async (id) => {
    console.log("id is ", id);
    try {
      await axios.delete(`/api/v1/category/delete-category/${id}`, {
        headers: {
          Authorization: `${auth.token}`,
        },
      });
      toast.success("Deleted Sucessfully");
      getAllCategories();
    } catch (error) {
      console.log(error);
      toast.error("Could Not Delete");
    }
  };
  const handleInputChange = (e) => {
    // e.preventDefault()
    setInputValue(e.target.value);
    // console.log(inputValue)
  };
  const handleEditCategory = async (e, id) => {
    // let id=c._id
    console.log(id);

    e.preventDefault();
    try {
      await axios.put(
        `/api/v1/category/update-category/${id}`,
        {
          name: inputValue,
        },
        {
          headers: {
            Authorization: `${auth?.token}`,
          },
        }
      );

      toast.success("Category Edited Sucessfully");
      getAllCategories();
    } catch (error) {
      console.log(error);
      toast.error("Could Not Delete");
    }
  };
  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <Layout title={"Dashboard - Create Category"}>
      {/* {console.log(categories[0])} */}
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <div className="p-3">
              <CreateCategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div className="col-md-9">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Categories Names</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c, index) => (
                    <tr key={index}>
                      <td>{c.name}</td>

                      <td className="mx-1">
                        <button
                          type="button"
                          className="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target={`#exampleModal-${c._id}`}
                          data-bs-whatever="@mdo"
                        >
                          Edit
                        </button>

                        <div
                          className="modal fade"
                          id={`exampleModal-${c._id}`}
                          tabIndex="-1"
                          aria-labelledby={`exampleModalLabel-${c._id}`}
                          aria-hidden="true"
                        >
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h1
                                  className="modal-title fs-5"
                                  id="exampleModalLabel"
                                >
                                  Edit Category
                                </h1>
                                <button
                                  type="button"
                                  className="btn-close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                ></button>
                              </div>
                              <div className="modal-body">
                                <form
                                  onSubmit={(e) => {
                                    handleEditCategory(e, c._id);
                                  }}
                                >
                                  <div className="mb-3">
                                    <label
                                      htmlFor="message-text"
                                      className="col-form-label"
                                    >
                                      New Category:
                                    </label>
                                    <textarea
                                      className="form-control"
                                      id="message-text"
                                      value={inputValue}
                                      onChange={handleInputChange}
                                    ></textarea>
                                  </div>
                                  <button
                                    type="submit"
                                    className="btn btn-primary"
                                  >
                                    Send
                                  </button>
                                </form>
                              </div>
                              <div className="modal-footer"></div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => deleteCategory(c._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCatagory;
