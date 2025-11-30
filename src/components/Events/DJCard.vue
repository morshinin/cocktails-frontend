<template>
  <a-card class="h-full flex flex-col" :bodyStyle="{ flex: '1', display: 'flex', flexDirection: 'column' }">
    <template #extra>
      <a-dropdown trigger="click">
        <a class="ant-dropdown-link" @click.prevent>
          <MoreOutlined style="font-size: 20px; cursor: pointer" />
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="$emit('edit', dj)">
              <EditOutlined /> Редактировать
            </a-menu-item>
            <a-menu-item danger>
              <a-popconfirm
                title="Удалить этого DJ?"
                ok-text="Да"
                cancel-text="Нет"
                @confirm="$emit('delete', dj._id)"
              >
                <span><DeleteOutlined /> Удалить</span>
              </a-popconfirm>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
    <template #title>
      <div class="flex items-center gap-2">
        <span>{{ dj.name }}</span>
      </div>
    </template>

    <div class="flex-1">
      <div class="mb-3">
        <img
          :src="dj.imageUrl || placeholderImage"
          :alt="dj.name"
          class="w-full h-48 object-cover rounded"
        />
      </div>

      <div class="mb-3">
        <a-tag v-if="dj.genre" color="purple" class="mb-2">
          {{ dj.genre }}
        </a-tag>
        <p class="text-gray-600 text-sm line-clamp-3">
          {{ dj.description || 'Нет описания' }}
        </p>
      </div>

      <div class="flex gap-2 mb-3">
        <a v-if="dj.socialLinks?.instagram" :href="`https://instagram.com/${dj.socialLinks.instagram}`" target="_blank" class="text-pink-500 hover:text-pink-600">
          <InstagramOutlined style="font-size: 20px" />
        </a>
        <a v-if="dj.socialLinks?.soundcloud" :href="dj.socialLinks.soundcloud" target="_blank" class="text-orange-500 hover:text-orange-600">
          <SoundOutlined style="font-size: 20px" />
        </a>
        <a v-if="dj.socialLinks?.telegram" :href="`https://t.me/${dj.socialLinks.telegram}`" target="_blank" class="text-blue-400 hover:text-blue-500">
          <SendOutlined style="font-size: 20px" />
        </a>
      </div>
    </div>

    <div class="mt-auto pt-4 border-t border-gray-200">
      <a-descriptions size="small" :column="1" bordered>
        <a-descriptions-item v-if="dj.contacts?.phone" label="Телефон">
          {{ dj.contacts.phone }}
        </a-descriptions-item>
        <a-descriptions-item v-if="dj.contacts?.email" label="Email">
          {{ dj.contacts.email }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </a-card>
</template>

<script setup>
import { MoreOutlined, EditOutlined, DeleteOutlined, InstagramOutlined, SoundOutlined, SendOutlined } from "@ant-design/icons-vue"
import placeholderImage from '../../assets/employee_placeholder.png';

defineProps({
  dj: {
    type: Object,
    required: true
  }
})

defineEmits(['delete', 'edit'])
</script>
