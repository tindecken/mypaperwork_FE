import { defineStore } from 'pinia';
import { api } from '../boot/axios';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import handleError from 'src/utils/handleError';
import { useUserStore } from './userStore';
import { DownloadAttachmentRequestModel } from 'src/Models/Document/DownloadAttachmentRequestModel';
import { RemoveAttachmentRequestModel } from 'src/Models/Document/RemoveAttachmentRequestModel';
import { UploadDocumentsRequestModel } from 'src/Models/Document/UploadDocumentsequestModel';
import { SetCoverRequestModel } from 'src/Models/Document/SetCoverRequestModel';

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
      try {
        const axiosResponse = await api.delete('/documents/remove', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.token}`,
          },
          data: {
            paperworkId: body.paperworkId,
            documentId: body.documentId,
          },
        });
        const responseData = (await axiosResponse.data) as GenericResponseData;
        return responseData;
      } catch (error: any) {
        this.$reset();
        handleError(error);
      }
    },
    async uploadDocuments(model: UploadDocumentsRequestModel) {
      try {
        const promises = model.files.map(async (file: string) => {
          const formData = new FormData();
          formData.append('paperworkId', model.paperworkId);
          formData.append('file', file);
          return await api.post('/documents/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${userStore.token}`,
            },
          });
        });
        await Promise.all(promises);
      } catch (error: any) {
        handleError(error);
      }
    },
    async setCover(model: SetCoverRequestModel) {
      try {
        const axiosResponse = await api.post(
          '/documents/setCover',
          {
            paperworkId: model.paperworkId,
            documentId: model.documentId,
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
        handleError(error);
      }
    },
  },
});
