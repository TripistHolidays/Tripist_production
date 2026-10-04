import React, { useState } from "react";
import "./BecamePartner.css";
import {
  Globe,
  TrendingUp,
  Headset,
  Users,
  Building2,
  Building,
  Briefcase,
  Ship,
  Plane,
  Bus,
  Camera,
  Calendar,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { api } from "../Admin/api";

import banner from "../assets/hero4.jpg";

const BecomePartner = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    businessType: "",
    country: "",
    state: "",
    city: "",
    website: "",
    contactPerson: "",
    designation: "",
    email: "",
    phone: "",
    services: "",
    destinations: "",
    yearsInBusiness: "",
    certifications: "",
    additionalInfo: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Restrict to digits only and limit length to 10
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

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.phone.trim()) {
      tempErrors.phone = "Phone Number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      tempErrors.phone = "Please enter a valid 10-digit phone number";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      await api.sendPartnerApplication(formData);
      alert("Thank you! Our partnerships team will reach out within 48 hours.");
      setFormData({
        companyName: "",
        businessType: "",
        country: "",
        state: "",
        city: "",
        website: "",
        contactPerson: "",
        designation: "",
        email: "",
        phone: "",
        services: "",
        destinations: "",
        yearsInBusiness: "",
        certifications: "",
        additionalInfo: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Failed to send partner application:", error);
      alert(error.message || "Failed to submit partner application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section
        className="partner-hero"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="partner-overlay">
          <div className="container">
            <span className="section-tag">BECOME A PARTNER</span>
            <h1>
              Grow Your Business
              <br />
              with Tripist Holidays
            </h1>
            <p>
              Join a trusted global network of travel professionals, hospitality
              providers, and destination experts who share our commitment to
              quality and reliability.
            </p>
          </div>
        </div>
      </section>

      <section className="partner-section who-partner">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-tag">PARTNER ECOSYSTEM</span>
            <h2 className="partner-title">Who Can Partner With Us?</h2>
            <p className="partner-subtitle">
              We welcome partnership enquiries from a wide range of travel
              and hospitality organisations.
            </p>
          </div>

          <div className="row g-4">
            <PartnerCategory
              icon={<Building2 size={28} />}
              title="Destination Management Companies (DMCs)"
              desc="Provide local expertise, sightseeing, transfers, guides, and ground handling."
            />
            <PartnerCategory
              icon={<Building size={28} />}
              title="Hotels & Resorts"
              desc="Showcase your property to travellers through our holiday packages and corporate travel solutions."
            />
            <PartnerCategory
              icon={<Briefcase size={28} />}
              title="Travel Agencies & Tour Operators"
              desc="Expand your business through B2B collaborations, referral opportunities, and destination partnerships."
            />
            <PartnerCategory
              icon={<Bus size={28} />}
              title="Transportation Providers"
              desc="Airport transfers, car rentals, luxury coaches, tempo travellers, and chauffeur services."
            />
            <PartnerCategory
              icon={<Ship size={28} />}
              title="Cruise Operators"
              desc="Partner with us to offer memorable cruise holidays and premium travel experiences."
            />
            <PartnerCategory
              icon={<Plane size={28} />}
              title="Airlines"
              desc="Collaborate to provide competitive airfares for leisure, corporate, and group travellers."
            />
            <PartnerCategory
              icon={<Camera size={28} />}
              title="Activity & Experience Providers"
              desc="Adventure tourism, water sports, wildlife, cultural experiences, guided tours, and more."
            />
            <PartnerCategory
              icon={<Calendar size={28} />}
              title="MICE & Corporate Event Specialists"
              desc="Meetings, incentives, conferences, exhibitions, corporate events, and business travel."
            />
            <PartnerCategory
              icon={<Globe size={28} />}
              title="Tourism Boards & Government Organisations"
              desc="Promote destinations, cultural tourism, responsible initiatives, and regional campaigns."
            />
          </div>
        </div>
      </section>

      <section className="partner-section why-partner">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <span className="section-tag">WHY PARTNER WITH US</span>
              <h2 className="partner-title">
                Better inventory. Better margins.
                <br />
                Better support.
              </h2>
              <div className="row g-3 mt-3">
                <FeatureCard
                  icon={<Globe size={20} />}
                  title="Growing Travel Brand"
                  text="Join a company committed to quality and long‑term relationships."
                />
                <FeatureCard
                  icon={<TrendingUp size={20} />}
                  title="Wider Market Reach"
                  text="Access travellers from India and international markets via our expanding network."
                />
                <FeatureCard
                  icon={<Users size={20} />}
                  title="Long‑Term Business Relationships"
                  text="We value transparency, professionalism, and mutual growth."
                />
                <FeatureCard
                  icon={<Headset size={20} />}
                  title="Dedicated Partnership Team"
                  text="Your partner manager ensures smooth coordination and timely communication."
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="partner-categories-card">
                <h5>Our Partnership Categories</h5>
                <div className="category-tags">
                  <span>B2B Travel Partners</span>
                  <span>Preferred DMC Partners</span>
                  <span>Hotel Partners</span>
                  <span>Airline Partners</span>
                  <span>Cruise Partners</span>
                  <span>Transportation Partners</span>
                  <span>MICE Partners</span>
                  <span>Tourism Board Partners</span>
                  <span>Educational Institution Partners</span>
                  <span>Event & Experience Partners</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="partner-section registration-section" id="registration">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6">
              <span className="section-tag">PARTNER REGISTRATION</span>
              <h2 className="partner-title">Apply to become a partner</h2>
              <p className="partner-steps-intro">
                Complete the form and our Partnerships Team will contact you.
              </p>

              <div className="steps-list">
                <Step
                  number="1"
                  title="Submit Application"
                  desc="Share your company details through our online partner registration form."
                />
                <Step
                  number="2"
                  title="Business Verification"
                  desc="Our team reviews your company profile, credentials, and service offerings."
                />
                <Step
                  number="3"
                  title="Partnership Discussion"
                  desc="We'll discuss collaboration opportunities, destinations, pricing, and operational requirements."
                />
                <Step
                  number="4"
                  title="Agreement"
                  desc="Upon mutual approval, we'll complete the partnership onboarding process."
                />
                <Step
                  number="5"
                  title="Start Growing Together"
                  desc="Begin collaborating with Tripist Holidays and serve travellers together."
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="partner-form-card">
                <h2>Partner Registration</h2>
                <p>Fill in the details below. We'll respond within 48 hours.</p>
                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3">
                    <div className="col-12">
                      <label>COMPANY / BUSINESS NAME *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="e.g. Tripist Global Tours"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label>BUSINESS TYPE *</label>
                      <select
                        className="form-select"
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Type</option>
                        <option>Travel Agent</option>
                        <option>DMC</option>
                        <option>Hotel</option>
                        <option>Airline</option>
                        <option>Cruise Operator</option>
                        <option>Transportation</option>
                        <option>MICE</option>
                        <option>Tourism Board</option>
                        <option>Activity Provider</option>
                        <option>Others</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label>COUNTRY *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="e.g. India"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label>STATE / PROVINCE</label>
                      <input
                        type="text"
                        className="form-control"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="e.g. Tamil Nadu"
                      />
                    </div>
                    <div className="col-md-6">
                      <label>CITY</label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Chennai"
                      />
                    </div>
                    <div className="col-12">
                      <label>WEBSITE</label>
                      <input
                        type="url"
                        className="form-control"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://www.example.com"
                      />
                    </div>

                    <div className="col-12">
                      <label>CONTACT PERSON *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label>DESIGNATION</label>
                      <input
                        type="text"
                        className="form-control"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        placeholder="e.g. Business Development Manager"
                      />
                    </div>
                    <div className="col-md-6">
                      <label>EMAIL *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label>PHONE NUMBER *</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        required
                      />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>

                    <div className="col-12">
                      <label>SERVICES OFFERED</label>
                      <input
                        type="text"
                        className="form-control"
                        name="services"
                        value={formData.services}
                        onChange={handleChange}
                        placeholder="e.g. sightseeing, transfers, accommodation"
                      />
                    </div>
                    <div className="col-12">
                      <label>DESTINATION(S)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="destinations"
                        value={formData.destinations}
                        onChange={handleChange}
                        placeholder="Countries / cities you operate in"
                      />
                    </div>
                    <div className="col-md-12">
                      <label>YEARS IN BUSINESS</label>
                      <input
                        type="number"
                        className="form-control"
                        name="yearsInBusiness"
                        value={formData.yearsInBusiness}
                        onChange={handleChange}
                        placeholder="e.g. 5"
                        min="0"
                      />
                    </div>
                    <div className="col-12">
                      <label>CERTIFICATIONS / MEMBERSHIPS</label>
                      <input
                        type="text"
                        className="form-control"
                        name="certifications"
                        value={formData.certifications}
                        onChange={handleChange}
                        placeholder="e.g. IATA, TAAI, ASTA"
                      />
                    </div>
                    <div className="col-12">
                      <label>ADDITIONAL INFORMATION</label>
                      <textarea
                        rows="4"
                        className="form-control"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        placeholder="Any other details you'd like to share…"
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <button
                        type="submit"
                        disabled={loading}
                        className="partner-btn d-flex align-items-center justify-content-center w-100"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="animate-spin me-2" size={18} /> Submitting...
                          </>
                        ) : (
                          "Become a Partner"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="partner-final-cta">
        <div className="container text-center">
          <h2>Let's Build Extraordinary Travel Experiences Together</h2>
          <p>
            We're always looking for reliable, professional, and passionate travel
            partners who share our vision. Whether you're a DMC, hotel, airline,
            or tourism organisation, we'd love to explore opportunities together.
          </p>
          <a href="#registration" className="partner-btn-cta">
            Get Started <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </>
  );
};

const FeatureCard = ({ icon, title, text }) => (
  <div className="col-md-6">
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h5>{title}</h5>
      <p>{text}</p>
    </div>
  </div>
);

const PartnerCategory = ({ icon, title, desc }) => (
  <div className="col-md-4 col-lg-4">
    <div className="partner-category-card">
      <div className="category-icon">{icon}</div>
      <h5>{title}</h5>
      <p>{desc}</p>
    </div>
  </div>
);

const Step = ({ number, title, desc }) => (
  <div className="step-item">
    <div className="step-number">{number}</div>
    <div className="step-content">
      <h5>{title}</h5>
      <p>{desc}</p>
    </div>
  </div>
);

export default BecomePartner;