import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { api } from "../Admin/api";
import "swiper/css";
import "swiper/css/navigation";
import "./Destination.css";

export default function DestinationSlider() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopDestinations = async () => {
      try {
        setLoading(true);
        setError("");

        /*
         * This calls:
         *
         * GET /api/destinations?top=true
         *
         * Backend filters:
         * is_top_destination = true
         */
        const data = await api.listTopDestinations();

        console.log("Top destinations API response:", data);

        const list = Array.isArray(data?.destinations)
          ? data.destinations
          : Array.isArray(data)
          ? data
          : [];

        /*
         * Convert database data into the format
         * required by the destination cards.
         */
        const fetchedDestinations = list.map((item) => ({
          id: item.id,
          title: item.name,

          image:
            Array.isArray(item.hero_slider_images) &&
            item.hero_slider_images.length > 0
              ? item.hero_slider_images[0]
              : item.image ||
                "https://placehold.co/600x400?text=Destination",

          capital: item.capital || "",
          climate: item.climate || "",
        }));

        setDestinations(fetchedDestinations);
      } catch (err) {
        console.error(
          "Error fetching top destinations:",
          err
        );

        setError(
          "Unable to load top destinations. Please try again."
        );

        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopDestinations();
  }, []);

  return (
    <section className="destination-section">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="destination-header">

        <div>
          <h2 className="text-navy fw-bold mb-1">
            Top Trending Destinations
          </h2>

          <div className="d-flex align-items-center gap-3">

            <div className="horline"></div>

            <p className="text-muted mb-0">
              Explore our handpicked top travel destinations.
            </p>

          </div>
        </div>


        {/* =================================================
            SLIDER NAVIGATION BUTTONS
        ================================================= */}
        <div className="slider-buttons">

          <button
            type="button"
            className="custom-prev"
            aria-label="Previous destination"
          >
            ❮
          </button>

          <button
            type="button"
            className="custom-next"
            aria-label="Next destination"
          >
            ❯
          </button>

        </div>

      </div>


      {/* =====================================================
          LOADING
      ===================================================== */}
      {loading && (
        <div className="text-center py-5">

          <div
            className="spinner-border text-primary me-2"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <span>
            Loading top destinations...
          </span>

        </div>
      )}


      {/* =====================================================
          ERROR
      ===================================================== */}
      {!loading && error && (
        <div className="text-center py-5">

          <div className="text-danger mb-2">
            {error}
          </div>

          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>

        </div>
      )}


      {/* =====================================================
          NO DESTINATIONS
      ===================================================== */}
      {!loading &&
        !error &&
        destinations.length === 0 && (
          <div className="text-center py-5 text-muted">

            <h5 className="fw-bold mb-2">
              No Top Destinations Found
            </h5>

            <p className="mb-0">
              Mark destinations as{" "}
              <strong>Top Destination</strong> from the
              Admin Panel to display them here.
            </p>

          </div>
        )}


      {/* =====================================================
          DESTINATION SLIDER
      ===================================================== */}
      {!loading &&
        !error &&
        destinations.length > 0 && (
          <Swiper
            modules={[Navigation]}

            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}

            loop={destinations.length > 5}

            spaceBetween={30}

            slidesPerView={5}

            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 15,
              },

              576: {
                slidesPerView: 2,
                spaceBetween: 20,
              },

              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },

              992: {
                slidesPerView: 4,
                spaceBetween: 25,
              },

              1200: {
                slidesPerView: 5,
                spaceBetween: 30,
              },
            }}

            className="destination-swiper"
          >

            {destinations.map((item, index) => (

              <SwiperSlide
                key={item.id || index}
              >

                <Link
                  to={`/destination-details?id=${item.id}`}
                  className="text-decoration-none"
                >

                  <div className="destination-card">

                    {/* =====================================
                        IMAGE
                    ===================================== */}
                    <div className="destination-image-container position-relative">

                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/600x400?text=Destination";
                        }}
                      />


                      {/* =================================
                          CAPITAL BADGE
                      ================================= */}
                      {item.capital && (
                        <span className="badge bg-warning text-dark position-absolute top-0 end-0 m-2">

                          {item.capital}

                        </span>
                      )}

                    </div>


                    {/* =====================================
                        DESTINATION NAME
                    ===================================== */}
                    <h5 className="fw-bold mt-2 text-navy destination-title mb-1">

                      {item.title}

                    </h5>


                    
                  </div>

                </Link>

              </SwiperSlide>

            ))}

          </Swiper>
        )}

    </section>
  );
}