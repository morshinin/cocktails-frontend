import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth";

export const useVenuesStore = defineStore("venues", {
    state: () => ({
        venues: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchVenues(organizationId) {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/venues`, {
                    params: { organizationId },
                    headers: { Authorization: `Bearer ${authStore.token}` }
                });
                this.venues = res.data;
            } catch (err) {
                this.error = err.response?.data?.message || "Failed to fetch venues";
                console.error("Error fetching venues:", err);
            } finally {
                this.loading = false;
            }
        },

        async createVenue(venueData) {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();
            try {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/venues`, venueData, {
                    headers: { Authorization: `Bearer ${authStore.token}` }
                });
                this.venues.push(res.data);
                return res.data;
            } catch (err) {
                this.error = err.response?.data?.message || "Failed to create venue";
                console.error("Error creating venue:", err);
                throw err;
            } finally {
                this.loading = false;
            }
        },
    },
});
