import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    darkTheme: false as boolean,
    selectedTheme: { label: 'Orange', value: 'orange' } as {
      label: string;
      value: string;
    },
    themes: [
      { label: 'Orange', value: 'orange' },
      { label: 'Quasar', value: 'quasar' },
      { label: 'Blue', value: 'blue' },
      { label: 'High Contrast', value: 'high-contrast' },
      { label: 'Synthware', value: 'synthware' },
      { label: 'Ocean', value: 'ocean' },
      { label: 'Pastels', value: 'pastels' },
      { label: 'Sunset', value: 'sunset' },
    ],
    isShowedJson: false as boolean,
  }),
  actions: {
    switchDarkTheme() {
      this.darkTheme = !this.darkTheme;
    },
    changeTheme(theme: { label: string; value: string }) {
      this.selectedTheme = theme;
    },
    toggleIsShowedJson() {
      this.isShowedJson = !this.isShowedJson;
    },
  },
});
