import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import parse from "html-react-parser";
import styles from "./AttractionDetail.module.css";
import { ReactComponent as Arrow } from "../assets/arrow.svg";

const initialAttractionState = {
  uuid: "",
  name: "",
  rating: "",
  imageUUID: "",
  description: "",
  tags: [],
  body: "",
  address: {},
  contact: "",
  officialEmail: "",
  officialWebsite: "",
};

function AttractionDetail({ handleSaveAttraction, isAttractionSaved }) {
  const [attraction, setAttraction] = useState(initialAttractionState);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchAttraction = async () => {
      setLoading(true);
      try {
        const apiUrl = `https://api.stb.gov.sg/content/attractions/v2/search?searchType=uuids&searchValues=${id}`;
        const headers = {
          Accept: "application/json",
          "X-API-Key": "3333nnLR8vJMmXyWgHreVCOXlAQqqswn", // Your API key
        };

        const response = await axios.get(apiUrl, { headers });
        setAttraction({
          uuid: id,
          name: response.data.data[0].name,
          rating: (response.data.data[0].rating / 5) * 100,
          imageUUID: response.data.data[0].images[0].uuid,
          imageURL: response.data.data[0].images[0].url,
          description: response.data.data[0].description,
          tags: [...response.data.data[0].tags],
          body: response.data.data[0].body,
          address: response.data.data[0].address,
          contact: response.data.data[0].contact.primaryContactNo,
          officialEmail: response.data.data[0].officialEmail,
          officialWebsite: response.data.data[0].officialWebsite,
        });
      } catch (error) {
        console.error("Error fetching attraction details:", error);
      }
      setLoading(false);
    };

    fetchAttraction();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!attraction) {
    return <div>No attraction found</div>;
  }

  const parseAddress = () => {
    let address = {
      buildingName: "",
      streetName: "",
      floorNumber: "",
      unitNumber: "",
      unit: "",
      postalCode: "",
    };

    for (let part in address)
      if (attraction.address[part]) address[part] = attraction.address[part];

    if (address.floorNumber)
      address.unit = `#${address.floorNumber}-${address.unitNumber}`;

    if (address.postalCode)
      address.postalCode = `Singapore ${address.postalCode}`;

    for (let part in address) if (!address[part]) delete address[part];

    delete address.floorNumber;
    delete address.unitNumber;

    return Object.values(address);
  };

  const addressArray = parseAddress();

  return (
    <div className="container">
      <div
        className="details-hero relative"
        style={{
          backgroundImage: attraction.imageUUID
            ? `url(https://tih.stb.gov.sg/bin/GetMediaByUuid?uuid=/${attraction.imageUUID}&mediaType=image)`
            : `url(${attraction.imageURL})`,
        }}
      >
        <div className="overlay"></div>
      </div>
      <div className={styles.container}>
        <div className={styles.titleRow}>
          <h1 className={styles.name}>{attraction.name}</h1>
          <button
            onClick={() => handleSaveAttraction(id)}
            className={`star-button ${isAttractionSaved(id) ? "saved" : ""}`}
          >
            ⭐
          </button>
        </div>
        <div className="rating">
          <div className={styles.starOuter}>
            <div
              className={styles.starInner}
              style={{ width: `${attraction.rating}%` }}
            ></div>
          </div>
        </div>
        <p>{attraction.description}</p>
        <ul className={styles.tags}>
          {attraction.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        {parse(attraction.body)}
        <h2 style={{ marginTop: "30px" }}>
          More <span className={styles.infoEmphasis}>Information</span>
        </h2>
        <table className={styles.infoTable}>
          <tr>
            <th>Location</th>
            <td>
              {addressArray.map((line) => (
                <div>{line}</div>
              ))}
            </td>
          </tr>
          <tr>
            <th>Contact</th>
            <td>{attraction.contact}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{attraction.officialEmail}</td>
          </tr>
        </table>
        <a
          href={`https://${attraction.officialWebsite}`}
          className="button-primary"
          style={{ width: "fit-content", margin: "35px 0px" }}
        >
          Visit Website{" "}
          <span>
            <Arrow />
          </span>
        </a>
      </div>
    </div>
  );
}

export default AttractionDetail;
