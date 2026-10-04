import React, { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import "./DestinationPage.css";

const API_BASE = import.meta.env?.VITE_API_BASE_URL;

/* =========================================================
   MONTHS
========================================================= */

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/* =========================================================
   TEMPERATURE OPTIONS
========================================================= */

const TEMPERATURES = Array.from({ length: 110 }, (_, index) => index - 40);

/* =========================================================
   FALLBACK COUNTRIES
   Used only if backend country list fails.
========================================================= */

const FALLBACK_COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Bhutan",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Cambodia",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Croatia",
  "Cyprus",
  "Czechia",
  "Denmark",
  "Egypt",
  "Estonia",
  "Fiji",
  "Finland",
  "France",
  "Georgia",
  "Germany",
  "Greece",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kuwait",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lithuania",
  "Luxembourg",
  "Malaysia",
  "Maldives",
  "Malta",
  "Mauritius",
  "Mexico",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Myanmar",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Panama",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Saudi Arabia",
  "Serbia",
  "Seychelles",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sweden",
  "Switzerland",
  "Taiwan",
  "Tanzania",
  "Thailand",
  "Tunisia",
  "Turkey",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uzbekistan",
  "Vatican City",
  "Vietnam",
  "Zambia",
  "Zimbabwe",
];

/* =========================================================
   DEFAULT FORM
========================================================= */

const EMPTY_FORM = {
  id: null,
  name: "",
  destination_type: "international",
  capital: "",
  currency: "",
  climate: "",
  climate_min: "",
  climate_max: "",
  languages_spoken: [],
  time_zone: "",
  driving_side: "Left",
  calling_code: "",
  about_text: "",
  is_top_destination: false,
  travel_tips: ["", "", "", ""],
};

/* =========================================================
   DEFAULT ATTRACTIONS
========================================================= */

const DEFAULT_ATTRACTIONS = [
  { name: "", file: null, image: "" },
  { name: "", file: null, image: "" },
];

/* =========================================================
   CLIMATE FUNCTIONS
========================================================= */

function getClimateType(min, max) {
  const minTemp = Number(min);
  const maxTemp = Number(max);

  if (Number.isNaN(minTemp) || Number.isNaN(maxTemp)) {
    return "Climate not set";
  }

  const average = (minTemp + maxTemp) / 2;

  if (average <= 5) return "Cold & Alpine";
  if (average <= 15) return "Cool & Temperate";
  if (average <= 22) return "Mild & Pleasant";
  if (average <= 30) return "Warm & Tropical";
  if (average <= 38) return "Hot & Tropical";
  return "Hot Desert";
}

function buildClimate(min, max) {
  if (min === "" || max === "" || min === undefined || max === undefined) {
    return "";
  }

  const minTemp = Number(min);
  const maxTemp = Number(max);

  if (Number.isNaN(minTemp) || Number.isNaN(maxTemp) || minTemp >= maxTemp) {
    return "";
  }

  const climateType = getClimateType(minTemp, maxTemp);
  return `${minTemp}°C to ${maxTemp}°C (${climateType})`;
}

/* =========================================================
   PARSE EXISTING CLIMATE
========================================================= */

function parseClimateRange(climate) {
  if (!climate) return { min: "", max: "" };
  const value = String(climate);
  const match = value.match(/(-?\d+)\s*°C\s*to\s*(-?\d+)\s*°C/i);

  if (!match) return { min: "", max: "" };
  return { min: match[1], max: match[2] };
}

/* =========================================================
   DESTINATION HELPERS
========================================================= */

function getDestinationId(destination) {
  return destination?.id || destination?._id;
}

function getDestinationName(destination) {
  return destination?.name || destination?.destination_name || "Unknown Destination";
}

/* =========================================================
   IMAGE PREVIEW HELPERS (thumbnail + delete button)
========================================================= */

function ImageThumb({ src, onRemove, size = 96, badge }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid #dee2e6",
        background: "#f1f3f5",
        flex: "0 0 auto",
      }}
    >
      {failed ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            color: "#dc3545",
            textAlign: "center",
            padding: 4,
          }}
        >
          Image not found
        </div>
      ) : (
        <img
          src={src}
          alt="Preview"
          onError={() => setFailed(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}

      {badge && (
        <span
          className="badge bg-success rounded"
          style={{ position: "absolute", left: 4, bottom: 4, fontSize: 10 }}
        >
          {badge}
        </span>
      )}

      <button
        type="button"
        title="Remove image"
        onClick={onRemove}
        style={{
          position: "absolute",
          top: 4,
          right: 4,
          width: 22,
          height: 22,
          lineHeight: "18px",
          padding: 0,
          border: "none",
          borderRadius: "50%",
          background: "rgba(220,53,69,0.95)",
          color: "#fff",
          fontSize: 14,
          cursor: "pointer",
        }}
      >
        &times;
      </button>
    </div>
  );
}

function FileThumb({ file, onRemove, size, badge }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!url) return null;
  return <ImageThumb src={url} size={size} badge={badge} onRemove={onRemove} />;
}

function getDestinationImage(destination) {
  if (destination?.image) return destination.image;
  if (Array.isArray(destination?.hero_slider_images) && destination.hero_slider_images.length) {
    return destination.hero_slider_images[0];
  }
  return "https://placehold.co/500x300?text=Destination";
}

/* =========================================================
   ARRAY HELPER
========================================================= */

function parseArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }

  return [];
}

/* =========================================================
   SEASON HELPERS
========================================================= */

function getSeasonFromDestination(destination) {
  const value = destination?.best_season_to_visit || "";
  if (!value) return { start: "April", end: "October" };

  const parts = String(value)
    .replace(/\s+to\s+/i, "|")
    .replace(/\s*-\s*/g, "|")
    .split("|");

  if (parts.length >= 2) {
    const findMonth = (val) => {
      const clean = val.trim().toLowerCase();
      return (
        MONTHS.find((month) => month.toLowerCase() === clean) ||
        MONTHS.find((month) => month.toLowerCase().startsWith(clean)) ||
        "April"
      );
    };

    return {
      start: findMonth(parts[0]),
      end: findMonth(parts[1]),
    };
  }

  return { start: "April", end: "October" };
}

function buildSeason(start, end) {
  if (!start || !end) return "Year-Round";

  const startIndex = MONTHS.indexOf(start);
  const endIndex = MONTHS.indexOf(end);

  if (startIndex === -1 || endIndex === -1) return "Year-Round";
  if (startIndex === endIndex) return SHORT_MONTHS[startIndex];

  return `${SHORT_MONTHS[startIndex]} to ${SHORT_MONTHS[endIndex]}`;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function DestinationsPage({ notify }) {
  const [destinations, setDestinations] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [countriesList, setCountriesList] = useState([]);
  const [fetchingCountries, setFetchingCountries] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewDestination, setViewDestination] = useState(null);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [seasonStart, setSeasonStart] = useState("April");
  const [seasonEnd, setSeasonEnd] = useState("October");

  const [sliderFiles, setSliderFiles] = useState([]);
  const [existingSliderImages, setExistingSliderImages] = useState([]);
  const [attractions, setAttractions] = useState(DEFAULT_ATTRACTIONS);
  const [langInput, setLangInput] = useState("");

  const loadDestinations = async () => {
    setLoadingDestinations(true);
    try {
      const data = await api.listDestinations();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.destinations)
        ? data.destinations
        : Array.isArray(data?.data)
        ? data.data
        : [];
      setDestinations(list);
    } catch (error) {
      console.error(error);
      setDestinations([]);
      notify?.("danger", error.message || "Failed to load destinations from database");
    } finally {
      setLoadingDestinations(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, pageSize]);

  useEffect(() => {
    let cancelled = false;

    const loadCountries = async () => {
      setFetchingCountries(true);
      try {
        const response = await fetch(`${API_BASE}/destinations/countries`);
        if (!response.ok) throw new Error("Country list unavailable");

        const data = await response.json();
        const rawList = Array.isArray(data)
          ? data
          : Array.isArray(data?.countries)
          ? data.countries
          : Array.isArray(data?.data)
          ? data.data
          : [];

        const countries = rawList
          .map((country) => (typeof country === "string" ? country : country?.name || country?.common_name || country?.country || ""))
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));

        if (!cancelled) {
          setCountriesList(countries.length ? countries : FALLBACK_COUNTRIES);
        }
      } catch (error) {
        console.error("Country list error:", error);
        if (!cancelled) setCountriesList(FALLBACK_COUNTRIES);
      } finally {
        if (!cancelled) setFetchingCountries(false);
      }
    };

    loadCountries();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCountrySelect = async (event) => {
    const countryName = event.target.value;

    if (!countryName) {
      setFormData((prev) => ({
        ...prev,
        capital: "",
        currency: "",
        languages_spoken: [],
        time_zone: "",
        driving_side: "Left",
        calling_code: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      name: prev.name.trim() ? prev.name : countryName,
    }));

    setFetchingDetails(true);
    try {
      const response = await fetch(`${API_BASE}/destinations/countries/${encodeURIComponent(countryName)}`);
      const data = await response.json();

      if (!response.ok || (!data?.success && !data?.country && !data?.data)) {
        throw new Error(data?.message || "Country details unavailable");
      }

      const country = data.country || data.data || data;

      let parsedLanguages = [];
      const rawLangs = country.languages_spoken || country.languages;
      if (Array.isArray(rawLangs)) {
        parsedLanguages = rawLangs;
      } else if (typeof rawLangs === "string") {
        parsedLanguages = rawLangs.split(",").map((l) => l.trim()).filter(Boolean);
      } else if (typeof rawLangs === "object" && rawLangs !== null) {
        parsedLanguages = Object.values(rawLangs).map(String).filter(Boolean);
      }

      setFormData((prev) => ({
        ...prev,
        capital: country.capital || country.capital_city || "",
        currency: country.currency || country.curr || "",
        languages_spoken: parsedLanguages,
        time_zone: country.time_zone || country.timezone || "",
        driving_side: country.driving_side || "Right",
        calling_code: country.calling_code || country.phone_code || "",
      }));
    } catch (error) {
      console.error("Country details error:", error);
      notify?.("warning", `Could not fetch details for ${countryName}.`);
    } finally {
      setFetchingDetails(false);
    }
  };

  const handleOpenAdd = () => {
    setFormData({ ...EMPTY_FORM, travel_tips: ["", "", "", ""] });
    setSeasonStart("April");
    setSeasonEnd("October");
    setSliderFiles([]);
    setExistingSliderImages([]);
    setLangInput("");
    setAttractions([
      { name: "", file: null, image: "" },
      { name: "", file: null, image: "" },
    ]);
    setCurrentStep(1);
    setIsModalOpen(true);
  };

  const handleOpenView = async (destination) => {
    const id = getDestinationId(destination);
    if (!id) {
      notify?.("danger", "Destination ID not found");
      return;
    }

    try {
      let details = destination;
      try {
        const response = await api.getDestinationById(id);
        if (response?.destination) details = response.destination;
        else if (response?.data) details = response.data;
        else if (response) details = response;
      } catch (error) {
        console.warn("Using list data for viewing:", error);
      }

      setViewDestination(details);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error(error);
      notify?.("danger", error.message || "Could not load destination details");
    }
  };

  const handleOpenEdit = async (destination) => {
    const id = getDestinationId(destination);
    if (!id) {
      notify?.("danger", "Destination ID not found");
      return;
    }

    try {
      let details = destination;
      try {
        const response = await api.getDestinationById(id);
        if (response?.destination) details = response.destination;
        else if (response?.data) details = response.data;
        else if (response) details = response;
      } catch (error) {
        console.warn("Using list data for editing:", error);
      }

      const season = getSeasonFromDestination(details);
      const tips = parseArray(details?.travel_tips);
      
      let languages = [];
      const rawLangs = details?.languages_spoken || details?.languages;
      if (Array.isArray(rawLangs)) {
        languages = rawLangs;
      } else if (typeof rawLangs === "string") {
        languages = rawLangs.split(",").map((l) => l.trim()).filter(Boolean);
      } else if (typeof rawLangs === "object" && rawLangs !== null) {
        languages = Object.values(rawLangs).map(String).filter(Boolean);
      }

      while (tips.length < 4) tips.push("");

      const attrNames = parseArray(details?.attraction_names);
      const attrImages = parseArray(details?.attraction_images);

      let existingAttractions = attrNames.map((name, index) => ({
        name,
        file: null,
        image: attrImages[index] || "",
      }));

      if (existingAttractions.length === 0 && Array.isArray(details?.attractions)) {
        existingAttractions = details.attractions.map((item) => ({
          name: typeof item === "string" ? item : item?.attraction_name || "",
          file: null,
          image: item?.image || "",
        }));
      }

      if (existingAttractions.length === 0) {
        existingAttractions = [
          { name: "", file: null, image: "" },
          { name: "", file: null, image: "" },
        ];
      }

      const sliderImgs = parseArray(details?.hero_slider_images);
      const climateValue = details?.climate || "";
      const climateRange = parseClimateRange(climateValue);

      setFormData({
        id,
        name: getDestinationName(details),
        destination_type: details?.destination_type || "international",
        capital: details?.capital || "",
        currency: details?.currency || "",
        climate: climateValue,
        climate_min: climateRange.min,
        climate_max: climateRange.max,
        languages_spoken: languages,
        time_zone: details?.time_zone || "",
        driving_side: details?.driving_side || "Left",
        calling_code: details?.calling_code || "",
        about_text: details?.about_text || "",
        is_top_destination: Boolean(details?.is_top_destination),
        travel_tips: tips,
      });

      setSeasonStart(season.start);
      setSeasonEnd(season.end);
      setSliderFiles([]);
      setExistingSliderImages(sliderImgs);
      setLangInput("");
      setAttractions(existingAttractions);
      setCurrentStep(1);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      notify?.("danger", error.message || "Could not open destination");
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setCurrentStep(1);
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddLanguage = () => {
    const val = langInput.trim();
    if (!val) return;
    if (!formData.languages_spoken.includes(val)) {
      setFormData((prev) => ({
        ...prev,
        languages_spoken: [...prev.languages_spoken, val],
      }));
    }
    setLangInput("");
  };

  const handleRemoveLanguage = (langToRemove) => {
    setFormData((prev) => ({
      ...prev,
      languages_spoken: prev.languages_spoken.filter((lang) => lang !== langToRemove),
    }));
  };

  const handleClimateMinChange = (event) => {
    const min = event.target.value;
    const max = formData.climate_max;
    let climate = formData.climate;

    if (min !== "" && max !== "" && Number(min) < Number(max)) {
      climate = buildClimate(min, max);
    }

    setFormData((prev) => ({
      ...prev,
      climate_min: min,
      climate,
    }));
  };

  const handleClimateMaxChange = (event) => {
    const max = event.target.value;
    const min = formData.climate_min;
    let climate = formData.climate;

    if (min !== "" && max !== "" && Number(min) < Number(max)) {
      climate = buildClimate(min, max);
    }

    setFormData((prev) => ({
      ...prev,
      climate_max: max,
      climate,
    }));
  };

  const handleTipChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.travel_tips];
      updated[index] = value;
      return { ...prev, travel_tips: updated };
    });
  };

  const addTip = () => {
    setFormData((prev) => ({
      ...prev,
      travel_tips: [...prev.travel_tips, ""],
    }));
  };

  const removeTip = (index) => {
    setFormData((prev) => ({
      ...prev,
      travel_tips: prev.travel_tips.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleAttractionChange = (index, field, value) => {
    setAttractions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addAttraction = () => {
    setAttractions((prev) => [...prev, { name: "", file: null, image: "" }]);
  };

  const removeAttraction = (index) => {
    setAttractions((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        notify?.("warning", "Please enter a destination title/name.");
        return false;
      }
      if (!formData.capital.trim()) {
        notify?.("warning", "Please enter the capital city.");
        return false;
      }
      if (!formData.currency.trim()) {
        notify?.("warning", "Please enter the currency.");
        return false;
      }
    }

    if (currentStep === 2) {
      if (!formData.about_text.trim()) {
        notify?.("warning", "Please enter destination information.");
        return false;
      }
      if (formData.climate_min === "" || formData.climate_max === "") {
        notify?.("warning", "Please select minimum and maximum temperature.");
        return false;
      }
      if (Number(formData.climate_min) >= Number(formData.climate_max)) {
        notify?.("warning", "Maximum temperature must be greater than minimum temperature.");
        return false;
      }
    }

    return true;
  };

  const handleNext = (event) => {
    if (event) event.preventDefault();
    if (!validateStep()) return;
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = (event) => {
    if (event) event.preventDefault();
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    if (currentStep !== 3 || !validateStep()) return;

    setIsSubmitting(true);
    try {
      let uploadedSliderImages = [...existingSliderImages];

      if (sliderFiles && sliderFiles.length > 0) {
        for (const file of Array.from(sliderFiles)) {
          const uploadRes = await api.uploadImage(file);
          if (uploadRes?.imageUrl || uploadRes?.url) {
            uploadedSliderImages.push(uploadRes.imageUrl || uploadRes.url);
          }
        }
      }

      const validAttractions = attractions.filter((item) => item.name && item.name.trim());
      const attractionNames = [];
      const attractionImages = [];

      for (const attraction of validAttractions) {
        let imageUrl = attraction.image || null;
        if (attraction.file) {
          const uploadRes = await api.uploadImage(attraction.file);
          if (uploadRes?.imageUrl || uploadRes?.url) {
            imageUrl = uploadRes.imageUrl || uploadRes.url;
          }
        }
        attractionNames.push(attraction.name.trim());
        attractionImages.push(imageUrl || "");
      }

      const payload = {
        name: formData.name || "Unknown",
        destination_type: formData.destination_type || "international",
        capital: formData.capital || null,
        currency: formData.currency || null,
        climate: formData.climate || null,
        best_season_to_visit: buildSeason(seasonStart, seasonEnd),
        languages_spoken: formData.languages_spoken || [],
        time_zone: formData.time_zone || null,
        driving_side: formData.driving_side || "Left",
        calling_code: formData.calling_code || null,
        hero_slider_images: uploadedSliderImages,
        about_text: formData.about_text || null,
        travel_tips: formData.travel_tips.filter((tip) => tip && tip.trim() !== ""),
        attraction_names: attractionNames,
        attraction_images: attractionImages,
        is_top_destination: Boolean(formData.is_top_destination),
      };

      if (formData.id) {
        await api.updateDestinationJSON(formData.id, payload);
        notify?.("success", `"${formData.name}" updated successfully!`);
      } else {
        await api.createDestinationJSON(payload);
        notify?.("success", `"${formData.name}" added successfully!`);
      }

      await loadDestinations();
      setIsModalOpen(false);
      setCurrentStep(1);
    } catch (error) {
      console.error("Submit Error:", error);
      notify?.("danger", error.message || "Failed to save destination");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (destination) => {
    const id = getDestinationId(destination);
    const name = getDestinationName(destination);
    if (!id) {
      notify?.("danger", "Destination ID not found");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?\n\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await api.deleteDestination(id);
      setDestinations((prev) => prev.filter((item) => getDestinationId(item) !== id));
      notify?.("success", `"${name}" deleted successfully!`);
    } catch (error) {
      console.error(error);
      notify?.("danger", error.message || "Failed to delete destination");
    }
  };

  const filteredDestinations = useMemo(() => {
    return destinations.filter((destination) => {
      const query = search.trim().toLowerCase();
      const destType = destination?.destination_type || "international";

      if (typeFilter !== "all" && destType.toLowerCase() !== typeFilter.toLowerCase()) {
        return false;
      }

      if (!query) return true;

      const name = getDestinationName(destination).toLowerCase();
      const capital = String(destination?.capital || "").toLowerCase();
      const climate = String(destination?.climate || "").toLowerCase();
      const season = String(destination?.best_season_to_visit || "").toLowerCase();

      return name.includes(query) || capital.includes(query) || climate.includes(query) || season.includes(query);
    });
  }, [destinations, search, typeFilter]);

  const paginatedDestinations = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredDestinations.slice(startIndex, startIndex + pageSize);
  }, [filteredDestinations, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredDestinations.length / pageSize) || 1;

  return (
    <div className="destination-admin-page">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-trip-navy mb-1">Destinations</h2>
          <p className="text-muted mb-0">
            Manage custom destination titles, travel information, seasons and attractions.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-trip-gold px-4 py-2 fw-semibold shadow-sm rounded transition-all"
          onClick={handleOpenAdd}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Add Destination
        </button>
      </div>

      {/* DESTINATION TABLE */}
      <div className="card admin-card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white p-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h5 className="fw-bold text-trip-navy mb-1">Destination List</h5>
              <span className="text-muted small">
                {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="d-flex align-items-center gap-3 flex-wrap">
              {/* DESTINATION TYPE FILTER */}
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted small fw-semibold">Type:</span>
                <select
                  className="form-select form-select-sm rounded shadow-sm"
                  style={{ width: "130px" }}
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="domestic">Domestic</option>
                  <option value="international">International</option>
                </select>
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="text-muted small fw-semibold">Show:</span>
                <select
                  className="form-select form-select-sm rounded shadow-sm"
                  style={{ width: "80px" }}
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </select>
              </div>

              <div className="position-relative" style={{ minWidth: "240px" }}>
                <i
                  className="bi bi-search position-absolute"
                  style={{ left: "13px", top: "11px", color: "#7b8798" }}
                ></i>
                <input
                  type="text"
                  className="form-control ps-5 rounded shadow-sm"
                  placeholder="Search destinations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          {loadingDestinations ? (
            <div className="text-center py-5">
              <div className="spinner-border text-trip-navy mb-3" role="status"></div>
              <div className="text-muted">Loading destinations...</div>
            </div>
          ) : filteredDestinations.length === 0 ? (
            <div className="text-center py-5 px-3">
              <h5 className="fw-bold text-trip-navy">No destinations found</h5>
            </div>
          ) : (
            <div className="table-scroller-container">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th style={{ width: "85px" }}>Image</th>
                    <th>Destination Title</th>
                    <th>Category</th>
                    <th>Capital</th>
                    <th>Climate</th>
                    <th>Best Season</th>
                    <th>Currency</th>
                    <th className="text-end" style={{ width: "160px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDestinations.map((destination) => {
                    const id = getDestinationId(destination);
                    const image = getDestinationImage(destination);
                    const season = destination?.best_season_to_visit || "Year-Round";

                    return (
                      <tr key={id}>
                        <td>
                          <img
                            src={image}
                            alt={getDestinationName(destination)}
                            style={{
                              width: "68px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "10px",
                              border: "1px solid #e5eaf0",
                            }}
                          />
                        </td>
                        <td>
                          <div className="fw-bold text-trip-navy">
                            {getDestinationName(destination)}
                            {Boolean(destination?.is_top_destination) && (
                              <span className="badge bg-warning text-dark ms-2 rounded" style={{ fontSize: "10px" }}>
                                TOP
                              </span>
                            )}
                          </div>
                          <div className="small text-muted">
                            {destination?.calling_code || "No calling code"}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${destination?.destination_type === "domestic" ? "bg-info text-dark" : "bg-secondary"} text-capitalize px-2 py-1 rounded`}>
                            {destination?.destination_type || "international"}
                          </span>
                        </td>
                        <td className="small">{destination?.capital || "-"}</td>
                        <td>
                          <span className="badge badge-soft-info px-2 py-1 rounded">
                            {destination?.climate || "-"}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-soft-warning px-2 py-1 rounded">
                            <i className="bi bi-calendar3 me-1"></i>
                            {season}
                          </span>
                        </td>
                        <td className="small fw-semibold">{destination?.currency || "-"}</td>
                        <td>
                          <div className="d-flex justify-content-end gap-2">
                            <button
                              type="button"
                              className="btn btn-action-icon rounded shadow-sm"
                              title="View Details"
                              onClick={() => handleOpenView(destination)}
                            >
                              <i className="bi bi-eye text-primary"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-action-icon rounded shadow-sm"
                              title="Edit Destination"
                              onClick={() => handleOpenEdit(destination)}
                            >
                              <i className="bi bi-pencil text-trip-navy"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-action-icon rounded shadow-sm"
                              title="Delete Destination"
                              onClick={() => handleDelete(destination)}
                            >
                              <i className="bi bi-trash text-danger"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {filteredDestinations.length > 0 && (
          <div className="card-footer bg-white p-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <span className="text-muted small">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredDestinations.length)} of {filteredDestinations.length} destinations
            </span>
            <div className="d-flex gap-1">
              <button
                className="btn btn-sm btn-outline-secondary px-3 rounded"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`btn btn-sm px-3 rounded ${currentPage === page ? "btn-primary shadow-sm" : "btn-outline-secondary"}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="btn btn-sm btn-outline-secondary px-3 rounded"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VIEW MODAL */}
      {isViewModalOpen && viewDestination && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(5, 20, 40, 0.65)", backdropFilter: "blur(4px)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-light px-4 py-3">
                <h5 className="modal-title fw-bold">
                  Destination Details: {getDestinationName(viewDestination)}
                </h5>
                <button
                  type="button"
                  className="btn-close rounded-circle"
                  onClick={() => setIsViewModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="text-center mb-4">
                  <img
                    src={getDestinationImage(viewDestination)}
                    alt={getDestinationName(viewDestination)}
                    style={{ width: "100%", maxHeight: "250px", objectFit: "cover", borderRadius: "12px" }}
                  />
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <p><strong>Category:</strong> <span className="text-capitalize">{viewDestination.destination_type || "International"}</span></p>
                    <p><strong>Capital:</strong> {viewDestination.capital || "-"}</p>
                    <p><strong>Currency:</strong> {viewDestination.currency || "-"}</p>
                    <p><strong>Climate:</strong> {viewDestination.climate || "-"}</p>
                    <p><strong>Best Season:</strong> {viewDestination.best_season_to_visit || "-"}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Time Zone:</strong> {viewDestination.time_zone || "-"}</p>
                    <p><strong>Calling Code:</strong> {viewDestination.calling_code || "-"}</p>
                    <p><strong>Driving Side:</strong> {viewDestination.driving_side || "-"}</p>
                    <p>
                      <strong>Languages:</strong>{" "}
                      {parseArray(viewDestination.languages_spoken).join(", ") || "-"}
                    </p>
                  </div>
                  <div className="col-12">
                    <hr />
                    <h6 className="fw-bold">About</h6>
                    <p className="text-muted">{viewDestination.about_text || "No description provided."}</p>
                  </div>
                  <div className="col-12">
                    <h6 className="fw-bold">Travel Tips</h6>
                    <ul>
                      {parseArray(viewDestination.travel_tips).length > 0 ? (
                        parseArray(viewDestination.travel_tips).map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))
                      ) : (
                        <li>No tips available</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-light px-4 py-3">
                <button
                  type="button"
                  className="btn btn-secondary px-4 rounded shadow-sm"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(5, 20, 40, 0.65)", backdropFilter: "blur(4px)" }}
        >
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              {/* HEADER */}
              <div className="modal-header bg-light px-4 py-3">
                <div>
                  <h5 className="modal-title fw-bold mb-1">
                    {formData.id ? "Edit Destination" : "Add Destination"}
                  </h5>
                  <small className="text-light">
                    {formData.id ? "Update destination information" : "Create a new destination"}
                  </small>
                </div>
                <button
                  type="button"
                  className="btn-close rounded-circle"
                  onClick={handleClose}
                  disabled={isSubmitting}
                ></button>
              </div>

              {/* STEPS */}
              <div className="destination-step-header">
                <div className="destination-step-items">
                  <div className={`destination-step ${currentStep >= 1 ? "active" : ""}`}>
                    <span className="destination-step-number">1</span>
                    <div><strong>Basic</strong></div>
                  </div>
                  <div className={`destination-step ${currentStep >= 2 ? "active" : ""}`}>
                    <span className="destination-step-number">2</span>
                    <div><strong>Travel Info</strong></div>
                  </div>
                  <div className={`destination-step ${currentStep >= 3 ? "active" : ""}`}>
                    <span className="destination-step-number">3</span>
                    <div><strong>Media & Tips</strong></div>
                  </div>
                </div>
              </div>

              {/* FORM */}
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (currentStep === 3) {
                    handleSubmit(event);
                  } else {
                    handleNext(event);
                  }
                }}
              >
                <div className="modal-body p-4">
                  {/* STEP 1 */}
                  {currentStep === 1 && (
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Country Template (Optional helper)</label>
                        <select
                          className="form-select shadow-sm rounded"
                          onChange={handleCountrySelect}
                          disabled={fetchingCountries || fetchingDetails}
                        >
                          <option value="">
                            {fetchingCountries
                              ? "Loading countries..."
                              : fetchingDetails
                              ? "Loading country details..."
                              : "-- Select country to autofill details --"}
                          </option>
                          {countriesList.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                        <small className="text-muted d-block mt-1">
                          Selecting a country automatically fills capital, currency, languages, etc.
                        </small>
                        {fetchingDetails && (
                          <div className="d-flex align-items-center gap-2 mt-2 text-muted small">
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Fetching country information...
                          </div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Custom Destination Title</label>
                        <input
                          type="text"
                          className="form-control shadow-sm rounded px-3"
                          placeholder="e.g. Kerala Backwaters, Bali, Swiss Alps..."
                          value={formData.name || ""}
                          onChange={(e) => updateField("name", e.target.value)}
                          required
                        />
                        <small className="text-muted d-block mt-1">
                          This is saved directly into your destination name field.
                        </small>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Destination Category</label>
                        <select
                          className="form-select shadow-sm rounded"
                          value={formData.destination_type || "international"}
                          onChange={(e) => updateField("destination_type", e.target.value)}
                          required
                        >
                          <option value="domestic">Domestic</option>
                          <option value="international">International</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Capital City</label>
                        <input
                          type="text"
                          className="form-control shadow-sm rounded px-3"
                          value={formData.capital || ""}
                          onChange={(e) => updateField("capital", e.target.value)}
                          required
                        />
                      </div>

                      {/* Top Destination Toggle with Collapsible Active Info Panel */}
                      <div className="col-12">
                        <div className="form-check form-switch ps-5 bg-light p-3 rounded border shadow-sm px-4">
                          <input
                            className="form-check-input me-2 "
                            type="checkbox"
                            role="switch"
                            id="isTopDestinationToggle"
                            checked={formData.is_top_destination}
                            onChange={(e) => updateField("is_top_destination", e.target.checked)}
                          />
                          <label className="form-check-label fw-semibold" htmlFor="isTopDestinationToggle">
                            Mark as Top Destination
                          </label>
                          <small className="text-muted d-block">Featured on home page hero sections.</small>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Currency</label>
                        <input
                          type="text"
                          className="form-control shadow-sm rounded px-3"
                          value={formData.currency || ""}
                          onChange={(e) => updateField("currency", e.target.value)}
                          required
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Calling Code</label>
                        <input
                          type="text"
                          className="form-control shadow-sm rounded px-3"
                          value={formData.calling_code || ""}
                          onChange={(e) => updateField("calling_code", e.target.value)}
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Driving Side</label>
                        <select
                          className="form-select shadow-sm rounded"
                          value={formData.driving_side}
                          onChange={(e) => updateField("driving_side", e.target.value)}
                        >
                          <option value="Left">Left</option>
                          <option value="Right">Right</option>
                        </select>
                      </div>

                      {/* Languages Spoken (Tag Creator) */}
                      <div className="col-md-7">
                        <label className="form-label fw-semibold">Languages Spoken</label>
                        <div className="input-group shadow-sm rounded overflow-hidden border">
                          <input
                            type="text"
                            className="form-control border-0"
                            placeholder="Type language and click Add"
                            value={langInput}
                            onChange={(e) => setLangInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddLanguage();
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-primary px-4 fw-semibold border-0 rounded m-1"
                            onClick={handleAddLanguage}
                          >
                            Add
                          </button>
                        </div>
                        <div className="d-flex flex-wrap gap-2 mt-2">
                          {formData.languages_spoken.map((lang, idx) => (
                            <span
                              key={idx}
                              className="badge bg-light text-dark border px-3 py-2 d-inline-flex align-items-center gap-2 shadow-sm rounded"
                              style={{ fontSize: "13px" }}
                            >
                              {lang}
                              <button
                                type="button"
                                className="btn-close rounded-circle"
                                style={{ fontSize: "10px" }}
                                onClick={() => handleRemoveLanguage(lang)}
                                aria-label="Remove"
                              ></button>
                            </span>
                          ))}
                          {formData.languages_spoken.length === 0 && (
                            <span className="text-muted small italic">No languages added yet.</span>
                          )}
                        </div>
                      </div>

                      <div className="col-md-5">
                        <label className="form-label fw-semibold">Time Zone</label>
                        <input
                          type="text"
                          className="form-control shadow-sm rounded px-3"
                          value={formData.time_zone || ""}
                          onChange={(e) => updateField("time_zone", e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 2 */}
                  {currentStep === 2 && (
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label fw-semibold">Climate</label>
                        <div className="row g-3">
                          <div className="col-md-4">
                            <select
                              className="form-select shadow-sm rounded"
                              value={formData.climate_min || ""}
                              onChange={handleClimateMinChange}
                            >
                              <option value="">Minimum Temperature</option>
                              {TEMPERATURES.map((temperature) => (
                                <option
                                  key={`min-${temperature}`}
                                  value={temperature}
                                  disabled={
                                    formData.climate_max !== "" && temperature >= Number(formData.climate_max)
                                  }
                                >
                                  {temperature}°C
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="col-md-4">
                            <select
                              className="form-select shadow-sm rounded"
                              value={formData.climate_max || ""}
                              onChange={handleClimateMaxChange}
                            >
                              <option value="">Maximum Temperature</option>
                              {TEMPERATURES.map((temperature) => (
                                <option
                                  key={`max-${temperature}`}
                                  value={temperature}
                                  disabled={
                                    formData.climate_min !== "" && temperature <= Number(formData.climate_min)
                                  }
                                >
                                  {temperature}°C
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="col-md-4">
                            <input
                              type="text"
                              className="form-control fw-semibold shadow-sm rounded px-3"
                              placeholder="e.g. 20°C to 30°C (Warm)"
                              value={formData.climate || ""}
                              onChange={(e) => updateField("climate", e.target.value)}
                            />
                          </div>
                        </div>

                        <small className="text-muted d-block mt-2">
                          Select min/max temperatures to auto-generate, or type/edit your climate description manually.
                        </small>

                        {formData.climate_min !== "" &&
                          formData.climate_max !== "" &&
                          Number(formData.climate_min) >= Number(formData.climate_max) && (
                            <div className="text-danger small mt-2">
                              Maximum temperature must be greater than minimum temperature.
                            </div>
                          )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Season Starts</label>
                        <select
                          className="form-select shadow-sm rounded"
                          value={seasonStart}
                          onChange={(e) => setSeasonStart(e.target.value)}
                        >
                          {MONTHS.map((month) => (
                            <option key={month} value={month}>{month}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Season Ends</label>
                        <select
                          className="form-select shadow-sm rounded"
                          value={seasonEnd}
                          onChange={(e) => setSeasonEnd(e.target.value)}
                        >
                          {MONTHS.map((month) => (
                            <option key={month} value={month}>{month}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">Best Season Preview</label>
                        <div className="best-season-preview p-3 border rounded bg-light shadow-sm text-center">
                          <strong>{buildSeason(seasonStart, seasonEnd)}</strong>
                        </div>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">About Destination</label>
                        <textarea
                          rows={5}
                          className="form-control shadow-sm rounded-4 p-3"
                          value={formData.about_text || ""}
                          onChange={(e) => updateField("about_text", e.target.value)}
                          required
                        />
                      </div>

                      <div className="col-12 mt-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <label className="form-label fw-semibold mb-0">Travel Tips</label>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm px-3 rounded shadow-sm"
                            onClick={addTip}
                          >
                            + Add Tip
                          </button>
                        </div>
                        {formData.travel_tips.map((tip, index) => (
                          <div className="input-group mb-2 shadow-sm rounded overflow-hidden border" key={index}>
                            <input
                              type="text"
                              className="form-control border-0 px-3"
                              placeholder={`Tip #${index + 1}`}
                              value={tip}
                              onChange={(e) => handleTipChange(index, e.target.value)}
                            />
                            {formData.travel_tips.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-outline-danger px-3 border-0 rounded m-1"
                                onClick={() => removeTip(index)}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 3 */}
                  {currentStep === 3 && (
                    <div>
                      <div className="mb-4">
                        <label className="form-label fw-semibold">Hero Slider Images</label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="form-control shadow-sm rounded"
                          key={`slider-input-${sliderFiles.length}`}
                          onChange={(e) => {
                            const picked = Array.from(e.target.files || []);
                            setSliderFiles((prev) => [...Array.from(prev || []), ...picked]);
                          }}
                        />

                        {existingSliderImages.length > 0 && (
                          <>
                            <div className="small text-muted mt-3 mb-2">
                              Saved images ({existingSliderImages.length}) - click &times; to delete
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                              {existingSliderImages.map((img, i) => (
                                <ImageThumb
                                  key={`saved-${i}-${img}`}
                                  src={img}
                                  onRemove={() =>
                                    setExistingSliderImages((prev) => prev.filter((_, idx) => idx !== i))
                                  }
                                />
                              ))}
                            </div>
                          </>
                        )}

                        {Array.from(sliderFiles || []).length > 0 && (
                          <>
                            <div className="small text-muted mt-3 mb-2">New images (uploaded when you save)</div>
                            <div className="d-flex flex-wrap gap-2">
                              {Array.from(sliderFiles).map((file, i) => (
                                <FileThumb
                                  key={`new-${i}-${file.name}-${file.size}`}
                                  file={file}
                                  badge="New"
                                  onRemove={() =>
                                    setSliderFiles((prev) => Array.from(prev).filter((_, idx) => idx !== i))
                                  }
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold text-trip-navy mb-0">Top Attractions</h6>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm px-3 rounded shadow-sm"
                          onClick={addAttraction}
                        >
                          + Add Attraction
                        </button>
                      </div>

                      <div className="row g-3">
                        {attractions.map((attraction, index) => (
                          <div className="col-12" key={index}>
                            <div className="attraction-admin-card p-3 border rounded-4 bg-light shadow-sm">
                              <div className="d-flex gap-3 align-items-center">
                                <div className="attraction-number">{index + 1}</div>
                                <div className="flex-grow-1">
                                  <div className="d-flex align-items-center gap-2">
                                    <input
                                      type="text"
                                      className="form-control shadow-sm rounded px-3"
                                      value={attraction.name}
                                      onChange={(e) => handleAttractionChange(index, "name", e.target.value)}
                                      placeholder="Attraction Name"
                                    />
                                    <input
                                      type="file"
                                      accept="image/*"
                                      id={`attr-file-input-${index}`}
                                      style={{ display: "none" }}
                                      onChange={(e) =>
                                        handleAttractionChange(index, "file", e.target.files?.[0] || null)
                                      }
                                    />
                                    <label
                                      htmlFor={`attr-file-input-${index}`}
                                      className="btn btn-outline-secondary mb-0 d-flex align-items-center px-3 rounded shadow-sm"
                                      style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                                    >
                                      <i className="bi bi-upload me-1"></i> Upload Image
                                    </label>

                                    {(attraction.file || attraction.image) && (
                                      <button
                                        type="button"
                                        className="btn btn-outline-warning px-3 rounded shadow-sm"
                                        style={{ whiteSpace: "nowrap" }}
                                        onClick={() => {
                                          handleAttractionChange(index, "file", null);
                                          handleAttractionChange(index, "image", "");
                                        }}
                                      >
                                        Remove Image
                                      </button>
                                    )}

                                    {attractions.length > 1 && (
                                      <button
                                        type="button"
                                        className="btn btn-outline-danger px-3 rounded shadow-sm"
                                        style={{ whiteSpace: "nowrap" }}
                                        onClick={() => removeAttraction(index)}
                                      >
                                        Remove Row
                                      </button>
                                    )}
                                  </div>

                                  {(attraction.file || attraction.image) && (
                                    <div className="mt-2">
                                      {attraction.file ? (
                                        <FileThumb
                                          file={attraction.file}
                                          badge="New"
                                          onRemove={() => handleAttractionChange(index, "file", null)}
                                        />
                                      ) : (
                                        <ImageThumb
                                          src={attraction.image}
                                          onRemove={() => handleAttractionChange(index, "image", "")}
                                        />
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* FOOTER */}
                <div className="modal-footer bg-light border-top px-4 py-3">
                  <div className="w-100 d-flex justify-content-between align-items-center">
                    <div>
                      {currentStep > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary px-4 rounded shadow-sm"
                          onClick={handleBack}
                        >
                          Back
                        </button>
                      )}
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary px-4 rounded shadow-sm"
                        onClick={handleClose}
                      >
                        Cancel
                      </button>
                      {currentStep < 3 ? (
                        <button
                          type="button"
                          className="btn btn-primary px-4 rounded shadow-sm"
                          onClick={handleNext}
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="btn btn-success px-5 rounded shadow-sm fw-semibold"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Saving..." : "Save Destination"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}