import React from "react";
import "./AccreditationPartners.css";

export const governmentLogos = [
  { name: "Incredible India", slug: "incredible-india" },
  { name: "Ministry of Tourism (Govt. of India)", slug: "ministry-of-tourism" },
  {
    name: "NIDHI (National Integrated Database of Hospitality Industry)",
    slug: "nidhi",
  },
  { name: "Tamil Nadu Tourism / Trek Tamilnadu", slug: "trek-tamilnadu" },
];

export const destinationLogos = [
  { name: "100% Pure New Zealand", slug: "pure-new-zealand" },
  { name: "Azerbaijan Tourism Board", slug: "azerbaijan-tourism" },
  { name: "Bali Tourism Board", slug: "bali-tourism" },
  { name: "Cook Islands Tourism", slug: "cook-islands-tourism" },
  { name: "Dubai Economy and Tourism (Visit Dubai)", slug: "visit-dubai" },
  { name: "Georgian National Tourism Administration", slug: "georgia-tourism" },
  { name: "Kazakh Tourism", slug: "kazakh-tourism" },
  { name: "Lao National Tourism Administration", slug: "laos-tourism" },
  {
    name: "Mauritius Tourism Promotion Authority (MTPA)",
    slug: "mauritius-tourism",
  },
  { name: "Ministry of Tourism Cambodia", slug: "cambodia-tourism" },
  { name: "Nepal Tourism Board", slug: "nepal-tourism-board" },
  { name: "Saudi Tourism Authority (Visit Saudi)", slug: "visit-saudi" },
  { name: "Singapore Tourism Board", slug: "singapore-tourism-board" },
  { name: "Sri Lanka Tourism Promotion Bureau", slug: "sri-lanka-tourism" },
  { name: "Tourism Australia", slug: "tourism-australia" },
  {
    name: "Tourism Authority of Thailand (Amazing Thailand)",
    slug: "amazing-thailand",
  },
  { name: "Tourism Committee of Armenia", slug: "armenia-tourism" },
  { name: "Tourism Fiji", slug: "tourism-fiji" },
  { name: "Tourism Malaysia", slug: "tourism-malaysia" },
  { name: "Tourism Seychelles", slug: "tourism-seychelles" },
  { name: "Uzbekistan Tourism", slug: "uzbekistan-tourism" },
  { name: "Vietnam National Authority of Tourism", slug: "vietnam-tourism" },
  { name: "Visit Maldives (MMPRC)", slug: "visit-maldives" },
  { name: "Wonderful Indonesia", slug: "wonderful-indonesia" },
];

export const hotelLogos = [
  { name: "Accor", category: "Hospitality" },
  { name: "Bloom Hotels", category: "Hospitality" },
  { name: "CGH Earth", category: "Hospitality" },
  { name: "Daiwik Hotels", category: "Hospitality" },
  { name: "Hilton", category: "Hospitality" },
  { name: "Hyatt Hotels", category: "Hospitality" },
  { name: "ITC Hotels", category: "Hospitality" },
  { name: "jüSTa Hotels & Resorts", category: "Hospitality" },
  { name: "Marigold Regency", category: "Hospitality" },
  { name: "Marriott International", category: "Hospitality" },
  { name: "Novotel", category: "Hospitality" },
  { name: "OYO", category: "Hospitality" },
  { name: "Poppys Hotel", category: "Hospitality" },
  { name: "Praveg", category: "Hospitality" },
  { name: "Radisson Hotel Group", category: "Hospitality" },
  { name: "Sterling Holiday Resorts", category: "Hospitality" },
  { name: "Taj Hotels (IHCL)", category: "Hospitality" },
  { name: "The Leela Palaces, Hotels and Resorts", category: "Hospitality" },
  { name: "The Oberoi Group", category: "Hospitality" },
  { name: "The Residency Group of Hotels", category: "Hospitality" },
];

export const airlineLogos = [
  { name: "Air India", category: "Airline" },
  { name: "Air India Express", category: "Airline" },
  { name: "AirAsia", category: "Airline" },
  { name: "Akasa Air", category: "Airline" },
  { name: "Emirates", category: "Airline" },
  { name: "Etihad Airways", category: "Airline" },
  { name: "Fly91", category: "Airline" },
  { name: "IndiGo", category: "Airline" },
  { name: "Malaysia Airlines", category: "Airline" },
  { name: "Qatar Airways", category: "Airline" },
  { name: "Scoot", category: "Airline" },
  { name: "Singapore Airlines", category: "Airline" },
  { name: "SpiceJet", category: "Airline" },
  { name: "SriLankan Airlines", category: "Airline" },
  { name: "Thai Airways", category: "Airline" },
];

export const otherLogos = [
  { name: "Cordelia Cruises", category: "Cruise" },
  { name: "MakeMyTrip", category: "OTA" },
  { name: "RedBus", category: "Mobility" },
  { name: "Wonderla", category: "Attraction" },
];

export const topRowLogos = [...governmentLogos, ...destinationLogos];
export const bottomRowLogos = [...hotelLogos, ...airlineLogos, ...otherLogos];

const filenameMapping = {
  "Incredible India": "incredible-india.png",
  "Ministry of Tourism (Govt. of India)": "ministry-of-tourism.png",
  "NIDHI (National Integrated Database of Hospitality Industry)": "nidhi.png",
  "Tamil Nadu Tourism / Trek Tamilnadu": "trek-tamilnadu.png",

  "100% Pure New Zealand": "pure-new-zealand.png",
  "Azerbaijan Tourism Board": "azerbaijan-tourism.png",
  "Bali Tourism Board": "bali-tourism.png",
  "Cook Islands Tourism": "cook-islands-tourism.png",
  "Dubai Economy and Tourism (Visit Dubai)": "visit-dubai.png",
  "Georgian National Tourism Administration": "georgia-tourism.png",
  "Kazakh Tourism": "kazakh-tourism.png",
  "Lao National Tourism Administration": "laos-tourism.png",
  "Mauritius Tourism Promotion Authority (MTPA)": "mauritius-tourism.png",
  "Ministry of Tourism Cambodia": "cambodia-tourism.png",
  "Nepal Tourism Board": "nepal-tourism-board.png",
  "Saudi Tourism Authority (Visit Saudi)": "visit-saudi.png",
  "Singapore Tourism Board": "singapore-tourism-board.png",
  "Sri Lanka Tourism Promotion Bureau": "sri-lanka-tourism.png",
  "Tourism Australia": "tourism-australia.png",
  "Tourism Authority of Thailand (Amazing Thailand)": "amazing-thailand.png",
  "Tourism Committee of Armenia": "armenia-tourism.png",
  "Tourism Fiji": "tourism-fiji.png",
  "Tourism Malaysia": "tourism-malaysia.png",
  "Tourism Seychelles": "tourism-seychelles.png",
  "Uzbekistan Tourism": "uzbekistan-tourism.png",
  "Vietnam National Authority of Tourism": "vietnam-tourism.png",
  "Visit Maldives (MMPRC)": "visit-maldives.png",
  "Wonderful Indonesia": "wonderful-indonesia.png",

  Accor: "accor.png",
  "Bloom Hotels": "bloom-hotels.png",
  "CGH Earth": "cgh-earth.png",
  "Daiwik Hotels": "daiwik-hotels.png",
  Hilton: "hilton.png",
  "Hyatt Hotels": "hyatt.png",
  "ITC Hotels": "itc-hotels.png",
  "jüSTa Hotels & Resorts": "justa-hotels.png",
  "Marigold Regency": "marigold-regency.png",
  "Marriott International": "marriott.png",
  Novotel: "novotel.png",
  OYO: "oyo.png",
  "Poppys Hotel": "poppys-hotel.png",
  Praveg: "praveg.png",
  "Radisson Hotel Group": "radisson.png",
  "Sterling Holiday Resorts": "sterling-holiday-resorts.png",
  "Taj Hotels (IHCL)": "taj-hotels.png",
  "The Leela Palaces, Hotels and Resorts": "leela-palaces.png",
  "The Oberoi Group": "oberoi-hotels.png",
  "The Residency Group of Hotels": "residency-hotels.png",

  "Air India": "air-india.png",
  "Air India Express": "air-india-express.png",
  AirAsia: "airasia.png",
  "Akasa Air": "akasa-air.png",
  Emirates: "emirates.png",
  "Etihad Airways": "etihad-airways.png",
  Fly91: "fly91.png",
  IndiGo: "indigo.png",
  "Malaysia Airlines": "malaysia-airlines.png",
  "Qatar Airways": "qatar-airways.png",
  Scoot: "scoot.png",
  "Singapore Airlines": "singapore-airlines.png",
  SpiceJet: "spicejet.png",
  "SriLankan Airlines": "srilankan-airlines.png",
  "Thai Airways": "thai-airways.png",

  "Cordelia Cruises": "cordelia-cruises.png",
  MakeMyTrip: "makemytrip.png",
  RedBus: "redbus.png",
  Wonderla: "wonderla.png",
};

const logoModules = import.meta.glob(
  "../assets/logo/*.{png,jpg,jpeg,svg,webp}",
  { eager: true },
);

function mapLogosWithImages(list) {
  return list.map((item) => {
    const filename = filenameMapping[item.name];
    if (filename) {
      const matchedKey = Object.keys(logoModules).find((key) =>
        key.endsWith(`/${filename}`),
      );
      if (matchedKey && logoModules[matchedKey]) {
        return {
          ...item,
          image: logoModules[matchedKey].default || logoModules[matchedKey],
        };
      }
    }
    return { ...item, image: "" };
  });
}

const row1 = mapLogosWithImages(topRowLogos);
const row2 = mapLogosWithImages(bottomRowLogos);

const scrollingRow1 = [...row1, ...row1];
const scrollingRow2 = [...row2, ...row2];

function PartnerLogo({ logo }) {
  return (
    <div className="tripist-partner-logo" aria-label={logo.name}>
      {logo.image ? (
        <img
          src={logo.image}
          alt={logo.name}
          loading="lazy"
          draggable="false"
        />
      ) : (
        <span className="tripist-partner-placeholder">{logo.name}</span>
      )}
    </div>
  );
}

export default function AccreditationPartners() {
  return (
    <section
      className="tripist-accreditation"
      aria-labelledby="tripist-accreditation-title"
    >
      <div className="tripist-accreditation-container">
        <div className="tripist-accreditation-heading">
          <span className="tripist-accreditation-eyebrow">
            Trusted Connections
          </span>
          <h2 id="tripist-accreditation-title">
            Our Accreditations &amp; Partners
          </h2>
          <p>
            Proudly connected with trusted travel organisations, industry
            networks, and partners that help us deliver reliable travel
            experiences.
          </p>
        </div>
      </div>

      <div className="tripist-logo-marquee mb-3">
        <div className="tripist-logo-track scroll-left">
          {scrollingRow1.map((logo, index) => (
            <PartnerLogo key={`top-${logo.name}-${index}`} logo={logo} />
          ))}
        </div>
      </div>

      <div className="tripist-logo-marquee">
        <div className="tripist-logo-track scroll-right">
          {scrollingRow2.map((logo, index) => (
            <PartnerLogo key={`bottom-${logo.name}-${index}`} logo={logo} />
          ))}
        </div>
      </div>

      <div className="tripist-accreditation-container">
        <div className="tripist-accreditation-note">
          <span className="tripist-accreditation-line" />
          <span>Building journeys with trusted travel partners</span>
          <span className="tripist-accreditation-line" />
        </div>
      </div>
    </section>
  );
}
