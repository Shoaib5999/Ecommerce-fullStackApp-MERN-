import React, { useState } from "react";
import { useSearch } from "../../context/search";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();
  let { search, setSearch } = useSearch();
  const [value, setValue] = useState();

  const handleSubmit = (e) => {
    // e.preventDefault();
    navigate(`./search/${search}`);
  };

  return (
    <form className="input-group w-25" onSubmit={handleSubmit}>
      <input
        type="search"
        className="form-control"
        placeholder="Search"
        aria-label="Search"
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        type="submit"
        className="btn btn-primary"
        onClick={() => setSearch(value)}
      >
        Search
      </button>
    </form>
  );
};

export default Search;
