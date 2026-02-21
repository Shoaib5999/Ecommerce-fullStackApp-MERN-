import React from "react";
import Layout from "./../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";

const Dashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout title={"Dashboard - Ecommerce App"}>
      <div className="container-flui m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <h3>{auth?.user?.name}</h3>
              <h3>{auth?.user?.email}</h3>
              <p className="text-muted mb-0">
                {auth?.user?.deliveryAddresses?.length > 0
                  ? (() => {
                      const list = auth.user.deliveryAddresses;
                      const d = list.find((a) => a.isDefault) || list[0];
                      return [d.street, d.city, d.state, d.zip, d.country].filter(Boolean).join(", ");
                    })()
                  : auth?.user?.address || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
