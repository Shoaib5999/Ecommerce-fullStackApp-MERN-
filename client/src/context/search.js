import { useState, useContext, createContext } from "react";
//first step is to createContext()
const SearchContext = createContext();

const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState("");

  return (
    <SearchContext.Provider value={[search, setSearch]}>
      {children}
      {/* <Child></Child>    if this was the case value would pass to this CHild component here same thing is happening with above */}
    </SearchContext.Provider>
  );
};

//creating a custom hook
const useSearch = () => useContext(SearchContext);
export { useSearch, SearchProvider }; //AuthProvider has it's only one ues and in the very parent Component like index.js we should wrap App.js there with AuthProvider

//now we can use it and can access from any where to its children
