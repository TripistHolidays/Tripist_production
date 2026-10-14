import React, { useEffect, Suspense, lazy } from "react";
import "./App.css";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Header from "./Components/Header";
import Footer from "./Components/footer";
import ScrollToTop from "./Components/ScrollToTop";

// Eagerly load primary user-facing pages for 0ms instant navigation
import Home from "./pages/Home";
import About from "./pages/About";
import Destinations from "./pages/Destination";
import BecamePartner from "./pages/BecamePartner";
import Domestic from "./pages/Domestic";
import International from "./pages/International";
import Contact from "./pages/Contact";
import DestinationSpecialists from "./Components/DestinationSpecialists";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CancellationRefundPolicy from "./pages/CancellationRefundPolicy";
import CreatorProgram from "./pages/CreatorProgram";
import ExplorePackages from "./pages/ExplorePackages";
import AboutTripist from "./pages/AboutTripist";
import DestinationDetails from "./Components/DestinationDetails";

// Lazy-load heavy AdminPanel only when /admin is visited
const AdminPanel = lazy(() => import("./Admin/AdminPanel"));

function App() {
  const location = useLocation();

  const hideLayout = location.pathname.toLowerCase().startsWith("/admin");

  useEffect(() => {
    const handleDragStart = (e) => {
      if (e.target.tagName && e.target.tagName.toLowerCase() === "img") {
        e.preventDefault();
      }
    };

    document.addEventListener("dragstart", handleDragStart);

    return () => {
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  return (
    <>
      <ScrollToTop />
      {!hideLayout && <Header />}

      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/visionandmission" element={<AboutTripist />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/partner" element={<BecamePartner />} />
          <Route path="/creator" element={<CreatorProgram />} />
          <Route path="/domestic" element={<Domestic />} />
          <Route path="/international" element={<International />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/destination-specialists" element={<DestinationSpecialists />} />
          <Route path="/termsandconditions" element={<TermsConditions />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/cancellationandrefundpolicy" element={<CancellationRefundPolicy />} />

          <Route path="/package/:packageSlug" element={<ExplorePackages />} />
          <Route path="/ExplorePackages" element={<ExplorePackages />} />
          <Route path="/explorepackages" element={<ExplorePackages />} />

          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/Admin" element={<AdminPanel />} />
          <Route path="/destination/:destinationSlug" element={<DestinationDetails />} />
          <Route path="/destination-details" element={<DestinationDetails />} />

          <Route path="/about-us" element={<Navigate to="/about" replace />} />
          <Route path="/AboutTripist" element={<Navigate to="/visionandmission" replace />} />
          <Route path="/becamepartner" element={<Navigate to="/partner" replace />} />
          <Route path="/CreatorPorgram" element={<Navigate to="/creator" replace />} />
          <Route path="/contact-us" element={<Navigate to="/contact" replace />} />
          <Route path="/terms" element={<Navigate to="/termsandconditions" replace />} />
          <Route path="/CancellationRefundPolicy" element={<Navigate to="/cancellationandrefundpolicy" replace />} />

          <Route path="/:stateName" element={<Destinations />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;