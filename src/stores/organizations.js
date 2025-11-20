import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth";

export const useOrganizationsStore = defineStore("organizations", {
    state: () => ({
        organizations: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchOrganizations() {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/organizations`, {
                    headers: { Authorization: `Bearer ${authStore.token}` }
                });
                this.organizations = res.data;
            } catch (err) {
                this.error = err.response?.data?.message || "Failed to fetch organizations";
                console.error("Error fetching organizations:", err);
            } finally {
                this.loading = false;
            }
        },

        async createOrganization(orgData) {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();
            try {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/organizations`, orgData, {
                    headers: { Authorization: `Bearer ${authStore.token}` }
                });
                this.organizations.push(res.data);
                return res.data;
            } catch (err) {
                this.error = err.response?.data?.message || "Failed to create organization";
                console.error("Error creating organization:", err);
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async updateOrganization(id, orgData) {
            this.loading = true;
            this.error = null;
            const authStore = useAuthStore();
            try {
                const res = await axios.put(`${import.meta.env.VITE_API_URL}/organizations/${id}`, orgData, {
                    headers: { Authorization: `Bearer ${authStore.token}` }
                });
                const index = this.organizations.findIndex(o => o._id === id);
                if (index !== -1) {
                    this.organizations[index] = res.data;
                }
                return res.data;
            } catch (err) {
                this.error = err.response?.data?.message || "Failed to update organization";
                console.error("Error updating organization:", err);
                throw err;
            } finally {
                this.loading = false;
            }
        },
    },
});
