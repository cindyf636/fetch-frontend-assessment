import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MatchPage.css";
import { ClipLoader } from "react-spinners";
import { BsEmojiHeartEyes } from "react-icons/bs";
import { RiArrowGoBackFill } from "react-icons/ri";

function MatchPage() {
  const { dogId } = useParams();
  const [dog, setDog] = useState(null);
  const navigate = useNavigate();

  const fetchDog = useCallback(async () => {
    try {
      const res = await fetch(
        "https://frontend-take-home-service.fetch.com/dogs",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify([dogId]),
        }
      );

      const data = await res.json();
      if (data.length > 0) {
        setDog(data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch dog", error);
    }
  }, [dogId]);

  useEffect(() => {
    fetchDog();
  }, [fetchDog]);

  if (!dog) {
    return (
      <div className="loader-container">
        <ClipLoader
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <p>Loading your match...</p>
      </div>
    );
  }

  return (
    <div className="match-container">
      <h1>
        <BsEmojiHeartEyes className="heart-eyes-icon" />
        You matched with {dog.name}!
      </h1>
      <div className="match-dog-card">
        <img src={dog.img} alt={dog.name} className="match-dog-image" />
        <h2>{dog.name}</h2>
        <p>
          <strong>Breed:</strong> {dog.breed}
        </p>
        <p>
          <strong>Age:</strong> {dog.age}
        </p>
        <p>
          <strong>Zip Code:</strong> {dog.zip_code}
        </p>
      </div>

      <button onClick={() => navigate("/search")} className="match-back-button">
        <RiArrowGoBackFill />
        Back to Search
      </button>
    </div>
  );
}

export default MatchPage;
