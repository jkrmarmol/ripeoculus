import { IProfileInitialState } from '@/types/interface';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from './axios';
import { AxiosError } from 'axios';

export const findEmail = createAsyncThunk('profile/findEmail', async () => {
  try {
    const response = await axios.get('/profile', {
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

export const changePassword = createAsyncThunk('profile/changePassword', async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
  try {
    const response = await axios.put(
      '/profile/password',
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${await localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      return err.response?.data;
    }
  }
});

let initialState: IProfileInitialState = {
  findEmail: {
    response: {
      id: '',
      email: ''
    },
    status: null
  },
  changePasswordInput: {
    currentPassword: '',
    newPassword: ''
  },
  changePassword: {
    response: {},
    status: null
  }
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setChangePassCurrentPassword: (state, action: PayloadAction<string>) => {
      state.changePasswordInput.currentPassword = action.payload;
    },
    setChangePassNewPassword: (state, action: PayloadAction<string>) => {
      state.changePasswordInput.newPassword = action.payload;
    },
    cleanUpChangePasswordInput: (state) => {
      state.changePasswordInput = { newPassword: '', currentPassword: '' };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(findEmail.pending, (state, action) => {
        state.findEmail.status = 'loading';
      })
      .addCase(findEmail.fulfilled, (state, { payload }: any) => {
        state.findEmail.status = 'ok';
        state.findEmail.response = payload;
      })
      .addCase(findEmail.rejected, (state, action) => {
        state.findEmail.status = 'failed';
      })
      .addCase(changePassword.pending, (state, action) => {
        state.changePassword.status = 'loading';
      })
      .addCase(changePassword.fulfilled, (state, { payload }: any) => {
        state.changePassword.status = 'ok';
        state.changePassword.response = payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changePassword.status = 'failed';
      });
  }
});

export const { setChangePassCurrentPassword, setChangePassNewPassword, cleanUpChangePasswordInput } = profileSlice.actions;
export default profileSlice.reducer;
