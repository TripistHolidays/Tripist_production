import React from "react";
import {
  Globe2,
  Compass,
  Heart,
  ShieldCheck,
  Sparkles,
  Users,
  Plane,
  Hotel,
  Ship,
  Map,
  Briefcase,
  GraduationCap,
  Mountain,
  CalendarDays,
  Car,
  ArrowRight,
  CheckCircle2,
  Building2,
  Smartphone,
} from "lucide-react";
import "./AboutTripist.css";
import heroImage from "../assets/about_hero.jpg";

const services = [
  { icon: <Compass size={22} />, title: "Travel Consultation", text: "Travel consultation and itinerary planning designed around every traveler's needs." },
  { icon: <Hotel size={22} />, title: "Hotels & Resorts", text: "Hotel and resort reservations for comfortable and memorable stays." },
  { icon: <Car size={22} />, title: "Transportation", text: "Transportation arrangements and airport transfers for seamless journeys." },
  { icon: <Ship size={22} />, title: "Cruise Bookings", text: "Cruise bookings and curated cruise holiday experiences." },
  { icon: <Map size={22} />, title: "Sightseeing & Experiences", text: "Sightseeing tours, destination experiences, and tourism-related activities." },
  { icon: <ShieldCheck size={22} />, title: "Travel Assistance", text: "Travel insurance assistance and visa assistance to simplify travel planning." },
  { icon: <Building2 size={22} />, title: "Destination Management", text: "Destination management coordination and comprehensive tourism support." },
  { icon: <CalendarDays size={22} />, title: "Event Travel Management", text: "Travel solutions and management support for destination events and corporate requirements." }
];

const missions = [
  { number: "01", icon: <Heart size={20} />, title: "Personalized Experiences", text: "Designing personalized travel experiences that cater to honeymooners, families, groups, solo travelers, luxury seekers, and adventure enthusiasts." },
  { number: "02", icon: <Sparkles size={20} />, title: "Curated Travel", text: "Offering carefully curated holiday packages, travel services, and destination experiences that combine quality, value, comfort, and authenticity." },
  { number: "03", icon: <Users size={20} />, title: "Lasting Relationships", text: "Building lasting relationships with travelers through transparency, reliability, customer-centric service, and continuous support." },
  { number: "04", icon: <Smartphone size={20} />, title: "Technology & Expertise", text: "Leveraging technology, industry partnerships, and destination expertise to simplify travel planning and enhance every stage of the travel journey." },
  { number: "05", icon: <Globe2 size={20} />, title: "Responsible Tourism", text: "Promoting responsible and sustainable tourism that respects local communities, cultures, and natural environments." },
  { number: "06", icon: <Compass size={20} />, title: "Inspiring Exploration", text: "Inspiring people to explore beyond boundaries and create memories that last a lifetime." }
];

const categories = [
  { icon: <Plane size={20} />, title: "Domestic & International Tours" },
  { icon: <Heart size={20} />, title: "Honeymoon Packages" },
  { icon: <Users size={20} />, title: "Group Tours" },
  { icon: <Compass size={20} />, title: "Customized Vacations" },
  { icon: <Mountain size={20} />, title: "Adventure Travel" },
  { icon: <Sparkles size={20} />, title: "Luxury Travel" },
  { icon: <Briefcase size={20} />, title: "Corporate Travel" },
  { icon: <GraduationCap size={20} />, title: "Educational Tours" },
  { icon: <Globe2 size={20} />, title: "Pilgrimage Tours" },
  { icon: <Ship size={20} />, title: "Cruise Holidays" },
  { icon: <CalendarDays size={20} />, title: "Destination Events" },
  { icon: <Map size={20} />, title: "Tourism Experiences" }
];

const partners = [
  { icon: <Plane size={20} />, title: "Airlines" },
  { icon: <Hotel size={20} />, title: "Hotels & Resorts" },
  { icon: <Globe2 size={20} />, title: "Tourism Boards" },
  { icon: <Ship size={20} />, title: "Cruise Operators" },
  { icon: <Building2 size={20} />, title: "DMCs" },
  { icon: <Smartphone size={20} />, title: "Travel Technology" },
  { icon: <Mountain size={20} />, title: "Attractions & Activities" },
  { icon: <Car size={20} />, title: "Transportation Providers" }
];

const activities = [
  "Travel agents", "Tour operators", "Holiday planners", "Destination management services",
  "Travel consultants", "Tourism promoters", "Hospitality service providers", "Cruise booking agents",
  "Hotel and resort booking facilitators", "Travel technology service providers", "Domestic and international tours",
  "Vacations and holidays", "Honeymoon packages", "Group tours", "Leisure travel", "Corporate travel",
  "Educational tours", "Pilgrimage tours", "Adventure tourism", "Luxury travel", "Events and experiences"
];

export default function AboutTripist() {
  return (
    <main className="text-secondary bg-white">
      {/* 1. Hero Section with Background & Transparent Gradient Overlay */}
      <section 
        className="about-hero text-white d-flex align-items-center py-5"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="about-hero-overlay"></div>
        <div className="circle-decor circle-hero"></div>
        
        <div className="container py-4 position-relative z-2">
          <div className="row">
            <div className="col-12 col-lg-8">
              <span className="hero-eyebrow text-gold fw-bold small text-uppercase tracking-wide">
                Tripist Holidays Private Limited
              </span>
              <h1 className="display-5 fw-bold text-white my-3">
                Every Destination <span className="text-gold d-block">Is A Memory.</span>
              </h1>
              <p className="lead fs-6 text-white-50 mb-4 pe-lg-5">
                A travel, tourism, hospitality, and experiences company creating seamless, inspiring, and memorable journeys.
              </p>
              <a 
                href="#about-company" 
                className="btn btn-hero rounded-pill fw-bold px-4 py-2 d-inline-flex align-items-center gap-2 text-decoration-none"
              >
                Discover Tripist <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Company Intro */}
      <section id="about-company" className="py-5">
        <div className="container py-lg-4">
          <div className="text-center mb-5">
            <span className="text-gold fw-bold small text-uppercase tracking-wide">About Tripist Holidays</span>
            <h2 className="fw-bold text-navy mt-1">Creating journeys that become <span className="text-gold">cherished memories.</span></h2>
          </div>

          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-7">
              <p className="fs-5 text-navy fw-semibold mb-3">
                Tripist Holidays Private Limited is a travel, tourism, hospitality, and experiences company engaged in planning, organizing, marketing, and managing domestic and international travel services.
              </p>
              <p className="text-muted">
                Our business encompasses holiday packages, tours, cruises, honeymoon packages, group tours, customized vacations, luxury travel, corporate travel, educational tours, and destination events.
              </p>
            </div>

            <div className="col-12 col-lg-5">
              <div className="bg-navy text-white p-4 p-md-5 rounded-4 shadow-sm position-relative overflow-hidden">
                <div className="icon-box-gold mb-3 bg-white text-navy">
                  <Compass size={24} className="text-gold" />
                </div>
                <span className="text-gold fw-bold small text-uppercase tracking-wide">Our Philosophy</span>
                <h4 className="text-white fw-bold my-2">Travel is more than reaching a destination.</h4>
                <p className="text-white-50 small m-0">It is about discovering new places, new perspectives, meaningful experiences, and memories that last a lifetime.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Services */}
      <section className="py-5 bg-soft-gray">
        <div className="container py-lg-4">
          <div className="mb-4">
            <span className="text-gold fw-bold small text-uppercase tracking-wide">What We Do</span>
            <h2 className="fw-bold text-navy">End-to-end travel <span className="text-gold">solutions.</span></h2>
            <p className="text-muted col-lg-8 p-0">From consultation and reservations to on-ground transfers and itinerary coordination, we take care of the entire travel lifecycle.</p>
          </div>

          <div className="row g-3 g-md-4">
            {services.map((item, i) => (
              <div key={i} className="col-12 col-sm-6 col-lg-3">
                <div className="bg-white p-4 rounded-4 h-100 about-card d-flex flex-column shadow-sm">
                  <div className="icon-box-gold mb-3">{item.icon}</div>
                  <h6 className="fw-bold text-navy mb-2">{item.title}</h6>
                  <p className="text-muted small m-0">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Vision */}
      <section className="py-5 bg-navy text-white position-relative overflow-hidden">
        <div className="circle-decor circle-lg"></div>
        <div className="circle-decor circle-sm"></div>
        <div className="container py-lg-4 position-relative z-1">
          <div className="row g-4 align-items-start">
            <div className="col-12 col-md-3">
              <span className="text-gold fw-bold small text-uppercase tracking-wide">Our Vision</span>
              <div className="icon-box-gold mt-3 p-3 w-100 h-100">
                <Globe2 size={160} />
              </div>
            </div>
            <div className="col-12 col-md-9">
              <h2 className="fw-bold text-white mb-3">To become one of the world's most trusted and inspiring <span className="text-gold">travel brands.</span></h2>
              <p className="lead fs-6 text-white fw-medium mb-3">Connecting people with unforgettable destinations, meaningful experiences, and lifelong memories.</p>
              <p className="text-white-50 small mb-2">We envision a future where Tripist Holidays empowers travelers of all backgrounds to explore with confidence, whether seeking luxury escapes, family vacations, or adventurous discoveries.</p>
              <p className="text-white-50 small m-0">Guided by innovation and trust, we aim to be the preferred travel companion for millions across India and the globe.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Mission */}
      <section className="py-5">
        <div className="container py-lg-4">
          <div className="text-center mb-5">
            <span className="text-gold fw-bold small text-uppercase tracking-wide">Our Mission</span>
            <h2 className="fw-bold text-navy mt-1">Creating seamless, inspiring, <span className="text-gold">memorable travel experiences.</span></h2>
          </div>

          <div className="row g-3 g-md-4">
            {missions.map((m) => (
              <div key={m.number} className="col-12 col-md-6 col-lg-4">
                <div className="bg-soft-gray p-4 rounded-4 h-100 about-card d-flex flex-column shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-gold fw-bold small tracking-wide">{m.number}</span>
                    <div className="icon-box-gold bg-white">{m.icon}</div>
                  </div>
                  <h6 className="fw-bold text-navy mb-2">{m.title}</h6>
                  <p className="text-muted small m-0">{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 p-md-4 rounded-4 border text-center d-flex flex-column flex-sm-row align-items-center justify-content-center gap-2" style={{ backgroundColor: "var(--trip-gold-bg)" }}>
            <Heart size={20} className="text-gold flex-shrink-0" />
            <span className="fw-semibold text-navy small">Every destination is a memory, and our mission is to help travelers create memories worth cherishing forever.</span>
          </div>
        </div>
      </section>

      {/* 6. Travel Categories */}
      <section className="py-5 bg-soft-gray">
        <div className="container py-lg-4">
          <div className="text-center mb-4">
            <span className="text-gold fw-bold small text-uppercase tracking-wide">Our Travel World</span>
            <h2 className="fw-bold text-navy mt-1">Experiences for <span className="text-gold">every kind of traveler.</span></h2>
          </div>

          <div className="row g-2 g-md-3">
            {categories.map((cat, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-lg-3">
                <div className="bg-white p-3 rounded-3 d-flex align-items-center gap-3 about-card shadow-sm">
                  <div className="icon-box-gold flex-shrink-0">{cat.icon}</div>
                  <span className="fw-bold text-navy small">{cat.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Ecosystem */}
      <section className="py-5 bg-navy text-white">
        <div className="container py-lg-4">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-5">
              <span className="text-gold fw-bold small text-uppercase tracking-wide">Our Ecosystem</span>
              <h2 className="fw-bold text-white mt-2">Connected through <span className="text-gold">meaningful partnerships.</span></h2>
              <p className="text-white-50 small mt-3">We collaborate with airlines, hotel chains, tourism boards, cruise operators, and DMCs to build comprehensive travel itineraries worldwide.</p>
            </div>
            <div className="col-12 col-lg-7">
              <div className="row g-2">
                {partners.map((p, idx) => (
                  <div key={idx} className="col-6">
                    <div className="p-3 rounded-3 d-flex align-items-center gap-2" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <span className="text-gold">{p.icon}</span>
                      <span className="small fw-semibold text-white">{p.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Business Scope & Activities */}
      <section className="py-5">
        <div className="container py-lg-4">
          <div className="text-center mb-5">
            <span className="text-gold fw-bold small text-uppercase tracking-wide">Our Operations</span>
            <h2 className="fw-bold text-navy mt-1">A complete travel & tourism <span className="text-gold">ecosystem.</span></h2>
          </div>

          <div className="row g-2">
            {activities.map((act, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-lg-4">
                <div className="p-3 rounded-3 bg-soft-gray border d-flex align-items-center gap-2">
                  <CheckCircle2 size={16} className="text-gold flex-shrink-0" />
                  <span className="small fw-semibold text-navy">{act}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}