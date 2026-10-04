import React, { useState, useEffect } from 'react';
import './TermsConditions.css';
import api from '../Admin/api';

const CancellationRefundPolicy = () => {
  const [contactInfo, setContactInfo] = useState({
    phone: '+91 96555 96867',
    email: 'info@tripistholidays.com',
    address: 'Flat No. 2, Plot No. 1051, I Block 35th Street, Anna Nagar, Chennai, Tamil Nadu - 600040, India',
    website: 'www.tripistholidays.com'
  });

  useEffect(() => {
    api.getContact()
      .then((data) => {
        if (data && !data.error && Object.keys(data).length > 0) {
          setContactInfo((prev) => ({
            ...prev,
            phone: data.phone || prev.phone,
            email: data.email || prev.email,
            address: data.address || prev.address,
          }));
        }
      })
      .catch((err) => console.error("Error fetching contact info:", err));
  }, []);

  return (
    <div className="terms-container">
      <div className="terms-paper">
        {/* Header */}
        <header className="terms-header">
          <h1 className="terms-title">Tripist Holidays</h1>
          <p className="terms-subtitle">Cancellation &amp; Refund Policy</p>
          <div className="terms-meta">
            <span>Effective Date: 01 April 2026</span>
            <span>Last Updated: 01 April 2026</span>
          </div>
        </header>

        {/* Intro */}
        <section className="terms-section">
          <p>
            At Tripist Holidays ("Tripist Holidays", "we", "our", or "us"), we strive to provide a seamless travel experience. We understand that travel plans may change due to unforeseen circumstances. This Cancellation &amp; Refund Policy outlines the terms governing cancellations and refunds for bookings made through Tripist Holidays, a travel brand owned and operated by Tripist Holidays Private Limited.
          </p>
          <p>
            By confirming a booking with us, you acknowledge that you have read, understood, and agreed to this Cancellation &amp; Refund Policy.
          </p>
        </section>

        {/* 1. Scope */}
        <section className="terms-section">
          <h2 className="terms-heading">1. Scope</h2>
          <p>This policy applies to all travel-related services arranged by Tripist Holidays, including but not limited to:</p>
          <ul className="terms-list">
            <li>Domestic Holiday Packages</li>
            <li>International Holiday Packages</li>
            <li>Group Tours</li>
            <li>Customized Holidays</li>
            <li>Hotel Reservations</li>
            <li>Flight Bookings</li>
            <li>Airport Transfers</li>
            <li>Transportation Services</li>
            <li>Cruise Holidays</li>
            <li>Visa Assistance</li>
            <li>Corporate Travel (MICE)</li>
            <li>Pilgrimage Tours</li>
            <li>Other travel-related services</li>
          </ul>
        </section>

        {/* 2. Booking Confirmation */}
        <section className="terms-section">
          <h2 className="terms-heading">2. Booking Confirmation</h2>
          <p>A booking is considered confirmed only after:</p>
          <ul className="terms-list">
            <li>Required traveller details have been received.</li>
            <li>The applicable payment has been successfully received.</li>
            <li>Confirmation has been received from the respective supplier(s).</li>
            <li>Tripist Holidays issues a booking confirmation.</li>
          </ul>
        </section>

        {/* 3. Cancellation by the Customer */}
        <section className="terms-section">
          <h2 className="terms-heading">3. Cancellation by the Customer</h2>
          <p>If you wish to cancel your booking, you must notify Tripist Holidays in writing through:</p>
          <ul className="terms-list">
            <li>Email: <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></li>
            <li>WhatsApp</li>
            <li>Official customer support channels</li>
          </ul>
          <p>The date on which we receive your cancellation request will be considered the official cancellation date. Verbal cancellation requests may not be accepted unless confirmed in writing.</p>
        </section>

        {/* 4. Cancellation Charges */}
        <section className="terms-section">
          <h2 className="terms-heading">4. Cancellation Charges</h2>
          <p>Cancellation charges depend on various factors, including:</p>
          <ul className="terms-list">
            <li>Airline policies</li>
            <li>Hotel policies</li>
            <li>Destination Management Company (DMC) policies</li>
            <li>Cruise operator policies</li>
            <li>Transport provider policies</li>
            <li>Visa processing status</li>
            <li>Tour package conditions</li>
          </ul>
          <p>Accordingly, cancellation charges may vary from booking to booking.</p>
          <p>Tripist Holidays will communicate the applicable cancellation charges after reviewing the booking with the relevant service providers.</p>
        </section>

        {/* 5. Non-Refundable Services */}
        <section className="terms-section">
          <h2 className="terms-heading">5. Non-Refundable Services</h2>
          <p>The following may be partially or fully non-refundable, depending on the supplier's terms:</p>
          <ul className="terms-list">
            <li>Airline tickets</li>
            <li>Visa processing fees</li>
            <li>Travel insurance premiums</li>
            <li>Hotel reservations</li>
            <li>Cruise bookings</li>
            <li>Event or attraction tickets</li>
            <li>Service charges</li>
            <li>Processing fees</li>
            <li>Government fees</li>
            <li>Taxes that are designated as non-refundable</li>
          </ul>
        </section>

        {/* 6. Cancellation by Tripist Holidays */}
        <section className="terms-section">
          <h2 className="terms-heading">6. Cancellation by Tripist Holidays</h2>
          <p>Tripist Holidays reserves the right to cancel or modify any booking due to circumstances including but not limited to:</p>
          <ul className="terms-list">
            <li>Supplier cancellation</li>
            <li>Operational reasons</li>
            <li>Safety concerns</li>
            <li>Insufficient participation in group tours</li>
            <li>Government restrictions</li>
            <li>Force majeure events</li>
          </ul>
          <p>Where possible, Tripist Holidays will offer:</p>
          <ul className="terms-list">
            <li>An alternative travel arrangement,</li>
            <li>Travel credit (where applicable), or</li>
            <li>A refund subject to amounts recoverable from the respective suppliers.</li>
          </ul>
        </section>

        {/* 7. Changes to Bookings */}
        <section className="terms-section">
          <h2 className="terms-heading">7. Changes to Bookings</h2>
          <p>Requests for changes, including:</p>
          <ul className="terms-list">
            <li>Travel dates</li>
            <li>Traveller names</li>
            <li>Destination</li>
            <li>Hotel</li>
            <li>Flight</li>
            <li>Room category</li>
            <li>Tour inclusions</li>
          </ul>
          <p>are subject to availability and the policies of the relevant suppliers.</p>
          <p>Additional charges may apply for amendments.</p>
        </section>

        {/* 8. Flight Bookings */}
        <section className="terms-section">
          <h2 className="terms-heading">8. Flight Bookings</h2>
          <p>Airline tickets are governed by the fare rules and cancellation policies of the respective airline.</p>
          <p>Depending on the fare type:</p>
          <ul className="terms-list">
            <li>Some tickets may be fully refundable.</li>
            <li>Some tickets may be partially refundable.</li>
            <li>Some promotional fares may be completely non-refundable.</li>
          </ul>
          <p>Tripist Holidays cannot override airline cancellation policies.</p>
        </section>

        {/* 9. Hotel Reservations */}
        <section className="terms-section">
          <h2 className="terms-heading">9. Hotel Reservations</h2>
          <p>Hotel cancellations are subject to the individual cancellation policies of the booked property. Certain promotional, discounted, festival, peak-season, or advance purchase rates may be non-refundable.</p>
        </section>

        {/* 10. Visa Services */}
        <section className="terms-section">
          <h2 className="terms-heading">10. Visa Services</h2>
          <p>Visa processing charges, embassy fees, consulate fees, biometric charges, courier fees, and other government charges are generally non-refundable once the application process has commenced.</p>
          <p>Visa refusal does not automatically entitle the applicant to a refund unless expressly permitted by the respective authority.</p>
        </section>

        {/* 11. Group Tours */}
        <section className="terms-section">
          <h2 className="terms-heading">11. Group Tours</h2>
          <p>For group departures, cancellation charges may differ from individual bookings due to:</p>
          <ul className="terms-list">
            <li>Blocked airline seats</li>
            <li>Reserved hotel inventory</li>
            <li>Group transportation arrangements</li>
            <li>Destination management commitments</li>
          </ul>
          <p>Specific cancellation terms for group tours will be communicated at the time of booking.</p>
        </section>

        {/* 12. No-Show Policy */}
        <section className="terms-section">
          <h2 className="terms-heading">12. No-Show Policy</h2>
          <p>Failure to:</p>
          <ul className="terms-list">
            <li>Check in for flights</li>
            <li>Arrive at hotels</li>
            <li>Join scheduled tours</li>
            <li>Report for transfers</li>
            <li>Participate in booked activities</li>
          </ul>
          <p>without prior notice shall be treated as a No Show.</p>
          <p>No refunds may be available for unused or missed services unless permitted by the respective supplier.</p>
        </section>

        {/* 13. Refund Process */}
        <section className="terms-section">
          <h2 className="terms-heading">13. Refund Process</h2>
          <p>Where a refund is approved, it will be processed after:</p>
          <ul className="terms-list">
            <li>Confirmation from the relevant suppliers,</li>
            <li>Completion of internal verification, and</li>
            <li>Deduction of any applicable cancellation charges, service charges, taxes, or supplier-imposed fees.</li>
          </ul>
        </section>

        {/* 14. Refund Timeline */}
        <section className="terms-section">
          <h2 className="terms-heading">14. Refund Timeline</h2>
          <p>Approved refunds are generally processed within 7 to 14 business days after Tripist Holidays receives the refunded amount from the respective airline, hotel, DMC, cruise operator, or other travel service provider, where applicable.</p>
          <p>Processing times may vary depending on banking systems, payment methods, and supplier timelines.</p>
        </section>

        {/* 15. Mode of Refund */}
        <section className="terms-section">
          <h2 className="terms-heading">15. Mode of Refund</h2>
          <p>Refunds will generally be made through the original mode of payment wherever reasonably possible.</p>
          <p>Where this is not feasible, Tripist Holidays may process the refund through an alternative mutually agreed payment method, subject to applicable laws and verification requirements.</p>
        </section>

        {/* 16. Force Majeure */}
        <section className="terms-section">
          <h2 className="terms-heading">16. Force Majeure</h2>
          <p>Tripist Holidays shall not be held responsible for cancellations or disruptions caused by events beyond our reasonable control, including but not limited to:</p>
          <ul className="terms-list">
            <li>Natural disasters</li>
            <li>Floods</li>
            <li>Earthquakes</li>
            <li>Cyclones</li>
            <li>Epidemics</li>
            <li>Pandemics</li>
            <li>War</li>
            <li>Civil unrest</li>
            <li>Terrorism</li>
            <li>Government restrictions</li>
            <li>Airline strikes</li>
            <li>Airport closures</li>
            <li>Weather conditions</li>
            <li>Transportation disruptions</li>
          </ul>
          <p>In such cases, refunds, rescheduling, or travel credits will be subject to the policies of the respective travel service providers.</p>
        </section>

        {/* 17. Unused Services */}
        <section className="terms-section">
          <h2 className="terms-heading">17. Unused Services</h2>
          <p>No refund shall be payable for services that remain wholly or partially unused after the commencement of the trip, unless otherwise agreed in writing or permitted under the applicable supplier's terms.</p>
          <p>Examples include:</p>
          <ul className="terms-list">
            <li>Missed sightseeing</li>
            <li>Missed meals</li>
            <li>Unused hotel nights</li>
            <li>Missed transfers</li>
            <li>Unused attraction tickets</li>
          </ul>
        </section>

        {/* 18. Disputes */}
        <section className="terms-section">
          <h2 className="terms-heading">18. Disputes</h2>
          <p>If you believe your refund has been incorrectly processed, you may contact us with supporting documentation.</p>
          <p>Tripist Holidays will review the matter in coordination with the relevant suppliers and respond within a reasonable time.</p>
        </section>

        {/* 19. Changes to this Policy */}
        <section className="terms-section">
          <h2 className="terms-heading">19. Changes to this Policy</h2>
          <p>Tripist Holidays reserves the right to modify this Cancellation &amp; Refund Policy at any time to reflect changes in business practices, supplier requirements, or applicable laws.</p>
          <p>The revised version will be published on our website with the updated "Last Updated" date.</p>
        </section>

        {/* 20. Contact Us */}
        <section className="terms-section">
          <h2 className="terms-heading">20. Contact Us</h2>
          <p>For any questions regarding cancellations or refunds, please contact:</p>
          <div className="terms-address">
            <strong>Tripist Holidays Private Limited</strong><br />
            {contactInfo.address}
          </div>
          <p>
            <strong>Website:</strong> <a href={`https://${contactInfo.website}`} target="_blank" rel="noopener noreferrer">{contactInfo.website}</a><br />
            <strong>Email:</strong> <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a><br />
            <strong>Phone:</strong> {contactInfo.phone}
          </p>
        </section>

        {/* Footer */}
        <footer className="terms-footer">
          <p>&copy; {new Date().getFullYear()} Tripist Holidays Private Limited. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default CancellationRefundPolicy;