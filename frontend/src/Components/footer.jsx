import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from "../assets/logo 3.png";
import { api } from "../Admin/api";

const Footer = () => {
  const [settings, setSettings] = useState({
    phone: "+91 96555 96867",
    email: "info@tripistholidays.com",
    address: "Tamil Nadu, India",
    instagramUrl: "https://www.instagram.com/tripistholidays",
    facebookUrl: "https://www.facebook.com/tripistholidays",
    youtubeUrl: "https://www.youtube.com/@TripistHolidays",
    linkedinUrl: "https://www.linkedin.com/company/tripistholidays",
  });

  useEffect(() => {
    api
      .getContact()
      .then((data) => {
        if (data && !data.error && Object.keys(data).length > 0) {
          setSettings((prev) => ({
            ...prev,
            phone: data.phone || prev.phone,
            email: data.email || prev.email,
            address: data.address || prev.address,
            instagramUrl: data.instagram || prev.instagramUrl,
            facebookUrl: data.facebook || prev.facebookUrl,
            youtubeUrl: data.youtube || prev.youtubeUrl,
            linkedinUrl: data.linkedin || prev.linkedinUrl,
          }));
        }
      })
      .catch((err) => console.error("Error fetching contact details:", err));
  }, []);

  return (
    <footer
      style={{ backgroundColor: "var(--trip-navy, #0c1829)" }}
      className="text-white pt-5 footer-wrapper"
    >
      <div className="container">
        <div className="row gy-4 pb-4">
          {/* Brand */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="d-flex align-items-baseline gap-1 mb-3">
              <img
                src={logo}
                alt="Tripist Holidays"
                className="footer-logo"
              />
            </div>

            <p className="text-white-50 small mb-4 pe-lg-2">
              Seamless, inspiring, and memorable travel experiences that bring
              people closer to the world's most extraordinary destinations.
            </p>

            {/* Social Media */}
            <div className="d-flex gap-2">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="social-icon d-flex align-items-center justify-content-center rounded-circle"
                >
                  <i className="bi bi-instagram"></i>
                </a>
              )}

              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="social-icon d-flex align-items-center justify-content-center rounded-circle"
                >
                  <i className="bi bi-facebook"></i>
                </a>
              )}

              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="social-icon d-flex align-items-center justify-content-center rounded-circle"
                >
                  <i className="bi bi-youtube"></i>
                </a>
              )}

              {settings.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="social-icon d-flex align-items-center justify-content-center rounded-circle"
                >
                  <i className="bi bi-linkedin"></i>
                </a>
              )}
            </div>
          </div>

          {/* Company */}
          <div className="col-6 col-md-3 col-lg-3 mt-md-4 mt-lg-5">
            <h6
              className="text-gold text-uppercase fw-semibold mb-3 footer-heading"
              style={{ letterSpacing: ".5px" }}
            >
              Company
            </h6>

            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <Link
                  to="/about-us"
                  className="footer-link text-white-50 text-decoration-none small d-inline-block py-1 py-md-0"
                >
                  About Us
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/AboutTripist"
                  className="footer-link text-white-50 text-decoration-none small d-inline-block py-1 py-md-0"
                >
                  Our Vision & Mission
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/contact-us"
                  className="footer-link text-white-50 text-decoration-none small d-inline-block py-1 py-md-0"
                >
                  Contact Us
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/becamepartner"
                  className="footer-link text-white-50 text-decoration-none small d-inline-block py-1 py-md-0"
                >
                  Become a Partner
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/CreatorPorgram"
                  className="footer-link text-white-50 text-decoration-none small d-inline-block py-1 py-md-0"
                >
                  Creator Program
                </Link>
              </li>
              
            </ul>
          </div>

          {/* Services */}
          <div className="col-6 col-md-3 col-lg-3 mt-md-4 mt-lg-5">
            <h6
              className="text-gold text-uppercase fw-semibold mb-3 footer-heading"
              style={{ letterSpacing: ".5px" }}
            >
              Services
            </h6>

            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <Link
                  to="/domestic"
                  className="footer-link text-white-50 text-decoration-none small d-inline-block py-1 py-md-0"
                >
                  Domestic Tours
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/international"
                  className="footer-link text-white-50 text-decoration-none small d-inline-block py-1 py-md-0"
                >
                  International Tours
                </Link>
              </li>

              
            </ul>
          </div>

          {/* Legal */}
          <div className="col-12 col-md-6 col-lg-3 mt-md-4 mt-lg-5">
            <h6
              className="text-gold text-uppercase fw-semibold mb-3 footer-heading"
              style={{ letterSpacing: ".5px" }}
            >
              Legal
            </h6>

            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <Link
                  to="/PrivacyPolicy"
                  className="footer-link text-white-50 text-decoration-none small d-inline-block py-1 py-md-0"
                >
                  Privacy Policy
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/terms"
                  className="footer-link text-white-50 text-decoration-none small d-inline-block py-1 py-md-0"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/CancellationRefundPolicy"
                  className="footer-link text-white-50 text-decoration-none small d-inline-block py-1 py-md-0"
                >
                  Cancellation & Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Details Bar */}
        <div
          className="row py-3 py-lg-4 g-3"
          style={{
            borderTop: "1px solid rgba(212,175,55,0.2)",
          }}
        >
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center justify-content-start justify-content-md-center gap-2 text-white-50">
              <Phone size={16} className="text-gold flex-shrink-0" />
              <a
                href={`tel:${settings.phone}`}
                className="text-white-50 text-decoration-none small"
              >
                {settings.phone}
              </a>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center justify-content-start justify-content-md-center gap-2 text-white-50">
              <Mail size={16} className="text-gold flex-shrink-0" />
              <a
                href={`mailto:${settings.email}`}
                className="text-white-50 text-decoration-none small text-truncate"
              >
                {settings.email}
              </a>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="d-flex align-items-start justify-content-start justify-content-md-center gap-2 text-white-50">
              <MapPin size={16} className="text-gold mt-1 flex-shrink-0" />
              <span className="small" style={{ whiteSpace: "pre-line" }}>
                {settings.address}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="d-flex flex-column-reverse flex-md-row align-items-center justify-content-between gap-3 py-3 small text-white-50"
          style={{
            borderTop: "1px solid rgba(212,175,55,0.2)",
          }}
        >
          <p className="mb-0 text-center text-md-start">
            &copy; {new Date().getFullYear()} Tripist Holidays Private Limited . All rights
            reserved.
          </p>

          <div className="d-flex justify-content-center gap-3 gap-md-4">
            <Link
              to="/PrivacyPolicy"
              className="footer-link text-white-50 text-decoration-none"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="footer-link text-white-50 text-decoration-none"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>

      {/* Embedded Responsive Styles */}
      <style>
        {`
          .footer-logo {
            width: 140px;
            max-width: 100%;
            height: auto;
            object-fit: contain;
          }

          .text-gold {
            color: var(--trip-gold, #d4af37) !important;
          }

          .footer-link {
            transition: color 0.25s ease;
          }

          .footer-link:hover {
            color: var(--trip-gold, #d4af37) !important;
          }

          .social-icon {
            width: 36px;
            height: 36px;
            border: 1px solid rgba(212, 175, 55, 0.4);
            color: var(--trip-gold, #d4af37);
            text-decoration: none;
            transition: all 0.25s ease;
          }

          .social-icon:hover {
            transform: translateY(-4px);
            color: #ffffff !important;
            border-color: var(--trip-gold, #d4af37) !important;
            box-shadow: 0 6px 14px rgba(212, 175, 55, 0.3);
          }

          @media (max-width: 767.98px) {
            .footer-logo {
              width: 120px;
            }
            .footer-heading {
              font-size: 0.85rem;
              margin-bottom: 0.75rem !important;
            }
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;