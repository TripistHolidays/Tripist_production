import React from "react";
import "./About.css";
import heroImage from "../assets/about_hero.jpg";

import {
  Heart,
  Shield,
  Sparkles,
  Lightbulb,
  UserCheck,
  Leaf,
  Compass,
  Globe,
  Check,
  ArrowRight,
  TrendingUp,
  Award,
  Layers
} from "lucide-react";

const About = () => {
  const coreValues = [
    {
      icon: <Heart size={24} />,
      title: "Customer First",
      text: "Every traveller is unique. We listen, understand, and provide travel solutions tailored to individual needs."
    },
    {
      icon: <Shield size={24} />,
      title: "Integrity",
      text: "We believe in transparency, honesty, and ethical business practices in every interaction."
    },
    {
      icon: <Sparkles size={24} />,
      title: "Excellence",
      text: "We continuously strive to deliver exceptional service, attention to detail, and memorable travel experiences."
    },
    {
      icon: <Lightbulb size={24} />,
      title: "Innovation",
      text: "We embrace technology and modern travel solutions to simplify planning and enhance customer convenience."
    },
    {
      icon: <UserCheck size={24} />,
      title: "Reliability",
      text: "Our customers and partners trust us to deliver dependable travel services with professionalism and accountability."
    },
    {
      icon: <Leaf size={24} />,
      title: "Responsible Tourism",
      text: "We encourage sustainable travel practices that respect local cultures, support communities, and preserve natural environments."
    }
  ];

  const missionPoints = [
    "Designing personalized holidays for couples, families, groups, solo travellers, and corporate clients.",
    "Offering carefully curated travel packages that combine comfort, value, quality, and authentic experiences.",
    "Building long-term relationships through transparency, reliability, and customer-focused service.",
    "Leveraging technology and trusted partnerships to simplify travel planning.",
    "Promoting responsible and sustainable tourism that respects local communities, cultures, and the environment.",
    "Inspiring people to explore new destinations and create memories that last a lifetime."
  ];

  const services = [
    "Domestic Holiday Packages",
    "International Holiday Packages",
    "Customized Vacations",
    "Family Holidays",
    "Honeymoon Packages",
    "Group Tours",
    "Pilgrimage Tours",
    "Adventure Holidays",
    "Luxury Travel",
    "Corporate Travel (MICE)",
    "Educational Tours",
    "Cruise Holidays",
    "Hotel & Resort Reservations",
    "Flight Bookings",
    "Visa Assistance",
    "Airport Transfers",
    "Travel Insurance Assistance",
    "Sightseeing & Destination Experiences"
  ];

  const whyChooseUs = [
    {
      icon: <Compass size={24} />,
      title: "Personalized Travel Planning",
      text: "Every itinerary is thoughtfully designed to match your interests, preferences, and travel goals."
    },
    {
      icon: <Award size={24} />,
      title: "Trusted Travel Partners",
      text: "We collaborate with reputable airlines, hotels, resorts, cruise operators, and destination management companies to ensure quality and reliability."
    },
    {
      icon: <Layers size={24} />,
      title: "End-to-End Travel Solutions",
      text: "From consultation and itinerary planning to bookings, transfers, and on-trip support, we provide comprehensive travel assistance."
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Diverse Travel Experiences",
      text: "Whether you're planning a weekend getaway, an international holiday, a pilgrimage, a honeymoon, or a corporate event, we have travel solutions for every occasion."
    },
    {
      icon: <Heart size={24} />,
      title: "Customer-Centric Approach",
      text: "We are committed to delivering responsive support, transparent communication, and exceptional service before, during, and after your journey."
    },
    {
      icon: <Globe size={24} />,
      title: "Growing Global Network",
      text: "Our expanding network of travel partners and destinations enables us to offer carefully curated experiences across India and around the world."
    }
  ];

  return (
    <div className="about-page-wrapper">
      {/* Hero Section */}
      <section
        className="about-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-overlay">
          <div className="container  text-md-start">
            <p className="section-tag">Who We Are</p>
            <h1>Every Destination Is A Memory.</h1>
            <p className="hero-desc">
              At Tripist Holidays, we believe that travel is more than visiting new
              places—it&apos;s about creating memories that last a lifetime. Whether it&apos;s
              a family vacation, a honeymoon, a spiritual journey, a corporate retreat,
              or an international adventure, every journey&apos;s story is waiting to be told.
            </p>
            <p className="hero-subdesc d-none d-md-block">
              Tripist Holidays is a travel brand owned and operated by Tripist Holidays
              Private Limited, dedicated to delivering seamless, memorable, and
              personalized travel experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Intro & Story Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
             
              <h2 className="section-title text-trip mb-4">Our Story</h2>
              <p className="story-quote text-gold font-bold italic fs-5 mb-4">
                "Every Destination Is A Memory."
              </p>
              <p className="text-muted mb-3 leading-relaxed">
                Travel has the power to connect people, cultures, and experiences.
                It inspires discovery, strengthens relationships, and creates
                moments that stay with us forever.
              </p>
              <p className="text-muted mb-3 leading-relaxed">
                Recognizing that every traveller has unique dreams and expectations,
                we set out to build a travel company that offers more than just
                bookings. Our vision is to provide thoughtfully planned journeys,
                reliable travel services, and personalized experiences that allow
                travellers to focus on making memories while we take care of the details.
              </p>
              <p className="text-muted mb-0 leading-relaxed">
                Today, Tripist Holidays serves individuals, couples, families,
                groups, educational institutions, and corporate clients with a
                wide range of domestic and international travel solutions. As we
                continue to grow, we remain committed to innovation, quality service,
                and building long-term relationships with our customers and partners.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="stats-container p-4 rounded-4 shadow-sm bg-sec border border-light-subtle d-flex flex-column gap-3">
                <div className="stats-intro mb-2">
                  <h4 className="text-trip font-bold mb-1">Our Core Promise</h4>
                  <p className="small text-muted mb-0">
                    From the moment you start planning your trip until you return home, our goal is to make every step of your journey simple, enjoyable, and unforgettable.
                  </p>
                </div>
                <div className="stats-grid">
                  <div className="stat-card-custom p-3 bg-white rounded-3 shadow-xs">
                    <h3 className="text-gold font-bold mb-0">100%</h3>
                    <p className="small text-trip font-semibold mb-0">Tailored Planning</p>
                  </div>
                  <div className="stat-card-custom p-3 bg-white rounded-3 shadow-xs">
                    <h3 className="text-gold font-bold mb-0">24/7</h3>
                    <p className="small text-trip font-semibold mb-0">On-Trip Support</p>
                  </div>
                  <div className="stat-card-custom p-3 bg-white rounded-3 shadow-xs">
                    <h3 className="text-gold font-bold mb-0">5★</h3>
                    <p className="small text-trip font-semibold mb-0">Service Quality</p>
                  </div>
                  <div className="stat-card-custom p-3 bg-white rounded-3 shadow-xs">
                    <h3 className="text-gold font-bold mb-0">End-to-End</h3>
                    <p className="small text-trip font-semibold mb-0">Travel Solutions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-5 bg-sec border-top border-bottom border-light-subtle">
        <div className="container">
          <div className="row g-4">
            {/* Vision */}
            <div className="col-lg-6">
              <div className="vision-card-custom bg-navy text-white p-4 p-md-4 rounded-4 shadow-sm h-100 position-relative overflow-hidden">
                <div className="vision-accent-pattern"></div>
                <p className="section-tag text-gold">OUR VISION</p>
                <h3 className="text-white font-bold mb-4">Inspiring Travel Excellence</h3>
                <p className="text-light-muted mb-3 fs-6 fs-md-5  font-light">
                  To become one of the world&apos;s most trusted and inspiring travel brands, connecting people with unforgettable destinations, meaningful experiences, and lifelong memories.
                </p>
                <p className="text-light-muted font-light">
                  We envision a future where travellers of all ages and backgrounds can explore the world with confidence through reliable services, carefully curated experiences, and exceptional customer support.
                </p>
                <p className="text-light-muted font-light mb-0">
                  Our aspiration is to build a globally recognized travel brand that transforms every journey into a cherished memory.
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="col-lg-6">
              <div className="mission-card-custom bg-white p-4 p-md-4 rounded-4 shadow-sm h-100 border border-light-subtle">
                <p className="section-tag">OUR MISSION</p>
                <h3 className="text-trip font-bold mb-4">Making Travel Seamless</h3>
                <div className="d-flex flex-column gap-3">
                  {missionPoints.map((point, index) => (
                    <div className="d-flex align-items-start gap-2" key={index}>
                      <div className="check-bullet bg-gold text-navy rounded-circle p-1 d-flex align-items-center justify-content-center mt-1 flex-shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <p className="text-muted small mb-0">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <p className="section-tag">OUR OFFERINGS</p>
            <h2 className="text-trip font-bold">What We Do</h2>
            <div className="horline mx-auto mt-2 mb-3"></div>
            <p className="text-muted max-w-lg mx-auto">
              Tripist Holidays provides comprehensive travel and tourism services. Through our network of travel partners, hotels, airlines, and stakeholders, we deliver reliable, end-to-end travel solutions.
            </p>
          </div>

          <div className="services-chips-container mb-4">
            <div className="services-chips-wrapper justify-content-center">
              {services.map((service, index) => (
                <div key={index} className="service-offering-chip">
                  <span className="dot-gold"></span>
                  {service}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-5 bg-sec border-top border-bottom border-light-subtle">
        <div className="container">
          <div className="text-center mb-5">
            <p className="section-tag">OUR FOUNDATION</p>
            <h2 className="text-trip font-bold">Our Core Values</h2>
            <div className="horline mx-auto mt-2 mb-3"></div>
            <p className="text-muted max-w-lg mx-auto">
              The principles and values that guide every single holiday package we create and every customer interaction we make.
            </p>
          </div>

          <div className="row g-4">
            {coreValues.map((value, index) => (
              <div className="col-md-6 col-lg-4" key={index}>
                <div className="value-card-custom bg-white p-4 rounded-4 shadow-sm border border-light-subtle h-100 transition-hover">
                  <div className="value-icon-wrapper mb-3">
                    {value.icon}
                  </div>
                  <h4 className="text-trip font-bold mb-2">{value.title}</h4>
                  <p className="text-muted small mb-0">{value.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <p className="section-tag">TRIPIST DIFFERENCE</p>
            <h2 className="text-trip font-bold">Why Choose Tripist Holidays?</h2>
            <div className="horline mx-auto mt-2 mb-3"></div>
            <p className="text-muted max-w-lg mx-auto">
              We focus on planning the perfect getaway so you can focus on what matters most—creating lifelong travel memories.
            </p>
          </div>

          <div className="row g-4">
            {whyChooseUs.map((item, index) => (
              <div className="col-md-6 col-lg-6" key={index}>
                <div className="choose-card-custom p-4 rounded-4 bg-light border border-light-subtle d-flex gap-3 h-100 transition-hover">
                  <div className="choose-icon-container">
                    {item.icon}
                  </div>
                  <div>
                    <h5 className="text-trip font-semibold mb-2">{item.title}</h5>
                    <p className="text-muted small mb-0">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment & CTA Section */}
      <section className="commitment-cta-section py-5 bg-navy text-white position-relative overflow-hidden">
        <div className="commitment-overlay-pattern"></div>
        <div className="container position-relative z-index-1">
          <div className="row justify-content-center">
            <div className="col-lg-8 ">
              <p className="section-tag text-gold ">OUR PROMISE</p>
              <h2 className="text-white font-bold mb-3">Our Commitment</h2>
              <p className="text-light-muted mb-4 leading-relaxed">
                At Tripist Holidays, we understand that every journey represents a dream,
                an occasion, or a milestone. We are committed to making each trip smooth,
                enjoyable, and memorable by combining professional planning, trusted
                partnerships, and dedicated customer support.
              </p>
              <p className="text-light-muted mb-5  leading-relaxed">
                Whether you&apos;re exploring the cultural heritage of India, relaxing on a
                tropical island, embarking on an international adventure, or travelling
                for business, we are here to help you travel with confidence.
              </p>
              
              
            </div>
            <div className="cta-box col bg-white-opacity p-4 rounded-4 max-w-md mx-auto my-auto">
                <h4 className="text-white font-bold mb-2">Let&apos;s Create Your Next Memory</h4>
                <p className="small text-light-muted mb-4">
                  No matter where your journey begins, Tripist Holidays is ready to help you discover extraordinary destinations, meaningful experiences, and unforgettable memories.
                </p>
                <a href="/contact-us" className="btn-trip d-inline-flex align-items-center text-decoration-none">
                  Get in Touch
                  <ArrowRight size={18} className="ms-2" />
                </a>
              </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;