import { useSettingsStore } from '~/stores/settings';
import { computed } from 'vue';

export function useTheme() {
  const settingsStore = useSettingsStore();

  const theme = computed(() => settingsStore.theme);
  const isDark = computed(() => settingsStore.theme === 'dark');

  function toggleTheme() {
    settingsStore.toggleTheme();
  }

  function initTheme() {
    settingsStore.initTheme();
  }

  return {
    theme,
    isDark,
    toggleTheme,
    initTheme,
  };
}
