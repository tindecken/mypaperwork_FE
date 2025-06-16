import { defineStore } from 'pinia';
import { AuthenticateRequestModel } from 'src/Models/Authentication/AuthenticateRequestModel';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import handleError from 'src/utils/handleError';
import { UserInfoInterface } from 'src/Models/UserInfoInterface';
import { authClient } from 'src/utils/auth-client';
import { RegisterRequestModel } from 'src/Models/Authentication/RegisterRequestModel';
import { api } from 'src/boot/axios';
import { ChangePasswordRequestModel } from 'src/Models/User/ChangePasswordRequestModel';
import { SetPasswordRequestModel } from 'src/Models/User/SetPasswordRequestModel';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userInfo: {
        email: '',
        name: '',
        id: '',
        role: '',
        isExistingPassword: false,
      } as UserInfoInterface,
    };
  },
  actions: {
    async logout() {
      await authClient.signOut();
      this.$reset();
    },
    async loginByEmailPassword(authenticateRequestModel: AuthenticateRequestModel): Promise<GenericResponseData | undefined> {
      try {
        const response = await authClient.signIn.email({
          email: authenticateRequestModel.email,
          password: authenticateRequestModel.password,
        });
        if (response.error) {
          throw new Error(response.error.message || 'Authentication failed');
        }
        const userResponse = response.data?.user;
        if (!userResponse) {
          throw new Error('Invalid response from authentication server');
        }

        // Create a proper UserInfoInterface object with explicit mapping and default values
        const userInfo: UserInfoInterface = {
          email: userResponse.email,
          name: userResponse.name,
          id: userResponse.id,
          role: null, // Set default value since role doesn't exist in the response
          isExistingPassword: true,
        };

        this.$patch({
          userInfo: userInfo,
        });

        // Return a GenericResponseData object for consistency
        return {
          success: true,
          message: 'Login successful',
          data: {
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
        const userInfo = response.data?.user;
        if (!userInfo) {
          throw new Error('Invalid response from registration server');
        }
        this.$patch({
          userInfo: {
            email: userInfo.email,
            name: userInfo.name,
            id: userInfo.id,
            role: '',
            isExistingPassword: false
          },
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
    async checkexistingpassword() {
      try {
        const axiosResponse = await api.get('/users/checkexistingpassword', {
          withCredentials: true,
        })
        const responseData = (await axiosResponse.data) as GenericResponseData;
        // Safely extract login method from response data
        this.userInfo.isExistingPassword = responseData.data as boolean;
        return responseData;
      } catch (error: any) {
        handleError(error);
      }
    },
    async changePassword(model: ChangePasswordRequestModel) {
      try {
        await authClient.changePassword({
          currentPassword: model.currentPassword,
          newPassword: model.newPassword,
          revokeOtherSessions: false, // revoke all other sessions the user is signed into
        });
      } catch (error: any) {
        handleError(error);
      }
    },
    async setPassword(model: SetPasswordRequestModel) {
      try {
        const axiosResponse = await api.post('/users/setpassword', model, {
          withCredentials: true,
        })
        const responseData = (await axiosResponse.data) as GenericResponseData;
        // Safely extract login method from response data
        this.userInfo.isExistingPassword = true;
        return responseData;
      } catch (error: any) {
        handleError(error);
      }
    }
  },
});
