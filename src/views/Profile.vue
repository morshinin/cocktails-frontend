<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { message } from 'ant-design-vue';

const authStore = useAuthStore();
const loading = ref(false);

const formState = ref({
  name: '',
  email: '',
});

onMounted(() => {
  if (authStore.user) {
    formState.value.name = authStore.user.name;
    formState.value.email = authStore.user.email;
  }
});

const onFinish = async (values) => {
  loading.value = true;
  try {
    await authStore.updateProfile(values);
    message.success('Profile updated successfully');
  } catch (error) {
    message.error('Failed to update profile');
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="profile-container">
    <a-card title="User Profile" style="max-width: 600px; margin: 0 auto">
      <a-form
        :model="formState"
        name="profile"
        layout="vertical"
        @finish="onFinish"
      >
        <a-form-item
          label="Name"
          name="name"
          :rules="[{ required: true, message: 'Please input your name!' }]"
        >
          <a-input v-model:value="formState.name" />
        </a-form-item>

        <a-form-item
          label="Email"
          name="email"
          :rules="[{ required: true, type: 'email', message: 'Please input a valid email!' }]"
        >
          <a-input v-model:value="formState.email" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading">
            Save Changes
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<style scoped>
.profile-container {
  padding: 24px;
}
</style>
