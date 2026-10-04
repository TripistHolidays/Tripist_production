import React from 'react';
import './TripistBenefits.css'; 

const TripistBenefits = () => {
  const benefits = [
    {
      icon: "bi-sliders",
      title: "Tailored Just For You",
      description: "Handcrafted itineraries built around your vibe, schedule, and dream travel style."
    },
    {
      icon: "bi-wallet2",
      title: "Unbeatable Value",
      description: "Premium travel experiences designed to fit your budget, not strain it."
    },
    {
      icon: "bi-fire",
      title: "Hot Deals & Discounts",
      description: "Unlock insider perks and exclusive savings on top-tier holiday packages."
    },
    {
      icon: "bi-headset",
      title: "24/7 Travel Buddy",
      description: "Real human support, anytime, anywhere. We've got your back around the clock."
    }
  ];

  return (
    <section className="tripist-container container my-5">
      {/* --- Top Section: Benefits Header & Cards --- */}
      <div className="tripist-hero-wrapper mb-5 p-4 p-md-5 rounded-4">
        <div className="mb-4">
          <span className="tripist-badge mb-2 d-inline-block">WHY CHOOSE US</span>
          <h2 className="tripist-main-heading">Why Travel With Tripist</h2>
          <div className="d-flex align-items-center gap-3 mt-3 mb-2">
            <div className="tripist-horline"></div>
            <p className="tripist-sub-heading mb-0">
              Unforgettable journeys, zero hassle. Here’s why smart travelers choose us.
            </p>
          </div>
        </div>

        <div className="row g-4 mt-2">
          {benefits.map((item, index) => (
            <div className="col-12 col-sm-6 col-lg-3" key={index}>
              <div className="card tripist-card h-100 text-left p-4">
                <div className="tripist-icon-wrapper mb-3">
                  <i className={`bi ${item.icon} tripist-icon`}></i>
                </div>
                <h5 className="tripist-card-title">{item.title}</h5>
                <p className="tripist-card-text">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Bottom Section: Content Block with Structured Glass Layout --- */}
      <div className="tripist-content-block p-4 p-md-5 rounded-4 shadow-sm">
        <div className="mb-5">
          <h2 className="tripist-section-title">Book Your Next Escape With Tripist</h2>
          <p className="tripist-paragraph">
            Unplug, explore, and leave the logistics to us. At Tripist, we craft seamless, affordable getaways tailored to your unique travel style. Whether you’re chasing adrenaline, quiet coastal waves, or vibrant cityscapes, our packages promise an effortless getaway tailored just for you. Start planning your dream vacation today!
          </p>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-lg-6">
            <div className="tripist-feature-box h-100 p-4 rounded-3">
              <h4 className="tripist-sub-title">Seamless Booking, Smarter Prices!</h4>
              <p className="tripist-paragraph mb-3">
                Planning your dream trip shouldn't feel like work. With Tripist’s user-friendly platform, 
                finding and booking your ideal escape takes just a few clicks. Whether you’re dreaming of a 
                beach escape or a mountain retreat, finding and booking your perfect getaway is straightforward 
                and hassle-free with us.
              </p>
              <p className="tripist-paragraph mb-0">
                Unlock unbeatable savings on your next getaway with us, your ultimate travel companion! Discover
                a world of affordable packages customized to meet your diverse needs.
              </p>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="tripist-feature-box h-100 p-4 rounded-3">
              <h4 className="tripist-sub-title">Create Memories That Last A Lifetime!</h4>
              <p className="tripist-paragraph mb-3">
                Embark on a mountain escape or a city adventure with our exclusive travel rates and leverage exclusive discounts, ensuring your travel is as economical as it is enjoyable.
              </p>
              <p className="tripist-paragraph mb-0">
                Solo adventurer, couple, or family squad—we’ve got custom itineraries designed for every kind of traveler. Pick your destination, pack your bags, and let us handle the details. Start your adventure today!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TripistBenefits;