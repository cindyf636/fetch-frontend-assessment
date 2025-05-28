import React, { useEffect, useState } from "react";
import "./SearchPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "./NavBar/NavBar.js";
import "rc-slider/assets/index.css";
import { ClipLoader } from "react-spinners";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { CiStar } from "react-icons/ci";
import { RiEmotionSadLine } from "react-icons/ri";
import { FaStar } from "react-icons/fa";
import FilterControls from "./FilterControls/FilterControls";

/** Search page component, shows dogs that can be filtered by breed, name, and age */
function SearchPage() {
  // State variables
  const [breeds, setBreeds] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [paginationData, setPaginationData] = useState([]);
  const [isLoadingBreeds, setIsLoadingBreeds] = useState(false);
  const [isLoadingDogs, setIsLoadingDogs] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [sortValue, setSortValue] = useState("name:asc");
  const [pageSize, setPageSize] = useState(10);
  const [ageRangeInput, setAgeRangeInput] = useState([0, 20]); // Slider input
  const [appliedAgeRange, setAppliedAgeRange] = useState([0, 20]); // Applied filter
  const [selectedDog, setSelectedDog] = useState(null);
  const [showNoDogsModal, setShowNoDogsModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch breed options
  useEffect(() => {
    const fetchBreeds = async () => {
      setIsLoadingBreeds(true);
      try {
        const res = await fetch(
          "https://frontend-take-home-service.fetch.com/dogs/breeds",
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setBreeds(data);
      } catch (error) {
        console.error("Failed to fetch breeds", error);
      } finally {
        setIsLoadingBreeds(false);
      }
    };
    fetchBreeds();
  }, []);

  // Fetch dogs based on search params
  useEffect(() => {
    setIsLoadingDogs(true);
    const fetchDogs = async () => {
      try {
        const res = await fetch(
          `https://frontend-take-home-service.fetch.com/dogs/search${location.search}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const searchData = await res.json();
        setPaginationData(searchData);

        if (searchData.resultIds.length > 0) {
          const dogsRes = await fetch(
            "https://frontend-take-home-service.fetch.com/dogs",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify(searchData.resultIds),
            }
          );
          const dogsData = await dogsRes.json();
          setDogs(dogsData);
          setShowNoDogsModal(false); // Dogs found, hide modal
        } else {
          setDogs([]);
          setShowNoDogsModal(true); // No dogs found, show modal
        }
      } catch (error) {
        console.error("Failed to fetch dogs", error);
      } finally {
        setIsLoadingDogs(false);
      }
    };
    fetchDogs();
  }, [location.search]);

  // Initialize filters from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hasBreed = params.get("breeds");
    const hasSort = params.get("sort");
    const hasSize = params.get("size");
    const hasZip = params.get("zipCodes");
    const hasAgeRange = [params.get("ageMin"), params.get("ageMax")];

    setSelectedBreed(hasBreed || "");
    setSortValue(hasSort || "name:asc");
    setPageSize(parseInt(hasSize) || 10);
    setZipCode(hasZip || "");
    if (hasAgeRange[0] && hasAgeRange[1]) {
      const range = [parseInt(hasAgeRange[0]), parseInt(hasAgeRange[1])];
      setAgeRangeInput(range);
      setAppliedAgeRange(range);
    }
  }, [location.search]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (selectedBreed) params.set("breeds", selectedBreed);
    if (sortValue) params.set("sort", sortValue);
    if (pageSize) params.set("size", pageSize);
    if (zipCode) params.set("zipCodes", zipCode);
    if (ageRangeInput) {
      params.set("ageMin", ageRangeInput[0]);
      params.set("ageMax", ageRangeInput[1]);
    }
    setAppliedAgeRange(ageRangeInput);
    navigate(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedBreed("");
    setZipCode("");
    setSortValue("name:asc");
    setPageSize(10);
    setAgeRangeInput([0, 20]);
    setAppliedAgeRange([0, 20]);
    const params = new URLSearchParams();
    params.set("size", 10);
    navigate(`/search?${params.toString()}`);
  };

  const changePageHandler = (direction) => {
    const path = paginationData[direction];
    if (!path) return;

    const queryIndex = path.indexOf("?");
    const queryString = path.substring(queryIndex);

    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/search${queryString}`);
  };

  const toggleFavorite = (dogId) => {
    setFavorites((prev) =>
      prev.includes(dogId)
        ? prev.filter((id) => id !== dogId)
        : [...prev, dogId]
    );
  };

  const generateMatch = async () => {
    if (favorites.length === 0) {
      setShowModal(true);
      return;
    }

    try {
      const res = await fetch(
        "https://frontend-take-home-service.fetch.com/dogs/match",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(favorites),
        }
      );

      const data = await res.json();
      if (data.match) {
        navigate(`/match/${data.match}`);
      } else {
        setShowModal(true);
      }
    } catch (err) {
      console.error("Error matching dogs", err);
      setShowModal(true);
    }
  };
  const closeModal = () => setShowModal(false);
  const renderPagination = () => (
    <div className="pagination">
      <button
        onClick={() => changePageHandler("prev")}
        disabled={!paginationData?.prev}
        className="button"
      >
        <MdNavigateBefore className="icon" />
        Previous
      </button>
      <button
        onClick={() => changePageHandler("next")}
        disabled={!paginationData?.next}
        className="button"
      >
        Next
        <MdNavigateNext className="icon" />
      </button>
    </div>
  );

  return (
    <div className="container search-page-cursor">
      <NavBar />
      <FilterControls
        isLoadingBreeds={isLoadingBreeds}
        breeds={breeds}
        selectedBreed={selectedBreed}
        setSelectedBreed={setSelectedBreed}
        sortValue={sortValue}
        setSortValue={setSortValue}
        pageSize={pageSize}
        setPageSize={setPageSize}
        zipCode={zipCode}
        setZipCode={setZipCode}
        ageRangeInput={ageRangeInput}
        setAgeRangeInput={setAgeRangeInput}
        applyFilters={() => {
          const params = new URLSearchParams();
          if (selectedBreed) params.set("breeds", selectedBreed);
          if (sortValue) params.set("sort", sortValue);
          if (pageSize) params.set("size", pageSize);
          if (zipCode) params.set("zipCodes", zipCode);
          params.set("ageMin", ageRangeInput[0]);
          params.set("ageMax", ageRangeInput[1]);
          setAppliedAgeRange(ageRangeInput);
          navigate(`/search?${params.toString()}`);
        }}
        clearFilters={() => {
          setSelectedBreed("");
          setZipCode("");
          setSortValue("name:asc");
          setPageSize(10);
          setAgeRangeInput([0, 20]);
          navigate(`/search?size=10`);
        }}
        generateMatch={generateMatch}
      />

      {renderPagination()}
      {isLoadingDogs ? (
        <div className="loader-container">
          <ClipLoader
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="dog-list">
          {dogs
            .filter(
              (dog) =>
                dog.age >= appliedAgeRange[0] && dog.age <= appliedAgeRange[1]
            )
            .map((dog) => (
              <div
                key={dog.id}
                className="dog-card"
                onClick={() => setSelectedDog(dog)}
              >
                <img src={dog.img} alt={dog.name} className="dog-image" />
                <h3>{dog.name}</h3>
                <p>{dog.breed}</p>
                <p>Age: {dog.age}</p>
                <p>Zip Code: {dog.zip_code}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(dog.id);
                  }}
                  className={
                    favorites.includes(dog.id)
                      ? "fav-button-active"
                      : "fav-button"
                  }
                >
                  {favorites.includes(dog.id) ? (
                    <FaStar className="star-icon" />
                  ) : (
                    <CiStar className="star-icon" />
                  )}
                </button>
              </div>
            ))}
        </div>
      )}
      {renderPagination()}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>No Matches Found </h2>
            <RiEmotionSadLine />
            <p>Try favoriting more dogs and matching again!</p>
            <button onClick={closeModal} className="close-modal-button">
              OK
            </button>
          </div>
        </div>
      )}
      {showNoDogsModal && !isLoadingDogs && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>No Dogs Found</h2>
            <RiEmotionSadLine size={32} />
            <p>Try adjusting your filters and searching again.</p>
            <button
              onClick={() => setShowNoDogsModal(false)}
              className="close-modal-button"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {selectedDog && (
        <div className="modal-overlay" onClick={() => setSelectedDog(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedDog.img}
              alt={selectedDog.name}
              style={{ width: "100%", borderRadius: "8px" }}
            />
            <h2>{selectedDog.name}</h2>
            <button
              onClick={() => setSelectedDog(null)}
              className="close-modal-button"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
