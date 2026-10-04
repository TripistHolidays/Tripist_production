import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";

import { api } from "../Admin/api";
import "./Desti.css";
import heroImage from "../assets/desti.jpg"

const Destinations = () => {
  const [activeTab, setActiveTab] = useState("all");

  const [destinations, setDestinations] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // State to handle showing more cards
  const [showAll, setShowAll] = useState(false);

  // ============================================================
  // HELPER - PARSE ARRAY
  // ============================================================

  const parseArrayData = (value) => {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);

        if (Array.isArray(parsed)) {
          return parsed;
        }

        return [value];
      } catch {
        return value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    return [];
  };

  // ============================================================
  // FETCH DESTINATIONS FROM BACKEND
  // ============================================================

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        setLoading(true);
        setError("");

        console.log(
          "================================="
        );
        console.log(
          "FETCHING DESTINATIONS..."
        );
        console.log(
          "================================="
        );

        const response =
          await api.listDestinations();

        console.log(
          "DESTINATION API RESPONSE:",
          response
        );

        let destinationList = [];

        if (Array.isArray(response)) {
          destinationList = response;
        } else if (
          Array.isArray(
            response?.destinations
          )
        ) {
          destinationList =
            response.destinations;
        } else if (
          Array.isArray(
            response?.data?.destinations
          )
        ) {
          destinationList =
            response.data.destinations;
        } else if (
          Array.isArray(response?.data)
        ) {
          destinationList =
            response.data;
        }

        // Sort destinations alphabetically by name
        destinationList.sort((a, b) => {
          const nameA = (a.name || "").toLowerCase();
          const nameB = (b.name || "").toLowerCase();
          return nameA.localeCompare(nameB);
        });

        console.log(
          "FINAL DESTINATION LIST:",
          destinationList
        );

        setDestinations(
          destinationList
        );

        if (
          destinationList.length === 0
        ) {
          console.warn(
            "No destinations returned from backend."
          );
        }
      } catch (err) {
        console.error(
          "❌ ERROR FETCHING DESTINATIONS:",
          err
        );

        setDestinations([]);

        setError(
          err?.message ||
          "Failed to load destinations."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDestinations();
  }, []);

  // ============================================================
  // GET DESTINATION TYPE
  // ============================================================

  const getDestinationType = (item) => {
    if (!item) {
      return "international";
    }

    if (item.destination_type) {
      return String(
        item.destination_type
      ).toLowerCase();
    }

    if (item.type) {
      return String(
        item.type
      ).toLowerCase();
    }

    if (item.destination_category) {
      const category =
        String(
          item.destination_category
        ).toLowerCase();

      if (
        category.includes("domestic")
      ) {
        return "domestic";
      }

      if (
        category.includes("international")
      ) {
        return "international";
      }
    }

    if (
      item.name?.toLowerCase() ===
      "india"
    ) {
      return "domestic";
    }

    return "international";
  };

  // ============================================================
  // FILTER DESTINATIONS & SLICE FOR "VIEW MORE"
  // ============================================================

  const filteredDestinations =
    destinations.filter((item) => {
      if (activeTab === "all") {
        return true;
      }

      return (
        getDestinationType(item) ===
        activeTab
      );
    });

  // Limit visible destinations to 8 unless showAll is true
  const displayedDestinations = showAll
    ? filteredDestinations
    : filteredDestinations.slice(0, 8);

  // Reset showAll when switching tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowAll(false);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="destinations-wrapper">

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="desti-hero" style={{ backgroundImage: `url(${heroImage})` }}>

        <div className="desti-overlay">

          <div className="container  text-md-start">

            <p className="section-tag">
              EXPLORE THE MAP
            </p>

            <h1>
              Every destination we craft —
              <br />
              in one place.
            </h1>

            <p className="hero-desc">
              From backyard getaways to
              bucket-list adventures, browse
              our full collection of curated
              escapes.
            </p>

            <p className="hero-subdesc">
              Discover unique itineraries,
              overwater retreats, and cultural
              journeys across India and around
              the globe.
            </p>

          </div>

        </div>

      </section>

      {/* ======================================================
          DESTINATION SECTION
      ====================================================== */}

      <section className="destinations-gallery py-5">

        <div className="container">

          {/* ==================================================
              HEADING
          ================================================== */}

          <div className="text-center mb-5">

            <span className="section-tag d-block mb-1">
              TAILORED ITINERARIES
            </span>

            <h2 className="fw-bold mt-1 mb-2 display-6">
              Explore Our Destinations
            </h2>

            <p
              className="text-muted mx-auto mb-0"
              style={{
                maxWidth: "650px",
              }}
            >
              Discover handpicked destinations
              across India and around the world.
              Explore destination details,
              attractions and available travel
              packages.
            </p>

          </div>

          {/* ==================================================
              FILTER BUTTONS
          ================================================== */}

          <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">

            <button
              type="button"
              className={`custom-pill-btn px-md-4 px-3 py-2 rounded-pill ${activeTab === "all"
                  ? "active"
                  : ""
                }`}
              onClick={() =>
                handleTabChange("all")
              }
            >
              All Destinations
            </button>

            <button
              type="button"
              className={`custom-pill-btn px-4 py-2 rounded-pill ${activeTab === "domestic"
                  ? "active"
                  : ""
                }`}
              onClick={() =>
                handleTabChange("domestic")
              }
            >
              Domestic
            </button>

            <button
              type="button"
              className={`custom-pill-btn px-4 py-2 rounded-pill ${activeTab === "international"
                  ? "active"
                  : ""
                }`}
              onClick={() =>
                handleTabChange("international")
              }
            >
              International
            </button>

          </div>

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && (

            <div className="text-center py-5">

              <div
                className="spinner-border text-warning"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <p className="mt-3 text-muted">
                Loading destinations...
              </p>

            </div>

          )}

          {/* ==================================================
              ERROR
          ================================================== */}

          {!loading && error && (

            <div className="text-center py-5">

              <div className="alert alert-danger mx-auto"
                style={{
                  maxWidth: "600px",
                }}
              >
                <strong>
                  Unable to load destinations
                </strong>

                <div className="small mt-2">
                  {error}
                </div>

              </div>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() =>
                  window.location.reload()
                }
              >
                Try Again
              </button>

            </div>

          )}

          {/* ==================================================
              NO DESTINATIONS
          ================================================== */}

          {!loading &&
            !error &&
            destinations.length === 0 && (

              <div className="text-center py-5">

                <h5>
                  No destinations found.
                </h5>

                <p className="text-muted">
                  The backend returned no
                  destination records.
                </p>

              </div>

            )}

          {/* ==================================================
              FILTERED EMPTY
          ================================================== */}

          {!loading &&
            !error &&
            destinations.length > 0 &&
            filteredDestinations.length ===
            0 && (

              <div className="text-center py-5">

                <h5>
                  No destinations found.
                </h5>

                <p className="text-muted">
                  No destinations are available
                  in this category.
                </p>

              </div>

            )}

          {/* ==================================================
              DESTINATION CARDS (Original Layout + View More)
          ================================================== */}

          {!loading &&
            !error &&
            filteredDestinations.length >
            0 && (

              <>
                <div className="row g-4">

                  {displayedDestinations.map(
                    (item) => {

                      const imageArray =
                        parseArrayData(
                          item.hero_slider_images
                        );

                      const image =
                        imageArray[0] ||
                        item.hero_image ||
                        item.image_url ||
                        item.image ||
                        "https://placehold.co/600x400?text=Destination";

                      const destinationType =
                        getDestinationType(
                          item
                        );

                      const displayType =
                        destinationType ===
                          "domestic"
                          ? "DOMESTIC"
                          : "INTERNATIONAL";

                      const description =
                        item.about_text ||
                        item.about ||
                        item.description ||
                        "Explore this beautiful destination and discover unforgettable travel experiences.";

                      return (

                        <div
                          key={item.id}
                          className="col-12 col-sm-6 col-md-4 col-lg-3"
                        >

                          <div className="card custom-dest-card border-0 h-100 shadow-sm">

                            {/* ==================================
                                IMAGE
                            ================================== */}

                            <div className="card-img-container">

                              <img
                                src={image}
                                className="card-img"
                                alt={
                                  item.name ||
                                  "Destination"
                                }
                                referrerPolicy="no-referrer"
                                onError={(e) => {

                                  e.currentTarget.onerror =
                                    null;

                                  e.currentTarget.src =
                                    "https://placehold.co/600x400?text=Destination";

                                }}
                              />

                              {/* =================================
                                  TYPE BADGE
                              ================================= */}

                              <span className="badge tag-badge-gold">
                                {displayType}
                              </span>

                              {/* =================================
                                  IMAGE OVERLAY
                              ================================= */}

                              <div className="card-img-overlay-bottom">

                                {/* LOCATION */}

                                <div className="location-pin">

                                  <FaMapMarkerAlt />

                                  <span>
                                    {item.capital ||
                                      item.name ||
                                      "Location"}
                                  </span>

                                </div>

                                {/* DESTINATION NAME */}

                                <h3 className="overlay-card-title">

                                  {item.name ||
                                    "Destination"}

                                </h3>

                              </div>

                            </div>

                            {/* ==================================
                                CARD BODY
                            ================================== */}

                            <div className="card-body d-flex flex-column p-3">

                              {/* DESCRIPTION */}

                              <p
                                className="card-desc text-secondary"
                                style={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {description}
                              </p>

                              {/* =================================
                                  BUTTON
                              ================================= */}

                              <div className="mt-auto">

                                <hr className="my-3 text-muted opacity-25" />

                                <Link
                                  to={`/destination-details?id=${item.id}`}
                                  className="explore-link text-decoration-none d-flex align-items-center justify-content-between"
                                >

                                  <span>
                                    Explore Destination
                                  </span>

                                  <FaArrowRight />

                                </Link>

                              </div>

                            </div>

                          </div>

                        </div>

                      );
                    }
                  )}

                </div>

                {/* ==================================================
                    VIEW MORE / VIEW LESS BUTTON
                ================================================== */}

                {filteredDestinations.length > 8 && (
                  <div className="text-center mt-5">
                    <button
                      type="button"
                      className="custom-pill-btn px-5 py-2 rounded-pill fw-bold"
                      onClick={() => setShowAll(!showAll)}
                    >
                      {showAll ? "View Less" : "View More Destinations"}
                    </button>
                  </div>
                )}
              </>

            )}

        </div>

      </section>

    </div>
  );
};

export default Destinations;