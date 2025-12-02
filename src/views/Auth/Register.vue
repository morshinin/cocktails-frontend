<template>
  <div class="p-6 max-w-md mx-auto">
    <h1 class="text-xl font-bold mb-4">Register</h1>

    <a-form @submit.prevent="submit" layout="vertical">
      <a-form-item label="Name" required>
        <a-input v-model:value="name" placeholder="Your Name" />
      </a-form-item>

      <a-form-item label="Email" required>
        <a-input v-model:value="email" placeholder="email@example.com" />
      </a-form-item>

      <a-form-item label="Password" required>
        <a-input type="password" v-model:value="password" placeholder="Password" />
      </a-form-item>

      <a-form-item label="Confirm Password" required :validate-status="passwordError ? 'error' : ''" :help="passwordError">
        <a-input type="password" v-model:value="confirmPassword" placeholder="Confirm Password" />
      </a-form-item>

      <a-button type="primary" html-type="submit" block :loading="loading">
        Register
      </a-button>

      <div class="mt-4 text-center">
        Already have an account? <router-link to="/login">Login</router-link>
      </div>
    </a-form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "../../stores/auth.js";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const auth = useAuthStore();
const router = useRouter();

const passwordError = computed(() => {
  return password.value && confirmPassword.value && password.value !== confirmPassword.value
    ? "Passwords do not match"
    : "";
});

const submit = async () => {
  if (passwordError.value) {
    return;
  }
  
  if (!name.value || !email.value || !password.value) {
    message.error("Please fill in all fields");
    return;
  }

  loading.value = true;
  try {
    const response = await auth.register(email.value, password.value, name.value);
    message.success(response.message || "Registration successful! Please check your email to verify your account.");
    
    // Redirect to login page
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (e) {
    console.error(e);
    message.error(e.response?.data?.message || "Registration failed");
  } finally {
    loading.value = false;
  }
};
</script>
