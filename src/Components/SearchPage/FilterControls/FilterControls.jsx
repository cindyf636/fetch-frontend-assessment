import React from "react";
import { MdFilterAlt, MdClear } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import Slider from "rc-slider";
import "./FilterControls.css";

function FilterControls({
  isLoadingBreeds,
  breeds,
  selectedBreed,
  setSelectedBreed,
  sortValue,
  setSortValue,
  pageSize,
  setPageSize,
  zipCode,
  setZipCode,
  ageRangeInput,
  setAgeRangeInput,
  applyFilters,
  clearFilters,
  generateMatch,
}) {
  return (
    <div className="controls">
      {isLoadingBreeds ? (
        <p>Loading breeds...</p>
      ) : (
        <select
          value={selectedBreed}
          onChange={(e) => setSelectedBreed(e.target.value)}
          className="select"
        >
          <option value="">Select Breed</option>
          {breeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>
      )}
      <select
        value={sortValue}
        onChange={(e) => setSortValue(e.target.value)}
        className="select"
      >
        <option>Sort by Name</option>
        <option value="name:asc">Name A → Z</option>
        <option value="name:desc">Name Z → A</option>
      </select>

      <div className="slider-container">
        <label>
          Age: {ageRangeInput[0]} – {ageRangeInput[1]}
        </label>
        <Slider
          range
          min={0}
          max={20}
          value={ageRangeInput}
          onChange={setAgeRangeInput}
          allowCross={false}
        />
      </div>

      <select
        value={pageSize}
        onChange={(e) => setPageSize(parseInt(e.target.value))}
        className="select"
      >
        <option>Number of Dogs</option>
        <option value={5}>5 per page</option>
        <option value={10}>10 per page</option>
        <option value={15}>15 per page</option>
        <option value={20}>20 per page</option>
      </select>

      <input
        type="text"
        placeholder="Zip Code"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
        className="input"
      />

      <button onClick={applyFilters} className="button">
        <MdFilterAlt className="icon" />
        Apply Filters
      </button>
      <button onClick={generateMatch} className="match-button">
        <CiHeart className="icon" />
        Generate Match
      </button>
      <button onClick={clearFilters} className="button clear-button">
        <MdClear className="icon" />
        Clear Filters
      </button>
    </div>
  );
}

export default FilterControls;
