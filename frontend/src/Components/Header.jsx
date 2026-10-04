import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Menu, X } from "lucide-react";
import navlogo from '../assets/logo 3.png';
import './Header.css';
import { api } from "../Admin/api";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about-us" },
  { label: "Destinations", to: "/destinations" },
  { label: "Domestic", to: "/domestic" },
  { label: "International", to: "/international" },
  { label: "Become Partner", to: "/becamepartner" },
  { label: "Contact", to: "/contact-us" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("+91 96555 96867");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    api.getContact()
      .then((data) => {
        if (data && data.phone) {
          setPhone(data.phone);
        }
      })
      .catch((err) => console.error("Error fetching header contact info:", err));
  }, []);

  return (
    <header
      className="sticky-top"
      style={{
        backgroundColor: scrolled
          ? "rgba(8, 32, 50, 0.7)"
          : "var(--trip-navy)",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--trip-gold)"
          : "1px solid rgba(212,175,55,0.25)",
        boxShadow: scrolled
          ? "0 4px 16px rgba(0,0,0,0.18)"
          : "none",
        transition: "all 0.3s ease",
        zIndex: 1030,
      }}
    >
      <nav
        className="container d-flex align-items-center justify-content-between py-2"
        style={{ height: "76px" }}
      >
        {/* Logo */}
        <Link to="/" className="navlogo" style={{ flexShrink: 0 }}>
          <img src={navlogo} className="logo-img" alt="Tripist Logo" />
        </Link>

        {/* Desktop Nav */}
        <ul className="d-none d-lg-flex align-items-center gap-4 mb-0 list-unstyled">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                className="nav-link-trip text-white-50 fw-medium text-decoration-none"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Right Side */}
        <div className="d-none d-lg-flex align-items-center gap-4">
          <a
            href={`tel:${phone}`}
            className="d-flex align-items-center gap-2 text-white-50 text-decoration-none fw-medium"
          >
            <Phone size={16} className="text-gold" />
            {phone}
          </a>

          <Link to="/contact-us" className="btn-trip">
            Enquire Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="d-lg-none btn p-0 text-white border-0"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div
          className="d-lg-none px-3 pb-4"
          style={{
            backgroundColor: "var(--trip-navy)",
            borderTop: "1px solid rgba(212,175,55,0.25)",
          }}
        >
          <ul className="list-unstyled mb-3">
            {NAV_LINKS.map((link) => (
              <li
                key={link.label}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <Link
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="d-block py-3 text-white-50 text-decoration-none fw-medium"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            to="/contact-us"
            onClick={() => setOpen(false)}
            className="btn-trip d-block text-center"
          >
            Enquire Now
          </Link>
        </div>
      )}

      <style>{`
        .nav-link-trip {
          position: relative;
          padding-bottom: 4px;
          transition: color 0.3s ease;
        }

        .nav-link-trip::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          height: 2px;
          width: 0;
          background-color: var(--trip-gold);
          transition: width 0.25s ease;
        }

        .nav-link-trip:hover {
          color: #fff !important;
        }

        .nav-link-trip:hover::after {
          width: 100%;
        }
      `}</style>
    </header>
  );
};

export default Header;