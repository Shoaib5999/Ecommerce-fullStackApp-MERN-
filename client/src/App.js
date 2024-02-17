import Layout from "./components/Layout/Layout";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./components/Layout/Policy";
import PageNotFount from "./components/Layout/PageNotFount";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/Layout/Route/PrivateRoute";
import AdminRoute from "./components/Layout/Route/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard"
import CreateCatagory from "./pages/Admin/CreateCatagory";
import CreateProduct from "./pages/Admin/CreateProduct";
import Users from "./pages/Admin/Users";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import Product from "./pages/Admin/Product";
import UpdateProduct from "./pages/Admin/UpdateProduct";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home></Home>} />
        <Route path="/register" element={<Register></Register>} />
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="user" element={<Dashboard />} />
          <Route path="user/orders" element={<Orders />} />
          <Route path="user/profile" element={<Profile />} />
        </Route>
        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard/>} />
          <Route path="admin/create-category" element= {<CreateCatagory/>}/>
          <Route path="admin/create-product" element= {<CreateProduct/>}/>
          <Route path="admin/product/:p_id" element= {<UpdateProduct/>}/>
          <Route path="admin/products" element= {<Product/>}/>
          <Route path="admin/users" element= {<Users/>}/>
        </Route>
        <Route path="/login" element={<Login></Login>} />
        <Route path="/about" element={<About></About>} />
        <Route path="/contact" element={<Contact></Contact>} />
        <Route path="/policy" element={<Policy></Policy>} />
        <Route path="/*" element={<PageNotFount></PageNotFount>} />
      </Routes>
    </>
  );
}

export default App;
