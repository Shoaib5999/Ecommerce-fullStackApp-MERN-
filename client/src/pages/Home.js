import React ,{useState,useEffect} from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/auth";
import axios from "axios";
import {toast} from "react-toastify"
function Home() {
  const [auth, setAuth] = useAuth(); //this useAuth is a custom hook jisme hamlog kuch nhi kiye hai bas useContext hook me as an argument authContext pass kiye hai jo ki barabbar hai createContext ke
  const [products,setProducts]= useState([])
  const [categories, setCategories] = useState([]);
//get All Categories
const getAllCategories = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/api/v1/category/get-category`
    );
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
  const getAllProducts = async(req,res) =>{
    try{
        const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/products/get-products`)
        setProducts(data.products)
        
    }catch(error){
        console.log(error)
        toast.error("Something Went Wrong")
    }
}
useEffect(()=>{
  getAllProducts();
  getAllCategories();
},[])
  return (
    <>
      <Layout title={"ALl Products - Best Offers"}>
        <div className="row">
          <div className="col-md-3">
            <h4 className="text-center mt-4">Filter By Category</h4>
            <div className="">
      {categories.map((c,i)=>(
        <>
            <div className="form-check">
        <input className="form-check-input" type="checkbox" value="" id="exampleCheckbox"/>
    <label className="form-check-label" for="exampleCheckbox">
        {c.name}
    </label>
    </div>  
        </>
      ))}
      </div>
          </div>
          <div className="col-md-9">
            <h1 className="text-center mt-4">All Products</h1>
            <div className="d-flex flex-wrap">
  {products?.map((p, i) => (
    <div className="card" style={{ width: '18rem', margin: '10px' }}>
      <img src={`${process.env.REACT_APP_API}/api/v1/products/get-product-photo/${p._id}`} className="card-img-top" alt={p.name} />
      <div className="card-body">
        <h5 className="card-title">{p.name}</h5>
        <p className="card-text">{p.description}</p>
        <div className="d-flex ">
          <button href="#" className="btn btn-primary ms-4">Details</button>
          <button href="#" className="btn btn-secondary ms-4">Add To Cart</button>
        </div>
      </div>
    </div>
  ))}
</div>

          </div>
        </div>
      </Layout>
      ;
    </>
  );
}

export default Home;
