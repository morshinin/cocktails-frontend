<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useVenuesStore } from '../stores/venues';
import { useAuthStore } from '../stores/auth';
import { message } from 'ant-design-vue';
import { PlusOutlined, ShopOutlined } from '@ant-design/icons-vue';

const route = useRoute();
const router = useRouter();
const venuesStore = useVenuesStore();
const organizationId = route.params.id;

const showCreateForm = ref(false);
const loading = ref(false);

const formState = ref({
  name: '',
});

onMounted(async () => {
  if (organizationId) {
    await venuesStore.fetchVenues(organizationId);
  }
});

const hasVenues = computed(() => venuesStore.venues.length > 0);

const toggleCreateForm = () => {
  showCreateForm.value = !showCreateForm.value;
  if (!showCreateForm.value) {
    resetForm();
  }
};

const resetForm = () => {
  formState.value = {
    name: '',
  };
};

const onFinish = async (values) => {
  loading.value = true;
  try {
    await venuesStore.createVenue({ ...values, organizationId });
    message.success('Venue created successfully');
    showCreateForm.value = false;
    resetForm();
  } catch (error) {
    message.error(venuesStore.error || 'Failed to create venue');
  } finally {
    loading.value = false;
  }
};

const selectVenue = (venue) => {
  const authStore = useAuthStore();
  authStore.selectVenue(venue);
  router.push('/cocktails');
};
</script>

<template>
  <div class="venues-container">
    <div class="header-section">
      <h2>Venues</h2>
      <a-button v-if="hasVenues && !showCreateForm" type="primary" @click="toggleCreateForm">
        <template #icon><PlusOutlined /></template>
        Add Venue
      </a-button>
    </div>

    <div v-if="venuesStore.loading && !hasVenues" class="loading-state">
      <a-spin size="large" />
    </div>

    <div v-else-if="!hasVenues || showCreateForm" class="create-section">
      <a-card :title="hasVenues ? 'Add New Venue' : 'Create Your First Venue'" style="max-width: 600px; margin: 0 auto; width: 100%">
        <template #extra v-if="hasVenues">
          <a-button type="link" @click="toggleCreateForm">Cancel</a-button>
        </template>
        
        <div v-if="!hasVenues && !showCreateForm" class="empty-state">
            <ShopOutlined style="font-size: 48px; color: #1890ff; margin-bottom: 16px;" />
            <p>No venues found for this organization.</p>
            <a-button type="primary" @click="showCreateForm = true">Create Venue</a-button>
        </div>

        <a-form
          v-else
          :model="formState"
          name="venue"
          layout="vertical"
          @finish="onFinish"
        >
          <a-form-item
            label="Venue Name"
            name="name"
            :rules="[{ required: true, message: 'Please input venue name!' }]"
          >
            <a-input v-model:value="formState.name" placeholder="Enter venue name" />
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit" :loading="loading" block>
              Create Venue
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </div>

    <div v-else class="list-section">
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="12" :md="8" v-for="venue in venuesStore.venues" :key="venue._id">
          <a-card :title="venue.name" hoverable @click="selectVenue(venue)" style="cursor: pointer">
             <template #extra>
                <!-- Future: Edit/Delete actions -->
             </template>
             <p>Created: {{ new Date(venue.createdAt).toLocaleDateString() }}</p>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<style scoped>
.venues-container {
  padding: 24px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 50px;
}

.create-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.empty-state {
    text-align: center;
    padding: 24px;
}
</style>
