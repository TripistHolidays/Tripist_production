import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";
import { ArrowRight } from "lucide-react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./styles.css";

export default function Hero() {
  const slides = [
    {
      className: "hero1",
      badge: "Explore The Unexplored",
      title: "Discover Your Next Great Escape",
      description:
        "Explore handpicked destinations and bespoke travel packages designed around your dream vibe.",
      btnText: "Explore Packages",
      btnLink: "/destinations",
    },
    {
      className: "hero2",
      badge: "Exclusive Deals",
      title: "Tailored Getaways at Unbeatable Rates",
      description:
        "Unplug, travel hassle-free, and unlock insider deals crafted for every budget.",
      // btnText: "Grab Hot Deals",
      // btnLink: "/ExplorePackages",
    },
    {
      className: "hero3",
      badge: "Unforgettable Memories",
      title: "Create Memories That Last a Lifetime",
      description:
        "Whether it’s a solo trek or a family retreat, we take care of the details so you can focus on the journey.",
      // btnText: "Plan Your Trip",
      // btnLink: "/contact-us",
    },
    {
      className: "hero4",
      badge: "Always Here For You",
      title: "24/7 Support for Endless Adventures",
      description:
        "Seamless booking, real-time support, and unforgettable destinations starting right here.",
      btnText: "Start Exploring",
      btnLink: "/destinations",
    },
  ];

  return (
    <section className="hero-container">
      <Swiper
        className="mySwiper"
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        // navigation={true}
        pagination={{
          clickable: true,
        }}
        modules={[ Pagination, Autoplay]}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className={`hero ${slide.className}`}>
              {/* Background */}
              <div className="hero-bg" />

              {/* Dark overlay */}
              <div className="hero-bg-overlay" />

              {/* Content */}
              <div className="overlay">
                <div className="hero-content">
                  <div className="hero-badge-pill">{slide.badge}</div>

                  <h1 className="hero-title">
                    {slide.title.includes("Last a Lifetime") ? (
                      <>
                        Create Memories That <br />
                        <span className="text-trip-gold">Last a Lifetime</span>
                      </>
                    ) : (
                      slide.title
                    )}
                  </h1>

                  <p className="hero-description">{slide.description}</p>

                  <div className="hero-buttons">
                    {slide.btnText && (
                      <a href={slide.btnLink} className="btn-tripist-primary">
                        {slide.btnText}
                        <ArrowRight size={18} />
                      </a>
                    )}
                    {/* <a href="/contact-us" className="btn-tripist-secondary">
                      Contact Us
                    </a> */}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
