import { defineStore } from 'pinia';
import { AuthenticateRequestModel } from 'src/Models/Authentication/AuthenticateRequestModel';
import { api } from '../boot/axios';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import handleError from 'src/utils/handleError';
import { AuthenticateResponse } from 'src/Models/Authentication/AuthenticateResponse';
import { ChangePasswordRequestModel } from 'src/Models/User/ChangePasswordRequestModel';
import { useJwt } from '@vueuse/integrations/useJwt';
import { UserInfoInterface } from 'src/Models/UserInfoInterface';
import { useUserStore } from './userStore';
import { FilesTable } from 'src/Models/File/FilesTable';

const userStore = useUserStore();
export const useFileStore = defineStore('file', {
  state: () => {
    return {
      selectedFile: null as FilesTable | null,
      files: [] as FilesTable[],
    };
  },
  getters: {},
  actions: {
    async getAssociatedFiles(): Promise<GenericResponseData | undefined> {
      try {
        const axiosResponse = await api.get('/files/getFiles', {
          withCredentials: true,
        });
        const responseData = (await axiosResponse.data) as GenericResponseData;
        this.$patch({
          files: responseData.data as FilesTable[],
        });
        return responseData;
      } catch (error: any) {
        this.$reset();
        handleError(error);
      }
    },
    async createNewFile(body: any): Promise<GenericResponseData | undefined> {
      try {
        const axiosResponse = await api.post('/files/create', body, {
          withCredentials: true,
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
