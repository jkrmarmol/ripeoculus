import { IAuthenticationInitialState } from '@/types/interface';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from '../axios';
import { AxiosError } from 'axios';

export const authLogin = createAsyncThunk('auth/login', async (data: { email: string; password: string }) => {
  try {
    const response = await axios.post('/auth/signin', data);
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      return err.response?.data;
    }
  }
});

export const authRegister = createAsyncThunk('auth/register', async (data: { email: string; password: string }) => {
  try {
    const response = await axios.post('/auth/signup', data);
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      return err.response?.data;
    }
  }
});

export const authProtected = createAsyncThunk('auth/protected', async () => {
  try {
    const response = await axios.get('/auth/protected', {
      headers: {
        Authorization: `Bearer ${await localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      return err.response?.data;
    }
  }
});

let initialState: IAuthenticationInitialState = {
  loginInput: {
    email: '',
    password: ''
  },
  authLogin: {
    response: {
      accessToken: undefined,
      message: undefined,
      error: undefined,
      statusCode: 0
    },
    status: null
  },
  authRegister: {
    response: {
      message: undefined,
      error: undefined,
      statusCode: undefined
    },
    status: null
  },
  registerInput: {
    email: '',
    password: ''
  },
  authProtected: {
    response: {
      message: '',
      statusCode: undefined
    },
    status: null
  }
};

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setLoginInputEmail: (state, action: PayloadAction<string>) => {
      state.loginInput.email = action.payload;
    },
    setLoginInputPassword: (state, action: PayloadAction<string>) => {
      state.loginInput.password = action.payload;
    },
    cleanUpLoginInput: (state) => {
      state.loginInput = { email: '', password: '' };
    },
    setRegisterInputEmail: (state, action: PayloadAction<string>) => {
      state.registerInput.email = action.payload;
    },
    setRegisterInputPassword: (state, action: PayloadAction<string>) => {
      state.registerInput.password = action.payload;
    },
    cleanUpRegisterInput: (state) => {
      state.registerInput = { email: '', password: '' };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(authLogin.pending, (state, action) => {
        state.authLogin.status = 'loading';
      })
      .addCase(authLogin.fulfilled, (state, { payload }: any) => {
        state.authLogin.status = 'ok';
        state.authLogin.response = payload;
      })
      .addCase(authLogin.rejected, (state, action) => {
        state.authLogin.status = 'failed';
      })
      .addCase(authRegister.pending, (state, action) => {
        state.authRegister.status = 'loading';
      })
      .addCase(authRegister.fulfilled, (state, { payload }: any) => {
        state.authRegister.status = 'ok';
        state.authRegister.response = payload;
      })
      .addCase(authRegister.rejected, (state, action) => {
        state.authRegister.status = 'failed';
      })
      .addCase(authProtected.pending, (state, action) => {
        state.authProtected.status = 'loading';
      })
      .addCase(authProtected.fulfilled, (state, { payload }: any) => {
        state.authProtected.status = 'ok';
        state.authProtected.response = payload;
      })
      .addCase(authProtected.rejected, (state, action) => {
        state.authProtected.status = 'failed';
      });
  }
});

export const { setLoginInputEmail, setLoginInputPassword, cleanUpLoginInput, setRegisterInputEmail, setRegisterInputPassword, cleanUpRegisterInput } = authenticationSlice.actions;
export default authenticationSlice.reducer;
