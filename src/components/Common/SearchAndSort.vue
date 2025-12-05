<template>
  <div>
    <div class="mb-4 flex justify-between items-center gap-4">
      <div class="text-gray-600">
        {{ getItemCountText(itemCount) }}
      </div>
      
      <a-input-search
        :value="searchValue"
        @update:value="$emit('update:searchValue', $event)"
        @change="$emit('search')"
        placeholder="Поиск по названию..."
        style="width: 300px; margin-left: auto;"
        allow-clear
      />
      
      <a-space>
        <a-button 
          :type="filterVisible ? 'default' : 'default'"
          :class="{ 'filter-active': filterVisible }"
          @click="filterVisible = !filterVisible"
          title="Фильтры"
        >
          <template #icon><FilterOutlined /></template>
          Фильтры
        </a-button>
        <a-button 
          :type="sortOrder === 'asc' ? 'primary' : 'default'"
          @click="$emit('sort', 'asc')"
          title="Сортировка А-Я"
        >
          <template #icon><SortAscendingOutlined /></template>
          А-Я
        </a-button>
        <a-button 
          :type="sortOrder === 'desc' ? 'primary' : 'default'"
          @click="$emit('sort', 'desc')"
          title="Сортировка Я-А"
        >
          <template #icon><SortDescendingOutlined /></template>
          Я-А
        </a-button>
      </a-space>
    </div>
    
    <!-- Collapsible Filter Panel -->
    <a-collapse 
      v-if="filterVisible"
      v-model:activeKey="activeKey" 
      :bordered="false"
      class="filter-panel mb-4"
    >
      <a-collapse-panel 
        key="1" 
        :show-arrow="false"
        :collapsible="'disabled'"
      >
        <div class="p-4 bg-gray-50 rounded-lg">
          <slot name="filters">
            <p class="text-gray-500">Здесь будут фильтры</p>
          </slot>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { SortAscendingOutlined, SortDescendingOutlined, FilterOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  itemCount: {
    type: Number,
    required: true
  },
  searchValue: {
    type: String,
    default: ''
  },
  sortOrder: {
    type: String,
    default: null
  },
  itemType: {
    type: String,
    required: true,
    validator: (value) => ['cocktail', 'dish', 'ingredient'].includes(value)
  }
});

defineEmits(['update:searchValue', 'search', 'sort']);

const filterVisible = ref(false);
const activeKey = ref([]);

// Watch filterVisible to control collapse panel
watch(filterVisible, (newVal) => {
  activeKey.value = newVal ? ['1'] : [];
});

const getItemCountText = (count) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (props.itemType === 'cocktail') {
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return `${count} коктейлей`;
    }
    if (lastDigit === 1) {
      return `${count} коктейль`;
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return `${count} коктейля`;
    }
    return `${count} коктейлей`;
  } else if (props.itemType === 'dish') {
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return `${count} блюд`;
    }
    if (lastDigit === 1) {
      return `${count} блюдо`;
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return `${count} блюда`;
    }
    return `${count} блюд`;
  } else if (props.itemType === 'ingredient') {
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return `${count} ингредиентов`;
    }
    if (lastDigit === 1) {
      return `${count} ингредиент`;
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return `${count} ингредиента`;
    }
    return `${count} ингредиентов`;
  }
};
</script>

<style scoped>
.filter-panel :deep(.ant-collapse-item) {
  border: none !important;
}

.filter-panel :deep(.ant-collapse-header) {
  display: none !important;
}

.filter-panel :deep(.ant-collapse-content) {
  border: none !important;
  background: transparent !important;
}

.filter-panel :deep(.ant-collapse-content-box) {
  padding: 0 !important;
}

.filter-active {
  background-color: #d9d9d9 !important;
  border-color: #d9d9d9 !important;
}

.filter-active:hover {
  background-color: #bfbfbf !important;
  border-color: #bfbfbf !important;
}
</style>
