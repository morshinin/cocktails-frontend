import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: null,
    organization: null,
    venues: [],
    selectedVenue: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isOwner: (state) => state.user?.role === "owner",
    isAdmin: (state) => state.user?.role === "admin",
  },

  actions: {
    async login(email, password) {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password,
      });

      this.token = res.data.token;
      localStorage.setItem("token", this.token);

      await this.fetchProfile();
    },

    async register(email, password, name) {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        email,
        password,
        name,
      });

      this.token = res.data.token;
      localStorage.setItem("token", this.token);

      await this.fetchProfile();
    },

    async fetchProfile() {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${this.token}` }
      });

      this.user = res.data.user;
      this.organization = res.data.organization;
      this.venues = res.data.venues;
    },

    selectVenue(venue) {
      this.selectedVenue = venue;
      localStorage.setItem("venue", JSON.stringify(venue));
    },

    logout() {
      this.token = null;
      this.user = null;
      this.organization = null;
      this.venues = [];
      this.selectedVenue = null;

      localStorage.removeItem("token");
      localStorage.removeItem("venue");
    },
  },
});
