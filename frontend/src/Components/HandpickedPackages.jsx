
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaUmbrellaBeach,
} from "react-icons/fa";

import { api } from "../Admin/api";

import "swiper/css";
import "swiper/css/navigation";
import "./Handpickedpackages.css";

export default function HandpickedPackages() {
  const [activeTab, setActiveTab] = useState("international");
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // FETCH PACKAGES
  // ============================================================

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.listPackages();

        console.log("FULL PACKAGE RESPONSE:", response);

        // ------------------------------------------------------
        // Handle different API response structures
        // ------------------------------------------------------

        let packageList = [];

        if (Array.isArray(response)) {
          packageList = response;
        } else if (Array.isArray(response?.packages)) {
          packageList = response.packages;
        } else if (Array.isArray(response?.data)) {
          packageList = response.data;
        } else if (Array.isArray(response?.data?.packages)) {
          packageList = response.data.packages;
        }

        console.log("PACKAGE LIST:", packageList);
        setPackages(packageList);

      } catch (err) {
        console.error("Failed to fetch packages:", err);
        setError("Unable to load packages.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // ============================================================
  // FILTER PACKAGES (Domestic vs International based on Country)
  // ============================================================

  const filteredPackages = packages.filter((pkg) => {
    const country = String(pkg.country || "").trim().toLowerCase();
    
    // Assuming domestic packages are in India. Adjust if your domestic keyword differs.
    const isDomestic = country === "india" || country === "local";

    if (activeTab === "domestic") {
      return isDomestic;
    } else {
      return !isDomestic; // International
    }
  });

  // ============================================================
  // IMAGE
  // ============================================================

  const getPackageImage = (item) => {
    if (item.image) {
      return item.image;
    }

    if (item.package_image) {
      return item.package_image;
    }

    if (Array.isArray(item.images) && item.images.length > 0) {
      return item.images[0];
    }

    return "https://placehold.co/600x400?text=Holiday+Package";
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section className="handpicked-section container my-5">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-4">

        <h2 className="fw-bold text-navy mb-1">
          Handpicked Holiday Packages
        </h2>

        <div className="d-flex align-items-center gap-3 mb-4">

          <div className="horline"></div>

          <p className="text-muted mb-0">
            Indulge in unforgettable adventure with special tour plans.
          </p>

        </div>

        {/* =================================================*
            TABS
        ================================================== */}

        <div className="d-flex gap-3">

          <button
            type="button"
            className={`tab-btn ${
              activeTab === "domestic"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("domestic")
            }
          >
            Domestic
          </button>

          <button
            type="button"
            className={`tab-btn ${
              activeTab === "international"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("international")
            }
          >
            International
          </button>

        </div>

      </div>


      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="position-relative">

        {/* PREVIOUS */}

        <button
          type="button"
          className="custom-swiper-prev"
          aria-label="Previous"
        >
          <FaChevronLeft />
        </button>


        {/* NEXT */}

        <button
          type="button"
          className="custom-swiper-next"
          aria-label="Next"
        >
          <FaChevronRight />
        </button>


        {/* =================================================*
            LOADING
        ================================================== */}

        {loading && (
          <div className="text-center py-5">

            <div
              className="spinner-border text-primary"
              role="status"
            />

            <p className="text-muted mt-3">
              Loading packages...
            </p>

          </div>
        )}


        {/* =================================================*
            ERROR
        ================================================== */}

        {!loading && error && (
          <div className="text-center py-5">

            <p className="text-danger">
              {error}
            </p>

          </div>
        )}


        {/* =================================================*
            NO DATA
        ================================================== */}

        {!loading &&
          !error &&
          filteredPackages.length === 0 && (

            <div className="text-center py-5">

              <p className="text-muted mb-2">
                No {activeTab} packages found.
              </p>

              <small className="text-secondary">
                Total packages loaded:{" "}
                {packages.length}
              </small>

            </div>

          )}


        {/* =================================================*
            SWIPER
        ================================================== */}

        {!loading &&
          !error &&
          filteredPackages.length > 0 && (

            <Swiper
              key={activeTab}

              modules={[
                Navigation,
                Autoplay,
              ]}

              navigation={{
                prevEl: ".custom-swiper-prev",
                nextEl: ".custom-swiper-next",
              }}

              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}

              loop={
                filteredPackages.length > 4
              }

              spaceBetween={20}

              slidesPerView={4}

              breakpoints={{
                320: {
                  slidesPerView: 1,
                },

                576: {
                  slidesPerView: 2,
                },

                768: {
                  slidesPerView: 3,
                },

                1200: {
                  slidesPerView: 4,
                },
              }}

              className="packages-swiper py-3 px-1"
            >

              {filteredPackages.map(
                (item) => (

                  <SwiperSlide
                    key={item.id}
                  >

                    {/* =================================================*
                        PACKAGE CARD
                    ================================================== */}

                    <div className="pkg-card">

                      {/* IMAGE */}

                      <div className="pkg-image-wrapper">

                        <img
                          src={getPackageImage(item)}
                          alt={
                            item.name ||
                            "Holiday Package"
                          }

                          loading="lazy"

                          onError={(e) => {
                            e.currentTarget.src =
                              "https://placehold.co/600x400?text=Holiday+Package";
                          }}
                        />

                      </div>


                      {/* CONTENT */}

                      <div className="pkg-content-box shadow-sm">

                        <div className="d-flex justify-content-between align-items-center mb-2">

                          <h5 className="fw-bold fs-6 text-navy mb-0">

                            {item.name ||
                              item.title ||
                              "Holiday Package"}

                          </h5>

                         

                        </div>


                    

                        


                        {/* PRICE + EXPLORE */}

                        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">

                          <span className="price-text">

                            From{" "}

                            <strong className="text-navy fw-semibold fs-6">

                              {item.price
                                ? item.price
                                : "N/A"}

                            </strong>

                          </span>


                          {/* PACKAGE DETAILS */}

                          <Link
                            to={`/ExplorePackages?id=${item.id}`}
                            className="explore-link"
                          >

                            Explore

                            <FaArrowRight className="ms-1" />

                          </Link>

                        </div>

                      </div>

                    </div>

                  </SwiperSlide>

                )
              )}

            </Swiper>

          )}

      </div>

    </section>
  );
}
