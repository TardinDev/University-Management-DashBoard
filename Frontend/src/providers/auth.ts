import type { AuthProvider } from "@refinedev/core";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function fetchMe() {
  const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
  if (!res.ok) return null;
  return res.json();
}

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
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

    return { success: true, redirectTo: "/" };
  },

  register: async ({ email, password, firstName, lastName, role }) => {
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
  },

  logout: async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {});

    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    const user = await fetchMe();
    if (user) {
      return { authenticated: true };
    }
    return { authenticated: false, redirectTo: "/login" };
  },

  getIdentity: async () => {
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
