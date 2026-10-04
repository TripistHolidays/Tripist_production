import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";
import "./OfferBanner.css";
import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";

const banners = [
  { image: hero1, link: "/honeymoon-packages" },
  { image: hero2, link: "/international-tours" },
  { image: hero3, link: "/summer-offers" },
];

export default function OfferBanner() {
  return (
    <section className="offer-section  mt-4">
      <Swiper
  modules={[Pagination, Autoplay]}
  pagination={{ clickable: true }}
  autoplay={{
    delay: 4000,
    disableOnInteraction: false,
  }}
  loop
>
        {banners.map((banner, index) => (
          <SwiperSlide key={index} >
            <Link to={banner.link} className="d-block overflow-hidden rounded-4">
              <img
                src={banner.image}
                alt="Offer Banner"
                className="img-fluid offer-image"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}