import React from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/auth";
function Home() {
  const [auth, setAuth] = useAuth(); //this useAuth is a custom hook jisme hamlog kuch nhi kiye hai bas useContext hook me as an argument authContext pass kiye hai jo ki barabbar hai createContext ke

  return (
    <>
      <Layout>
        Home<pre>{JSON.stringify(auth)}</pre>
      </Layout>
      ;
    </>
  );
}

export default Home;
