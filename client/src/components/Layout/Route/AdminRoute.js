import { useState, useEffect } from "react";
import { useAuth } from "../../../context/auth";
import { Outlet } from "react-router-dom"; //it gives us functionality of nested routing
import axios from "axios";
import Spinner from "../Spinner";

const AdminRoute = () => {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();

  useEffect(() => {

    const authcheck = async () => {

      const res = await axios.get(

        `${process.env.REACT_APP_API}/api/v1/auth/admin-auth`,
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );

      if (res.data.ok) {
        setOk(true);
      } else {
        setOk(false);
      }

    };
    if (auth?.token) authcheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner />;
};

export default AdminRoute;
