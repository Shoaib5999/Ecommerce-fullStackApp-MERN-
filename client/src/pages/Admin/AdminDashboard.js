import React from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";

const AdminDashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>{" "}
          <div className="col-md-9 p-3 w-75">
            <div className="card p-3">
              <h1>Admin Name :{auth?.user?.name}</h1>{" "}
              <h1>Admin Email :{auth?.user?.email}</h1>
              <h1>Admin Contact :{auth?.user?.phone}</h1>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
