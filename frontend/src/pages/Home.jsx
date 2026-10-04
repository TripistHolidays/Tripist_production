import React, { useEffect, useState } from "react";
import { PhoneCall, AtSign } from "lucide-react";

import Hero from "../Components/Heroslidr";
import DestinationSlider from "../Components/Toppack";
import HandpickedPackages from "../Components/HandpickedPackages";
import BenefitsSection from "../Components/Benifitssection";

import care from "../assets/info-bnr.svg";
import DestinationSpecialistsCTA from "../Components/DestinationSpecialistsCTA";
import AccreditationPartners from "../Components/AccreditationPartners";
import NotificationCenter from "../Components/NotificationCenter";
import { api } from "../Admin/api";
import ContactModal from "../Components/ContactModal";

import "./Home.css";

const Home = () => {
  const [contactInfo, setContactInfo] = useState({
    phone: "+91 96555 96867",
    email: "info@tripistholidays.com",
  });

  // 1. State to control the visibility of the ContactModal
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    api
      .getContact()
      .then((data) => {
        if (data && !data.error && Object.keys(data).length > 0) {
          setContactInfo((prev) => ({
            ...prev,
            phone: data.phone || prev.phone,
            email: data.email || prev.email,
          }));
        }
      })
      .catch((err) => console.error("Error fetching support contact info:", err));
  }, []);

  // 2. Timer to open the ContactModal after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContactModalOpen(true);
    }, 5000); // 10000 ms = 10 seconds

    // Cleanup the timer if the user leaves the page before 10 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-page-wrapper">
      {/* 3. Pass isOpen and onClose props to ContactModal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
      <NotificationCenter />

      {/* Hero Section */}
      <section className="w-100 overflow-hidden">
        <Hero />
      </section>

      {/* Top Destinations Section */}
      <section className="container py-3 py-md-4">
        <DestinationSlider />
      </section>

      {/* Handpicked Packages & Support Section */}
      <section className="bg-sec py-4 py-md-5">
        <div className="container">
          <HandpickedPackages />
        </div>

        {/* 24x7 Customer Support Section */}
        <div className="container mt-2 pt-1 pt-md-4">
          <div className="position-relative">
            {/* Responsive Heading */}
            <div className="text-center text-md-end mb-3 pe-md-4">
              <h3 className="fw-bold text-dark m-0 fs-5 fs-md-4">
                Hassle Free. 24X7 on-trip assistance
              </h3>
            </div>

            {/* Support Banner Card */}
            <div className="support-banner-card rounded-4 text-white shadow-sm p-3 p-sm-4 p-md-2">
              <div className="row align-items-center g-4">
                {/* Support Illustration */}
                <div className="col-12 col-md-6 text-center">
                  <img
                    src={care}
                    alt="24/7 Support Agent"
                    className="img-fluid support-banner-img"
                  />
                </div>

                {/* Contact Details */}
                <div className="col-12 col-md-6 d-flex flex-column align-items-center align-items-md-start gap-3 ps-md-4">
                  {/* Phone */}
                  <div className="d-flex align-items-center gap-2 gap-sm-3 support-item">
                    <PhoneCall className="text-warning flex-shrink-0" size={24} />
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-white text-decoration-none fw-bold support-link"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>

                  {/* Email */}
                  <div className="d-flex align-items-center gap-2 gap-sm-3 support-item">
                    <AtSign className="text-warning flex-shrink-0" size={24} />
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-white text-decoration-none fw-bold support-link text-break"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* End Support Banner Card */}
          </div>
        </div>
      </section>

      {/* Destination Specialists CTA */}
      <section className="container py-3 py-md-4">
        <DestinationSpecialistsCTA />
      </section>

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Accreditation Partners */}
      <AccreditationPartners />
    </div>
  );
};

export default Home;