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
import { DownloadAttachmentRequestModel } from 'src/Models/Document/DownloadAttachmentRequestModel';
import { RemoveAttachmentRequestModel } from 'src/Models/Document/RemoveAttachmentRequestModel';

const userStore = useUserStore();
export const useDocumentStore = defineStore('document', {
  state: () => {
    return {};
  },
  actions: {
    async downloadAttachment(body: DownloadAttachmentRequestModel): Promise<GenericResponseData | undefined> {
      try {
        const axiosResponse = await api.post(
          '/documents/download',
          {
            paperworkId: body.paperworkId,
            documentId: body.documentId,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.token}`,
            },
          }
        );
        const responseData = (await axiosResponse.data) as GenericResponseData;
        return responseData;
      } catch (error: any) {
        this.$reset();
        handleError(error);
      }
    },
    async removeAttachment(body: RemoveAttachmentRequestModel): Promise<GenericResponseData | undefined> {
      console.log('body', body);
      console.log('userStore.token', userStore.token);
      try {
        const axiosResponse = await api.delete(
          '/documents/remove',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userStore.token}`,
            },
            data: {
              paperworkId: body.paperworkId,
              documentId: body.documentId,
            }
          },

        );
        const responseData = (await axiosResponse.data) as GenericResponseData;
        return responseData;
      } catch (error: any) {
        this.$reset();
        handleError(error);
      }
    },
  },
});
