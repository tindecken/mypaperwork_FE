import { defineStore } from 'pinia';
import { AuthenticateRequestModel } from 'src/Models/Authentication/AuthenticateRequestModel';
import { api } from 'boot/axios';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import handleError from 'src/utils/handleError';
import { AuthenticateResponse } from 'src/Models/Authentication/AuthenticateResponse';
import { UserRole } from 'src/Models/UserRole';
import { ChangePasswordRequestModel } from 'src/Models/User/ChangePasswordRequestModel';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      Id: 0,
      UserName: '',
      Email: '',
      Role: null as UserRole | null,
      Token: '',
    };
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
          '/Authentication/login',
          {
            Username: authenticateRequestModel.Username,
            Password: authenticateRequestModel.Password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const responseData = (await axiosResponse.data) as GenericResponseData;
        const auRes = responseData.Data as AuthenticateResponse;
        this.$patch({
          Id: auRes.Id,
          UserName: auRes.UserName,
          Email: auRes.Email,
          Role: auRes.Role,
          Token: auRes.Token,
        });
        return responseData;
      } catch (error: unknown) {
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
      } catch (error: unknown) {
        this.$reset();
        handleError(error);
      }
    },
    logout() {
      this.$reset();
    },
  },
});
