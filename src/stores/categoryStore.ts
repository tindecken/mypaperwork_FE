import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import handleError from 'src/utils/handleError';
import { useUserStore } from './userStore';
import { Category } from 'src/Models/Category/CategoryInterface';

const userStore = useUserStore();
export const useCategoryStore = defineStore('category', {
  state: () => {
    return {
      categories: [] as Category[],
    };
  },
  getters: {},
  actions: {
    async getCategoriesByFileId(): Promise<GenericResponseData | undefined> {
      try {
        const axiosResponse = await api.get('/categories/getCategories', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.token}`,
          },
        });
        const responseData = (await axiosResponse.data) as GenericResponseData;
        this.$patch({
          categories: responseData.data as Category[],
        });
        return responseData;
      } catch (error: any) {
        this.$reset();
        handleError(error);
      }
    },
  },
});
