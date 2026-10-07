import React, { useState, useEffect } from "react";

import { api } from "../Admin/api";
import "./Domestic.css";

const Domestic = () => {
  const [domesticData, setDomesticData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDomesticDestinations = async () => {
      try {
        setLoading(true);
        const res = await api.listDestinations();
        const rawList = Array.isArray(res)
          ? res
          : res?.destinations || res?.data || [];

        const domesticOnly = rawList.filter((item) => {
          const type = String(
            item.destination_type ??
            item.destinationType ??
            item.category ??
            item.type ??
            ""
          ).trim().toLowerCase();

          return type === "domestic";
        });

        // Sort alphabetically by name
        domesticOnly.sort((a, b) => {
          const nameA = (a.name || "").toLowerCase();
          const nameB = (b.name || "").toLowerCase();
          return nameA.localeCompare(nameB);
        });

        setDomesticData(domesticOnly);
      } catch (err) {
        console.error("Error fetching domestic destinations:", err);
        setDomesticData([]);
      } finally {
        setLoading(false);
      }
    };

    loadDomesticDestinations();
  }, []);

  return (
    <div className="domestic-page-wrapper">
      <section className="domestic-hero-banner">
        <div className="domestic-hero-overlay"></div>
        <div className="container position-relative text-start z-2">
          <p className="domestic-hero-subtitle text-center">DISCOVER INDIA</p>
          <h1 className="domestic-hero-title">
            Domestic holidays that feel
            <br />
            like home away from home.
          </h1>
          <p className="domestic-hero-description">
            From misty backwaters to snow-capped valleys — handpicked destinations
            that show off the very best of India.
          </p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span
              className="text-uppercase fw-bold text-warning font-xs"
              style={{ fontSize: "12px", letterSpacing: "1.5px" }}
            >
              Explore Incredible India
            </span>
            <h2 className="fw-bold mt-2 mb-3 display-md-5 display-7 ">
              Popular Domestic Destinations
            </h2>
            <p className="text-secondary mx-auto mb-0" style={{ maxWidth: "620px" }}>
              Discover iconic travel spots across the nation crafted for unforgettable memories.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-5">Loading destinations...</div>
          ) : (
            <div className="row g-4">
              {/* Removed .slice(0, visibleCount) so all destinations render */}
              {domesticData.map((item) => {
                const imageArray = item.hero_slider_images;
                const imageUrl = Array.isArray(imageArray)
                  ? imageArray[0]
                  : imageArray || item.image || item.imageUrl || "https://via.placeholder.com/600";

                const description =
                  item.about_text ||
                  item.about ||
                  item.description ||
                  "Explore this beautiful destination and discover unforgettable travel experiences.";

                return (
                  <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <div className="card custom-dest-card border-0 h-100 shadow-sm">
                      <div className="card-img-container">
                        <img
                          src={imageUrl}
                          className="card-img"
                          alt={item.name || "Destination"}
                          referrerPolicy="no-referrer"
                        />
                        <span className="badge tag-badge-gold">
                          {(item.destination_type || "DOMESTIC").toUpperCase()}
                        </span>

                        <div className="card-img-overlay-bottom">
                          <div className="location-pin">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>{item.capital || item.name || "Location"}</span>
                          </div>
                          <h3 className="overlay-card-title">{item.name}</h3>
                        </div>
                      </div>

                      <div className="card-body d-flex flex-column p-3">
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

                        <div className="mt-auto">
                          <hr className="my-3 text-muted opacity-25" />
                          <a
                            href={`/destination-details?id=${item.id}`}
                            className="explore-link text-decoration-none d-flex align-items-center justify-content-between"
                          >
                            <span>Explore Destination</span>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default Domestic;