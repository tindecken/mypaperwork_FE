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
import { RegisterRequestModel } from 'src/Models/Authentication/RegisterRequestModel';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: '',
      userInfo: {
        email: '',
        name: '',
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
    async logout() {
      await authClient.signOut();
      this.$reset();
    },
    async loginByEmailPassword(authenticateRequestModel: AuthenticateRequestModel): Promise<GenericResponseData | undefined> {
      try {
        // Use authClient to authenticate
        const response = await authClient.signIn.email({
          email: authenticateRequestModel.email,
          password: authenticateRequestModel.password,
        });
        if (response.error) {
          throw new Error(response.error.message || 'Authentication failed');
        }
        console.log('response: ', response);
        // Extract token and user info from the response
        const token = response.data?.token;
        const userInfo = response.data?.user;
        console.log('userInfo', userInfo);
        if (!token || !userInfo) {
          throw new Error('Invalid response from authentication server');
        }
        // call api to get selectedFileId and role
        let selectedFileId = null;
        let role = null;
        const responseSelectedFileId = await api.get('/files/getSelectedFile', {
          withCredentials: true,
        });
        console.log('responseSelectedFileId', responseSelectedFileId);
        if (responseSelectedFileId.status === 200 && responseSelectedFileId.data.data != null) {
          selectedFileId = responseSelectedFileId.data.data.fileId;
          role = responseSelectedFileId.data.data.role;
        } // Update the store state
        this.$patch({
          userInfo: {
            email: userInfo.email,
            name: userInfo.name,
            userId: userInfo.id,
            userName: userInfo.name,
            selectedFileId: selectedFileId,
            role: role,
          },
          token: token,
        });

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
    async register(registerRequestModel: RegisterRequestModel): Promise<GenericResponseData | undefined> {
      try {
        // Use authClient to authenticate
        const response = await authClient.signUp.email({
          name: registerRequestModel.name,
          email: registerRequestModel.email,
          password: registerRequestModel.password,
        });
        if (response.error) {
          throw new Error(response.error.message || 'Register failed');
        }
        console.log('response: ', response);
        // Extract token and user info from the response
        const token = response.data?.token;
        console.log('token', token);
        const userInfo = response.data?.user;
        console.log('userInfo', userInfo);
        if (!token || !userInfo) {
          throw new Error('Invalid response from registration server');
        }
        this.$patch({
          userInfo: {
            email: userInfo.email,
            name: userInfo.name,
            userId: userInfo.id,
            userName: userInfo.name,
            selectedFileId: '',
            role: '',
          },
          token: token,
        });
        // Return a GenericResponseData object for consistency
        return {
          success: true,
          message: 'Register successful',
        };
      } catch (error: any) {
        this.$reset();
        handleError(error);
        return {
          success: false,
          message: error.message || 'Register failed',
        };
      }
    },
    async loginWithGoogle(): Promise<GenericResponseData | undefined> {
      try {
        // Use authClient to authenticate
        const response = await authClient.signIn.social({
          provider: 'google',
          callbackURL: 'http://localhost:1000',
        });
        if (response.error) {
          throw new Error(response.error.message || 'Register failed');
        }
        // get token and user info from response
        const sessions = await authClient.getSession();

        console.log('sessions', sessions);
        console.log('response: ', response);
        localStorage.setItem(
          'global',
          JSON.stringify({
            response: response,
            sessions: sessions,
          })
        );
        // // Extract token and user info from the response
        // const token = response.data?.token;
        // console.log('token', token);
        // const userInfo = response.data?.user;
        // console.log('userInfo', userInfo);
        // if (!token || !userInfo) {
        //   throw new Error('Invalid response from registration server');
        // }
        // this.$patch({
        //   userInfo: {
        //     email: userInfo.email,
        //     name: userInfo.name,
        //     userId: userInfo.id,
        //     userName: userInfo.name,
        //     selectedFileId: '',
        //     role: '',
        //   },
        //   token: token,
        // });
        // Return a GenericResponseData object for consistency
        return {
          success: true,
          message: 'Login successful',
        };
      } catch (error: any) {
        this.$reset();
        handleError(error);
        return {
          success: false,
          message: error.message || 'Login failed',
        };
      }
    },
  },
});
