import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./Components/Header";
import Footer from "./Components/footer";

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
import AdminPanel from "./Admin/AdminPanel";
import ScrollToTop from "./Components/ScrollToTop";
import AboutTripist from "./pages/AboutTripist";
import DestinationDetails from "./Components/DestinationDetails";

function App() {
  const location = useLocation();

  // Case-insensitive check to hide Header and Footer on any admin route
  const hideLayout = location.pathname.toLowerCase().startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      {!hideLayout && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/AboutTripist" element={<AboutTripist />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/becamepartner" element={<BecamePartner />} />
        <Route path="/domestic" element={<Domestic />} />
        <Route path="/international" element={<International />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/destination-specialists" element={<DestinationSpecialists />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/CancellationRefundPolicy" element={<CancellationRefundPolicy />} />
        <Route path="/CreatorPorgram" element={<CreatorProgram />} />
        <Route path="/ExplorePackages" element={<ExplorePackages />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/Admin" element={<AdminPanel />} />
        <Route path="/destination-details" element={<DestinationDetails />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;