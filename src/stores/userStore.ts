import { db } from '../tursodb/index';
import { defineStore } from 'pinia';
import { AuthenticateRequestModel } from 'src/Models/Authentication/AuthenticateRequestModel';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import handleError from 'src/utils/handleError';
import { AuthenticateResponse } from 'src/Models/Authentication/AuthenticateResponse';
import { UserRole } from 'src/Models/UserRole';
import { ChangePasswordRequestModel } from 'src/Models/User/ChangePasswordRequestModel';
import { usersTable } from 'src/tursodb/schema';
import { eq, and } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      id: '',
      name: '',
      userName: '',
      email: '',
      systemRole: '',
      token: '',
    } as AuthenticateResponse;
  },
  getters: {
    IsAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(authenticateRequestModel: AuthenticateRequestModel): Promise<AuthenticateResponse | undefined> {
      try {
        const userData = await db
          .select()
          .from(usersTable)
          .where(and(eq(usersTable.userName, authenticateRequestModel.userName), eq(usersTable.isDeleted, 0)))
          .then((res) => res[0]);
        if (!userData) {
          throw new Error('User not found or deleted');
        }
        console.log('userData', userData);
        const isCorrectPassword = true; // await Bun.password.verify(authenticateRequestModel.password, userData.password);
        console.log('isCorrectPassword', isCorrectPassword);
        if (!isCorrectPassword) {
          throw new Error('Incorrect username or password');
        }
        // Generate JWT token
        const token = jwt.sign(
          {
            id: userData.id,
            userName: userData.userName,
            email: userData.email,
            systemRole: userData.systemRole,
          },
          process.env.JWT_SECRET!,
          { expiresIn: process.env.JWT_EXPIRE! }
        );
        console.log('token', token);

        const auRes: AuthenticateResponse = {
          id: userData.id,
          email: userData.email,
          systemRole: userData.systemRole,
          userName: userData.userName,
          token,
          name: userData.name,
        };

        this.$patch({
          id: auRes.id,
          userName: auRes.userName,
          email: auRes.email,
          systemRole: auRes.systemRole,
          token: auRes.token,
          name: auRes.name,
        });
        return auRes;
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
