import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaArrowRight,
  FaInfoCircle,
  FaGlobe,
  FaCoins,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
} from "react-icons/fa";

import { api } from "../Admin/api";
import "./DestinationDetails.css";

const DestinationDetails = () => {
  const [searchParams] = useSearchParams();

  const rawId = searchParams.get("id");
  const destinationId = rawId ? parseInt(rawId, 10) : null;

  const [destination, setDestination] = useState(null);
  const [attractions, setAttractions] = useState([]);
  const [packages, setPackages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFullAbout, setShowFullAbout] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);

  const attractionTrackRef = useRef(null);

  // =========================================================
  // HELPER
  // =========================================================

  const parseArrayData = (value) => {
    if (!value) return [];

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

    return [String(value)];
  };

  // =========================================================
  // FETCH DESTINATION
  // =========================================================

  useEffect(() => {
    const fetchDestinationData = async () => {
      if (!destinationId || isNaN(destinationId)) {
        setError(
          "Invalid or missing Destination ID in URL query parameters."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await api.getDestinationById(destinationId);

        const destData =
          res?.destination ||
          res?.data?.destination ||
          res?.data ||
          (res &&
          typeof res === "object" &&
          (res.name || res.destination_name)
            ? res
            : null);

        if (
          !destData ||
          typeof destData !== "object" ||
          Object.keys(destData).length === 0
        ) {
          throw new Error(
            `Destination with ID #${destinationId} was not found in database.`
          );
        }

        setDestination(destData);

        // =====================================================
        // FETCH ATTRACTIONS
        // =====================================================

        if (typeof api.listAttractions === "function") {
          try {
            const attractionsData =
              await api.listAttractions(destinationId);

            setAttractions(
              Array.isArray(attractionsData)
                ? attractionsData
                : []
            );
          } catch (err) {
            console.warn(
              "Failed to fetch attractions. Using inline attractions.",
              err
            );

            buildInlineAttractions(destData);
          }
        } else {
          buildInlineAttractions(destData);
        }
      } catch (err) {
        console.error("❌ [DESTINATION FETCH ERROR]:", err);

        setError(
          err?.message || "Failed to load destination details."
        );

        setDestination(null);
      } finally {
        setLoading(false);
      }
    };

    const buildInlineAttractions = (destData) => {
      if (Array.isArray(destData?.attractions)) {
        setAttractions(destData.attractions);
        return;
      }

      const names = parseArrayData(
        destData?.attraction_names ||
          destData?.attractionNames
      );

      const images = parseArrayData(
        destData?.attraction_images ||
          destData?.attractionImages
      );

      const combined = names.map((name, index) => ({
        id: index,
        name,
        image: images[index] || null,
      }));

      setAttractions(combined);
    };

    fetchDestinationData();
  }, [destinationId]);

  // =========================================================
  // FETCH PACKAGES
  // =========================================================

  useEffect(() => {
    const loadPackages = async () => {
      if (!destinationId || isNaN(destinationId)) {
        setPackagesLoading(false);
        return;
      }

      try {
        setPackagesLoading(true);

        const response = await api.listPackages(
          null,
          null,
          destinationId
        );

        const packageArray = Array.isArray(response)
          ? response
          : response?.packages ||
            response?.data ||
            [];

        const filtered = packageArray.filter(
          (pkg) =>
            Number(
              pkg.destinationId ||
                pkg.destination_id
            ) === Number(destinationId)
        );

        setPackages(filtered);
      } catch (err) {
        console.error(
          "❌ [PACKAGES FETCH ERROR]:",
          err
        );

        setPackages([]);
      } finally {
        setPackagesLoading(false);
      }
    };

    loadPackages();
  }, [destinationId]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center py-5 my-5"
        style={{ minHeight: "50vh" }}
      >
        <div
          className="spinner-border text-warning"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !destination) {
    return (
      <div className="text-center py-5 my-5">
        <h4 className="text-danger">
          {error || "Destination not found"}
        </h4>

        <Link
          to="/destinations"
          className="btn btn-gold-tripist mt-3"
        >
          Back to Destinations
        </Link>
      </div>
    );
  }

  // =========================================================
  // DESTINATION DATA
  // =========================================================

  const destName =
    destination.name ||
    destination.destination_name ||
    "Destination";

  const capital = destination.capital || "";

  const locationText =
    capital ||
    destination.country ||
    destination.state ||
    "";

  const bestSeason =
    destination.best_season_to_visit ||
    destination.best_season ||
    destination.bestSeason ||
    "Year-round";

  const aboutText =
    destination.about_text ||
    destination.about ||
    destination.description ||
    "";

  // IMPORTANT:
  // NO slice(0, 5) HERE.
  // This gets ALL quick tips.
  const travelTips = parseArrayData(
    destination.travel_tips ||
      destination.travelTips
  );

  // =========================================================
  // HERO IMAGES
  // =========================================================

  const rawHeroImages = parseArrayData(
    destination.hero_slider_images ||
      destination.hero_images ||
      destination.heroImages
  );

  const fallbackImage =
    destination.hero_image ||
    destination.image ||
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80";

  const heroImages =
    rawHeroImages.length > 0
      ? rawHeroImages
      : [fallbackImage];

  // =========================================================
  // SLIDER
  // =========================================================

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === heroImages.length - 1
        ? 0
        : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0
        ? heroImages.length - 1
        : prev - 1
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="destination-details-page explore-page-wrapper">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="destination-header">
        <div className="container">
          <div className="destination-header-grid">

            <div className="destination-package-count">
              <strong>
                {packages.length || "—"}
              </strong>

              <span>
                Tour
                <br />
                Packages
              </span>
            </div>

            <div className="destination-heading">

              <div className="destination-breadcrumb">
                <Link to="/">Home</Link>

                <span>›</span>

                <Link to="/destinations">
                  Your Packages
                </Link>

                <span>›</span>

                <span>
                  {destination.category ||
                    "International Tour Packages"}
                </span>

                <span>›</span>

                <strong>
                  {destName} Tour Packages
                </strong>
              </div>

              <h1>
                {destName} Tour Packages
              </h1>

              {locationText && (
                <div className="destination-location">
                  <FaMapMarkerAlt />

                  <span>
                    Capital:{" "}
                    {capital || locationText}
                  </span>
                </div>
              )}
            </div>

            <div className="destination-header-actions">

              <Link
                to={`/contact-us?destinationId=${destinationId}&destinationName=${encodeURIComponent(
                  destName
                )}`}
                className="destination-primary-btn"
              >
                Enquire Now
              </Link>

              <a
                href="#packages"
                className="destination-secondary-btn"
              >
                View All Packages
              </a>

            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HERO + QUICK INFO
      ===================================================== */}

      <section className="destination-hero-content">
        <div className="container">

          <div className="destination-hero-grid">

            {/* LEFT SIDE */}
            <div className="destination-main-visual">

              <div
                className="destination-main-image"
                style={{
                  position: "relative",
                  overflow: "hidden",
                }}
              >

                <img
                  src={
                    heroImages[currentSlide] ||
                    fallbackImage
                  }
                  alt={`${destName} slide ${
                    currentSlide + 1
                  }`}
                  style={{
                    width: "100%",
                    height: "400px",
                    objectFit: "cover",
                    transition:
                      "opacity 0.3s ease-in-out",
                  }}
                />

                {/* SLIDER BUTTONS */}

                {heroImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevSlide}
                      className="destination-slider-arrow destination-slider-prev"
                      aria-label="Previous slide"
                    >
                      <FaChevronLeft />
                    </button>

                    <button
                      type="button"
                      onClick={nextSlide}
                      className="destination-slider-arrow destination-slider-next"
                      aria-label="Next slide"
                    >
                      <FaChevronRight />
                    </button>

                    {/* DOTS */}

                    <div className="destination-slider-dots">
                      {heroImages.map(
                        (_, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() =>
                              setCurrentSlide(
                                index
                              )
                            }
                            className={
                              currentSlide === index
                                ? "active"
                                : ""
                            }
                            aria-label={`Go to slide ${
                              index + 1
                            }`}
                          />
                        )
                      )}
                    </div>
                  </>
                )}

                <div className="destination-image-caption">

                  <span>
                    {destination.country ||
                      destName}
                  </span>

                  <span>
                    <FaGlobe /> Explore with Tripist
                  </span>

                </div>
              </div>

              {/* META */}

              <div className="destination-meta-strip">

                {destination.time_zone && (
                  <span>
                    <b>Time Zone:</b>{" "}
                    {destination.time_zone}
                  </span>
                )}

                {destination.driving_side && (
                  <span>
                    <b>Driving Side:</b>{" "}
                    {destination.driving_side}
                  </span>
                )}

                {destination.calling_code && (
                  <span>
                    <b>Calling Code:</b>{" "}
                    {destination.calling_code}
                  </span>
                )}

                {destination.languages_spoken && (
                  <span>
                    <b>Languages:</b>{" "}
                    {parseArrayData(
                      destination.languages_spoken
                    ).join(", ")}
                  </span>
                )}

              </div>
            </div>

            {/* =================================================
                RIGHT SIDE QUICK CARD
            ================================================= */}

            <aside className="destination-quick-card">

              <div className="quick-card-brand">
                South India's No.1 Travel Brand
              </div>

              {/* QUICK INFORMATION */}

              <div className="quick-info-grid">

                {destination.currency && (
                  <div>
                    <strong>
                      {destination.currency}
                    </strong>

                    <small>
                      Currency
                    </small>
                  </div>
                )}

                {destination.climate && (
                  <div>
                    <strong>
                      {destination.climate}
                    </strong>

                    <small>
                      Climate in {destName}
                    </small>
                  </div>
                )}

                <div>
                  <strong>
                    {bestSeason}
                  </strong>

                  <small>
                    Best Season to Visit
                  </small>
                </div>

                {destination.languages_spoken && (
                  <div>
                    <strong>
                      {parseArrayData(
                        destination.languages_spoken
                      ).join(", ")}
                    </strong>

                    <small>
                      Languages Spoken
                    </small>
                  </div>
                )}

              </div>

              {/* =================================================
                  QUICK TIPS
                  ALL TIPS DISPLAYED
                  ONLY THIS AREA SCROLLS
              ================================================= */}

              {travelTips.length > 0 && (
                <div className="quick-tips">

                  <h3>
                    Essential Tips for Travelling
                    to {destName}
                  </h3>

                  <div className="quick-tips-scroll">

                    {travelTips.map(
                      (tip, index) => (
                        <div
                          className="quick-tip"
                          key={index}
                        >

                          <span>
                            <FaCheckCircle />
                          </span>

                          <p>{tip}</p>

                        </div>
                      )
                    )}

                  </div>
                </div>
              )}

            </aside>
          </div>
        </div>
      </section>

      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section className="destination-about-section">
        <div className="container">

          <div className="destination-about-inner">

            <span className="section-eyebrow">
              DISCOVER {destName.toUpperCase()}
            </span>

            <h2>
              All You Need To Know About{" "}
              {destName}
            </h2>

            {aboutText ? (
              <div
                className={`destination-about-text ${
                  showFullAbout
                    ? "expanded"
                    : ""
                }`}
              >
                <p
                  style={{
                    whiteSpace: "pre-line",
                  }}
                >
                  {aboutText}
                </p>
              </div>
            ) : (
              <p className="destination-about-text">
                Explore the beauty, culture, and
                unforgettable experiences{" "}
                {destName} has to offer.
              </p>
            )}

            {aboutText &&
              aboutText.length > 420 && (
                <button
                  type="button"
                  className="read-more-btn"
                  onClick={() =>
                    setShowFullAbout(
                      !showFullAbout
                    )
                  }
                >
                  {showFullAbout
                    ? "READ LESS"
                    : "READ MORE"}
                </button>
              )}

          </div>
        </div>
      </section>

      {/* =====================================================
          DESTINATION FACTS
      ===================================================== */}

      <section className="destination-facts-section">
        <div className="container">

          <div className="destination-facts-grid">

            <div className="destination-fact">
              <FaCalendarAlt />

              <div>
                <span>
                  Best Season
                </span>

                <strong>
                  {bestSeason}
                </strong>
              </div>
            </div>

            {destination.currency && (
              <div className="destination-fact">
                <FaCoins />

                <div>
                  <span>
                    Currency
                  </span>

                  <strong>
                    {destination.currency}
                  </strong>
                </div>
              </div>
            )}

            {destination.capital && (
              <div className="destination-fact">
                <FaGlobe />

                <div>
                  <span>
                    Capital
                  </span>

                  <strong>
                    {destination.capital}
                  </strong>
                </div>
              </div>
            )}

            {destination.climate && (
              <div className="destination-fact">
                <FaInfoCircle />

                <div>
                  <span>
                    Climate
                  </span>

                  <strong>
                    {destination.climate}
                  </strong>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* =====================================================
          PACKAGES
      ===================================================== */}

      <section
        className="destination-packages-section"
        id="packages"
      >
        <div className="container">

          <div className="section-heading-row">

            <div>
              <span className="section-eyebrow">
                TRAVEL YOUR WAY
              </span>

              <h2>
                View All {destName} Tour Packages
              </h2>
            </div>

            {packages.length > 4 && (
              <Link
                to="/destinations"
                className="view-more-link"
              >
                View All{" "}
                <FaArrowRight />
              </Link>
            )}

          </div>

          {packagesLoading ? (
            <div className="destination-loading">

              <div
                className="spinner-border text-warning"
                role="status"
              />

              <p>
                Loading available packages...
              </p>

            </div>
          ) : packages.length === 0 ? (
            <div className="destination-empty">

              <h5>
                No packages currently assigned
                to {destName}.
              </h5>

              <p>
                Check back soon or explore our
                other travel destinations.
              </p>

            </div>
          ) : (
            <div className="destination-package-grid">

              {packages
                .slice(0, 4)
                .map((pkg) => {

                  const pkgId =
                    pkg.id || pkg._id;

                  const pkgTitle =
                    pkg.name ||
                    pkg.package_name ||
                    "Travel Package";

                  const pkgImg =
                    pkg.cover_image ||
                    pkg.image ||
                    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";

                  const days =
                    pkg.durationDays ||
                    pkg.duration_days;

                  const nights =
                    pkg.durationNights ||
                    pkg.duration_nights;

                  const pkgPrice =
                    pkg.price;

                  return (
                    <article
                      className="destination-package-card"
                      key={pkgId}
                    >

                      <Link
                        to={`/ExplorePackages?id=${pkgId}`}
                        className="package-image-link"
                      >

                        <div className="package-image-wrap">

                          <img
                            src={pkgImg}
                            alt={pkgTitle}
                          />

                          <span className="package-image-badge">
                            {destName}
                          </span>

                        </div>

                      </Link>

                      <div className="destination-package-body">

                        <div className="package-location">
                          <FaMapMarkerAlt />

                          <span>
                            {destName}
                          </span>
                        </div>

                        <Link
                          to={`/ExplorePackages?id=${pkgId}`}
                          className="package-title"
                        >
                          {pkgTitle}
                        </Link>

                        {(days || nights) && (
                          <div className="package-duration">

                            <FaClock />

                            <span>
                              {nights
                                ? `${nights} Nights `
                                : ""}

                              {days
                                ? `${days} Days`
                                : ""}
                            </span>

                          </div>
                        )}

                        <div className="package-bottom">

                          <div>

                            <small>
                              STARTS FROM
                            </small>

                            <strong>
                              {pkgPrice
                                ? pkgPrice
                                    .toString()
                                    .startsWith(
                                      "₹"
                                    )
                                  ? pkgPrice
                                  : `₹${pkgPrice}`
                                : "On Request"}
                            </strong>

                          </div>

                          <Link
                            to={`/ExplorePackages?id=${pkgId}`}
                            className="package-explore-btn"
                          >
                            Explore{" "}
                            <FaArrowRight />
                          </Link>

                        </div>
                      </div>
                    </article>
                  );
                })}

            </div>
          )}

          {packages.length > 4 && (
            <div className="center-action">

              <Link
                to="/destinations"
                className="gold-outline-btn"
              >
                VIEW MORE
              </Link>

            </div>
          )}

        </div>
      </section>

      {/* =====================================================
          ATTRACTIONS
      ===================================================== */}

      {attractions.length > 0 && (
        <section className="destination-attractions-section">
          <div className="container">

            <div className="section-heading-row attraction-heading">

              <div>

                <span className="section-eyebrow">
                  EXPLORE & EXPERIENCE
                </span>

                <h2>
                  Top Attractions in{" "}
                  {destName}
                </h2>

                <p>
                  Discover places worth
                  visiting, from iconic landmarks
                  to unforgettable natural
                  experiences.
                </p>

              </div>

              <div className="attraction-controls">

                <button
                  type="button"
                  onClick={() =>
                    attractionTrackRef.current?.scrollBy(
                      {
                        left: -360,
                        behavior: "smooth",
                      }
                    )
                  }
                  aria-label="Previous attractions"
                >
                  <FaChevronLeft />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    attractionTrackRef.current?.scrollBy(
                      {
                        left: 360,
                        behavior: "smooth",
                      }
                    )
                  }
                  aria-label="Next attractions"
                >
                  <FaChevronRight />
                </button>

              </div>
            </div>

            <div
              className="attraction-track"
              ref={attractionTrackRef}
            >

              {attractions.map(
                (attraction, index) => {

                  const attrName =
                    attraction.attraction_name ||
                    attraction.name ||
                    `Attraction ${
                      index + 1
                    }`;

                  const attrImg =
                    attraction.image ||
                    attraction.image_url;

                  return (
                    <article
                      className="attraction-card"
                      key={
                        attraction.id ||
                        index
                      }
                    >

                      <div className="attraction-image">

                        {attrImg ? (
                          <img
                            src={attrImg}
                            alt={attrName}
                          />
                        ) : (
                          <div className="attraction-image-placeholder">
                            <FaGlobe />
                          </div>
                        )}

                        <div className="attraction-overlay" />

                        <h3>
                          {attrName}
                        </h3>

                      </div>

                    </article>
                  );
                }
              )}

            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="destination-final-cta">
        <div className="container">

          <div className="final-cta-inner">

            <div>

              <span>
                READY FOR YOUR NEXT ESCAPE?
              </span>

              <h2>
                Plan your {destName} journey
                with Tripist.
              </h2>

            </div>

            <Link
              to={`/contact-us?destinationId=${destinationId}&destinationName=${encodeURIComponent(
                destName
              )}`}
              className="final-cta-btn"
            >
              Plan My Trip{" "}
              <FaArrowRight />
            </Link>

          </div>
        </div>
      </section>

    </main>
  );
};

export default DestinationDetails;