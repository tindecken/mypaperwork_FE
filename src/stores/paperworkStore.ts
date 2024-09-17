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

const userStore = useUserStore();
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
        if (paging) {
          query = handlePaging(paging);
        }
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
        console.log('responseData', responseData);
        return responseData;
      } catch (error: any) {
        this.$reset();
        handleError(error);
      }
    },
  },
});
