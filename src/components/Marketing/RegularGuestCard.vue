<template>
  <a-card class="h-full flex flex-col" :bodyStyle="{ flex: '1', display: 'flex', flexDirection: 'column' }">
    <template #extra>
      <a-dropdown trigger="click">
        <a class="ant-dropdown-link" @click.prevent>
          <MoreOutlined style="font-size: 20px; cursor: pointer" />
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="$emit('edit', guest)">
              <EditOutlined /> Редактировать
            </a-menu-item>
            <a-menu-item danger>
              <a-popconfirm
                title="Удалить этого гостя?"
                ok-text="Да"
                cancel-text="Нет"
                @confirm="$emit('delete', guest._id)"
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
        <span>{{ guest.name }}</span>
      </div>
    </template>

    <div class="flex-1">
      <div class="mb-3">
        <img
          :src="guest.imageUrl || placeholderImage"
          :alt="guest.name"
          class="w-full h-48 object-cover rounded"
        />
      </div>

      <div class="mb-3 text-gray-600 text-sm">
        <div v-if="guest.birthday" class="mb-2 flex items-center gap-2">
          <span>🎂</span>
          <span>{{ formatDate(guest.birthday) }}</span>
        </div>
        
        <div v-if="guest.preferences" class="mb-2">
          <div class="flex items-start gap-2">
            <span>❤️</span>
            <span class="line-clamp-3">{{ guest.preferences }}</span>
          </div>
        </div>

        <div v-if="guest.description" class="mt-2 text-gray-500 italic line-clamp-2">
          {{ guest.description }}
        </div>
      </div>

      <div class="flex gap-2 mt-auto">
        <a v-if="guest.contacts?.telegram" :href="`https://t.me/${guest.contacts.telegram}`" target="_blank" class="text-blue-400 hover:text-blue-500">
          <SendOutlined style="font-size: 20px" />
        </a>
        <a v-if="guest.contacts?.phone" :href="`tel:${guest.contacts.phone}`" class="text-green-500 hover:text-green-600">
          <PhoneOutlined style="font-size: 20px" />
        </a>
      </div>
    </div>
  </a-card>
</template>

<script setup>
import { MoreOutlined, EditOutlined, DeleteOutlined, SendOutlined, PhoneOutlined } from "@ant-design/icons-vue"
import dayjs from 'dayjs';
import placeholderImage from '../../assets/employee_placeholder.png';

defineProps({
  guest: {
    type: Object,
    required: true
  }
})

defineEmits(['delete', 'edit'])

const formatDate = (date) => {
  return dayjs(date).format('DD.MM.YYYY');
};
</script>
