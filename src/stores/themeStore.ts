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
    // get all theme
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
    changeTheme(newTheme: { label: string; value: string; mode: string }) {
      this.selectedTheme = newTheme;
    },
    // get user theme
    async getUserTheme(): Promise<GenericResponseData | undefined> {
      try {
        const axiosResponse = await api.get('/themes/getUserTheme', {
          withCredentials: false,
        });
        const responseData = (await axiosResponse.data) as GenericResponseData;
        // Reload categories after creating a new paperwork
        this.$patch({
          selectedTheme: responseData.data as ThemeModel,
        });
        return responseData;
      } catch (error: any) {
        handleError(error);
      }
    },
    // update user theme
    async updateUserTheme(themeId: string): Promise<GenericResponseData | undefined> {
      try {
        const axiosResponse = await api.post('/themes/set', themeId, {
          withCredentials: false,
        });
        const responseData = (await axiosResponse.data) as GenericResponseData;
        // Reload categories after creating a new paperwork
        this.$patch({
          selectedTheme: responseData.data as ThemeModel,
        });
        return responseData;
      } catch (error: any) {
        handleError(error);
      }
    },
  },
});
