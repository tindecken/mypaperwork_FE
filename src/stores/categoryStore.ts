import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import handleError from 'src/utils/handleError';
import { useUserStore } from './userStore';
import { Category } from 'src/Models/Category/CategoryInterface';
import { UpdateCategoriesRequestModel } from 'src/Models/Category/UpdateCategoriesRequestModel';

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
    async updateCategoriesByFileId(body: UpdateCategoriesRequestModel): Promise<GenericResponseData | undefined> {
      try {
        const axiosResponse = await api.put('/categories/updateCategories',
          body,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.token}`,
          },
        });
        const responseData = (await axiosResponse.data) as GenericResponseData;
        console.log('responseData', responseData);
        return responseData;
      } catch (error: any) {
        this.$reset();
        handleError(error);
      }
    },
  },
});
