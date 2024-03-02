import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import axios from "axios";
const Profile = () => {
  //context
  const [auth] = useAuth();
  //state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  //get user data
  useEffect(() => {
    // Check if auth is defined before accessing its properties
    if (auth && auth.user) {
      const { email, name, phone, address, password } = auth.user;
      setName(name);
      setPhone(phone);
      setEmail(email);
      setAddress(address);
      setPassword(password);
    }
  }, [auth?.user]);

  const handleSubmit = async (e) => {
    e.preventDefault(); //to prevent refresh after submitting the form we use this function

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/profile`,
        {
          name,
          email,
          password,
          phone,
          address,
        },
        {
          headers: {
            Authorization: `${auth.token}`,
          },
        }
      );
      console.log(res.data);
      if (res && res.data.success) {
        //res.data.success is from the backend we are seing if it is succesfully reached the backend
        toast.success(res.data && res.data.message);
        // toast.success("Sucessfully Register now please login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <Layout title={"Your Property"}>
      <div className="container-fluid p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="form-container ">
              <form onSubmit={handleSubmit}>
                <h4 className="title">USER PROFILE</h4>
                <div className="mb-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                    id="exampleInputName"
                    placeholder="Enter Your Name"
                    required
                    autoFocus
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email" //this acts like a validation
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Enter Your Email "
                    required
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="Enter Your Password"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Enter Your Phone"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Enter Your Address"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  UPDATE
                </button>
              </form>
            </div>{" "}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
