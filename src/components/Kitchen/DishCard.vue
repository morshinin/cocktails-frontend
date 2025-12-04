<template>
  <a-badge-ribbon v-if="dish.category" :text="dish.category" color="orange" :style="{ top: '71px' }">
    <a-card class="h-full flex flex-col" :bodyStyle="{ flex: '1', display: 'flex', flexDirection: 'column' }">
      <template #extra>
        <a-dropdown trigger="click">
          <a class="ant-dropdown-link" @click.prevent>
            <MoreOutlined style="font-size: 20px; cursor: pointer" />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="$emit('edit', dish)">
                <EditOutlined /> Редактировать
              </a-menu-item>
              <a-menu-item danger>
                <a-popconfirm
                  title="Удалить это блюдо?"
                  ok-text="Да"
                  cancel-text="Нет"
                  @confirm="$emit('delete', dish._id)"
                >
                  <span><DeleteOutlined /> Удалить</span>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
      <template #title>
        <span class="flex items-center gap-2">
          <span>{{ dish.name }}</span>
        </span>
      </template>

      <div class="flex-1">
        <div class="mb-3">
          <img
            :src="dish.image || placeholderImage"
            :alt="dish.name"
            class="w-full h-48 object-cover rounded"
            @error="e => e.target.src = placeholderImage"
          />
        </div>

        <div v-if="dish.description" class="text-sm text-gray-600 mb-3">
          {{ dish.description }}
        </div>

        <a-table
          v-if="dish.ingredients && dish.ingredients.length > 0"
          class="ingredients-table"
          :columns="[
            { title: 'Ингредиент', dataIndex: 'name', key: 'name' },
            { title: 'Количество', dataIndex: 'amount', key: 'amount', customRender: ({ record }) => `${record.amount} ${record.unit}` }
          ]"
          :data-source="dish.ingredients"
          size="small"
          :pagination="false"
          :showHeader="false"
        />
      </div>

      <div class="mt-auto pt-4 border-t border-gray-200">
        <a-descriptions size="small" :column="1" bordered>
          <a-descriptions-item v-if="dish.method" label="Метод">
            {{ dish.method }}
          </a-descriptions-item>
          <a-descriptions-item v-if="dish.allergens && dish.allergens.length > 0" label="Аллергены">
            {{ dish.allergens.join(', ') }}
          </a-descriptions-item>
          <a-descriptions-item v-if="dish.upsells && dish.upsells.length > 0" label="Доп. продажа">
            {{ dish.upsells.join(', ') }}
          </a-descriptions-item>
          <a-descriptions-item v-if="dish.pairing" label="Пейринг">
            {{ dish.pairing }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-card>
  </a-badge-ribbon>
  
  <a-card v-else class="h-full flex flex-col" :bodyStyle="{ flex: '1', display: 'flex', flexDirection: 'column' }">
    <template #extra>
      <a-dropdown trigger="click">
        <a class="ant-dropdown-link" @click.prevent>
          <MoreOutlined style="font-size: 20px; cursor: pointer" />
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="$emit('edit', dish)">
              <EditOutlined /> Редактировать
            </a-menu-item>
            <a-menu-item danger>
              <a-popconfirm
                title="Удалить это блюдо?"
                ok-text="Да"
                cancel-text="Нет"
                @confirm="$emit('delete', dish._id)"
              >
                <span><DeleteOutlined /> Удалить</span>
              </a-popconfirm>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
    <template #title>
      <span class="flex items-center gap-2">
        <span>{{ dish.name }}</span>
      </span>
    </template>

    <div class="flex-1">
      <div class="mb-3">
        <img
          :src="dish.image || placeholderImage"
          :alt="dish.name"
          class="w-full h-48 object-cover rounded"
          @error="e => e.target.src = placeholderImage"
        />
      </div>

      <div v-if="dish.description" class="text-sm text-gray-600 mb-3">
        {{ dish.description }}
      </div>

      <a-table
        v-if="dish.ingredients && dish.ingredients.length > 0"
        class="ingredients-table"
        :columns="[
          { title: 'Ингредиент', dataIndex: 'name', key: 'name' },
          { title: 'Количество', dataIndex: 'amount', key: 'amount', customRender: ({ record }) => `${record.amount} ${record.unit}` }
        ]"
        :data-source="dish.ingredients"
        size="small"
        :pagination="false"
        :showHeader="false"
      />
    </div>

    <div class="mt-auto pt-4 border-t border-gray-200">
      <a-descriptions size="small" :column="1" bordered>
        <a-descriptions-item v-if="dish.method" label="Метод">
          {{ dish.method }}
        </a-descriptions-item>
        <a-descriptions-item v-if="dish.allergens && dish.allergens.length > 0" label="Аллергены">
          {{ dish.allergens.join(', ') }}
        </a-descriptions-item>
        <a-descriptions-item v-if="dish.upsells && dish.upsells.length > 0" label="Доп. продажа">
          {{ dish.upsells.join(', ') }}
        </a-descriptions-item>
        <a-descriptions-item v-if="dish.pairing" label="Пейринг">
          {{ dish.pairing }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </a-card>
</template>

<script setup>
import { MoreOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons-vue"
import placeholderImage from '../../assets/cocktail_placeholder.png';

defineProps({
  dish: {
    type: Object,
    required: true
  }
})

defineEmits(['delete', 'edit'])
</script>

<style scoped>
.ingredients-table :deep(.ant-table-tbody > tr:last-child > td) {
  border-bottom: none !important;
}
</style>
