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

      <a-button type="primary" html-type="submit" block :loading="loading">
        Login
      </a-button>

      <div v-if="showResendVerification" class="mt-4">
        <a-alert
          message="Email Not Verified"
          description="Please verify your email before logging in."
          type="warning"
          show-icon
          class="mb-2"
        />
        <a-button block @click="resendVerification" :loading="resending">
          Resend Verification Email
        </a-button>
      </div>

      <div class="mt-4 text-center">
        Don't have an account? <router-link to="/register">Register</router-link>
      </div>
    </a-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../../stores/auth.js";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import axios from "axios";

const email = ref("");
const password = ref("");
const loading = ref(false);
const resending = ref(false);
const showResendVerification = ref(false);
const auth = useAuthStore();
const router = useRouter();

const submit = async () => {
  loading.value = true;
  showResendVerification.value = false;
  
  try {
    await auth.login(email.value, password.value);

    if (auth.venues.length > 1) {
      router.push("/select-venue");
    } else {
      auth.selectVenue(auth.venues[0]);
      router.push("/");
    }
  } catch (error) {
    if (error.response?.data?.emailNotVerified) {
      showResendVerification.value = true;
      message.error(error.response.data.message);
    } else {
      message.error(error.response?.data?.message || "Invalid login");
    }
  } finally {
    loading.value = false;
  }
};

const resendVerification = async () => {
  if (!email.value) {
    message.error("Please enter your email address");
    return;
  }

  resending.value = true;
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/resend-verification`, {
      email: email.value
    });
    message.success(response.data.message);
    showResendVerification.value = false;
  } catch (error) {
    message.error(error.response?.data?.message || "Failed to resend verification email");
  } finally {
    resending.value = false;
  }
};
</script>
