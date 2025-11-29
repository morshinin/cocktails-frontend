<template>
  <div class="p-6 max-w-md mx-auto">
    <h1 class="text-xl font-bold mb-4">Login</h1>

    <a-form @submit.prevent="submit">
      <a-form-item label="Email">
        <a-input v-model:value="email" />
      </a-form-item>

      <a-form-item label="Password">
        <a-input type="password" v-model:value="password" />
      </a-form-item>

      <a-button type="primary" html-type="submit" block>
        Login
      </a-button>
    </a-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../../stores/auth.js";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const auth = useAuthStore();
const router = useRouter();

const submit = async () => {
  try {
    await auth.login(email.value, password.value);

    if (auth.venues.length > 1) {
      router.push("/select-venue");
    } else {
      auth.selectVenue(auth.venues[0]);
      router.push("/");
    }
  } catch {
    message.error("Invalid login");
  }
};
</script>
