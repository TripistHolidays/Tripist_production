// Destination Type (Used for location & routing logic)
export const DESTINATION_TYPES = ["Special Pack", "Domestic", "International"];

// Theme & Activity Categories (Strictly for Package Theme classification)
export const PACKAGE_CATEGORIES = [
  "Adventure",
  "Backpacking",
  "Beach",
  "Budget",
  "City",
  "Culture",
  "Desert",
  "Explorer",
  "Family",
  "Heritage",
  "Hills",
  "History",
  "Honeymoon",
  "Island",
  "Luxury",
  "Nature",
  "Photography",
  "Pilgrimage",
  "Resort",
  "Shopping",
  "Spiritual",
  "Wellness"
];

export const LOCATION_DATA = {
  India: [
    "Tamil Nadu",
    "Kerala",
    "Karnataka",
    "Goa",
    "Himachal Pradesh",
    "Maharashtra",
    "Rajasthan",
    "Gujarat",
    "Delhi",
    "Punjab",
    "Jammu & Kashmir",
    "Ladakh",
    "West Bengal",
    "Uttarakhand",
    "Andaman and Nicobar",
  ],
  Switzerland: ["Zurich", "Geneva", "Lucerne", "Interlaken", "Zermatt"],
  Maldives: ["Male", "Maafushi", "Ari Atoll", "Baa Atoll"],
  Thailand: ["Bangkok", "Phuket", "Pattaya", "Chiang Mai", "Krabi"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah"],
  Indonesia: ["Bali", "Jakarta", "Yogyakarta", "Lombok"],
};

export const COUNTRIES = Object.keys(LOCATION_DATA);

export const PACKAGE_STATUSES = [
  { value: "active", label: "Active", color: "#1eab5c" },
  { value: "inactive", label: "Inactive", color: "#e14b4b" },
];

export const EMPTY_ITINERARY_DAY = { day: 1, date: "", title: "", activities: "" };
export const EMPTY_FAQ = { question: "", answer: "" };

export const EMPTY_PACKAGE = {
  id: null,
  name: "",
  price: "",
  image: "",
  destinationId: "",
  destinationType: "Domestic",
  packageCategory: "Beach",
  country: "India",
  state: "Tamil Nadu",
  durationDays: "",
  durationNights: "",
  isTopPackage: false,
  status: "active",
  validUntil: "",
  shortDescription: "",
  longDescription: "",
  inclusions: [],
  exclusions: [],
  itinerary: [{ ...EMPTY_ITINERARY_DAY }],
  faqs: [{ ...EMPTY_FAQ }],
};

export const EMPTY_NEW_USER = { username: "", password: "", role: "admin" };

export const EMPTY_PASSWORD_FORM = {
  targetUserId: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export const todayDateStr = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};