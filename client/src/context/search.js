import { useState, useContext, createContext } from "react";

// Step 1: Create a context
const SearchContext = createContext("demo");

// Step 2: Create a provider component
const SearchProvider = ({ children }) => {
  // Step 2a: Define state for the search
  const [search, setSearch] = useState();

  // Step 2b: Provide the state through the context
  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

// Step 3: Create a custom hook to consume the context
const useSearch = () => {
  // Step 3a: Consume the context using useContext
  const { search, setSearch } = useContext(SearchContext);

  // Step 3b: Return the state and updater function
  return { search, setSearch };
};

// Export the custom hook and provider
export { useSearch, SearchProvider };
