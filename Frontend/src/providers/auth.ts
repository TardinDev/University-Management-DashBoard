import type { AuthProvider } from "@refinedev/core";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const STORAGE_KEY = "university_user";

const demoUsers: Record<string, Record<string, string>> = {
  ADMIN: {
    id: "1",
    firstName: "Admin",
    lastName: "Système",
    fullName: "Admin Système",
    email: "admin@univ.mg",
    role: "ADMIN",
    avatar: "",
  },
  PROFESSOR: {
    id: "2",
    firstName: "Jean",
    lastName: "Rakoto",
    fullName: "Jean Rakoto",
    email: "jean.rakoto@univ.mg",
    role: "PROFESSOR",
    avatar: "",
  },
  STUDENT: {
    id: "3",
    firstName: "Aina",
    lastName: "Rasoanirina",
    fullName: "Aina Rasoanirina",
    email: "aina.r@univ.mg",
    role: "STUDENT",
    avatar: "",
  },
};

function getStoredUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function fetchMe() {
  try {
    const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export const authProvider: AuthProvider = {
  login: async ({ email, password, role }) => {
    // Demo mode: login by role without backend
    if (role && demoUsers[role]) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUsers[role]));
      return { success: true, redirectTo: "/" };
    }

    // Normal login via backend
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return {
          success: false,
          error: { name: "Erreur de connexion", message: data.message || "Email ou mot de passe incorrect" },
        };
      }

      // Clear demo user if real login succeeds
      localStorage.removeItem(STORAGE_KEY);
      return { success: true, redirectTo: "/" };
    } catch {
      return {
        success: false,
        error: { name: "Erreur de connexion", message: "Impossible de contacter le serveur" },
      };
    }
  },

  register: async ({ email, password, firstName, lastName, role }) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, firstName, lastName, role }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return {
          success: false,
          error: { name: "Erreur d'inscription", message: data.message || "Erreur lors de l'inscription" },
        };
      }

      return { success: true, redirectTo: "/" };
    } catch {
      return {
        success: false,
        error: { name: "Erreur d'inscription", message: "Impossible de contacter le serveur" },
      };
    }
  },

  logout: async () => {
    localStorage.removeItem(STORAGE_KEY);
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {});

    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    // Check localStorage first (demo mode)
    if (getStoredUser()) {
      return { authenticated: true };
    }
    // Then check backend session
    const user = await fetchMe();
    if (user) {
      return { authenticated: true };
    }
    return { authenticated: false, redirectTo: "/login" };
  },

  getIdentity: async () => {
    // Check localStorage first (demo mode)
    const stored = getStoredUser();
    if (stored) return stored;

    const user = await fetchMe();
    if (!user) return null;
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };
  },

  getPermissions: async () => {
    const stored = getStoredUser();
    if (stored) return stored.role;

    const user = await fetchMe();
    return user?.role || null;
  },

  onError: async (error) => {
    if (error?.statusCode === 401) {
      return { logout: true, redirectTo: "/login" };
    }
    return { error };
  },
};
