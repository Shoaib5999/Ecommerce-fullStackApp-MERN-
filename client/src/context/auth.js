import { useState, useEffect, useContext, createContext } from "react";

//first step is to createContext()
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  //this AuthProvider should alwaays be on top level
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });
  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);
      setAuth({
        ...auth,
        user: parseData.user,
        token: parseData.token,
      });
    }
  }, [auth]);
  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

//creating a custom hook
const useAuth = () => useContext(AuthContext);
export { useAuth, AuthProvider };

//now we can use it and can access from any where to its children
