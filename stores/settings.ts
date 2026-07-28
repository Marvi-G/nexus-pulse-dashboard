import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface NotificationPrefs {
  email: boolean;
  push: boolean;
  marketing: boolean;
}

export const useSettingsStore = defineStore('settings', () => {
  const theme = ref<'light' | 'dark'>('dark');
  const language = ref<string>('English');
  const profileName = ref('');
  const profileEmail = ref('');
  const notifications = ref<NotificationPrefs>({
    email: true,
    push: true,
    marketing: false,
  });

  const toasts = ref<{ id: number; message: string; type: 'success' | 'error' | 'info' }[]>([]);
  let toastId = 0;

  function initTheme() {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      theme.value = stored;
    }
    applyTheme();
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', theme.value);
    applyTheme();
  }

  function setTheme(t: 'light' | 'dark') {
    theme.value = t;
    localStorage.setItem('theme', t);
    applyTheme();
  }

  function applyTheme() {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme.value === 'dark');
    }
  }

  function addToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    const id = ++toastId;
    toasts.value.push({ id, message, type });
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, 3000);
  }

  function removeToast(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  function saveSettings() {
    localStorage.setItem('language', language.value);
    localStorage.setItem('notifications', JSON.stringify(notifications.value));
    if (profileName.value) {
      localStorage.setItem('profile_name', profileName.value);
    }
    addToast('Settings saved successfully');
  }

  function loadSettings() {
    const lang = localStorage.getItem('language');
    if (lang) language.value = lang;

    const notifs = localStorage.getItem('notifications');
    if (notifs) {
      try {
        notifications.value = JSON.parse(notifs);
      } catch { /* use defaults */ }
    }

    const name = localStorage.getItem('profile_name');
    if (name) profileName.value = name;
  }

  return {
    theme,
    language,
    profileName,
    profileEmail,
    notifications,
    toasts,
    initTheme,
    toggleTheme,
    setTheme,
    applyTheme,
    addToast,
    removeToast,
    saveSettings,
    loadSettings,
  };
});
