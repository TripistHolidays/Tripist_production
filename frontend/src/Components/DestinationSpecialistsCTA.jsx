import React from "react";
import { Link } from "react-router-dom";
import "./DestinationSpecialistsCTA.css";

const DestinationSpecialistsCTA = () => {
  return (
    <section className="DestiCTA text-white py-5 px-3 position-relative overflow-hidden">
      <div className="container py-4 position-relative z-1">
        <div className="row align-items-center g-4">
          {/* Left Side: Content Block */}
          <div className="col-12 col-lg-6 text-center text-lg-start">
            {/* Cursive Subtitle */}
            <span className="desti-cta-script d-block mb-1">
              Certified Travel Expertise
            </span>

            {/* Main Heading */}
            <h2 className="display-6 fw-bold text-white mb-3">
              Plan Your Next Journey with Official Specialists!
            </h2>

            {/* Supporting Text */}
            <p className="lead text-light text-opacity-85 fs-6 mb-4 col-lg-11">
              From the turquoise waters of Mauritius and Fiji to the
              breathtaking landscapes of New Zealand, our certified experts
              craft tailor-made itineraries backed by official tourism board
              accreditations.
            </p>

            {/* Orange Pill Link Button */}
            <Link
              to="/destination-specialists"
              className="btn desti-cta-orange-btn rounded-pill px-4 py-3 fw-bold border-0 text-decoration-none d-inline-block"
            >
              Explore Destination Specialists
            </Link>
          </div>

          {/* Right Side: Floating Image Cards */}
          <div className="col-12 col-lg-6">
            <div className="desti-cta-image-wrapper d-flex justify-content-center justify-content-lg-end align-items-center gap-3">
              {/* Image 1: Mauritius */}
              <div className="desti-card card-1 position-relative">
                <span className="desti-badge-overlay shadow-sm">
                  <img
                    src="https://flagcdn.com/w40/mu.png"
                    alt="Mauritius flag"
                    className="country-flag"
                  />
                  Mauritius
                </span>
                <img
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80"
                  alt="Mauritius"
                  className="img-fluid rounded-4 shadow"
                />
              </div>
              {/* Image 2: Fiji */}
              <div className="desti-card card-2 position-relative">
                <span className="desti-badge-overlay shadow-sm">
                  <img
                    src="https://flagcdn.com/w40/fj.png"
                    alt="Fiji flag"
                    className="country-flag"
                  />
                  Fiji
                </span>
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80"
                  alt="Fiji"
                  className="img-fluid rounded-4 shadow"
                />
              </div>
              {/* Image 3: New Zealand */}
              <div className="desti-card card-3 position-relative">
                <span className="desti-badge-overlay shadow-sm">
                  <img
                    src="https://flagcdn.com/w40/nz.png"
                    alt="New Zealand flag"
                    className="country-flag"
                  />
                  New Zealand
                </span>
                <img
                  src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80"
                  alt="New Zealand"
                  className="img-fluid rounded-4 shadow"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DestinationSpecialistsCTA;
