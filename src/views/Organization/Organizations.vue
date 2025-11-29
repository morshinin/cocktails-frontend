<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useOrganizationsStore } from '../../stores/organizations';
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';

const organizationsStore = useOrganizationsStore();
const router = useRouter();
const showCreateForm = ref(false);
const loading = ref(false);
const editingId = ref(null);

const formState = ref({
  name: '',
  address: '',
  phone: '',
  email: '',
});

onMounted(async () => {
  await organizationsStore.fetchOrganizations();
});

const hasOrganizations = computed(() => organizationsStore.organizations.length > 0);

const toggleCreateForm = () => {
  showCreateForm.value = !showCreateForm.value;
  if (!showCreateForm.value) {
    resetForm();
  }
};

const resetForm = () => {
  editingId.value = null;
  formState.value = {
    name: '',
    address: '',
    phone: '',
    email: '',
  };
};

const editOrganization = (org) => {
  editingId.value = org._id;
  formState.value = {
    name: org.name,
    address: org.address,
    phone: org.phone,
    email: org.email,
  };
  showCreateForm.value = true;
};

const onFinish = async (values) => {
  loading.value = true;
  try {
    if (editingId.value) {
      await organizationsStore.updateOrganization(editingId.value, values);
      message.success('Organization updated successfully');
    } else {
      await organizationsStore.createOrganization(values);
      message.success('Organization created successfully');
    }
    showCreateForm.value = false;
    resetForm();
  } catch (error) {
    message.error(organizationsStore.error || (editingId.value ? 'Failed to update organization' : 'Failed to create organization'));
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="organizations-container">
    <div v-if="organizationsStore.loading && !hasOrganizations" class="loading-state">
      <a-spin size="large" />
    </div>

    <div v-else-if="!hasOrganizations || showCreateForm" class="create-section">
      <a-card :title="editingId ? 'Edit Organization' : (hasOrganizations ? 'Add New Organization' : 'Create Your First Organization')" style="max-width: 600px; margin: 0 auto">
        <template #extra v-if="hasOrganizations">
          <a-button type="link" @click="toggleCreateForm">Cancel</a-button>
        </template>
        <a-form
          :model="formState"
          name="organization"
          layout="vertical"
          @finish="onFinish"
        >
          <a-form-item
            label="Company Name"
            name="name"
            :rules="[{ required: true, message: 'Please input company name!' }]"
          >
            <a-input v-model:value="formState.name" placeholder="Enter company name" />
          </a-form-item>

          <a-form-item label="Address" name="address">
            <a-input v-model:value="formState.address" placeholder="Enter address" />
          </a-form-item>

          <a-form-item label="Phone" name="phone">
            <a-input v-model:value="formState.phone" placeholder="Enter phone number" />
          </a-form-item>

          <a-form-item
            label="E-mail"
            name="email"
            :rules="[{ type: 'email', message: 'Please input a valid email!' }]"
          >
            <a-input v-model:value="formState.email" placeholder="Enter email" />
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit" :loading="loading" block>
              {{ editingId ? 'Update Organization' : 'Create Organization' }}
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </div>

    <div v-else class="list-section">
      <div class="header-actions">
        <h2>My Organizations</h2>
        <a-button type="primary" @click="toggleCreateForm">
          <template #icon><PlusOutlined /></template>
          Add Organization
        </a-button>
      </div>
      
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="12" :md="8" v-for="org in organizationsStore.organizations" :key="org._id">
          <a-card :title="org.name" hoverable @click="router.push(`/organizations/${org._id}/venues`)" style="cursor: pointer">
            <template #extra>
              <a-button type="link" @click.stop="editOrganization(org)">Edit</a-button>
            </template>
            <p><strong>Address:</strong> {{ org.address || 'N/A' }}</p>
            <p><strong>Phone:</strong> {{ org.phone || 'N/A' }}</p>
            <p><strong>Email:</strong> {{ org.email || 'N/A' }}</p>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<style scoped>
.organizations-container {
  padding: 24px;
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

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
</style>
