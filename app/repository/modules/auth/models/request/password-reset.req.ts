export type PasswordResetReq = { merchant_id: string; email_address: string };

export type PasswordResetConfirmReq = { token: string; password: string };
