import { useState, useEffect, useRef } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import "./Contact.css";

import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Clock,
  Check,
  Compass,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Loader2,
  BookmarkCheck,
  Navigation,
  ExternalLink,
} from "lucide-react";
import { api } from "../Admin/api";

import banner from "../assets/hero2.jpg";

const Contact = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Data passed from DestinationDetails via React Router state
  const destinationData = location.state?.destinationData;

  const officeLatitude = 13.094364494112748;
  const officeLongitude = 80.20596646854486;
  const locationName = "Tripist Holidays Private Limited";
  const mapZoom = 17;

  const googleDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${officeLatitude},${officeLongitude}`;

  const formRef = useRef(null);
  const dateInputRef = useRef(null);

  // Read URL query parameters
  const queryPackageId = searchParams.get("packageId");
  const queryPackageName = searchParams.get("packageName");
  const queryDays = searchParams.get("days") || "";
  const queryNights = searchParams.get("nights") || "";
  const queryTravelType = searchParams.get("travelType") || "";

  const parsedDays = queryDays ? parseInt(queryDays, 10) : "";
  const parsedNights = queryNights ? parseInt(queryNights, 10) : "";

  // Determine default destination (from package OR from destination details)
  const defaultDestination =
    queryPackageName || destinationData?.name || "";

  const defaultTravelType =
    queryTravelType ||
    (destinationData?.category
      ? destinationData.category.toLowerCase().includes("domestic")
        ? "Domestic"
        : "International"
      : "");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    country: "",
    city: "",
    destination: defaultDestination,
    travelType: defaultTravelType,
    travelDate: "",
    adults: 1,
    children: 0,
    budget: "",
    durationDays: parsedDays,
    durationNights: parsedNights,
    services:
      queryPackageName || destinationData?.name ? ["Holiday Package"] : [],
    message: "", // <-- Always empty; user types their own
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dynamic contact info (fetched from DB)
  const [contactInfo, setContactInfo] = useState({
    phone: "",
    email: "",
    website: "",
    address: "",
  });

  // =========================================================
  // FETCH CONTACT INFO FROM DB
  // =========================================================
  useEffect(() => {
    api
      .getContact()
      .then((data) => {
        if (data) {
          setContactInfo({
            phone: data.phone || "+91 96555 96867",
            email: data.email || "info@tripistholidays.com",
            website: data.website || "www.tripistholidays.com",
            address:
              data.address ||
              "Flat No. 2, Plot No. 1051, I Block 35th Street,\nAnna Nagar, Chennai,\nTamil Nadu – 600040\nIndia",
          });
        }
      })
      .catch((err) =>
        console.error("Error fetching contact info from DB:", err)
      );
  }, []);

  // =========================================================
  // PREFILL FORM WHEN COMING FROM PACKAGE OR DESTINATION
  // (Message stays empty so user can type their own)
  // =========================================================
  useEffect(() => {
    if (queryPackageName) {
      setFormData((prev) => ({
        ...prev,
        destination: queryPackageName,
        durationDays: queryDays
          ? parseInt(queryDays, 10)
          : prev.durationDays,
        durationNights: queryNights
          ? parseInt(queryNights, 10)
          : prev.durationNights,
        services: prev.services.includes("Holiday Package")
          ? prev.services
          : [...prev.services, "Holiday Package"],
      }));
    } else if (destinationData?.name) {
      setFormData((prev) => ({
        ...prev,
        destination: destinationData.name,
        travelType: defaultTravelType || prev.travelType,
        services: prev.services.includes("Holiday Package")
          ? prev.services
          : [...prev.services, "Holiday Package"],
      }));
    }

    // Auto-scroll to form
    if ((queryPackageName || destinationData?.name) && formRef.current) {
      setTimeout(() => {
        formRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryPackageName, queryPackageId, queryDays, queryNights, destinationData]);

  const servicesList = [
    "Holiday Package",
    "Flight Booking",
    "Hotel Booking",
    "Visa Assistance",
    "Cruise",
    "Airport Transfer",
    "Corporate Travel",
    "Other",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleServiceChange = (serviceName) => {
    setFormData((prev) => {
      const isAlreadySelected = prev.services.includes(serviceName);
      const updatedServices = isAlreadySelected
        ? prev.services.filter((s) => s !== serviceName)
        : [...prev.services, serviceName];
      return {
        ...prev,
        services: updatedServices,
      };
    });
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.fullName.trim()) {
      tempErrors.fullName = "Full Name is required";
    }
    if (!formData.email.trim()) {
      tempErrors.email = "Email Address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
    }
    if (!formData.mobile.trim()) {
      tempErrors.mobile = "Mobile Number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      tempErrors.mobile = "Please enter a valid 10-digit mobile number";
    }
    if (!formData.travelType) {
      tempErrors.travelType = "Please select a travel type";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        await api.sendContactEnquiry(formData);
        setSubmitted(true);
        window.scrollTo({ top: 350, behavior: "smooth" });
      } catch (error) {
        console.error("Failed to send contact enquiry:", error);
        alert(error.message || "Failed to submit enquiry. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      mobile: "",
      country: "",
      city: "",
      destination: "",
      travelType: "",
      travelDate: "",
      adults: 1,
      children: 0,
      budget: "",
      durationDays: "",
      durationNights: "",
      services: [],
      message: "",
    });
    setSubmitted(false);
  };

  const businessHours = [
    { day: "Monday", hours: "9:00 AM – 7:00 PM" },
    { day: "Tuesday", hours: "9:00 AM – 7:00 PM" },
    { day: "Wednesday", hours: "9:00 AM – 7:00 PM" },
    { day: "Thursday", hours: "9:00 AM – 7:00 PM" },
    { day: "Friday", hours: "9:00 AM – 7:00 PM" },
    { day: "Saturday", hours: "9:00 AM – 7:00 PM" },
    {
      day: "Sunday",
      hours: "Holiday",
      isSpecial: true,
    },
  ];

  const highlights = [
    "Personalized Travel Consultation",
    "Fast & Reliable Support",
    "Customized Holiday Packages",
    "Domestic & International Expertise",
    "Corporate & Group Travel Solutions",
    "Trusted Travel Partners",
  ];

  return (
    <div className="contact-page-wrapper ">
      {/* Hero Section */}
      <section
        className="contact-hero"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="contact-overlay ">
          <div className="container  text-md-start">
            <p className="section-tag">TRIPIST HOLIDAYS</p>
            <h1>We'd Love to Hear From You</h1>
            <p className="hero-desc">
              Whether you're planning your next holiday, looking for a
              customized travel package, seeking corporate travel solutions, or
              interested in partnering with us, our team is here to assist you.
            </p>
            <p className="hero-subdesc">
              At Tripist Holidays, we are committed to providing prompt,
              reliable, and personalized support to ensure every journey begins
              with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Main Section */}
      <section className="contact-main-section py-5">
        <div className="container">
          <div className="row g-5">
            {/* Left Side: Info */}
            <div className="col-lg-5 col-xl-5">
              <div className="contact-info-column d-flex flex-column gap-4">
                <div className="info-card shadow-sm p-4 rounded-4 bg-white">
                  <h3 className="card-heading-gold border-bottom pb-3 mb-4">
                    <Compass
                      className="icon-title-gold me-2 inline-block"
                      size={24}
                    />
                    Get in Touch
                  </h3>

                  <div className="office-details mb-4">
                    <div className="d-flex align-items-start gap-3">
                      <div className="icon-container-accent">
                        <MapPin size={20} className="text-gold" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-trip mb-1">
                          Registered Office
                        </h5>
                        <p className="office-title text-navy font-bold m-0">
                          Tripist Holidays Private Limited
                        </p>
                        <p
                          className="address-text text-muted mb-0 mt-1"
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {contactInfo.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  <hr className="my-4 text-mutedopacity" />

                  <div className="contact-links-list d-flex flex-column gap-3">
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="contact-link-item d-flex align-items-center gap-3 text-decoration-none"
                    >
                      <div className="icon-container-accent">
                        <Phone size={18} />
                      </div>
                      <div>
                        <span className="small text-muted d-block">Phone</span>
                        <span className="link-value font-bold text-trip">
                          {contactInfo.phone}
                        </span>
                      </div>
                    </a>

                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="contact-link-item d-flex align-items-center gap-3 text-decoration-none"
                    >
                      <div className="icon-container-accent">
                        <Mail size={18} />
                      </div>
                      <div>
                        <span className="small text-muted d-block">Email</span>
                        <span className="link-value font-bold text-trip">
                          {contactInfo.email}
                        </span>
                      </div>
                    </a>

                    <a
                      href={
                        contactInfo.website?.startsWith("http")
                          ? contactInfo.website
                          : `https://${contactInfo.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-link-item d-flex align-items-center gap-3 text-decoration-none"
                    >
                      <div className="icon-container-accent">
                        <Globe size={18} />
                      </div>
                      <div>
                        <span className="small text-muted d-block">Website</span>
                        <span className="link-value font-bold text-trip">
                          {contactInfo.website}
                        </span>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="info-card shadow-sm p-4 rounded-4 bg-white">
                  <h3 className="card-heading-gold border-bottom pb-3 mb-4">
                    <Clock
                      className="icon-title-gold me-2 inline-block"
                      size={24}
                    />
                    Business Hours
                  </h3>
                  <div className="table-responsive">
                    <table className="table table-borderless business-hours-table m-0">
                      <tbody>
                        {businessHours.map((item, index) => (
                          <tr
                            key={index}
                            className={
                              item.isSpecial ? "table-row-special" : ""
                            }
                          >
                            <td className="day-name font-semibold text-trip py-2">
                              {item.day}
                            </td>
                            <td
                              className={`day-hours py-2 text-end ${
                                item.isSpecial
                                  ? "text-gold font-bold"
                                  : "text-muted"
                              }`}
                            >
                              {item.hours}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="business-hours-notice text-muted mt-3 mb-0 small">
                    * Business hours may vary on public holidays.
                  </p>
                </div>

                {/* Why Choose Us */}
                <div className="why-choose-card p-4 rounded-4 bg-navy text-white shadow-sm">
                  <h3 className="mb-4 text-white d-flex align-items-center gap-2">
                    <CheckCircle2 size={24} className="text-gold" />
                    Why Contact Tripist?
                  </h3>
                  <div className="row g-3">
                    {highlights.map((h, i) => (
                      <div className="col-12 col-md-6 col-lg-12" key={i}>
                        <div className="d-flex align-items-start gap-2">
                          <div className="check-bullet bg-gold text-navy rounded-circle p-1 d-flex align-items-center justify-content-center mt-1">
                            <Check size={14} strokeWidth={3} />
                          </div>
                          <span className="highlight-text">{h}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="col-lg-7 col-xl-7" ref={formRef}>
              <div className="form-card shadow p-4 p-md-5 rounded-4 bg-white position-relative overflow-hidden">
                <div className="form-accent-stripe"></div>

                {/* Notification Banner when package OR destination is selected */}
                {(queryPackageName || destinationData?.name) && !submitted && (
                  <div
                    className="alert alert-warning border-0 d-flex align-items-center gap-3 mb-4 p-3 rounded-3 shadow-sm"
                    style={{ background: "#fef9c3", color: "#854d0e" }}
                  >
                    {destinationData?.heroImage ? (
                      <img
                        src={destinationData.heroImage}
                        alt={destinationData.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <BookmarkCheck
                        size={20}
                        className="text-warning flex-shrink-0"
                      />
                    )}
                    <div>
                      {queryPackageName ? (
                        <>
                          Booking enquiry for package:{" "}
                          <strong>{queryPackageName}</strong>
                        </>
                      ) : (
                        <>
                          Enquiry for destination:{" "}
                          <strong>{destinationData.name}</strong>
                          {destinationData?.capital && (
                            <div className="small opacity-75">
                              {destinationData.capital}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {!submitted ? (
                  <>
                    <h2 className="text-trip mb-2">
                      {queryPackageName || destinationData?.name
                        ? "Complete Your Enquiry"
                        : "Send Us an Enquiry"}
                    </h2>
                    <p className="text-muted mb-4">
                      {queryPackageName || destinationData?.name
                        ? "Please fill in your details below to confirm dates and receive a tailored quotation."
                        : "Whether you're planning a vacation or need travel assistance, simply fill out the enquiry form and we'll get back to you as soon as possible."}
                    </p>

                    <form onSubmit={handleSubmit} noValidate>
                      <div className="form-section-title mb-4">
                        <span className="badge bg-navy text-gold me-2">1</span>
                        Personal Information
                      </div>

                      <div className="row g-4 mb-5">
                        <div className="col-12">
                          <div className="form-group-custom">
                            <label htmlFor="fullName" className="required-label">
                              Full Name
                            </label>
                            <input
                              type="text"
                              id="fullName"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              className={`form-control-custom ${
                                errors.fullName ? "is-invalid" : ""
                              }`}
                              placeholder="e.g. Nithesh Kumar"
                              autoComplete="name"
                              required
                            />
                            {errors.fullName && (
                              <div className="invalid-feedback-custom">
                                {errors.fullName}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group-custom">
                            <label htmlFor="email" className="required-label">
                              Email Address
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`form-control-custom ${
                                errors.email ? "is-invalid" : ""
                              }`}
                              placeholder="name@example.com"
                              autoComplete="email"
                              required
                            />
                            {errors.email && (
                              <div className="invalid-feedback-custom">
                                {errors.email}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group-custom">
                            <label htmlFor="mobile" className="required-label">
                              Mobile Number
                            </label>
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength={10}
                              id="mobile"
                              name="mobile"
                              value={formData.mobile}
                              onChange={handleInputChange}
                              className={`form-control-custom ${
                                errors.mobile ? "is-invalid" : ""
                              }`}
                              placeholder="10-digit mobile number"
                              autoComplete="tel"
                              required
                            />
                            {errors.mobile && (
                              <div className="invalid-feedback-custom">
                                {errors.mobile}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group-custom">
                            <label htmlFor="country">Country</label>
                            <input
                              type="text"
                              id="country"
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              className="form-control-custom"
                              placeholder="India"
                              autoComplete="country-name"
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group-custom">
                            <label htmlFor="city">City</label>
                            <input
                              type="text"
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="form-control-custom"
                              placeholder="Chennai"
                              autoComplete="address-level2"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-section-title mb-4">
                        <span className="badge bg-navy text-gold me-2">2</span>
                        Travel Details
                      </div>

                      <div className="row g-4 mb-4">
                        <div className="col-md-6">
                          <div className="form-group-custom">
                            <label htmlFor="destination">
                              Destination / Package
                            </label>
                            <input
                              type="text"
                              id="destination"
                              name="destination"
                              value={formData.destination}
                              onChange={handleInputChange}
                              className="form-control-custom"
                              placeholder="e.g. Maldives, Europe, Kashmir"
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group-custom">
                            <label
                              htmlFor="travelType"
                              className="required-label"
                            >
                              Travel Type
                            </label>
                            <select
                              id="travelType"
                              name="travelType"
                              value={formData.travelType}
                              onChange={handleInputChange}
                              className={`form-select-custom ${
                                errors.travelType ? "is-invalid" : ""
                              }`}
                            >
                              <option value="" disabled>
                                Select Type
                              </option>
                              <option value="Domestic">Domestic</option>
                              <option value="International">
                                International
                              </option>
                            </select>
                            {errors.travelType && (
                              <div className="invalid-feedback-custom">
                                {errors.travelType}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group-custom">
                            <label htmlFor="durationDays">
                              Duration (Days)
                            </label>
                            <input
                              type="number"
                              id="durationDays"
                              name="durationDays"
                              min="1"
                              value={formData.durationDays}
                              onChange={handleInputChange}
                              className="form-control-custom"
                              placeholder="e.g. 5"
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group-custom">
                            <label htmlFor="durationNights">
                              Duration (Nights)
                            </label>
                            <input
                              type="number"
                              id="durationNights"
                              name="durationNights"
                              min="0"
                              value={formData.durationNights}
                              onChange={handleInputChange}
                              className="form-control-custom"
                              placeholder="e.g. 4"
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group-custom">
                            <label htmlFor="travelDate">
                              Tentative Travel Date
                            </label>
                            <div
                              className="date-picker-container"
                              onClick={() => {
                                if (dateInputRef.current) {
                                  if (
                                    typeof dateInputRef.current.showPicker ===
                                    "function"
                                  ) {
                                    dateInputRef.current.showPicker();
                                  } else {
                                    dateInputRef.current.focus();
                                  }
                                }
                              }}
                            >
                              <input
                                type="text"
                                id="travelDate"
                                name="travelDateDisplay"
                                readOnly
                                placeholder="dd/mm/yyyy"
                                value={
                                  typeof formData?.travelDate === "string" &&
                                  formData.travelDate.includes("-")
                                    ? formData.travelDate
                                        .split("-")
                                        .reverse()
                                        .join("/")
                                    : ""
                                }
                                className="form-control-custom date-display-input"
                              />

                              <input
                                ref={dateInputRef}
                                type="date"
                                id="hiddenDateInput"
                                name="travelDate"
                                min={new Date().toISOString().split("T")[0]}
                                value={formData?.travelDate || ""}
                                onChange={handleInputChange}
                                className="date-picker-hidden-native"
                                tabIndex={-1}
                                aria-hidden="true"
                              />

                              <button
                                type="button"
                                className="date-picker-calendar-btn"
                                aria-label="Open Calendar"
                                tabIndex={-1}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#0f2d52"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <rect
                                    x="3"
                                    y="4"
                                    width="18"
                                    height="18"
                                    rx="2"
                                    ry="2"
                                  ></rect>
                                  <line
                                    x1="16"
                                    y1="2"
                                    x2="16"
                                    y2="6"
                                  ></line>
                                  <line
                                    x1="8"
                                    y1="2"
                                    x2="8"
                                    y2="6"
                                  ></line>
                                  <line
                                    x1="3"
                                    y1="10"
                                    x2="21"
                                    y2="10"
                                  ></line>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group-custom">
                            <label htmlFor="budget">Budget</label>
                            <input
                              type="text"
                              id="budget"
                              name="budget"
                              value={formData.budget}
                              onChange={handleInputChange}
                              className="form-control-custom"
                              placeholder="e.g. ₹50,000 per person"
                            />
                          </div>
                        </div>

                        <div className="col-6 col-md-6">
                          <div className="form-group-custom">
                            <label htmlFor="adults">Number of Adults </label>
                            <input
                              type="number"
                              id="adults"
                              name="adults"
                              min="1"
                              value={formData.adults}
                              onChange={handleInputChange}
                              className="form-control-custom"
                            />
                          </div>
                        </div>

                        <div className="col-6 col-md-6">
                          <div className="form-group-custom">
                            <label htmlFor="children">
                              Number of Children{" "}
                            </label>
                            <input
                              type="number"
                              id="children"
                              name="children"
                              min="0"
                              value={formData.children}
                              onChange={handleInputChange}
                              className="form-control-custom"
                            />
                          </div>
                        </div>

                        <div className="col-12 mt-4">
                          <div className="form-group-custom">
                            <label className="mb-2">
                              Services Required (Select all that apply)
                            </label>
                            <div className="services-chips-grid">
                              {servicesList.map((service, index) => {
                                const isSelected =
                                  formData.services.includes(service);
                                return (
                                  <button
                                    type="button"
                                    key={index}
                                    className={`service-chip-btn ${
                                      isSelected ? "active" : ""
                                    }`}
                                    onClick={() =>
                                      handleServiceChange(service)
                                    }
                                  >
                                    {isSelected && (
                                      <Check
                                        size={14}
                                        className="me-1 stroke-3"
                                      />
                                    )}
                                    {service}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="col-12 mt-4">
                          <div className="form-group-custom">
                            <label htmlFor="message">Message</label>
                            <textarea
                              id="message"
                              name="message"
                              rows="4"
                              value={formData.message}
                              onChange={handleInputChange}
                              className="form-control-custom textarea-custom"
                              placeholder="Tell us about your travel plans..."
                            ></textarea>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 mt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn-trip-submit w-100 py-3 shadow d-flex align-items-center justify-content-center"
                        >
                          {loading ? (
                            <>
                              <Loader2
                                className="animate-spin me-2"
                                size={18}
                              />{" "}
                              Submitting...
                            </>
                          ) : (
                            <>
                              {queryPackageName || destinationData?.name
                                ? "Confirm Enquiry"
                                : "Get My Free Quote"}
                              <ArrowRight
                                className="ms-2 inline-block"
                                size={18}
                              />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="enquiry-success-container text-center py-5">
                    <div className="success-icon-wrapper mb-4">
                      <CheckCircle2
                        size={80}
                        className="text-gold stroke-2"
                        style={{ color: "var(--trip-gold)" }}
                      />
                    </div>
                    <h2 className="text-trip mb-3">
                      Enquiry Submitted Successfully!
                    </h2>
                    <p className="text-muted mb-4 max-w-lg mx-auto">
                      Thank you,{" "}
                      <strong className="text-trip">
                        {formData.fullName}
                      </strong>
                      ! We have received your enquiry for{" "}
                      <strong className="text-trip">
                        {formData.destination || "your destination"}
                      </strong>
                      . Our travel specialist team will review your requirements
                      and reach out to you within 24 hours.
                    </p>

                    <div className="summary-box p-4 rounded-4 bg-light text-start mb-4 border border-light-subtle">
                      <h5 className="font-semibold text-trip mb-3 border-bottom pb-2">
                        Enquiry Summary
                      </h5>
                      <ul className="list-unstyled d-flex flex-column gap-2 small text-muted">
                        <li>
                          <strong>Contact:</strong> {formData.mobile} |{" "}
                          {formData.email}
                        </li>
                        <li>
                          <strong>Trip Type:</strong> {formData.travelType}
                        </li>
                        {formData.travelDate && (
                          <li>
                            <strong>Travel Date:</strong> {formData.travelDate}
                          </li>
                        )}
                        <li>
                          <strong>Travellers:</strong> {formData.adults} Adults{" "}
                          {formData.children > 0 &&
                            `, ${formData.children} Children`}
                        </li>
                        {formData.budget && (
                          <li>
                            <strong>Budget:</strong> {formData.budget}
                          </li>
                        )}
                        {formData.services.length > 0 && (
                          <li>
                            <strong>Services:</strong>{" "}
                            {formData.services.join(", ")}
                          </li>
                        )}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="btn-trip-outline-reset px-4 py-2 mt-2"
                    >
                      <RefreshCw
                        size={16}
                        className="me-2 inline-block align-middle"
                      />
                      Send Another Enquiry
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section py-5 bg-sec">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="text-trip">Find Us</h2>
            <div className="horline mx-auto mb-2"></div>
            <p className="text-muted">Registered Office Location on Google Maps</p>
          </div>
          <div
            className="map-card-wrapper position-relative shadow rounded-4 overflow-hidden bg-white border border-light-subtle"
            style={{ minHeight: "480px" }}
          >
            <div
              className="map-floating-overlay-card position-absolute p-3 shadow-lg bg-white"
              style={{
                top: 0,
                left: 0,
                maxWidth: "350px",
                zIndex: 10,
                borderTop: "4px solid var(--trip-gold, #d4af37)",
                borderBottomRightRadius: "16px",
                borderRight: "1px solid #e2e8f0",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-1">
                <MapPin size={18} className="text-danger flex-shrink-0" />
                <h6
                  className="m-0 font-bold text-navy"
                  style={{ fontSize: "0.95rem" }}
                >
                  {locationName}
                </h6>
              </div>
              <p
                className="text-muted small mb-3 ps-4"
                style={{ whiteSpace: "pre-line", lineHeight: "1.4" }}
              >
                {contactInfo.address}
              </p>

              <a
                href={googleDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm w-100 d-flex align-items-center justify-content-center gap-2 fw-semibold text-white shadow-sm"
                style={{
                  backgroundColor: "#0f2d52",
                  borderRadius: "6px",
                  padding: "8px 12px",
                }}
              >
                <Navigation size={15} />
                Get Directions
                <ExternalLink size={14} className="opacity-75 ms-1" />
              </a>
            </div>

            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3886.0822606013686!2d${officeLongitude}!3d${officeLatitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDA1JzM5LjciTiA4MMKwMTInMjEuNSJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin`}
              width="100%"
              height="480"
              style={{ border: 0, display: "block" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${locationName} Google Maps Location`}
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;