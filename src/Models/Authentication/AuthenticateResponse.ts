import { UserRole } from '../UserRole';

export interface AuthenticateResponse {
  id: string;
  email: string;
  systemRole: string;
  userName: string;
  token: string;
  name: string;
}
