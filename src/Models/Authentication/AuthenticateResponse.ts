import { UserRole } from '../UserRole';

export interface AuthenticateResponse {
  Id: number;
  Email: string;
  Role?: UserRole;
  UserName: string;
  Token: string;
}
