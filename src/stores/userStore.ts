import { defineStore } from 'pinia';
import { AuthenticateRequestModel } from 'src/Models/Authentication/AuthenticateRequestModel';
import { api } from '../boot/axios';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import handleError from 'src/utils/handleError';
import { AuthenticateResponse } from 'src/Models/Authentication/AuthenticateResponse';
import { ChangePasswordRequestModel } from 'src/Models/User/ChangePasswordRequestModel';
import { useJwt } from '@vueuse/integrations/useJwt';
import { UserInfoInterface } from 'src/Models/UserInfoInterface';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: '',
      userInfo: {
        email: '',
        name: '',
        systemRole: '',
        userId: '',
        userName: '',
        selectedFileId: '',
        role: '',
      } as UserInfoInterface,
    };
  },
  getters: {
    IsAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(authenticateRequestModel: AuthenticateRequestModel): Promise<GenericResponseData | undefined> {
      try {
        const axiosResponse = await api.post(
          '/auth/login',
          {
            userName: authenticateRequestModel.userName,
            password: authenticateRequestModel.password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const responseData = (await axiosResponse.data) as GenericResponseData;
        const auRes = responseData.data as AuthenticateResponse;
        const decodedJwt = useJwt(auRes.token);
        const payload = decodedJwt.payload.value as UserInfoInterface;
        console.log('payload', payload);
        // extract jwt token and set it to local storage

        this.$patch({
          userInfo: {
            email: payload.email,
            systemRole: payload.systemRole,
            userName: payload.userName,
            userId: payload.userId,
            name: payload.name,
            selectedFileId: payload.selectedFileId,
            role: payload.role,
          },
          token: auRes.token,
        });
        return responseData;
      } catch (error: any) {
        this.$reset();
        handleError(error);
      }
    },
    async changePassword(changePasswordRequestModel: ChangePasswordRequestModel): Promise<GenericResponseData | undefined> {
      try {
        const axiosResponse = await api.post('/User/changepassword', changePasswordRequestModel, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
        });
        const responseData = (await axiosResponse.data) as GenericResponseData;
        return responseData;
      } catch (error: any) {
        this.$reset();
        handleError(error);
      }
    },
    logout() {
      this.$reset();
    },
  },
});
