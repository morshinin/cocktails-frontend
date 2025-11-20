import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: null,
    organization: null,
    venues: [],
    selectedVenue: JSON.parse(localStorage.getItem("venue")) || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isOwner: (state) => state.user?.role === "owner",
    isAdmin: (state) => state.user?.role === "admin",
  },

  actions: {
    async login(email, password) {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        email,
        password,
      });

      this.token = res.data.token;
      localStorage.setItem("token", this.token);

      await this.fetchProfile();
    },

    async register(email, password, name) {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/register`, {
        email,
        password,
        name,
      });

      this.token = res.data.token;
      localStorage.setItem("token", this.token);

      await this.fetchProfile();
    },

    async fetchProfile() {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/me`, {
        headers: { Authorization: `Bearer ${this.token}` }
      });

      this.user = res.data.user;
      this.organization = res.data.organization;
      this.venues = res.data.venues;

      if (this.selectedVenue) {
        const venueExists = this.venues.find(v => v._id === this.selectedVenue._id);
        if (!venueExists) {
          this.selectedVenue = null;
          localStorage.removeItem("venue");
        } else {
          this.selectedVenue = venueExists;
          localStorage.setItem("venue", JSON.stringify(venueExists));
        }
      }
    },

    selectVenue(venue) {
      this.selectedVenue = venue;
      localStorage.setItem("venue", JSON.stringify(venue));
    },

    async updateProfile(userData) {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/me`, userData, {
        headers: { Authorization: `Bearer ${this.token}` }
      });
      this.user = res.data.user;
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
