import { createI18n } from 'vue-i18n'
import ru from './locales/ru.json'
import en from './locales/en.json'

// Get saved language from localStorage or default to Russian
const savedLocale = localStorage.getItem('locale') || 'ru'

const i18n = createI18n({
    legacy: false, // Use Composition API mode
    locale: savedLocale,
    fallbackLocale: 'ru',
    messages: {
        ru,
        en
    }
})

export default i18n
