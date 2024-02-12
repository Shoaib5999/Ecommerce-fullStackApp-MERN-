import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";

const CreateCatagory = () => {
const [categories,setCategories] = useState([])

const getAllCategories=async ()=>{
  try{
    const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`)
    // console.log(data.category[0])
    if(data?.success){
      setCategories(data.category)
      // console.log("category is",data.category)
    }
  }catch(error){
    console.log(error)
    toast.error("Unable To Fetch Categories")
  }
}

const updateCategory = async()=>{
  try{


  }catch(error){
    console.log(error)
    toast.error("Could Not Update")
  }
}
const deleteCategory = async(id)=>{
  console.log("id is ",id)
  try{
    await axios.delete(`${process.env.REACT_APP_API}/api/v1/category/delete-category/${id}`)
    toast.success("Deleted Sucessfully")
  }catch(error){
    console.log(error)
    toast.error("Could Not Delete")
  }
}

useEffect(()=>{
  getAllCategories()
},[])

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
          <div className="col-md-9">
          <table class="table">
  <thead>
    <tr>
      <th scope="col">Categories Names</th>
      <th scope="col">Actions</th>
    </tr>
  </thead>
  <tbody>
  {categories.map((c, index) => (
  <>
  
     <tr key={index}>
                  <td>{c.name}</td>
          
             <td className="mx-1"> <button type="button" className="btn btn-primary " onClick={updateCategory}>Edit</button></td><td>
                <button type="button" className="btn btn-danger" onClick={()=>deleteCategory(c._id)} >Delete</button></td>
                </tr>
                </>
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
