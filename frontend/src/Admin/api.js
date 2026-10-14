// ============================================================
// Tripist Admin Panel - Central API Client (Ultra-Fast Edition)
// ============================================================

const API_BASE = import.meta.env?.VITE_API_BASE_URL;
const TOKEN_KEY = "tripist_admin_token";

// ============================================================
// INSTANT IN-MEMORY & SESSION CACHE
// ============================================================

const memoryCache = {
  packagesList: null,
  destinationsList: null,
  topDestinationsList: null,
  packageById: new Map(),
  packageBySlug: new Map(),
  destinationById: new Map(),
  destinationBySlug: new Map(),
  attractionsByDestId: new Map(),
  inFlightRequests: new Map(), // Prevents duplicate simultaneous network calls
};

export const clearApiCache = () => {
  memoryCache.packagesList = null;
  memoryCache.destinationsList = null;
  memoryCache.topDestinationsList = null;
  memoryCache.packageById.clear();
  memoryCache.packageBySlug.clear();
  memoryCache.destinationById.clear();
  memoryCache.destinationBySlug.clear();
  memoryCache.attractionsByDestId.clear();
};

// ============================================================
// SLUG UTILITIES
// ============================================================

export const toSlug = (name) =>
  String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

export const toPackageSlug = (name) => {
  const cleanWords = String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2);

  return cleanWords.join("");
};

// Index packages into Maps for 0ms instant lookup on click
const indexPackages = (list) => {
  if (!Array.isArray(list)) return;
  list.forEach((p) => {
    const id = String(p.id || p._id || "");
    const name = p.name || p.package_name || "";
    const slug2 = toPackageSlug(name);
    const slugFull = toSlug(name);

    if (id) memoryCache.packageById.set(id, p);
    if (slug2) memoryCache.packageBySlug.set(slug2, p);
    if (slugFull) memoryCache.packageBySlug.set(slugFull, p);
  });
};

// Index destinations into Maps for 0ms instant lookup on click
const indexDestinations = (list) => {
  if (!Array.isArray(list)) return;
  list.forEach((d) => {
    const id = String(d.id || d._id || "");
    const name = d.name || d.destination_name || "";
    const slug = toSlug(name);

    if (id) memoryCache.destinationById.set(id, d);
    if (slug) memoryCache.destinationBySlug.set(slug, d);
  });
};

// ============================================================
// AUTH
// ============================================================

export const auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
};

// ============================================================
// COMMON REQUEST FUNCTION (With Request Deduplication)
// ============================================================

async function request(path, { method = "GET", body, isForm = false } = {}) {
  // If an identical GET request is already in flight, reuse its Promise
  if (method === "GET" && memoryCache.inFlightRequests.has(path)) {
    return memoryCache.inFlightRequests.get(path);
  }

  const headers = {};
  const token = auth.getToken();

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!isForm && body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  // Clear cache automatically whenever admin modifies data
  if (method !== "GET") {
    clearApiCache();
  }

  const fetchPromise = (async () => {
    try {
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
    } finally {
      if (method === "GET") {
        memoryCache.inFlightRequests.delete(path);
      }
    }
  })();

  if (method === "GET") {
    memoryCache.inFlightRequests.set(path, fetchPromise);
  }

  return fetchPromise;
}

// ============================================================
// API
// ============================================================

export const api = {
  // === AUTH ===
  login: (username, password) =>
    request("/auth/login", { method: "POST", body: { username, password } }),
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
  listPackages: async (sort, order, destinationId) => {
    const isDefault = !sort && !order && !destinationId;

    if (isDefault && memoryCache.packagesList) {
      return memoryCache.packagesList;
    }

    // If filtering by destinationId and we already have all packages in memory, filter locally in 0ms!
    if (destinationId && !sort && !order && memoryCache.packagesList) {
      const all = Array.isArray(memoryCache.packagesList)
        ? memoryCache.packagesList
        : memoryCache.packagesList?.packages || memoryCache.packagesList?.data || [];
      const filtered = all.filter(
        (p) => String(p.destination_id || p.destinationId) === String(destinationId)
      );
      if (filtered.length > 0) return filtered;
    }

    const query = new URLSearchParams();
    if (sort) query.append("sort", sort);
    if (order) query.append("order", order);
    if (destinationId) query.append("destination_id", destinationId);

    const queryString = query.toString();
    const res = await request(`/packages${queryString ? `?\${queryString}` : ""}`);

    const list = Array.isArray(res) ? res : res?.packages || res?.data || [];
    indexPackages(list);

    if (isDefault) {
      memoryCache.packagesList = res;
    }
    return res;
  },

  getPackageById: async (id) => {
    const key = String(id || "");
    const cached = memoryCache.packageById.get(key);
    if (cached && (cached.itinerary !== undefined || cached.inclusions !== undefined)) {
      return cached;
    }

    const data = await request(`/packages/${key}`);
    if (data) indexPackages([data]);
    return data;
  },

  getPackageBySlug: async (slug) => {
    const targetSlug = String(slug || "").toLowerCase().replace(/[^a-z0-9]/g, "");

    // 1. Instant 0ms lookup from Map if already preloaded
    let match =
      memoryCache.packageBySlug.get(targetSlug) ||
      memoryCache.packageById.get(String(slug));

    // 2. If not in Map yet, fetch list once and index
    if (!match) {
      await api.listPackages();
      match =
        memoryCache.packageBySlug.get(targetSlug) ||
        memoryCache.packageById.get(String(slug));
    }

    if (!match) throw new Error(`Package "${slug}" not found.`);

    // If full package details are already on the object, return immediately in 0ms
    if (match.itinerary !== undefined || match.inclusions !== undefined) {
      return match;
    }

    return api.getPackageById(match.id || match._id);
  },

  createPackage: (pkg) => request("/packages", { method: "POST", body: pkg }),
  updatePackage: (id, pkg) => request(`/packages/${id}`, { method: "PUT", body: pkg }),
  deletePackage: (id) => request(`/packages/${id}`, { method: "DELETE" }),

  // === COUNTRIES ===
  listCountries: () => request("/countries"),
  listStatesByCountry: (iso2) => request(`/states/${iso2}`),

  // === DESTINATIONS ===
  listDestinations: async () => {
    if (memoryCache.destinationsList) {
      return memoryCache.destinationsList;
    }

    const response = await request("/destinations");
    const list = Array.isArray(response?.destinations)
      ? response.destinations
      : Array.isArray(response)
      ? response
      : [];

    memoryCache.destinationsList = list;
    indexDestinations(list);
    return list;
  },

  listTopDestinations: async () => {
    if (memoryCache.topDestinationsList) {
      return memoryCache.topDestinationsList;
    }

    // If full destinations list is already loaded, filter top destinations locally in 0ms
    if (memoryCache.destinationsList) {
      const top = memoryCache.destinationsList.filter(
        (d) => d.is_top_destination === true || d.isTopDestination === true
      );
      if (top.length > 0) {
        memoryCache.topDestinationsList = top;
        return top;
      }
    }

    const res = await request("/destinations?top=true");
    const list = Array.isArray(res?.destinations)
      ? res.destinations
      : Array.isArray(res)
      ? res
      : [];

    indexDestinations(list);
    memoryCache.topDestinationsList = res;
    return res;
  },

  getDestinationById: async (id) => {
    const key = String(id || "");
    const cached = memoryCache.destinationById.get(key);
    if (cached && (cached.description !== undefined || cached.hero_slider_images !== undefined)) {
      return cached;
    }

    const data = await request(`/destinations/${key}`);
    if (data) indexDestinations([data]);
    return data;
  },

  getDestinationBySlug: async (slug) => {
    const targetSlug = toSlug(slug);

    // 1. Instant 0ms lookup from Map
    let match =
      memoryCache.destinationBySlug.get(targetSlug) ||
      memoryCache.destinationById.get(String(slug));

    // 2. Fetch and index if not yet loaded
    if (!match) {
      await api.listDestinations();
      match =
        memoryCache.destinationBySlug.get(targetSlug) ||
        memoryCache.destinationById.get(String(slug));
    }

    if (!match) throw new Error(`Destination "${slug}" not found.`);

    if (match.description !== undefined || match.hero_slider_images !== undefined) {
      return match;
    }

    return api.getDestinationById(match.id);
  },

  createDestinationJSON: (payload) => request("/destinations", { method: "POST", body: payload }),
  updateDestinationJSON: (id, payload) => request(`/destinations/${id}`, { method: "PUT", body: payload }),
  deleteDestination: (id) => request(`/destinations/${id}`, { method: "DELETE" }),

  // === DESTINATION ATTRACTIONS ===
  listAttractions: async (destinationId) => {
    const key = String(destinationId || "");
    if (memoryCache.attractionsByDestId.has(key)) {
      return memoryCache.attractionsByDestId.get(key);
    }
    const res = await request(`/destinations/${destinationId}/attractions`);
    memoryCache.attractionsByDestId.set(key, res);
    return res;
  },
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
    return request("/upload", { method: "POST", body: formData, isForm: true });
  },

  // === EMAIL ===
  sendContactEnquiry: (formData) => request("/email/contact", { method: "POST", body: formData }),
  sendPartnerApplication: (formData) => request("/email/partner", { method: "POST", body: formData }),
  sendCreatorApplication: (formData) => request("/email/creator", { method: "POST", body: formData, isForm: true }),

  // === INSTANT SYNCHRONOUS GETTERS (For 0ms state initialization) ===
  getCachedPackageSync: (slugOrId) => {
    if (!slugOrId) return null;
    const clean = String(slugOrId).toLowerCase().replace(/[^a-z0-9]/g, "");
    return (
      memoryCache.packageBySlug.get(clean) ||
      memoryCache.packageById.get(String(slugOrId)) ||
      null
    );
  },
  getCachedDestinationSync: (slugOrId) => {
    if (!slugOrId) return null;
    const clean = toSlug(slugOrId);
    return (
      memoryCache.destinationBySlug.get(clean) ||
      memoryCache.destinationById.get(String(slugOrId)) ||
      null
    );
  },
};

// Warm up cache in the background as soon as the app loads
if (typeof window !== "undefined") {
  setTimeout(() => {
    api.listDestinations().catch(() => {});
    api.listPackages().catch(() => {});
  }, 100);
}

export default api;