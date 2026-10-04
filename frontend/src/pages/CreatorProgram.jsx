import React, { useState } from "react";
import "./CreatorProgram.css";
import { api } from "../Admin/api";
import { 
  Camera, 
  Video, 
  FileText, 
  Image as ImageIcon, 
  Film, 
  Compass, 
  MapPin, 
  Utensils, 
  Send, 
  UserCheck, 
  Users, 
  Award,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import heroImage from "../assets/desti.jpg";

const creatorTypes = [
  ["Travel Influencers", "Create engaging travel content across Instagram, Facebook, TikTok, Threads, and other social platforms.", <Camera size={24} />],
  ["YouTubers", "Produce destination guides, travel documentaries, vlogs, itinerary videos, and travel experiences.", <Video size={24} />],
  ["Travel Bloggers", "Write destination articles, travel tips, itineraries, hotel reviews, and cultural stories.", <FileText size={24} />],
  ["Photographers", "Capture landscapes, hotels, resorts, cultural experiences, wildlife, food, and local life.", <ImageIcon size={24} />],
  ["Videographers & Filmmakers", "Create cinematic destination films, promotional videos, and storytelling content.", <Film size={24} />],
  ["Drone Creators", "Showcase destinations from unique aerial perspectives, subject to local drone regulations.", <Compass size={24} />],
  ["Adventure Creators", "Feature trekking, diving, safaris, camping, road trips, cycling, and outdoor experiences.", <MapPin size={24} />],
  ["Food & Culture Creators", "Highlight regional cuisine, traditions, festivals, local markets, and authentic cultural experiences.", <Utensils size={24} />]
];

const benefits = [
  ["Travel Opportunities", "Invitations to selected FAM trips, destination campaigns, and hosted travel experiences."],
  ["Brand Collaborations", "Work with Tripist Holidays and travel partners on promotional campaigns."],
  ["Destination Access", "Explore hotels, resorts, attractions, tourism boards, and local experiences through collaborations."],
  ["Grow Your Audience", "Reach wider audiences through collaborations, featured content, and cross-promotion."],
  ["Build Your Portfolio", "Create high-quality travel content while expanding your professional portfolio."],
  ["Community", "Join a growing network of travel storytellers, photographers, filmmakers, and creators."]
];

const collaborationOpportunities = [
  "Destination Promotions", "Hotel & Resort Reviews", "Cruise Experiences",
  "Road Trips", "Adventure Tourism", "Pilgrimage Journeys", "Family Holidays",
  "Luxury Travel", "Food Experiences", "Cultural Festivals", "Tourism Campaigns",
  "Travel Tips & Guides", "Photography Projects", "Video Productions",
  "Social Media Campaigns"
];

const creatorQualities = [
  "Authentic storytelling",
  "High-quality content",
  "Professionalism",
  "Creativity",
  "Positive community engagement",
  "Consistent publishing",
  "Respect for local cultures and environments"
];

const creatorBenefits = [
  "Sponsored or discounted travel experiences",
  "Complimentary stays (campaign-dependent)",
  "Familiarization (FAM) trips",
  "Destination collaborations",
  "Event invitations",
  "Early access to campaigns",
  "Social media features",
  "Portfolio-building opportunities",
  "Long-term collaboration opportunities"
];

const expertiseOptions = [
  "Travel", "Luxury Travel", "Adventure", "Family Travel", "Food", "Wildlife",
  "Hotels & Resorts", "Cruises", "Photography", "Videography", "Drone",
  "Lifestyle", "Pilgrimage", "Culture & Heritage"
];

const interestOptions = [
  "Destination Campaigns", "Hotel Reviews", "Tourism Board Campaigns",
  "Brand Partnerships", "Event Coverage", "Press Trips", "FAM Trips",
  "Social Media Campaigns", "Video Production", "Photography Projects"
];

const initialForm = {
  fullName: "",
  email: "",
  mobile: "",
  country: "",
  city: "",
  creatorName: "",
  primaryCategory: "",
  instagram: "",
  youtube: "",
  facebook: "",
  blog: "",
  linkedin: "",
  portfolio: "",
  audienceCountry: "",
  followers: "",
  monthlyReach: "",
  engagementRate: "",
  expertise: [],
  interests: [],
  about: "",
  mediaKit: null
};

export default function CreatorProgram() {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    
    // Apply field-specific input rules based on the field name/label
    if (name === "mobile") {
      // Allow only numbers, max length 10
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setForm((current) => ({ ...current, [name]: numericValue }));
    } else if (name === "followers" || name === "monthlyReach") {
      // Allow only whole numbers for follower counts and reach
      const numericValue = value.replace(/\D/g, "");
      setForm((current) => ({ ...current, [name]: numericValue }));
    } else if (name === "engagementRate") {
      // Allow numbers and a single decimal point for percentages
      const cleanedValue = value.replace(/[^0-9.]/g, "");
      setForm((current) => ({ ...current, [name]: cleanedValue }));
    } else {
      setForm((current) => ({
        ...current,
        [name]: files ? files[0] : value
      }));
    }

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckbox = (name, value) => {
    setForm((current) => {
      const exists = current[name].includes(value);
      return {
        ...current,
        [name]: exists
          ? current[name].filter((item) => item !== value)
          : [...current[name], value]
      };
    });
  };

  const validateStep = (currentStep) => {
    const errors = {};
    if (currentStep === 1) {
      if (!form.fullName.trim()) errors.fullName = "Full name is required";
      if (!form.email.trim()) {
        errors.email = "Email address is required";
      } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        errors.email = "Please enter a valid email address";
      }
      if (!form.mobile.trim()) {
        errors.mobile = "Mobile number is required";
      } else if (!/^\d{10}$/.test(form.mobile)) {
        errors.mobile = "Please enter a valid 10-digit mobile number";
      }
      if (!form.country.trim()) errors.country = "Country is required";
      if (!form.city.trim()) errors.city = "City is required";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setErrorMsg("");
      setStep((prev) => Math.min(prev + 1, 3));
    } else {
      setErrorMsg("Please fill in all required fields correctly before proceeding.");
    }
  };

  const prevStep = () => {
    setErrorMsg("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === "expertise" || key === "interests") {
          formData.append(key, JSON.stringify(form[key]));
        } else if (form[key] !== null && form[key] !== undefined) {
          formData.append(key, form[key]);
        }
      });

      await api.sendCreatorApplication(formData);
      setSubmitted(true);
      setForm(initialForm);
      setStep(1);
      window.scrollTo({
        top: document.getElementById("creator-application")?.offsetTop - 50,
        behavior: "smooth"
      });
    } catch (err) {
      console.error("Creator application submission error:", err);
      setErrorMsg(err.message || "Failed to submit creator application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="creator-program">
      {/* Hero Section */}
      <section
        className="creator-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="creator-hero-overlay"></div>
        <div className="creator-container creator-hero-inner">
          <span className="creator-eyebrow">Tripist Holidays</span>
          <h1>Tripist Creator Program</h1>
          <p className="creator-tagline">Inspire. Explore. Create.</p>
          <p className="creator-hero-description">
            Turn your passion for travel into meaningful collaborations with Tripist Holidays.
          </p>
          <a href="#creator-application" className="creator-btn creator-btn-gold">
            Apply to Become a Creator
          </a>
        </div>
      </section>

      {/* Introduction */}
      <section className="creator-section">
        <div className="creator-container">
          <span className="creator-section-label">About the Program</span>
          <h2>Share authentic journeys. Inspire people to travel.</h2>
          <p>
            The Tripist Creator Program is designed for passionate travel creators
            who love discovering destinations, sharing authentic experiences, and
            inspiring others to travel.
          </p>
          <p>
            Whether you are an influencer, photographer, blogger, YouTuber,
            filmmaker, or storyteller, we invite you to join our growing community
            of travel creators and help showcase incredible destinations across
            India and around the world.
          </p>
        </div>
      </section>

      {/* Who Can Join */}
      <section className="creator-section creator-section-soft">
        <div className="creator-container">
          <span className="creator-section-label">Who Can Join?</span>
          <h2>Creators from diverse backgrounds are welcome</h2>

          <div className="creator-card-grid">
            {creatorTypes.map(([title, description, icon]) => (
              <article className="creator-info-card" key={title}>
                <div className="creator-card-icon-wrapper">
                  {icon}
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="creator-section">
        <div className="creator-container">
          <span className="creator-section-label">Why Join?</span>
          <h2>Why Join the Tripist Creator Program?</h2>

          <div className="creator-benefit-grid">
            {benefits.map(([title, description]) => (
              <article className="creator-benefit-card" key={title}>
                <span className="creator-check">✓</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration Opportunities */}
      <section className="creator-section creator-section-navy">
        <div className="creator-container">
          <span className="creator-section-label creator-label-light">
            Collaboration Opportunities
          </span>
          <h2>Depending on your expertise, you may collaborate on</h2>

          <div className="creator-chip-grid">
            {collaborationOpportunities.map((item) => (
              <span className="creator-chip" key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* What We Look For */}
      <section className="creator-section">
        <div className="creator-container creator-two-column">
          <div>
            <span className="creator-section-label">What We Look For</span>
            <h2>Passion matters more than follower count</h2>
            <p>
              We value creators who demonstrate authenticity, creativity,
              professionalism, consistent publishing, and respect for local
              cultures and environments.
            </p>
            <p>
              Follower count is not the only factor. We welcome both established
              and emerging creators with original ideas and a genuine passion for travel.
            </p>
          </div>

          <ul className="creator-check-list">
            {creatorQualities.map((item) => (
              <li key={item}>
                <span>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Creator Benefits */}
      <section className="creator-section creator-section-soft">
        <div className="creator-container creator-two-column">
          <div>
            <span className="creator-section-label">Creator Benefits</span>
            <h2>Opportunities designed to help you create</h2>
          </div>

          <ul className="creator-check-list">
            {creatorBenefits.map((item) => (
              <li key={item}>
                <span>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="creator-container creator-note">
          Benefits vary depending on the campaign, destination, and partnership
          agreement. Participation in the program does not guarantee paid
          assignments or complimentary travel.
        </div>
      </section>

      {/* Responsible Content */}
      <section className="creator-section">
        <div className="creator-container creator-responsibility">
          <div>
            <span className="creator-section-label">Responsible Content Creation</span>
            <h2>Create responsibly. Travel respectfully.</h2>
          </div>

          <ul className="creator-check-list">
            <li><span>✓</span>Share honest and authentic experiences.</li>
            <li><span>✓</span>Respect local customs, traditions, and communities.</li>
            <li><span>✓</span>Promote responsible and sustainable tourism.</li>
            <li><span>✓</span>Follow all applicable laws and regulations, including drone and photography permissions.</li>
            <li><span>✓</span>Clearly disclose sponsored collaborations where required by law or platform guidelines.</li>
          </ul>
        </div>
      </section>

      {/* Multi-Step Application Form */}
      <section className="creator-section creator-application-section" id="creator-application">
        <div className="creator-container">
          <div className="creator-form-heading">
            <span className="creator-section-label">Apply Now</span>
            <h2>Apply to Become a Tripist Creator</h2>
            <p>
              Complete the application form below, and our Creator Partnerships
              Team will review your profile.
            </p>
            
            {/* Multi-Step Form Progress Bar */}
            <div className="creator-form-steps">
              <div className={`creator-form-step ${step === 1 ? "active" : step > 1 ? "completed" : ""}`}>
                <div className="creator-form-step-number">{step > 1 ? "✓" : "1"}</div>
                <span className="creator-form-step-label">Personal</span>
              </div>

              <div className={`creator-form-step ${step === 2 ? "active" : step > 2 ? "completed" : ""}`}>
                <div className="creator-form-step-number">{step > 2 ? "✓" : "2"}</div>
                <span className="creator-form-step-label">Audience</span>
              </div>

              <div className={`creator-form-step ${step === 3 ? "active" : ""}`}>
                <div className="creator-form-step-number">3</div>
                <span className="creator-form-step-label">Expertise</span>
              </div>
            </div>
          </div>

          <form className="creator-form" onSubmit={handleSubmit}>
            
            {/* STEP 1: Personal Information */}
            {step === 1 && (
              <fieldset>
                <legend>Step 1: Personal Information</legend>

                <div className="creator-form-grid">
                  <div className="creator-form-field">
                    <label className="creator-label" htmlFor="fullName">Full Name *</label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                    />
                    {fieldErrors.fullName && <span style={{ color: "#dc3545", fontSize: "12px" }}>{fieldErrors.fullName}</span>}
                  </div>

                  <div className="creator-form-field">
                    <label className="creator-label" htmlFor="email">Email Address *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="e.g. name@example.com"
                    />
                    {fieldErrors.email && <span style={{ color: "#dc3545", fontSize: "12px" }}>{fieldErrors.email}</span>}
                  </div>

                  <div className="creator-form-field">
                    <label className="creator-label" htmlFor="mobile">Mobile Number (Numbers only) *</label>
                    <input
                      id="mobile"
                      name="mobile"
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      required
                      value={form.mobile}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                    />
                    {fieldErrors.mobile && <span style={{ color: "#dc3545", fontSize: "12px" }}>{fieldErrors.mobile}</span>}
                  </div>

                  <div className="creator-form-field">
                    <label className="creator-label" htmlFor="country">Country *</label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      required
                      value={form.country}
                      onChange={handleChange}
                      placeholder="e.g. India"
                    />
                    {fieldErrors.country && <span style={{ color: "#dc3545", fontSize: "12px" }}>{fieldErrors.country}</span>}
                  </div>

                  <div className="creator-form-field">
                    <label className="creator-label" htmlFor="city">City *</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={form.city}
                      onChange={handleChange}
                      placeholder="e.g. Bengaluru"
                    />
                    {fieldErrors.city && <span style={{ color: "#dc3545", fontSize: "12px" }}>{fieldErrors.city}</span>}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                  <button type="button" onClick={nextStep} className="creator-btn creator-btn-gold" style={{ width: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
                    Next <ArrowRight size={16} />
                  </button>
                </div>
              </fieldset>
            )}

            {/* STEP 2: Creator Profile & Audience */}
            {step === 2 && (
              <fieldset>
                <legend>Step 2: Creator Profile & Audience</legend>

                <div className="creator-form-grid">
                  <FormField
                    label="Creator Name / Brand"
                    name="creatorName"
                    value={form.creatorName}
                    onChange={handleChange}
                    placeholder="e.g. Wandering Footprints"
                  />

                  <FormField
                    label="Primary Content Category"
                    name="primaryCategory"
                    value={form.primaryCategory}
                    onChange={handleChange}
                    placeholder="e.g. Travel, Photography, Food"
                  />

                  <FormField
                    label="Instagram Profile"
                    name="instagram"
                    type="url"
                    value={form.instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/username"
                  />

                  <FormField
                    label="YouTube Channel"
                    name="youtube"
                    type="url"
                    value={form.youtube}
                    onChange={handleChange}
                    placeholder="https://youtube.com/@channel"
                  />

                  <FormField
                    label="Facebook Page"
                    name="facebook"
                    type="url"
                    value={form.facebook}
                    onChange={handleChange}
                    placeholder="https://facebook.com/page"
                  />

                  <FormField
                    label="Blog / Website"
                    name="blog"
                    type="url"
                    value={form.blog}
                    onChange={handleChange}
                    placeholder="https://www.yourwebsite.com"
                  />

                  <FormField
                    label="LinkedIn Profile"
                    name="linkedin"
                    type="url"
                    value={form.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                  />

                  <FormField
                    label="Portfolio Link"
                    name="portfolio"
                    type="url"
                    value={form.portfolio}
                    onChange={handleChange}
                    placeholder="https://portfolio-link.com"
                  />

                  <FormField
                    label="Primary Audience Country"
                    name="audienceCountry"
                    value={form.audienceCountry}
                    onChange={handleChange}
                    placeholder="e.g. India, United States"
                  />

                  <FormField
                    label="Total Followers / Subscribers (Numbers only)"
                    name="followers"
                    inputMode="numeric"
                    value={form.followers}
                    onChange={handleChange}
                    placeholder="e.g. 25000"
                  />

                  <FormField
                    label="Average Monthly Reach (Numbers only)"
                    name="monthlyReach"
                    inputMode="numeric"
                    value={form.monthlyReach}
                    onChange={handleChange}
                    placeholder="e.g. 100000"
                  />

                  <FormField
                    label="Average Engagement Rate (Numbers only)"
                    name="engagementRate"
                    inputMode="decimal"
                    value={form.engagementRate}
                    onChange={handleChange}
                    placeholder="e.g. 4.5"
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                  <button type="button" onClick={prevStep} className="creator-btn" style={{ background: "#6c757d", color: "#fff", width: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button type="button" onClick={nextStep} className="creator-btn creator-btn-gold" style={{ width: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
                    Next <ArrowRight size={16} />
                  </button>
                </div>
              </fieldset>
            )}

            {/* STEP 3: Content Expertise & Submission */}
            {step === 3 && (
              <fieldset>
                <legend>Step 3: Expertise & Additional Info</legend>

                <div style={{ marginBottom: "20px" }}>
                  <label className="creator-label" style={{ fontWeight: "bold" }}>Content Expertise</label>
                  <p className="creator-field-help">Select all that apply.</p>
                  <CheckboxGrid
                    name="expertise"
                    options={expertiseOptions}
                    values={form.expertise}
                    onChange={handleCheckbox}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label className="creator-label" style={{ fontWeight: "bold" }}>Collaboration Interests</label>
                  <CheckboxGrid
                    name="interests"
                    options={interestOptions}
                    values={form.interests}
                    onChange={handleCheckbox}
                  />
                </div>

                <div className="creator-form-field" style={{ marginBottom: "20px" }}>
                  <label className="creator-label" htmlFor="about">
                    Tell us about yourself and why you would like to collaborate with Tripist Holidays.
                  </label>
                  <textarea
                    id="about"
                    name="about"
                    rows="4"
                    value={form.about}
                    onChange={handleChange}
                    placeholder="Tell us about your content, audience, travel interests, and collaboration ideas..."
                  />
                </div>

                <div className="creator-form-field" style={{ marginBottom: "20px" }}>
                  <label className="creator-label" htmlFor="mediaKit">
                    Upload Portfolio / Media Kit <span>(Optional)</span>
                  </label>
                  <input
                    id="mediaKit"
                    name="mediaKit"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.mp4"
                    onChange={handleChange}
                    className="creator-file-input"
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                  <button type="button" onClick={prevStep} className="creator-btn" style={{ background: "#6c757d", color: "#fff", width: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="creator-btn creator-btn-gold"
                    style={{ width: "auto" }}
                  >
                    {loading ? "Submitting Application..." : "Submit Application"}
                  </button>
                </div>
              </fieldset>
            )}

            <div className="creator-submit-area" style={{ marginTop: "20px" }}>
              {errorMsg && (
                <p style={{ color: "#dc3545", marginBottom: "15px", fontWeight: "600" }}>
                  ⚠️ {errorMsg}
                </p>
              )}

              {submitted && (
                <p
                  className="creator-success"
                  style={{
                    color: "#28a745",
                    fontWeight: "bold",
                    marginTop: "16px",
                    padding: "12px",
                    background: "#f0fff4",
                    borderRadius: "6px",
                    border: "1px solid #c6f6d5"
                  }}
                >
                  ✓ Thank you! Your application has been submitted successfully. Our Creator Partnerships Team will review your portfolio and get in touch with you.
                </p>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* Selection Process */}
      <section className="creator-section creator-section-soft">
        <div className="creator-container">
          <span className="creator-section-label">Our Selection Process</span>
          <h2>How it works</h2>

          <div className="creator-process">
            {[
              [<Send size={22} />, "Submit Your Application", "Complete the online Creator Program application."],
              [<UserCheck size={22} />, "Profile Review", "Our team evaluates your content quality, creativity, engagement, and alignment with our brand values."],
              [<Users size={22} />, "Collaboration Discussion", "If shortlisted, we will connect to discuss suitable campaigns and partnership opportunities."],
              [<Award size={22} />, "Join the Network", "Become part of the Tripist Creator Network and collaborate on future travel campaigns."]
            ].map(([icon, title, description], index) => (
              <article className="creator-process-item" key={index}>
                <div className="creator-process-icon-wrapper">
                  {icon}
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="creator-final-cta">
        <div className="creator-container">
          <span className="creator-section-label creator-label-light">
            Let's Tell Extraordinary Travel Stories Together
          </span>
          <h2>Every destination has a story. Every journey creates a memory.</h2>
          <p>
            Join the Tripist Creator Program and help inspire travellers through
            authentic storytelling, stunning visuals, and unforgettable experiences.
          </p>
          <a href="#creator-application" className="creator-btn creator-btn-gold">
            Apply Now
          </a>
        </div>
      </section>
    </main>
  );
}

function FormField({
  label,
  name,
  type = "text",
  required = false,
  value,
  onChange,
  placeholder,
  inputMode = "text"
}) {
  return (
    <div className="creator-form-field">
      <label className="creator-label" htmlFor={name}>
        {label} {required && <span>*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

function CheckboxGrid({ name, options, values, onChange }) {
  return (
    <div className="creator-checkbox-grid">
      {options.map((option) => (
        <label className="creator-checkbox" key={option}>
          <input
            type="checkbox"
            checked={values.includes(option)}
            onChange={() => onChange(name, option)}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}