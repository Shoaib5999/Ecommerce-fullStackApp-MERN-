import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setKeyword, fetchSearchResults, clearSearch } from "../../store/slices/searchSlice";
import { Dropdown } from "antd";

const Search = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { keyword, results: suggestions } = useSelector((state) => state.search);
  const [value, setValue] = useState(keyword);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value?.trim() ?? "";
    if (!trimmed) return;
    dispatch(setKeyword(trimmed));
    dispatch(fetchSearchResults(trimmed));
    navigate(`/search/${encodeURIComponent(trimmed)}`);
  };

  const handleSearch = (e) => {
    setValue(e.target.value);
      dispatch(fetchSearchResults(e.target.value));
      if(e.target.value.length===0){
        dispatch(clearSearch());
      }
  };

  const handleSuggestionClick = ({ key }) => {
    const selected = suggestions?.find((s) => s._id === key);
    if (!selected?.name) return;
    const trimmed = selected.name.trim();
    setValue(trimmed);
    dispatch(setKeyword(trimmed));
    dispatch(fetchSearchResults(trimmed));
    navigate(`/search/${encodeURIComponent(trimmed)}`);
  };

  return (
    <form className="input-group w-25" onSubmit={handleSubmit}>
      <Dropdown
        menu={{
          items: suggestions?.map((result) => ({
            label: result.name,
            key: result._id,
          })) ?? [],
          onClick: handleSuggestionClick,
        }}
        className="max-h-[100px] overflow-y-auto"
      >
        <input
        type="search"
        className="form-control"
        placeholder="Search"
        aria-label="Search"
        value={value ?? ""}
        onChange={(e) => handleSearch(e)}

      />
      </Dropdown>
      
      <button type="submit" className="btn btn-primary">
        Search
      </button>
    </form>
  );
};

export default Search;
