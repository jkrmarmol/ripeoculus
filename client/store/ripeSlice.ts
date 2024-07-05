import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from './axios';
import { IRipeInitialState } from '@/types/interface';
import { AxiosError } from 'axios';

export const ripeValidate = createAsyncThunk('ripe/validate', async (uri: string | Blob) => {
  let formData = new FormData();

  if (typeof uri === 'string' && uri.startsWith('data:')) {
    const base64Data = uri.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });

    formData.append('file', blob, 'image.png');
  } else {
    formData.append('file', uri);
  }

  const response = await axios.post('/ripe', formData, {
    headers: {
      Authorization: `Bearer ${await localStorage.getItem('token')}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
});

export const findAllRipe = createAsyncThunk('ripe/findAll', async () => {
  try {
    const response = await axios.get('/ripe', {
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

let initialState: IRipeInitialState = {
  ripeValidate: {
    response: {
      name: undefined,
      ripeNess: undefined,
      images: '',
      statusCode: undefined,
      message: undefined,
      recommendation: ''
    },
    status: null
  },
  findAllRipe: {
    response: [],
    status: null
  }
};

export const ripeSlice = createSlice({
  name: 'ripe',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ripeValidate.pending, (state, action) => {
        state.ripeValidate.status = 'loading';
      })
      .addCase(ripeValidate.fulfilled, (state, { payload }: any) => {
        state.ripeValidate.status = 'ok';
        state.ripeValidate.response = payload;
      })
      .addCase(ripeValidate.rejected, (state, action) => {
        state.ripeValidate.status = 'failed';
      })
      .addCase(findAllRipe.pending, (state, action) => {
        state.findAllRipe.status = 'loading';
      })
      .addCase(findAllRipe.fulfilled, (state, { payload }: any) => {
        state.findAllRipe.status = 'ok';
        state.findAllRipe.response = payload;
      })
      .addCase(findAllRipe.rejected, (state, action) => {
        state.findAllRipe.status = 'failed';
      });
  }
});

export default ripeSlice.reducer;
