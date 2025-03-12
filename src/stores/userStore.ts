import { defineStore } from 'pinia';
import { AuthenticateRequestModel } from 'src/Models/Authentication/AuthenticateRequestModel';
import { api } from '../boot/axios';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import handleError from 'src/utils/handleError';
import { AuthenticateResponse } from 'src/Models/Authentication/AuthenticateResponse';
import { ChangePasswordRequestModel } from 'src/Models/User/ChangePasswordRequestModel';
import { useJwt } from '@vueuse/integrations/useJwt';
import { UserInfoInterface } from 'src/Models/UserInfoInterface';
import { authClient } from 'src/utils/auth-client';

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
            email: authenticateRequestModel.email,
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
        const axiosResponse = await api.post('/auth/changepassword', changePasswordRequestModel, {
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
    async loginWithBetterAuth(authenticateRequestModel: AuthenticateRequestModel): Promise<GenericResponseData | undefined> {
      try {
        // Use authClient to authenticate
        const response = await authClient.signIn.email({
          email: authenticateRequestModel.email,
          password: authenticateRequestModel.password,
        });
        console.log('authenticateRequestModel: ', authenticateRequestModel);
        console.log('response:', response);
        if (response.error) {
          throw new Error(response.error.message || 'Authentication failed');
        }

        // Extract token and user info from the response
        const token = response.data?.token;
        const userInfo = response.data?.user;

        if (!token || !userInfo) {
          throw new Error('Invalid response from authentication server');
        }

        // // Update the store state
        // this.$patch({
        //   userInfo: {
        //     email: userInfo.email,
        //     name: userInfo.name,
        //     systemRole: userInfo.systemRole,
        //     userId: userInfo.userId,
        //     userName: userInfo.userName,
        //     selectedFileId: userInfo.selectedFileId,
        //     role: userInfo.role,
        //   },
        //   token: token,
        // });

        // Return a GenericResponseData object for consistency
        return {
          success: true,
          message: 'Login successful',
          data: {
            token: token,
            user: userInfo,
          },
        };
      } catch (error: any) {
        this.$reset();
        handleError(error);
        return {
          success: false,
          message: error.message || 'Login failed',
          // data: null,
        };
      }
    },
  },
});
