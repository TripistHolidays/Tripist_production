import React, { useEffect, useState } from 'react';
import './DestinationSpecialists.css';

const DestinationSpecialists = () => {
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const specialists = [
    {
      id: 1,
      flag: 'https://flagcdn.com/w80/mu.png',
      title: 'Mauritius Specialist',
      issuedBy: 'Mauritius Tourism Promotion Authority',
      certificate: '/certificates/mauritius-certificate.jpeg',
      details: [
        'Successfully completed the "Discover Mauritius" E-Learning Program.',
        'Recognized for specialized knowledge in Mauritius tourism, culture, and island experiences.',
        'Official Certification Date: July 29, 2026'
      ],
      tagClass: 'badge-emerald'
    },
    {
      id: 2,
      flag: 'https://flagcdn.com/w80/fj.png',
      title: 'Fiji Matai Bronze Specialist',
      issuedBy: 'Tourism Fiji',
      certificate: '/certificates/fiji-certificate.jpg',
      details: [
        'Awarded Matai Bronze Specialist status for expertise in Fijian travel and hospitality.',
        'Certified directly under Tourism Fiji leadership.',
        'Completion Date: June 5, 2026'
      ],
      tagClass: 'badge-amber'
    },
    {
      id: 3,
      flag: 'https://flagcdn.com/w80/nz.png',
      title: '100% Pure New Zealand Graduate Specialist',
      issuedBy: 'Tourism New Zealand',
      certificate: '/certificates/new-zealand-certificate.jpg',
      details: [
        'Achieved Graduate Specialist designation under the official 100% Pure New Zealand Specialist Programme.',
        'Qualified to design custom, immersive New Zealand holiday itineraries.',
        'Certified expertise in eco-tourism, adventures, and iconic destinations.'
      ],
      tagClass: 'badge-blue'
    }
  ];

  /* ESC KEY - CLOSE LIGHTBOX */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedCertificate(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  /* PREVENT BACKGROUND SCROLL */
  useEffect(() => {
    if (selectedCertificate) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCertificate]);

  return (
    <div className="tripist-specialists-section py-5">
      {/* Header Section */}
      <header className="container text-center mb-5" style={{ maxWidth: '800px' }}>
       
        <h1 className="trip-main-heading fw-bold mb-3">Certified Destination Specialists</h1>
        <div className="trip-heading-divider mx-auto mb-3"></div>
        <p className="trip-quote fst-italic mb-3">"Every Destination Is A Memory."</p>
        <p className="trip-intro-text mx-auto lead fs-6 text-muted" style={{ maxWidth: '650px' }}>
          We combine localized expertise with official global tourism board certifications to design seamless, bespoke journeys across the globe.
        </p>
      </header>

      {/* Grid Container */}
      <main className="container" style={{ maxWidth: '1140px' }}>
        <div className="row g-4">
          {specialists.map((spec) => (
            <div key={spec.id} className="col-12 col-md-4">
              <article className="card h-100 custom-specialist-card border-0 overflow-hidden d-flex flex-column">
                
                {/* Certificate Image Preview with Elegant Scale Effect */}
                <div 
                  className="specialist-image-container position-relative overflow-hidden"
                  onClick={() => setSelectedCertificate(spec)}
                  title="Click to inspect certificate"
                >
                  <img
                    src={spec.certificate}
                    alt={`${spec.title} certificate`}
                    className="w-100 specialist-thumb-image"
                  />
                  <div className="specialist-image-overlay d-flex align-items-center justify-content-center">
                    <span className="trip-zoom-badge px-3 py-2 rounded-pill fw-semibold shadow-sm">
                      <i className="bi bi-zoom-in me-1"></i> View Certificate
                    </span>
                  </div>
                </div>

                <div className="p-4 d-flex flex-column justify-content-between flex-grow-1 bg-white">
                  <div>
                    {/* Flag & Tag */}
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <img
                        src={spec.flag}
                        alt={`${spec.title} flag`}
                        className="country-flag shadow-sm"
                      />
                     
                    </div>

                    {/* Title */}
                    <h2 className="specialist-card-title fw-bold mb-2">{spec.title}</h2>

                    {/* Issued By */}
                    <p className="issued-by-text text-uppercase fw-semibold mb-3">
                      Issued by {spec.issuedBy}
                    </p>

                    {/* Details */}
                    <ul className="list-unstyled mb-0">
                      {spec.details.map((detail, idx) => (
                        <li key={idx} className="d-flex align-items-start mb-2 detail-list-item">
                          <span className="bullet-point me-2">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </article>
            </div>
          ))}
        </div>
      </main>

      {/* CERTIFICATE LIGHTBOX */}
      {selectedCertificate && (
        <div className="certificate-lightbox" onClick={() => setSelectedCertificate(null)}>
          <div className="certificate-lightbox-content" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="certificate-lightbox-close"
              onClick={() => setSelectedCertificate(null)}
              aria-label="Close certificate"
            >
              &times;
            </button>
            <img
              src={selectedCertificate.certificate}
              alt={`${selectedCertificate.title} certificate`}
              className="certificate-lightbox-image"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationSpecialists;