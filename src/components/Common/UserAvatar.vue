<script setup>
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';
import { 
  UserOutlined, 
  TeamOutlined, 
  SettingOutlined, 
  LogoutOutlined,
  ShopOutlined 
} from '@ant-design/icons-vue';

const authStore = useAuthStore();
const router = useRouter();

const roleNames = {
  developer: 'Разработчик',
  owner: 'Владелец',
  manager: 'Управляющий',
  head_bartender: 'Старший бармен',
  bartender: 'Бармен',
  head_chef: 'Шеф-повар',
  cook: 'Повар',
  cleaner: 'Клинер',
  waiter: 'Официант',
  guest: 'Гость'
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <a-dropdown trigger="click" overlayClassName="user-avatar-dropdown">
    <a-avatar :src="authStore.user?.photoUrl" style="background-color: #87d068; cursor: pointer">
      {{ !authStore.user?.photoUrl ? (authStore.user?.name?.[0]?.toUpperCase() || 'U') : '' }}
    </a-avatar>
    <template #overlay>
      <a-menu>
        <a-menu-item disabled style="color: rgba(255, 255, 255, 0.85); cursor: default;">
          Вы вошли как {{ roleNames[authStore.user?.role] || authStore.user?.role }}
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="profile">
          <router-link to="/profile">
            <UserOutlined style="margin-right: 8px;" />
            Profile
          </router-link>
        </a-menu-item>
        <a-menu-item key="organizations">
          <router-link to="/organizations">
            <ShopOutlined style="margin-right: 8px;" />
            Organizations
          </router-link>
        </a-menu-item>
        <a-menu-item key="users">
          <router-link to="/users">
            <TeamOutlined style="margin-right: 8px;" />
            Users
          </router-link>
        </a-menu-item>
        <a-menu-item key="settings">
          <router-link to="/settings">
            <SettingOutlined style="margin-right: 8px;" />
            Settings
          </router-link>
        </a-menu-item>
        <a-menu-item key="logout" @click="handleLogout">
          <LogoutOutlined style="margin-right: 8px;" />
          Log out
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<style>
/* Global styles for user avatar dropdown */
.user-avatar-dropdown {
  background-color: #001529 !important;
}

.user-avatar-dropdown .ant-dropdown-menu {
  background-color: #001529 !important;
  padding: 8px 0;
}

.user-avatar-dropdown .ant-dropdown-menu-item {
  color: rgba(255, 255, 255, 0.85) !important;
}

.user-avatar-dropdown .ant-dropdown-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.user-avatar-dropdown .ant-dropdown-menu-item a {
  color: rgba(255, 255, 255, 0.85) !important;
  text-decoration: none;
}

.user-avatar-dropdown .ant-dropdown-menu-item-divider {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.user-avatar-dropdown .ant-dropdown-menu-item-disabled {
  color: rgba(255, 255, 255, 0.65) !important;
}
</style>
