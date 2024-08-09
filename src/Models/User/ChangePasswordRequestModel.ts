export interface ChangePasswordRequestModel {
  UserId: number;
  CurrentPassword: string;
  NewPassword: string;
  ConfirmNewPassword: string;
}
