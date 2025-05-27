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
    async getCategories(): Promise<GenericResponseData | undefined> {
      try {
        const axiosResponse = await api.get('/categories/getCategories', {
          withCredentials: true,
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
    async updateCategories(body: UpdateCategoriesRequestModel): Promise<GenericResponseData | undefined> {
      try {
        const axiosResponse = await api.put('/categories/updateCategories', body, {
          withCredentials: true,
        });
        const responseData = (await axiosResponse.data) as GenericResponseData;
        console.log('responseData', responseData);
        await this.getCategories();
        return responseData;
      } catch (error: any) {
        this.$reset();
        handleError(error);
      }
    },
    async createCategory(body: CreateCategoryRequestModel): Promise<GenericResponseData | undefined> {
      try {
        const axiosResponse = await api.post('/categories/create', body, {
          withCredentials: true,
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
          withCredentials: true,
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
          withCredentials: true,
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
