import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchViewerQuery } from '../api/queries.js';
import { logOutMutation, logInMutation } from '../api/mutations.js';
import { showAlert } from './alertReducer.js';

const initialState = {
    id: null,
    name: null,
    avatar: null
};

export const fetchViewer = createAsyncThunk(
    'user/fetchViewer',
    async (arg, thunkAPI) => {
        try {
            const response = await fetchViewerQuery();
            return response.viewer;
        }
        catch (err) {
            thunkAPI.dispatch(showAlert(err.message, 'danger'));
        }
    }
);

export const logIn = createAsyncThunk(
    'user/logIn',
    async (arg, thunkAPI) => {
        try {
            await logInMutation(arg.username, arg.password);
            location.reload();
        }
        catch (err) {
            thunkAPI.dispatch(showAlert(err.message, 'danger'));
        }
    }
);

export const logOut = createAsyncThunk(
    'user/logOut',
    async (arg, thunkAPI) => {
        try {
            await logOutMutation();
            location.reload();
        }
        catch (err) {
            thunkAPI.dispatch(showAlert(err.message, 'danger'));
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers: {
        [fetchViewer.fulfilled]: (state, action) => {
            state.id = action.payload?.id;
            state.name = action.payload?.name;
            state.avatar = action.payload?.avatar;
        }
    }
});

export default userSlice.reducer;