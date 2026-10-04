import React, { useState, useEffect } from 'react';
import './TermsConditions.css';
import api from '../Admin/api';// Adjust path to your api helper file

const PrivacyPolicy = () => {
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
          <p className="terms-subtitle">Privacy Policy</p>
          <div className="terms-meta">
            <span>Effective Date: 01 April 2026</span>
            <span>Last Updated: 01 April 2026</span>
          </div>
        </header>

        {/* 1. About Us */}
        <section className="terms-section">
          <h2 className="terms-heading">1. About Us</h2>
          <p>
            Tripist Holidays is a travel brand owned and operated by Tripist Holidays Private Limited, providing domestic and international holiday packages, customized travel planning, hotel reservations, flight bookings, visa assistance, transportation services, corporate travel solutions, group tours, pilgrimage tours, cruises, travel experiences, and other travel-related services.
          </p>
          <div className="terms-address">
            <strong>Registered Office</strong><br />
            Tripist Holidays Private Limited<br />
            {contactInfo.address}
          </div>
          <p>
            <strong>Website:</strong> <a href={`https://${contactInfo.website}`} target="_blank" rel="noopener noreferrer">{contactInfo.website}</a><br />
            <strong>Email:</strong> <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a><br />
            <strong>Phone:</strong> {contactInfo.phone}
          </p>
        </section>

        {/* 2. Information We Collect */}
        <section className="terms-section">
          <h2 className="terms-heading">2. Information We Collect</h2>
          <p>Depending on how you interact with us, we may collect the following categories of information.</p>
          
          <p><strong>Personal Information</strong><br />This may include:</p>
          <ul className="terms-list">
            <li>Full Name</li>
            <li>Mobile Number</li>
            <li>Email Address</li>
            <li>Residential Address</li>
            <li>City, State, and Country</li>
            <li>Date of Birth (where required)</li>
            <li>Nationality</li>
            <li>Passport details (only when necessary)</li>
            <li>Visa-related information</li>
            <li>Emergency contact information</li>
          </ul>

          <p><strong>Travel Information</strong><br />To assist in planning and managing your travel, we may collect:</p>
          <ul className="terms-list">
            <li>Destination preferences</li>
            <li>Travel dates</li>
            <li>Number of travellers</li>
            <li>Budget preferences</li>
            <li>Hotel preferences</li>
            <li>Flight preferences</li>
            <li>Special requests</li>
            <li>Dietary requirements</li>
            <li>Accessibility requirements</li>
          </ul>

          <p><strong>Payment Information</strong><br />Although Tripist Holidays currently does not process online payments directly through its website, payments may be accepted through:</p>
          <ul className="terms-list">
            <li>Bank Transfer (NEFT/RTGS)</li>
            <li>UPI</li>
            <li>Cash</li>
            <li>Cheque</li>
            <li>Secure Payment Links</li>
          </ul>
          <p>We do not intentionally store complete debit card, credit card, or banking credentials on our website.</p>

          <p><strong>Website Usage Information</strong><br />When you visit our website, certain technical information may be collected automatically, including:</p>
          <ul className="terms-list">
            <li>IP Address</li>
            <li>Browser type</li>
            <li>Device information</li>
            <li>Operating system</li>
            <li>Pages visited</li>
            <li>Time spent on pages</li>
            <li>Referral source</li>
            <li>Date and time of visit</li>
          </ul>
          <p>This information helps us improve website performance and user experience.</p>
        </section>

        {/* 3. How We Collect Information */}
        <section className="terms-section">
          <h2 className="terms-heading">3. How We Collect Information</h2>
          <p>We may collect information when you:</p>
          <ul className="terms-list">
            <li>Submit an enquiry</li>
            <li>Request a quotation</li>
            <li>Contact us via email</li>
            <li>Contact us through WhatsApp</li>
            <li>Call our customer support</li>
            <li>Subscribe to newsletters</li>
            <li>Fill out online forms</li>
            <li>Register as a travel partner</li>
            <li>Participate in promotions or surveys</li>
            <li>Interact with our social media pages</li>
          </ul>
        </section>

        {/* 4. How We Use Your Information */}
        <section className="terms-section">
          <h2 className="terms-heading">4. How We Use Your Information</h2>
          <p>Your information may be used for purposes including:</p>
          <ul className="terms-list">
            <li>Responding to enquiries</li>
            <li>Preparing travel quotations</li>
            <li>Confirming bookings</li>
            <li>Coordinating with airlines, hotels, transport providers, and destination management companies (DMCs)</li>
            <li>Providing customer support</li>
            <li>Processing payments and refunds</li>
            <li>Sending booking confirmations</li>
            <li>Providing travel updates</li>
            <li>Improving our services</li>
            <li>Conducting internal business analysis</li>
            <li>Preventing fraud</li>
            <li>Complying with legal obligations</li>
            <li>Marketing our travel products and services (where permitted)</li>
          </ul>
        </section>

        {/* 5. Sharing of Information */}
        <section className="terms-section">
          <h2 className="terms-heading">5. Sharing of Information</h2>
          <p>We respect your privacy and do not sell or rent your personal information.</p>
          <p>Your information may be shared only when necessary with:</p>
          <ul className="terms-list">
            <li>Airlines</li>
            <li>Hotels and Resorts</li>
            <li>Cruise Operators</li>
            <li>Visa Processing Agencies</li>
            <li>Insurance Providers</li>
            <li>Transportation Partners</li>
            <li>Destination Management Companies (DMCs)</li>
            <li>Government Authorities where legally required</li>
            <li>Payment service providers</li>
            <li>Technology service providers supporting our operations</li>
          </ul>
          <p>All such disclosures are limited to the extent reasonably necessary for providing the requested services.</p>
        </section>

        {/* 6. Cookies and Similar Technologies */}
        <section className="terms-section">
          <h2 className="terms-heading">6. Cookies and Similar Technologies</h2>
          <p>Our website may use cookies and similar technologies to:</p>
          <ul className="terms-list">
            <li>Remember user preferences</li>
            <li>Improve website functionality</li>
            <li>Analyse website traffic</li>
            <li>Enhance user experience</li>
            <li>Measure marketing effectiveness</li>
          </ul>
          <p>You may disable cookies through your browser settings; however, certain features of the website may not function properly.</p>
        </section>

        {/* 7. Third-Party Services */}
        <section className="terms-section">
          <h2 className="terms-heading">7. Third-Party Services</h2>
          <p>Our website may integrate or link to third-party platforms and services, including but not limited to:</p>
          <ul className="terms-list">
            <li>Google Maps</li>
            <li>Google Analytics</li>
            <li>WhatsApp</li>
            <li>Facebook</li>
            <li>Instagram</li>
            <li>YouTube</li>
            <li>LinkedIn</li>
          </ul>
          <p>These third-party services operate under their own privacy policies, and Tripist Holidays is not responsible for their privacy practices.</p>
        </section>

        {/* 8. Data Security */}
        <section className="terms-section">
          <h2 className="terms-heading">8. Data Security</h2>
          <p>We implement appropriate technical and organizational measures designed to protect your information against unauthorized access, misuse, alteration, disclosure, or destruction.</p>
          <p>While we strive to safeguard your information, no method of electronic transmission or storage is completely secure. Therefore, we cannot guarantee absolute security.</p>
        </section>

        {/* 9. Data Retention */}
        <section className="terms-section">
          <h2 className="terms-heading">9. Data Retention</h2>
          <p>We retain your personal information only for as long as reasonably necessary to:</p>
          <ul className="terms-list">
            <li>Provide requested services</li>
            <li>Maintain business records</li>
            <li>Resolve disputes</li>
            <li>Meet legal, tax, accounting, and regulatory requirements</li>
            <li>Improve customer experience</li>
          </ul>
          <p>Information that is no longer required may be securely deleted or anonymized.</p>
        </section>

        {/* 10. Your Rights */}
        <section className="terms-section">
          <h2 className="terms-heading">10. Your Rights</h2>
          <p>Subject to applicable laws, you may request to:</p>
          <ul className="terms-list">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Update your details</li>
            <li>Withdraw consent where applicable</li>
            <li>Request deletion of your information, subject to legal or operational obligations</li>
          </ul>
          <p>Requests may be sent to:</p>
          <p><strong>Email:</strong> <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></p>
        </section>

        {/* 11. Children's Privacy */}
        <section className="terms-section">
          <h2 className="terms-heading">11. Children's Privacy</h2>
          <p>Our services are not specifically directed toward children under the age of 18 years.</p>
          <p>Where travel arrangements involve minors, the information must be provided by a parent, legal guardian, or an authorized adult traveller.</p>
        </section>

        {/* 12. Marketing Communications */}
        <section className="terms-section">
          <h2 className="terms-heading">12. Marketing Communications</h2>
          <p>With your consent or where permitted by applicable law, we may send you:</p>
          <ul className="terms-list">
            <li>Holiday offers</li>
            <li>Travel promotions</li>
            <li>Seasonal packages</li>
            <li>Company announcements</li>
            <li>Newsletters</li>
            <li>Travel inspiration</li>
          </ul>
          <p>You may opt out of promotional communications at any time by contacting us or using the unsubscribe option where available.</p>
        </section>

        {/* 13. International Transfers */}
        <section className="terms-section">
          <h2 className="terms-heading">13. International Transfers</h2>
          <p>In the course of arranging international travel, your information may be shared with overseas airlines, hotels, visa authorities, destination management companies, or other travel service providers located outside India.</p>
          <p>We take reasonable steps to ensure such disclosures are made only where necessary for delivering the requested travel services.</p>
        </section>

        {/* 14. Changes to this Privacy Policy */}
        <section className="terms-section">
          <h2 className="terms-heading">14. Changes to this Privacy Policy</h2>
          <p>Tripist Holidays reserves the right to update or modify this Privacy Policy at any time to reflect changes in legal requirements, business practices, technology, or our services.</p>
          <p>The revised version will be published on our website with the updated "Last Updated" date. Continued use of our website or services after such changes constitutes acceptance of the revised Privacy Policy.</p>
        </section>

        {/* 15. Contact Us */}
        <section className="terms-section">
          <h2 className="terms-heading">15. Contact Us</h2>
          <p>If you have any questions, concerns, or requests regarding this Privacy Policy or the handling of your personal information, please contact us:</p>
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

export default PrivacyPolicy;