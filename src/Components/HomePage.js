import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";
import "../App.css";
import { ReactComponent as Star } from "../assets/star.svg";
import { ReactComponent as Arrow } from "../assets/arrow.svg";

function AttractionListing() {
  const [attractionTypes, setAttractionTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [attractions, setAttractions] = useState([]);
  const [fourAttractions, setFourAttractions] = useState([]);
  const [allttractions, setAllAttractions] = useState([]);
  const [savedAttractions, setSavedAttractions] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeType, setActiveType] = useState(attractionTypes[0] || "");

  const handlerLogIn = () => {
    setIsLoggedIn(() => !isLoggedIn);
  };

  useEffect(() => {
    fetchAttractionTypes();
  }, []);

  const fetchAttractionTypes = async () => {
    try {
      const apiUrl =
        "https://api.stb.gov.sg/content/common/v2/types?category=attractions";
      const headers = {
        Accept: "application/json",
        "X-API-Key": "nE2LLxGGycJ7Egvtg2xXJZOpXNOVbKFW", // Your API key
      };

      const response = await axios.get(apiUrl, { headers });
      setAttractionTypes(response.data.data);
    } catch (error) {
      console.error("Error fetching attraction types:", error);
    }
  };

  const fetchAttractions = async (type) => {
    try {
      const apiUrl = `https://api.stb.gov.sg/content/attractions/v2/search?searchType=keyword&searchValues=${type}&limit=4`;
      const headers = {
        Accept: "application/json",
        "X-API-Key": "nE2LLxGGycJ7Egvtg2xXJZOpXNOVbKFW", // Your API key
      };

      const response = await axios.get(apiUrl, { headers });

      const formattedAttractions = response.data.data.map((attraction) => ({
        uuid: attraction.uuid,
        name: attraction.name,
        description: attraction.description,
        imageUuid: attraction.images[0]?.uuid,
        imageURL: response.data.data[0].images[0].url,
      }));

      setAttractions(formattedAttractions);
    } catch (error) {
      console.error(`Error fetching attractions for ${type}:`, error);
    }
  };

  useEffect(() => {
    fetchFourAttractions();
  }, []);

  const fetchFourAttractions = async (type) => {
    try {
      const apiUrl = `https://api.stb.gov.sg/content/attractions/v2/search?searchType=keyword&searchValues=beach&limit=4`;
      const headers = {
        Accept: "application/json",
        "X-API-Key": "nE2LLxGGycJ7Egvtg2xXJZOpXNOVbKFW", // Your API key
      };

      const response = await axios.get(apiUrl, { headers });

      const formattedAttractions = response.data.data.map((attraction) => ({
        uuid: attraction.uuid,
        name: attraction.name,
        description: attraction.description,
        imageUuid: attraction.images[0]?.uuid,
        imageURL: response.data.data[0].images[0].url,
      }));

      setFourAttractions(formattedAttractions);
    } catch (error) {
      console.error(`Error fetching attractions for ${type}:`, error);
    }
  };

  useEffect(() => {
    fetchAllAttractions();
  }, []);

  const fetchAllAttractions = async (type) => {
    try {
      const apiUrl = `https://api.stb.gov.sg/content/attractions/v2/search?searchType=keyword&searchValues=adventure&limit=4`;
      const headers = {
        Accept: "application/json",
        "X-API-Key": "nE2LLxGGycJ7Egvtg2xXJZOpXNOVbKFW", // Your API key
      };

      const response = await axios.get(apiUrl, { headers });

      const formattedAttractions = response.data.data.map((attraction) => ({
        uuid: attraction.uuid,
        name: attraction.name,
        description: attraction.description,
        imageUuid: attraction.images[0]?.uuid,
        imageURL: response.data.data[0].images[0].url,
      }));

      setAllAttractions(formattedAttractions);
    } catch (error) {
      console.error(`Error fetching attractions for ${type}:`, error);
    }
  };

  const handleTypeClick = (type) => {
    setSelectedType(type);
    fetchAttractions(type);
    setActiveType(type);
  };

  const handleSaveAttraction = (id) => {
    setSavedAttractions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isAttractionSaved = (id) => {
    return savedAttractions[id];
  };

  function truncateWords(text, maxWords) {
    const words = text.split(" ");
    const truncatedWords = words.slice(0, maxWords);
    const truncatedText = truncatedWords.join(" ");

    // Add ellipsis if the original text has more words than the max
    return words.length > maxWords ? truncatedText + "..." : truncatedText;
  }

  return (
    <div className="">
      <section className={`${styles.section} container`}>
        <h2>
          <span className="highlighted-orange">Inspiration</span> for your
          <br />
          stay in SG
        </h2>
        <p className="big">
          Not sure what to do on your next trip to Singapore? No worries. We
          have gathered a<br />
          selection of curated journeys from different parts of the country.
          Find interesting
          <br />
          sights to see, places to visit, and restaurants to dine in.
        </p>

        <Link to={`/attractions/`} className="button-primary">
          Visit More{" "}
          <span>
            <Arrow />
          </span>
        </Link>
        <ul className={styles.mainInspoCon}>
          {console.log("4 attractions:" + fourAttractions)}
          {fourAttractions.map((attraction, index) => (
            <li key={index} className="relative">
              {console.log("attractions:" + attraction)}
              <div className={`${styles.inspo} relative`}>
                <Link
                  to={`/attraction/${attraction.uuid}`}
                  className={styles.inspo}
                  style={{
                    backgroundImage: attraction.imageUuid
                      ? `url(https://tih.stb.gov.sg/bin/GetMediaByUuid?uuid=${attraction.imageUuid}&mediaType=image`
                      : `url(${attraction.imageURL})`,
                  }}
                >
                  <div className="black-overlay"></div>
                </Link>
              </div>
              <div className={styles.textContent}>
                <h3>
                  <Link to={`/attraction/${attraction.uuid}`}>
                    {attraction.name}
                  </Link>
                </h3>
                <button
                  onClick={() => handleSaveAttraction(attraction.uuid)}
                  className={`star-button ${
                    isAttractionSaved(attraction.uuid) ? "saved" : ""
                  }`}
                >
                  <Star />
                </button>

                <p className="big">
                  {truncateWords(attraction.description, 10)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className={`${styles.section} ${styles.exploreContainer}`}>
        <div className={styles.exploreIntro}>
          <div className={styles.exploreText}>
            <h2>
              <span className="highlighted-orange">Explore </span>
              Accommodations <br />
              in Singapore
            </h2>
            <p>
              Discover the perfect stay that suits your preferences. Click on
              the tags below to explore accommodations tailored to your needs.
            </p>
          </div>
          <ul className={styles.tagContainer}>
            {attractionTypes.map((type, index) => (
              <li
                key={index}
                onClick={() => handleTypeClick(type)}
                className={`clickable ${
                  type === activeType ? styles.active : ""
                }`}
              >
                {type}
              </li>
            ))}
          </ul>
        </div>
        {selectedType && (
          <div className="text-center">
            {/* <h2>Attractions for {selectedType}</h2> */}
            <ul className={`${styles.lisContent} container`}>
              {attractions.map((attraction, index) => (
                <li key={index}>
                  {console.log("attractions:" + attraction)}
                  <div className="relative">
                    <Link
                      to={`/attraction/${attraction.uuid}`}
                      className={`${styles.detailsHero} relative`}
                      style={{
                        backgroundImage: attraction.imageUuid
                          ? `url(https://tih.stb.gov.sg/bin/GetMediaByUuid?uuid=${attraction.imageUuid}&mediaType=image`
                          : `url(${attraction.imageURL})`,
                      }}
                    ></Link>

                    <button
                      onClick={() => handleSaveAttraction(attraction.uuid)}
                      className={`star-button ${
                        isAttractionSaved(attraction.uuid) ? "saved" : ""
                      }`}
                    >
                      <Star />
                    </button>
                  </div>
                  <div className={`${styles.exploreContent} text-left`}>
                    <h4>
                      <Link to={`/attraction/${attraction.uuid}`}>
                        {attraction.name}
                      </Link>
                    </h4>
                    <p>{truncateWords(attraction.description, 20)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className={`${styles.exploreButton} text-center`}>
              <Link to={`/attractions/`} className="button-primary">
                Visit More{" "}
                <span>
                  <Arrow />
                </span>
              </Link>
            </div>
          </div>
        )}
        {!selectedType && (
          <div className="text-center">
            {/* <h2>Attractions for {selectedType}</h2> */}
            <ul className={`${styles.lisContent} container`}>
              {allttractions.map((attraction, index) => (
                <li key={index}>
                  {console.log("attractions:" + attraction)}
                  <div className="relative">
                    <Link
                      to={`/attraction/${attraction.uuid}`}
                      className={`${styles.detailsHero} relative`}
                      style={{
                        backgroundImage: attraction.imageUuid
                          ? `url(https://tih.stb.gov.sg/bin/GetMediaByUuid?uuid=${attraction.imageUuid}&mediaType=image)`
                          : `url(${attraction.imageURL})`,
                      }}
                    ></Link>

                    <button
                      onClick={() => handleSaveAttraction(attraction.uuid)}
                      className={`star-button ${
                        isAttractionSaved(attraction.uuid) ? "saved" : ""
                      }`}
                    >
                      <Star />
                    </button>
                  </div>
                  <div className={`${styles.exploreContent} text-left`}>
                    <h4>
                      <Link to={`/attraction/${attraction.uuid}`}>
                        {attraction.name}
                      </Link>
                    </h4>
                    <p>{truncateWords(attraction.description, 20)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className={`${styles.exploreButton} text-center`}>
              <Link to={`/attractions/`} className="button-primary">
                Visit More{" "}
                <span>
                  <Arrow />
                </span>
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default AttractionListing;
