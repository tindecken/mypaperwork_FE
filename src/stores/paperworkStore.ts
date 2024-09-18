import { defineStore } from 'pinia';
import { AuthenticateRequestModel } from 'src/Models/Authentication/AuthenticateRequestModel';
import { api } from '../boot/axios';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import handleError from 'src/utils/handleError';
import { useUserStore } from './userStore';
import { Paperwork } from 'src/Models/Paperwork/PaperworkInterface';
import handlePaging from 'src/utils/handlePaging';
import { Paging } from 'src/Models/PagingInterface';
import { CreatePaperworkRequestModel } from 'src/Models/Paperwork/CreatePaperworkRequestModel';
import { useCategoryStore } from './categoryStore';

const userStore = useUserStore();
const categoryStore = useCategoryStore();
export const usePaperworkStore = defineStore('paperwork', {
  state: () => {
    return {
      paperworks: [] as Paperwork[],
    };
  },
  getters: {},
  actions: {
    async getPaperworksBySelectedFile(paging?: Paging): Promise<GenericResponseData | undefined> {
      try {
        let query = '';
        query = handlePaging(paging);
        const axiosResponse = await api.get(`/paperworks/getPaperworks${query}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.token}`,
          },
        });
        const responseData = (await axiosResponse.data) as GenericResponseData;
        this.$patch({
          paperworks: responseData.data as Paperwork[],
        });
        return responseData;
      } catch (error: any) {
        this.$reset();
        handleError(error);
      }
    },
    async createPaperwork(model: CreatePaperworkRequestModel): Promise<GenericResponseData | undefined> {
      try {
        const formData = new FormData();
        formData.append('categoryId', model.categoryId || '');
        formData.append('name', model.name);
        formData.append('description', model.description || '');
        formData.append('issueAt', model.issueAt?.toString() || '');
        formData.append('price', model.price?.toString() || '');
        formData.append('priceCurrency', model.priceCurrency?.toString() || '');
        model.files?.forEach((file: any) => {
          formData.append('files', file, file.name);
        });

        const axiosResponse = await api.post('/paperworks/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-datan',
            Authorization: `Bearer ${userStore.token}`,
          },
        });
        const responseData = (await axiosResponse.data) as GenericResponseData;
        // Reload categories after creating a new paperwork
        await categoryStore.getCategoriesByFileId();
        await this.getPaperworksBySelectedFile();
        return responseData;
      } catch (error: any) {
        handleError(error);
      }
    },
  },
});
