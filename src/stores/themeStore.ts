import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import handleError from 'src/utils/handleError';
import { ThemeModel } from 'src/Models/Theme/ThemeModel';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    darkTheme: false as boolean,
    selectedTheme: { id: '', label: 'High Contrast', value: 'high-contrast', mode: 'light' } as ThemeModel,
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
    // get user theme
    async getUserTheme(): Promise<GenericResponseData | undefined> {
      try {
        const axiosResponse = await api.get('/themes/getUserTheme', {
          withCredentials: false,
        });
        const responseData = (await axiosResponse.data) as GenericResponseData;
        const themeData: ThemeModel = {
          id: responseData.data.id,
          label: responseData.data.label,
          value: responseData.data.value,
          mode: responseData.data.isDark === 0 ? 'light' : 'dark',
        }
        // Reload categories after creating a new paperwork
        this.$patch({
          selectedTheme: themeData,
        });
        return responseData;
      } catch (error: any) {
        handleError(error);
      }
    },
    // update user theme
    async updateUserTheme(themeId: string): Promise<GenericResponseData | undefined> {
      try {
        const axiosResponse = await api.post('/themes/set', { themeId }, {
          withCredentials: true,
        });
        const responseData = (await axiosResponse.data) as GenericResponseData;
        const themeData: ThemeModel = {
          id: responseData.data.id,
          label: responseData.data.label,
          value: responseData.data.value,
          mode: responseData.data.isDark === 0 ? 'light' : 'dark',
        }
        // Reload categories after creating a new paperwork
        this.$patch({
          selectedTheme: themeData,
        });
        return responseData;
      } catch (error: any) {
        handleError(error);
      }
    },
  },
});
