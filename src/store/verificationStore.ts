type VerificationData = {
  code: string;
  expiresAt: number;
};

export const verificationStore: { [email: string]: VerificationData } = {};
