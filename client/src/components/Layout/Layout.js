import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
function Layout({ children, title, description, keywords, author }) {
  return (
    <>
      <Header />
      <Helmet>
        <meta charSet="utf-8" />

        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />

        <title>{title}</title>
      </Helmet>
      <main style={{ minHeight: "70vh" }}>{children}</main>
      <Footer />
    </>
  );
}

export default Layout;
