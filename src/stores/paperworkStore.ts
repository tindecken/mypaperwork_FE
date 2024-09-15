import { defineStore } from 'pinia';
import { AuthenticateRequestModel } from 'src/Models/Authentication/AuthenticateRequestModel';
import { api } from '../boot/axios';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import handleError from 'src/utils/handleError';
import { useUserStore } from './userStore';
import { Paperwork } from 'src/Models/Paperwork/PaperworkInterface';
import handlePaging from 'src/utils/handlePaging';
import { Paging } from 'src/Models/PagingInterface';

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
  },
});
