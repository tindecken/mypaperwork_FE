export interface UserInfoInterface {
  email: string;
  exp: number;
  iat: number;
  maxEpx: number;
  name: string;
  role: string | null;
  selectedFileId: string | null;
  systemRole: string;
  userId: string;
  userName: string;
}
