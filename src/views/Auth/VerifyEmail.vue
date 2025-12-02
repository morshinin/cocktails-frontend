<template>
  <div class="p-6 max-w-md mx-auto">
    <div v-if="loading" class="text-center">
      <a-spin size="large" />
      <p class="mt-4 text-gray-600">Verifying your email...</p>
    </div>

    <div v-else-if="success" class="text-center">
      <div class="mb-6">
        <div class="text-6xl mb-4">✅</div>
        <h1 class="text-2xl font-bold text-green-600 mb-2">Email Verified!</h1>
        <p class="text-gray-600">Your email has been successfully verified.</p>
      </div>
      
      <a-button type="primary" size="large" block @click="goToLogin">
        Go to Login
      </a-button>
    </div>

    <div v-else class="text-center">
      <div class="mb-6">
        <div class="text-6xl mb-4">❌</div>
        <h1 class="text-2xl font-bold text-red-600 mb-2">Verification Failed</h1>
        <p class="text-gray-600 mb-4">{{ errorMessage }}</p>
      </div>

      <a-space direction="vertical" class="w-full">
        <a-button type="primary" size="large" block @click="resendEmail" :loading="resending">
          Resend Verification Email
        </a-button>
        <a-button size="large" block @click="goToLogin">
          Back to Login
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const success = ref(false);
const errorMessage = ref('');
const resending = ref(false);
const userEmail = ref('');

onMounted(async () => {
  const token = route.params.token;
  
  if (!token) {
    loading.value = false;
    errorMessage.value = 'Invalid verification link';
    return;
  }

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/verify-email/${token}`);
    success.value = true;
    message.success(response.data.message);
  } catch (error) {
    success.value = false;
    errorMessage.value = error.response?.data?.message || 'Verification failed. The link may be expired or invalid.';
  } finally {
    loading.value = false;
  }
});

const resendEmail = async () => {
  if (!userEmail.value) {
    const email = prompt('Please enter your email address:');
    if (!email) return;
    userEmail.value = email;
  }

  resending.value = true;
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/resend-verification`, {
      email: userEmail.value
    });
    message.success(response.data.message);
  } catch (error) {
    message.error(error.response?.data?.message || 'Failed to resend verification email');
  } finally {
    resending.value = false;
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>
