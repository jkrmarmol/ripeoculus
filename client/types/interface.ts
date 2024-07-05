import { ReduxStatus } from './types';

export interface IUsers {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthenticationInitialState {
  authProtected: {
    response: {
      message: string;
      statusCode?: string;
    };
    status: ReduxStatus;
  };
  loginInput: {
    email: string;
    password: string;
  };
  registerInput: {
    email: string;
    password: string;
  };
  authLogin: {
    response: {
      accessToken?: string;
      message?: string;
      error?: string;
      statusCode: number;
    };
    status: ReduxStatus;
  };
  authRegister: {
    response:
      | {
          message?: string;
          error?: string;
          statusCode?: number;
        }
      | IUsers;
    status: ReduxStatus;
  };
}

export interface Ripe {
  id: string;
  images: string;
  response: string;
  usersId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRipeInitialState {
  ripeValidate: {
    response: {
      recommendation: string;
      name?: string;
      ripeNess?: string;
      statusCode?: number;
      message?: string;
      images?: string;
    };
    status: ReduxStatus;
  };
  findAllRipe: {
    response: Array<Ripe>;
    status: ReduxStatus;
  };
}

export interface IProfileInitialState {
  findEmail: {
    response: {
      id: string;
      email: string;
    };
    status: ReduxStatus;
  };
  changePasswordInput: {
    currentPassword: string;
    newPassword: string;
  };
  changePassword: {
    response: IUsers | { message?: string; error?: string; statusCode?: number };
    status: ReduxStatus;
  };
}
