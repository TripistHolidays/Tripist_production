import React, { useState } from "react";
import "./DomesticRegion.css";
import indiaMap from "../assets/india-map-icon.png";

const regions = [
  {
    name: "North",
    states: [
      "Chandigarh",
      "Delhi",
      "Haryana",
      "Himachal Pradesh",
      "Jammu and Kashmir",
      "Ladakh",
      "Punjab",
      "Rajasthan",
      "Uttar Pradesh",
      "Uttarakhand",
    ],
  },
  {
    name: "North East",
    states: [
      "Arunachal Pradesh",
      "Assam",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Sikkim",
      "Tripura",
    ],
  },
  {
    name: "East",
    states: [
      "Andaman and Nicobar Islands",
      "Bihar",
      "Jharkhand",
      "Odisha",
      "West Bengal",
    ],
  },
  {
    name: "Central",
    states: ["Chhattisgarh", "Madhya Pradesh"],
  },
  {
    name: "West",
    states: [
      "Dadra and Nagar Haveli and Daman and Diu",
      "Goa",
      "Gujarat",
      "Maharashtra",
    ],
  },
  {
    name: "South",
    states: [
      "Andhra Pradesh",
      "Karnataka",
      "Kerala",
      "Lakshadweep",
      "Puducherry",
      "Tamil Nadu",
      "Telangana",
    ],
  },
];

const DomesticRegion = () => {
  const [activeTab, setActiveTab] = useState("States and UTs");

  const tabs = ["States and UTs"];

  return (
    <section className="domestic-regions">
      <div className="domestic-container">

        {/* =========================
            TOP NAVIGATION
        ========================== */}
        <div className="domestic-tabs-wrapper">
          <div className="domestic-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`domestic-tab ${
                  activeTab === tab ? "active" : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* =========================
            CONTENT
        ========================== */}
        {activeTab === "States and UTs" && (
          <>
            <div className="domestic-divider"></div>

            <div className="region-grid">
              {regions.map((region) => (
                <article className="region-card" key={region.name}>

                  {/* India Map */}
                  {/* <div className="region-map">
                    <img
                      src={indiaMap}
                      alt={`${region.name} India map`}
                    />
                  </div> */}

                  {/* Region Name */}
                  <h3 className="region-name">{region.name}</h3>

                  {/* State List */}
                  <ul className="region-state-list">
                    {region.states.map((state) => (
                      <li key={state}>
                        <button type="button">{state}</button>
                      </li>
                    ))}
                  </ul>

                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default DomesticRegion;