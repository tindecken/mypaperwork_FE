import { defineStore } from 'pinia';
import { AuthenticateRequestModel } from 'src/Models/Authentication/AuthenticateRequestModel';
import { api } from '../boot/axios';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import handleError from 'src/utils/handleError';
import { AuthenticateResponse } from 'src/Models/Authentication/AuthenticateResponse';
import { UserRole } from 'src/Models/UserRole';
import { ChangePasswordRequestModel } from 'src/Models/User/ChangePasswordRequestModel';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      id: '',
      name: '',
      userName: '',
      email: '',
      systemRole: null as UserRole | null,
      token: '',
    } as AuthenticateResponse;
  },
  getters: {
    IsAuthenticated: (state) => !!state.Token,
  },
  actions: {
    async login(
      authenticateRequestModel: AuthenticateRequestModel
    ): Promise<GenericResponseData | undefined> {
      try {
        const axiosResponse = await api.post(
          '/authentication/login',
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
        this.$patch({
          id: auRes.id,
          userName: auRes.userName,
          email: auRes.email,
          systemRole: auRes.systemRole,
          token: auRes.token,
          name: auRes.name,
        });
        return responseData;
      } catch (error: any) {
        this.$reset();
        handleError(error);
      }
    },
    async changePassword(
      changePasswordRequestModel: ChangePasswordRequestModel
    ): Promise<GenericResponseData | undefined> {
      try {
        const axiosResponse = await api.post(
          '/User/changepassword',
          changePasswordRequestModel,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.Token}`,
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
    logout() {
      this.$reset();
    },
  },
});
