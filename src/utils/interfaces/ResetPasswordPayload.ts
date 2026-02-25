export interface ResetPasswordPayload {
  email: string | null;
  token: string | null;
  password: string;
  confirmPassword: string;
}
