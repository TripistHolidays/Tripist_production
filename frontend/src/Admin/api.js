// ============================================================
// Tripist Admin Panel - Central API Client
// ============================================================

// Vite
const API_BASE =
  import.meta.env?.VITE_API_BASE_URL;

const TOKEN_KEY = "tripist_admin_token";

// ============================================================
// AUTH
// ============================================================

export const auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),

  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },
};

// ============================================================
// COMMON REQUEST FUNCTION
// ============================================================

async function request(
  path,
  {
    method = "GET",
    body,
    isForm = false,
  } = {}
) {
  const headers = {};

  const token = auth.getToken();

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!isForm && body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isForm
      ? body
      : body !== undefined
      ? JSON.stringify(body)
      : undefined,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    // Empty response
  }

  if (!response.ok) {
    const message =
      data?.error ||
      data?.message ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data;
}

// ============================================================
// API
// ============================================================

export const api = {
  // === AUTH ===
  login: (username, password) =>
    request("/auth/login", {
      method: "POST",
      body: { username, password },
    }),

  me: () => request("/auth/me"),

  changePassword: (currentPassword, newPassword) =>
    request("/auth/change-password", {
      method: "PUT",
      body: { currentPassword, newPassword },
    }),

  // === USERS ===
  listUsers: () => request("/users"),
  addUser: (username, password, role) =>
    request("/users", { method: "POST", body: { username, password, role } }),
  deleteUser: (id) => request(`/users/${id}`, { method: "DELETE" }),

  // === BANNERS ===
  listBanners: () => request("/banners"),
  getBannerById: (id) => request(`/banners/${id}`),
  createBanner: (banner) => request("/banners", { method: "POST", body: banner }),
  updateBanner: (id, banner) => request(`/banners/${id}`, { method: "PUT", body: banner }),
  deleteBanner: (id) => request(`/banners/${id}`, { method: "DELETE" }),

  // === PACKAGES ===
  listPackages: (sort, order, destinationId) => {
    const query = new URLSearchParams();
    if (sort) query.append("sort", sort);
    if (order) query.append("order", order);
    if (destinationId) query.append("destination_id", destinationId);
    
    const queryString = query.toString();
    return request(`/packages${queryString ? `?${queryString}` : ""}`);
  },

  getPackageById: (id) => request(`/packages/${id}`),
  createPackage: (pkg) => request("/packages", { method: "POST", body: pkg }),
  updatePackage: (id, pkg) => request(`/packages/${id}`, { method: "PUT", body: pkg }),
  deletePackage: (id) => request(`/packages/${id}`, { method: "DELETE" }),
    
  // === COUNTRIES ===
  listCountries: () => request("/countries"),
  listStatesByCountry: (iso2) => request(`/states/${iso2}`),

  // === DESTINATIONS ===
  listDestinations: async () => {
  const response = await request("/destinations");

  return Array.isArray(response?.destinations)
    ? response.destinations
    : Array.isArray(response)
    ? response
    : [];
},
  listTopDestinations: () => request("/destinations?top=true"),
  getDestinationById: (id) => request(`/destinations/${id}`),
  createDestinationJSON: (payload) => request("/destinations", { method: "POST", body: payload }),
  updateDestinationJSON: (id, payload) => request(`/destinations/${id}`, { method: "PUT", body: payload }),
  deleteDestination: (id) => request(`/destinations/${id}`, { method: "DELETE" }),

  // === DESTINATION ATTRACTIONS ===
  listAttractions: (destinationId) => request(`/destinations/${destinationId}/attractions`),
  createAttraction: (destinationId, attraction) =>
    request(`/destinations/${destinationId}/attractions`, { method: "POST", body: attraction }),
  updateAttraction: (destinationId, attractionId, attraction) =>
    request(`/destinations/${destinationId}/attractions/${attractionId}`, { method: "PUT", body: attraction }),
  deleteAttraction: (destinationId, attractionId) =>
    request(`/destinations/${destinationId}/attractions/${attractionId}`, { method: "DELETE" }),

  // === CONTACT & NOTICE ===
  getContact: () => request("/contact"),
  updateContact: (contact) => request("/contact", { method: "PUT", body: contact }),
  getNotice: () => request("/notice"),
  updateNotice: (notice) => request("/notice", { method: "PUT", body: notice }),

  // === IMAGE UPLOAD ===
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return request("/upload", {
      method: "POST",
      body: formData,
      isForm: true,
    });
  },

  // === EMAIL ===
  sendContactEnquiry: (formData) => request("/email/contact", { method: "POST", body: formData }),
  sendPartnerApplication: (formData) => request("/email/partner", { method: "POST", body: formData }),
  sendCreatorApplication: (formData) => request("/email/creator", { method: "POST", body: formData, isForm: true }),
};

export default api;