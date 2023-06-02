import Layout from "./components/Layout/Layout";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./components/Layout/Policy";
import PageNotFount from "./components/Layout/PageNotFount";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home></Home>} />
        <Route path="/register" element={<Register></Register>} />
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
