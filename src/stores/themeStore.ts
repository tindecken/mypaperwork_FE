import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import handleError from 'src/utils/handleError';
import { ThemeModel } from 'src/Models/Theme/ThemeModel';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    selectedTheme: { id: '', label: 'High Contrast', value: 'high-contrast', isDark: 0 } as ThemeModel,
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
          withCredentials: true,
        });
        const responseData = (await axiosResponse.data) as GenericResponseData;
        if (!responseData.data) return undefined;
        const themeData: ThemeModel = {
          id: responseData.data.id,
          label: responseData.data.label,
          value: responseData.data.value,
          isDark: responseData.data.isDark,
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
    async swtichDarkLightTheme() {
      try {
        // Get the current mode and find the opposite mode
        const currentMode = this.selectedTheme.isDark;
        const oppositeMode = currentMode === 0 ? 1 : 0;

        // Find a theme with the same value but opposite mode
        const oppositeTheme = this.themes.find((theme) =>
          theme.value === this.selectedTheme.value &&
          theme.isDark === oppositeMode);
        if (oppositeTheme) {
          await this.updateUserTheme(oppositeTheme.id);
        }
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
          isDark: responseData.data.isDark,
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
