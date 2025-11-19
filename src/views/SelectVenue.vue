<template>
  <div class="p-6 max-w-lg mx-auto">
    <h1 class="text-2xl mb-4 font-bold">Select Venue</h1>

    <a-list bordered :data-source="auth.venues">
      <template #renderItem="{ item }">
        <a-list-item @click="select(item)" class="cursor-pointer hover:bg-gray-100">
          {{ item.name }}
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup>
import { useAuthStore } from "../stores/auth.js";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const select = (venue) => {
  auth.selectVenue(venue);
  router.push("/");
};
</script>
