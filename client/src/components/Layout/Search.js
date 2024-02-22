import React, { useState } from "react";
import { useSearch } from "../../context/search";

const Search = () => {
  // const [search, setSearch] = useState("");
  let search = useSearch();
  return (
    <div className="input-group w-25">
      <input
        type="search"
        className="form-control"
        placeholder="Search"
        aria-label="Search"
        onChange={(e) => search(e.target.value)}
      />
      <button className="btn btn-primary">Search</button>
    </div>
  );
};

export default Search;
