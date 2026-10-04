import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  UserRound,
  MapPinned,
} from "lucide-react";
import { api } from "../Admin/api";
import "./ContactModal.css";

export default function ContactModal({
  isOpen,
  onClose,
  initialPackageName = "",
  initialPackageId = "",
  initialPackagePrice = "",
  initialDurationDays = "",
  initialDurationNights = "",
}) {


  
  const [currentStep, setCurrentStep] = useState(1);
  const dateInputRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    country: "",
    city: "",
    destination: initialPackageName || "",
    travelType: "",
    travelDate: "",
    adults: 1,
    children: 0,
    budget: initialPackagePrice || "",
    durationDays: initialDurationDays ? parseInt(initialDurationDays, 10) : "",
    durationNights: initialDurationNights ? parseInt(initialDurationNights, 10) : "",
    services: initialPackageName ? ["Holiday Package"] : [],
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

   useEffect(() => {
    if (initialPackageName) {
      setFormData((prev) => ({
        ...prev,
        destination: initialPackageName,
        budget: initialPackagePrice || prev.budget,
        durationDays: initialDurationDays ? parseInt(initialDurationDays, 10) : prev.durationDays,
        durationNights: initialDurationNights ? parseInt(initialDurationNights, 10) : prev.durationNights,
        services: prev.services.includes("Holiday Package")
          ? prev.services
          : [...prev.services, "Holiday Package"],
      }));
    }
  }, [initialPackageName, initialPackageId, initialPackagePrice, initialDurationDays, initialDurationNights]);

  if (!isOpen) return null;

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

    // Restrict mobile field to only allow numbers, spaces, plus signs, and hyphens (no letters)
    if (name === "mobile") {
      const sanitizedMobile = value.replace(/[^0-9+\s-]/g, "");
      setFormData((prev) => ({ ...prev, [name]: sanitizedMobile }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleServiceChange = (serviceName) => {
    setFormData((prev) => {
      const isAlreadySelected = prev.services.includes(serviceName);
      const updatedServices = isAlreadySelected
        ? prev.services.filter((s) => s !== serviceName)
        : [...prev.services, serviceName];
      return { ...prev, services: updatedServices };
    });
  };

  // Validate Step 1 required personal details
  const validateStep1 = () => {
    const tempErrors = {};
    if (!formData.fullName.trim()) tempErrors.fullName = "Full Name is required";

    if (!formData.email.trim()) {
      tempErrors.email = "Email Address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
    }

    const cleanMobile = formData.mobile.replace(/[\s-]/g, "");
    if (!formData.mobile.trim()) {
      tempErrors.mobile = "Mobile Number is required";
    } else if (!/^\+?[0-9]{10}$/.test(cleanMobile)) {
      tempErrors.mobile = "Please enter a valid mobile number (10 to 15 digits)";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Validate Step 2 travel details
  const validateStep2 = () => {
    const tempErrors = {};
    if (!formData.destination.trim()) tempErrors.destination = "Destination is required";
    if (!formData.travelDate) tempErrors.travelDate = "Travel date is required";
    if (!formData.adults || Number(formData.adults) < 1) {
      tempErrors.adults = "At least 1 adult is required";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setErrors({});
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setErrors({});
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    try {
      await api.sendContactEnquiry(formData);
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to send contact enquiry:", error);
      alert(error.message || "Failed to submit enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-modal-backdrop" onClick={onClose}>
      <div className="contact-modal-container" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="contact-modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <h3 className="text-trip mb-1">
              {initialPackageName ? "Complete Your Package Booking" : "Let’s Plan Your Journey"}
            </h3>
            <p className="text-muted mb-3 small">
              Step {currentStep} of 2: {currentStep === 1 ? "Personal Details" : "Travel Requirements"}
            </p>

            {/* Stepper Progress Bar */}
            <div className="stepper-bar-container mb-4">
              <div className="stepper-track">
                <div
                  className="stepper-fill"
                  style={{ width: currentStep === 1 ? "50%" : "100%" }}
                ></div>
              </div>
              <div className="stepper-label-row">
                <span className={`stepper-label ${currentStep >= 1 ? "active" : ""}`}>
                  <UserRound size={14} /> Contact
                </span>
                <span className={`stepper-label ${currentStep === 2 ? "active" : ""}`}>
                  Travel Details <MapPinned size={14} />
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* STEP 1: Personal Details */}
              {currentStep === 1 && (
                <div className="step-content">
                  <div className="step-intro">Tell us how we can reach you</div>
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="form-group-custom">
                        <input
                          type="text"
                          aria-label="Full Name"
                          id="modal-fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`form-control-custom ${errors.fullName ? "is-invalid" : ""}`}
                          placeholder="e.g. Rajesh Sharma"
                          required
                        />
                        {errors.fullName && <div className="invalid-feedback-custom">{errors.fullName}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group-custom">
                        <input
                          type="email"
                          aria-label="Email Address"
                          id="modal-email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`form-control-custom ${errors.email ? "is-invalid" : ""}`}
                          placeholder="rajesh@example.com"
                          required
                        />
                        {errors.email && <div className="invalid-feedback-custom">{errors.email}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group-custom">
                        <input
                          type="tel"
                          aria-label="Mobile Number"
                          id="modal-mobile"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          className={`form-control-custom ${errors.mobile ? "is-invalid" : ""}`}
                          placeholder="98765 43210"
                          maxLength={10}
                          required
                        />
                        {errors.mobile && <div className="invalid-feedback-custom">{errors.mobile}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group-custom">
                        <input
                          type="text"
                          aria-label="Country"
                          id="modal-country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="form-control-custom"
                          placeholder="e.g. India"
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group-custom">
                        <input
                          type="text"
                          aria-label="City"
                          id="modal-city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="form-control-custom"
                          placeholder="e.g. Mumbai"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-end">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="btn-trip-submit btn-next py-2.5 px-4 shadow-sm inline-flex align-items-center"
                    >
                      Next: Travel Details <ArrowRight className="ms-2" size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Travel Details */}
              {currentStep === 2 && (
                <div className="step-content">
                  <div className="step-intro">Plan your trip your way</div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-group-custom">
                        <input
                          type="text"
                          aria-label="Destination or Package"
                          id="modal-destination"
                          name="destination"
                          value={formData.destination}
                          onChange={handleInputChange}
                          className={`form-control-custom ${errors.destination ? "is-invalid" : ""}`}
                          placeholder="e.g. Goa, Kerala, Maldives"
                          required
                        />
                        {errors.destination && <div className="invalid-feedback-custom">{errors.destination}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group-custom">
                        <select
                          aria-label="Travel Type"
                          id="modal-travelType"
                          name="travelType"
                          value={formData.travelType}
                          onChange={handleInputChange}
                          className={`form-select-custom ${errors.travelType ? "is-invalid" : ""}`}
                        >
                          <option value="" disabled>Select Type</option>
                          <option value="Domestic">Domestic</option>
                          <option value="International">International</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group-custom">
                        <label htmlFor="modal-durationDays">Days</label>
                        <input
                          type="number"
                          aria-label="Days"
                          id="modal-durationDays"
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
                        <label htmlFor="modal-durationNights">Nights</label>
                        <input
                          type="number"
                          aria-label="Nights"
                          id="modal-durationNights"
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
                        <div
                          className={`date-picker-container ${errors.travelDate ? "is-invalid" : ""}`}
                          onClick={() => {
                            if (dateInputRef.current) {
                              if (typeof dateInputRef.current.showPicker === "function") {
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
                            placeholder="Select travel date"
                            value={
                              typeof formData?.travelDate === "string" && formData.travelDate.includes("-")
                                ? formData.travelDate.split("-").reverse().join("/")
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
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                          </button>
                        </div>
                        {errors.travelDate && <div className="invalid-feedback-custom">{errors.travelDate}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group-custom">
                        <input
                          type="text"
                          aria-label="Budget"
                          id="modal-budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className="form-control-custom"
                          placeholder="e.g. ₹30,000 - ₹50,000 per person"
                        />
                      </div>
                    </div>

                    <div className="col-6 col-md-6">
                      <div className="form-group-custom">
                        <input
                          type="number"
                          aria-label="Adults"
                          id="modal-adults"
                          name="adults"
                          min="1"
                          value={formData.adults}
                          onChange={handleInputChange}
                          className={`form-control-custom ${errors.adults ? "is-invalid" : ""}`}
                          placeholder="Adults (12+ yrs)"
                          required
                        />
                        {errors.adults && <div className="invalid-feedback-custom">{errors.adults}</div>}
                      </div>
                    </div>

                    <div className="col-6 col-md-6">
                      <div className="form-group-custom">
                        <input
                          type="number"
                          aria-label="Children"
                          id="modal-children"
                          name="children"
                          min="0"
                          value={formData.children}
                          onChange={handleInputChange}
                          className="form-control-custom"
                          placeholder="Children (0-11 yrs)"
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group-custom">
                        <div className="services-placeholder">What would you like help with?</div>
                        <div className="services-chips-grid">
                          {servicesList.map((service, index) => {
                            const isSelected = formData.services.includes(service);
                            return (
                              <button
                                type="button"
                                key={index}
                                className={`service-chip-btn ${isSelected ? "active" : ""}`}
                                onClick={() => handleServiceChange(service)}
                              >
                                {isSelected && <Check size={14} className="me-1 stroke-3" />}
                                {service}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group-custom">
                        <textarea
                          aria-label="Message"
                          id="modal-message"
                          name="message"
                          rows="3"
                          value={formData.message}
                          onChange={handleInputChange}
                          className="form-control-custom textarea-custom"
                          placeholder="Any specific hotel preferences, dietary requirements, or custom itineraries?"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="btn-trip-back py-2.5 px-3 rounded-3 d-inline-flex align-items-center"
                    >
                      <ArrowLeft className="me-1" size={16} /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-trip-submit btn-submit py-2.5 px-4 shadow-sm inline-flex align-items-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin me-2" size={18} /> Submitting...
                        </>
                      ) : (
                        <>
                          Submit Enquiry <ArrowRight className="ms-2" size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </>
        ) : (
          <div className="enquiry-success-container text-center py-4">
            <div className="success-icon-wrapper mb-3">
              <CheckCircle2 size={70} className="text-gold stroke-2" style={{ color: "var(--trip-gold)" }} />
            </div>
            <h3 className="text-trip mb-2">Enquiry Submitted Successfully!</h3>
            <p className="text-muted mb-3 small">
              Thank you, <strong className="text-trip">{formData.fullName}</strong>! A confirmation email has been sent to <strong>{formData.email}</strong>. Our team will contact you shortly.
            </p>

            <div className="summary-box p-3 rounded-4 bg-light text-start mb-3 border border-light-subtle small">
              <h6 className="font-semibold text-trip mb-2 border-bottom pb-1">Enquiry Summary</h6>
              <ul className="list-unstyled d-flex flex-column gap-1 text-muted m-0">
                <li><strong>Destination / package:</strong> {formData.destination || "N/A"}</li>
                <li><strong>Travellers:</strong> {formData.adults} Adults {formData.children > 0 && `, ${formData.children} Children`}</li>
                <li><strong>Contact:</strong> {formData.mobile} | {formData.email}</li>
                <li><strong>Trip Type:</strong> {formData.travelType}</li>
                {formData.travelDate && <li><strong>Travel Date:</strong> {formData.travelDate}</li>}
                {formData.services.length > 0 && (
                  <li><strong>Services:</strong> {formData.services.join(", ")}</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}