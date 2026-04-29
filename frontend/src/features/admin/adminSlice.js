import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
    users: [],
    agents: [],
    isLoading: false,
    isError: false,
    message: '',
};

// Get all users (Admin only)
// Note: We need to implement a backend route for this if it doesn't exist, 
// for now let's assume we can fetch users.
export const getAllUsers = createAsyncThunk('admin/getUsers', async (_, thunkAPI) => {
    try {
        const response = await api.get('/auth/users');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const deleteUser = createAsyncThunk('admin/deleteUser', async (id, thunkAPI) => {
    try {
        await api.delete(`/auth/users/${id}`);
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                const userData = action.payload.data || action.payload;
                state.users = Array.isArray(userData) ? userData : [];
                state.agents = state.users.filter(u => u.role === 'agent');
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(u => u._id !== action.payload);
                state.agents = state.users.filter(u => u.role === 'agent');
            });
    }
});

export const { reset } = adminSlice.actions;
export default adminSlice.reducer;
