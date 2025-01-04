import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import handleError from 'src/utils/handleError';
import { useUserStore } from './userStore';
import { Category } from 'src/Models/Category/CategoryInterface';
import { UpdateCategoriesRequestModel } from 'src/Models/Category/UpdateCategoriesRequestModel';
import { CreateCategoryRequestModel } from 'src/Models/Category/CreateCategoryRequestModel';
import { EditCategoryRequestModel } from 'src/Models/Category/EditCategoryRequestModel';
import { DeleteCategoryRequestModel } from 'src/Models/Category/DeleteCategoryRequestModel';

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
        const axiosResponse = await api.put('/categories/updateCategories', body, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.token}`,
          },
        });
        const responseData = (await axiosResponse.data) as GenericResponseData;
        console.log('responseData', responseData);
        await this.getCategoriesByFileId();
        return responseData;
      } catch (error: any) {
        this.$reset();
        handleError(error);
      }
    },
    async createCategory(body: CreateCategoryRequestModel): Promise<GenericResponseData | undefined> {
      try {
        const axiosResponse = await api.post('/categories/create', body, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.token}`,
          },
        });
        const responseData = (await axiosResponse.data) as GenericResponseData;
        console.log('responseData create category', responseData);
        return responseData;
      } catch (error: any) {
        handleError(error);
      }
    },
    async editCategory(body: EditCategoryRequestModel): Promise<GenericResponseData | undefined> {
      try {
        const axiosResponse = await api.put('/categories/editCategory', body, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.token}`,
          },
        });
        const responseData = (await axiosResponse.data) as GenericResponseData;
        console.log('responseData edit category', responseData);
        return responseData;
      } catch (error: any) {
        handleError(error);
      }
    },
    async deleteCategory(body: DeleteCategoryRequestModel): Promise<GenericResponseData | undefined> {
      try {
        const axiosResponse = await api.delete('/categories/deleteCategory', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.token}`,
          },
          data: body,
        });
        const responseData = (await axiosResponse.data) as GenericResponseData;
        console.log('responseData delete category', responseData);
        return responseData;
      } catch (error: any) {
        handleError(error);
      }
    },
  },
});
