import { UserRole } from '../UserRole';

export interface AuthenticateResponse {
  id: string;
  email: string;
  systemRole: UserRole;
  userName: string;
  token: string;
  name: string;
}
