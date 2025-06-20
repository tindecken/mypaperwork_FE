import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import handleError from 'src/utils/handleError';
import { ThemeModel } from 'src/Models/Theme/ThemeModel';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    darkTheme: false as boolean,
    selectedTheme: { label: 'High Contrast', value: 'high-contrast', mode: 'light' } as ThemeModel,
    themes: [] as ThemeModel[],
  }),
  actions: {
    async getThemes(): Promise<GenericResponseData | undefined> {
      try {
        const axiosResponse = await api.get('/themes/get', {
          withCredentials: false,
        });
        const responseData = (await axiosResponse.data) as GenericResponseData;
        // Reload categories after creating a new paperwork
        this.$patch({
          themes: responseData.data as ThemeModel[],
        });
        return responseData;
      } catch (error: any) {
        handleError(error);
      }
    },
  },
});
