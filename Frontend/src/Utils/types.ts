export interface UserType {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  creadtedAt: string;
  updatedAt: string;
}

export interface AuthFormType {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  oauth?: boolean;
}

