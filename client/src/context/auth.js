import { useState, useEffect, useContext, createContext } from "react";
//first step is to createContext()
const AuthContext = createContext(); //this always returns a object and works as a componet

const AuthProvider = ({ children }) => {
  //this AuthProvider should alwaays be on top level
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });
  //default axios
  // axios.defaults.headers.common["Authorization"] = auth?.token;
  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data); //this function JSON.parse(data) changes js string to json object

      setAuth({
        ...auth,
        user: parseData.user,
        token: parseData.token,
      });
    }
    //eslint-disable-next-line
  }, []);
  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
      {/* <Child></Child>    if this was the case value would pass to this CHild component here same thing is happening with above */}
    </AuthContext.Provider>
  );
};

//creating a custom hook
const useAuth = () => useContext(AuthContext);
export { useAuth, AuthProvider }; //AuthProvider has it's only one ues and in the very parent Component like index.js we should wrap App.js there with AuthProvider

//now we can use it and can access from any where to its children
