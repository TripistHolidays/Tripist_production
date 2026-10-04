import React, { useState, useEffect } from "react";
import { api } from "../Admin/api";
import "./International.css";

const International = () => {
  const [internationalData, setInternationalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    const loadInternationalDestinations = async () => {
      try {
        setLoading(true);

        const res = await api.listDestinations();
        const rawList = Array.isArray(res)
          ? res
          : res?.destinations || res?.data || [];

        const internationalOnly = rawList.filter((item) => {
          const type = String(
            item.destination_type ??
            item.destinationType ??
            item.category ??
            item.type ??
            ""
          ).trim().toLowerCase();

          return type === "international";
        });

        // Sort alphabetically by name
        internationalOnly.sort((a, b) => {
          const nameA = (a.name || "").toLowerCase();
          const nameB = (b.name || "").toLowerCase();
          return nameA.localeCompare(nameB);
        });

        setInternationalData(internationalOnly);
      } catch (err) {
        console.error("Error fetching international destinations:", err);
        setInternationalData([]);
      } finally {
        setLoading(false);
      }
    };

    loadInternationalDestinations();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <div className="intl-page-wrapper">
      <section className="intl-hero-banner">
        <div className="intl-hero-overlay"></div>
        <div className="container position-relative text-start z-2">
          <p className="intl-hero-subtitle">AROUND THE WORLD</p>
          <h1 className="intl-hero-title">
            International escapes worth
            <br />
            writing home about.
          </h1>
          <p className="intl-hero-description">
            Overwater villas, tropical islands, glittering skylines — travel
            further with itineraries built by specialists.
          </p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5 ">
            <span
              className="text-uppercase fw-bold text-warning font-xs"
              style={{ fontSize: "12px", letterSpacing: "1.5px" }}
            >
              World Expeditions
            </span>
            <h2 className="fw-bold mt-2 mb-3 display-md-6 display-7">
              Featured International Destinations
            </h2>
            <p className="text-secondary mx-auto mb-0" style={{ maxWidth: "620px" }}>
              Discover handpicked international destinations for unforgettable adventures and relaxing escapes.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-5">Loading destinations...</div>
          ) : (
            <div className="row g-4">
              {internationalData.slice(0, visibleCount).map((item) => (
                <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <div className="card custom-dest-card border-0 h-100 shadow-sm">
                    <div className="card-img-container">
                      <img
                        src={item.hero_slider_images?.[0] || item.image || item.imageUrl || "https://via.placeholder.com/600"}
                        className="card-img"
                        alt={item.name}
                        referrerPolicy="no-referrer"
                      />
                      <span className="badge tag-badge-gold">
                        {(item.destination_type || "INTERNATIONAL").toUpperCase()}
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
                          <span>{item.capital || "Global"}</span>
                        </div>
                        <h3 className="overlay-card-title">{item.name}</h3>
                      </div>
                    </div>

                    <div className="card-body d-flex flex-column justify-content-between p-3">
                      <p className="card-desc text-secondary line-clamp-2">
                        {item.about_text || item.short_description || "No description available."}
                      </p>

                      <div>
                        <hr className="my-2 text-muted opacity-25" />
                        <div className="  mb-2">
                          <a
                            href={`/destination-details?id=${item.id}`}
                            className="explore-link justify-content-between d-flex text-decoration-none "
                          >
                            <span>View More</span>
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
                </div>
              ))}
            </div>
          )}

          {visibleCount < internationalData.length && (
            <div className="text-center mt-5">
              <button onClick={handleLoadMore} className="btn-load-more">
                Load More Destinations
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default International;