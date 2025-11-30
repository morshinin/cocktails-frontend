<template>
  <div class="p-6 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">{{ t('settings.title') }}</h1>
    
    <div class="bg-white p-6 rounded-lg border border-gray-200">
      <div class="max-w-md">
        <h2 class="text-xl font-semibold mb-4">{{ t('settings.language') }}</h2>
        
        <a-select
          v-model:value="selectedLanguage"
          :placeholder="t('settings.selectLanguage')"
          class="w-full"
          size="large"
          @change="handleLanguageChange"
        >
          <a-select-option value="ru">Русский</a-select-option>
          <a-select-option value="en">English</a-select-option>
        </a-select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';

const { t, locale } = useI18n();
const selectedLanguage = ref(locale.value);

const handleLanguageChange = (value) => {
  locale.value = value;
  localStorage.setItem('locale', value);
  message.success(t('settings.languageChanged'));
};
</script>
