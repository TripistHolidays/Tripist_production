import React, { useState, useEffect } from 'react';
import './TermsConditions.css';
import api from '../Admin/api';

const TermsConditions = () => {
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
          <p className="terms-subtitle">Terms &amp; Conditions</p>
          <div className="terms-meta">
            <span>Effective Date: 01 April 2026</span>
            <span>Last Updated: 01 April 2026</span>
          </div>
        </header>

        {/* Intro */}
        <section className="terms-section">
          <p>
            Welcome to Tripist Holidays ("Tripist Holidays", "we", "our", or "us"), a travel brand owned and operated by Tripist Holidays Private Limited.
            These Terms &amp; Conditions ("Terms") govern your access to and use of {contactInfo.website}, our travel services, and all interactions with Tripist Holidays.
            By accessing our website, requesting quotations, making bookings, or using our services, you agree to be bound by these Terms &amp; Conditions.
          </p>
          <p>
            If you do not agree with these Terms, please refrain from using our website and services.
          </p>
        </section>

        {/* 1. About Tripist Holidays */}
        <section className="terms-section">
          <h2 className="terms-heading">1. About Tripist Holidays</h2>
          <p>
            Tripist Holidays is engaged in providing travel‑related services, including but not limited to:
          </p>
          <ul className="terms-list">
            <li>Domestic Holiday Packages</li>
            <li>International Holiday Packages</li>
            <li>Group Tours</li>
            <li>Customized Travel Planning</li>
            <li>Hotel Reservations</li>
            <li>Flight Bookings</li>
            <li>Visa Assistance</li>
            <li>Airport Transfers</li>
            <li>Transportation Services</li>
            <li>Cruise Holidays</li>
            <li>Travel Insurance Assistance</li>
            <li>Corporate Travel (MICE)</li>
            <li>Pilgrimage Tours</li>
            <li>Other travel‑related services</li>
          </ul>
        </section>

        {/* 2. Acceptance of Terms */}
        <section className="terms-section">
          <h2 className="terms-heading">2. Acceptance of Terms</h2>
          <p>By using our website or engaging our services, you confirm that you:</p>
          <ul className="terms-list">
            <li>Are at least 18 years of age or are using the website under the supervision of a parent or legal guardian.</li>
            <li>Have the legal capacity to enter into binding agreements.</li>
            <li>Will provide accurate and complete information.</li>
            <li>Agree to comply with these Terms and all applicable laws.</li>
          </ul>
        </section>

        {/* 3. Website Usage */}
        <section className="terms-section">
          <h2 className="terms-heading">3. Website Usage</h2>
          <p>You agree to use our website only for lawful purposes.</p>
          <p>You shall not:</p>
          <ul className="terms-list">
            <li>Use the website for fraudulent purposes.</li>
            <li>Attempt unauthorized access to our systems.</li>
            <li>Copy or reproduce website content without written permission.</li>
            <li>Introduce malicious software or harmful code.</li>
            <li>Interfere with website functionality.</li>
            <li>Misrepresent your identity or provide false information.</li>
          </ul>
          <p>Tripist Holidays reserves the right to restrict or terminate access for misuse of the website.</p>
        </section>

        {/* 4. Enquiries and Quotations */}
        <section className="terms-section">
          <h2 className="terms-heading">4. Enquiries and Quotations</h2>
          <p>All enquiries submitted through our website are treated as requests for information only.</p>
          <p>Any quotation provided:</p>
          <ul className="terms-list">
            <li>Is subject to availability.</li>
            <li>May change without prior notice.</li>
            <li>Does not constitute a confirmed booking.</li>
            <li>Is valid only for the period specified in the quotation.</li>
          </ul>
          <p>No booking is considered confirmed until Tripist Holidays issues a written booking confirmation.</p>
        </section>

        {/* 5. Bookings */}
        <section className="terms-section">
          <h2 className="terms-heading">5. Bookings</h2>
          <p>Bookings may be made through:</p>
          <ul className="terms-list">
            <li>Website enquiry forms</li>
            <li>Email</li>
            <li>Telephone</li>
            <li>WhatsApp</li>
            <li>Authorized representatives</li>
            <li>Partner travel agents</li>
          </ul>
          <p>A booking becomes confirmed only after:</p>
          <ul className="terms-list">
            <li>Required traveller information is received.</li>
            <li>Applicable payments are completed.</li>
            <li>Confirmation is received from the relevant suppliers.</li>
            <li>Tripist Holidays issues a booking confirmation.</li>
          </ul>
        </section>

        {/* 6. Pricing */}
        <section className="terms-section">
          <h2 className="terms-heading">6. Pricing</h2>
          <p>All prices are subject to:</p>
          <ul className="terms-list">
            <li>Availability</li>
            <li>Supplier confirmation</li>
            <li>Currency fluctuations</li>
            <li>Seasonal demand</li>
            <li>Government taxes</li>
            <li>Airline fare revisions</li>
            <li>Hotel rate revisions</li>
            <li>Fuel surcharges</li>
            <li>Regulatory changes</li>
          </ul>
          <p>Tripist Holidays reserves the right to revise prices before booking confirmation.</p>
        </section>

        {/* 7. Payments */}
        <section className="terms-section">
          <h2 className="terms-heading">7. Payments</h2>
          <p>We currently accept payments through:</p>
          <ul className="terms-list">
            <li>Bank Transfer (NEFT/RTGS)</li>
            <li>UPI</li>
            <li>Cash</li>
            <li>Cheque</li>
            <li>Secure Payment Links</li>
          </ul>
          <p>
            Bookings may require advance payment or full payment depending on the supplier's terms.
            Failure to make payments within the specified time may result in automatic cancellation of the booking.
          </p>
        </section>

        {/* 8. Customer Responsibilities */}
        <section className="terms-section">
          <h2 className="terms-heading">8. Customer Responsibilities</h2>
          <p>Customers are responsible for:</p>
          <ul className="terms-list">
            <li>Providing accurate personal information.</li>
            <li>Ensuring passport validity.</li>
            <li>Obtaining required visas.</li>
            <li>Carrying valid travel documents.</li>
            <li>Arriving on time for flights, transfers, and tours.</li>
            <li>Complying with airline, hotel, and destination regulations.</li>
            <li>Following local laws and customs.</li>
          </ul>
          <p>Tripist Holidays shall not be responsible for losses arising from incorrect information provided by the customer.</p>
        </section>

        {/* 9. Passports and Visas */}
        <section className="terms-section">
          <h2 className="terms-heading">9. Passports and Visas</h2>
          <p>Travellers are solely responsible for ensuring they possess:</p>
          <ul className="terms-list">
            <li>Valid passports</li>
            <li>Required visas</li>
            <li>Transit visas</li>
            <li>Immigration clearances</li>
            <li>Vaccination certificates (where applicable)</li>
            <li>Any other mandatory travel documentation</li>
          </ul>
          <p>
            Visa assistance provided by Tripist Holidays does not guarantee visa approval, which remains solely at the discretion of the issuing authority.
          </p>
        </section>

        {/* 10. Flights, Hotels and Third‑Party Services */}
        <section className="terms-section">
          <h2 className="terms-heading">10. Flights, Hotels and Third‑Party Services</h2>
          <p>
            Tripist Holidays works with airlines, hotels, transport operators, cruise lines, destination management companies (DMCs), and other travel service providers.
            These services are governed by the terms and conditions of the respective providers.
          </p>
          <p>Tripist Holidays shall not be liable for:</p>
          <ul className="terms-list">
            <li>Flight delays</li>
            <li>Flight cancellations</li>
            <li>Hotel overbookings</li>
            <li>Supplier insolvency</li>
            <li>Service interruptions</li>
            <li>Changes made by third‑party providers</li>
            <li>Operational issues beyond our reasonable control</li>
          </ul>
        </section>

        {/* 11. Itinerary Changes */}
        <section className="terms-section">
          <h2 className="terms-heading">11. Itinerary Changes</h2>
          <p>Travel itineraries may change due to:</p>
          <ul className="terms-list">
            <li>Weather conditions</li>
            <li>Natural disasters</li>
            <li>Government restrictions</li>
            <li>Airline schedule changes</li>
            <li>Operational requirements</li>
            <li>Force majeure events</li>
          </ul>
          <p>Where reasonably possible, Tripist Holidays will make suitable alternative arrangements.</p>
        </section>

        {/* 12. Special Requests */}
        <section className="terms-section">
          <h2 className="terms-heading">12. Special Requests</h2>
          <p>Special requests such as:</p>
          <ul className="terms-list">
            <li>Early check‑in</li>
            <li>Late check‑out</li>
            <li>Connecting rooms</li>
            <li>Dietary requirements</li>
            <li>Wheelchair assistance</li>
            <li>Accessibility arrangements</li>
            <li>Celebration requests</li>
          </ul>
          <p>
            will be communicated to the relevant supplier but cannot be guaranteed unless confirmed in writing.
          </p>
        </section>

        {/* 13. Travel Insurance */}
        <section className="terms-section">
          <h2 className="terms-heading">13. Travel Insurance</h2>
          <p>We strongly recommend that all travellers obtain comprehensive travel insurance covering:</p>
          <ul className="terms-list">
            <li>Medical emergencies</li>
            <li>Trip cancellations</li>
            <li>Trip interruptions</li>
            <li>Lost baggage</li>
            <li>Personal accidents</li>
            <li>Travel delays</li>
            <li>Emergency evacuation</li>
          </ul>
          <p>Unless specifically stated, travel insurance is not included in package prices.</p>
        </section>

        {/* 14. Intellectual Property */}
        <section className="terms-section">
          <h2 className="terms-heading">14. Intellectual Property</h2>
          <p>All content available on this website, including but not limited to:</p>
          <ul className="terms-list">
            <li>Logos</li>
            <li>Brand names</li>
            <li>Graphics</li>
            <li>Images</li>
            <li>Videos</li>
            <li>Itineraries</li>
            <li>Tour descriptions</li>
            <li>Documents</li>
            <li>Website design</li>
            <li>Text</li>
            <li>Software</li>
          </ul>
          <p>is the property of Tripist Holidays or its licensors and is protected under applicable intellectual property laws.</p>
          <p>No content may be copied, reproduced, distributed, or modified without prior written consent.</p>
        </section>

        {/* 15. Limitation of Liability */}
        <section className="terms-section">
          <h2 className="terms-heading">15. Limitation of Liability</h2>
          <p>
            Tripist Holidays acts as an intermediary between customers and various travel service providers.
            To the fullest extent permitted by law, Tripist Holidays shall not be liable for:
          </p>
          <ul className="terms-list">
            <li>Delays</li>
            <li>Schedule changes</li>
            <li>Flight disruptions</li>
            <li>Missed connections</li>
            <li>Hotel issues</li>
            <li>Supplier defaults</li>
            <li>Weather‑related disruptions</li>
            <li>Political unrest</li>
            <li>Natural disasters</li>
            <li>Epidemics or pandemics</li>
            <li>Acts of terrorism</li>
            <li>Government restrictions</li>
            <li>Loss of personal belongings</li>
            <li>Personal injury except where directly caused by our negligence</li>
          </ul>
          <p>
            Our total liability, where legally established, shall not exceed the amount paid directly to Tripist Holidays for the affected service.
          </p>
        </section>

        {/* 16. Force Majeure */}
        <section className="terms-section">
          <h2 className="terms-heading">16. Force Majeure</h2>
          <p>
            Tripist Holidays shall not be responsible for failure or delay in performing its obligations where such failure results from events beyond its reasonable control, including but not limited to:
          </p>
          <ul className="terms-list">
            <li>Natural disasters</li>
            <li>Floods</li>
            <li>Earthquakes</li>
            <li>Cyclones</li>
            <li>Fires</li>
            <li>War</li>
            <li>Civil unrest</li>
            <li>Government actions</li>
            <li>Airline strikes</li>
            <li>Pandemics</li>
            <li>Epidemics</li>
            <li>Transportation disruptions</li>
            <li>Power failures</li>
            <li>Internet outages</li>
          </ul>
          <p>
            In such situations, refunds or rescheduling shall be subject to the policies of the respective suppliers.
          </p>
        </section>

        {/* 17. Privacy */}
        <section className="terms-section">
          <h2 className="terms-heading">17. Privacy</h2>
          <p>
            Your use of our website is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information.
          </p>
        </section>

        {/* 18. External Links */}
        <section className="terms-section">
          <h2 className="terms-heading">18. External Links</h2>
          <p>
            Our website may contain links to third‑party websites for your convenience.
            Tripist Holidays does not control or endorse the content, privacy practices, or availability of such websites and accepts no responsibility for them.
          </p>
        </section>

        {/* 19. Amendments */}
        <section className="terms-section">
          <h2 className="terms-heading">19. Amendments</h2>
          <p>
            Tripist Holidays reserves the right to amend these Terms &amp; Conditions at any time without prior notice.
            The updated version will be published on our website with the revised "Last Updated" date.
            Continued use of our website or services after any changes constitutes acceptance of the revised Terms.
          </p>
        </section>

        {/* 20. Governing Law and Jurisdiction */}
        <section className="terms-section">
          <h2 className="terms-heading">20. Governing Law and Jurisdiction</h2>
          <p>
            These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of India.
            Any disputes arising out of or relating to these Terms, the website, or the services provided by Tripist Holidays shall be subject to the exclusive jurisdiction of the competent courts in Chennai, Tamil Nadu, India.
          </p>
        </section>

        {/* 21. Contact Us */}
        <section className="terms-section">
          <h2 className="terms-heading">21. Contact Us</h2>
          <p>For any questions regarding these Terms &amp; Conditions, please contact:</p>
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

export default TermsConditions;