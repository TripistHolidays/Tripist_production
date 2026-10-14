import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaHotel,
  FaUtensils,
  FaCar,
  FaCamera,
  FaShieldAlt,
  FaInfoCircle,
  FaTimesCircle,
  FaQuestionCircle,
  FaChevronDown,
  FaClock,
  FaWifi,
  FaSwimmingPool,
  FaPlane,
  FaTrain,
  FaShip,
  FaPassport,
  FaSpa,
  FaDumbbell,
  FaGlassCheers,
  FaUmbrellaBeach,
  FaSuitcaseRolling,
  FaBed,
  FaBell,
  FaTshirt,
  FaParking,
  FaChild,
  FaBus,
  FaMapMarkedAlt,
  FaUserTie,
  FaHeadset,
  FaCheck,
  FaMountain,
  FaTree,
  FaShoppingBag,
  FaFirstAid,
  FaHeartbeat,
} from "react-icons/fa";

import { api, toPackageSlug } from "../Admin/api";
import ContactModal from "../Components/ContactModal";
import "./ExplorePackages.css";

/* =========================================================
   AMENITY ICONS MAPPING & HELPER
========================================================= */
const AMENITY_ICONS = {
  hotel: <FaHotel />,
  wifi: <FaWifi />,
  pool: <FaSwimmingPool />,
  car: <FaCar />,
  bus: <FaBus />,
  utensils: <FaUtensils />,
  food: <FaUtensils />,
  camera: <FaCamera />,
  guide: <FaUserTie />,
  support: <FaHeadset />,
  shield: <FaShieldAlt />,
  flight: <FaPlane />,
  plane: <FaPlane />,
  train: <FaTrain />,
  ship: <FaShip />,
  passport: <FaPassport />,
  spa: <FaSpa />,
  gym: <FaDumbbell />,
  fitness: <FaDumbbell />,
  drinks: <FaGlassCheers />,
  beach: <FaUmbrellaBeach />,
  mountain: <FaMountain />,
  tree: <FaTree />,
  shopping: <FaShoppingBag />,
  medical: <FaFirstAid />,
  health: <FaHeartbeat />,
  luggage: <FaSuitcaseRolling />,
  bed: <FaBed />,
  bell: <FaBell />,
  laundry: <FaTshirt />,
  parking: <FaParking />,
  child: <FaChild />,
  map: <FaMapMarkedAlt />,
  check: <FaCheckCircle />,
};

const getAmenityIcon = (iconName) => {
  if (!iconName) {
    return <FaCheckCircle />;
  }
  const key = String(iconName).toLowerCase().trim();
  return AMENITY_ICONS[key] || <FaCheckCircle />;
};

/* =========================================================
   TRAVEL TIPS
========================================================= */

const travelTips = [
  {
    number: "01",
    title: "Plan Around the Season",
    text: "Choose the right travel season for better weather, experiences, and value."
  },
  {
    number: "02",
    title: "Keep Your Itinerary Flexible",
    text: "Leave room for local discoveries, relaxed moments, and unexpected experiences."
  }
];

/* =========================================================
   FORMAT DATE TO dd/mm/yyyy
   Accepts: "2026-12-31", "2026-12-31T00:00:00Z", Date object
========================================================= */
const formatDateToDMY = (value) => {
  if (!value) return "";

  if (value instanceof Date && !isNaN(value)) {
    const d = String(value.getDate()).padStart(2, "0");
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const y = value.getFullYear();
    return `${d}/${m}/${y}`;
  }

  const str = String(value).trim();
  if (!str) return "";

  if (/^\d{2}\/\d{2}\/\d{4}\$/.test(str)) {
    return str;
  }

  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return `${d}/${m}/${y}`;
  }

  const parsed = new Date(str);
  if (!isNaN(parsed)) {
    const d = String(parsed.getDate()).padStart(2, "0");
    const m = String(parsed.getMonth() + 1).padStart(2, "0");
    const y = parsed.getFullYear();
    return `${d}/${m}/${y}`;
  }

  return str;
};

/* =========================================================
   NORMALIZE AMENITIES
========================================================= */

const normalizeAmenities = (value) => {
  if (!value) {
    return [];
  }

  let parsed = value;

  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch (error) {
      console.error("Failed to parse amenities:", error);
      return [];
    }
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .map((amenity) => {
      if (typeof amenity === "string") {
        return {
          name: amenity,
          icon: "check"
        };
      }

      if (amenity && typeof amenity === "object") {
        return {
          name:
            amenity.name ||
            amenity.text ||
            amenity.title ||
            "Amenity",

          icon:
            amenity.icon ||
            "check"
        };
      }

      return null;
    })
    .filter(
      (amenity) =>
        amenity &&
        amenity.name &&
        String(amenity.name).trim() !== ""
    );
};


/* =========================================================
   COMPONENT
========================================================= */

export default function ExplorePackages() {
  const { packageSlug } = useParams();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get("id");
  const navigate = useNavigate();

  // Grab preloaded package synchronously in 0ms if available!
  const initialCached = api.getCachedPackageSync
    ? api.getCachedPackageSync(queryId || packageSlug)
    : null;

  const [packageId, setPackageId] = useState(
    initialCached ? initialCached.id || initialCached._id : null
  );
  const [packageData, setPackageData] = useState(initialCached);
  const [loading, setLoading] = useState(!initialCached);
  const [error, setError] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeDay, setActiveDay] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* =========================================================
     FETCH PACKAGE
  ========================================================= */

  useEffect(() => {
    if (!packageSlug && !queryId) {
      setError(
        "No package selected. Please select a package from our listings."
      );
      setLoading(false);
      return;
    }

    let isMounted = true;

    // Immediately show cached data if available so there is 0ms delay
    const syncHit = api.getCachedPackageSync
      ? api.getCachedPackageSync(queryId || packageSlug)
      : null;

    if (syncHit) {
      setPackageData(syncHit);
      setPackageId(syncHit.id || syncHit._id);
      setLoading(false);

      if (queryId) {
        const slug = toPackageSlug(syncHit.name || syncHit.package_name || "");
        if (slug) {
          window.history.replaceState(null, "", `/package/${slug}`);
        }
      }
    } else {
      setLoading(true);
    }

    const fetchPackage = async () => {
      setError(null);

      try {
        let data;

        if (queryId) {
          data = await api.getPackageById(queryId);
          const slug = toPackageSlug(data.name || data.package_name || "");
          if (slug) {
            window.history.replaceState(null, "", `/package/${slug}`);
          }
        } else {
          data = await api.getPackageBySlug(packageSlug);
        }

        if (!isMounted) return;

        const normalized = { ...data };

        /* =====================================================
           NORMALIZE JSON DATABASE COLUMNS
        ===================================================== */

        if (typeof normalized.itinerary === "string") {
          try {
            normalized.itinerary = JSON.parse(normalized.itinerary);
          } catch (e) {
            console.error("Failed to parse itinerary:", e);
            normalized.itinerary = [];
          }
        }

        if (typeof normalized.faqs === "string") {
          try {
            normalized.faqs = JSON.parse(normalized.faqs);
          } catch (e) {
            console.error("Failed to parse FAQs:", e);
            normalized.faqs = [];
          }
        }

        /* =====================================================
           NORMALIZE AMENITIES
        ===================================================== */

        normalized.amenities = normalizeAmenities(normalized.amenities);

        setPackageId(normalized.id || normalized._id);
        setPackageData(normalized);
      } catch (err) {
        console.error("Failed to load package details:", err);
        if (isMounted && !syncHit) {
          setError("Failed to load package details.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPackage();

    return () => {
      isMounted = false;
    };
  }, [packageSlug, queryId]);


  /* =========================================================
     BOOK NOW
  ========================================================= */

  const handleBookNow = () => {
    if (!packageData) {
      return;
    }

    setIsModalOpen(true);
  };


  /* =========================================================
     FAQ
  ========================================================= */

  const toggleFaq = (index) => {
    setActiveFaq(
      activeFaq === index
        ? null
        : index
    );
  };


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center py-5 my-5"
        style={{
          minHeight: "50vh"
        }}
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


  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !packageData) {
    return (
      <div className="text-center py-5 my-5">

        <h4 className="text-danger">
          {error ||
            "Package unavailable"}
        </h4>

        <button
          onClick={() =>
            navigate(
              "/destinations"
            )
          }
          className="btn btn-gold-tripist mt-3"
        >
          Back to Destinations
        </button>

      </div>
    );
  }


  /* =========================================================
     PACKAGE DATA
  ========================================================= */

  const durationDays =
    packageData.durationDays ||
    packageData.duration_days;

  const durationNights =
    packageData.durationNights ||
    packageData.duration_nights;

  const shortDesc =
    packageData.shortDescription ||
    packageData.short_description;

  const longDesc =
    packageData.longDescription ||
    packageData.long_description;

  const validUntil =
    packageData.validUntil ||
    packageData.valid_until;

  const inclusions =
    packageData.inclusions || [];

  const exclusions =
    packageData.exclusions || [];

  const itinerary =
    packageData.itinerary || [];

  const faqs =
    packageData.faqs || [];


  /* =========================================================
     AMENITIES FROM DATABASE
  ========================================================= */

  const amenities =
    normalizeAmenities(
      packageData.amenities
    );


  return (
    <main className="explore-page-wrapper">


      {/* =====================================================
          HERO BANNER
      ===================================================== */}

      <section
        className="explore-hero-banner"
        style={{
          backgroundImage:
            packageData.image
              ? `url(${packageData.image})`
              : undefined
        }}
      >

        <div className="explore-hero-overlay"></div>

        <div className="container position-relative text-start z-2">

          <p className="explore-hero-subtitle">
            {packageData.category?.toUpperCase() ||
              "CURATED ESCAPE"}
          </p>

          <h1 className="explore-hero-title">
            {packageData.name}
          </h1>

          <p className="explore-hero-description">
            {shortDesc ||
              "Handcrafted itinerary designed to make your journey extraordinary."}
          </p>

        </div>

      </section>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section
        className="py-5"
        id="packages"
      >

        <div className="container">

          <div className="row g-5">


            {/* =================================================
                LEFT CONTENT
            ================================================= */}

            <div className="col-12 col-lg-8">


              {/* HERO IMAGE */}

              <div className="package-hero-container position-relative rounded-4 overflow-hidden mb-4 shadow-sm">

                <img
                  src={
                    packageData.image ||
                    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={packageData.name}
                  className="w-100 h-100 object-fit-cover"
                />

              </div>


              {/* =================================================
                  HEADER BADGES
              ================================================= */}

              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">

                <div className="d-flex align-items-center gap-2 text-muted">

                  <FaMapMarkerAlt className="text-danger" />

                  <span className="fw-semibold">

                    {packageData.state
                      ? `${packageData.state}, `
                      : ""}

                    {packageData.country ||
                      "India"}

                  </span>

                </div>


                {(durationDays ||
                  durationNights) && (

                    <div className="d-flex align-items-center gap-2 text-secondary bg-light px-3 py-1 rounded-pill border">

                      <FaCalendarAlt className="text-warning" />

                      <span className="small fw-semibold">

                        {durationDays
                          ? `${durationDays}D`
                          : ""}

                        {durationNights
                          ? ` / ${durationNights}N`
                          : ""}

                      </span>

                    </div>

                  )}

              </div>


              {/* PACKAGE NAME */}

              <h2 className="fw-bold text-navy font-georgia mb-3">
                {packageData.name}
              </h2>


              {/* =================================================
                  SHORT DESCRIPTION
              ================================================= */}

              {shortDesc && (

                <div className="mb-4 p-3 rounded-3 bg-light border-start border-4 border-warning shadow-sm">

                  <div className="d-flex align-items-center gap-2 mb-1">

                    <FaInfoCircle className="text-warning" />

                    <h5 className="fw-bold text-navy m-0">
                      Package Highlights
                    </h5>

                  </div>

                  <p className="text-secondary m-0 mt-2 leading-relaxed font-sm">
                    {shortDesc}
                  </p>

                </div>

              )}


              {/* =================================================
                  LONG DESCRIPTION
              ================================================= */}

              {longDesc && (

                <div className="mb-5">

                  <h4 className="fw-bold text-navy font-georgia">
                    Trip Overview
                  </h4>

                  <p
                    className="text-secondary leading-relaxed mt-2"
                    style={{
                      whiteSpace:
                        "pre-line"
                    }}
                  >
                    {longDesc}
                  </p>

                </div>

              )}


              {/* =================================================
                  INCLUSIONS & EXCLUSIONS
              ================================================= */}

              {(inclusions.length > 0 ||
                exclusions.length > 0) && (

                  <div className="mb-5">

                    <h4 className="fw-bold text-navy font-georgia mb-3">
                      What's Included & Excluded
                    </h4>

                    <div className="row g-4">


                      {/* INCLUDED */}

                      {inclusions.length > 0 && (

                        <div className="col-12 col-md-6">

                          <div className="p-3 rounded-3  include shadow-sm h-100">

                            <h6 className="fw-bold text-success mb-3 d-flex align-items-center gap-2">

                              <FaCheckCircle />

                              Included in Package

                            </h6>


                            <ul className="list-unstyled mb-0 d-flex flex-column gap-2 font-sm">

                              {inclusions.map(
                                (inc, i) => (

                                  <li
                                    key={i}
                                    className="d-flex align-items-start gap-2 text-secondary"
                                  >

                                    <span className="text-success p-auto ">
                                      •
                                    </span>

                                    {inc}

                                  </li>

                                )
                              )}

                            </ul>

                          </div>

                        </div>

                      )}


                      {/* EXCLUDED */}

                      {exclusions.length > 0 && (

                        <div className="col-12 col-md-6">

                          <div className="p-3 rounded-3 border exclude shadow-sm h-100">

                            <h6 className="fw-bold text-danger mb-3 d-flex align-items-center gap-2">

                              <FaTimesCircle />

                              Excluded from Package

                            </h6>


                            <ul className="list-unstyled mb-0 d-flex flex-column gap-2 font-sm">

                              {exclusions.map(
                                (exc, i) => (

                                  <li
                                    key={i}
                                    className="d-flex align-items-start gap-2 text-secondary"
                                  >

                                    <span className="text-danger p-auto ">
                                      •
                                    </span>

                                    {exc}

                                  </li>

                                )
                              )}

                            </ul>

                          </div>

                        </div>

                      )}

                    </div>

                  </div>

                )}


              {/* =================================================
                  ITINERARY
              ================================================= */}

              {itinerary.length > 0 && (

                <div className="mb-5 itinerary-section">

                  <div className="itinerary-heading">

                    <div>

                      <span className="itinerary-eyebrow">
                        YOUR JOURNEY
                      </span>

                      <h4 className="fw-bold text-navy font-georgia mb-1">
                        Day-by-Day Itinerary
                      </h4>

                      <p className="text-secondary font-sm mb-0">
                        Explore your trip one day at a time.
                      </p>

                    </div>


                    <span className="itinerary-count">

                      {itinerary.length}{" "}

                      {itinerary.length === 1
                        ? "DAY"
                        : "DAYS"}

                    </span>

                  </div>


                  <div className="itinerary-accordion">

                    {itinerary.map(
                      (dayItem, idx) => {

                        const isOpen =
                          activeDay === idx;


                        return (

                          <div
                            key={idx}
                            className={`itinerary-day ${isOpen
                              ? "is-open"
                              : ""
                              }`}
                          >

                            <button
                              type="button"
                              className="itinerary-day-trigger"
                              onClick={() =>
                                setActiveDay(
                                  isOpen
                                    ? null
                                    : idx
                                )
                              }
                              aria-expanded={
                                isOpen
                              }
                            >

                              <span className="day-number">

                                <span>
                                  DAY
                                </span>

                                {String(
                                  dayItem.day ||
                                  idx + 1
                                ).padStart(
                                  2,
                                  "0"
                                )}

                              </span>


                              <span className="day-summary">

                                <strong>
                                  {dayItem.title ||
                                    `Day ${idx + 1
                                    }`}
                                </strong>


                                {dayItem.date && (

                                  <small>

                                    <FaClock />

                                    {dayItem.date}

                                  </small>

                                )}

                              </span>


                              <span className="day-chevron">
                                <FaChevronDown />
                              </span>

                            </button>


                            <div
                              className={`itinerary-day-content ${isOpen
                                ? "show"
                                : ""
                                }`}
                            >

                              <div className="day-content-inner">

                                <div className="day-content-line"></div>

                                <div>

                                  <span className="day-content-label">
                                    ITINERARY DETAILS
                                  </span>

                                  <p>

                                    {dayItem.activities ||
                                      "Enjoy a thoughtfully planned day with memorable experiences."}

                                  </p>

                                </div>

                              </div>

                            </div>

                          </div>

                        );

                      }
                    )}

                  </div>

                </div>

              )}


              {/* =================================================
                  AMENITIES FROM DATABASE
              ================================================= */}

              <div className="mb-5">

                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">

                  <div>

                    <h4 className="fw-bold text-navy font-georgia mb-1">
                      Amenities
                    </h4>

                    <p className="text-secondary font-sm mb-0">
                      Amenities included with this package.
                    </p>

                  </div>


                  {amenities.length > 0 && (

                    <span className="badge rounded-pill bg-light text-secondary border px-3 py-2">

                      {amenities.length}{" "}

                      {amenities.length === 1
                        ? "Amenity"
                        : "Amenities"}

                    </span>

                  )}

                </div>


                {amenities.length > 0 ? (

                  <div className="row g-3">

                    {amenities.map(
                      (amenity, index) => (

                        <div
                          key={`${amenity.name}-${index}`}
                          className="col-12 col-sm-4"
                        >

                          <div className="d-flex align-items-center gap-3 p-3 rounded-3 shadow-sm border bg-white amenity-card h-100">

                            <span className="fs-5 text-warning amenity-icon d-inline-flex align-items-center justify-content-center">

                              {getAmenityIcon(
                                amenity.icon
                              )}

                            </span>


                            <span className="fw-medium text-dark font-sm">

                              {amenity.name}

                            </span>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <div className="p-4 rounded-3 border bg-light text-center">

                    <FaInfoCircle className="text-muted mb-2" />

                    <p className="text-muted mb-0 font-sm">
                      No amenities have been added to this package yet.
                    </p>

                  </div>

                )}

              </div>


              {/* =================================================
                  FAQS
              ================================================= */}

              {faqs.length > 0 && (

                <div className="mb-4">

                  <h4 className="fw-bold text-navy font-georgia mb-3">
                    Frequently Asked Questions
                  </h4>


                  <div className="d-flex flex-column gap-2">

                    {faqs.map(
                      (faq, idx) => (

                        <div
                          key={idx}
                          className="border rounded-3 bg-white overflow-hidden shadow-sm"
                        >

                          <button
                            type="button"
                            className="w-100 p-3 text-start bg-white border-0 d-flex align-items-center justify-content-between fw-bold text-navy"
                            onClick={() =>
                              toggleFaq(idx)
                            }
                          >

                            <span className="d-flex align-items-start gap-2 fs-sm">

                              <FaQuestionCircle className="text-warning mt-1" />

                              {faq.question}

                            </span>


                            <FaChevronDown
                              className="transition-transform"
                              style={{
                                transform:
                                  activeFaq ===
                                    idx
                                    ? "rotate(180deg)"
                                    : "rotate(0deg)",

                                transition:
                                  "0.2s"
                              }}
                            />

                          </button>


                          {activeFaq === idx && (

                            <div className="p-3 bg-light border-top text-secondary font-sm">

                              {faq.answer}

                            </div>

                          )}

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}

            </div>


            {/* =================================================
                RIGHT SIDEBAR
            ================================================= */}

            <div className="col-12 col-lg-4">

              <div
                className="card shadow-sm border-0 p-4 sticky-top rounded-4 bg-white"
                style={{
                  top: "90px"
                }}
              >

                <small
                  className="text-muted text-uppercase fw-semibold"
                  style={{
                    fontSize: "11px",
                    letterSpacing:
                      "0.5px"
                  }}
                >
                  STARTS FROM
                </small>


                <h2 className="fw-bold text-navy my-2">

                  {packageData.price
                    ? (
                      String(
                        packageData.price
                      ).startsWith("₹") ||
                      String(
                        packageData.price
                      ).startsWith("\$")
                    )
                      ? packageData.price
                      : `₹ ${packageData.price}`
                    : "Price On Request"}


                  <span className="fs-6 text-muted fw-normal">
                    {" "}
                    / person
                  </span>

                </h2>


                {validUntil && (

                  <p className="font-xs text-danger fw-semibold mb-3">

                    Valid upto :{" "}
                    {formatDateToDMY(validUntil)}

                  </p>

                )}


                <ul className="list-unstyled my-4 text-secondary font-sm">

                  <li className="mb-2">

                    <FaCheckCircle className="text-success me-2" />

                    Guaranteed Best Service

                  </li>


                  <li className="mb-2">

                    <FaCheckCircle className="text-success me-2" />

                    Flexible Travel Dates

                  </li>


                  <li className="mb-2">

                    <FaCheckCircle className="text-success me-2" />

                    Customizable Itinerary

                  </li>

                </ul>


                <button
                  onClick={handleBookNow}
                  className="btn btn-gold-tripist w-100 py-3 rounded-pill fw-bold text-dark"
                >
                  Enquire Now →
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          TRAVEL WISDOM
      ===================================================== */}

      <section className="py-5 bg-soft-beige">

        <div className="container">

          <div className="row align-items-center g-5">


            <div className="col-lg-6">

              <span className="explore-label-gold">
                TRAVEL YOUR WAY
              </span>

              <h2 className="explore-title-dark font-georgia mt-2">

                More than a package.

                <br />

                <span className="text-trip-gold font-georgia italic-style">
                  It's your journey.
                </span>

              </h2>


              <p className="text-secondary mt-3">

                Every traveller has a different idea of the perfect holiday. That's why our packages are designed as flexible starting points that can be shaped around your interests and travel style.

              </p>

            </div>


            <div className="col-lg-6">

              <div className="d-flex flex-column gap-3">

                {travelTips.map(
                  (tip) => (

                    <div
                      className="d-flex gap-3 align-items-start p-3 bg-white rounded-3 shadow-sm"
                      key={tip.number}
                    >

                      <span className="text-trip-gold fw-bold fs-5">
                        {tip.number}
                      </span>


                      <div>

                        <h5 className="fw-bold m-0 font-georgia">
                          {tip.title}
                        </h5>

                        <p className="text-secondary m-0 mt-1 font-sm">
                          {tip.text}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CONTACT MODAL
      ===================================================== */}

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialPackageName={packageData?.name || ""}
        initialPackageId={packageData?.id || packageId || ""}
        initialPackagePrice={packageData?.price || ""}
        initialDurationDays={packageData?.durationDays || packageData?.duration_days || ""}
        initialDurationNights={packageData?.durationNights || packageData?.duration_nights || ""}
      />

    </main>
  );
}