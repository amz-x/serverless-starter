

export type Exception = Error | string | number | unknown;

export interface AuthSignUp {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface User {
  id?: string;
  name: string;
  surname: string;
  email: string;
}
